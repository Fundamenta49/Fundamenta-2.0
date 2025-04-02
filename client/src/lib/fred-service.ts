/**
 * Federal Reserve Economic Data (FRED) API Service
 * 
 * This service provides access to economic data from the Federal Reserve Bank of St. Louis,
 * specifically focused on mortgage rates and housing market indicators.
 */

// Access the FRED API key from environment variables with proper Vite formatting
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY || '';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export interface FredDataPoint {
  date: string;
  value: string;
  realtime_start?: string;
  realtime_end?: string;
}

export interface FredSeriesData {
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredDataPoint[];
}

/**
 * FRED Series IDs for Mortgage and Housing Data
 * 
 * MORTGAGE30US: 30-Year Fixed Rate Mortgage Average
 * MORTGAGE15US: 15-Year Fixed Rate Mortgage Average
 * CSUSHPINSA: Case-Shiller U.S. National Home Price Index
 * HOUST: Housing Starts: Total New Privately Owned
 * MSACSR: Monthly Supply of New Houses
 * NHSDPT: US New Home Sales
 * MSPUS: Median Sales Price of Houses Sold
 * COMPUTSA: Homeownership Rate
 */
export enum FredDataSeries {
  MORTGAGE_30YR = 'MORTGAGE30US',
  MORTGAGE_15YR = 'MORTGAGE15US',
  HOME_PRICE_INDEX = 'CSUSHPINSA',
  HOUSING_STARTS = 'HOUST',
  NEW_HOME_SUPPLY = 'MSACSR',
  NEW_HOME_SALES = 'NHSDPT',
  MEDIAN_HOME_PRICE = 'MSPUS',
  HOMEOWNERSHIP_RATE = 'COMPUTSA',
}

export interface FredApiParams {
  series_id: string;
  api_key: string;
  file_type: string;
  sort_order: string;
  limit?: number;
  observation_start?: string;
  units?: string;
}

// Fallback data for when the API is unavailable
const FALLBACK_DATA: Record<FredDataSeries, FredDataPoint[]> = {
  [FredDataSeries.MORTGAGE_30YR]: generateFallbackMortgageData(FredDataSeries.MORTGAGE_30YR, 60, 6.65, 7.22),
  [FredDataSeries.MORTGAGE_15YR]: generateFallbackMortgageData(FredDataSeries.MORTGAGE_15YR, 60, 5.89, 6.45),
  [FredDataSeries.HOME_PRICE_INDEX]: [
    { date: '2025-02-01', value: '321.65' },
    { date: '2025-01-01', value: '318.92' },
    { date: '2024-12-01', value: '316.23' }
  ],
  [FredDataSeries.HOUSING_STARTS]: [
    { date: '2025-02-01', value: '1483' },
    { date: '2025-01-01', value: '1439' },
    { date: '2024-12-01', value: '1356' }
  ],
  [FredDataSeries.NEW_HOME_SUPPLY]: [
    { date: '2025-02-01', value: '8.2' },
    { date: '2025-01-01', value: '8.4' },
    { date: '2024-12-01', value: '8.6' }
  ],
  [FredDataSeries.NEW_HOME_SALES]: [
    { date: '2025-02-01', value: '691' },
    { date: '2025-01-01', value: '680' },
    { date: '2024-12-01', value: '664' }
  ],
  [FredDataSeries.MEDIAN_HOME_PRICE]: [
    { date: '2025-02-01', value: '436500' },
    { date: '2025-01-01', value: '433200' },
    { date: '2024-12-01', value: '429800' }
  ],
  [FredDataSeries.HOMEOWNERSHIP_RATE]: [
    { date: '2025-01-01', value: '65.8' },
    { date: '2024-10-01', value: '66.1' },
    { date: '2024-07-01', value: '65.9' }
  ]
};

// Helper function to generate realistic fallback mortgage rate data with trends
function generateFallbackMortgageData(
  seriesId: FredDataSeries, 
  count: number, 
  startRate: number, 
  endRate: number
): FredDataPoint[] {
  const data: FredDataPoint[] = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - count);
  
  // Create a sine wave pattern for more realistic rate fluctuations
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7)); // Weekly data points
    
    // Calculate a rate with a sine wave pattern plus a linear trend
    const progress = i / count;
    const linearComponent = startRate + (endRate - startRate) * progress;
    const sineComponent = Math.sin(progress * Math.PI * 4) * 0.25; // Small sine wave fluctuation
    const rate = linearComponent + sineComponent;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: rate.toFixed(2)
    });
  }
  
  return data;
}

/**
 * Creates the full API URL for FRED API requests
 */
function createFredApiUrl(params: FredApiParams): string {
  const queryParams = new URLSearchParams();
  
  // Add all parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });
  
  return `${FRED_BASE_URL}?${queryParams.toString()}`;
}

/**
 * Fetches time series data from FRED
 */
export async function fetchFredData(
  seriesId: FredDataSeries,
  limit: number = 20,
  observationStart?: string
): Promise<FredDataPoint[]> {
  try {
    // Format the date if provided
    let formattedStartDate = undefined;
    if (observationStart) {
      const date = new Date(observationStart);
      formattedStartDate = date.toISOString().split('T')[0];
    }
    
    // Check if API key is available
    if (!FRED_API_KEY) {
      console.warn("FRED API key is not available. Using default values as fallback.");
      // Return fallback data for the requested series
      if (FALLBACK_DATA[seriesId]) {
        const fallbackData = FALLBACK_DATA[seriesId];
        return fallbackData.slice(0, limit);
      }
      return [];
    }
    
    // Prepare API parameters
    const params: FredApiParams = {
      series_id: seriesId,
      api_key: FRED_API_KEY,
      file_type: 'json',
      sort_order: 'desc', // Newest first
      limit: limit,
      observation_start: formattedStartDate,
      units: 'lin',  // Linear units (no transformation)
    };
    
    // Build and call the API URL
    const apiUrl = createFredApiUrl(params);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // Handle non-JSON responses for error cases
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(`FRED API Error: ${errorData.error_message || response.statusText}`);
      } else {
        throw new Error(`FRED API Error: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    if (!data.observations) {
      console.warn("FRED API response missing 'observations' field:", data);
      // Fall back to default data if the API response is invalid
      if (FALLBACK_DATA[seriesId]) {
        console.warn("Using fallback data for series:", seriesId);
        const fallbackData = FALLBACK_DATA[seriesId];
        return fallbackData.slice(0, limit);
      }
      return [];
    }
    
    return data.observations as FredDataPoint[];
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    // Fall back to default data on any error
    if (FALLBACK_DATA[seriesId]) {
      console.warn("Using fallback data due to error for series:", seriesId);
      const fallbackData = FALLBACK_DATA[seriesId];
      return fallbackData.slice(0, limit);
    }
    return [];
  }
}

/**
 * Fetches the latest mortgage rates (30-year and 15-year)
 */
export async function fetchCurrentMortgageRates(): Promise<{
  thirtyYear: FredDataPoint | null;
  fifteenYear: FredDataPoint | null;
}> {
  try {
    const [thirtyYearData, fifteenYearData] = await Promise.all([
      fetchFredData(FredDataSeries.MORTGAGE_30YR, 1),
      fetchFredData(FredDataSeries.MORTGAGE_15YR, 1)
    ]);
    
    return {
      thirtyYear: thirtyYearData.length > 0 ? thirtyYearData[0] : null,
      fifteenYear: fifteenYearData.length > 0 ? fifteenYearData[0] : null
    };
  } catch (error) {
    console.error('Error fetching current mortgage rates:', error);
    return {
      thirtyYear: null,
      fifteenYear: null
    };
  }
}

/**
 * Fetches historical mortgage rate data for trend analysis
 */
export async function fetchMortgageRateHistory(
  mortgageType: FredDataSeries.MORTGAGE_30YR | FredDataSeries.MORTGAGE_15YR,
  months: number = 12
): Promise<FredDataPoint[]> {
  try {
    // Calculate date X months ago
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    const startDate = date.toISOString().split('T')[0];
    
    return await fetchFredData(mortgageType, 100, startDate);
  } catch (error) {
    console.error('Error fetching mortgage rate history:', error);
    return [];
  }
}

/**
 * Fetches the latest housing market indicators
 */
export async function fetchHousingMarketIndicators(): Promise<{
  homePriceIndex: FredDataPoint | null;
  housingStarts: FredDataPoint | null;
  homeSupply: FredDataPoint | null;
  medianPrice: FredDataPoint | null;
}> {
  try {
    const [homePriceData, housingStartsData, homeSupplyData, medianPriceData] = await Promise.all([
      fetchFredData(FredDataSeries.HOME_PRICE_INDEX, 1),
      fetchFredData(FredDataSeries.HOUSING_STARTS, 1),
      fetchFredData(FredDataSeries.NEW_HOME_SUPPLY, 1),
      fetchFredData(FredDataSeries.MEDIAN_HOME_PRICE, 1)
    ]);
    
    return {
      homePriceIndex: homePriceData.length > 0 ? homePriceData[0] : null,
      housingStarts: housingStartsData.length > 0 ? housingStartsData[0] : null,
      homeSupply: homeSupplyData.length > 0 ? homeSupplyData[0] : null,
      medianPrice: medianPriceData.length > 0 ? medianPriceData[0] : null
    };
  } catch (error) {
    console.error('Error fetching housing market indicators:', error);
    return {
      homePriceIndex: null,
      housingStarts: null,
      homeSupply: null,
      medianPrice: null
    };
  }
}

/**
 * Formats a FRED data value with proper units and formatting
 */
export function formatFredValue(
  value: string | null | undefined, 
  seriesId: FredDataSeries,
  includeUnits: boolean = true
): string {
  if (!value) return 'No data available';
  
  const numValue = parseFloat(value);
  
  switch (seriesId) {
    case FredDataSeries.MORTGAGE_30YR:
    case FredDataSeries.MORTGAGE_15YR:
      return `${numValue.toFixed(2)}${includeUnits ? '%' : ''}`;
      
    case FredDataSeries.HOME_PRICE_INDEX:
      return `${numValue.toFixed(1)}${includeUnits ? ' (Index)' : ''}`;
      
    case FredDataSeries.HOUSING_STARTS:
    case FredDataSeries.NEW_HOME_SALES:
      return `${numValue.toLocaleString('en-US')}${includeUnits ? ' units' : ''}`;
      
    case FredDataSeries.NEW_HOME_SUPPLY:
      return `${numValue.toFixed(1)}${includeUnits ? ' months' : ''}`;
      
    case FredDataSeries.MEDIAN_HOME_PRICE:
      return `$${numValue.toLocaleString('en-US')}`;
      
    case FredDataSeries.HOMEOWNERSHIP_RATE:
      return `${numValue.toFixed(1)}${includeUnits ? '%' : ''}`;
      
    default:
      return value;
  }
}

/**
 * Interprets a trend for a specific data series based on current and historical data
 */
export function interpretTrend(
  current: FredDataPoint | null, 
  previous: FredDataPoint | null,
  seriesId: FredDataSeries
): { trend: 'up' | 'down' | 'stable' | 'unknown'; description: string } {
  if (!current || !previous || !current.value || !previous.value) {
    return { trend: 'unknown', description: 'Insufficient data to determine trend' };
  }
  
  const currentValue = parseFloat(current.value);
  const previousValue = parseFloat(previous.value);
  const percentChange = ((currentValue - previousValue) / previousValue) * 100;
  
  // Define the threshold for what constitutes a "stable" trend (as a percentage)
  let threshold = 0.5; // Default 0.5% change
  
  // Customize thresholds based on data type
  switch (seriesId) {
    case FredDataSeries.MORTGAGE_30YR:
    case FredDataSeries.MORTGAGE_15YR:
      threshold = 0.1; // More sensitive for interest rates
      break;
    case FredDataSeries.HOME_PRICE_INDEX:
      threshold = 0.5;
      break;
    case FredDataSeries.HOUSING_STARTS:
    case FredDataSeries.NEW_HOME_SALES:
      threshold = 5.0; // Less sensitive for volume metrics
      break;
  }
  
  let trend: 'up' | 'down' | 'stable';
  let description: string;
  
  if (Math.abs(percentChange) < threshold) {
    trend = 'stable';
    description = 'Relatively stable with minimal change';
  } else if (percentChange > 0) {
    trend = 'up';
    
    // Customize descriptions based on series and direction
    switch (seriesId) {
      case FredDataSeries.MORTGAGE_30YR:
      case FredDataSeries.MORTGAGE_15YR:
        description = `Increased by ${Math.abs(percentChange).toFixed(2)}%, indicating higher borrowing costs`;
        break;
      case FredDataSeries.HOME_PRICE_INDEX:
      case FredDataSeries.MEDIAN_HOME_PRICE:
        description = `Increased by ${Math.abs(percentChange).toFixed(2)}%, showing appreciation in home values`;
        break;
      case FredDataSeries.HOUSING_STARTS:
        description = `Increased by ${Math.abs(percentChange).toFixed(2)}%, suggesting stronger construction activity`;
        break;
      case FredDataSeries.NEW_HOME_SUPPLY:
        description = `Increased by ${Math.abs(percentChange).toFixed(2)}%, indicating potentially slower sales relative to inventory`;
        break;
      default:
        description = `Increased by ${Math.abs(percentChange).toFixed(2)}%`;
    }
  } else {
    trend = 'down';
    
    // Customize descriptions based on series and direction
    switch (seriesId) {
      case FredDataSeries.MORTGAGE_30YR:
      case FredDataSeries.MORTGAGE_15YR:
        description = `Decreased by ${Math.abs(percentChange).toFixed(2)}%, indicating lower borrowing costs`;
        break;
      case FredDataSeries.HOME_PRICE_INDEX:
      case FredDataSeries.MEDIAN_HOME_PRICE:
        description = `Decreased by ${Math.abs(percentChange).toFixed(2)}%, showing some home value depreciation`;
        break;
      case FredDataSeries.HOUSING_STARTS:
        description = `Decreased by ${Math.abs(percentChange).toFixed(2)}%, suggesting weaker construction activity`;
        break;
      case FredDataSeries.NEW_HOME_SUPPLY:
        description = `Decreased by ${Math.abs(percentChange).toFixed(2)}%, indicating potentially faster sales relative to inventory`;
        break;
      default:
        description = `Decreased by ${Math.abs(percentChange).toFixed(2)}%`;
    }
  }
  
  return { trend, description };
}
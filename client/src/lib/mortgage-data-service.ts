/**
 * Mortgage Data Service
 * 
 * This service provides mortgage rates and market data from multiple sources,
 * implementing fallbacks to ensure data availability.
 */

import { fetchCurrentMortgageRates, FredDataPoint, FredDataSeries } from './fred-service';

// Interfaces
export interface MortgageRateData {
  thirtyYearFixed: {
    rate: number;
    timestamp: string;
    source: string;
  };
  fifteenYearFixed: {
    rate: number;
    timestamp: string;
    source: string;
  };
}

export interface MarketIndicator {
  name: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable' | 'unknown';
  description: string;
  source: string;
}

// Default values based on historical averages as fallbacks
const DEFAULT_MORTGAGE_RATES: MortgageRateData = {
  thirtyYearFixed: {
    rate: 6.8,
    timestamp: new Date().toISOString(),
    source: 'Default'
  },
  fifteenYearFixed: {
    rate: 6.2,
    timestamp: new Date().toISOString(),
    source: 'Default'
  }
};

/**
 * Fetches current mortgage rates from multiple sources with fallback
 */
export async function getMortgageRates(): Promise<MortgageRateData> {
  try {
    // Check if FRED API key is available
    if (!import.meta.env.VITE_FRED_API_KEY) {
      console.warn('FRED API key is not available. Using default values as fallback.');
      return {
        ...DEFAULT_MORTGAGE_RATES,
        thirtyYearFixed: {
          ...DEFAULT_MORTGAGE_RATES.thirtyYearFixed,
          source: 'Default (API key not configured)'
        },
        fifteenYearFixed: {
          ...DEFAULT_MORTGAGE_RATES.fifteenYearFixed,
          source: 'Default (API key not configured)'
        }
      };
    }
    
    // Try FRED API first
    const fredRates = await fetchCurrentMortgageRates();
    
    // Check if we got valid data from FRED
    if (fredRates.thirtyYear?.value && fredRates.fifteenYear?.value) {
      return {
        thirtyYearFixed: {
          rate: parseFloat(fredRates.thirtyYear.value),
          timestamp: fredRates.thirtyYear.date,
          source: 'Federal Reserve Economic Data (FRED)'
        },
        fifteenYearFixed: {
          rate: parseFloat(fredRates.fifteenYear.value),
          timestamp: fredRates.fifteenYear.date,
          source: 'Federal Reserve Economic Data (FRED)'
        }
      };
    }
    
    // FRED returned but with incomplete data
    if (fredRates.thirtyYear?.value || fredRates.fifteenYear?.value) {
      // We have partial data, use what we have and fallback for the rest
      const partialResults: MortgageRateData = {
        thirtyYearFixed: DEFAULT_MORTGAGE_RATES.thirtyYearFixed,
        fifteenYearFixed: DEFAULT_MORTGAGE_RATES.fifteenYearFixed
      };
      
      if (fredRates.thirtyYear?.value) {
        partialResults.thirtyYearFixed = {
          rate: parseFloat(fredRates.thirtyYear.value),
          timestamp: fredRates.thirtyYear.date,
          source: 'Federal Reserve Economic Data (FRED)'
        };
      }
      
      if (fredRates.fifteenYear?.value) {
        partialResults.fifteenYearFixed = {
          rate: parseFloat(fredRates.fifteenYear.value),
          timestamp: fredRates.fifteenYear.date,
          source: 'Federal Reserve Economic Data (FRED)'
        };
      }
      
      console.log('Using partial FRED data with fallbacks for missing values');
      return partialResults;
    }
    
    // FRED failed, we could try another API source here
    // For example:
    // const otherApiRates = await fetchRatesFromOtherApi();
    // if (otherApiRates) { return format the data }
    
    // If all else fails, use default values
    console.log('Using default mortgage rates as fallback');
    return {
      ...DEFAULT_MORTGAGE_RATES,
      thirtyYearFixed: {
        ...DEFAULT_MORTGAGE_RATES.thirtyYearFixed,
        source: 'Default (FRED API unavailable)'
      },
      fifteenYearFixed: {
        ...DEFAULT_MORTGAGE_RATES.fifteenYearFixed,
        source: 'Default (FRED API unavailable)'
      }
    };
    
  } catch (error) {
    console.error('Error fetching mortgage rates:', error);
    return {
      ...DEFAULT_MORTGAGE_RATES,
      thirtyYearFixed: {
        ...DEFAULT_MORTGAGE_RATES.thirtyYearFixed,
        source: 'Default (API error occurred)'
      },
      fifteenYearFixed: {
        ...DEFAULT_MORTGAGE_RATES.fifteenYearFixed,
        source: 'Default (API error occurred)'
      }
    };
  }
}

/**
 * Converts a mortgage rate to an APR, accounting for typical loan costs
 * @param rate The base mortgage rate
 * @returns The estimated APR
 */
export function estimateAPR(rate: number): number {
  // APR is typically 0.1 to 0.25 percentage points higher than the base rate
  // due to loan costs and fees
  return rate + 0.15;
}

/**
 * Format a mortgage rate as a percentage with appropriate precision
 */
export function formatRate(rate: number): string {
  return rate.toFixed(3) + '%';
}

/**
 * Estimate monthly payment for a mortgage
 * @param loanAmount Principal loan amount
 * @param rate Annual interest rate (as a percentage)
 * @param termYears Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  rate: number,
  termYears: number
): number {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }
  
  return loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

/**
 * Compare current rates to historical averages
 * @param currentRate The current rate to evaluate
 * @returns A description of how the rate compares historically
 */
export function getHistoricalContext(currentRate: number): string {
  // Historical average benchmarks
  const allTimeAverage = 7.75; // Approximate 30-year fixed rate average since 1971
  const preGfcAverage = 6.25; // Average before 2008 Global Financial Crisis
  const postGfcAverage = 4.0; // Average after 2008 through 2021
  
  if (currentRate < 4.0) {
    return "Historically low - well below long-term averages";
  } else if (currentRate < 5.5) {
    return "Below historical average - comparable to post-2008 normal rates";
  } else if (currentRate < 7.0) {
    return "Near historical average - similar to pre-2008 typical rates";
  } else if (currentRate < 9.0) {
    return "Above average - higher than most of the past 20 years";
  } else {
    return "Historically high - comparable to early 1990s levels";
  }
}

/**
 * Get a recommendation based on current rates
 * @param currentRate The current 30-year fixed rate
 * @returns A recommendation for borrowers
 */
export function getRateRecommendation(currentRate: number): string {
  if (currentRate < 5.0) {
    return "Consider locking in these historically favorable rates. Fixed-rate loans are attractive.";
  } else if (currentRate < 6.5) {
    return "Rates are reasonable by historical standards. Consider both fixed and adjustable options.";
  } else if (currentRate < 8.0) {
    return "Rates are somewhat elevated. Consider adjustable-rate mortgages if you plan to refinance within 5-7 years.";
  } else {
    return "Rates are high. Consider making a larger down payment to reduce loan amount or exploring adjustable-rate options.";
  }
}
/**
 * NHTSA Vehicle API Service
 * This service provides methods to interact with the NHTSA API for vehicle information
 * through our server-side endpoint.
 */

/**
 * Vehicle information from VIN lookup
 */
export interface VehicleDetails {
  VIN?: string;
  Make?: string;
  Model?: string;
  ModelYear?: string;
  VehicleType?: string;
  PlantCountry?: string;
  BodyClass?: string;
  EngineType?: string;
  FuelTypePrimary?: string;
  DriveType?: string;
  Transmission?: string;
  ManufacturerName?: string;
  ErrorCode?: string;
  ErrorText?: string;
}

/**
 * Vehicle recall information
 */
export interface RecallInfo {
  CampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  Notes: string;
  ReportReceivedDate: string;
}

/**
 * Interface for maintenance schedule item
 */
export interface MaintenanceItem {
  interval: string;
  mileage: number;
  description: string;
  type: 'Regular' | 'Major' | 'Safety';
  componentSystem: string;
}

/**
 * Service type for recommended maintenance schedule
 */
export interface MaintenanceSchedule {
  items: MaintenanceItem[];
  vehicleType: string;
  engineType: string;
  driveType: string;
}

/**
 * Decode a VIN to get detailed vehicle information
 * @param vin Vehicle Identification Number
 * @returns Promise with vehicle details
 */
export const decodeVIN = async (vin: string): Promise<VehicleDetails> => {
  try {
    const response = await fetch(`/api/nhtsa/decode-vin/${vin}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching vehicle data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to decode VIN:', error);
    return { 
      ErrorCode: '500', 
      ErrorText: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get recalls for a specific vehicle by VIN
 * @param vin Vehicle Identification Number
 * @returns Promise with array of recall information
 */
export const getRecalls = async (vin: string): Promise<RecallInfo[]> => {
  try {
    const response = await fetch(`/api/nhtsa/recalls/${vin}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching recall data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get recalls:', error);
    return [];
  }
};

/**
 * Get recommended maintenance schedule based on vehicle details
 * @param vehicleDetails Vehicle details object
 * @returns Promise with maintenance schedule
 */
export const getMaintenanceSchedule = async (
  vehicleDetails: VehicleDetails
): Promise<MaintenanceSchedule> => {
  try {
    const response = await fetch('/api/nhtsa/maintenance-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleDetails),
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching maintenance schedule: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get maintenance schedule:', error);
    return {
      items: [],
      vehicleType: '',
      engineType: '',
      driveType: ''
    };
  }
};
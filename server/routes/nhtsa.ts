import { Router } from 'express';
import axios from 'axios';

const router = Router();
const NHTSA_API_BASE = 'https://vpic.nhtsa.dot.gov/api';

/**
 * Clean up results from NHTSA API to make them more readable
 * @param results Raw NHTSA API results
 */
function processVehicleData(results: any[]): Record<string, string> {
  const data: Record<string, string> = {};
  
  if (!results || !Array.isArray(results)) {
    return { ErrorCode: '404', ErrorText: 'No valid data returned from NHTSA API' };
  }
  
  results.forEach(item => {
    if (item.Variable && item.Value) {
      data[item.Variable.replace(/\s+/g, '')] = item.Value;
    }
  });
  
  return data;
}

/**
 * Generate a maintenance schedule based on vehicle information
 * This uses the vehicle details to create an appropriate maintenance schedule
 */
function generateMaintenanceSchedule(vehicleDetails: Record<string, string>) {
  const engineType = vehicleDetails.EngineType || 'Unknown';
  const vehicleType = vehicleDetails.VehicleType || 'Passenger Car';
  const driveType = vehicleDetails.DriveType || 'FWD';
  const fuelType = vehicleDetails.FuelTypePrimary || 'Gasoline';
  
  // Base maintenance items common to all vehicles
  const baseItems = [
    {
      interval: 'Every 3 months or 3,000 miles',
      mileage: 3000,
      description: 'Check oil and fluid levels',
      type: 'Regular' as const,
      componentSystem: 'Fluids'
    },
    {
      interval: 'Every 6 months or 6,000 miles',
      mileage: 6000,
      description: 'Rotate tires, check brake pads and rotors',
      type: 'Regular' as const,
      componentSystem: 'Tires & Brakes'
    },
    {
      interval: 'Every 12 months or 12,000 miles',
      mileage: 12000,
      description: 'Replace engine oil and filter',
      type: 'Regular' as const,
      componentSystem: 'Engine'
    },
    {
      interval: 'Every 30,000 miles',
      mileage: 30000,
      description: 'Replace air filter, cabin filter, and spark plugs',
      type: 'Major' as const,
      componentSystem: 'Engine'
    },
    {
      interval: 'Every 60,000 miles',
      mileage: 60000,
      description: 'Inspect and service transmission',
      type: 'Major' as const,
      componentSystem: 'Transmission'
    },
    {
      interval: 'Every 100,000 miles',
      mileage: 100000,
      description: 'Replace timing belt/chain and coolant flush',
      type: 'Major' as const,
      componentSystem: 'Engine'
    }
  ];
  
  // Vehicle-specific items based on engine and drive type
  const specificItems = [];
  
  // Add engine-specific maintenance
  if (engineType.includes('Diesel')) {
    specificItems.push({
      interval: 'Every 10,000 miles',
      mileage: 10000,
      description: 'Replace fuel filter',
      type: 'Regular' as const,
      componentSystem: 'Fuel System'
    });
  } else if (fuelType.includes('Electric')) {
    specificItems.push({
      interval: 'Every 7,500 miles',
      mileage: 7500,
      description: 'Inspect battery cooling system',
      type: 'Safety' as const,
      componentSystem: 'Electrical'
    });
  }
  
  // Add drivetrain-specific maintenance
  if (driveType.includes('4WD') || driveType.includes('AWD')) {
    specificItems.push({
      interval: 'Every 30,000 miles',
      mileage: 30000,
      description: 'Transfer case fluid change',
      type: 'Regular' as const,
      componentSystem: 'Drivetrain'
    });
    specificItems.push({
      interval: 'Every 60,000 miles',
      mileage: 60000,
      description: 'Differential fluid change',
      type: 'Regular' as const,
      componentSystem: 'Drivetrain'
    });
  }
  
  // Add vehicle type-specific maintenance
  if (vehicleType.includes('Truck') || vehicleType.includes('Bus') || vehicleType.includes('Multipurpose')) {
    specificItems.push({
      interval: 'Every 15,000 miles',
      mileage: 15000,
      description: 'Inspect suspension components and lubricate',
      type: 'Regular' as const,
      componentSystem: 'Suspension'
    });
  }
  
  return {
    items: [...baseItems, ...specificItems].sort((a, b) => a.mileage - b.mileage),
    vehicleType,
    engineType,
    driveType
  };
}

/**
 * @route   GET /api/nhtsa/decode-vin/:vin
 * @desc    Decode a VIN number to get vehicle details from NHTSA
 * @access  Public
 */
router.get('/decode-vin/:vin', async (req, res) => {
  const { vin } = req.params;
  
  if (!vin || vin.length !== 17) {
    return res.status(400).json({ 
      ErrorCode: '400', 
      ErrorText: 'Invalid VIN. Please provide a valid 17-character VIN.' 
    });
  }
  
  try {
    const response = await axios.get(
      `${NHTSA_API_BASE}/vehicles/DecodeVin/${vin}?format=json`
    );
    
    const vehicleData = processVehicleData(response.data.Results);
    
    return res.json(vehicleData);
  } catch (error) {
    console.error('NHTSA API error:', error);
    return res.status(500).json({ 
      ErrorCode: '500', 
      ErrorText: 'Error connecting to NHTSA API. Please try again later.' 
    });
  }
});

/**
 * @route   GET /api/nhtsa/recalls/:vin
 * @desc    Get recall information for a specific vehicle by VIN
 * @access  Public
 */
router.get('/recalls/:vin', async (req, res) => {
  const { vin } = req.params;
  
  if (!vin || vin.length !== 17) {
    return res.status(400).json({ 
      error: 'Invalid VIN. Please provide a valid 17-character VIN.' 
    });
  }
  
  try {
    const response = await axios.get(
      `${NHTSA_API_BASE}/vehicles/GetRecallsByVIN/${vin}?format=json`
    );
    
    return res.json(response.data.Results || []);
  } catch (error) {
    console.error('NHTSA Recalls API error:', error);
    return res.status(500).json({ 
      error: 'Error connecting to NHTSA API. Please try again later.' 
    });
  }
});

/**
 * @route   POST /api/nhtsa/maintenance-schedule
 * @desc    Generate a maintenance schedule based on vehicle details
 * @access  Public
 */
router.post('/maintenance-schedule', (req, res) => {
  const vehicleDetails = req.body;
  
  if (!vehicleDetails) {
    return res.status(400).json({ 
      error: 'Vehicle details are required.' 
    });
  }
  
  try {
    const schedule = generateMaintenanceSchedule(vehicleDetails);
    return res.json(schedule);
  } catch (error) {
    console.error('Maintenance schedule generation error:', error);
    return res.status(500).json({ 
      error: 'Error generating maintenance schedule.' 
    });
  }
});

export default router;
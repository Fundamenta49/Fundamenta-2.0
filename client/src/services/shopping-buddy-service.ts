import axios from 'axios';

export interface GroceryPreferences {
  diet: string;
  budget: string;
  meals: number;
  restrictions: string;
}

export interface GroceryItem {
  name: string;
  estimatedCost: number;
  quantity: string;
  category: string;
}

export interface GroceryList {
  items: GroceryItem[];
  totalCost: number;
  suggestions: string[];
}

/**
 * Get personalized grocery list from OpenAI based on user preferences
 */
export async function getPersonalizedGroceryList(preferences: GroceryPreferences): Promise<GroceryList> {
  try {
    const response = await axios.post('/api/shopping/generate-list', preferences);
    return response.data;
  } catch (error) {
    console.error('Error generating grocery list:', error);
    throw new Error('Failed to generate grocery list. Please try again.');
  }
}

/**
 * Get nearby grocery stores and their prices
 */
export async function getNearbyStores(latitude: number, longitude: number, selectedProducts: string[]) {
  try {
    const response = await axios.post('/api/shopping/nearby-stores', {
      latitude,
      longitude,
      products: selectedProducts
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    throw new Error('Failed to find nearby stores. Please try again.');
  }
}

/**
 * Search for grocery item prices
 */
export async function searchGroceryPrices(query: string) {
  try {
    const response = await axios.get(`/api/shopping/price-search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching grocery prices:', error);
    throw new Error('Failed to search grocery prices. Please try again.');
  }
}
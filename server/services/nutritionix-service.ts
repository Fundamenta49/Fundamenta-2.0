import axios from 'axios';

export interface NutritionixSearchResponse {
  common: NutritionixCommonFood[];
  branded: NutritionixBrandedFood[];
}

export interface NutritionixCommonFood {
  food_name: string;
  serving_unit: string;
  tag_name: string;
  serving_qty: number;
  common_type: string | null;
  tag_id: string;
  photo: {
    thumb: string;
  };
  locale: string;
}

export interface NutritionixBrandedFood {
  food_name: string;
  brand_name: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  photo: {
    thumb: string;
  };
  nix_brand_name: string;
  nix_brand_id: string;
  nix_item_id: string;
  nix_item_name: string;
}

export interface NutritionixNutrient {
  attr_id: number;
  value: number;
  name: string;
  unit: string;
}

export interface NutritionixFoodDetails {
  food_name: string;
  brand_name?: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  nf_p: number;
  full_nutrients: NutritionixNutrient[];
  photo: {
    thumb: string;
    highres: string;
    is_user_uploaded: boolean;
  };
  alt_measures?: {
    serving_weight: number;
    measure: string;
    seq: number;
    qty: number;
  }[];
  tags?: object;
  source?: number;
}

export interface NutritionAnalysisResult {
  foods: NutritionixFoodDetails[];
}

class NutritionixService {
  private appId: string;
  private apiKey: string;
  private baseUrl: string = 'https://trackapi.nutritionix.com/v2';

  constructor() {
    this.appId = process.env.NUTRITIONIX_APP_ID || '';
    this.apiKey = process.env.NUTRITIONIX_API_KEY || '';
    
    if (!this.appId || !this.apiKey) {
      console.warn('Nutritionix API credentials not found in environment variables');
    }
  }

  /**
   * Search for foods in the Nutritionix database
   * @param query Search term
   * @param detailed Whether to include detailed nutrition information
   * @param limit Maximum number of results
   */
  async searchFoods(query: string, detailed: boolean = false, limit: number = 10): Promise<NutritionixSearchResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/search/instant`, {
        params: {
          query,
          detailed,
          branded: true,
          common: true,
          branded_region: 1, // US
          self: false,
          branded_food_name_only: false,
          locale: 'en_US',
        },
        headers: {
          'x-app-id': this.appId,
          'x-app-key': this.apiKey,
        }
      });
      
      // Limit the results based on the provided limit
      if (response.data.common) {
        response.data.common = response.data.common.slice(0, limit);
      }
      if (response.data.branded) {
        response.data.branded = response.data.branded.slice(0, limit);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error searching Nutritionix foods:', error);
      throw new Error('Failed to search foods in Nutritionix database');
    }
  }

  /**
   * Get detailed nutritional information for a specific food
   * @param query The food name or description
   * @param quantity The serving quantity
   * @param unit Optional serving unit
   */
  async getFoodDetails(query: string, quantity: number = 1, unit?: string): Promise<NutritionixFoodDetails> {
    try {
      const payload: any = {
        query: `${quantity} ${unit ? unit + ' of ' : ''}${query}`,
        timezone: "US/Eastern",
      };

      const response = await axios.post(
        `${this.baseUrl}/natural/nutrients`,
        payload,
        {
          headers: {
            'x-app-id': this.appId,
            'x-app-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.foods && response.data.foods.length > 0) {
        return response.data.foods[0];
      } else {
        throw new Error('No food details found');
      }
    } catch (error) {
      console.error(`Error getting food details for ${query}:`, error);
      throw new Error(`Failed to get details for ${query}`);
    }
  }

  /**
   * Analyze a list of food items
   * @param foodItems Array of food items with quantity, unit and name
   */
  async analyzeNutrition(foodItems: { name: string; quantity: number; unit?: string }[]): Promise<NutritionAnalysisResult> {
    try {
      // Convert the food items into a natural language query
      const query = foodItems.map(item => 
        `${item.quantity} ${item.unit ? item.unit + ' of ' : ''}${item.name}`
      ).join(', ');

      const response = await axios.post(
        `${this.baseUrl}/natural/nutrients`,
        {
          query,
          timezone: "US/Eastern",
        },
        {
          headers: {
            'x-app-id': this.appId,
            'x-app-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      throw new Error('Failed to analyze nutrition information');
    }
  }

  /**
   * Get common food categories from Nutritionix
   */
  async getFoodCategories(): Promise<string[]> {
    try {
      // Since Nutritionix doesn't have a direct endpoint for categories,
      // we'll search for some common foods and extract their types
      const commonQueries = ['apple', 'bread', 'cheese', 'chicken', 'rice'];
      const categories = new Set<string>();

      for (const query of commonQueries) {
        const results = await this.searchFoods(query, false, 5);
        results.common.forEach(food => {
          if (food.common_type) {
            categories.add(food.common_type);
          }
        });
      }

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error getting food categories:', error);
      throw new Error('Failed to retrieve food categories');
    }
  }

  /**
   * Extract macronutrient information from food details
   */
  extractMacronutrients(foodDetails: NutritionixFoodDetails) {
    return {
      calories: foodDetails.nf_calories,
      protein: foodDetails.nf_protein,
      carbs: foodDetails.nf_total_carbohydrate,
      fat: foodDetails.nf_total_fat,
      fiber: foodDetails.nf_dietary_fiber,
      sugar: foodDetails.nf_sugars
    };
  }
}

export const nutritionixService = new NutritionixService();
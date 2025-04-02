import axios from 'axios';

interface FoodSearchCriteria {
  query: string;
  dataType?: string[]; // e.g., ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"]
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  sortOrder?: string;
  brandOwner?: string;
}

interface FoodSearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: FoodItem[];
}

export interface FoodItem {
  fdcId: number;
  description: string;
  lowercaseDescription?: string;
  dataType?: string;
  gtinUpc?: string;
  publishedDate?: string;
  brandOwner?: string;
  brandName?: string;
  ingredients?: string;
  marketCountry?: string;
  foodCategory?: string;
  servingSizeUnit?: string;
  servingSize?: number;
  allHighlightFields?: string;
  score?: number;
  foodNutrients?: FoodNutrient[];
}

interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  derivationCode?: string;
  derivationDescription?: string;
  derivationId?: number;
  value: number;
  foodNutrientSourceId?: number;
  foodNutrientSourceCode?: string;
  foodNutrientSourceDescription?: string;
  rank?: number;
  indentLevel?: number;
  foodNutrientId?: number;
}

export interface FoodDetails {
  fdcId: number;
  description: string;
  lowercaseDescription?: string;
  dataType?: string;
  publicationDate?: string;
  foodCategory?: string;
  foodPortions?: FoodPortion[];
  foodComponents?: any[];
  foodAttributes?: any[];
  nutrientConversionFactors?: any[];
  isHistoricalReference?: boolean;
  ndbNumber?: number;
  foodNutrients: FoodNutrient[];
  inputFoods?: any[];
  labelNutrients?: {
    fat?: { value: number },
    saturatedFat?: { value: number },
    transFat?: { value: number },
    cholesterol?: { value: number },
    sodium?: { value: number },
    carbohydrates?: { value: number },
    fiber?: { value: number },
    sugars?: { value: number },
    protein?: { value: number },
    calcium?: { value: number },
    iron?: { value: number },
    potassium?: { value: number },
    calories?: { value: number }
  };
}

interface FoodPortion {
  id: number;
  amount: number;
  dataPoints?: number;
  gramWeight: number;
  minYearAcquired?: number;
  modifier?: string;
  portionDescription?: string;
  sequenceNumber?: number;
}

class UsdaService {
  private apiKey: string;
  private baseUrl: string = 'https://api.nal.usda.gov/fdc/v1';

  constructor() {
    this.apiKey = process.env.USDA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('USDA_API_KEY not found in environment variables');
    }
  }

  /**
   * Search for foods in the FoodData Central database
   */
  async searchFoods(criteria: FoodSearchCriteria): Promise<FoodSearchResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/foods/search?api_key=${this.apiKey}`,
        criteria
      );
      return response.data;
    } catch (error) {
      console.error('Error searching USDA foods:', error);
      throw new Error('Failed to search foods in USDA database');
    }
  }

  /**
   * Get detailed information about a specific food by its FDC ID
   */
  async getFoodDetails(fdcId: number): Promise<FoodDetails> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/food/${fdcId}?api_key=${this.apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error getting food details for ID ${fdcId}:`, error);
      throw new Error(`Failed to get details for food ID ${fdcId}`);
    }
  }

  /**
   * Get multiple food details in a single request
   */
  async getFoodsDetails(fdcIds: number[]): Promise<FoodDetails[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/foods?api_key=${this.apiKey}`,
        { fdcIds }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting multiple food details:', error);
      throw new Error('Failed to get details for multiple foods');
    }
  }

  /**
   * Get list of available food categories
   */
  async getFoodCategories(): Promise<string[]> {
    try {
      // This is a workaround since there's no direct endpoint for categories
      // We'll search with a very generic term and extract unique categories
      const searchResult = await this.searchFoods({
        query: '',
        pageSize: 200,
        dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"]
      });
      
      // Extract unique categories
      const uniqueCategories = new Set<string>();
      searchResult.foods.forEach(food => {
        if (food.foodCategory) {
          uniqueCategories.add(food.foodCategory);
        }
      });
      
      return Array.from(uniqueCategories).sort();
    } catch (error) {
      console.error('Error getting food categories:', error);
      throw new Error('Failed to retrieve food categories');
    }
  }

  /**
   * Find common foods and their nutrient information
   */
  async getCommonFoods(): Promise<FoodItem[]> {
    try {
      const commonFoodQueries = [
        'apple', 'banana', 'chicken breast', 'beef', 'salmon',
        'rice', 'bread', 'milk', 'egg', 'spinach',
        'broccoli', 'potato', 'carrot', 'yogurt', 'cheese'
      ];
      
      const results: FoodItem[] = [];
      
      // We'll only query for a few common foods to avoid too many API calls
      for (const query of commonFoodQueries.slice(0, 5)) {
        const searchResult = await this.searchFoods({
          query,
          pageSize: 1,
          dataType: ["Foundation", "SR Legacy"]
        });
        
        if (searchResult.foods.length > 0) {
          results.push(searchResult.foods[0]);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error getting common foods:', error);
      throw new Error('Failed to retrieve common foods');
    }
  }

  /**
   * Extract macronutrient information from food nutrients
   */
  extractMacronutrients(foodNutrients: FoodNutrient[]) {
    const macros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };

    foodNutrients.forEach(nutrient => {
      switch (nutrient.nutrientName) {
        case 'Energy':
          if (nutrient.unitName === 'kcal') {
            macros.calories = nutrient.value;
          }
          break;
        case 'Protein':
          macros.protein = nutrient.value;
          break;
        case 'Carbohydrate, by difference':
          macros.carbs = nutrient.value;
          break;
        case 'Total lipid (fat)':
          macros.fat = nutrient.value;
          break;
        case 'Fiber, total dietary':
          macros.fiber = nutrient.value;
          break;
        case 'Sugars, total including NLEA':
          macros.sugar = nutrient.value;
          break;
      }
    });

    return macros;
  }
}

export const usdaService = new UsdaService();
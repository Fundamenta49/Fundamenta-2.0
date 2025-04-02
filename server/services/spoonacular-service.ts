import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Service for interacting with the Spoonacular API
 */
export class SpoonacularService {
  /**
   * Search for grocery products
   * @param query Search query
   * @param number Number of results to return
   */
  static async searchGroceryProducts(query: string, number: number = 10) {
    try {
      const response = await axios.get(`${BASE_URL}/food/products/search`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          query,
          number
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching grocery products:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a grocery product
   * @param id Product ID
   */
  static async getProductInformation(id: number) {
    try {
      const response = await axios.get(`${BASE_URL}/food/products/${id}`, {
        params: {
          apiKey: SPOONACULAR_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting product information:', error);
      throw error;
    }
  }

  /**
   * Generate a meal plan with a shopping list
   * @param timeFrame Either 'day' or 'week'
   * @param targetCalories Target calories per day
   * @param diet Diet type (e.g., 'vegetarian', 'vegan', etc.)
   * @param exclude Foods to exclude
   */
  static async generateMealPlan(
    timeFrame: 'day' | 'week' = 'day',
    targetCalories: number = 2000,
    diet?: string,
    exclude?: string
  ) {
    try {
      const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          timeFrame,
          targetCalories,
          diet,
          exclude
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  }

  /**
   * Compute the price breakdown of a recipe
   * @param recipeId Recipe ID
   */
  static async getPriceBreakdown(recipeId: number) {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/priceBreakdownWidget.json`, {
        params: {
          apiKey: SPOONACULAR_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting price breakdown:', error);
      throw error;
    }
  }

  /**
   * Get recipes that use the provided ingredients
   * @param ingredients Comma-separated list of ingredients
   * @param number Number of results to return
   */
  static async findRecipesByIngredients(ingredients: string, number: number = 5) {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients,
          number,
          ranking: 1, // 1 = maximize used ingredients, 2 = minimize missing ingredients
          ignorePantry: true // ignore typical pantry items
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error finding recipes by ingredients:', error);
      throw error;
    }
  }

  /**
   * Generate a shopping list from a meal plan
   * @param username Username (can be arbitrary)
   * @param startDate Start date in format yyyy-mm-dd
   * @param endDate End date in format yyyy-mm-dd
   * @param hash Hash value (can be arbitrary for our use case)
   */
  static async generateShoppingList(
    username: string,
    startDate: string,
    endDate: string,
    hash: string = 'arbitrary-hash'
  ) {
    try {
      const response = await axios.post(
        `${BASE_URL}/mealplanner/${username}/shopping-list/${startDate}/${endDate}`,
        {},
        {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            hash
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw error;
    }
  }

  /**
   * Map ingredients to grocery products
   * @param ingredients Array of ingredient strings
   */
  static async mapIngredientsToGroceryProducts(ingredients: string[]) {
    try {
      const response = await axios.post(
        `${BASE_URL}/food/ingredients/map`,
        { ingredients },
        {
          params: {
            apiKey: SPOONACULAR_API_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error mapping ingredients to grocery products:', error);
      throw error;
    }
  }

  /**
   * Get random recipes
   * @param number Number of recipes to return
   * @param tags Tags to filter by (e.g., 'vegetarian', 'dessert', etc.)
   */
  static async getRandomRecipes(number: number = 10, tags?: string) {
    try {
      const response = await axios.get(`${BASE_URL}/recipes/random`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          number,
          tags
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      throw error;
    }
  }
}
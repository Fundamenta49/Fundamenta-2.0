import { apiRequest } from '@/lib/queryClient';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  diets: string[];
  dishTypes: string[];
  instructions: string;
  extendedIngredients: Array<{
    original: string;
  }>;
  aggregateLikes?: number;
}

export interface Video {
  title: string;
  shortTitle?: string;
  youTubeId: string;
  thumbnail: string;
  views: number;
  length: number; // in seconds
}

interface SearchResponse {
  results: Recipe[];
  totalResults: number;
  offset: number;
  number: number;
}

interface RandomRecipesResponse {
  recipes: Recipe[];
}

interface VideosSearchResponse {
  videos: Video[];
  totalResults: number;
  offset?: number;
  number: number;
}

interface RandomVideosResponse {
  videos: Video[];
}

export class SpoonacularService {
  /**
   * Search for recipes
   * @param query Search term
   * @param diet Optional diet filter (e.g., vegetarian, vegan)
   * @param cuisine Optional cuisine filter (e.g., italian, mexican)
   * @param intolerances Optional intolerances filter (e.g., gluten, dairy)
   * @param maxReadyTime Maximum time to prepare in minutes
   * @param sort How to sort results (e.g., popularity, healthiness)
   * @param number Number of results to return (default: 8)
   * @returns Promise with search results
   */
  static async searchRecipes(
    query: string,
    diet?: string,
    cuisine?: string,
    intolerances?: string,
    maxReadyTime?: number,
    sort?: 'popularity' | 'healthiness' | 'time' | 'random',
    number: number = 8
  ): Promise<SearchResponse> {
    try {
      let url = `/api/cooking/recipes/search?query=${encodeURIComponent(query)}&number=${number}`;
      
      if (diet) url += `&diet=${encodeURIComponent(diet)}`;
      if (cuisine) url += `&cuisine=${encodeURIComponent(cuisine)}`;
      if (intolerances) url += `&intolerances=${encodeURIComponent(intolerances)}`;
      if (maxReadyTime) url += `&maxReadyTime=${maxReadyTime}`;
      if (sort) url += `&sort=${sort}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }
  
  /**
   * Get recipe information by ID
   * @param id Recipe ID
   * @returns Promise with recipe details
   */
  static async getRecipeById(id: number): Promise<Recipe> {
    try {
      const response = await apiRequest('GET', `/api/cooking/recipes/${id}/information`);
      return await response.json();
    } catch (error) {
      console.error('Error getting recipe details:', error);
      throw error;
    }
  }
  
  /**
   * Get random recipes
   * @param number Number of recipes to return (default: 8)
   * @param tags Optional comma-separated tags to filter results
   * @returns Promise with random recipes
   */
  static async getRandomRecipes(number: number = 8, tags?: string): Promise<RandomRecipesResponse> {
    try {
      let url = `/api/cooking/recipes/random?number=${number}`;
      if (tags) url += `&tags=${encodeURIComponent(tags)}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error getting random recipes:', error);
      throw error;
    }
  }
  
  /**
   * Find recipes by ingredients
   * @param ingredients Comma-separated list of ingredients
   * @param number Number of recipes to return (default: 5)
   * @param ranking Ranking strategy (1=maximize used ingredients, 2=minimize missing ingredients)
   * @param ignorePantry Whether to ignore pantry ingredients like salt, oil
   * @returns Promise with recipes that use the specified ingredients
   */
  static async findRecipesByIngredients(
    ingredients: string[],
    number: number = 5,
    ranking: 1 | 2 = 1,
    ignorePantry: boolean = true
  ): Promise<any[]> {
    try {
      const ingredientsStr = ingredients.join(',');
      const url = `/api/cooking/recipes/by-ingredients?ingredients=${encodeURIComponent(ingredientsStr)}&number=${number}&ranking=${ranking}&ignorePantry=${ignorePantry}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error finding recipes by ingredients:', error);
      throw error;
    }
  }
  
  /**
   * Generate a meal plan
   * @param timeFrame 'day' or 'week'
   * @param targetCalories Desired calorie target
   * @param diet Optional diet restriction (e.g., vegetarian, vegan)
   * @param exclude Optional ingredients to exclude
   * @returns Promise with meal plan
   */
  static async generateMealPlan(
    timeFrame: 'day' | 'week' = 'day',
    targetCalories: number = 2000,
    diet?: string,
    exclude?: string
  ): Promise<any> {
    try {
      let url = `/api/cooking/meal-plan?timeFrame=${timeFrame}&targetCalories=${targetCalories}`;
      if (diet) url += `&diet=${encodeURIComponent(diet)}`;
      if (exclude) url += `&exclude=${encodeURIComponent(exclude)}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  }

  /**
   * Search for cooking videos
   * @param query Search term
   * @param cuisine Optional cuisine filter (e.g., italian, mexican)
   * @param type Optional meal type (e.g., main course, dessert)
   * @param diet Optional diet filter (e.g., vegetarian, vegan)
   * @param includeIngredients Optional ingredients to include
   * @param excludeIngredients Optional ingredients to exclude
   * @param number Number of results to return (default: 10)
   * @returns Promise with video search results
   */
  static async searchVideos(
    query: string,
    cuisine?: string,
    type?: string,
    diet?: string,
    includeIngredients?: string,
    excludeIngredients?: string,
    number: number = 10
  ): Promise<VideosSearchResponse> {
    try {
      let url = `/api/cooking/videos/search?query=${encodeURIComponent(query)}&number=${number}`;
      
      if (cuisine) url += `&cuisine=${encodeURIComponent(cuisine)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;
      if (diet) url += `&diet=${encodeURIComponent(diet)}`;
      if (includeIngredients) url += `&includeIngredients=${encodeURIComponent(includeIngredients)}`;
      if (excludeIngredients) url += `&excludeIngredients=${encodeURIComponent(excludeIngredients)}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error searching cooking videos:', error);
      throw error;
    }
  }
  
  /**
   * Get random cooking videos
   * @param number Number of videos to return (default: 10)
   * @param tags Optional comma-separated tags to filter results
   * @returns Promise with random cooking videos
   */
  static async getRandomVideos(number: number = 10, tags?: string): Promise<RandomVideosResponse> {
    try {
      let url = `/api/cooking/videos/random?number=${number}`;
      if (tags) url += `&tags=${encodeURIComponent(tags)}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error getting random cooking videos:', error);
      throw error;
    }
  }

  /**
   * Get cooking videos by category
   * @param category Category of cooking videos (e.g., breakfast, lunch, dinner, desserts, quick)
   * @param number Number of videos to return (default: 10)
   * @returns Promise with cooking videos for the specified category
   */
  static async getVideosByCategory(category: string, number: number = 10): Promise<VideosSearchResponse> {
    try {
      const url = `/api/cooking/videos/category/${encodeURIComponent(category)}?number=${number}`;
      
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      console.error('Error getting cooking videos by category:', error);
      throw error;
    }
  }

  /**
   * Format video length in seconds to MM:SS format
   * @param seconds Video length in seconds
   * @returns Formatted time string (MM:SS)
   */
  static formatVideoLength(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
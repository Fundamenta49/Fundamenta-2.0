import express from 'express';
import { SpoonacularService } from '../services/spoonacular-service';

export const spoonacularRouter = express.Router();

// Search for grocery products
spoonacularRouter.get('/products/search', async (req, res) => {
  try {
    const { query, number } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const data = await SpoonacularService.searchGroceryProducts(
      query as string,
      number ? parseInt(number as string) : undefined
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular product search:', error);
    res.status(500).json({ error: 'Failed to search for products' });
  }
});

// Get product information
spoonacularRouter.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const data = await SpoonacularService.getProductInformation(id);
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular product info:', error);
    res.status(500).json({ error: 'Failed to get product information' });
  }
});

// Generate meal plan
spoonacularRouter.get('/mealplan', async (req, res) => {
  try {
    const { timeFrame, targetCalories, diet, exclude } = req.query;
    
    const data = await SpoonacularService.generateMealPlan(
      timeFrame as 'day' | 'week',
      targetCalories ? parseInt(targetCalories as string) : undefined,
      diet as string,
      exclude as string
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// Get recipes by ingredients
spoonacularRouter.get('/recipes/byIngredients', async (req, res) => {
  try {
    const { ingredients, number } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients parameter is required' });
    }
    
    const data = await SpoonacularService.findRecipesByIngredients(
      ingredients as string,
      number ? parseInt(number as string) : undefined
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular recipes by ingredients:', error);
    res.status(500).json({ error: 'Failed to find recipes by ingredients' });
  }
});

// Get random recipes
spoonacularRouter.get('/recipes/random', async (req, res) => {
  try {
    const { number, tags } = req.query;
    
    const data = await SpoonacularService.getRandomRecipes(
      number ? parseInt(number as string) : undefined,
      tags as string
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular random recipes:', error);
    res.status(500).json({ error: 'Failed to get random recipes' });
  }
});

// Map ingredients to grocery products
spoonacularRouter.post('/ingredients/map', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required in request body' });
    }
    
    const data = await SpoonacularService.mapIngredientsToGroceryProducts(ingredients);
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular ingredient mapping:', error);
    res.status(500).json({ error: 'Failed to map ingredients to grocery products' });
  }
});

// Get products by category - This uses search with category filtering
spoonacularRouter.get('/products/category', async (req, res) => {
  try {
    const { category, number } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }
    
    // Use the search endpoint with the category as the query
    const data = await SpoonacularService.searchGroceryProducts(
      category as string,
      number ? parseInt(number as string) : undefined
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error in spoonacular products by category:', error);
    res.status(500).json({ error: 'Failed to get products by category' });
  }
});
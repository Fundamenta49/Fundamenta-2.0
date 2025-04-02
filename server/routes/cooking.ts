import express from 'express';
import axios from 'axios';

const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Search for recipes
router.get('/recipes/search', async (req, res) => {
  try {
    const { query, diet, cuisine, intolerances, maxReadyTime, sort, number = 8 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        diet,
        cuisine,
        intolerances,
        maxReadyTime,
        sort,
        number,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
    }
  }
});

// Get recipe information by ID
router.get('/recipes/:id/information', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: false
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch recipe information from Spoonacular' });
    }
  }
});

// Get random recipes
router.get('/recipes/random', async (req, res) => {
  try {
    const { number = 8, tags } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number,
        tags
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch random recipes from Spoonacular' });
    }
  }
});

// Find recipes by ingredients
router.get('/recipes/by-ingredients', async (req, res) => {
  try {
    const { ingredients, number = 5, ranking = 1, ignorePantry = true } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients list is required' });
    }
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients,
        number,
        ranking,
        ignorePantry
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to find recipes by ingredients' });
    }
  }
});

// Get meal plan
router.get('/meal-plan', async (req, res) => {
  try {
    const { timeFrame = 'day', targetCalories = 2000, diet, exclude } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        timeFrame,
        targetCalories,
        diet,
        exclude
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }
});

// Get food videos from Spoonacular
router.get('/videos/search', async (req, res) => {
  try {
    const { query, cuisine, type, diet, includeIngredients, excludeIngredients, number = 10 } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/food/videos/search`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        cuisine,
        type,
        diet,
        includeIngredients,
        excludeIngredients,
        number
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch cooking videos from Spoonacular' });
    }
  }
});

// Get random food videos from Spoonacular
router.get('/videos/random', async (req, res) => {
  try {
    const { number = 10, tags } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/food/videos/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number,
        tags
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch random cooking videos from Spoonacular' });
    }
  }
});

// Get recipe videos by category
router.get('/videos/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { number = 10 } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    // Map common cooking tutorial categories to search queries
    const categoryQueries: Record<string, string> = {
      'breakfast': 'breakfast recipes',
      'lunch': 'lunch easy meals',
      'dinner': 'dinner recipes',
      'desserts': 'dessert recipes',
      'quick': 'quick meals under 30 minutes',
      'vegetarian': 'vegetarian dishes',
      'vegan': 'vegan recipes',
      'baking': 'baking basics',
      'grilling': 'grilling techniques',
      'techniques': 'cooking techniques'
    };
    
    const query = categoryQueries[category] || category;
    
    const response = await axios.get(`${BASE_URL}/food/videos/search`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        number
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch cooking videos by category from Spoonacular' });
    }
  }
});

export default router;
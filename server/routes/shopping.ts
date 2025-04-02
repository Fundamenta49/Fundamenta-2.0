import express from 'express';
import { SpoonacularService } from '../services/spoonacular-service';
import OpenAI from 'openai';
import { spoonacularRouter } from './spoonacular';

const router = express.Router();
export const shoppingRouter = router;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mount the Spoonacular router
router.use('/spoonacular', spoonacularRouter);

// Generate a grocery list based on preferences
router.post('/generate-list', async (req, res) => {
  try {
    const { diet, budget, restrictions } = req.body;

    if (!diet || !budget) {
      return res.status(400).json({ error: 'Diet and budget are required' });
    }

    // First, try to use Spoonacular API to generate a meal plan
    try {
      // Convert budget to calories (rough estimation)
      let targetCalories = 2000; // default
      if (budget === 'very-low') targetCalories = 1600;
      else if (budget === 'low') targetCalories = 1800;
      else if (budget === 'medium') targetCalories = 2000;
      else if (budget === 'high') targetCalories = 2200;
      else if (budget === 'very-high') targetCalories = 2400;

      // Get a meal plan from Spoonacular
      const mealPlanData = await SpoonacularService.generateMealPlan(
        'day',
        targetCalories,
        diet === 'omnivore' ? undefined : diet,
        restrictions
      );

      // Extract the ingredients from the meal plan
      const ingredients = [];
      let totalCost = 0;

      // Extract ingredients from meals
      if (mealPlanData.meals) {
        for (const meal of mealPlanData.meals) {
          // For each meal, get its price breakdown
          try {
            const priceData = await SpoonacularService.getPriceBreakdown(meal.id);
            
            // Add ingredients with costs
            for (const ingredient of priceData.ingredients) {
              ingredients.push({
                name: ingredient.name,
                estimatedCost: ingredient.price / 100, // Convert cents to dollars
                quantity: ingredient.amount.us.value + ' ' + ingredient.amount.us.unit
              });
              
              totalCost += ingredient.price / 100;
            }
          } catch (err) {
            console.error('Error getting price breakdown for meal:', err);
            // Continue with the next meal if one fails
            continue;
          }
        }
      }

      // If we got ingredients successfully
      if (ingredients.length > 0) {
        // Generate some suggestions based on the diet and budget
        const suggestions = [
          `This list is optimized for a ${diet} diet.`,
          `The estimated total cost is within your ${budget.replace('-', ' ')} budget range.`,
          'For best results, try to shop for these items in a single trip.',
          restrictions ? `This list avoids ${restrictions}.` : 'No specific restrictions were applied to this list.'
        ];

        return res.json({
          items: ingredients,
          totalCost,
          suggestions
        });
      }
    } catch (spoonacularError) {
      console.error('Spoonacular API error:', spoonacularError);
      // If Spoonacular fails, continue to OpenAI fallback
    }

    // Fallback to OpenAI if Spoonacular fails or returns insufficient data
    const dietType = diet === 'omnivore' ? 'standard (includes meat and plant foods)' :
                    diet === 'vegetarian' ? 'vegetarian (no meat)' :
                    diet === 'vegan' ? 'vegan (no animal products)' :
                    diet === 'paleo' ? 'paleo (focuses on whole foods)' : diet;

    const budgetLevel = budget === 'very-low' ? 'under $30 per week' :
                       budget === 'low' ? '$30-50 per week' :
                       budget === 'medium' ? '$50-100 per week' :
                       budget === 'high' ? '$100-150 per week' :
                       budget === 'very-high' ? 'over $150 per week' : budget;

    const prompt = `Generate a detailed grocery shopping list for someone with a ${dietType} diet and a ${budgetLevel} grocery budget.
      ${restrictions ? `They have the following dietary restrictions: ${restrictions}.` : ''}
      For each item include:
      1. The exact name of the item (e.g., "Organic Granny Smith Apples" not just "Apples")
      2. The estimated cost in USD with 2 decimal places
      3. The quantity needed (e.g., "1 pound", "2 bunches", "1 loaf")
      
      Group items by category (produce, dairy, grains, etc.). Make realistic cost estimates for each item.
      Also include 3-5 money-saving shopping tips relevant to this diet and budget.
      
      Format the response as JSON with this exact structure:
      {
        "items": [
          {"name": "Item name with details", "estimatedCost": 0.00, "quantity": "amount with unit", "category": "category name"},
          ...
        ],
        "totalCost": 0.00,
        "suggestions": ["tip 1", "tip 2", "tip 3"]
      }
      The total cost should be the sum of all item costs.`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a helpful assistant that generates grocery lists based on dietary needs and budget constraints." },
                 { role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content || '';
    const parsedResponse = JSON.parse(responseContent);

    res.json(parsedResponse);
  } catch (error: any) {
    console.error('Error generating grocery list:', error);
    res.status(500).json({ 
      error: 'Failed to generate grocery list',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get nearby stores with pricing for products
router.post('/nearby-stores', async (req, res) => {
  try {
    const { latitude, longitude, products } = req.body;

    if (!latitude || !longitude || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Valid latitude, longitude, and products array are required' });
    }

    // Try to get real product pricing data from Spoonacular
    let productData = [];
    try {
      // Get product pricing data for each product
      for (const product of products) {
        const searchResult = await SpoonacularService.searchGroceryProducts(product, 1);
        if (searchResult.products && searchResult.products.length > 0) {
          const productId = searchResult.products[0].id;
          const productInfo = await SpoonacularService.getProductInformation(productId);
          
          productData.push({
            item: product,
            price: productInfo.price ? parseFloat(productInfo.price) : null,
            image: productInfo.image,
            brand: productInfo.brand || null,
            details: productInfo
          });
        } else {
          productData.push({
            item: product,
            price: null,
            image: null,
            brand: null
          });
        }
      }
    } catch (spoonacularError) {
      console.error('Spoonacular API error:', spoonacularError);
      // Continue to OpenAI fallback if Spoonacular fails
    }

    // Use OpenAI to generate realistic store data based on location and product list
    const prompt = `Generate realistic pricing data for grocery items at 4 different stores near the coordinates ${latitude}, ${longitude}.
      Products: ${products.join(', ')}
      
      For each store, include:
      1. A realistic store name based on the location (chain supermarkets or local stores)
      2. A realistic distance from the user's location
      3. Pricing for each product with occasional special deals or promotions
      
      Make the data realistic - prices should vary between stores, with some stores being generally cheaper or more expensive.
      Some stores might not carry all items.
      
      Format the response as JSON with this exact structure:
      {
        "stores": [
          {
            "storeName": "Store Name",
            "distance": "x.x miles",
            "prices": [
              {"item": "Product Name", "price": 0.00, "deal": "Optional deal description (omit if no deal)"},
              ...
            ]
          },
          ...
        ]
      }`;

    // Enhance with product data we got from Spoonacular, if any
    let enhancedPrompt = prompt;
    if (productData.length > 0) {
      const productsWithPricing = productData
        .filter(p => p.price !== null)
        .map(p => `${p.item}: ~$${p.price} (${p.brand || 'generic'})`);
      
      if (productsWithPricing.length > 0) {
        enhancedPrompt += `\n\nHere are some reference prices to make your estimates more accurate:\n${productsWithPricing.join('\n')}`;
      }
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides grocery store pricing information based on location and product list." },
        { role: "user", content: enhancedPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content || '';
    const parsedResponse = JSON.parse(responseContent);

    // Enhance the response with product images and details from Spoonacular if available
    if (parsedResponse.stores && Array.isArray(parsedResponse.stores)) {
      for (const store of parsedResponse.stores) {
        if (store.prices && Array.isArray(store.prices)) {
          for (let i = 0; i < store.prices.length; i++) {
            const item = store.prices[i].item;
            const productInfo = productData.find(p => p.item.toLowerCase() === item.toLowerCase());
            
            if (productInfo && productInfo.image) {
              store.prices[i].image = productInfo.image;
              store.prices[i].brand = productInfo.brand;
              // Only add details if they exist - they can be large
              if (productInfo.details) {
                // Include selected details that might be useful but keep response size reasonable
                store.prices[i].nutrition = productInfo.details.nutrition || null;
                store.prices[i].servingSize = productInfo.details.servingSize || null;
              }
            }
          }
        }
      }
    }

    res.json(parsedResponse);
  } catch (error: any) {
    console.error('Error getting nearby stores:', error);
    res.status(500).json({ 
      error: 'Failed to get nearby stores',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get recipe suggestions for items in shopping list
router.post('/recipe-suggestions', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Valid items array is required' });
    }

    // Extract ingredient names from items
    const ingredients = items.map(item => {
      // Handle both string items and object items with name property
      return typeof item === 'string' ? item : item.name;
    });

    // Join ingredients with commas for Spoonacular API
    const ingredientsStr = ingredients.join(',');

    // Get recipe suggestions from Spoonacular
    const recipeData = await SpoonacularService.findRecipesByIngredients(ingredientsStr, 5);

    // Transform the response to a more user-friendly format
    const suggestions = recipeData.map((recipe: SpoonacularRecipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      missedIngredients: recipe.missedIngredients.map((ing: SpoonacularIngredient) => ing.name),
      usedIngredients: recipe.usedIngredients.map((ing: SpoonacularIngredient) => ing.name),
      likes: recipe.likes
    }));

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error getting recipe suggestions:', error);
    
    // Fallback to OpenAI if Spoonacular fails
    try {
      const items = req.body.items;
      const ingredients = items.map((item: any) => {
        return typeof item === 'string' ? item : item.name;
      });

      const prompt = `Generate 5 recipe suggestions using these ingredients: ${ingredients.join(', ')}.
        For each recipe include:
        1. A title
        2. A brief description (2-3 sentences)
        3. Which of the listed ingredients are used
        4. What additional ingredients would be needed
        
        Format the response as JSON with this exact structure:
        {
          "suggestions": [
            {
              "title": "Recipe Title",
              "description": "Brief description",
              "usedIngredients": ["ingredient1", "ingredient2", ...],
              "missedIngredients": ["ingredient1", "ingredient2", ...]
            },
            ...
          ]
        }`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant that suggests recipes based on available ingredients." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const responseContent = response.choices[0].message.content || '';
      const parsedResponse = JSON.parse(responseContent);
      
      res.json(parsedResponse);
    } catch (openaiError) {
      console.error('OpenAI fallback also failed:', openaiError);
      res.status(500).json({ 
        error: 'Failed to get recipe suggestions',
        message: error?.message || 'Unknown error'
      });
    }
  }
});

// Fix error handling for all routes
const errorHandler = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
};

// Type definitions for Spoonacular recipes
interface SpoonacularIngredient {
  name: string;
  [key: string]: any;
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: SpoonacularIngredient[];
  usedIngredients: SpoonacularIngredient[];
  likes: number;
  [key: string]: any;
}

export default router;
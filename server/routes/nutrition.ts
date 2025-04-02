import express from 'express';
import { usdaService, FoodItem, FoodDetails } from '../services/usda-service';
import { nutritionixService, NutritionixSearchResponse, NutritionixFoodDetails } from '../services/nutritionix-service';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for food image uploads
const foodImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Search foods in the USDA database
router.get('/search', async (req, res) => {
  try {
    const { query, pageSize, pageNumber, dataType } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Parse the dataType array if provided
    let parsedDataType: string[] | undefined;
    if (dataType) {
      try {
        parsedDataType = JSON.parse(dataType as string);
      } catch (e) {
        parsedDataType = [(dataType as string)];
      }
    }
    
    const result = await usdaService.searchFoods({
      query: query as string,
      pageSize: pageSize ? Number(pageSize) : 25,
      pageNumber: pageNumber ? Number(pageNumber) : 1,
      dataType: parsedDataType
    });
    
    res.json(result);
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Get detailed information for a specific food
router.get('/food/:fdcId', async (req, res) => {
  try {
    const { fdcId } = req.params;
    
    if (!fdcId || isNaN(Number(fdcId))) {
      return res.status(400).json({ error: 'Valid food ID is required' });
    }
    
    const result = await usdaService.getFoodDetails(Number(fdcId));
    res.json(result);
  } catch (error) {
    console.error('Food details error:', error);
    res.status(500).json({ error: 'Failed to get food details' });
  }
});

// Get common foods
router.get('/common-foods', async (req, res) => {
  try {
    const foods = await usdaService.getCommonFoods();
    res.json(foods);
  } catch (error) {
    console.error('Common foods error:', error);
    res.status(500).json({ error: 'Failed to get common foods' });
  }
});

// Get food categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await usdaService.getFoodCategories();
    res.json(categories);
  } catch (error) {
    console.error('Food categories error:', error);
    res.status(500).json({ error: 'Failed to get food categories' });
  }
});

// Search foods using Nutritionix API
router.get('/nutritionix/search', async (req, res) => {
  try {
    const { query, detailed, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const result = await nutritionixService.searchFoods(
      query as string,
      detailed === 'true',
      limit ? Number(limit) : 10
    );
    
    res.json(result);
  } catch (error) {
    console.error('Nutritionix search error:', error);
    res.status(500).json({ error: 'Failed to search foods using Nutritionix' });
  }
});

// Get food details using Nutritionix API
router.get('/nutritionix/food', async (req, res) => {
  try {
    const { query, quantity, unit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Food query is required' });
    }
    
    const result = await nutritionixService.getFoodDetails(
      query as string,
      quantity ? Number(quantity) : 1,
      unit as string | undefined
    );
    
    res.json(result);
  } catch (error) {
    console.error('Nutritionix food details error:', error);
    res.status(500).json({ error: 'Failed to get food details from Nutritionix' });
  }
});

// Analyze nutrition for multiple food items using Nutritionix API
router.post('/nutritionix/analyze', async (req, res) => {
  try {
    const { foodItems } = req.body;
    
    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: 'Food items array is required' });
    }
    
    const result = await nutritionixService.analyzeNutrition(foodItems);
    res.json(result);
  } catch (error) {
    console.error('Nutritionix nutrition analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition using Nutritionix' });
  }
});

// Get combined search results from both USDA and Nutritionix
router.get('/combined-search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Execute both API calls in parallel for better performance
    const [usdaResults, nutritionixResults] = await Promise.all([
      usdaService.searchFoods({
        query: query as string,
        pageSize: limit ? Number(limit) : 10,
        pageNumber: 1,
      }).catch(error => {
        console.error('USDA search error:', error);
        return { totalHits: 0, foods: [], currentPage: 1, totalPages: 0 };
      }),
      
      nutritionixService.searchFoods(
        query as string,
        false,
        limit ? Number(limit) : 10
      ).catch(error => {
        console.error('Nutritionix search error:', error);
        return { common: [], branded: [] };
      })
    ]);
    
    // Format the results into a unified structure
    const combinedResults = {
      usda: usdaResults.foods || [],
      nutritionix: {
        common: nutritionixResults.common || [],
        branded: nutritionixResults.branded || [],
      },
      totalResults: (usdaResults.foods?.length || 0) + 
                    (nutritionixResults.common?.length || 0) + 
                    (nutritionixResults.branded?.length || 0)
    };
    
    res.json(combinedResults);
  } catch (error) {
    console.error('Combined search error:', error);
    res.status(500).json({ error: 'Failed to perform combined food search' });
  }
});

// Define interface for food nutritional data
interface FoodNutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
}

interface NutritionAssessmentInput {
  age: number;
  gender: string;
  heightFeet: number; // feet
  heightInches: number; // inches
  weight: number; // in lbs
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  existingConditions: string[];
  currentDiet: {
    mealFrequency: number;
    typicalFoods: string[];
    restrictions: string[];
    supplements: string[];
  };
}

// Generate nutritional recommendations based on assessment
router.post('/assessment', async (req, res) => {
  try {
    const assessmentData: NutritionAssessmentInput = req.body;
    
    // Convert from imperial to metric for calculations
    const heightInInches = (assessmentData.heightFeet * 12) + assessmentData.heightInches;
    const heightInCm = heightInInches * 2.54; // inches to cm
    const weightInKg = assessmentData.weight * 0.453592; // lbs to kg
    
    // Calculate BMI
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    // Calculate estimated daily caloric needs using Mifflin-St Jeor Equation
    let bmr = 0;
    if (assessmentData.gender.toLowerCase() === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * assessmentData.age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * assessmentData.age - 161;
    }
    
    // Activity factor
    let activityFactor = 1.2; // Sedentary
    switch (assessmentData.activityLevel.toLowerCase()) {
      case 'lightly active':
        activityFactor = 1.375;
        break;
      case 'moderately active':
        activityFactor = 1.55;
        break;
      case 'very active':
        activityFactor = 1.725;
        break;
      case 'extra active':
        activityFactor = 1.9;
        break;
    }
    
    const tdee = Math.round(bmr * activityFactor); // Total Daily Energy Expenditure
    
    // Fetch nutritional data for typical foods if provided
    let typicalFoodsData: FoodNutritionData[] = [];
    try {
      if (assessmentData.currentDiet.typicalFoods && assessmentData.currentDiet.typicalFoods.length > 0) {
        // Use the first 3 foods to avoid making too many API calls
        const foodsToAnalyze = assessmentData.currentDiet.typicalFoods.slice(0, 3).map(food => ({
          name: food,
          quantity: 1
        }));
        
        const nutritionData = await nutritionixService.analyzeNutrition(foodsToAnalyze).catch(() => null);
        if (nutritionData && nutritionData.foods) {
          typicalFoodsData = nutritionData.foods.map(food => ({
            name: food.food_name,
            calories: food.nf_calories,
            protein: food.nf_protein,
            carbs: food.nf_total_carbohydrate,
            fat: food.nf_total_fat
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching nutritional data for typical foods:', error);
      // Continue without this data if there's an error
    }
    
    // Generate personalized recommendations using OpenAI
    const prompt = `Create a comprehensive nutrition plan based on the following assessment:

Age: ${assessmentData.age}
Gender: ${assessmentData.gender}
Height: ${assessmentData.heightFeet}' ${assessmentData.heightInches}" (${heightInCm.toFixed(1)} cm)
Weight: ${assessmentData.weight} lbs (${weightInKg.toFixed(1)} kg)
BMI: ${bmi.toFixed(1)}
Estimated daily caloric needs: ${tdee} calories
Activity level: ${assessmentData.activityLevel}
Dietary preferences: ${assessmentData.dietaryPreferences.join(', ')}
Health goals: ${assessmentData.healthGoals.join(', ')}
Existing health conditions: ${assessmentData.existingConditions.join(', ')}
Current diet:
- Meals per day: ${assessmentData.currentDiet.mealFrequency}
- Typical foods: ${assessmentData.currentDiet.typicalFoods.join(', ')}
- Dietary restrictions: ${assessmentData.currentDiet.restrictions.join(', ')}
- Supplements: ${assessmentData.currentDiet.supplements.join(', ')}
${typicalFoodsData.length > 0 ? 
`- Nutritional analysis of typical foods:
${typicalFoodsData.map(food => 
  `  * ${food.name}: ${Math.round(food.calories)} calories, ${food.protein.toFixed(1)}g protein, ${food.carbs.toFixed(1)}g carbs, ${food.fat.toFixed(1)}g fat`
).join('\n')}` : ''}

Please provide the following in a JSON format:
1. A summary of their nutritional status
2. Specific macronutrient recommendations (protein, carbs, fat)
3. Key micronutrients they should focus on
4. Meal timing recommendations
5. A 3-day meal plan with breakfast, lunch, dinner, and snacks
6. Food groups they should increase or decrease
7. Specific dietary changes based on their health goals
8. Recommended supplements if necessary
9. Hydration recommendations
10. Long-term nutrition strategy

The response should be structured as a valid JSON object with these 10 sections.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a certified nutritionist using evidence-based recommendations. Provide detailed, personalized nutrition guidance based on assessment data. Format your response as a JSON object with the requested sections." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!aiResponse.choices[0].message?.content) {
      throw new Error('Failed to generate nutrition recommendations');
    }
    
    try {
      const parsedRecommendations = JSON.parse(aiResponse.choices[0].message.content);
      
      // Combine calculated metrics with the recommendations
      const response = {
        metrics: {
          bmi,
          bmr,
          tdee,
          weightCategory: bmi < 18.5 ? 'Underweight' : 
                          bmi < 25 ? 'Healthy Weight' : 
                          bmi < 30 ? 'Overweight' : 'Obesity'
        },
        typicalFoodsAnalysis: typicalFoodsData.length > 0 ? typicalFoodsData : null,
        recommendations: parsedRecommendations
      };
      
      res.json(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({ error: 'Failed to parse nutrition recommendations' });
    }
  } catch (error) {
    console.error('Nutrition assessment error:', error);
    res.status(500).json({ error: 'Failed to generate nutrition recommendations' });
  }
});

// Generate meal plan based on preferences and nutritional needs
router.post('/meal-plan', async (req, res) => {
  try {
    const { 
      calorieTarget, 
      dietaryPreferences, 
      healthGoals, 
      restrictions, 
      numberOfDays = 3,
      useNutritionLookup = true // Flag to enable/disable real nutrition lookups
    } = req.body;
    
    if (!calorieTarget) {
      return res.status(400).json({ error: 'Calorie target is required' });
    }
    
    // Get common foods for meal inspiration if available
    let commonFoodsData: FoodNutritionData[] = [];
    if (useNutritionLookup) {
      try {
        // Determine what foods to look up based on preferences and restrictions
        let foodsToLookup = [];
        
        // Start with some base foods
        if (dietaryPreferences?.includes('vegetarian') || dietaryPreferences?.includes('vegan')) {
          foodsToLookup = ['avocado', 'tofu', 'lentils', 'quinoa', 'broccoli'];
        } else {
          foodsToLookup = ['chicken breast', 'salmon', 'egg', 'spinach', 'sweet potato'];
        }
        
        // Modify based on health goals
        if (healthGoals?.includes('weight loss')) {
          foodsToLookup.push('greek yogurt', 'berries');
        } else if (healthGoals?.includes('muscle building')) {
          foodsToLookup.push('lean beef', 'cottage cheese');
        }
        
        // Get nutrition info for a subset of these foods
        const lookupPromises = foodsToLookup.slice(0, 3).map(async food => {
          try {
            // Try Nutritionix first, as it typically provides richer data
            return await nutritionixService.getFoodDetails(food);
          } catch {
            // Fallback to USDA if Nutritionix lookup fails
            try {
              const results = await usdaService.searchFoods({
                query: food,
                pageSize: 1
              });
              
              if (results.foods && results.foods.length > 0) {
                return await usdaService.getFoodDetails(results.foods[0].fdcId);
              }
              return null;
            } catch {
              return null;
            }
          }
        });
        
        const foodResults = await Promise.all(lookupPromises);
        commonFoodsData = foodResults
          .filter(result => result !== null)
          .map(food => {
            // Handle both API formats
            if ('nf_calories' in food) { // Nutritionix
              return {
                name: food.food_name,
                calories: food.nf_calories,
                protein: food.nf_protein,
                carbs: food.nf_total_carbohydrate,
                fat: food.nf_total_fat,
                servingSize: food.serving_qty + ' ' + food.serving_unit
              };
            } else if (food.foodNutrients) { // USDA
              const macros = usdaService.extractMacronutrients(food.foodNutrients);
              return {
                name: food.description,
                calories: macros.calories,
                protein: macros.protein,
                carbs: macros.carbs,
                fat: macros.fat,
                servingSize: '100g'
              };
            }
            return null;
          })
          .filter(food => food !== null);
      } catch (error) {
        console.error('Error fetching common foods data:', error);
        // Continue without food data if there's an error
      }
    }
    
    const prompt = `Create a detailed ${numberOfDays}-day meal plan that provides approximately ${calorieTarget} calories per day with the following considerations:

Dietary preferences: ${dietaryPreferences ? dietaryPreferences.join(', ') : 'None specified'}
Health goals: ${healthGoals ? healthGoals.join(', ') : 'General health'}
Dietary restrictions: ${restrictions ? restrictions.join(', ') : 'None specified'}

${commonFoodsData.length > 0 ? 
`Below are accurate nutritional values for some foods that should be incorporated in the meal plan:
${commonFoodsData.map(food => 
  `- ${food.name} (${food.servingSize}): ${Math.round(food.calories)} calories, ${food.protein.toFixed(1)}g protein, ${food.carbs.toFixed(1)}g carbs, ${food.fat.toFixed(1)}g fat`
).join('\n')}` : ''}

For each day, provide:
1. Breakfast
2. Morning snack
3. Lunch
4. Afternoon snack
5. Dinner
6. Evening snack (if needed)

For each meal, include:
- Name of the dish
- Brief list of ingredients
- Approximate calories
- Macronutrient breakdown (protein, carbs, fat)
- Brief preparation instructions

The plan should be varied, practical, and use commonly available ingredients. Format the response as a JSON object with days and meals.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a certified nutritionist creating detailed meal plans. Your plans should be balanced, realistic, and aligned with the user's preferences and goals. Format your response as a JSON object with days and meals." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!aiResponse.choices[0].message?.content) {
      throw new Error('Failed to generate meal plan');
    }
    
    try {
      const mealPlan = JSON.parse(aiResponse.choices[0].message.content);
      
      // Include the nutrition data used for reference
      const response = {
        mealPlan,
        referenceNutritionData: commonFoodsData.length > 0 ? commonFoodsData : null
      };
      
      res.json(response);
    } catch (parseError) {
      console.error('Error parsing meal plan:', parseError);
      res.status(500).json({ error: 'Failed to parse meal plan' });
    }
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// Analyze food from image using OpenAI's vision capabilities
router.post('/analyze-food', foodImageUpload.single('image'), async (req, res) => {
  try {
    console.log("Food analysis request received");
    const image = req.file;
    
    if (!image) {
      console.log("No image file received in request");
      return res.status(400).json({ error: 'No image uploaded or invalid image type' });
    }
    
    console.log(`Image received: ${image.originalname}, size: ${image.size}, mimetype: ${image.mimetype}`);
    
    // Convert image to base64 for OpenAI API
    const base64Image = image.buffer.toString('base64');
    
    // Use OpenAI GPT-4 Vision to analyze the food in the image
    console.log("Calling OpenAI API to analyze the food image...");
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API key");
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert that identifies food in images and estimates their nutritional content. Provide precise but realistic estimates for calories and macronutrients. Format your response as JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the food in this image and provide its estimated nutritional information. Return the response as JSON in this format: {\"foodName\": \"name of food\", \"calories\": number, \"carbs\": number, \"protein\": number, \"fat\": number, \"description\": \"brief description\"}"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.mimetype};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });
    
    if (!response.choices[0].message?.content) {
      throw new Error('Failed to analyze food image');
    }
    
    try {
      console.log("OpenAI API response received:", response.choices[0].message.content);
      const openAiNutritionInfo = JSON.parse(response.choices[0].message.content);
      console.log("Parsed OpenAI nutrition info:", openAiNutritionInfo);
      
      let result = {
        foodName: openAiNutritionInfo.foodName,
        calories: Number(openAiNutritionInfo.calories),
        carbs: Number(openAiNutritionInfo.carbs),
        protein: Number(openAiNutritionInfo.protein),
        fat: Number(openAiNutritionInfo.fat),
        description: openAiNutritionInfo.description,
        source: 'openai' // Track source of nutritional data
      };
      
      // Try to get more accurate data from Nutritionix API
      try {
        console.log(`Querying Nutritionix for more accurate data on: ${openAiNutritionInfo.foodName}`);
        const nutritionixData = await nutritionixService.getFoodDetails(openAiNutritionInfo.foodName);
        
        if (nutritionixData) {
          console.log("Nutritionix data found:", nutritionixData);
          
          // Extract macronutrient information
          const macros = nutritionixService.extractMacronutrients(nutritionixData);
          
          // Create a new enriched result object with all the data
          const enrichedResult: any = {
            foodName: nutritionixData.food_name,
            calories: Math.round(macros.calories),
            carbs: Math.round(macros.carbs),
            protein: Math.round(macros.protein),
            fat: Math.round(macros.fat),
            description: openAiNutritionInfo.description,
            servingUnit: nutritionixData.serving_unit,
            servingWeight: nutritionixData.serving_weight_grams,
            servingQty: nutritionixData.serving_qty,
            fiber: Math.round(macros.fiber),
            sugar: Math.round(macros.sugar),
            thumbnailUrl: nutritionixData.photo?.thumb || null,
            source: 'nutritionix'
          };
          
          // Override the result with the enriched data
          result = enrichedResult;
        }
      } catch (error) {
        // Type assertion for error handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log("Could not retrieve Nutritionix data, using OpenAI estimates instead:", errorMessage);
        // Continue with OpenAI data, already set in result
      }
      
      console.log("Sending final response back to client:", result);
      res.json(result);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({ error: 'Failed to parse food analysis' });
    }
  } catch (error) {
    console.error('Food image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze food image' });
  }
});

export default router;
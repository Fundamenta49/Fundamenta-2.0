import { Router } from 'express';
import OpenAI from 'openai';
import axios from 'axios';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Process physical health data
async function processPhysicalHealthData(physicalData: any) {
  // Calculate BMI
  const heightInInches = (physicalData.heightFeet * 12) + physicalData.heightInches;
  const bmi = (physicalData.weight / (heightInInches * heightInInches)) * 703;
  
  // Determine weight category
  let weightCategory = '';
  if (bmi < 18.5) weightCategory = 'Underweight';
  else if (bmi >= 18.5 && bmi < 25) weightCategory = 'Normal weight';
  else if (bmi >= 25 && bmi < 30) weightCategory = 'Overweight';
  else weightCategory = 'Obese';
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  let bmr = 0;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  if (physicalData.gender === 'male') {
    bmr = 10 * physicalData.weight * 0.453592 + 6.25 * heightInInches * 2.54 - 5 * physicalData.age + 5;
  } else {
    bmr = 10 * physicalData.weight * 0.453592 + 6.25 * heightInInches * 2.54 - 5 * physicalData.age - 161;
  }
  
  // Apply activity multiplier
  let activityMultiplier = 1.2; // Default to sedentary
  
  switch (physicalData.activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'lightly active':
      activityMultiplier = 1.375;
      break;
    case 'moderately active':
      activityMultiplier = 1.55;
      break;
    case 'very active':
      activityMultiplier = 1.725;
      break;
    case 'extra active':
      activityMultiplier = 1.9;
      break;
  }
  
  const tdee = bmr * activityMultiplier;
  
  // Structure the data for AI analysis
  const nutritionAnalysisData = {
    metrics: {
      age: physicalData.age,
      gender: physicalData.gender,
      height: `${physicalData.heightFeet}'${physicalData.heightInches}"`,
      weight: `${physicalData.weight} lbs`,
      bmi,
      weightCategory,
      tdee,
      activityLevel: physicalData.activityLevel
    },
    dietaryPreferences: physicalData.dietaryPreferences,
    healthGoals: physicalData.healthGoals,
    existingConditions: physicalData.existingConditions,
    currentDiet: physicalData.currentDiet
  };
  
  // Generate nutrition recommendations using OpenAI
  const nutritionPrompt = `
    Based on the following physical health data, provide comprehensive nutrition recommendations:
    
    Physical Metrics:
    - Age: ${physicalData.age}
    - Gender: ${physicalData.gender}
    - Height: ${physicalData.heightFeet}'${physicalData.heightInches}"
    - Weight: ${physicalData.weight} lbs
    - BMI: ${bmi.toFixed(1)} (${weightCategory})
    - Daily Caloric Needs (TDEE): ${Math.round(tdee)} calories
    - Activity Level: ${physicalData.activityLevel}
    
    Dietary Preferences: ${physicalData.dietaryPreferences.join(', ') || 'None specified'}
    Health Goals: ${physicalData.healthGoals.join(', ') || 'None specified'}
    Existing Conditions: ${physicalData.existingConditions.join(', ') || 'None'}
    
    Current Diet:
    - Typical Foods: ${physicalData.currentDiet.typicalFoods.join(', ') || 'Not specified'}
    - Dietary Restrictions: ${physicalData.currentDiet.restrictions.join(', ') || 'None'}
    - Supplements: ${physicalData.currentDiet.supplements.join(', ') || 'None'}
    - Meals per day: ${physicalData.currentDiet.mealFrequency}
    
    Provide the following in JSON format:
    1. A brief summary of their current nutrition status (1-2 sentences)
    2. Recommended macronutrient breakdown (protein, carbs, fat in grams and as percentages)
    3. Key micronutrients they should focus on based on their profile (list of 3-5)
    4. Food groups to increase and decrease (lists)
    5. Specific dietary changes (list of 3-5 recommendations)
    6. Hydration recommendations
    7. Long-term nutrition strategy (1-2 sentences)
    
    Format as valid JSON with the following structure:
    {
      "summary": "string",
      "macronutrients": {
        "protein": "string",
        "carbs": "string",
        "fat": "string"
      },
      "micronutrients": ["string"],
      "foodGroups": {
        "increase": ["string"],
        "decrease": ["string"]
      },
      "dietaryChanges": ["string"],
      "hydration": "string",
      "longTermStrategy": "string"
    }
  `;
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: nutritionPrompt }],
      response_format: { type: "json_object" }
    });
    
    const nutritionRecommendations = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      physicalMetrics: {
        bmi,
        weightCategory,
        tdee
      },
      recommendations: nutritionRecommendations
    };
  } catch (error) {
    console.error('Error generating nutrition recommendations:', error);
    throw new Error('Failed to generate nutrition recommendations');
  }
}

// Process mental health data
async function processMentalHealthData(mentalData: any) {
  // Calculate PHQ-9 (depression) score
  const phq9Score = mentalData.phq9Answers.reduce((sum: number, answer: any) => sum + answer.value, 0);
  
  // Calculate GAD-7 (anxiety) score
  const gad7Score = mentalData.gad7Answers.reduce((sum: number, answer: any) => sum + answer.value, 0);
  
  // Determine depression severity level
  let depressionLevel = '';
  if (phq9Score <= 4) depressionLevel = 'Minimal';
  else if (phq9Score <= 9) depressionLevel = 'Mild';
  else if (phq9Score <= 14) depressionLevel = 'Moderate';
  else if (phq9Score <= 19) depressionLevel = 'Moderately Severe';
  else depressionLevel = 'Severe';
  
  // Determine anxiety severity level
  let anxietyLevel = '';
  if (gad7Score <= 4) anxietyLevel = 'Minimal';
  else if (gad7Score <= 9) anxietyLevel = 'Mild';
  else if (gad7Score <= 14) anxietyLevel = 'Moderate';
  else anxietyLevel = 'Severe';
  
  // Generate mental health recommendations using OpenAI
  const mentalHealthPrompt = `
    Based on the following mental health assessment results, provide recommendations for mental wellness:
    
    Depression Score (PHQ-9): ${phq9Score}/27 - ${depressionLevel}
    Anxiety Score (GAD-7): ${gad7Score}/21 - ${anxietyLevel}
    
    Provide 5-7 specific, actionable mental wellness recommendations based on these scores.
    The recommendations should be helpful for someone experiencing ${depressionLevel.toLowerCase()} depression and ${anxietyLevel.toLowerCase()} anxiety.
    
    Format the response as a JSON array of strings, each string being a specific recommendation.
    For example: ["recommendation 1", "recommendation 2", ...]
  `;
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: mentalHealthPrompt }],
      response_format: { type: "json_object" }
    });
    
    const mentalHealthRecommendations = JSON.parse(response.choices[0].message.content || '[]');
    
    return {
      mentalMetrics: {
        depressionScore: phq9Score,
        depressionLevel,
        anxietyScore: gad7Score,
        anxietyLevel
      },
      recommendations: mentalHealthRecommendations
    };
  } catch (error) {
    console.error('Error generating mental health recommendations:', error);
    throw new Error('Failed to generate mental health recommendations');
  }
}

// Generate integrated recommendations
async function generateIntegratedRecommendations(physicalResults: any, mentalResults: any) {
  const integratedPrompt = `
    I need to create holistic wellness recommendations that integrate both physical and mental health data.
    
    Physical Health Profile:
    - BMI: ${physicalResults.physicalMetrics.bmi.toFixed(1)} (${physicalResults.physicalMetrics.weightCategory})
    - Daily Caloric Needs: ${Math.round(physicalResults.physicalMetrics.tdee)} calories
    
    Mental Health Profile:
    - Depression Level: ${mentalResults.mentalMetrics.depressionLevel} (Score: ${mentalResults.mentalMetrics.depressionScore}/27)
    - Anxiety Level: ${mentalResults.mentalMetrics.anxietyLevel} (Score: ${mentalResults.mentalMetrics.anxietyScore}/21)
    
    Nutrition Analysis:
    ${physicalResults.recommendations.summary}
    
    Mental Health Recommendations:
    ${JSON.stringify(mentalResults.recommendations)}
    
    Create 6-8 holistic wellness recommendations that address the connections between physical and mental health.
    These should integrate the nutrition and mental health aspects into cohesive, actionable recommendations.
    
    Format the response as a JSON array of strings, each string being an integrated recommendation.
    For example: ["integrated recommendation 1", "integrated recommendation 2", ...]
  `;
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: integratedPrompt }],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content || '[]');
  } catch (error) {
    console.error('Error generating integrated recommendations:', error);
    throw new Error('Failed to generate integrated recommendations');
  }
}

// Comprehensive wellness assessment endpoint
router.post('/assessment', async (req, res) => {
  try {
    const { physicalHealth, mentalHealth } = req.body;
    
    // Process physical health data
    const physicalResults = await processPhysicalHealthData(physicalHealth);
    
    // Process mental health data
    const mentalResults = await processMentalHealthData(mentalHealth);
    
    // Generate integrated recommendations
    const integratedRecommendations = await generateIntegratedRecommendations(physicalResults, mentalResults);
    
    // Combine all results
    const comprehensiveResults = {
      physicalMetrics: physicalResults.physicalMetrics,
      mentalMetrics: mentalResults.mentalMetrics,
      recommendations: {
        nutrition: physicalResults.recommendations,
        mentalWellness: mentalResults.recommendations,
        integratedWellness: integratedRecommendations
      }
    };
    
    res.json(comprehensiveResults);
  } catch (error) {
    console.error('Error processing comprehensive wellness assessment:', error);
    res.status(500).json({ error: 'Failed to process assessment' });
  }
});

export default router;
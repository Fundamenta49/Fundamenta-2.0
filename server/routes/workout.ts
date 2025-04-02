import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
router.post('/generate-workout', async (req, res) => {
  try {
    const { profile } = req.body;

    const prompt = `Create a personalized workout plan for a ${profile.fitnessLevel} level person with the following fitness goals: ${profile.goals.join(', ')}. 

    Consider these specific aspects for the workout plan:
    1. Current Fitness Level: ${profile.fitnessLevel}
    2. Goals: ${profile.goals.map(goal => `\n       - ${goal}`).join('')}

    Provide a detailed, encouraging, and educational workout plan that includes:
    1. A thorough explanation of each exercise, including:
       - Proper form and technique
       - Common mistakes to avoid
       - Modifications for different fitness levels
       - How this exercise specifically helps with their goals
    2. Progressive overload recommendations
    3. Rest periods and recovery tips
    4. Goal-specific guidance (e.g. for weight loss: intensity recommendations, for flexibility: proper stretching technique)
    5. Safety precautions specific to their fitness level

    For video tutorials, use these verified IDs for exercises (these are from reputable trainers with proper form demonstrations):
    - Push-ups: "IODxDxX7oi4"
    - Plank: "ASdvN_XEl_c"
    - Squats: "YaXPRqUwItQ"
    - Mountain Climbers: "nmwgirgXLYM"
    - Lunges: "QOVaHwm-Q6U"
    - Standing Forward Bend: "g_tea8ZNk5A"
    - Child's Pose: "eqVMAPM0XfY"
    - Downward Dog: "YqOqM5BV0gE"
    - Cat-Cow Stretch: "kqnua4rHVVA"
    - Core Workout: "DHD1-2P94DM"
    - Bird Dog: "wiFNA3sqjCA"
    - Bridge Exercise: "GcwIGS7e8T0"

    For exercise illustrations, use these specific Lucide React icons to match exercises:
    - Strength Training: "dumbbell" (e.g., push-ups, squats, planks)
    - Cardio: "activity" (e.g., mountain climbers, jumping jacks)
    - Flexibility: "movevertical" (e.g., stretches, forward bends)
    - Balance: "timer" (e.g., single-leg exercises)
    - High Intensity: "zap" (e.g., burpees, HIIT exercises)
    - Recovery/Stretching: "heart" (e.g., child's pose, relaxation)
    - Yoga: "yoga" (e.g., downward dog, warrior poses)

    Format the response as a JSON object with the following structure:
    {
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": number,
          "description": string (detailed form instructions),
          "technique": string (proper form guidance),
          "mistakes": string[] (common mistakes to avoid),
          "modifications": {
            "easier": string,
            "harder": string
          },
          "goalAlignment": string (how this exercise helps with their specific goals),
          "videoId": string (YouTube video ID from the list above),
          "illustration": string (name of Lucide React icon to use from the list above)
        }
      ],
      "schedule": string (weekly plan with rest days),
      "progressionPlan": string (how to advance over time),
      "tips": {
        "general": string[],
        "goalSpecific": {
          "goalName": string[],
        },
        "safety": string[]
      }
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a professional fitness trainer with expertise in creating personalized workout plans. You specialize in providing detailed, encouraging, and educational guidance that helps people achieve their specific fitness goals safely and effectively. Always use the provided video IDs and icon names for consistency and reliability. Match exercises with their corresponding pre-verified video IDs and appropriate icons to ensure a cohesive experience." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const workoutPlan = JSON.parse(response.choices[0].message.content || "{}");
    res.json(workoutPlan);

  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

export default router;
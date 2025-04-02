import express from 'express';
import { OpenAI } from "openai";

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to get depression severity level
const getDepressionLevel = (score: number) => {
  if (score >= 0 && score <= 4) return "Minimal";
  if (score >= 5 && score <= 9) return "Mild";
  if (score >= 10 && score <= 14) return "Moderate";
  if (score >= 15 && score <= 19) return "Moderately Severe";
  if (score >= 20) return "Severe";
  return "Unknown";
};

// Helper function to get anxiety severity level
const getAnxietyLevel = (score: number) => {
  if (score >= 0 && score <= 4) return "Minimal";
  if (score >= 5 && score <= 9) return "Mild";
  if (score >= 10 && score <= 14) return "Moderate";
  if (score >= 15) return "Severe";
  return "Unknown";
};

// Get AI-generated recommendations based on assessment scores
router.post('/recommendations', async (req, res) => {
  try {
    const { depressionScore, anxietyScore } = req.body;
    
    if (typeof depressionScore !== 'number' || typeof anxietyScore !== 'number') {
      return res.status(400).json({ error: 'Invalid scores provided' });
    }
    
    const depressionLevel = getDepressionLevel(depressionScore);
    const anxietyLevel = getAnxietyLevel(anxietyScore);
    
    // Generate personalized recommendations using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a mental wellness coach specializing in evidence-based strategies for managing mental health. 
          You provide practical, actionable recommendations that are appropriate for the user's current emotional state.
          You should provide recommendations that are specific, practical, and easy to implement.
          Format your response as a JSON array of string recommendations.
          Each recommendation should be a single, clear action item.
          Provide 5-7 recommendations total.`
        },
        {
          role: "user",
          content: `Based on a mental health screening, I have a depression score indicating "${depressionLevel}" level symptoms (PHQ-9) 
          and an anxiety score indicating "${anxietyLevel}" level symptoms (GAD-7). 
          Please provide appropriate mental wellness recommendations for my situation.
          Remember to respond with only a JSON array of strings.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    try {
      const content = response.choices[0].message.content || '';
      if (!content) {
        throw new Error('No content returned from AI');
      }
      
      const result = JSON.parse(content);
      if (Array.isArray(result.recommendations)) {
        return res.json({ recommendations: result.recommendations });
      } else {
        // Handle case where AI didn't return expected format
        throw new Error('Invalid response format from AI');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback recommendations if parsing fails
      const fallbackRecommendations = [
        "Practice daily mindfulness meditation for 10-15 minutes",
        "Maintain a regular sleep schedule, aiming for 7-8 hours per night",
        "Engage in moderate physical activity for at least 30 minutes daily",
        "Connect with friends or family members regularly",
        "Consider speaking with a mental health professional for personalized guidance"
      ];
      
      if (depressionLevel !== "Minimal" || anxietyLevel !== "Minimal") {
        fallbackRecommendations.push("Establish a daily routine to provide structure");
        fallbackRecommendations.push("Limit consumption of news and social media");
      }
      
      if (depressionLevel === "Moderate" || depressionLevel === "Moderately Severe" || depressionLevel === "Severe" || 
          anxietyLevel === "Moderate" || anxietyLevel === "Severe") {
        fallbackRecommendations.push("Consider reaching out to a mental health professional soon");
      }
      
      return res.json({ recommendations: fallbackRecommendations });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
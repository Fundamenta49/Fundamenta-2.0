import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { QuizQuestion } from '../../client/src/components/quiz-component';
import { Resource } from '../../client/src/components/resource-links';
import { generateQuiz, gradeQuiz } from '../services/quiz-service';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI-powered quiz questions for a subject using our hybrid approach
 */
router.post('/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, numberOfQuestions = 5, topics = [] } = req.body;
    
    console.log(`Generating ${numberOfQuestions} ${difficulty} questions about ${subject}`);
    
    const quizData = await generateQuiz(
      subject, 
      difficulty, 
      numberOfQuestions, 
      topics
    );
    
    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

/**
 * Get recommended learning resources
 */
router.post('/resources', async (req: Request, res: Response) => {
  try {
    const { subject, userLevel, interests = [], previousProgress = 0 } = req.body;
    
    // Build prompt for OpenAI
    const prompt = `
      Recommend learning resources for ${subject} at a ${userLevel} level.
      ${interests.length > 0 ? `The user is interested in: ${interests.join(', ')}.` : ''}
      The user's current progress level is: ${previousProgress}% complete.
      
      Provide a mix of different resource types (articles, videos, books, courses, tools, practice exercises).
      For each resource:
      1. Provide a descriptive title
      2. Write a brief description of what the resource covers
      3. Include a realistic URL (use real websites like Khan Academy, Coursera, YouTube, etc.)
      4. Specify the resource type
      5. Indicate the appropriate level (beginner, intermediate, advanced)
      6. For videos and courses, include an estimated duration
      7. Indicate if the resource is free or paid
      8. Add relevant tags for categorization
      
      Format the response as a valid JSON object with the following structure:
      {
        "resources": [
          {
            "id": string,
            "title": string,
            "description": string,
            "url": string,
            "type": "article" | "video" | "book" | "course" | "tool" | "practice",
            "level": "beginner" | "intermediate" | "advanced",
            "duration": string (optional),
            "free": boolean (optional),
            "tags": string[]
          }
        ]
      }
      
      Provide at least 6 resources.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert educational resource curator who specializes in finding the most valuable learning materials for various subjects. Provide helpful, accurate, and relevant resources that match the user's level and interests."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    if (!response.choices[0].message.content) {
      throw new Error('No content received from OpenAI');
    }
    
    const content = response.choices[0].message.content;
    const resourceData = JSON.parse(content);
    
    res.json(resourceData);
  } catch (error) {
    console.error('Error generating resources:', error);
    res.status(500).json({ error: 'Failed to generate learning resources' });
  }
});

/**
 * Submit quiz results and get personalized feedback
 */
router.post('/submit-quiz-results', async (req: Request, res: Response) => {
  try {
    const { subject, userAnswers, correctAnswers, difficulty } = req.body;
    
    // Use our grading service if we have user's specific answers
    if (Array.isArray(userAnswers) && Array.isArray(correctAnswers)) {
      console.log('Grading quiz with detailed answers');
      
      // Use our grading service
      const gradeResults = await gradeQuiz(userAnswers, correctAnswers);
      
      // Enhance feedback with OpenAI if needed
      if (subject) {
        // Build prompt for OpenAI to get more personalized advice
        const prompt = `
          A user has completed a quiz on ${subject} at the ${difficulty} level.
          They scored ${gradeResults.score} out of ${correctAnswers.length} (${gradeResults.percentageScore.toFixed(1)}%).
          They got questions ${gradeResults.incorrectQuestions.map(i => i + 1).join(', ')} wrong.
          
          Based on this performance:
          1. Provide 3 specific actions they can take to improve their understanding of ${subject}
          
          Format your response as a JSON object with this structure:
          {
            "suggestedActions": string[]
          }
        `;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are an encouraging educational coach who provides helpful, constructive feedback to learners. Your tone is supportive but honest, and you focus on growth and improvement."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        });
        
        if (response.choices[0].message.content) {
          const aiSuggestions = JSON.parse(response.choices[0].message.content);
          gradeResults.suggestedActions = aiSuggestions.suggestedActions;
        }
      }
      
      return res.json(gradeResults);
    } 
    // Backward compatibility with old format
    else if (typeof req.body.score === 'number' && typeof req.body.totalQuestions === 'number') {
      const { score, totalQuestions } = req.body;
      const percentage = (score / totalQuestions) * 100;
      
      // Build prompt for OpenAI
      const prompt = `
        A user has completed a quiz on ${subject} at the ${difficulty} level.
        They scored ${score} out of ${totalQuestions} (${percentage.toFixed(1)}%).
        
        Based on this performance:
        1. Provide personalized, encouraging feedback on their performance
        2. Suggest 3 specific actions they can take to improve their understanding
        
        Format your response as a JSON object with this structure:
        {
          "feedback": string,
          "suggestedActions": string[]
        }
      `;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an encouraging educational coach who provides helpful, constructive feedback to learners. Your tone is supportive but honest, and you focus on growth and improvement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      if (!response.choices[0].message.content) {
        throw new Error('No content received from OpenAI');
      }
      
      const content = response.choices[0].message.content;
      const feedbackData = JSON.parse(content);
      
      return res.json(feedbackData);
    } else {
      throw new Error('Invalid quiz submission format');
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

/**
 * Track user's learning progress for personalized recommendations
 */
router.post('/track-progress', (req: Request, res: Response) => {
  try {
    // Here you would store the user's learning activity in a database
    // For now, we'll just log it and return success
    console.log('Learning progress tracked:', req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ error: 'Failed to track progress' });
  }
});

export default router;
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { orchestrateAIResponse } from "./ai";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from 'openai';
import { MockOpenAI } from './services/mock-openai';
import multer from 'multer';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from "mammoth";
import axios from 'axios';
import resumeRoutes from './routes/resume';
import learningRoutes from './routes/learning';
import youtubeRoutes, { youtubeSearchHandler } from './routes/youtube';
import nhtsaRoutes from './routes/nhtsa';
import chatRoutes from './routes/chat';
import journalRoutes from './routes/journal';
import brainTapRoutes from './routes/brain-tap';
import nutritionRoutes from './routes/nutrition';
import comprehensiveWellnessRoutes from './routes/comprehensive-wellness';
import shoppingRoutes from './routes/shopping';
import cookingRoutes from './routes/cooking';
import { searchJobs as searchJobsFromApi, getSalaryInsights as getAdzunaSalaryInsights } from './jobs';
import { getOccupationInterviewQuestions } from './career-one-stop-service';
import { 
  getEmergencyGuidance,
  optimizeResume,
  analyzeInterviewAnswer,
  generateJobQuestions,
  generateCoverLetter,
  assessCareer,
  searchJobs,
  createLinkToken,
  exchangePublicToken,
  getTransactions,
} from './services/api-functions';

// Import schemas from api-functions
import { 
  resumeSchema,
  interviewAnalysisSchema,
  coverLetterSchema 
} from './services/api-functions';

// Use mock OpenAI in development
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : new MockOpenAI({});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const messageSchema = z.object({
  message: z.string(),
  category: z.enum(['cooking', 'career', 'emergency', 'finance', 'wellness', 'learning', 'fitness']),
  previousMessages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    timestamp: z.date().optional(),
    category: z.string().optional()
  })),
  context: z.object({
    currentPage: z.string(),
    currentSection: z.string().optional(),
    availableActions: z.array(z.string())
  }).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      console.log("Incoming chat request:", req.body); // Debug log
      const validatedData = messageSchema.parse(req.body);

      let systemMessage = `You are Fundi, a friendly and supportive AI assistant.
        Format your responses following these strict rules:
        - Use only plain text - no special formatting characters
        - Never use asterisks (*) or hashtags (#) in your responses
        - Never use markdown syntax
        - Use simple bullet points with a dash (-) for lists
        - Add double line breaks between topics
        - Start new sections with friendly emojis
        - Keep everything in a conversational, friendly tone

        You can perform the following actions:
        - Navigate to different sections of the app
        - Fill in forms with user information
        - Show relevant guides and tutorials
        - Trigger specific features based on user requests`;

      // Add category-specific context
      switch (validatedData.category) {
        case "cooking":
          systemMessage += `\nAs a friendly cooking mentor 👩‍🍳, help users develop their kitchen skills with enthusiasm!`;
          break;
        case "career":
          systemMessage += `\nAs a supportive career mentor 💼, offer encouraging but practical advice.`;
          break;
        case "emergency":
          systemMessage += `\nStay calm and clear while providing crucial guidance.`;
          break;
        case "finance":
          systemMessage += `\nAs a friendly financial guide 💰, explain concepts in simple, relatable terms.`;
          break;
        case "wellness":
          systemMessage += `\nAs a caring wellness guide 🌱, provide compassionate support for health and wellbeing.`;
          break;
        case "learning":
          systemMessage += `\nAs an encouraging learning coach 📚, help users discover and grow!`;
          break;
        case "fitness":
          systemMessage += `\nAs your dedicated fitness coach 💪, I'll help you achieve your exercise goals!`;
          break;
        default:
          systemMessage += `\nLet me help guide you through our features and capabilities.`;
          break;
      }

      // Consider previous messages for context
      const conversationHistory = validatedData.previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add context information for better orchestration
      if (validatedData.context) {
        systemMessage += `\n\nCurrent Context:
        - Page: ${validatedData.context.currentPage}
        - Section: ${validatedData.context.currentSection || 'None'}
        - Available Actions: ${validatedData.context.availableActions.join(', ')}`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          ...conversationHistory,
          {
            role: "user",
            content: validatedData.message
          }
        ],
        response_format: { type: "json_object" }
      });

      if (!response.choices[0].message?.content) {
        throw new Error('No response content received from AI');
      }

      const responseData = JSON.parse(response.choices[0].message.content);

      res.json({
        success: true,
        response: responseData.response,
        actions: responseData.actions,
        suggestions: responseData.suggestions
      });

    } catch (error: any) {
      console.error("Chat error details:", {
        name: error?.name,
        message: error?.message,
        errors: error?.errors, // Zod validation errors
        stack: error?.stack
      });

      res.status(400).json({
        error: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error?.errors || error?.message : undefined,
        success: false
      });
    }
  });

  app.post("/api/chat/orchestrator", async (req, res) => {
    try {
      const requestSchema = z.object({
        message: z.string(),
        context: z.object({
          currentPage: z.string(),
          currentSection: z.string().optional(),
          availableActions: z.array(z.string())
        }),
        category: z.string().optional(),
        previousMessages: z.array(z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        }))
      });

      const validatedData = requestSchema.parse(req.body);
      const response = await orchestrateAIResponse(
        validatedData.message,
        validatedData.context,
        validatedData.category,
        validatedData.previousMessages
      );

      res.json({
        success: true,
        response: response.response,
        actions: response.actions,
        suggestions: response.suggestions,
        category: response.category,
        sentiment: response.sentiment,
        confidence: response.confidence,
        followUpQuestions: response.followUpQuestions
      });

    } catch (error: any) {
      console.error("Chat orchestrator error:", error);
      res.status(400).json({
        error: "Failed to process request",
        success: false
      });
    }
  });

  // Test endpoint for PDF parsing
  app.post("/api/test/pdf-parse", upload.single('pdf'), async (req, res) => {
    try {
      console.log("Starting PDF test parse endpoint");

      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file uploaded or invalid file type. Please upload a PDF file."
        });
      }

      console.log("Test PDF upload details:", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer.length
      });

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({
          error: true,
          message: "Invalid file type. Please upload a PDF file."
        });
      }

      try {
        // Create a fresh buffer from the file
        const dataBuffer = new Uint8Array(req.file.buffer);
        console.log("Test endpoint: Buffer created successfully, length:", dataBuffer.length);

        const pdfDoc = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
        }
        console.log("Test endpoint: PDF parsed successfully, text length:", text.length);
        console.log("Test endpoint: First 100 characters:", text.substring(0, 100));

        res.json({
          success: true,
          textLength: text.length,
          preview: text.substring(0, 100),
          pageCount: pdfDoc.numPages,
          info: {}
        });

      } catch (pdfError) {
        console.error("Test endpoint PDF parsing error details:", {
          name: (pdfError as Error).name,
          message: (pdfError as Error).message,
          stack: (pdfError as Error).stack
        });

        throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
      }
    } catch (error: any) {
      console.error("Test endpoint error:", error);
      res.status(500).json({
        error: true,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // Main resume parsing endpoint
  app.post("/api/resume/parse", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file uploaded or invalid file type. Please upload a PDF or Word document."
        });
      }

      console.log("Processing uploaded file:", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer.length
      });

      let extractedText = '';

      try {
        if (req.file.mimetype === 'application/pdf') {
          console.log("Processing PDF file...");
          const dataBuffer = new Uint8Array(req.file.buffer);
          console.log("Buffer created successfully, length:", dataBuffer.length);

          try {
            const pdfDoc = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
            let text = '';
            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i);
              const textContent = await page.getTextContent();
              text += textContent.items
                .map((item: any) => ('str' in item ? item.str : ''))
                .join(' ');
            }
            extractedText = text;
            console.log("PDF text extracted successfully, length:", extractedText.length);
          } catch (pdfError) {
            console.error("PDF parsing error details:", {
              name: (pdfError as Error).name,
              message: (pdfError as Error).message,
              stack: (pdfError as Error).stack
            });
            throw new Error("Could not parse PDF content. Please ensure the file is not corrupted or password protected.");
          }
        } else if (req.file.mimetype.includes('word')) {
          console.log("Processing Word document...");
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = result.value;
          console.log("Word document text extracted successfully, length:", extractedText.length);
        }

        if (!extractedText || extractedText.trim().length === 0) {
          console.error("No text extracted from document");
          throw new Error("No text could be extracted from the document. Please ensure the file contains readable text.");
        }

        console.log("Starting resume analysis with OpenAI...");
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `Extract structured information from the resume text into JSON format matching this schema:
              {
                "personalInfo": {
                  "name": string,
                  "email": string,
                  "phone": string,
                  "summary": string
                },
                "education": [
                  {
                    "school": string,
                    "degree": string,
                    "year": string
                  }
                ],
                "experience": [
                  {
                    "company": string,
                    "position": string,
                    "duration": string,
                    "description": string
                  }
                ]
              }

              Guidelines:
              - If a field can't be found, use an empty string
              - Format dates consistently
              - Keep descriptions concise
              - Ensure valid JSON output`
            },
            {
              role: "user",
              content: extractedText
            }
          ],
          response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(response.choices[0].message.content || "{}");
        console.log("Resume successfully parsed and analyzed");

        res.json({
          success: true,
          data: parsedData
        });

      } catch (error: any) {
        console.error("Resume processing error:", error);
        res.status(400).json({
          error: true,
          message: error instanceof Error ? error.message : "Failed to process the resume",
          details: error instanceof Error ? error.stack : undefined
        });
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        error: true,
        message: "An unexpected error occurred while processing your request."
      });
    }
  });

  app.post("/api/emergency/guidance", async (req, res) => {
    try {
      const { situation } = z.object({ situation: z.string() }).parse(req.body);
      const guidance = await getEmergencyGuidance(situation);
      res.json({ guidance });
    } catch (error: any) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/resume/optimize", async (req, res) => {
    try {
      const resumeData = resumeSchema.parse(req.body);
      const optimizedResume = await optimizeResume(resumeData);
      res.json({ suggestions: JSON.parse(optimizedResume) });
    } catch (error: any) {
      console.error("Resume optimization error:", error);
      res.status(400).json({ error: "Failed to optimize resume" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/interview/analyze", async (req, res) => {
    try {
      const data = interviewAnalysisSchema.parse(req.body);
      const { answer, question, industry } = data;

      if (!answer.trim() || !question.trim() || !industry.trim()) {
        return res.status(400).json({
          error: "Missing required fields. Please provide answer, question, and industry."
        });
      }

      const feedback = await analyzeInterviewAnswer(answer, question, industry);
      res.json({ feedback });
    } catch (error: any) {
      console.error("Interview analysis error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Interview analysis service is currently unavailable. Please try again later."
        });
      }

      if (error?.error?.type === "invalid_request_error") {
        return res.status(400).json({
          error: "Invalid API request. Please check your input."
        });
      }

      if (error.message?.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to analyze interview response. Please try again later."
      });
    }
  });

  app.post("/api/interview/questions", async (req, res) => {
    try {
      const { jobField } = z.object({ jobField: z.string() }).parse(req.body);

      if (!jobField.trim()) {
        return res.status(400).json({
          error: "Please provide a job field."
        });
      }

      // First try to get questions from Career One Stop API
      const careerOneStopApiKey = process.env.CAREER_ONE_STOP_API_KEY;
      
      if (careerOneStopApiKey) {
        try {
          // Try to get occupation-specific questions from Career One Stop
          const careerOneStopQuestions = await getOccupationInterviewQuestions(jobField, careerOneStopApiKey);
          
          if (careerOneStopQuestions && careerOneStopQuestions.length > 0) {
            return res.json({ 
              questions: careerOneStopQuestions,
              source: "career-one-stop"
            });
          }
        } catch (apiError) {
          console.error("Career One Stop API error:", apiError);
          // Continue to fallback if Career One Stop fails
        }
      }

      // Fallback to OpenAI if Career One Stop failed or returned no results
      const questions = await generateJobQuestions(jobField);
      res.json({ 
        questions,
        source: "openai" 
      });
    } catch (error: any) {
      console.error("Question generation error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Question generation service is currently unavailable. Please try again later."
        });
      }

      if (error.message?.includes('rate limit exceeded')) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again."
        });
      }

      res.status(500).json({
        error: "Failed to generate interview questions. Please try again later."
      });
    }
  });
  
  // Dedicated endpoint specifically for Career One Stop API questions
  app.post("/api/interview/questions/career-one-stop", async (req, res) => {
    try {
      const { occupation } = z.object({ occupation: z.string() }).parse(req.body);

      if (!occupation.trim()) {
        return res.status(400).json({
          error: "Please provide an occupation."
        });
      }
      
      const careerOneStopApiKey = process.env.CAREER_ONE_STOP_API_KEY;
      
      if (!careerOneStopApiKey) {
        return res.status(503).json({
          error: "Career One Stop API key is not configured. Please contact support."
        });
      }
      
      const questions = await getOccupationInterviewQuestions(occupation, careerOneStopApiKey);
      
      if (!questions || questions.length === 0) {
        return res.status(404).json({
          error: "No questions found for this occupation. Please try a different occupation or use the standard question endpoint."
        });
      }
      
      res.json({ 
        questions,
        occupation,
        count: questions.length
      });
    } catch (error: any) {
      console.error("Career One Stop question error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please provide a valid occupation."
        });
      }
      
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          error: "Occupation not found in Career One Stop database."
        });
      }
      
      if (error.response && error.response.status === 401) {
        return res.status(401).json({
          error: "Unauthorized access to Career One Stop API. Please check API credentials."
        });
      }

      res.status(500).json({
        error: "Failed to retrieve occupation questions. Please try again later."
      });
    }
  });

  app.post("/api/cover-letter/generate", async (req, res) => {
    try {
      const data = coverLetterSchema.parse(req.body);
      
      const letterContent = await generateCoverLetter(data);
      res.json({ content: letterContent });
    } catch (error: any) {
      console.error("Cover letter generation error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      if (error?.error?.type === "invalid_api_key") {
        return res.status(503).json({
          error: "Cover letter generation service is currently unavailable. Please try again later."
        });
      }

      res.status(500).json({
        error: "Failed to generate cover letter. Please try again later."
      });
    }
  });

  app.post("/api/career/assess", async (req, res) => {
    try {
      const schema = z.record(z.string(), z.string());
      const answers = schema.parse(req.body);
      
      const assessment = await assessCareer(answers);
      res.json(assessment);
    } catch (error: any) {
      console.error("Career assessment error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please check your input."
        });
      }

      res.status(500).json({
        error: "Failed to assess career options. Please try again later."
      });
    }
  });

  app.post("/api/jobs/search", async (req, res) => {
    try {
      const { query, location, sources } = z.object({
        query: z.string(),
        location: z.string(),
        sources: z.array(z.string()).optional()
      }).parse(req.body);
      
      const searchParams = {
        query,
        location,
        sources: sources || ['indeed', 'linkedin', 'ziprecruiter', 'adzuna']
      };
      
      // Use the imported searchJobsFromApi function instead of searchJobs from api-functions
      const jobs = await searchJobsFromApi(searchParams);
      res.json({ jobs });
    } catch (error: any) {
      console.error("Job search error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please provide query and location."
        });
      }

      res.status(500).json({
        error: "Failed to search for jobs. Please try again later."
      });
    }
  });

  app.post("/api/salary/insights", async (req, res) => {
    try {
      const { jobTitle, location } = z.object({
        jobTitle: z.string(),
        location: z.string()
      }).parse(req.body);
      
      // Use our new getAdzunaSalaryInsights function from jobs.ts
      const insights = await getAdzunaSalaryInsights(jobTitle, location);
      res.json(insights);
      
      console.log("Salary insights successfully retrieved from Adzuna for:", jobTitle);
    } catch (error: any) {
      console.error("Salary insights error:", error);

      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid request format. Please provide jobTitle and location."
        });
      }

      res.status(500).json({
        error: "Failed to get salary insights. Please try again later."
      });
    }
  });

  // Financial APIs (Plaid integration)
  app.post("/api/finance/create-link-token", async (req, res) => {
    try {
      const token = await createLinkToken();
      res.json({ link_token: token });
    } catch (error: any) {
      console.error("Plaid link token error:", error);
      res.status(500).json({
        error: "Failed to create link token. Please try again later."
      });
    }
  });

  app.post("/api/finance/exchange-token", async (req, res) => {
    try {
      const { publicToken } = z.object({
        publicToken: z.string()
      }).parse(req.body);
      
      const accessToken = await exchangePublicToken(publicToken);
      res.json({ access_token: accessToken });
    } catch (error: any) {
      console.error("Plaid token exchange error:", error);
      res.status(500).json({
        error: "Failed to exchange token. Please try again later."
      });
    }
  });

  app.post("/api/finance/transactions", async (req, res) => {
    try {
      const { accessToken } = z.object({
        accessToken: z.string()
      }).parse(req.body);
      
      const transactions = await getTransactions(accessToken);
      res.json({ transactions });
    } catch (error: any) {
      console.error("Plaid transactions error:", error);
      res.status(500).json({
        error: "Failed to fetch transactions. Please try again later."
      });
    }
  });

  // Include resume routes
  app.use('/api/resume', resumeRoutes);
  
  // Include learning routes
  app.use('/api/learning', learningRoutes);
  
  // Include YouTube API routes
  app.use('/api/youtube', youtubeRoutes);
  
  // General YouTube search endpoint for multiple components
  app.get('/api/youtube-search', youtubeSearchHandler);
  
  // Include NHTSA API routes
  app.use('/api/nhtsa', nhtsaRoutes);
  
  // Include Chat API routes
  app.use('/api/chat', chatRoutes);
  
  // Register journal routes
  app.use('/api/journal', journalRoutes);
  
  // Register brain tap (mental health assessment) routes
  app.use('/api/brain-tap', brainTapRoutes);
  
  // Register nutrition assessment routes
  app.use('/api/nutrition', nutritionRoutes);
  
  // Register comprehensive wellness assessment routes
  app.use('/api/wellness/comprehensive', comprehensiveWellnessRoutes);
  
  // Register shopping routes
  app.use('/api/shopping', shoppingRoutes);
  
  // Register cooking routes
  app.use('/api/cooking', cookingRoutes);

  // Return an HTTP server
  return createServer(app);
}
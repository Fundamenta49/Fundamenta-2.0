import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set up multer for file uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/pdf', 
      'text/plain', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.") as any);
    }
  }
});

// Enhanced response interface with additional sections
export interface ResumeParseResponse {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  projects?: string;
  certifications?: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  }
}

/**
 * Parses a resume text using OpenAI's GPT-4o model
 * Extracts structured information from the raw resume text
 */
export async function parseResume(resumeText: string): Promise<ResumeParseResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a resume parsing assistant that extracts structured information from raw resume text.
          Also provide a professional analysis of the resume with strengths, weaknesses, and suggestions for improvement.
          Format your response as JSON with the following structure:
          {
            "name": "",
            "email": "",
            "phone": "",
            "summary": "",  
            "education": "",
            "experience": "",
            "skills": "",
            "projects": "",
            "certifications": "",
            "analysis": {
              "strengths": ["", "", ""],
              "weaknesses": ["", "", ""],
              "suggestions": ["", "", ""]
            }
          }
          If you can't extract certain fields, return empty strings for those fields, but make your best effort to extract as much as possible.
          For the analysis, provide 3-5 items for each category based on the resume content.`
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      name: result.name || "",
      email: result.email || "",
      phone: result.phone || "",
      summary: result.summary || "",
      education: result.education || "",
      experience: result.experience || "",
      skills: result.skills || "",
      projects: result.projects || "",
      certifications: result.certifications || "",
      analysis: {
        strengths: result.analysis?.strengths || [],
        weaknesses: result.analysis?.weaknesses || [],
        suggestions: result.analysis?.suggestions || []
      }
    };
  } catch (error) {
    console.error("Error parsing resume with OpenAI:", error);
    throw new Error("Failed to analyze resume with AI. Please try again later.");
  }
}

/**
 * Enhances a resume section with AI-generated suggestions
 * @param section The section name (e.g., "summary", "experience")
 * @param content The current content of the section
 * @returns An array of improved versions of the section
 */
export async function enhanceResumeSection(
  section: string,
  content: string
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a professional resume writer who specializes in creating impactful ${section} sections. 
          Your task is to improve the provided ${section} content to be more professional, concise, and impactful.
          
          For each improvement:
          - Use strong action verbs
          - Include specific, quantifiable achievements when possible
          - Eliminate fluff and redundancy
          - Ensure proper formatting and consistency
          - Focus on relevant skills and accomplishments
          
          Return your response as a JSON array with exactly 3 different, improved versions of the content.
          Each suggestion should be complete and ready to be used directly in a resume.
          Format: { "suggestions": [string, string, string] }`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(response.choices[0].message.content);
    return result.suggestions || [];
  } catch (error) {
    console.error("Error enhancing resume section with OpenAI:", error);
    throw new Error("Failed to enhance resume section. Please try again later.");
  }
}

/**
 * Optimizes a resume for a specific job position
 * @param resumeData The current resume sections
 * @param targetJob The job title to optimize for
 * @param jobDescription Optional job description for better targeting
 * @returns Optimized resume sections
 */
export async function optimizeResumeForJob(
  resumeData: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
    projects?: string;
    certifications?: string;
  },
  targetJob: string,
  jobDescription?: string
): Promise<{
  summary: string;
  experience: string;
  skills: string;
}> {
  try {
    // Build the context for optimization
    const context = jobDescription 
      ? `Job Title: ${targetJob}\n\nJob Description:\n${jobDescription}`
      : `Job Title: ${targetJob}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a professional resume consultant who specializes in optimizing resumes for specific job positions.
          Your task is to optimize the provided resume content to better match the target job.
          
          Guidelines:
          - Emphasize skills and experiences relevant to the target position
          - Incorporate relevant keywords from the industry and job description
          - Maintain authenticity - don't fabricate experience
          - Quantify achievements when possible
          - Be concise and impactful
          
          Format your response as JSON with the following structure:
          {
            "summary": "optimized professional summary",
            "experience": "optimized work experience section",
            "skills": "optimized skills section"
          }`
        },
        {
          role: "user",
          content: `Please optimize the following resume content for the position of: ${context}
          
          Current Resume:
          
          SUMMARY:
          ${resumeData.summary || "Not provided"}
          
          EXPERIENCE:
          ${resumeData.experience || "Not provided"}
          
          SKILLS:
          ${resumeData.skills || "Not provided"}
          
          EDUCATION:
          ${resumeData.education || "Not provided"}
          
          ${resumeData.projects ? `PROJECTS:\n${resumeData.projects}\n\n` : ""}
          ${resumeData.certifications ? `CERTIFICATIONS:\n${resumeData.certifications}` : ""}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 2000
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      summary: result.summary || resumeData.summary || "",
      experience: result.experience || resumeData.experience || "",
      skills: result.skills || resumeData.skills || ""
    };
  } catch (error) {
    console.error("Error optimizing resume with OpenAI:", error);
    throw new Error("Failed to optimize resume. Please try again later.");
  }
}

/**
 * Extracts text from a PDF file using OpenAI's multimodal capabilities
 * @param filePath Path to the uploaded PDF file
 * @returns The extracted text content
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Read the file as base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a document parsing assistant. Extract all the text content from the provided document. Preserve the structure, sections, and formatting as much as possible."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all the text from this resume document. Maintain the structure and sections."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64File}`
              }
            }
          ],
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    if (!response.choices[0].message?.content) {
      throw new Error("No response received from OpenAI");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF. Please try again later.");
  } finally {
    // Clean up the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting temporary file:", error);
    }
  }
}
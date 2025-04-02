import { Router, Request, Response } from "express";
import { 
  parseResume, 
  enhanceResumeSection,
  optimizeResumeForJob,
  extractTextFromPDF,
  upload
} from "../utils/openai";
import path from "path";

const router = Router();

// Parse resume with AI
router.post("/parse", async (req: Request, res: Response) => {
  try {
    // Get resume text from request
    const { resumeText } = req.body;
    
    if (!resumeText || typeof resumeText !== "string") {
      return res.status(400).json({ 
        error: "Resume text is required" 
      });
    }

    // Process with OpenAI
    const parsedResume = await parseResume(resumeText);
    
    // Return the processed resume data
    return res.status(200).json(parsedResume);
  } catch (error) {
    console.error("Resume parsing error:", error);
    return res.status(500).json({ 
      error: "Failed to parse resume",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Upload and parse resume file
router.post("/upload", upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded" 
      });
    }
    
    // For PDF files, use OpenAI's vision API to extract text
    if (req.file.mimetype === 'application/pdf') {
      const text = await extractTextFromPDF(req.file.path);
      return res.status(200).json({ 
        success: true, 
        text 
      });
    } 
    // For other file types
    else {
      // The file is already saved to disk, so we can read it directly
      return res.status(200).json({ 
        success: true, 
        message: "File received successfully. Use the text extraction API to process.",
        filePath: req.file.path
      });
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({ 
      error: "Failed to process uploaded file",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Enhance resume section
router.post("/enhance", async (req: Request, res: Response) => {
  try {
    const { section, content } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ 
        error: "Section and content are required" 
      });
    }

    // Process with OpenAI
    const suggestions = await enhanceResumeSection(section, content);
    
    // Return the enhanced content
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Resume enhancement error:", error);
    return res.status(500).json({ 
      error: "Failed to enhance resume section",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Optimize resume for specific job
router.post("/optimize", async (req: Request, res: Response) => {
  try {
    const { resumeData, targetJob, jobDescription } = req.body;
    
    if (!resumeData || !targetJob) {
      return res.status(400).json({ 
        error: "Resume data and target job are required" 
      });
    }

    // Process with OpenAI
    const optimizedResume = await optimizeResumeForJob(
      resumeData,
      targetJob,
      jobDescription
    );
    
    // Return the optimized resume
    return res.status(200).json(optimizedResume);
  } catch (error) {
    console.error("Resume optimization error:", error);
    return res.status(500).json({ 
      error: "Failed to optimize resume",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default router;
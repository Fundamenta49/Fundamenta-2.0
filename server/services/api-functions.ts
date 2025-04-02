import OpenAI from 'openai';
import axios from 'axios';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Resume related schemas
const resumeSchemaObj = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    summary: z.string().optional()
  }),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string().optional(),
    year: z.string().optional()
  })).optional(),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string().optional(),
    description: z.string().optional()
  })).optional(),
  skills: z.array(z.string()).optional(),
  jobTitle: z.string().optional(),
  targetCompany: z.string().optional(),
  industry: z.string().optional()
});

const interviewAnalysisSchemaObj = z.object({
  answer: z.string(),
  question: z.string(),
  industry: z.string()
});

const coverLetterSchemaObj = z.object({
  resume: resumeSchemaObj,
  jobTitle: z.string(),
  company: z.string(),
  customizations: z.string().optional()
});

// Export schemas for use in routes
export const resumeSchema = resumeSchemaObj;
export const interviewAnalysisSchema = interviewAnalysisSchemaObj;
export const coverLetterSchema = coverLetterSchemaObj;

/**
 * Provides guidance for emergency situations
 * @param situation The emergency situation requiring guidance
 * @returns String with guidance steps for the given situation
 */
export const getEmergencyGuidance = async (situation: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an emergency response advisor. Provide clear, concise emergency guidance for the following situation. 
          Format your response with numbered steps. Include when to call emergency services, immediate actions to take, and what to avoid.
          Keep instructions brief, actionable, and potentially life-saving. Do not include unnecessary details or background information.`
        },
        {
          role: "user",
          content: situation
        }
      ]
    });

    return response.choices[0].message.content || "Unable to generate emergency guidance. Please call emergency services immediately if this is a life-threatening situation.";
  } catch (error) {
    console.error("Emergency guidance error:", error);
    return "Unable to generate emergency guidance. Please call emergency services immediately if this is a life-threatening situation.";
  }
};

/**
 * Optimizes a resume with AI-generated suggestions
 * @param data Resume data to analyze and optimize
 * @returns JSON string with optimization suggestions
 */
export const optimizeResume = async (data: any): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a professional resume consultant. Analyze the provided resume data and provide specific, actionable improvements. Focus on:
          1. Content improvements for specific sections
          2. Better phrasing of experiences
          3. Skills that should be highlighted based on experience
          4. Structural changes for better readability
          5. Industry-specific customizations
          
          Format your response as a JSON object with the following structure:
          {
            "suggestions": [
              { "section": "summary", "suggestion": "...", "reason": "..." },
              { "section": "experience", "suggestion": "...", "reason": "..." },
              { "section": "skills", "suggestion": "...", "reason": "..." }
            ],
            "overallScore": 75,
            "topPriorities": ["Improve action verbs", "Add metrics", "Customize for job"]
          }`
        },
        {
          role: "user",
          content: JSON.stringify(data)
        }
      ],
      response_format: { type: "json_object" }
    });

    return response.choices[0].message.content || JSON.stringify({ 
      suggestions: ["Unable to generate optimization suggestions"] 
    });
  } catch (error) {
    console.error("Resume optimization error:", error);
    return JSON.stringify({ 
      suggestions: ["Unable to generate optimization suggestions due to an error"] 
    });
  }
};

/**
 * Analyzes a job interview answer with AI feedback
 * @param answer User's interview answer to analyze
 * @param question The interview question being answered
 * @param industry The industry context for the interview
 * @returns Analysis and feedback on the interview answer
 */
export const analyzeInterviewAnswer = async (
  answer: string, 
  question: string, 
  industry: string
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach specializing in ${industry} interviews. 
          Analyze the candidate's answer to the given question. Provide:
          1. A rating out of 10
          2. Specific strengths in the answer
          3. Specific areas for improvement
          4. A suggested better answer structure
          5. Industry-specific advice for this type of question`
        },
        {
          role: "user",
          content: `Question: ${question}\n\nMy Answer: ${answer}`
        }
      ]
    });

    return response.choices[0].message.content || "We couldn't analyze your answer at this time.";
  } catch (error) {
    console.error("Interview answer analysis error:", error);
    return "We couldn't analyze your answer at this time due to a technical issue.";
  }
};

/**
 * Generates practice job interview questions
 * @param jobField The specific job field to generate questions for
 * @returns Array of relevant interview questions
 */
export const generateJobQuestions = async (jobField: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert in the ${jobField} field with deep industry knowledge. Generate 15 highly realistic and challenging interview questions that would be asked by top employers for a ${jobField} position.

          Create questions in these categories:
          - Technical Knowledge (4 questions): Specific domain expertise, methodologies, and technical concepts relevant to ${jobField}
          - Experience & Accomplishments (3 questions): Past work, achievements, and learnings
          - Problem-solving (3 questions): How candidates approach challenges unique to ${jobField} roles
          - Industry Awareness (2 questions): Knowledge of trends, competitors, and industry changes  
          - Soft Skills & Culture Fit (3 questions): Communication, teamwork, and adaptability relevant to this field

          For each question:
          1. Make it specific to the ${jobField} position (avoid generic questions)
          2. Include industry terminology and concepts when appropriate
          3. Frame each as a complete question with context when helpful
          
          Return the questions in a JSON object with this format:
          {
            "questions": [
              "Question text here",
              "Another question here",
              ...more questions
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      const content = response.choices[0].message.content || '{"questions": []}';
      const data = JSON.parse(content);
      return Array.isArray(data.questions) ? data.questions : [];
    } catch (parseError) {
      console.error("Error parsing questions response:", parseError);
      // Create a fallback with generic questions that maintain compatibility
      return [
        `What specific experience do you have that qualifies you for this ${jobField} position?`,
        `What do you consider the most important skills for success as a ${jobField}?`,
        `Describe a challenging situation you've faced in your ${jobField} career and how you resolved it.`,
        `How do you stay current with trends and developments in the ${jobField} industry?`,
        `What tools or technologies are you most proficient with that relate to ${jobField}?`
      ];
    }
  } catch (error) {
    console.error("Generate job questions error:", error);
    // Create a fallback with generic questions that maintain compatibility
    return [
      `What specific experience do you have that qualifies you for this ${jobField} position?`,
      `What do you consider the most important skills for success as a ${jobField}?`,
      `Describe a challenging situation you've faced in your ${jobField} career and how you resolved it.`,
      `How do you stay current with trends and developments in the ${jobField} industry?`,
      `What tools or technologies are you most proficient with that relate to ${jobField}?`
    ];
  }
};

/**
 * Generates a custom cover letter based on resume and job details
 * @param data Object containing resume data and job information
 * @returns Generated cover letter text
 */
export const generateCoverLetter = async (data: any): Promise<string> => {
  try {
    const { resume, jobTitle, company, customizations } = data;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a professional cover letter writer. Create a compelling, personalized cover letter for a ${jobTitle} position at ${company}. 
          Use the provided resume information to highlight relevant skills and experiences.
          The cover letter should:
          - Be professionally formatted with proper sections
          - Highlight the most relevant experiences for this specific role
          - Address the candidate's fit for the company culture
          - Include a call to action in the closing paragraph
          - Be about 350-400 words in length
          
          Additional customization requests: ${customizations || "None provided"}`
        },
        {
          role: "user",
          content: JSON.stringify(resume)
        }
      ]
    });

    return response.choices[0].message.content || "Unable to generate cover letter content.";
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return "Unable to generate cover letter content due to a technical issue.";
  }
};

/**
 * Assesses career matches based on user answers
 * @param answers Record of question/answer pairs from career assessment
 * @returns Object with top career matches and explanations
 */
export const assessCareer = async (answers: Record<string, string>): Promise<{ 
  topMatches: string[],
  explanations?: Record<string, string>
}> => {
  try {
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `Question: ${question}\nAnswer: ${answer}`)
      .join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a career guidance counselor. Based on the assessment answers provided, identify the top 5 career matches with brief explanations of why they would be a good fit.
          Format your response as a JSON object with:
          {
            "topMatches": ["Career 1", "Career 2", "Career 3", "Career 4", "Career 5"],
            "explanations": {
              "Career 1": "Explanation for why this is a match...",
              "Career 2": "Explanation for why this is a match..."
            }
          }`
        },
        {
          role: "user",
          content: formattedAnswers
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{"topMatches":["No matches found"]}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Career assessment error:", error);
    return { 
      topMatches: ["Software Developer", "Data Analyst", "Project Manager"],
      explanations: {
        "Software Developer": "Based on your technical skills and problem-solving abilities",
        "Data Analyst": "Given your attention to detail and analytical thinking",
        "Project Manager": "Considering your organizational and leadership qualities"
      }
    };
  }
};

/**
 * Searches for job listings based on query and location
 * @param query Job title, skills or keywords to search for
 * @param location Location for the job search
 * @returns Array of job listings
 */
export const searchJobs = async (query: string, location: string): Promise<any[]> => {
  // In a real implementation, this would connect to a job search API
  // For now, returning mock data
  return [
    { 
      title: `${query} Specialist`, 
      company: "TechCorp", 
      location,
      salary: "$70,000 - $90,000",
      description: `Looking for a talented ${query} professional in ${location}.`,
      requirements: ["Bachelor's degree", "3+ years experience", "Team player"]
    },
    { 
      title: `Senior ${query} Consultant`, 
      company: "Innovation Inc", 
      location,
      salary: "$90,000 - $120,000",
      description: `Senior role for experienced ${query} professionals in ${location}.`,
      requirements: ["Master's degree preferred", "5+ years experience", "Leadership skills"]
    },
    { 
      title: `${query} Analyst`, 
      company: "DataDriven LLC", 
      location,
      salary: "$65,000 - $85,000",
      description: `Join our growing team of ${query} analysts in our ${location} office.`,
      requirements: ["Analytical skills", "2+ years experience", "Communication skills"]
    }
  ];
};

/**
 * Gets salary insights for a specific job title and location
 * @param jobTitle The job title to get salary data for
 * @param location The location for salary data
 * @returns Object with salary insights
 */
export const getSalaryInsights = async (jobTitle: string, location: string): Promise<{
  average: number,
  range: { min: number, max: number },
  byExperience?: Record<string, number>,
  byCompanySize?: Record<string, number>
}> => {
  // In a real implementation, this would connect to a salary data API
  // For now, returning mock data based on input parameters
  const baseAverage = jobTitle.toLowerCase().includes('senior') ? 95000 : 75000;
  
  // Adjust based on location - just a simple mock logic
  const locationFactor = location.toLowerCase().includes('new york') || 
                          location.toLowerCase().includes('san francisco') ? 1.3 : 1.0;
  
  const average = Math.round(baseAverage * locationFactor);
  
  return {
    average,
    range: { 
      min: Math.round(average * 0.8), 
      max: Math.round(average * 1.2) 
    },
    byExperience: {
      "0-2 years": Math.round(average * 0.7),
      "3-5 years": Math.round(average * 0.9),
      "6-10 years": Math.round(average * 1.2),
      "10+ years": Math.round(average * 1.5)
    },
    byCompanySize: {
      "Small (1-50)": Math.round(average * 0.85),
      "Medium (51-500)": Math.round(average * 1.0),
      "Large (500+)": Math.round(average * 1.15)
    }
  };
};

// Plaid-related functions
// These would normally connect to the Plaid API
// For now, these are placeholder implementations

/**
 * Creates a Plaid link token for connecting to financial institutions
 * @returns Link token string
 */
export const createLinkToken = async (): Promise<string> => {
  // In a real implementation, this would call the Plaid API
  return "link-sandbox-12345";
};

/**
 * Exchanges a public token for an access token
 * @param publicToken The public token to exchange
 * @returns Access token string
 */
export const exchangePublicToken = async (publicToken: string): Promise<string> => {
  // In a real implementation, this would call the Plaid API
  return "access-sandbox-12345";
};

/**
 * Gets transactions for a financial account
 * @param accessToken The access token for the account
 * @returns Array of transaction objects
 */
export const getTransactions = async (accessToken: string): Promise<any[]> => {
  // In a real implementation, this would call the Plaid API
  return [
    { 
      date: new Date().toISOString().split('T')[0],
      description: "Grocery Store",
      amount: 74.35,
      category: "Food & Dining"
    },
    { 
      date: new Date().toISOString().split('T')[0],
      description: "Coffee Shop",
      amount: 4.75,
      category: "Food & Dining"
    },
    { 
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      description: "Gas Station",
      amount: 45.00,
      category: "Transportation"
    },
    { 
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      description: "Online Retailer",
      amount: 125.99,
      category: "Shopping"
    }
  ];
};
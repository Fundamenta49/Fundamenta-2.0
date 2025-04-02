import { 
  textClassifier, 
  entityRecognizer, 
  textSummarizer, 
  questionAnswerer, 
  textGenerator,
  analyzeUserEmotion,
  getContentCategory
} from "../huggingface";
import OpenAI from "openai";
import { 
  openaiClient, 
  generateResponse, 
  analyzeSentiment, 
  extractStructuredData 
} from "../openai";

// Specialized AI advisor roles
export type AIRole = 
  | 'general'
  | 'finance'
  | 'career'
  | 'wellness'
  | 'learning'
  | 'emergency'
  | 'fitness'
  | 'cooking';

// Context for AI processing
export interface AIContext {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
  userIntent?: string;
  previousInteractions?: string[];
  userProfile?: {
    interests?: string[];
    skills?: string[];
    goals?: string[];
    emotionalState?: string;
  };
}

// Types of AI actions the assistant can suggest
export type ActionType = 'navigate' | 'show_guide' | 'fill_form' | 'trigger_feature';

export interface Action {
  type: ActionType;
  payload: {
    path?: string;
    formId?: string;
    featureId?: string;
  };
}

// Suggestion format for the AI to provide follow-up actions
export interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

// Complete response structure from AI processing
export interface AIProcessingResult {
  response: string;
  actions?: Action[];
  suggestions?: AppSuggestion[];
  category?: string;
  sentiment?: string;
  confidence?: number;
  followUpQuestions?: string[];
}

// System prompts for different specialized AI advisors
const rolePrompts: Record<AIRole, string> = {
  general: `You are Fundi, a friendly and knowledgeable AI assistant...`,
  finance: `You are Fundi, a financial advisor and coach...`,
  career: `You are Fundi, a career coach and professional development advisor...`,
  wellness: `You are Fundi, a wellness coach and mental health advocate...`,
  learning: `You are Fundi, an educational coach and learning specialist...`,
  emergency: `You are Fundi, an emergency preparedness specialist...`,
  fitness: `You are Fundi, a fitness coach and wellness specialist...`,
  cooking: `You are Fundi, a culinary expert and cooking instructor...`
};

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user

/**
 * AI Service that combines OpenAI and Hugging Face capabilities
 * to provide intelligent responses across different domains
 */
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = openaiClient;
  }

  /**
   * The main function that orchestrates AI processing of user messages
   */
  async processUserMessage(
    message: string,
    context: AIContext,
    category: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
  ): Promise<AIProcessingResult> {
    try {
      let emotionAnalysis, detectedCategory;
      
      // 1. Use HuggingFace to analyze message for emotion and content category
      // Handle each analysis separately for better error handling
      try {
        emotionAnalysis = await analyzeUserEmotion(message);
      } catch (error) {
        console.warn("Emotion analysis failed, using defaults:", error);
        emotionAnalysis = {
          primaryEmotion: 'neutral',
          emotionScore: 0.5,
          emotions: [{ emotion: 'neutral', score: 0.5 }]
        };
      }
      
      try {
        detectedCategory = category ? category : await getContentCategory(message);
      } catch (error) {
        console.warn("Category detection failed, using defaults:", error);
        detectedCategory = category || 'general';
      }

      // 2. Determine the appropriate AI advisor role based on category  
      const advisorRole = this.mapCategoryToAdvisorRole(category || detectedCategory);

      // 3. Get the specialized system prompt for this advisor
      const systemPrompt = rolePrompts[advisorRole];

      // 4. Enhance context with emotion analysis
      const enhancedContext = {
        ...context,
        userProfile: {
          ...context.userProfile,
          emotionalState: emotionAnalysis.primaryEmotion
        }
      };

      // 5. Generate the primary AI response using OpenAI
      const response = await this.generateOpenAIResponse(
        message,
        enhancedContext,
        systemPrompt,
        previousMessages
      );

      // 6. Return the complete result
      return {
        ...response,
        category: category || detectedCategory,
        sentiment: emotionAnalysis.primaryEmotion,
        confidence: emotionAnalysis.emotionScore
      };
    } catch (error) {
      console.error("AI Processing Error:", error);
      
      // Instead of throwing an error, return a fallback response
      return {
        response: "I'm having trouble processing your request right now. Let me try to help with a simpler response. What specific information or assistance do you need?",
        category: category || 'general',
        sentiment: 'neutral',
        confidence: 0.5,
        actions: [],
        suggestions: [],
        followUpQuestions: [
          "Could you rephrase your question?",
          "Would you like me to explain something specific?",
          "Can I help with a different topic?"
        ]
      };
    }
  }

  /**
   * Maps a category string to the appropriate advisor role
   */
  private mapCategoryToAdvisorRole(category: string): AIRole {
    const categoryMap: Record<string, AIRole> = {
      finance: 'finance',
      career: 'career',
      wellness: 'wellness',
      learning: 'learning',
      emergency: 'emergency',
      cooking: 'cooking',
      fitness: 'fitness',
    };

    return categoryMap[category] || 'general';
  }

  /**
   * Generates a response using OpenAI
   */
  private async generateOpenAIResponse(
    message: string,
    context: AIContext,
    systemPrompt: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  ): Promise<AIProcessingResult> {
    // Build the complete system content with context information
    const systemContent = `${systemPrompt}

    Current Context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'None'}
    - Available Actions: ${context.availableActions.join(', ')}
    - User Intent: ${context.userIntent || 'Unknown'}
    - User Emotional State: ${context.userProfile?.emotionalState || 'Unknown'}
    
    Return your response in JSON format with the following structure:
    {
      "response": string,
      "actions": Array<{
        type: 'navigate' | 'show_guide' | 'fill_form' | 'trigger_feature' | 'start_tour',
        payload: {
          route?: string,
          section?: string,
          focusContent?: string,
          guideSection?: string,
          formData?: object,
          feature?: string,
          tourId?: string,
          autoFocus?: boolean
        }
      }>,
      "suggestions": Array<{text: string, path: string, description: string}>,
      "followUpQuestions": Array<string>
    }`;

    try {
      const oaiResponse = await this.openai.chat.completions.create({
        model: "gpt-4o", // Use the newest model
        messages: [
          {
            role: "system",
            content: systemContent
          },
          ...previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const jsonResponse = JSON.parse(oaiResponse.choices[0].message.content || "{}");
      
      // Check for navigation intents in the message
      let actions = jsonResponse.actions || [];
      
      // Process for navigation commands like "show me financial section" or "take me to career"
      const navigationPatterns = [
        /show me (?:the )?(\w+)(?:\s+section)?/i,
        /take me to (?:the )?(\w+)(?:\s+section)?/i,
        /go to (?:the )?(\w+)(?:\s+section)?/i,
        /navigate to (?:the )?(\w+)(?:\s+section)?/i,
        /open (?:the )?(\w+)(?:\s+section)?/i,
      ];
      
      const sectionKeywords: Record<string, string[]> = {
        'finance': ['finance', 'financial', 'money', 'budget', 'invest'],
        'career': ['career', 'job', 'resume', 'interview', 'profession'],
        'wellness': ['wellness', 'health', 'mental', 'meditation', 'mindfulness'],
        'emergency': ['emergency', 'urgent', 'crisis', 'help', 'disaster'],
        'learning': ['learning', 'learn', 'education', 'study', 'course'],
        'active': ['active', 'fitness', 'exercise', 'workout', 'gym'],
      };
      
      let shouldNavigate = false;
      let navigationTarget = '';
      
      // First check for explicit navigation patterns
      for (const pattern of navigationPatterns) {
        const match = message.toLowerCase().match(pattern);
        if (match && match[1]) {
          const requestedSection = match[1].toLowerCase();
          
          // Direct match to a section
          if (Object.keys(sectionKeywords).includes(requestedSection)) {
            navigationTarget = requestedSection;
            shouldNavigate = true;
            break;
          }
          
          // Check if the requested term is in the keywords for a section
          for (const [section, keywords] of Object.entries(sectionKeywords)) {
            if (keywords.includes(requestedSection)) {
              navigationTarget = section;
              shouldNavigate = true;
              break;
            }
          }
          
          if (shouldNavigate) break;
        }
      }
      
      // Add navigation action if needed and not already present
      if (shouldNavigate && navigationTarget && !actions.some((a: any) => 
        a.type === 'navigate' && a.payload?.route === `/${navigationTarget}`
      )) {
        // Extract section info if mentioned
        let sectionTarget = '';
        const sectionPatterns = [
          /(?:the )?(\w+) feature/i,
          /(?:the )?(\w+) tool/i,
          /(?:the )?(\w+) planner/i,
          /(?:the )?(\w+) calculator/i,
          /(?:the )?(\w+) dashboard/i,
          /(?:open|show|display) (?:the )?(\w+)/i,
        ];
        
        // Section keyword mappings for each category
        const sectionKeywordMappings: Record<string, Record<string, string>> = {
          'finance': {
            'advisor': 'advisor',
            'ai': 'advisor',
            'chat': 'advisor',
            'budget': 'budget',
            'spending': 'budget',
            'planner': 'budget',
            'dashboard': 'dashboard',
            'overview': 'dashboard',
            'credit': 'credit',
            'score': 'credit',
            'retirement': 'retirement',
            'saving': 'retirement',
            'future': 'retirement',
            'mortgage': 'mortgage',
            'loan': 'mortgage',
            'house': 'mortgage',
            'bank': 'bank',
            'account': 'bank',
            'transaction': 'bank'
          },
          'career': {
            'advisor': 'advisor',
            'ai': 'advisor',
            'chat': 'advisor',
            'resume': 'resume',
            'cv': 'resume',
            'builder': 'resume',
            'jobs': 'jobs',
            'search': 'jobs',
            'listing': 'jobs',
            'interview': 'interview',
            'prep': 'interview',
            'skill': 'skills',
            'learning': 'skills',
            'development': 'skills',
            'networking': 'networking',
            'connection': 'networking',
            'planning': 'planning',
            'path': 'planning',
            'goal': 'planning'
          }
        };
        
        // Check for specific section mentions in the message
        for (const pattern of sectionPatterns) {
          const match = message.toLowerCase().match(pattern);
          if (match && match[1]) {
            const requestedFeature = match[1].toLowerCase();
            
            // Check if this maps to a valid section for the navigation target
            if (navigationTarget in sectionKeywordMappings) {
              const sectionMap = sectionKeywordMappings[navigationTarget];
              
              for (const [keyword, sectionId] of Object.entries(sectionMap)) {
                if (requestedFeature.includes(keyword) || keyword.includes(requestedFeature)) {
                  sectionTarget = sectionId;
                  break;
                }
              }
            }
            
            if (sectionTarget) break;
          }
        }
        
        // Create the navigation action with optional section target
        const navPayload: any = { route: `/${navigationTarget}` };
        if (sectionTarget) {
          navPayload.section = sectionTarget;
        }
        
        actions.push({
          type: 'navigate',
          payload: navPayload
        });
        
        // Update response to acknowledge navigation if not already mentioned
        if (!jsonResponse.response.toLowerCase().includes(navigationTarget)) {
          let responsePrefix = `I'll take you to the ${navigationTarget} section`;
          if (sectionTarget) {
            responsePrefix += ` and open the ${sectionTarget} feature`;
          }
          jsonResponse.response = `${responsePrefix}. ${jsonResponse.response}`;
        }
      }

      // Ensure consistent response format
      return {
        response: jsonResponse.response || "I apologize, I couldn't process that request.",
        actions: actions.map((action: any) => ({
          type: action.type,
          payload: action.payload
        })),
        suggestions: jsonResponse.suggestions?.map((suggestion: any) => ({
          text: suggestion.text,
          path: suggestion.path,
          description: suggestion.description
        })),
        followUpQuestions: jsonResponse.followUpQuestions || []
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      
      // Instead of throwing errors, provide a fallback response
      return {
        response: "I apologize, but I'm having trouble processing your request at the moment. Could you please try again with a simpler question?",
        actions: [],
        suggestions: [],
        followUpQuestions: [
          "Could you rephrase your question?", 
          "Can I help with something else?"
        ]
      };
    }
  }

  /**
   * Specialized method for resume analysis using both OpenAI and HuggingFace
   */
  async analyzeResume(resumeText: string): Promise<{
    summary: string;
    skills: string[];
    experience: string[];
    education: string[];
    suggestions: string[];
  }> {
    try {
      // Extract entities from resume using HuggingFace
      const entities = await entityRecognizer.extractEntities(resumeText);
      
      // Generate resume summary using HuggingFace
      const summary = await textSummarizer.summarize(resumeText, 200);
      
      // Use OpenAI for detailed analysis and suggestions
      const analysisPrompt = `
        You are a career expert specializing in resume analysis. 
        Extract key information from this resume and provide constructive feedback.
        
        Resume text:
        ${resumeText}
        
        Return your analysis in JSON format with these fields:
        {
          "skills": Array<string>, // List of professional skills found
          "experience": Array<string>, // Key work experiences
          "education": Array<string>, // Educational background
          "suggestions": Array<string> // Specific improvement suggestions
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        summary,
        skills: analysis.skills || [],
        experience: analysis.experience || [],
        education: analysis.education || [],
        suggestions: analysis.suggestions || []
      };
    } catch (error) {
      console.error("Resume Analysis Error:", error);
      
      // Return a simplified fallback response
      return {
        summary: "I was unable to fully analyze the resume at this time.",
        skills: ["Unable to extract skills at this time"],
        experience: ["Could not process experience details"],
        education: ["Education information could not be analyzed"],
        suggestions: [
          "Consider checking the resume format and trying again",
          "Make sure the resume text is clear and well-structured",
          "Try uploading a different file format if available"
        ]
      };
    }
  }

  /**
   * Specialized method for journal/wellness analysis using both OpenAI and HuggingFace
   */
  async analyzeJournalEntry(journalText: string): Promise<{
    emotions: Array<{label: string, score: number}>;
    topics: string[];
    themes: string[];
    insights: string[];
    wordCloud: Array<{text: string, value: number}>;
  }> {
    try {
      // Analyze emotions using HuggingFace
      const emotions = await textClassifier.classifyEmotion(journalText);
      
      // Use OpenAI for thematic analysis
      const analysisPrompt = `
        You are a reflective journaling assistant with expertise in psychological well-being.
        Analyze this journal entry to identify key themes, topics, and potential insights.
        
        Journal entry:
        ${journalText}
        
        Return your analysis in JSON format with these fields:
        {
          "topics": Array<string>, // Main topics discussed
          "themes": Array<string>, // Underlying emotional or narrative themes
          "insights": Array<string>, // Potential insights or patterns
          "wordCloud": Array<{text: string, value: number}> // Important words with relative importance (1-10)
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.4,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        emotions,
        topics: analysis.topics || [],
        themes: analysis.themes || [],
        insights: analysis.insights || [],
        wordCloud: analysis.wordCloud || []
      };
    } catch (error) {
      console.error("Journal Analysis Error:", error);
      
      // Return a simplified fallback response
      return {
        emotions: [{ label: "neutral", score: 0.5 }],
        topics: ["Unable to analyze topics at this time"],
        themes: ["Journal analysis unavailable"],
        insights: ["Try again with a simpler entry"],
        wordCloud: [
          { text: "journal", value: 5 },
          { text: "entry", value: 5 },
          { text: "analysis", value: 5 }
        ]
      };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();
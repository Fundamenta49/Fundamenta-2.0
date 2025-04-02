import { AIContext, AIProcessingResult } from '../shared/types';

/**
 * Orchestrates the AI response processing by combining multiple AI capabilities
 * for the chat API endpoints.
 */
export async function orchestrateAIResponse(
  message: string,
  context: AIContext,
  category?: string,
  previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
): Promise<AIProcessingResult> {
  // Mock response for development
  return {
    response: "I'm a mock AI assistant. This is a development environment. Please provide your API keys for full functionality.",
    category: category || 'general',
    confidence: 1,
    actions: [],
    suggestions: [],
    questions: [],
    sentiment: 'neutral',
    followUpQuestions: []
  };
}

/**
 * Analyzes message history to determine user's preferred communication style
 * @param messages Previous conversation messages
 * @returns Description of preferred style
 */
export function getPreferredStyle(messages: { role: string; content: string }[]): string {
  // This is a simplified version - in a real implementation, we would analyze 
  // message patterns, vocabulary, and communication style
  
  // Filter for user messages only
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length < 3) {
    return 'neutral'; // Not enough data to determine style
  }
  
  // Analyze message length
  const avgLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
  
  // Analyze formality (simple heuristic based on punctuation and capitalization)
  const formalIndicators = userMessages.filter(msg => {
    return msg.content.includes('.')
      && !msg.content.includes('!!')
      && !msg.content.includes('...')
      && msg.content[0] === msg.content[0].toUpperCase();
  }).length;
  
  const formalityRatio = formalIndicators / userMessages.length;
  
  if (avgLength > 100 && formalityRatio > 0.7) {
    return 'formal';
  } else if (avgLength < 20 || formalityRatio < 0.3) {
    return 'casual';
  } else {
    return 'balanced';
  }
}

/**
 * Extracts user interests from conversation history
 * @param messages Previous conversation messages
 * @returns Array of detected interests
 */
export function getInterests(messages: { role: string; content: string }[]): string[] {
  // This is a simplified version - in a real implementation, we would use 
  // more sophisticated entity extraction and topic modeling
  
  const userContent = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ');
    
  // Simple keyword matching for common interest domains
  const interestKeywords: Record<string, string[]> = {
    'finance': ['budget', 'money', 'saving', 'invest', 'financial', 'debt', 'credit'],
    'career': ['job', 'interview', 'resume', 'career', 'profession', 'work', 'skill'],
    'health': ['exercise', 'fitness', 'diet', 'nutrition', 'workout', 'healthy', 'wellness'],
    'learning': ['learn', 'study', 'course', 'education', 'knowledge', 'skill', 'training'],
    'technology': ['computer', 'software', 'app', 'tech', 'programming', 'digital', 'online'],
    'cooking': ['recipe', 'cook', 'food', 'meal', 'kitchen', 'ingredient', 'baking']
  };
  
  const detectedInterests: string[] = [];
  
  Object.entries(interestKeywords).forEach(([interest, keywords]) => {
    const hasKeywords = keywords.some(keyword => 
      userContent.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasKeywords) {
      detectedInterests.push(interest);
    }
  });
  
  return detectedInterests;
}

/**
 * Analyzes a user message to determine their intent
 * @param message User's message
 * @returns String description of detected intent
 */
export function analyzeUserIntent(message: string): string {
  // This is a simplified version - in a real implementation, we would use
  // a more sophisticated intent classification model
  
  const lowerMessage = message.toLowerCase();
  
  const intentPatterns: Record<string, RegExp[]> = {
    'question': [/^what/, /^how/, /^why/, /^when/, /^where/, /^can you/, /^could you/, /\?$/],
    'action_request': [/^show me/, /^find/, /^search/, /^get/, /^give me/, /^i need/, /^help me/],
    'navigation': [/^go to/, /^take me to/, /^navigate/, /^open/, /^show/],
    'form_filling': [/^fill/, /^complete/, /^input/, /^enter/, /^update/],
    'feedback': [/^i think/, /^i feel/, /^i like/, /^i don't like/, /^i hate/, /^i love/],
    'greeting': [/^hi/, /^hello/, /^hey/, /^greetings/, /^good morning/, /^good afternoon/, /^good evening/],
  };
  
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerMessage)) {
        return intent;
      }
    }
  }
  
  return 'other';
}
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface FinancialGoal {
  title: string;
  targetAmount: number;
  deadline: string;
  progress: number;
}

export interface CareerGoal {
  position: string;
  company: string;
  deadline: string;
  skills: string[];
}

export interface WellnessGoal {
  category: string;
  description: string;
  frequency: string;
  progress: number;
}

export interface AIContext {
  userIntent?: string;
  userProfile?: {
    interests: string[];
  };
}

export interface AIProcessingResult {
  response: string;
  category?: string;
  confidence: number;
  actions?: string[];
  suggestions?: string[];
  questions?: string[];
  sentiment?: string;
  followUpQuestions?: string[];
}

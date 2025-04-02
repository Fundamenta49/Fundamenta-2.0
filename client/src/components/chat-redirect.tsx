import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowRight, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LEARNING_CATEGORY,
  COOKING_CATEGORY,
  EMERGENCY_CATEGORY,
  FINANCE_CATEGORY,
  CAREER_CATEGORY,
  WELLNESS_CATEGORY,
  FITNESS_CATEGORY
} from "@/components/chat-interface";

export type ChatCategory = 
  | typeof LEARNING_CATEGORY
  | typeof COOKING_CATEGORY
  | typeof EMERGENCY_CATEGORY
  | typeof FINANCE_CATEGORY
  | typeof CAREER_CATEGORY
  | typeof WELLNESS_CATEGORY
  | typeof FITNESS_CATEGORY;

interface ChatInterfaceProps {
  category: ChatCategory;
  children?: React.ReactNode;
}

export type ChatInterfaceComponent = React.ComponentType<ChatInterfaceProps>;

// Get color based on category
const getCategoryColor = (category: ChatCategory) => {
  switch (category) {
    case FINANCE_CATEGORY:
      return "text-green-500";
    case CAREER_CATEGORY:
      return "text-blue-500";
    case WELLNESS_CATEGORY:
      return "text-purple-500";
    case FITNESS_CATEGORY:
      return "text-pink-500";
    case EMERGENCY_CATEGORY:
      return "text-red-500";
    case LEARNING_CATEGORY:
      return "text-orange-500";
    case COOKING_CATEGORY:
      return "text-yellow-500";
    default:
      return "text-blue-500";
  }
};

// This component replaces the ChatInterface component, redirecting users to use Fundi
export default function ChatRedirect({ category, children }: ChatInterfaceProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Automatically show toast to tell users to use Fundi
  useEffect(() => {
    toast({
      title: "Use Fundi for AI assistance",
      description: "The floating Fundi assistant in the top right can help with all your questions!",
      duration: 5000,
    });
  }, [toast]);

  const openFundi = () => {
    // This dispatches a custom event that floating-chat.tsx can listen for
    window.dispatchEvent(new CustomEvent('open-fundi-chat', {
      detail: { category }
    }));

    toast({
      title: "Fundi is ready to help",
      description: "Ask Fundi any questions about " + category,
    });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className={cn("h-5 w-5", getCategoryColor(category))} />
          <span>AI Assistance</span>
        </CardTitle>
        <CardDescription>
          Get personalized help with all your {category} questions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkle className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-xl font-semibold">Ask Fundi, Your AI Assistant</h2>
          
          <p className="text-muted-foreground">
            Fundi is now your central AI assistant for all questions and guidance. 
            Just click the robot icon in the top right corner of your screen to ask anything!
          </p>
          
          <Button onClick={openFundi} className="mt-6">
            <ArrowRight className="mr-2 h-4 w-4" />
            Talk to Fundi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
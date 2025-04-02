import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { AIResponse, useAIEventStore, useAIContext, processPendingActions, AppSuggestion } from '@/lib/ai-event-system';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';


// Category constants 
export const EMERGENCY_CATEGORY = 'emergency';
export const FINANCE_CATEGORY = 'finance';
export const CAREER_CATEGORY = 'career';
export const WELLNESS_CATEGORY = 'wellness';
export const LEARNING_CATEGORY = 'learning';
export const COOKING_CATEGORY = 'cooking';
export const FITNESS_CATEGORY = 'fitness';
export const GENERAL_CATEGORY = 'general';

// Category colors for different advisor types
const categoryColors: Record<string, string> = {
  finance: '#22c55e', // green-500
  career: '#3b82f6', // blue-500
  wellness: '#a855f7', // purple-500
  learning: '#f97316', // orange-500
  emergency: '#ef4444', // red-500
  cooking: '#f59e0b', // amber-500
  fitness: '#06b6d4', // cyan-500
  general: '#6366f1', // indigo-500
  error: '#ef4444', // red-500
};

// Advisor images and names
const advisorInfo: Record<string, { name: string; image: string }> = {
  finance: { name: 'Financial Coach', image: '/advisors/finance-advisor.png' },
  career: { name: 'Career Mentor', image: '/advisors/career-advisor.png' },
  wellness: { name: 'Wellness Guide', image: '/advisors/wellness-advisor.png' },
  learning: { name: 'Learning Facilitator', image: '/advisors/learning-advisor.png' },
  emergency: { name: 'Emergency Assistant', image: '/advisors/emergency-advisor.png' },
  cooking: { name: 'Cooking Expert', image: '/advisors/cooking-advisor.png' },
  fitness: { name: 'Fitness Coach', image: '/advisors/fitness-advisor.png' },
  general: { name: 'AI Assistant', image: '/mascot/fundi-avatar.png' },
  error: { name: 'Assistant', image: '/mascot/fundi-avatar.png' },
};

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

interface Suggestion {
  text: string;
  category: string;
  action?: string;
  path?: string;
}

// Chat interface props
interface ChatInterfaceProps {
  category?: string;
  initialContext?: {
    currentPage: string;
    currentSection?: string;
    availableActions: string[];
  };
  className?: string;
  expanded?: boolean;
  showSuggestions?: boolean;
  onToggleExpand?: () => void;
}

export default function ChatInterface({
  category = 'general',
  initialContext = {
    currentPage: 'home',
    availableActions: ['navigate', 'trigger_feature']
  },
  className = '',
  expanded = false,
  showSuggestions = true,
  onToggleExpand
}: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [, navigate] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // AI state from store
  const { 
    isProcessing, 
    setProcessing, 
    setResponse, 
    suggestedActions, 
    followUpQuestions,
    currentCategory
  } = useAIEventStore();
  
  // Generate AI context for the current page
  const aiContext = useAIContext(initialContext);

  // Process AI actions when they are received
  useEffect(() => {
    processPendingActions(navigate);
  }, [messages, navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setProcessing(true);
    
    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Make API request to AI backend
      const response = await apiRequest(
        'POST',
        '/api/chat/orchestrator',
        {
          message: input,
          context: aiContext,
          category: category !== 'general' ? category : undefined,
          previousMessages: conversationHistory
        }
      );
      
      const responseData = await response.json();
      
      if (responseData) {
        const aiResponse = responseData as AIResponse;
        console.log("AI Response:", aiResponse); // For debugging
        
        // Add AI response to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.response,
          timestamp: new Date(),
          category: aiResponse.category
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Set full AI response in store
        setResponse({
          ...aiResponse,
          // Ensure followUpQuestions is an array
          followUpQuestions: Array.isArray(aiResponse.followUpQuestions) 
            ? aiResponse.followUpQuestions 
            : []
        });
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
      
      setProcessing(false);
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Focus the textarea after setting the suggestion
    setTimeout(() => {
      document.getElementById('chat-input')?.focus();
    }, 0);
  };

  // Determine if showing a specialized advisor or general AI assistant
  const isSpecialist = (currentCategory || category) !== 'general';

  return (
    <Card className={cn(
      "flex flex-col border shadow-lg",
      isMobile ? "h-full rounded-none" : "min-h-[500px] max-h-[70vh]",
      className
    )}>
      <CardHeader className={cn(
        "border-b",
        isMobile ? "px-3 py-2" : "px-4 py-2.5 sm:px-5 sm:py-3"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(currentCategory || category) === 'general' ? (
              <div className={cn(
                "flex items-center justify-center",
                isMobile ? "h-7 w-7" : "h-8 w-8 sm:h-10 sm:w-10"
              )}>
                <MessageSquare className={cn(
                  "text-gray-700",
                  isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"
                )} />
              </div>
            ) : (
              <Avatar className={cn(
                isMobile ? "h-7 w-7" : "h-8 w-8 sm:h-10 sm:w-10"
              )}>
                <AvatarImage 
                  src={advisorInfo[currentCategory || category].image} 
                  alt={advisorInfo[currentCategory || category].name} 
                />
                <AvatarFallback>
                  {advisorInfo[currentCategory || category].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Only show name and badge for specialized advisors */}
            {isSpecialist && (
              <>
                <CardTitle className={cn(
                  "font-medium",
                  isMobile ? "text-sm" : "text-sm md:text-lg"
                )}>
                  {advisorInfo[currentCategory || category].name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "px-2 py-0.5",
                    isMobile ? "text-[10px]" : "text-xs sm:text-sm sm:px-3 sm:py-1"
                  )}
                  style={{
                    backgroundColor: `${categoryColors[currentCategory || category]}15`, 
                    color: categoryColors[currentCategory || category],
                    borderColor: `${categoryColors[currentCategory || category]}30`
                  }}
                >
                  {currentCategory || category}
                </Badge>
              </>
            )}
          </div>
          
          {onToggleExpand && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleExpand}
              aria-label={expanded ? "Minimize chat" : "Expand chat"}
              className={cn(
                isMobile ? "h-8 w-8" : "h-9 w-9"
              )}
            >
              <ArrowRight className={cn(
                isMobile ? "h-4 w-4" : "h-5 w-5",
                expanded ? 'rotate-90' : '-rotate-90'
              )} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <ScrollArea className={cn(
        "flex-1",
        isMobile ? "px-3 py-3" : "px-4 py-5"
      )}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4 space-y-4">
              <MessageSquare className={cn(
                "opacity-50",
                isMobile ? "h-8 w-8" : "h-10 w-10"
              )} />
              {category === 'general' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>What would you like help with today?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "I need to create a budget for my first apartment"</p>
                    <p>• "What skills should I develop for my career?"</p>
                    <p>• "How do I maintain a work-life balance?"</p>
                  </div>
                </>
              ) : category === 'finance' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>What financial questions can I help with?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "How should I budget for my monthly expenses?"</p>
                    <p>• "What's the difference between a 401(k) and Roth IRA?"</p>
                    <p>• "How can I start investing with limited funds?"</p>
                  </div>
                </>
              ) : category === 'career' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>How can I assist with your career development?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "What skills are most valuable in tech right now?"</p>
                    <p>• "How do I negotiate a salary increase?"</p>
                    <p>• "Should I include a cover letter with my application?"</p>
                  </div>
                </>
              ) : category === 'wellness' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>What wellness goals are you focusing on?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "How can I improve my sleep quality?"</p>
                    <p>• "What meditation techniques help with anxiety?"</p>
                    <p>• "How can I build a sustainable self-care routine?"</p>
                  </div>
                </>
              ) : category === 'learning' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>What would you like to learn about?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "What's the best way to learn a new language?"</p>
                    <p>• "How can I improve my critical thinking skills?"</p>
                    <p>• "What books would help me understand economics?"</p>
                  </div>
                </>
              ) : category === 'cooking' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>What cooking advice do you need?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "What meals can I make with minimal ingredients?"</p>
                    <p>• "How do I meal prep for a busy week?"</p>
                    <p>• "What basic cooking skills should I learn first?"</p>
                  </div>
                </>
              ) : category === 'fitness' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>How can I help with your fitness journey?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "What exercises are best for beginners?"</p>
                    <p>• "How often should I work out each week?"</p>
                    <p>• "What's a good balance of cardio and strength training?"</p>
                  </div>
                </>
              ) : category === 'emergency' ? (
                <>
                  <p className={cn(
                    "font-medium",
                    isMobile ? "text-base" : "text-lg"
                  )}>How can I assist with your urgent situation?</p>
                  <div className={cn(
                    "space-y-2",
                    isMobile ? "text-sm" : "text-base space-y-3"
                  )}>
                    <p>• "What should I do about a minor kitchen fire?"</p>
                    <p>• "How do I handle a power outage in my apartment?"</p>
                    <p>• "What steps should I take after a minor car accident?"</p>
                  </div>
                </>
              ) : (
                <p className={cn(
                  "text-lg",
                  isMobile ? "text-base" : ""
                )}>How can I help with {category} today?</p>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "rounded-lg shadow-sm",
                    isMobile 
                      ? "px-3 py-2 max-w-[85%]" 
                      : "px-3 py-2 sm:px-4 sm:py-3 max-w-[90%] sm:max-w-[85%]",
                    msg.role === 'user' 
                      ? "bg-primary text-white" 
                      : "bg-primary/10 border border-primary/20"
                  )}
                  style={{
                    backgroundColor: msg.role === 'user' 
                      ? categoryColors[msg.category || category] 
                      : `${categoryColors[msg.category || category]}15`,
                    borderColor: msg.role === 'user' 
                      ? undefined 
                      : `${categoryColors[msg.category || category]}30`,
                    color: msg.role === 'user' ? 'white' : ''
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className={cn(
                      "flex items-center gap-1.5 mb-1.5",
                      isMobile ? "gap-1" : "sm:gap-2 sm:mb-2"
                    )}>
                      {(msg.category || category) === 'general' ? (
                        <div className={cn(
                          "flex items-center justify-center",
                          isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"
                        )}>
                          <MessageSquare className={cn(
                            "text-gray-700",
                            isMobile ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"
                          )} />
                        </div>
                      ) : (
                        <Avatar className={cn(
                          isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"
                        )}>
                          <AvatarImage 
                            src={advisorInfo[msg.category || category].image} 
                            alt={advisorInfo[msg.category || category].name} 
                          />
                          <AvatarFallback className={cn(
                            isMobile ? "text-[8px]" : "text-[10px] sm:text-xs"
                          )}>
                            {advisorInfo[msg.category || category].name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Only show name for specialized advisors, not for general AI */}
                      {(msg.category || category) !== 'general' && (
                        <>
                          <span className={cn(
                            "font-medium",
                            isMobile ? "text-[10px]" : "text-xs sm:text-sm"
                          )}>
                            {advisorInfo[msg.category || category].name}
                          </span>
                          <span className={cn(
                            "px-1.5 rounded",
                            isMobile ? "text-[8px] py-0.5" : "text-[10px] sm:text-xs sm:px-2"
                          )}
                            style={{
                              backgroundColor: `${categoryColors[msg.category || category]}15`,
                              color: categoryColors[msg.category || category],
                              borderColor: `${categoryColors[msg.category || category]}30`
                            }}
                          >
                            {msg.category || category}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className={cn(
                    "whitespace-pre-wrap break-words",
                    isMobile ? "text-sm" : "text-sm sm:text-base"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {showSuggestions && (followUpQuestions.length > 0 || suggestedActions.length > 0) && (
          <div className="mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Suggestions:</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {followUpQuestions.length > 0 && followUpQuestions.slice(0, 3).map((question: Question, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm justify-start text-left py-1.5 px-2.5 sm:py-2 sm:px-3"
                  style={{
                    borderColor: `${categoryColors[category]}30`,
                    color: categoryColors[category]
                  }}
                  onClick={() => handleSuggestionClick(question.question)}
                >
                  {question.question.length > 30 ? question.question.substring(0, 30) + '...' : question.question}
                </Button>
              ))}
              
              {suggestedActions.length > 0 && suggestedActions.slice(0, 2).map((suggestion: Suggestion, index: number) => (
                <Button
                  key={`action-${index}`}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm justify-start text-left py-1.5 px-2.5 sm:py-2 sm:px-3"
                  style={{
                    borderColor: `${categoryColors[category]}30`,
                    color: categoryColors[category]
                  }}
                  onClick={() => {
                    if (suggestion.action) {
                      // If there's a specific action, add it to the pending actions
                      const aiEventStore = useAIEventStore.getState();
                      aiEventStore.addPendingAction(suggestion.action);
                      // Process the action immediately
                      processPendingActions(navigate);
                    } else if (suggestion.path) {
                      // If there's just a path, navigate to it
                      navigate(suggestion.path);
                    } else {
                      // If it's just text, handle it as a suggestion
                      handleSuggestionClick(suggestion.text);
                    }
                  }}
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <CardFooter className={cn(
        "border-t",
        isMobile ? "p-2" : "p-2 sm:p-3"
      )}>
        <div className={cn(
          "flex w-full items-center gap-1.5",
          isMobile ? "gap-1" : "sm:gap-2"
        )}>
          <Textarea
            id="chat-input"
            className={cn(
              "resize-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex-1",
              isMobile 
                ? "min-h-10 max-h-24 py-2 px-3 text-sm" 
                : "min-h-12 sm:min-h-14 max-h-32 sm:max-h-40 py-2.5 px-3 sm:py-3 sm:px-4 text-sm sm:text-base"
            )}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isProcessing}
            onClick={handleSendMessage}
            className={cn(
              "shrink-0 rounded-full",
              isMobile ? "h-10 w-10" : "h-12 w-12 sm:h-14 sm:w-14"
            )}
            style={{
              backgroundColor: categoryColors[category],
              color: 'white',
              opacity: !input.trim() || isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <Loader2 className={cn(
                "animate-spin",
                isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"
              )} />
            ) : (
              <Send className={cn(
                isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"
              )} />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResumeChatProps {
  onUpdateResume: (updates: {
    summary?: string;
    experience?: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      school: string;
      degree: string;
      year: string;
    }>;
  }) => void;
  currentResume: {
    summary: string;
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      year: string;
    }>;
  };
}

export default function ResumeChat({ onUpdateResume, currentResume }: ResumeChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your personal resume assistant. I can help you optimize your resume and make it stand out. How can I help you today? You can ask me to: • Review your summary • Improve job descriptions • Highlight key achievements • Tailor your resume for specific roles"
    }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/resume/chat", {
        message,
        currentResume
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        throw new Error(data.message || "Failed to get response");
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);

      if (data.updates) {
        onUpdateResume(data.updates);
        toast({
          title: "Resume Updated",
          description: "Applied the suggested changes to your resume.",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get a response. Please try again.",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      await chatMutation.mutateAsync(userMessage);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-4rem)] sm:h-[600px] flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className="inline-flex items-start max-w-[80%] break-words p-3 rounded-lg">
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-2">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div
                    className={`${
                      message.role === 'assistant'
                        ? 'bg-[#E8F1FE] text-[#1f2937]'
                        : 'bg-primary text-primary-foreground ml-auto'
                    } p-3 rounded-lg`}
                    style={{
                      maxWidth: "80%",
                      display: "inline-block",
                      wordBreak: "break-word",
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-muted-foreground pl-8">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-3 mt-4 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resume improvements..."
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={chatMutation.isPending || !input.trim()}
            className="px-4 min-w-[44px]"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
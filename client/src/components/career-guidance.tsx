import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  riasecResults: string[];
  onBack: () => void;
}

export default function CareerGuidance({ riasecResults, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: `Based on your RIASEC assessment results, I can help guide you through career options and next steps. Your top matches are:

${riasecResults.map((result, i) => `${i + 1}. ${result}`).join('\n')}

What would you like to know more about? You can ask about:
- Specific career paths within these areas
- Required education or training
- Job market outlook
- Skills development recommendations
- Work environment preferences`
  }]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
      });
      return null;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript;
        setInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: "There was an error with speech recognition. Please try again.",
      });
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    return recognition;
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak clearly into your microphone. Press the mic button again or send to finish.",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    if (isRecording) {
      stopRecording();
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/career-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          riasecResults,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      setInput("");
    } catch (error) {
      console.error("Error getting career guidance:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble providing guidance right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Career Guide</CardTitle>
        <CardDescription>
          Get personalized guidance based on your RIASEC assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-hidden">
            <ScrollArea
              className="h-full"
            >
              <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="mb-6 last:mb-0"
                  >
                    <div className="rounded-lg px-4">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="text-gray-700 mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-none border-t bg-white">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 p-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about career paths, education, or next steps..."
                disabled={isLoading}
                className="flex-1"
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "outline" : "secondary"}
                  size="icon"
                  className={`h-10 w-10 transition-colors ${isRecording ? 'bg-primary/20' : ''}`}
                  onClick={toggleRecording}
                  disabled={isLoading}
                >
                  <Mic className={`h-4 w-4 ${isRecording ? 'text-primary animate-pulse' : ''}`} />
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full mt-4"
        >
          Back to Results
        </Button>
      </CardContent>
    </Card>
  );
}
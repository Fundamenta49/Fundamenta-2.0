import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Loader2, MessageSquare, ThumbsUp, Info, Star, 
  CheckCheck, ListChecks, Volume2, 
  VolumeX, Timer, Play, X,
  BookText, Briefcase, Target, Award, School, 
  Network, Users, Code, Lightbulb, Folder, FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { InterviewPracticePopOut } from "./interview-practice-pop-out";

// Industry-specific question categories
const industryQuestions = {
  general: [
    "Tell me about yourself.",
    "Where do you see yourself in five years?",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
    "Can you describe a challenging situation you've faced at work and how you handled it?",
    "What's your approach to working under pressure or tight deadlines?",
    "How do you handle feedback and criticism?",
    "Give an example of how you've demonstrated leadership.",
    "What achievement are you most proud of in your career so far?",
    "How do you stay current with industry trends and developments?",
  ],
  technical: [
    "What programming languages are you proficient in?",
    "Describe the most complex technical problem you've solved.",
    "Explain your database design experience.",
    "How do you approach debugging a complex issue?",
    "What CI/CD tools have you worked with?",
    "What's your approach to code quality and testing?",
    "How do you keep up with emerging technologies?",
    "Describe your experience with Agile methodologies.",
    "What's your experience with cloud platforms?",
    "How would you improve the performance of a slow application?",
  ],
  leadership: [
    "Describe your leadership style.",
    "How do you motivate team members?",
    "Tell me about a time you had to make a difficult decision as a leader.",
    "How do you handle conflicts within your team?",
    "Describe how you've mentored someone successfully.",
    "How do you delegate responsibilities?",
    "What's your approach to giving feedback?",
    "Tell me about a failed project and what you learned.",
    "How do you prioritize competing deadlines across a team?",
    "How do you promote innovation within your team?",
  ],
  customer_service: [
    "Tell me about a time you dealt with an angry customer.",
    "How do you handle customer complaints?",
    "Describe a situation where you went above and beyond for a customer.",
    "How do you prioritize customer needs?",
    "What metrics do you use to measure customer satisfaction?",
    "How do you build rapport with difficult customers?",
    "Tell me about a time you couldn't fulfill a customer's request.",
    "How do you stay patient with demanding customers?",
    "What's your approach to gathering customer feedback?",
    "How do you balance company policies with customer needs?",
  ],
  healthcare: [
    "How do you keep up with changing healthcare regulations?",
    "Describe your approach to patient confidentiality.",
    "How do you handle disagreements with colleagues about patient care?",
    "Tell me about a time you had to make a quick decision regarding patient care.",
    "How do you manage your emotions in stressful medical situations?",
    "How do you stay current with new medical research?",
    "Describe your experience with electronic health records systems.",
    "How would you handle a situation where you made a medical error?",
    "How do you approach communicating difficult news to patients?",
    "What's your experience with interdisciplinary healthcare teams?",
  ],
  education: [
    "How do you adapt your teaching methods for different learning styles?",
    "How do you assess student progress?",
    "Describe your classroom management philosophy.",
    "How do you incorporate technology in your teaching?",
    "Tell me about a challenging student and how you approached working with them.",
    "How do you communicate with parents/guardians?",
    "What's your approach to differentiated instruction?",
    "How do you handle disruptive behavior in class?",
    "Describe your experience with curriculum development.",
    "How do you measure your effectiveness as an educator?",
  ],
  sales: [
    "Describe your sales process from prospect to close.",
    "How do you handle rejection?",
    "Tell me about your most successful sale.",
    "How do you qualify leads?",
    "What CRM systems have you used?",
    "How do you research prospects before reaching out?",
    "Describe how you've overcome price objections.",
    "What's your approach to building relationships with clients?",
    "How do you stay motivated in a competitive sales environment?",
    "Tell me about a time you lost a sale and what you learned.",
  ],
};

// Base interview tips that can be customized
const baseInterviewTips = {
  general: {
    title: "General Preparation",
    icon: <Info className="h-4 w-4" />,
    shortDesc: "Research the company and role thoroughly",
    fullDesc: `# General Interview Preparation

Before any interview, make sure to:
• Research the company culture, values, and recent news
• Study the job description and identify key requirements
• Prepare specific examples that demonstrate your relevant skills
• Practice your answers to common questions
• Prepare thoughtful questions to ask the interviewer
• Plan your professional attire in advance
• Get a good night's sleep before the interview`,
  },
  star: {
    title: "STAR Method",
    icon: <Star className="h-4 w-4" />,
    shortDesc: "Structure your responses using the STAR method",
    fullDesc: `# The STAR Method

Structure your answers to behavioral questions using the STAR method:
• Situation: Describe the context and background
• Task: Explain what your responsibility was
• Action: Detail specifically what you did
• Result: Share the outcomes and what you learned

This format helps you provide complete, structured answers that highlight your skills and experience.`,
  },
  bodyLanguage: {
    title: "Body Language",
    icon: <Users className="h-4 w-4" />,
    shortDesc: "Project confidence through your body language",
    fullDesc: `# Body Language Tips

How you present yourself physically matters:
• Maintain good posture throughout the interview
• Make appropriate eye contact
• Offer a firm handshake at the beginning and end
• Avoid fidgeting or nervous habits
• Use natural hand gestures when speaking
• Mirror the interviewer's energy level
• Smile genuinely when appropriate`,
  },
  listening: {
    title: "Active Listening",
    icon: <Volume2 className="h-4 w-4" />,
    shortDesc: "Demonstrate engagement through active listening",
    fullDesc: `# Active Listening Skills

Show you're engaged and attentive:
• Focus completely on the interviewer when they speak
• Don't interrupt or rush to respond
• Ask clarifying questions if needed
• Reference earlier parts of the conversation to show you're paying attention
• Take a moment to formulate your thoughts before answering difficult questions`,
  },
};

// Function to get tips specific to the current question
const getQuestionSpecificTips = (question: string): any[] => {
  const tips: any[] = [];
  
  // Personal/background questions
  if (question.toLowerCase().includes("tell me about yourself") || 
      question.toLowerCase().includes("background")) {
    tips.push({
      ...baseInterviewTips.general,
      fullDesc: `${baseInterviewTips.general.fullDesc}

Tips for answering "Tell me about yourself":
• Begin with your current role and responsibilities
• Include relevant background and qualifications
• Highlight 2-3 key achievements
• Connect your background to this opportunity
• Keep your answer to 1-2 minutes`
    });
  }
  
  // Future-oriented questions
  else if (question.toLowerCase().includes("five years") || 
           question.toLowerCase().includes("see yourself")) {
    tips.push({
      ...baseInterviewTips.general,
      fullDesc: `${baseInterviewTips.general.fullDesc}

Tips for answering "${question}":
• Show ambition without being unrealistic
• Focus on skill development and growth
• Align with company's growth trajectory 
• Express commitment to the role/company
• Balance personal and professional goals`
    });
  }

  // Behavioral/project questions
  else if (question.toLowerCase().includes("describe") || question.toLowerCase().includes("how do you")) {
    tips.push({
      ...baseInterviewTips.star,
      fullDesc: `${baseInterviewTips.star.fullDesc}

Example for "${question}":
✓ Situation: Describe the specific context
✓ Task: Explain your responsibility
✓ Action: Detail your specific actions
✓ Result: Share quantifiable outcomes

Tips for this question:
• Choose a relevant, recent example
• Focus on your direct contributions
• Include specific metrics/results
• Highlight key learnings`
    });
  }

  // Add general tips that are always useful
  tips.push({
    ...baseInterviewTips.bodyLanguage,
    fullDesc: `${baseInterviewTips.bodyLanguage.fullDesc}

3. Specific to This Question:
• Use confident, open posture
• Maintain steady eye contact
• Use natural hand gestures to emphasize points
• Show engagement through active listening`
  });

  tips.push({
    ...baseInterviewTips.listening,
    fullDesc: `${baseInterviewTips.listening.fullDesc}

2. For This Question Type:
• Listen for specific requirements
• Take a moment to organize thoughts
• Structure response clearly
• Check understanding if needed`
  });

  return tips;
};

export default function InterviewPracticeRedesigned() {
  const [industry, setIndustry] = useState<keyof typeof industryQuestions>("general");
  const [jobField, setJobField] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [currentTips, setCurrentTips] = useState<any[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");
  
  // State for pop-out dialogs
  const [activePopOut, setActivePopOut] = useState<string | null>(null);
  
  // State variables for enhanced features
  const [isMockInterview, setIsMockInterview] = useState(false);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState<string[]>([]);
  const [currentMockQuestionIndex, setCurrentMockQuestionIndex] = useState(0);
  const [interviewFeedback, setInterviewFeedback] = useState<string[]>([]);
  const [interviewAnswers, setInterviewAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [starGuide, setStarGuide] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });
  const [interviewChecklist, setInterviewChecklist] = useState<{ id: number; task: string; completed: boolean }[]>([
    { id: 1, task: "Research company background and values", completed: false },
    { id: 2, task: "Review job description and requirements", completed: false },
    { id: 3, task: "Prepare 5-10 relevant questions to ask", completed: false },
    { id: 4, task: "Practice answers to common questions", completed: false },
    { id: 5, task: "Prepare professional attire", completed: false },
    { id: 6, task: "Print copies of resume", completed: false },
    { id: 7, task: "Confirm interview time and location", completed: false },
    { id: 8, task: "Plan your route to the interview", completed: false },
    { id: 9, task: "Get a good night's sleep", completed: false },
    { id: 10, task: "Prepare your portfolio (if applicable)", completed: false },
    { id: 11, task: "Bring a notepad and pen", completed: false },
    { id: 12, task: "Plan to arrive 10-15 minutes early", completed: false },
  ]);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2-minute default for answers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // For speech recognition
  const speechRecognition = useRef<any>(null);
  
  const generateQuestionsMutation = useMutation({
    mutationFn: async (field: string) => {
      const res = await apiRequest("POST", "/api/interview/questions", { jobField: field });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCustomQuestions(data.questions);
      toast({
        title: "Questions Generated",
        description: `Interview questions generated for ${jobField} role.${data.source === "career-one-stop" ? " (Using Career One Stop data)" : ""}`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate questions. Please try again.",
      });
      console.error("Error generating questions:", error);
    },
  });
  
  // Specific mutation for Career One Stop API
  const generateCareerOneStopQuestionsMutation = useMutation({
    mutationFn: async (field: string) => {
      const res = await apiRequest("POST", "/api/interview/questions/career-one-stop", { occupation: field });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate questions from Career One Stop");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCustomQuestions(data.questions);
      toast({
        title: "Industry-Specific Questions Ready",
        description: `${data.count} interview questions from Career One Stop for ${data.occupation}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Department of Labor API Failed",
        description: error.message || "Unable to retrieve industry-specific questions. Falling back to general questions.",
      });
      console.error("Error generating Career One Stop questions:", error);
      
      // Fall back to OpenAI questions if Career One Stop fails
      generateQuestionsMutation.mutate(jobField);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (answer: string) => {
      const res = await apiRequest("POST", "/api/interview/analyze", {
        answer,
        question: currentQuestion,
        industry,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze response");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setFeedback(data.feedback);
      toast({
        title: "Feedback Ready",
        description: "AI has analyzed your response.",
      });
      // Automatically show the feedback pop-out
      setActivePopOut("feedback");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Unable to analyze response. Please try again later.",
      });
      console.error("Error analyzing interview response:", error);
    },
  });

  const handleSelectQuestion = useCallback((question: string) => {
    setCurrentQuestion(question);
    setAnswer("");
    setCurrentTips(getQuestionSpecificTips(question));
    setFeedback("");
    
    // Reset timer when a new question is selected
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    }
    setTimeLeft(120);
    
    // Show the practice question pop-out
    setActivePopOut("practice");
  }, []);

  const handleGenerateQuestions = useCallback(() => {
    if (!jobField.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job field to generate specific questions.",
      });
      return;
    }
    
    // Use the enhanced OpenAI implementation directly
    generateQuestionsMutation.mutate(jobField);
    
  }, [jobField, generateQuestionsMutation, toast]);
  
  // Option to try Career One Stop API if credentials are available
  const handleCareerOneStopQuestions = useCallback(() => {
    if (!jobField.trim()) return;
    
    toast({
      title: "Attempting Career One Stop API",
      description: "This requires Department of Labor API credentials.",
    });
    
    generateCareerOneStopQuestionsMutation.mutate(jobField);
  }, [jobField, generateCareerOneStopQuestionsMutation]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;
      
      speechRecognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setAnswer(transcript);
      };
      
      speechRecognition.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      speechRecognition.current?.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognition.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };
  
  // Mock interview setup
  const startMockInterview = () => {
    // Create a mix of general and industry-specific questions
    const questionPool = [
      ...industryQuestions.general.slice(0, 3),
      ...industryQuestions[industry].slice(0, 5)
    ];
    
    // Add custom questions if available
    if (customQuestions.length > 0) {
      questionPool.push(...customQuestions.slice(0, 2));
    }
    
    // Shuffle questions
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5); // Select 5 questions
    
    setMockInterviewQuestions(selected);
    setInterviewAnswers(new Array(selected.length).fill(''));
    setInterviewFeedback(new Array(selected.length).fill(''));
    setCurrentMockQuestionIndex(0);
    setAnswer('');
    setIsMockInterview(true);
    setInterviewProgress(0);
    
    // Set current question
    handleSelectQuestion(selected[0]);
    setActivePopOut("mock-interview");
  };
  
  const updateInterview = (direction: 'next' | 'prev') => {
    // Save current answer
    const updatedAnswers = [...interviewAnswers];
    updatedAnswers[currentMockQuestionIndex] = answer;
    setInterviewAnswers(updatedAnswers);
    
    // Calculate progress
    const progress = ((currentMockQuestionIndex + 1) / mockInterviewQuestions.length) * 100;
    setInterviewProgress(progress);
    
    if (direction === 'next') {
      if (currentMockQuestionIndex < mockInterviewQuestions.length - 1) {
        const nextIndex = currentMockQuestionIndex + 1;
        setCurrentMockQuestionIndex(nextIndex);
        setAnswer(interviewAnswers[nextIndex] || '');
        handleSelectQuestion(mockInterviewQuestions[nextIndex]);
      } else {
        // Interview completed
        setIsMockInterview(false);
        toast({
          title: "Mock Interview Completed",
          description: "You've completed all questions. Review your performance.",
        });
      }
    } else {
      if (currentMockQuestionIndex > 0) {
        const prevIndex = currentMockQuestionIndex - 1;
        setCurrentMockQuestionIndex(prevIndex);
        setAnswer(interviewAnswers[prevIndex] || '');
        handleSelectQuestion(mockInterviewQuestions[prevIndex]);
      }
    }
  };
  
  // STAR method handling
  const updateStarGuide = (field: keyof typeof starGuide, value: string) => {
    setStarGuide(prev => ({ ...prev, [field]: value }));
  };
  
  const compileStarResponse = () => {
    const compiled = `
Situation: ${starGuide.situation}

Task: ${starGuide.task}

Action: ${starGuide.action}

Result: ${starGuide.result}
    `.trim();
    
    setAnswer(compiled);
  };
  
  // Checklist handling
  const toggleChecklistItem = (id: number) => {
    setInterviewChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Timer functions
  const startTimer = () => {
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setTimerRunning(false);
          toast({
            title: "Time's Up!",
            description: "Your answer time has ended. Try to be concise in interviews.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setTimeLeft(120);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (speechRecognition.current && isListening) {
        speechRecognition.current.stop();
      }
    };
  }, [isListening]);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render content for different pop-outs
  const renderPopOutContent = () => {
    switch (activePopOut) {
      case "practice":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant={isListening ? "destructive" : "outline"}
                        onClick={toggleListening}
                        disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                      >
                        {isListening ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                        {isListening ? "Stop" : "Start"} Voice
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? 
                        "Toggle voice recording for your answer" : 
                        "Voice input not supported in your browser"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant={timerRunning ? "destructive" : "outline"}
                        onClick={timerRunning ? stopTimer : startTimer}
                      >
                        {timerRunning ? 
                          <X className="h-4 w-4 mr-2" /> : 
                          <Timer className="h-4 w-4 mr-2" />
                        }
                        {timerRunning ? "Stop" : "Start"} Timer
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Time your answer (typical interviews expect 1-2 minute responses)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className={`text-lg font-mono ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`min-h-[200px] ${isListening ? 'border-green-500 border-2' : ''}`}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => analyzeMutation.mutate(answer)}
                disabled={!answer.trim() || analyzeMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {analyzeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4 mr-2" />
                )}
                Get AI Feedback
              </Button>

              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setActivePopOut("star")}
              >
                <Star className="h-4 w-4 mr-2" />
                Use STAR Method
              </Button>
            </div>
            
            {isMockInterview && (
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => updateInterview('prev')}
                  disabled={currentMockQuestionIndex === 0}
                >
                  Previous Question
                </Button>
                <Button
                  onClick={() => updateInterview('next')}
                >
                  {currentMockQuestionIndex === mockInterviewQuestions.length - 1 
                    ? "Complete Interview" 
                    : "Next Question"}
                </Button>
              </div>
            )}
          </div>
        );
        
      case "star":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                The STAR method helps you structure responses to behavioral interview questions,
                which ask about past experiences. It ensures you provide complete, concise answers that highlight your skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-yellow-500 text-white rounded-full h-6 w-6 inline-flex items-center justify-center text-xs">S</span>
                  Situation
                </h3>
                <p className="text-sm">Describe the context and background of the specific situation you faced</p>
                <Textarea 
                  placeholder="Describe the situation you were in..." 
                  className="h-24"
                  value={starGuide.situation}
                  onChange={(e) => updateStarGuide('situation', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full h-6 w-6 inline-flex items-center justify-center text-xs">T</span>
                  Task
                </h3>
                <p className="text-sm">Explain your responsibility or what you needed to accomplish</p>
                <Textarea 
                  placeholder="What was your specific responsibility..." 
                  className="h-24"
                  value={starGuide.task}
                  onChange={(e) => updateStarGuide('task', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full h-6 w-6 inline-flex items-center justify-center text-xs">A</span>
                  Action
                </h3>
                <p className="text-sm">Detail the specific steps you took to address the situation</p>
                <Textarea 
                  placeholder="What actions did you take..." 
                  className="h-24"
                  value={starGuide.action}
                  onChange={(e) => updateStarGuide('action', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="bg-purple-500 text-white rounded-full h-6 w-6 inline-flex items-center justify-center text-xs">R</span>
                  Result
                </h3>
                <p className="text-sm">Share the outcomes, quantify results, and describe what you learned</p>
                <Textarea 
                  placeholder="What were the results..." 
                  className="h-24"
                  value={starGuide.result}
                  onChange={(e) => updateStarGuide('result', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => {
                compileStarResponse();
                setActivePopOut("practice");
              }}
              disabled={!starGuide.situation || !starGuide.task || !starGuide.action || !starGuide.result}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Compile STAR Response
            </Button>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-blue-700 mb-2">Example STAR Response:</h3>
              <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-md">
                <p><strong className="text-yellow-600">Situation:</strong> In my previous role as a project manager, our team was facing a critical deadline for a major client deliverable, but we were falling behind schedule.</p>
                <p><strong className="text-blue-600">Task:</strong> I needed to reorganize our workflow and motivate the team to meet the deadline without compromising quality.</p>
                <p><strong className="text-green-600">Action:</strong> I called an emergency team meeting to identify bottlenecks, redistributed tasks based on strengths, implemented daily stand-ups, and created a visual progress tracker.</p>
                <p><strong className="text-purple-600">Result:</strong> We delivered the project on time with all requirements met. The client was impressed with the quality and extended our contract for an additional year, resulting in $200K in additional revenue.</p>
              </div>
            </div>
          </div>
        );
        
      case "checklist":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                Use this checklist to prepare for your upcoming interview. Mark items as completed as you go.
              </p>
            </div>
            
            <div className="space-y-2">
              {interviewChecklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox 
                    id={`task-${item.id}`} 
                    checked={item.completed} 
                    onCheckedChange={() => toggleChecklistItem(item.id)} 
                  />
                  <label
                    htmlFor={`task-${item.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      item.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {item.task}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-blue-700 mb-2">Your Progress:</h3>
              <Progress value={interviewChecklist.filter(item => item.completed).length / interviewChecklist.length * 100} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {interviewChecklist.filter(item => item.completed).length} of {interviewChecklist.length} tasks completed
              </p>
            </div>
          </div>
        );
        
      case "mock-interview":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                This mock interview consists of {mockInterviewQuestions.length} questions. 
                Answer each question as you would in a real interview. You'll receive feedback at the end.
              </p>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Question {currentMockQuestionIndex + 1} of {mockInterviewQuestions.length}</span>
                  <span>{Math.round(interviewProgress)}% Complete</span>
                </div>
                <Progress value={interviewProgress} className="h-2" />
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-lg">{currentQuestion}</p>
            </div>
            
            <div className="mt-4">
              {renderPopOutContent()}
            </div>
          </div>
        );
        
      case "feedback":
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2 mb-4">
              <p className="font-medium">{currentQuestion}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-blue-700 mb-2">Your Answer:</h3>
              <p className="text-sm whitespace-pre-line">{answer}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-blue-700 mb-2">AI Feedback:</h3>
              <div className="whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">{feedback}</div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setActivePopOut("practice")}
                variant="outline"
                className="mr-2"
              >
                Revise Answer
              </Button>
              <Button
                onClick={() => {
                  setActivePopOut(null);
                  setCurrentQuestion("");
                  setAnswer("");
                  setFeedback("");
                }}
              >
                Done
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Question Bank Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookText className="h-5 w-5" />
              Question Bank
            </CardTitle>
            <CardDescription className="text-blue-50">
              Browse and practice with common interview questions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-blue-900">Question Category</Label>
                <Select
                  value={industry}
                  onValueChange={(value) => setIndustry(value as keyof typeof industryQuestions)}
                >
                  <SelectTrigger id="category" className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Questions</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="leadership">Leadership & Management</SelectItem>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
                onClick={() => setActivePopOut("question-bank")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Browse Questions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Questions Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5" />
              Job-Specific Questions
            </CardTitle>
            <CardDescription className="text-blue-50">
              Generate questions tailored to your target role
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="jobField" className="text-sm font-medium text-blue-900">Job Title or Field</Label>
                <div className="flex gap-2">
                  <Input
                    id="jobField"
                    placeholder="e.g. Software Engineer, Teacher..."
                    value={jobField}
                    onChange={(e) => setJobField(e.target.value)}
                    className="border-blue-200 focus:border-blue-400"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCareerOneStopQuestions}
                          disabled={generateCareerOneStopQuestionsMutation.isPending || !jobField.trim()}
                          className="flex-shrink-0 border-blue-200"
                        >
                          {generateCareerOneStopQuestionsMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Network className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Try Career One Stop API (requires API key)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
                onClick={handleGenerateQuestions}
                disabled={generateQuestionsMutation.isPending || !jobField.trim()}
              >
                {generateQuestionsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                Generate Questions
              </Button>
              
              {customQuestions.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setActivePopOut("custom-questions")}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  View Generated Questions ({customQuestions.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* STAR Method Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-blue-700 to-blue-800 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5" />
              STAR Method
            </CardTitle>
            <CardDescription className="text-blue-50">
              Structure your responses for behavioral questions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-3">
              <p className="text-sm text-blue-900">
                The STAR method helps you create structured, compelling responses:
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><span className="text-yellow-500 font-semibold bg-yellow-50 w-6 h-6 flex items-center justify-center rounded-full">S</span>ituation - The context</li>
                <li className="flex items-center gap-2"><span className="text-blue-500 font-semibold bg-blue-50 w-6 h-6 flex items-center justify-center rounded-full">T</span>ask - Your responsibility</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-semibold bg-green-50 w-6 h-6 flex items-center justify-center rounded-full">A</span>ction - What you did</li>
                <li className="flex items-center gap-2"><span className="text-purple-500 font-semibold bg-purple-50 w-6 h-6 flex items-center justify-center rounded-full">R</span>esult - The outcome</li>
              </ul>
            </div>
            
            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
              onClick={() => {
                setAnswer("");
                setActivePopOut("star");
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Use STAR Method
            </Button>
          </CardContent>
        </Card>

        {/* Mock Interview Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-blue-800 to-indigo-700 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5" />
              Mock Interview
            </CardTitle>
            <CardDescription className="text-blue-50">
              Simulate a full interview experience
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <p className="text-sm text-blue-900">
                Practice with a simulated interview that includes:
              </p>
              <ul className="text-sm space-y-2 text-gray-700 grid grid-cols-2 gap-2">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Timer className="h-3.5 w-3.5 text-blue-700" />
                  </div>
                  <span>Timed responses</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 text-blue-700" />
                  </div>
                  <span>Industry questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <ThumbsUp className="h-3.5 w-3.5 text-blue-700" />
                  </div>
                  <span>AI feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-blue-700" />
                  </div>
                  <span>Realistic format</span>
                </li>
              </ul>
              
              <Button 
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
                onClick={startMockInterview}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Mock Interview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interview Checklist Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-indigo-700 to-indigo-800 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ListChecks className="h-5 w-5" />
              Interview Checklist
            </CardTitle>
            <CardDescription className="text-blue-50">
              Prepare fully for your interview
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-900">Track your preparation:</p>
                <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
                  {interviewChecklist.filter(i => i.completed).length}/{interviewChecklist.length}
                </span>
              </div>
              
              <Progress 
                value={interviewChecklist.filter(i => i.completed).length / interviewChecklist.length * 100} 
                className="h-2.5 bg-blue-100" 
              />
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
                onClick={() => setActivePopOut("checklist")}
              >
                <ListChecks className="h-4 w-4 mr-2" />
                View Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Interview Tips Card */}
        <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
          <CardHeader className="bg-gradient-to-br from-indigo-800 to-purple-700 text-white pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-5 w-5" />
              Interview Tips
            </CardTitle>
            <CardDescription className="text-blue-50">
              Expert advice for interview success
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="preparation" className="border-blue-200">
                    <AccordionTrigger className="text-sm font-medium text-blue-900 hover:text-blue-700">
                      Preparation Tips
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-700 bg-blue-50 p-2 rounded-md">
                      Research the company thoroughly, practice common questions, prepare examples of your achievements, and review the job description carefully.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="communication" className="border-blue-200">
                    <AccordionTrigger className="text-sm font-medium text-blue-900 hover:text-blue-700">
                      Communication Skills
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-700 bg-blue-50 p-2 rounded-md">
                      Speak clearly, use the STAR method for behavioral questions, avoid filler words, and practice active listening.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="followup" className="border-blue-200">
                    <AccordionTrigger className="text-sm font-medium text-blue-900 hover:text-blue-700">
                      Follow-up Strategy
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-700 bg-blue-50 p-2 rounded-md">
                      Send a thank-you email within 24 hours, reference specific discussion points, express continued interest, and follow their timeline instructions.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all"
                onClick={() => setActivePopOut("tips")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View All Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pop-out dialogs */}
      <InterviewPracticePopOut
        open={activePopOut === "question-bank"}
        onClose={() => setActivePopOut(null)}
        title="Interview Question Bank"
        description="Browse and practice with common interview questions"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {industry === "general" ? "General" : industry.charAt(0).toUpperCase() + industry.slice(1).replace("_", " ")} Questions
            </h3>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as keyof typeof industryQuestions)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Questions</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="leadership">Leadership & Management</SelectItem>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            {industryQuestions[industry].map((question, index) => (
              <Button
                key={`general-${index}`}
                variant="outline"
                className="justify-start h-auto py-3 text-left hover:bg-blue-50 hover:border-blue-300"
                onClick={() => {
                  handleSelectQuestion(question);
                  setActivePopOut("practice");
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                <span>{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "custom-questions"}
        onClose={() => setActivePopOut(null)}
        title={`${jobField} Interview Questions`}
        description="AI-generated questions specific to this role"
      >
        <div className="space-y-4">
          <div className="grid gap-2">
            {customQuestions.map((question, index) => (
              <Button
                key={`custom-${index}`}
                variant="outline"
                className="justify-start h-auto py-3 text-left hover:bg-blue-50 hover:border-blue-300"
                onClick={() => {
                  handleSelectQuestion(question);
                  setActivePopOut("practice");
                }}
              >
                <Target className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                <span>{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "practice"}
        onClose={() => {
          if (timerRunning) {
            stopTimer();
          }
          if (isListening) {
            speechRecognition.current?.stop();
            setIsListening(false);
          }
          setActivePopOut(null);
        }}
        title="Practice Question"
        description={currentQuestion}
      >
        {renderPopOutContent()}
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "star"}
        onClose={() => setActivePopOut(null)}
        title="STAR Method Interview Technique"
        description="Structure your answers to behavioral questions"
      >
        {renderPopOutContent()}
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "checklist"}
        onClose={() => setActivePopOut(null)}
        title="Interview Preparation Checklist"
        description="Track your interview preparation progress"
      >
        {renderPopOutContent()}
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "mock-interview"}
        onClose={() => {
          if (timerRunning) {
            stopTimer();
          }
          if (isListening) {
            speechRecognition.current?.stop();
            setIsListening(false);
          }
          setIsMockInterview(false);
          setActivePopOut(null);
        }}
        title="Mock Interview"
        description={`Question ${currentMockQuestionIndex + 1} of ${mockInterviewQuestions.length}`}
      >
        {renderPopOutContent()}
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "feedback"}
        onClose={() => setActivePopOut(null)}
        title="AI Interview Feedback"
        description="Analysis of your interview response"
      >
        {renderPopOutContent()}
      </InterviewPracticePopOut>
      
      <InterviewPracticePopOut
        open={activePopOut === "tips"}
        onClose={() => setActivePopOut(null)}
        title="Expert Interview Tips"
        description="Comprehensive advice for interview success"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Before the Interview
            </h3>
            <div className="grid gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1">Research the Company</h4>
                <p className="text-sm">Study the company's website, recent news, mission statement, culture, and industry position. Understand their products, services, and competitors.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1">Analyze the Job Description</h4>
                <p className="text-sm">Highlight key requirements and responsibilities. Prepare examples from your experience that demonstrate these skills and qualifications.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1">Practice Common Questions</h4>
                <p className="text-sm">Rehearse answers to standard questions while keeping them conversational. Record yourself and review your responses.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1">Prepare Your Questions</h4>
                <p className="text-sm">Develop thoughtful questions that demonstrate your interest in the role and company. Avoid questions about salary or benefits in initial interviews.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2">
              <Users className="h-5 w-5" />
              During the Interview
            </h3>
            <div className="grid gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1">First Impressions</h4>
                <p className="text-sm">Arrive 10-15 minutes early. Dress professionally, one level above the company dress code. Greet everyone politely with a firm handshake and smile.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1">Communication Skills</h4>
                <p className="text-sm">Speak clearly and confidently. Use the STAR method for behavioral questions. Maintain good eye contact and posture. Listen actively and avoid interrupting.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1">Handling Difficult Questions</h4>
                <p className="text-sm">Take a moment to think before answering tough questions. Be honest but positive about weaknesses, focusing on how you're improving. Never speak negatively about previous employers.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1">Closing Strong</h4>
                <p className="text-sm">Ask your prepared questions. Express your interest in the position. Ask about next steps in the process. Thank the interviewer for their time.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              After the Interview
            </h3>
            <div className="grid gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-1">Follow Up</h4>
                <p className="text-sm">Send a personalized thank-you email within 24 hours. Reference specific points from your conversation to show your attentiveness and continued interest.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-1">Self-Assessment</h4>
                <p className="text-sm">Reflect on what went well and what could be improved. Note any questions that were difficult so you can prepare better answers for future interviews.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-1">Appropriate Follow-up</h4>
                <p className="text-sm">If you haven't heard back within the timeframe mentioned, it's appropriate to send one follow-up email expressing your continued interest and asking for an update.</p>
              </div>
            </div>
          </div>
        </div>
      </InterviewPracticePopOut>
    </div>
  );
}
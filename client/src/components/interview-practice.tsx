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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Loader2, MessageSquare, Video, ThumbsUp, Info, Star, 
  Bookmark, CheckCircle, CheckCheck, ListChecks, Volume2, 
  Headphones, VolumeX, PenTool, Timer, Play, X,
  BookText, Briefcase, Target, Award, School, Calculator, 
  Network, Users, Code, Lightbulb, 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  star: {
    title: "STAR Method",
    shortDesc: "Use the STAR method for behavioral questions",
    fullDesc: `The STAR method is a structured approach to answering behavioral interview questions:

• Situation: Set the scene and context
• Task: Describe what you were responsible for
• Action: Explain exactly what you did
• Result: Share the outcomes of your actions`,
  },
  bodyLanguage: {
    title: "Body Language",
    shortDesc: "Maintain good posture and appropriate eye contact",
    fullDesc: `Key aspects of professional body language:

1. Posture
• Sit straight but relaxed
• Keep shoulders back and chin up
• Avoid crossing arms (appears defensive)

2. Eye Contact
• Maintain natural eye contact 60-70% of the time
• When speaking, look at different faces in the panel
• When listening, focus on the speaker`,
  },
  experience: {
    title: "Experience Examples",
    shortDesc: "Prepare relevant examples from your experience",
    fullDesc: `How to prepare compelling experience examples:

1. Create an Experience Bank
• List 5-7 significant projects/achievements
• Include challenges overcome
• Note measurable results`,
  },
  listening: {
    title: "Active Listening",
    shortDesc: "Practice active listening and thoughtful responses",
    fullDesc: `Active Listening Techniques:

1. During the Question
• Listen completely without interrupting
• Notice key words and themes
• Pay attention to the specific type of example requested`,
  },
};

// Question-specific tips mapping
const getQuestionSpecificTips = (question: string) => {
  const tips = [];

  // Personal introduction question
  if (question.toLowerCase().includes("tell me about yourself")) {
    tips.push({
      ...baseInterviewTips.experience,
      shortDesc: "Structure your personal introduction",
      fullDesc: `How to introduce yourself effectively:

1. Present Structure (60-90 seconds total)
• Start with current role/status (15 seconds)
• Highlight 2-3 key achievements (30 seconds)
• Connect past experience to desired role (15 seconds)
• End with enthusiasm for opportunity (15 seconds)

2. Key Elements to Include
• Relevant skills and experience
• Unique value proposition
• Professional passion/motivation
• Clear connection to role

Remember:
• Stay professional but personable
• Focus on relevant experiences
• Show enthusiasm and confidence
• Practice but don't sound rehearsed`
    });
  }

  // Future goals question
  else if (question.toLowerCase().includes("five years")) {
    tips.push({
      ...baseInterviewTips.experience,
      shortDesc: "Frame your career aspirations",
      fullDesc: `How to discuss your future goals:

1. Structure Your Response
• Start with immediate goals related to the role
• Discuss medium-term development plans
• Share long-term aspirations aligned with company growth

2. Key Points to Cover
• Professional development goals
• Leadership aspirations
• Industry knowledge growth
• Company contribution vision

Remember:
• Show ambition but stay realistic
• Align goals with company trajectory
• Emphasize commitment to growth
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

export default function InterviewPractice() {
  const [industry, setIndustry] = useState<keyof typeof industryQuestions>("general");
  const [jobField, setJobField] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [currentTips, setCurrentTips] = useState<any[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");

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

  // State variables for enhanced features
  const [activeTab, setActiveTab] = useState("question-bank");
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="question-bank" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>Question Bank</span>
          </TabsTrigger>
          <TabsTrigger value="star-method" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>STAR Method</span>
          </TabsTrigger>
          <TabsTrigger value="mock-interview" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>Mock Interview</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>Checklist</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Question Bank Tab */}
        <TabsContent value="question-bank" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Interview Question Bank</CardTitle>
              <CardDescription>
                Browse and practice with common interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Question Category</Label>
                <Select
                  value={industry}
                  onValueChange={(value) => setIndustry(value as keyof typeof industryQuestions)}
                >
                  <SelectTrigger id="category">
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

              <div className="space-y-2">
                <Label htmlFor="jobField">Job-Specific Questions</Label>
                <div className="flex gap-2">
                  <Input
                    id="jobField"
                    placeholder="e.g. Executive Chef, Software Engineer, etc."
                    value={jobField}
                    onChange={(e) => setJobField(e.target.value)}
                  />
                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={generateQuestionsMutation.isPending || !jobField.trim()}
                  >
                    {generateQuestionsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    <span className={isMobile ? "hidden" : "inline"}>Generate Questions</span>
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCareerOneStopQuestions}
                          disabled={generateCareerOneStopQuestionsMutation.isPending || !jobField.trim()}
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

              <div className="space-y-2">
                <Label>Select a Question to Practice</Label>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="general">
                    <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span>{industry === "general" ? "General" : industry.charAt(0).toUpperCase() + industry.slice(1).replace("_", " ")} Questions</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <div className="grid gap-2 mt-2">
                        {industryQuestions[industry].map((question, index) => (
                          <Button
                            key={`general-${index}`}
                            variant={currentQuestion === question ? "default" : "outline"}
                            className="justify-start h-auto py-3"
                            onClick={() => handleSelectQuestion(question)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-left">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {customQuestions.length > 0 && (
                    <AccordionItem value="custom">
                      <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span>{jobField} Questions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2">
                        <div className="grid gap-2 mt-2">
                          {customQuestions.map((question, index) => (
                            <Button
                              key={`custom-${index}`}
                              variant={currentQuestion === question ? "default" : "outline"}
                              className="justify-start h-auto py-3"
                              onClick={() => handleSelectQuestion(question)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-left">{question}</span>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </CardContent>
          </Card>
          
          {currentQuestion && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Practice Question</CardTitle>
                <CardDescription>{currentQuestion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  
                  <div className={`text-lg font-mono ${timeLeft < 30 ? 'text-red-500' : 'text-primary'}`}>
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
                    className="flex-1"
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
                    onClick={() => setSelectedTip(baseInterviewTips.star)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    STAR Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentQuestion && feedback && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  AI Feedback
                </CardTitle>
                <CardDescription>Analysis of your response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{feedback}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* STAR Method Tab */}
        <TabsContent value="star-method" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> 
                STAR Method Interview Technique
              </CardTitle>
              <CardDescription>
                Structure your answers to behavioral questions with the STAR method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg mb-4">
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
                className="w-full" 
                onClick={compileStarResponse}
                disabled={!starGuide.situation || !starGuide.task || !starGuide.action || !starGuide.result}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Compile STAR Response
              </Button>
              
              {answer && (
                <div className="mt-4 border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                  <h3 className="font-medium text-primary mb-2">Your Compiled Answer:</h3>
                  <div className="whitespace-pre-line">{answer}</div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => {
                        setActiveTab("question-bank");
                        if (!currentQuestion) {
                          handleSelectQuestion(industryQuestions.general[0]);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Get AI Feedback on This Answer
                    </Button>
                  </div>
                </div>
              )}
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Example STAR Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-yellow-600">Situation:</strong> In my previous role as a project manager, our team was facing a critical deadline for a major client deliverable, but we were falling behind schedule.</p>
                    <p><strong className="text-blue-600">Task:</strong> I needed to reorganize our workflow and motivate the team to meet the deadline without compromising quality.</p>
                    <p><strong className="text-green-600">Action:</strong> I called an emergency team meeting to identify bottlenecks, redistributed tasks based on strengths, implemented daily stand-ups, and created a visual progress tracker. I also negotiated with other departments for additional temporary resources.</p>
                    <p><strong className="text-purple-600">Result:</strong> We delivered the project on time with 100% of requirements met. The client was so impressed with our work that they increased their contract value by 30% the following quarter. I also documented our new workflow, which became a standard template for future projects.</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mock Interview Tab */}
        <TabsContent value="mock-interview" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI Mock Interview
              </CardTitle>
              <CardDescription>
                Simulate a complete job interview with AI feedback after each answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isMockInterview ? (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">What to Expect</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>5 questions tailored to your selected industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>Feedback after each answer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>Option to use voice input or typing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>Timed responses to simulate real interview pressure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>Complete performance summary at the end</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mock-industry">Select Industry Focus</Label>
                      <Select
                        value={industry}
                        onValueChange={(value) => setIndustry(value as keyof typeof industryQuestions)}
                      >
                        <SelectTrigger id="mock-industry" className="w-full">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="customer_service">Customer Service</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="mock-job-field">Specific Job Role (Optional)</Label>
                      <Input
                        id="mock-job-field"
                        placeholder="e.g. Marketing Manager"
                        value={jobField}
                        onChange={(e) => setJobField(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={startMockInterview} className="w-full" size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Start Mock Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Question {currentMockQuestionIndex + 1} of {mockInterviewQuestions.length}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                  
                  <Progress value={interviewProgress} className="w-full h-2" />
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="font-medium">{currentQuestion}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 my-2">
                    <Button 
                      size="sm" 
                      variant={isListening ? "destructive" : "outline"}
                      onClick={toggleListening}
                      disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                    >
                      {isListening ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                      {isListening ? "Stop" : "Start"} Voice
                    </Button>
                    
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
                  </div>
                  
                  <Textarea
                    placeholder="Type or speak your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className={`min-h-[150px] ${isListening ? 'border-green-500 border-2' : ''}`}
                  />
                  
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updateInterview('prev')}
                      disabled={currentMockQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      onClick={() => {
                        // First get feedback for current answer
                        if (answer.trim()) {
                          analyzeMutation.mutate(answer);
                        }
                        // Then move to next question
                        updateInterview('next');
                      }}
                    >
                      {currentMockQuestionIndex === mockInterviewQuestions.length - 1 ? 
                        'Finish Interview' : 'Next Question'}
                    </Button>
                  </div>
                  
                  {feedback && (
                    <Card className="mt-4 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          AI Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm whitespace-pre-wrap">{feedback}</div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interview Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Interview Day Checklist
              </CardTitle>
              <CardDescription>
                Make sure you're fully prepared for your interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="bg-primary/5 p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    Use this checklist to ensure you've covered everything before your interview.
                    Check off items as you complete them.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Before the Interview
                    </h3>
                    <div className="space-y-2 border p-3 rounded-lg">
                      {interviewChecklist.slice(0, 6).map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`task-${item.id}`} 
                            checked={item.completed}
                            onCheckedChange={() => toggleChecklistItem(item.id)}
                          />
                          <Label 
                            htmlFor={`task-${item.id}`}
                            className={item.completed ? "line-through text-muted-foreground" : ""}
                          >
                            {item.task}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      Day of the Interview
                    </h3>
                    <div className="space-y-2 border p-3 rounded-lg">
                      {interviewChecklist.slice(6).map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`task-${item.id}`} 
                            checked={item.completed}
                            onCheckedChange={() => toggleChecklistItem(item.id)}
                          />
                          <Label 
                            htmlFor={`task-${item.id}`}
                            className={item.completed ? "line-through text-muted-foreground" : ""}
                          >
                            {item.task}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        Interview Success Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Arrive 10-15 minutes early to compose yourself</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Turn off your phone completely before entering</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Make eye contact and greet everyone with a firm handshake</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Use the STAR method for behavioral questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Ask thoughtful questions about the company and role</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Send a thank-you email within 24 hours</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-primary" />
              {selectedTip?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">{selectedTip?.fullDesc}</div>
          <DialogFooter>
            <Button onClick={() => setSelectedTip(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
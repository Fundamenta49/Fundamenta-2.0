import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Wallet,
  ChefHat,
  Home,
  Clock,
  MessageSquare,
  Loader2,
  User,
  ArrowRight,
  BellRing,
  BookOpen,
  Star,
  Zap,
  Lightbulb,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ShoppingBuddy from "@/components/shopping-buddy";

// Define user profile interface for personalization
interface UserProfile {
  name: string;
  age: number;
  interests: string[];
  goals: string[];
  strengths: string[];
  weaknesses: string[];
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic";
  completedModules: string[];
  progress: Record<string, number>;
}

// Define a smart prompt interface
interface SmartPrompt {
  id: string;
  title: string;
  description: string;
  type: "tip" | "reminder" | "challenge" | "alert";
  category: string;
  isNew: boolean;
  createdAt: Date;
}

type LifeSkillsTabId = "dashboard" | "search" | "financial" | "cooking" | "home" | "time" | "communication" | "shopping";

// Complete implementation of Life Skills component with horizontal tabs and search functionality
export const LifeSkillsComponent = () => {
  const [activeTab, setActiveTab] = useState<LifeSkillsTabId>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  
  // References for tutorial/walkthrough
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Mock user profile - in a real app, this would come from a database
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex",
    age: 22,
    interests: ["Technology", "Cooking", "Personal Finance"],
    goals: ["Save for emergency fund", "Learn to cook 5 basic meals", "Improve time management"],
    strengths: ["Technology skills", "Research abilities"],
    weaknesses: ["Procrastination", "Financial planning"],
    learningStyle: "visual",
    completedModules: ["Budgeting 101", "Basic Home Repairs"],
    progress: {
      financial: 35,
      cooking: 20,
      home: 45,
      time: 10,
      communication: 15
    }
  });

  // Mock smart prompts - these would be generated dynamically based on user behavior
  const [smartPrompts, setSmartPrompts] = useState<SmartPrompt[]>([
    {
      id: "1",
      title: "It's 11pm - Time for sleep?",
      description: "Studies show that consistent sleep schedules improve productivity. Consider setting a sleep alarm to maintain a healthy routine.",
      type: "tip",
      category: "wellness",
      isNew: true,
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Weekend meal prep opportunity",
      description: "Weather forecast shows rain this weekend. Great time to learn meal prepping for the week!",
      type: "reminder",
      category: "cooking",
      isNew: true,
      createdAt: new Date()
    },
    {
      id: "3",
      title: "Emergency fund challenge",
      description: "Start building your emergency fund with the 50/30/20 rule. Let's set up a plan today!",
      type: "challenge",
      category: "financial",
      isNew: false,
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);

  // Tab definitions
  const tabs: Array<{id: LifeSkillsTabId, label: string, icon: React.ComponentType<{className?: string}>}> = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "search", label: "Search Skills", icon: Search },
    { id: "financial", label: "Financial", icon: Wallet },
    { id: "cooking", label: "Cooking", icon: ChefHat },
    { id: "home", label: "Home Care", icon: Home },
    { id: "time", label: "Time Management", icon: Clock },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "shopping", label: "Shopping Buddy", icon: ShoppingBag }
  ];

  // Function to handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // In a real app, this would call an actual API
      // Simulate a delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockGuidance = `Here's personalized guidance about "${searchQuery}" based on your interests in ${userProfile.interests.join(', ')} and your learning style:
      
      ${searchQuery.toLowerCase().includes('budget') ? 
        'For budgeting, I recommend using the 50/30/20 rule given your current financial goals. Since you learn best visually, I\'ve prepared a chart to help you track your expenses.' : 
        searchQuery.toLowerCase().includes('cook') ? 
        'Based on your interest in cooking and goal to learn 5 basic meals, I suggest starting with simple one-pot recipes that are hard to mess up. I\'ve curated video tutorials that match your visual learning style.' :
        'I\'ve found some resources tailored to your learning style and interests. Let\'s break this down into manageable steps based on your current skill level.'
      }`;
      
      setGuidance(mockGuidance);
    } catch (error) {
      console.error("Error searching:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to dismiss a smart prompt
  const dismissPrompt = (id: string) => {
    setSmartPrompts(prev => prev.filter(prompt => prompt.id !== id));
    toast({
      title: "Prompt dismissed",
      description: "We'll show you different prompts next time.",
    });
  };

  // Function to take action on a smart prompt
  const actionPrompt = (prompt: SmartPrompt) => {
    // In a real app, this would log the interaction and potentially navigate to relevant content
    toast({
      title: "Taking action",
      description: `Starting activity: ${prompt.title}`,
    });
    
    // If it's a financial challenge, navigate to financial tab
    if (prompt.category === "financial") {
      setActiveTab("financial");
    } else if (prompt.category === "cooking") {
      setActiveTab("cooking");
    }
    
    // Mark prompt as seen
    setSmartPrompts(prev => 
      prev.map(p => p.id === prompt.id ? {...p, isNew: false} : p)
    );
  };

  // Submit personal info in onboarding
  const submitPersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOnboarding(false);
    toast({
      title: "Profile updated",
      description: "Your learning experience is now personalized.",
    });
  };
  
  // Simulate receiving a new smart prompt based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    // Only run this effect once after component mounts
    const timeoutId = setTimeout(() => {
      if (hour >= 22 || hour <= 5) {
        // Late night prompt
        const lateNightPrompt: SmartPrompt = {
          id: "time-" + Date.now(),
          title: "Late night study session?",
          description: "I notice you're up late. Studies show taking breaks every 45 minutes improves retention. Would you like me to set a reminder?",
          type: "tip",
          category: "time",
          isNew: true,
          createdAt: new Date()
        };
        
        setSmartPrompts(prev => [lateNightPrompt, ...prev]);
      } else if (hour >= 11 && hour <= 14) {
        // Lunch time prompt
        const lunchPrompt: SmartPrompt = {
          id: "meal-" + Date.now(),
          title: "Lunch break meal idea",
          description: "Looking for a quick, healthy lunch? I've got a 15-minute recipe that matches your skill level.",
          type: "tip",
          category: "cooking",
          isNew: true,
          createdAt: new Date()
        };
        
        setSmartPrompts(prev => [lunchPrompt, ...prev]);
      }
    }, 5000); // Show after 5 seconds
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Calculate overall progress
  const calculateOverallProgress = (): number => {
    const categories = Object.keys(userProfile.progress);
    if (categories.length === 0) return 0;
    
    const total = categories.reduce((sum, category) => sum + userProfile.progress[category], 0);
    return Math.round(total / categories.length);
  };

  // Dashboard component
  const DashboardContent = () => (
    <div className="space-y-8 pt-2" ref={dashboardRef}>
      {/* Personalized greeting and progress */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userProfile.name}!</h2>
          <p className="text-muted-foreground mb-4">
            You're making good progress on your life skills journey.
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {Object.entries(userProfile.progress).map(([skill, progress]) => (
              <Card key={skill} className="bg-slate-50 border hover:shadow-md transition-shadow">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm capitalize">{skill}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Progress value={progress} className="h-1.5 mt-1" />
                  <p className="text-xs text-right mt-1">{progress}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Card className="w-full md:w-96 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <ul className="space-y-2">
              {userProfile.goals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full text-blue-600">
              Update Goals
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Smart prompts section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          Smart Prompts
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            {smartPrompts.filter(p => p.isNew).length} new
          </span>
        </h3>
        
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {smartPrompts.length > 0 ? (
              smartPrompts.map(prompt => (
                <Card key={prompt.id} className={cn(
                  "border hover:shadow-md transition-all",
                  prompt.isNew ? "bg-amber-50 border-amber-200" : "bg-white",
                  prompt.type === "alert" && "bg-red-50 border-red-200"
                )}>
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-base flex items-center">
                      {prompt.type === "tip" && <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />}
                      {prompt.type === "reminder" && <BellRing className="h-4 w-4 mr-2 text-blue-500" />}
                      {prompt.type === "challenge" && <Star className="h-4 w-4 mr-2 text-purple-500" />}
                      {prompt.type === "alert" && <AlertCircle className="h-4 w-4 mr-2 text-red-500" />}
                      {prompt.title}
                      {prompt.isNew && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(prompt.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 py-1">
                    <p className="text-sm">{prompt.description}</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-2 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => dismissPrompt(prompt.id)}
                    >
                      Dismiss
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => actionPrompt(prompt)}
                    >
                      Take Action
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center p-6 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">No smart prompts right now. Check back later!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Recommended content */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
          Recommended for You
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-base">Budgeting for Beginners</CardTitle>
              <CardDescription>Financial • 15 min read</CardDescription>
            </CardHeader>
            <CardContent className="p-3 py-2">
              <p className="text-sm">Learn the basics of budgeting with the popular 50/30/20 rule.</p>
            </CardContent>
            <CardFooter className="p-3 pt-1">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("financial")}>
                Start Learning
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-base">5 Simple Recipes for Beginners</CardTitle>
              <CardDescription>Cooking • 20 min read</CardDescription>
            </CardHeader>
            <CardContent className="p-3 py-2">
              <p className="text-sm">Master these five easy recipes to build your cooking confidence.</p>
            </CardContent>
            <CardFooter className="p-3 pt-1">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cooking")}>
                Start Learning
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );

  // Onboarding form for personalization
  const OnboardingForm = () => (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Personalize Your Learning Journey</h2>
      <p className="text-muted-foreground mb-6">
        Let us get to know you better so we can tailor your life skills learning experience.
      </p>
      
      <form onSubmit={submitPersonalInfo} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">About You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={userProfile.name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input type="number" defaultValue={userProfile.age} />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Your Goals</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">What life skills do you want to improve?</label>
            <Textarea 
              placeholder="e.g., I want to learn how to manage my finances better..."
              defaultValue={userProfile.goals.join("\n")}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Learning Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button"
              variant={userProfile.learningStyle === "visual" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "visual"}))}
            >
              <span className="text-lg mb-1">👁️</span>
              <span className="font-medium">Visual</span>
              <span className="text-xs mt-1">Learn by seeing</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "auditory" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "auditory"}))}
            >
              <span className="text-lg mb-1">👂</span>
              <span className="font-medium">Auditory</span>
              <span className="text-xs mt-1">Learn by hearing</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "reading" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "reading"}))}
            >
              <span className="text-lg mb-1">📚</span>
              <span className="font-medium">Reading</span>
              <span className="text-xs mt-1">Learn by reading</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "kinesthetic" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "kinesthetic"}))}
            >
              <span className="text-lg mb-1">✋</span>
              <span className="font-medium">Hands-on</span>
              <span className="text-xs mt-1">Learn by doing</span>
            </Button>
          </div>
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full">
            Start Personalized Journey
          </Button>
        </div>
      </form>
    </div>
  );

  // Tab content components
  const tabContent: Record<LifeSkillsTabId, React.ReactNode> = {
    dashboard: showOnboarding ? <OnboardingForm /> : <DashboardContent />,
    search: (
      <div className="space-y-4 pt-4">
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search for life skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : guidance ? (
          <div className="prose prose-slate max-w-none bg-white p-4 rounded-lg border-2 border-rose-100">
            <p className="text-base leading-relaxed whitespace-pre-line">{guidance}</p>
          </div>
        ) : null}
      </div>
    ),
    financial: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Financial Literacy Basics</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold">Personalized for you:</span> Based on your goals to build an emergency fund,
          we've highlighted saving strategies below.
        </p>
        <ul className="space-y-2">
          <li className="font-semibold">Creating and maintaining a budget</li>
          <li>Understanding credit scores and debt management</li>
          <li className="font-semibold">Saving strategies for emergencies and goals</li>
          <li>Basic investment concepts</li>
          <li>Tax planning fundamentals</li>
        </ul>
        
        <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h4 className="text-blue-700 flex items-center text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            Smart Tip
          </h4>
          <p className="text-sm mt-1">
            Try the 50/30/20 rule: 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.
            Based on your profile, starting with 10% savings could be more achievable.
          </p>
        </div>
      </div>
    ),
    cooking: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Essential Cooking Skills</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold">Personalized for you:</span> Given your interest in learning basic meals,
          we've curated visual recipes that match your learning style.
        </p>
        <ul className="space-y-2">
          <li>Basic knife techniques and kitchen safety</li>
          <li className="font-semibold">Understanding cooking methods (roasting, sautéing, boiling)</li>
          <li className="font-semibold">Meal planning and grocery shopping</li>
          <li>Reading and following recipes</li>
          <li>Food storage and leftovers management</li>
        </ul>
        
        <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
          <h4 className="text-green-700 flex items-center text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            Weekend Challenge
          </h4>
          <p className="text-sm mt-1">
            Try making a simple one-pot pasta dish this weekend. We'll send you a visual recipe
            card with step-by-step instructions matched to your skill level.
          </p>
        </div>
      </div>
    ),
    home: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Home Maintenance Skills</h3>
        <ul className="space-y-2">
          <li>Basic plumbing and fixing leaks</li>
          <li>Electrical safety and changing fixtures</li>
          <li>Wall repairs and painting techniques</li>
          <li>Cleaning routines and organization</li>
          <li>Seasonal home maintenance</li>
        </ul>
      </div>
    ),
    time: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Time Management Strategies</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold">Personalized for you:</span> Based on your weakness with procrastination,
          we've highlighted relevant strategies below.
        </p>
        <ul className="space-y-2">
          <li>Setting priorities and goals</li>
          <li className="font-semibold">Creating effective to-do lists</li>
          <li className="font-semibold">Avoiding procrastination</li>
          <li>Time blocking techniques</li>
          <li>Work-life balance strategies</li>
        </ul>
        
        <div className="mt-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
          <h4 className="text-purple-700 flex items-center text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            Try This Today
          </h4>
          <p className="text-sm mt-1">
            The Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.
            Research shows this can help overcome procrastination tendencies.
          </p>
        </div>
      </div>
    ),
    communication: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Communication Skills</h3>
        <ul className="space-y-2">
          <li>Active listening techniques</li>
          <li>Clear and concise speaking</li>
          <li>Managing difficult conversations</li>
          <li>Professional email writing</li>
          <li>Non-verbal communication awareness</li>
        </ul>
      </div>
    ),
    shopping: (
      <div className="pt-4">
        <ShoppingBuddy />
      </div>
    ),
  };

  return (
    <div className="w-full">
      {/* Horizontal Tab Bar - scrollable on mobile */}
      <div className="w-full overflow-auto pb-1 no-scrollbar">
        <div className="inline-flex mx-auto border-2 border-rose-100 rounded-md bg-white" style={{width: "90%"}}>
          <div className="flex space-x-1 p-1 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={cn(
                    "flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium flex-1 min-w-[120px]",
                    "transition-all duration-200 ease-in-out",
                    activeTab === tab.id
                      ? "bg-rose-50 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/20"
                  )}
                  onClick={() => setActiveTab(tab.id as LifeSkillsTabId)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 px-2">
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>
    </div>
  );
};
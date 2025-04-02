import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatInterface, { FITNESS_CATEGORY } from "@/components/chat-interface";

import ActiveYou from "@/components/active-you";
import FitnessProfile, { FitnessProfile as ProfileType } from "@/components/fitness-profile";
import ProfileManager from "@/components/profile-manager";
import { AlertCircle, Brain, Dumbbell, Bird as YogaIcon, Timer, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

// Define a type for our sections to improve TypeScript support
type ChatInterfaceProps = {
  category: typeof FITNESS_CATEGORY;
};

type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any> | ChatInterfaceProps;
  alert?: React.ReactNode;
};

const SECTIONS: SectionType[] = [
  {
    id: 'coach',
    title: 'Fitness AI Coach',
    description: 'Get personalized workout plans and fitness advice',
    icon: Brain,
    component: ChatInterface,
    props: { category: FITNESS_CATEGORY },
    alert: (
      <Alert className="mt-4 border-pink-500 bg-pink-50">
        <AlertCircle className="h-4 w-4 text-pink-500" />
        <AlertDescription className="text-pink-800 text-sm">
          The AI coach provides general fitness guidance. Always consult with a healthcare 
          professional before starting a new fitness program.
        </AlertDescription>
      </Alert>
    )
  },
  {
    id: 'activeyou',
    title: 'ActiveYou Profile',
    description: 'Manage your fitness profile and track your progress',
    icon: User,
    component: ProfileManager,
    props: { onUpdate: undefined as unknown as (profile: ProfileType) => void }
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Find peace and balance with guided meditation sessions',
    icon: Brain,
    component: ActiveYou,
    props: { defaultTab: "meditation" as const }
  },
  {
    id: 'weightlifting',
    title: 'Weight Lifting',
    description: 'Build strength with personalized workout plans',
    icon: Dumbbell,
    component: ActiveYou,
    props: { defaultTab: "weightlifting" as const }
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Improve flexibility and mindfulness through yoga',
    icon: YogaIcon,
    component: ActiveYou,
    props: { defaultTab: "yoga" as const }
  },
  {
    id: 'running',
    title: 'Running',
    description: 'Track your runs and improve your endurance',
    icon: Timer,
    component: ActiveYou,
    props: { defaultTab: "running" as const }
  }
];

export default function Active() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleProfileComplete = (profile: ProfileType) => {
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      setHasProfile(true);
      setExpandedSection("chat");

      toast({
        title: "Success!",
        description: "Your fitness profile has been created successfully!",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      });
      setHasProfile(false);
      localStorage.removeItem('fitnessProfile');
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile) {
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error loading saved profile:", error);
        localStorage.removeItem('fitnessProfile');
      }
    }
  }, []);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (!hasProfile && !skipProfile) {
    return (
      <div className="px-4 py-8">
        <div className="space-y-4">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-[#1C3D5A]">Welcome to Active You! 🎉</CardTitle>
              <CardDescription className="text-muted-foreground">
                Let's create your personalized fitness profile to help you achieve your goals.
                This will help us provide customized recommendations across all features.
              </CardDescription>
            </CardHeader>
          </Card>
          <FitnessProfile onComplete={handleProfileComplete} />
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={() => setSkipProfile(true)}
              className="text-muted-foreground hover:text-primary"
            >
              Skip for now and explore
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Active You
      </h1>

      {/* Grid-style cards layout */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-pink-50 text-pink-800 rounded-md border-l-4 border-pink-500">
            Fitness Tools
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 mt-2">
            {SECTIONS.map((section) => {
              // Update props for Profile Manager
              if (section.id === 'activeyou') {
                section.props = { onUpdate: handleProfileComplete };
              }
              
              return (
                <div key={section.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      setExpandedSection(section.id);
                    }}
                    className="relative flex flex-col items-center justify-between p-2 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-pink-500 h-[100px] sm:h-[120px] w-full"
                    aria-label={`Open ${section.title}`}
                  >
                    <div className="flex items-center justify-center h-10 w-full">
                      <section.icon className="w-7 h-7 text-pink-500" />
                    </div>
                    
                    <span className="text-xs sm:text-sm font-medium text-center line-clamp-2 w-full">{section.title}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Display the selected section/component when expandedSection is set */}
        {expandedSection && SECTIONS.map(section => {
          if (section.id === expandedSection) {
            return (
              <div key={section.id} className="mt-4 p-4 border rounded-lg bg-white shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-pink-500" />
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                
                {section.alert && (
                  <div className="mb-4">{section.alert}</div>
                )}
                
                {(() => {
                  if (section.id === 'coach') {
                    // Use the component's required "category" prop
                    return <ChatInterface category={FITNESS_CATEGORY} />;
                  } else {
                    // For regular components
                    return <section.component {...section.props} />;
                  }
                })()}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
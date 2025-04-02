import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  FullScreenDialog, 
  FullScreenDialogContent, 
  FullScreenDialogHeader, 
  FullScreenDialogTitle, 
  FullScreenDialogDescription, 
  FullScreenDialogBody 
} from "@/components/ui/full-screen-dialog";
import CareerCoachPopOut from "@/components/career-coach-pop-out";
import CareerAssessmentPopOut from "@/components/career-assessment-pop-out";
import ResumeBuilderPopOut from "@/components/resume-builder-pop-out";
import JobSearchPopOut from "@/components/job-search-pop-out";
// SalaryInsights is now part of JobSearchPopOut
import InterviewPracticeRedesigned from "@/components/interview-practice-redesigned";
import EmotionalResiliencePopOut from "@/components/emotional-resilience-pop-out";
import EmploymentRightsPopOut from "@/components/employment-rights-pop-out";
import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GraduationCap, Search, Book, Brain, FileText, Briefcase, DollarSign, MessageSquare, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

interface SkillGuidanceResponse {
  guidance: string;
}

// Define sections with their icons and components
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'Career AI Coach',
    description: 'Get professional guidance for your career journey',
    icon: Brain,
    component: CareerCoachPopOut
  },
  {
    id: 'assessment',
    title: 'Career Assessment',
    description: 'Discover your career interests and strengths',
    icon: GraduationCap,
    component: CareerAssessmentPopOut
  },
  {
    id: 'resume',
    title: 'Resume Builder',
    description: 'Create and manage your professional resume',
    icon: FileText,
    component: ResumeBuilderPopOut
  },
  {
    id: 'search',
    title: 'Fundamenta Connects',
    description: 'Find opportunities and research salary insights',
    icon: Briefcase,
    component: JobSearchPopOut
  },
  {
    id: 'interview',
    title: 'Interview Practice',
    description: 'Prepare for job interviews with AI feedback',
    icon: MessageSquare,
    component: InterviewPracticeRedesigned
  },
  {
    id: 'resilience',
    title: 'EQ & Resilience',
    description: 'Build emotional intelligence and career resilience',
    icon: Brain,
    component: EmotionalResiliencePopOut
  },
  {
    id: 'rights',
    title: 'Employment Rights',
    description: 'Learn about your workplace rights and protections',
    icon: Scale,
    component: EmploymentRightsPopOut
  }
];

export default function Career() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setDialogOpen(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "search",
          userQuery: searchQuery,
        }),
      });

      const data: SkillGuidanceResponse = await response.json();
      setGuidance(data.guidance);
    } catch (error) {
      console.error("Error searching skills:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (sectionId: string) => {
    setActiveDialog(sectionId);
  };
  
  // Check sessionStorage for sections to open on mount
  useEffect(() => {
    const openSection = sessionStorage.getItem('openSection');
    if (openSection) {
      handleCardClick(openSection);
      // Clear after using
      sessionStorage.removeItem('openSection');
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the current page
      if (route === '/career') {
        handleCardClick(section);
      }
    };
    
    // Add event listener
    document.addEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    };
  }, []);

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Career Development
      </h1>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl border-rose-50 bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              Learning Path
            </DialogTitle>
            <DialogDescription>
              Career guidance based on your search query
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{guidance}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Full-screen dialogs for each section */}
      {SECTIONS.map((section) => (
        <FullScreenDialog
          key={section.id}
          open={activeDialog === section.id}
          onOpenChange={(open) => {
            if (!open) setActiveDialog(null);
          }}
        >
          <FullScreenDialogContent>
            <FullScreenDialogHeader>
              <FullScreenDialogTitle>
                <div className="flex items-center gap-2">
                  <section.icon className="h-6 w-6 text-primary" />
                  {section.title}
                </div>
              </FullScreenDialogTitle>
              <FullScreenDialogDescription>
                {section.description}
              </FullScreenDialogDescription>
            </FullScreenDialogHeader>
            <FullScreenDialogBody>
              <section.component />
            </FullScreenDialogBody>
          </FullScreenDialogContent>
        </FullScreenDialog>
      ))}

      {/* Grid-style cards layout (similar to Learning section) */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-500">
            Career Tools
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 mt-2">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col">
                <button
                  onClick={() => setActiveDialog(section.id)}
                  className="relative flex flex-col items-center justify-between p-2 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-500 h-[100px] sm:h-[120px] w-full"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="flex items-center justify-center h-10 w-full">
                    <section.icon className="w-7 h-7 text-blue-500" />
                  </div>
                  
                  <span className="text-xs sm:text-sm font-medium text-center line-clamp-2 w-full">{section.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
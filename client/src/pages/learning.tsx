import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  BookOpen, 
  Code, 
  PenTool, 
  Languages, 
  Calculator,
  Music, 
  GraduationCap,
  BookIcon,
  Car,
  Wrench,
  Utensils,
  Heart,
  Brain,
  Users,
  HelpCircle,
  Clock,
  Lightbulb,
  MessageSquare,
  Star,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Define course type
interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  new?: boolean;
}

// Convert the icon components to match the BookCard component requirements
const Icons = {
  BookOpen: BookOpen as React.ComponentType<{ className?: string }>,
  Code: Code as React.ComponentType<{ className?: string }>,
  PenTool: PenTool as React.ComponentType<{ className?: string }>,
  Languages: Languages as React.ComponentType<{ className?: string }>,
  Calculator: Calculator as React.ComponentType<{ className?: string }>,
  Music: Music as React.ComponentType<{ className?: string }>,
  GraduationCap: GraduationCap as React.ComponentType<{ className?: string }>,
  Car: Car as React.ComponentType<{ className?: string }>,
  Wrench: Wrench as React.ComponentType<{ className?: string }>,
  Utensils: Utensils as React.ComponentType<{ className?: string }>,
  Heart: Heart as React.ComponentType<{ className?: string }>,
  Brain: Brain as React.ComponentType<{ className?: string }>,
  Users: Users as React.ComponentType<{ className?: string }>,
  HelpCircle: HelpCircle as React.ComponentType<{ className?: string }>,
  Clock: Clock as React.ComponentType<{ className?: string }>,
  Lightbulb: Lightbulb as React.ComponentType<{ className?: string }>,
  MessageSquare: MessageSquare as React.ComponentType<{ className?: string }>,
  Star: Star as React.ComponentType<{ className?: string }>,
  ShoppingBag: ShoppingBag as React.ComponentType<{ className?: string }>,
};

export default function Learning() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // No need for expandedCourse state since we directly navigate
  
  // Group courses by categories
  const LIFE_SKILLS: Course[] = [
    {
      id: 'shopping-buddy',
      title: 'Shopping Buddy',
      description: 'Get help with grocery planning and healthy food choices',
      icon: Icons.ShoppingBag,
      path: '/learning/courses/shopping-buddy',
      level: 'beginner',
      new: true
    },
    {
      id: 'vehicle-maintenance',
      title: 'Vehicle Maintenance',
      description: 'Learn essential car maintenance skills and save money on repairs',
      icon: Icons.Car,
      path: '/learning/courses/vehicle-maintenance',
      level: 'beginner',
      popular: true
    },
    {
      id: 'home-maintenance',
      title: 'Home Maintenance',
      description: 'Master basic home repairs and maintenance tasks',
      icon: Icons.Wrench,
      path: '/learning/courses/home-maintenance',
      level: 'beginner',
      popular: true
    },
    {
      id: 'cooking-basics',
      title: 'Cooking Basics',
      description: 'Learn fundamental cooking techniques and healthy meal preparation',
      icon: Icons.Utensils,
      path: '/learning/courses/cooking-basics',
      level: 'beginner',
      new: true,
      popular: true
    },
    {
      id: 'public-speaking',
      title: 'Public Speaking',
      description: 'Build confidence and deliver impactful speeches',
      icon: Icons.PenTool,
      path: '/learning/courses/public-speaking',
      level: 'beginner'
    },
    {
      id: 'critical-thinking',
      title: 'Critical Thinking',
      description: 'Develop analytical skills to evaluate information and solve complex problems',
      icon: Icons.Brain,
      path: '/learning/courses/critical-thinking',
      level: 'intermediate'
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution',
      description: 'Learn strategies to effectively navigate and resolve interpersonal conflicts',
      icon: Icons.Users,
      path: '/learning/courses/conflict-resolution',
      level: 'intermediate'
    },
    {
      id: 'decision-making',
      title: 'Decision Making',
      description: 'Master frameworks for making better decisions in both personal and professional settings',
      icon: Icons.HelpCircle,
      path: '/learning/courses/decision-making',
      level: 'intermediate'
    },
    {
      id: 'time-management',
      title: 'Time Management',
      description: 'Learn techniques to prioritize tasks and increase productivity',
      icon: Icons.Clock,
      path: '/learning/courses/time-management',
      level: 'beginner',
      popular: true
    },
    {
      id: 'coping-with-failure',
      title: 'Coping With Failure',
      description: 'Develop resilience and learn to transform setbacks into opportunities for growth',
      icon: Icons.Lightbulb,
      path: '/learning/courses/coping-with-failure',
      level: 'intermediate'
    },
    {
      id: 'conversation-skills',
      title: 'Conversation Skills',
      description: 'Improve your ability to engage in meaningful and effective conversations',
      icon: Icons.MessageSquare,
      path: '/learning/courses/conversation-skills',
      level: 'beginner'
    },
    {
      id: 'forming-positive-habits',
      title: 'Forming Positive Habits',
      description: 'Learn science-based approaches to building lasting positive habits',
      icon: Icons.Star,
      path: '/learning/courses/forming-positive-habits',
      level: 'beginner',
      new: true
    }
  ];
  
  const ACADEMICS: Course[] = [];
  
  const PROFESSIONAL: Course[] = [];
  
  const LANGUAGES: Course[] = [
    {
      id: 'spanish',
      title: 'Spanish',
      description: 'Learn one of the world\'s most spoken languages',
      icon: Icons.Languages,
      path: '/learning/courses/spanish',
      level: 'beginner',
      popular: true
    },
    {
      id: 'mandarin',
      title: 'Mandarin Chinese',
      description: 'Master the basics of this widely spoken language',
      icon: Icons.Languages,
      path: '/learning/courses/mandarin',
      level: 'intermediate'
    },
    {
      id: 'french',
      title: 'French',
      description: 'Learn the language of diplomacy and culture',
      icon: Icons.Languages,
      path: '/learning/courses/french',
      level: 'beginner'
    }
  ];
  
  const CREATIVE: Course[] = [
    {
      id: 'photography',
      title: 'Photography',
      description: 'Capture stunning images with any camera',
      icon: Icons.PenTool,
      path: '/learning/courses/photography',
      level: 'beginner'
    },
    {
      id: 'music',
      title: 'Music Basics',
      description: 'Theory, appreciation, and instrument fundamentals',
      icon: Icons.Music,
      path: '/learning/courses/music',
      level: 'beginner'
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing',
      description: 'Develop your storytelling and creative expression',
      icon: Icons.PenTool,
      path: '/learning/courses/creative-writing',
      level: 'beginner',
      new: true
    }
  ];
  
  // Combine all courses, with life skills only as requested
  const COURSES: Course[] = [
    ...LIFE_SKILLS,
    ...ACADEMICS,
    ...PROFESSIONAL
    // Removed Languages and Creative as requested
  ];

  // Direct navigation to the course page when a card is clicked
  const handleCardClick = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      // Navigate to the page
      navigate(course.path);
      // Scroll to the top of the page after navigation
      window.scrollTo(0, 0);
    }
  };

  // Check sessionStorage for courses to open on mount
  useEffect(() => {
    const openCourse = sessionStorage.getItem('openCourse');
    if (openCourse) {
      handleCardClick(openCourse);
      // Clear after using
      sessionStorage.removeItem('openCourse');
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the current page
      if (route === '/learning') {
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

  // This content rendering is no longer needed as we're directly navigating to the course page

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Learning Hub
      </h1>
      
      {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
      <div className="mx-4 sm:mx-6 mb-6 hidden sm:flex justify-end">
        <Button 
          onClick={() => setShowChat(!showChat)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <BookIcon className="mr-2 h-4 w-4" />
          Ask Learning Coach
        </Button>
      </div>

      {/* Categories with book-style cards */}
      <div className="px-3 sm:px-5 pt-2">
        {/* Life Skills Section - displayed as a grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 px-2 py-2 bg-orange-50 text-orange-800 rounded-md border-l-4 border-orange-500">
            Life Skills
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
            {LIFE_SKILLS.map((course) => (
              <div key={course.id} className="flex flex-col">
                <button
                  onClick={() => handleCardClick(course.id)}
                  className="relative flex flex-col items-center justify-between p-3 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-500 min-h-[90px] sm:min-h-[110px] lg:min-h-[120px] w-full"
                  aria-label={`Open ${course.title}`}
                >
                  <div className="flex items-center justify-center h-10 sm:h-12 w-full">
                    <course.icon className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                  </div>
                  
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center line-clamp-2 w-full mt-2">{course.title}</span>
                  
                  {course.popular && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-blue-500 rounded-full" 
                          aria-label="Popular course" />
                  )}
                  {course.new && (
                    <span className="absolute top-1.5 left-1.5 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-orange-500 rounded-full"
                          aria-label="New course" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Academic Section - Hidden as requested */}
        
        {/* Professional Section - Hidden as requested */}
        
        {/* Languages and Creative sections removed as requested */}
      </div>

      {/* Always show either the pop-out chat or the floating chat */}
      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}
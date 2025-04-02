import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription
} from '@/components/ui/full-screen-dialog';
import { 
  AlertCircle, 
  CheckCircle, 
  Star, 
  Award, 
  BookOpen, 
  Film, 
  CreditCard, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Car,
  Home as HomeIcon,
  GraduationCap,
  UserPlus,
  Clock,
  Calendar,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Percent,
  Info
} from 'lucide-react';
import { fetchYouTubeVideos } from '@/lib/youtube-service';

// Types
interface CreditQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface CreditSkillLevel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  videoKeywords: string;
  questions: CreditQuestion[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  relevantAge?: string; // e.g., "17-18", "18-20", "19+"
  milestones?: CreditMilestone[];
}

interface CreditMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pointsAwarded: number;
  creditScoreImpact: number; // approximate score improvement
  timeToImpact: string; // e.g., "1-3 months", "6-12 months"
}

interface UserProgress {
  completedLevels: string[];
  quizScores: Record<string, number>;
  videosWatched: string[];
  totalPoints: number;
  creditScore: number;
  milestones: string[]; // IDs of completed milestones
  simulationDecisions: Record<string, string>; // scenario ID -> decision made
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface CreditDecisionScenario {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    impact: {
      creditScore: number; // positive or negative impact
      timeframe: string;
      explanation: string;
    }
  }[];
  recommendedOption: string; // ID of the best option
}

// Credit journey paths/tracks
type CreditJourneyPath = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredAge: number; // minimum age
  milestones: CreditMilestone[];
  scenarios: CreditDecisionScenario[];
  tips: string[];
  recommendedNextSteps: string[];
};
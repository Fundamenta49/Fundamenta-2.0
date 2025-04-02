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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  Info,
  X,
  MapPin,
  Sparkles,
  Trophy
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
  // removed age designation
  milestones?: CreditMilestone[];
}

interface CreditMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pointsAwarded: number;
  creditScoreImpact: number;
  timeToImpact: string;
}

interface UserProgress {
  completedLevels: string[];
  quizScores: Record<string, number>;
  videosWatched: string[];
  totalPoints: number;
  creditScore: number;
  milestones: string[];
  simulationDecisions: Record<string, string>;
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
      creditScore: number;
      timeframe: string;
      explanation: string;
    }
  }[];
  recommendedOption: string;
}

// Credit journey paths/tracks
type CreditJourneyPath = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredAge: number;
  milestones: CreditMilestone[];
  scenarios: CreditDecisionScenario[];
  tips: string[];
  recommendedNextSteps: string[];
};

// Credit Journey Paths Data
const CREDIT_JOURNEYS: CreditJourneyPath[] = [
  {
    id: 'first-credit',
    title: 'Getting Your First Credit Card',
    description: 'Learn how to get your first credit card responsibly and build your credit history from scratch',
    icon: <CreditCard className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'research-cards',
        title: 'Research Student Credit Cards',
        description: 'Find cards designed for students with no credit history',
        completed: false,
        pointsAwarded: 10,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'secured-card',
        title: 'Apply for a Secured Credit Card',
        description: 'Get a secured card that requires a security deposit',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'authorized-user',
        title: 'Become an Authorized User',
        description: 'Ask a parent to add you as an authorized user on their card',
        completed: false,
        pointsAwarded: 20,
        creditScoreImpact: 30,
        timeToImpact: '1-2 months'
      },
      {
        id: 'first-payment',
        title: 'Make Your First On-Time Payment',
        description: 'Pay your credit card bill on time and in full',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 5,
        timeToImpact: '1 month'
      },
      {
        id: 'six-months-payments',
        title: 'Six Months of On-Time Payments',
        description: 'Maintain a perfect payment record for 6 months',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 40,
        timeToImpact: '6 months'
      }
    ],
    scenarios: [
      {
        id: 'first-card-choice',
        title: 'Choosing Your First Card',
        description: 'You\'re ready to get your first credit card. Which option is best for building credit?',
        options: [
          {
            id: 'store-card',
            text: 'Apply for a retail store card with 20% off your first purchase',
            impact: {
              creditScore: -5,
              timeframe: 'Short-term',
              explanation: 'Store cards often have high interest rates and low credit limits. The application will create a hard inquiry on your credit.'
            }
          },
          {
            id: 'student-card',
            text: 'Apply for a student credit card with no annual fee',
            impact: {
              creditScore: 10,
              timeframe: 'Medium-term',
              explanation: 'Student cards are designed for first-time users and often have benefits for on-time payments.'
            }
          },
          {
            id: 'premium-card',
            text: 'Apply for a premium rewards card with a $95 annual fee',
            impact: {
              creditScore: -10,
              timeframe: 'Short-term',
              explanation: 'You\'ll likely be denied due to no credit history, resulting in a hard inquiry but no new credit.'
            }
          },
          {
            id: 'secured-card',
            text: 'Apply for a secured credit card with a $200 deposit',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Secured cards are excellent starter cards that almost anyone can qualify for. The deposit reduces the lender\'s risk.'
            }
          }
        ],
        recommendedOption: 'secured-card'
      },
      {
        id: 'credit-limit-usage',
        title: 'Managing Your Credit Limit',
        description: 'You have a new credit card with a $500 limit. How much should you aim to use each month?',
        options: [
          {
            id: 'full-limit',
            text: 'Use the full $500 limit and pay the minimum due each month',
            impact: {
              creditScore: -40,
              timeframe: 'Medium-term',
              explanation: 'High utilization (100%) negatively impacts your score, and paying only the minimum leads to interest charges.'
            }
          },
          {
            id: 'half-limit',
            text: 'Use about $250 (50%) and pay in full each month',
            impact: {
              creditScore: 0,
              timeframe: 'Medium-term',
              explanation: '50% utilization is still considered high and may limit score growth, though paying in full is good.'
            }
          },
          {
            id: 'thirty-percent',
            text: 'Keep usage under $150 (30%) and pay in full each month',
            impact: {
              creditScore: 25,
              timeframe: 'Medium-term',
              explanation: 'Keeping utilization under 30% and paying in full are both great habits for credit building.'
            }
          },
          {
            id: 'no-use',
            text: 'Don\'t use the card at all to avoid any debt',
            impact: {
              creditScore: -5,
              timeframe: 'Long-term',
              explanation: 'Cards need regular activity to help build credit. Inactive cards may eventually be closed by the issuer.'
            }
          }
        ],
        recommendedOption: 'thirty-percent'
      }
    ],
    tips: [
      'Always pay your credit card bill in full and on time every month',
      'Keep your credit utilization under 30% of your credit limit',
      'Don\'t apply for multiple cards when you\'re just starting out',
      'Set up autopay to avoid missing payment due dates',
      'Check your card\'s rewards program to maximize benefits'
    ],
    recommendedNextSteps: [
      'After 6-12 months of responsible use, check if you qualify for a credit limit increase',
      'After a year of on-time payments, consider applying for a card with better rewards',
      'Sign up for free credit monitoring to track your progress'
    ]
  },
  {
    id: 'auto-loan',
    title: 'Financing Your First Car',
    description: 'Navigate auto loans and learn how they affect your credit score',
    icon: <Car className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'research-auto-loan',
        title: 'Research Auto Loan Options',
        description: 'Compare rates from banks, credit unions, and dealerships',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'get-preapproved',
        title: 'Get Pre-approved for a Loan',
        description: 'Secure loan approval before shopping for a car',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: -5,
        timeToImpact: 'Short-term (due to credit inquiry)'
      },
      {
        id: 'make-down-payment',
        title: 'Make a 20% Down Payment',
        description: 'Reduce your loan amount with a substantial down payment',
        completed: false,
        pointsAwarded: 30,
        creditScoreImpact: 10,
        timeToImpact: 'Medium-term'
      },
      {
        id: 'six-months-auto-payments',
        title: 'Six Months of Auto Loan Payments',
        description: 'Consistently pay your car loan on time for 6 months',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 35,
        timeToImpact: '6 months'
      }
    ],
    scenarios: [
      {
        id: 'auto-loan-term',
        title: 'Choosing Your Auto Loan Term',
        description: 'You\'re buying a $15,000 used car. Which loan term should you choose?',
        options: [
          {
            id: '72-month',
            text: '72-month loan at 6.5% interest ($252/month payment)',
            impact: {
              creditScore: 5,
              timeframe: 'Short-term',
              explanation: 'Lower monthly payments are easier to manage, but you\'ll pay more in interest over time and be underwater on the loan longer.'
            }
          },
          {
            id: '60-month',
            text: '60-month loan at 5.9% interest ($289/month payment)',
            impact: {
              creditScore: 10,
              timeframe: 'Medium-term',
              explanation: 'A balance of affordable payments and reasonable interest costs.'
            }
          },
          {
            id: '48-month',
            text: '48-month loan at 5.5% interest ($348/month payment)',
            impact: {
              creditScore: 15,
              timeframe: 'Medium-term',
              explanation: 'Higher monthly payments but less interest paid overall and faster equity building.'
            }
          },
          {
            id: '36-month',
            text: '36-month loan at 4.9% interest ($449/month payment)',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'The highest monthly payment but lowest total interest and fastest path to full ownership.'
            }
          }
        ],
        recommendedOption: '48-month'
      }
    ],
    tips: [
      'Get pre-approved for an auto loan before shopping for cars',
      'Make at least a 20% down payment to avoid being "underwater" on your loan',
      'Consider total cost of ownership, not just the monthly payment',
      'Shop around for the best interest rate, comparing at least 3 lenders',
      'Avoid extending your loan term just to lower monthly payments'
    ],
    recommendedNextSteps: [
      'Set up autopay for your auto loan to ensure on-time payments',
      'Consider making biweekly half-payments to pay off your loan faster',
      'After one year of on-time payments, check if refinancing could lower your rate'
    ]
  },
  {
    id: 'student-loans',
    title: 'Managing Student Loans',
    description: 'Learn how student loans affect your credit and strategies for responsible repayment',
    icon: <GraduationCap className="h-5 w-5" />,
    requiredAge: 17,
    milestones: [
      {
        id: 'understand-loan-terms',
        title: 'Understand Your Loan Terms',
        description: 'Know your interest rates, grace periods, and repayment options',
        completed: false,
        pointsAwarded: 20,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'set-up-loan-tracking',
        title: 'Set Up a Loan Tracking System',
        description: 'Create a system to track all your loans and payment dates',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'first-student-loan-payment',
        title: 'Make Your First Student Loan Payment',
        description: 'Begin your repayment journey on time after grace period ends',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 10,
        timeToImpact: '1 month'
      },
      {
        id: 'consistent-payments-1-year',
        title: 'One Year of On-Time Payments',
        description: 'Maintain consistent, on-time payments for a full year',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 40,
        timeToImpact: '12 months'
      }
    ],
    scenarios: [
      {
        id: 'repayment-plan-choice',
        title: 'Choosing a Repayment Plan',
        description: 'Your grace period is ending on $30,000 of student loans. Which repayment plan should you choose?',
        options: [
          {
            id: 'standard-plan',
            text: 'Standard 10-year repayment plan ($325/month payment)',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'Fixed payments that pay off loans in 10 years, building strong payment history.'
            }
          },
          {
            id: 'graduated-plan',
            text: 'Graduated plan starting at $200/month and increasing every 2 years',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Lower initial payments but higher total interest cost. Still builds positive payment history.'
            }
          },
          {
            id: 'extended-plan',
            text: 'Extended 25-year plan ($180/month payment)',
            impact: {
              creditScore: 10,
              timeframe: 'Long-term',
              explanation: 'Much lower payments but substantially higher total interest paid and slower debt reduction.'
            }
          },
          {
            id: 'income-based',
            text: 'Income-Based Repayment tied to your income level',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Payments based on income, which can be very manageable. Positive for credit if payments are made consistently.'
            }
          }
        ],
        recommendedOption: 'standard-plan'
      }
    ],
    tips: [
      'Make payments during your grace period if possible to reduce accrued interest',
      'Consider consolidating federal loans if you have many separate loans',
      'Look into forgiveness programs if you work in public service, education, or healthcare',
      'Set up autopay for a small interest rate reduction on federal loans',
      'Pay more than the minimum when you can to reduce total interest paid'
    ],
    recommendedNextSteps: [
      'Create a budget that prioritizes your student loan payments',
      'Set calendar reminders for when your grace period ends',
      'Research if your employer offers student loan repayment assistance'
    ]
  },
  {
    id: 'rent-reporting',
    title: 'Building Credit Through Rent',
    description: 'Learn how to use your rental history to build credit without debt',
    icon: <HomeIcon className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'find-rent-reporting',
        title: 'Find a Rent Reporting Service',
        description: 'Research services that report rent payments to credit bureaus',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'enroll-rent-reporting',
        title: 'Enroll in Rent Reporting',
        description: 'Sign up for a service that reports your rent payments',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'six-months-rent-reporting',
        title: 'Six Months of Reported Rent',
        description: 'Build credit history with six months of reported rent payments',
        completed: false,
        pointsAwarded: 40,
        creditScoreImpact: 35,
        timeToImpact: '6 months'
      },
      {
        id: 'twelve-months-rent-reporting',
        title: 'One Year of Reported Rent',
        description: 'Establish a solid payment history with a year of rent reporting',
        completed: false,
        pointsAwarded: 60,
        creditScoreImpact: 50,
        timeToImpact: '12 months'
      }
    ],
    scenarios: [
      {
        id: 'rent-reporting-service',
        title: 'Choosing a Rent Reporting Service',
        description: 'You want to build credit through your $1,000 monthly rent payments. Which option should you choose?',
        options: [
          {
            id: 'free-landlord',
            text: 'Ask your landlord to report your rent payments for free',
            impact: {
              creditScore: 15,
              timeframe: 'Medium-term',
              explanation: 'Excellent if your landlord agrees, but many landlords don\'t have systems in place for reporting.'
            }
          },
          {
            id: 'credit-bureau-service',
            text: 'Use a service that reports to all three credit bureaus for $9.95/month',
            impact: {
              creditScore: 40,
              timeframe: 'Long-term',
              explanation: 'Most comprehensive reporting ensures your rent payments boost your score with all lenders.'
            }
          },
          {
            id: 'single-bureau',
            text: 'Use a free service that only reports to one credit bureau',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'Better than nothing, but limited since many lenders check multiple bureaus.'
            }
          },
          {
            id: 'no-reporting',
            text: 'Don\'t report rent payments and focus on other credit-building methods',
            impact: {
              creditScore: 0,
              timeframe: 'Immediate',
              explanation: 'Misses an opportunity to build credit with payments you\'re already making.'
            }
          }
        ],
        recommendedOption: 'credit-bureau-service'
      }
    ],
    tips: [
      'Always pay rent on time – late payments can hurt your credit score',
      'Ask your landlord if they already work with a rent reporting service',
      'Some services can report up to 24 months of past rent payments',
      'Compare fees and which credit bureaus each service reports to',
      'Keep proof of your rent payments in case of reporting errors'
    ],
    recommendedNextSteps: [
      'Set up autopay or calendar reminders to ensure on-time rent payments',
      'After 6 months of rent reporting, check your credit score to see the impact',
      'Consider combining rent reporting with a secured credit card for faster credit building'
    ]
  }
];

// Educational module content
const CREDIT_EDUCATIONAL_MODULES: CreditSkillLevel[] = [
  {
    id: 'credit-basics',
    title: 'Credit Fundamentals',
    description: 'Learn what credit is and how it affects your financial future',
    icon: <BookOpen className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '10 min',
    // removed age designation
    videoKeywords: 'credit basics for beginners',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What is Credit?</h3>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Definition of Credit</h4>
          <p className="text-sm mt-1">
            Credit is borrowed money that you can use to purchase goods and services when you need them. You get credit from a credit grantor, whom you agree to pay back the amount you spent, plus applicable finance charges, at an agreed-upon time.
          </p>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Types of Credit</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="border border-green-200 dark:border-green-800 rounded p-3">
              <h5 className="font-medium text-sm">Revolving Credit</h5>
              <p className="text-xs mt-1">Credit cards and lines of credit that allow you to repeatedly borrow up to a set limit and make payments of your choice above the minimum due.</p>
            </div>
            <div className="border border-green-200 dark:border-green-800 rounded p-3">
              <h5 className="font-medium text-sm">Installment Credit</h5>
              <p className="text-xs mt-1">Loans that you repay with a fixed number of equal payments, such as car loans, mortgages, or student loans.</p>
            </div>
            <div className="border border-green-200 dark:border-green-800 rounded p-3">
              <h5 className="font-medium text-sm">Service Credit</h5>
              <p className="text-xs mt-1">Agreements with service providers like utility companies, cell phone providers, and doctors where you use the service first and pay later.</p>
            </div>
            <div className="border border-green-200 dark:border-green-800 rounded p-3">
              <h5 className="font-medium text-sm">Open Credit</h5>
              <p className="text-xs mt-1">Accounts that must be paid in full monthly, such as charge cards or certain American Express cards.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Why Credit Matters at Your Age</h4>
          <p className="text-sm mt-1">
            As you transition to adult life, good credit becomes essential for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Renting your first apartment (landlords check credit)</li>
            <li>Getting a cell phone plan without a large deposit</li>
            <li>Qualifying for a car loan with reasonable interest rates</li>
            <li>Avoiding security deposits on utilities</li>
            <li>Future job opportunities (some employers check credit)</li>
            <li>Eventually buying a home with affordable mortgage terms</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            Credit Myth Busting for Young Adults
          </h4>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> You need to be 21 to start building credit.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> You can start building credit at 18, or earlier as an authorized user on a parent's card.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> You need to carry a balance on credit cards to build credit.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> Paying your balance in full each month still builds your credit history and saves you money on interest.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> Young people should avoid credit entirely until they have a full-time job.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> Starting to build credit responsibly while young gives you a head start on a positive credit history.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "As a 17-year-old, what's the BEST way to start building credit?",
        options: [
          "Taking out a personal loan",
          "Becoming an authorized user on a parent's credit card",
          "Getting multiple credit cards right away",
          "Waiting until you're 18"
        ],
        correctAnswer: 1,
        explanation: "Becoming an authorized user on a parent's credit card with good standing is the best way to begin building credit before you turn 18. Their positive payment history can help establish your credit profile.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "Which of these will a landlord most likely check when you apply for your first apartment?",
        options: [
          "Your GPA",
          "Your social media profiles",
          "Your credit report",
          "Your high school attendance record"
        ],
        correctAnswer: 2,
        explanation: "Landlords typically check your credit report to assess whether you're likely to pay rent consistently and on time. This is why building good credit early can help you secure housing more easily.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "What percentage of your available credit should you ideally use to maintain a good credit score?",
        options: [
          "0% (not using it at all)",
          "Less than 30%",
          "50-70%",
          "90-100% (maximizing your credit)"
        ],
        correctAnswer: 1,
        explanation: "Credit utilization should ideally be kept below 30% of your available credit. Using more than that can signal financial stress to lenders and potentially lower your score.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "If you're a college student with a part-time job making $800/month, what would be a responsible credit limit for your first credit card?",
        options: [
          "$5,000",
          "$2,500",
          "$1,000",
          "$500"
        ],
        correctAnswer: 3,
        explanation: "A $500 limit is most appropriate for your income level. It's enough to build credit through regular small purchases while limiting the risk of accumulating unmanageable debt.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "How might having no credit history affect your ability to get a cell phone plan?",
        options: [
          "It won't affect it at all",
          "You'll need a cosigner",
          "You might need to pay a security deposit",
          "You'll be limited to prepaid plans only"
        ],
        correctAnswer: 2,
        explanation: "Without established credit, many cell phone providers will require a security deposit to activate your service, which can be several hundred dollars that's held until you establish payment reliability.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: 'credit-scores',
    title: 'Understanding Credit Scores',
    description: 'Learn how credit scores work and what affects them',
    icon: <TrendingUp className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    // removed age designation
    videoKeywords: 'how credit scores work for beginners',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How Credit Scores Work</h3>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Score Basics</h4>
          <p className="text-sm mt-1">
            A credit score is a three-digit number, typically between 300 and 850, that represents your creditworthiness. Higher scores indicate lower risk to lenders.
          </p>
          <div className="mt-3">
            <div className="relative h-7 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex text-xs">
                <div className="w-1/5 bg-red-500 flex items-center justify-center text-white">300-579<br/>Poor</div>
                <div className="w-1/5 bg-orange-500 flex items-center justify-center text-white">580-669<br/>Fair</div>
                <div className="w-1/5 bg-yellow-500 flex items-center justify-center text-white">670-739<br/>Good</div>
                <div className="w-1/5 bg-lime-500 flex items-center justify-center text-white">740-799<br/>Very Good</div>
                <div className="w-1/5 bg-green-600 flex items-center justify-center text-white">800-850<br/>Excellent</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">What Makes Up Your Credit Score</h4>
          <div className="mt-4 space-y-3">
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[35%] h-full bg-green-600 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Payment History</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">35%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[30%] h-full bg-blue-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Amounts Owed</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">30%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[15%] h-full bg-purple-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Length of History</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">15%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[10%] h-full bg-orange-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">New Credit</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">10%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[10%] h-full bg-pink-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Credit Mix</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">10%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Score Timeline for Young Adults</h4>
          <p className="text-sm mt-1">
            Building credit takes time. Here's a realistic timeline:
          </p>
          <div className="mt-4 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">No Credit to First Score</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              It typically takes 3-6 months of credit activity to generate your first score.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">First Year (Ages 18-19)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With consistent on-time payments, most young adults can achieve a score in the 650-700 range.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">2-3 Years (Ages 19-21)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With responsible management, scores can climb into the 700-740 range, qualifying you for better interest rates.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">5+ Years (Ages 23+)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With continued responsible habits, scores above 750 become achievable, opening doors to the best financial products.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            How to Check Your Credit Score
          </h4>
          <p className="text-sm mt-1">
            There are several ways to check your credit score for free:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
            <li>Many credit card companies provide free scores</li>
            <li>AnnualCreditReport.com offers free credit reports from all three bureaus once per year</li>
            <li>Credit monitoring services like Credit Karma, Credit Sesame offer free access</li>
            <li>Some banks and credit unions offer free credit scores to their customers</li>
          </ul>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-300">
            <strong>Important:</strong> Checking your own score is a "soft inquiry" and does not hurt your credit score.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "What factor has the BIGGEST impact on your credit score?",
        options: [
          "The total amount of debt you have",
          "Your payment history (whether you pay on time)",
          "The length of your credit history",
          "The types of credit you have"
        ],
        correctAnswer: 1,
        explanation: "Payment history makes up 35% of your credit score, making it the most influential factor. Consistently paying bills on time is the best way to build and maintain a good credit score.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "How long does it typically take to generate your first credit score after opening your first credit account?",
        options: [
          "Immediately",
          "1 month",
          "3-6 months",
          "At least 1 year"
        ],
        correctAnswer: 2,
        explanation: "It typically takes 3-6 months of credit activity before you generate your first credit score. This is why it's beneficial to start building credit early, even with small accounts.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "Which action would most quickly LOWER your credit score?",
        options: [
          "Applying for several credit cards in a short time period",
          "Paying off a loan early",
          "Checking your own credit score",
          "Closing a recently paid-off credit card"
        ],
        correctAnswer: 0,
        explanation: "Multiple credit applications in a short period create several hard inquiries and can significantly lower your score right away. They suggest to lenders that you may be in financial trouble.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "As a 19-year-old with one year of credit history and perfect payment record, what credit score range could you realistically expect?",
        options: [
          "800-850",
          "740-799",
          "670-739",
          "580-669"
        ],
        correctAnswer: 2,
        explanation: "With just one year of perfect payment history, a score in the 'Good' range (670-739) is realistic. Excellent scores typically require longer credit histories and diverse credit types.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "What does 'credit utilization' refer to?",
        options: [
          "How frequently you use your credit cards",
          "The percentage of your available credit that you're using",
          "How many different types of credit you have",
          "How long you've had credit accounts"
        ],
        correctAnswer: 1,
        explanation: "Credit utilization is the percentage of your total available credit that you're currently using. For example, if you have a $1,000 limit and a $300 balance, your utilization is 30%.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: 'first-credit-card',
    title: 'Your First Credit Card',
    description: 'How to get and manage your first credit card responsibly',
    icon: <CreditCard className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    // removed age designation
    videoKeywords: 'first credit card for beginners',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Getting Your First Credit Card</h3>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Card Options for Beginners</h4>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-green-600" />
                Authorized User
              </h5>
              <p className="text-xs mt-1">
                Get added to a parent or family member's existing credit card. Their account history will appear on your credit report.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Easy to obtain</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds credit</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>No credit check</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Limited control</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-green-600" />
                Student Credit Card
              </h5>
              <p className="text-xs mt-1">
                Cards designed for college students with little to no credit history. Often have lower credit limits and student-focused rewards.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Student perks</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds independence</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Requires income</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Hard inquiry</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <Lock className="h-4 w-4 text-green-600" />
                Secured Credit Card
              </h5>
              <p className="text-xs mt-1">
                Requires a security deposit that typically becomes your credit limit. Almost anyone can qualify, even with no credit history.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>High approval odds</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds credit fast</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Requires deposit</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Few rewards</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-600" />
                Credit Builder Account
              </h5>
              <p className="text-xs mt-1">
                Not a traditional credit card, but a special account that reports payments to credit bureaus. You "borrow" money that's held in a locked account.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>No credit needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Very safe option</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Not a real card</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Monthly fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">What You Need to Apply</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li><strong>Age:</strong> Must be at least 18 years old</li>
            <li><strong>Income:</strong> Need some form of income (part-time job, regular allowance, scholarships)</li>
            <li><strong>Identification:</strong> Social security number and government ID</li>
            <li><strong>Contact Information:</strong> Address, phone, email</li>
            <li><strong>Bank Account:</strong> Checking account for payments</li>
          </ul>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Under 21? The CARD Act requires you to either have independent income or a co-signer.
          </p>
        </div>
        
        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium text-blue-700 dark:text-blue-400">Using Your First Card Responsibly</h4>
          <div className="mt-3 space-y-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">1</div>
                Start with one card only
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Managing multiple cards is challenging for beginners. Master one card before considering others.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">2</div>
                Set up autopay for at least the minimum
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Missing payments severely damages your credit. Autopay ensures you never miss a payment due date.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">3</div>
                Pay in full each month
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Paying your balance in full avoids interest charges while still building credit. You don't need to carry a balance.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">4</div>
                Keep utilization under 30%
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                If your limit is $500, try not to carry a balance over $150. Low utilization signals responsible credit management.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">5</div>
                Track all spending
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Use the card's app or website to monitor transactions. Small purchases can add up quickly when using a card.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            Warning Signs You're Developing Bad Habits
          </h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-amber-800">
            <li>You're regularly maxing out your card</li>
            <li>You can't remember what you purchased</li>
            <li>You're only making minimum payments</li>
            <li>You're using the card for impulse purchases</li>
            <li>You're paying late fees</li>
            <li>You're using the card for everyday expenses you can't afford</li>
          </ul>
          <p className="text-xs mt-2 font-medium text-amber-800">
            If you notice these patterns, it's time to reassess your credit card habits before they damage your financial future.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "As an 18-year-old with no credit history, which of these credit cards would likely be EASIEST to get approved for?",
        options: [
          "A premium rewards card with airline miles",
          "A cash-back card with no annual fee",
          "A secured credit card requiring a $200 deposit",
          "A store credit card from a luxury retailer"
        ],
        correctAnswer: 2,
        explanation: "A secured credit card is specifically designed for people with no credit history. The security deposit reduces the lender's risk, making approval much more likely than with unsecured cards.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "What's the MOST important habit to develop with your first credit card?",
        options: [
          "Maximizing reward points",
          "Paying your bill on time every month",
          "Increasing your credit limit quickly",
          "Using the card for every purchase"
        ],
        correctAnswer: 1,
        explanation: "Paying your bill on time is absolutely critical. Payment history is the biggest factor in your credit score, and even one late payment can significantly damage your score for years.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "If you get a credit card with a $500 limit, how much should you aim to spend on it each month to optimize your credit score?",
        options: [
          "As close to $0 as possible",
          "No more than $150 (30%)",
          "Around $250-$350 (50-70%)",
          "The full $500 to show you can handle credit"
        ],
        correctAnswer: 1,
        explanation: "Keeping your utilization under 30% ($150 on a $500 limit) is ideal for your credit score. This shows you're using credit responsibly without relying too heavily on it.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "Which of these should you AVOID when getting your first credit card?",
        options: [
          "Setting up account alerts for all purchases",
          "Reading the full terms and conditions",
          "Applying for multiple cards at once to see which approves you",
          "Getting a card with no annual fee"
        ],
        correctAnswer: 2,
        explanation: "Applying for multiple cards at once creates several hard inquiries on your credit report, which can lower your score. Each application also makes lenders more hesitant to approve you.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "What should you do if you can't qualify for a traditional credit card?",
        options: [
          "Borrow someone else's card occasionally",
          "Wait until you turn 21 to apply again",
          "Consider alternatives like becoming an authorized user or getting a secured card",
          "Use a debit card instead and forget about building credit for now"
        ],
        correctAnswer: 2,
        explanation: "There are good alternatives if you can't qualify for a traditional credit card. Becoming an authorized user on a parent's card or getting a secured card are legitimate ways to start building credit.",
        difficulty: "beginner"
      }
    ]
  }
];

// Main component
export const CreditBuildingSkillsEnhanced: React.FC = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState('journey');
  const [selectedJourney, setSelectedJourney] = useState<CreditJourneyPath | null>(null);
  const [selectedModule, setSelectedModule] = useState<CreditSkillLevel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'journey' | 'module' | 'scenario' | 'quiz'>('journey');
  const [selectedScenario, setSelectedScenario] = useState<CreditDecisionScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  
  // User progress simulation (would be stored/fetched from backend in a real app)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLevels: [],
    quizScores: {},
    videosWatched: [],
    totalPoints: 0,
    creditScore: 300,
    milestones: [],
    simulationDecisions: {}
  });

  // Effects
  useEffect(() => {
    // Load videos for the selected module
    if (selectedModule) {
      loadYouTubeVideos(selectedModule.videoKeywords);
    }
  }, [selectedModule]);

  // Helper functions
  const loadYouTubeVideos = async (keywords: string) => {
    setIsLoadingVideos(true);
    try {
      const videos = await fetchYouTubeVideos(keywords);
      setYoutubeVideos(videos.slice(0, 3)); // Show top 3 videos
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setYoutubeVideos([]);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleJourneySelect = (journey: CreditJourneyPath) => {
    setSelectedJourney(journey);
    setDialogType('journey');
    setIsDialogOpen(true);
  };

  const handleModuleSelect = (module: CreditSkillLevel) => {
    setSelectedModule(module);
    setDialogType('module');
    setIsDialogOpen(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleScenarioSelect = (scenario: CreditDecisionScenario) => {
    setSelectedScenario(scenario);
    setSelectedOption(null);
    setDialogType('scenario');
    setIsDialogOpen(true);
  };

  const handleStartQuiz = () => {
    setDialogType('quiz');
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizOptionSelect = (questionId: number, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    if (!selectedModule) return;
    
    // Calculate score
    let correct = 0;
    selectedModule.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / selectedModule.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Update user progress
    if (score >= 70) {
      setUserProgress(prev => {
        const completedLevels = prev.completedLevels.includes(selectedModule.id) 
          ? prev.completedLevels 
          : [...prev.completedLevels, selectedModule.id];
          
        return {
          ...prev,
          completedLevels,
          quizScores: { ...prev.quizScores, [selectedModule.id]: score },
          totalPoints: prev.totalPoints + 50, // Award points for passing
          creditScore: Math.min(850, prev.creditScore + 5) // Small credit score boost
        };
      });
    }
  };

  const handleScenarioDecision = (optionId: string) => {
    if (!selectedScenario) return;
    
    setSelectedOption(optionId);
    
    // Get the selected option
    const option = selectedScenario.options.find(o => o.id === optionId);
    if (!option) return;
    
    // Update user progress
    setUserProgress(prev => {
      // Credit score change based on decision
      const newCreditScore = Math.min(850, Math.max(300, prev.creditScore + (option.impact.creditScore || 0)));
      
      return {
        ...prev,
        simulationDecisions: {
          ...prev.simulationDecisions,
          [selectedScenario.id]: optionId
        },
        totalPoints: prev.totalPoints + 25, // Points for making a decision
        creditScore: newCreditScore
      };
    });
  };

  const handleCompleteMilestone = (milestone: CreditMilestone) => {
    if (userProgress.milestones.includes(milestone.id)) return;
    
    setUserProgress(prev => {
      // Add milestone to completed list
      const newMilestones = [...prev.milestones, milestone.id];
      
      // Update credit score based on milestone impact
      const newCreditScore = Math.min(850, prev.creditScore + milestone.creditScoreImpact);
      
      return {
        ...prev,
        milestones: newMilestones,
        totalPoints: prev.totalPoints + milestone.pointsAwarded,
        creditScore: newCreditScore
      };
    });
  };

  // Render helper functions
  const renderJourneysGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {CREDIT_JOURNEYS.map(journey => (
          <Card 
            key={journey.id} 
            className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600"
            onClick={() => handleJourneySelect(journey)}
          >
            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 w-full"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-800/60 transition-colors">
                  <div className="text-green-600 dark:text-green-400">
                    {journey.icon}
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Age {journey.requiredAge}+
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2 text-green-700 dark:text-green-400">{journey.title}</CardTitle>
              <CardDescription>{journey.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm font-medium">Key Milestones:</div>
                <div className="space-y-2">
                  {journey.milestones.slice(0, 3).map(milestone => (
                    <div 
                      key={milestone.id} 
                      className={`p-2 rounded-md flex items-center gap-2 ${
                        userProgress.milestones.includes(milestone.id)
                          ? 'bg-green-100/70 dark:bg-green-950/70 border border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center ${
                        userProgress.milestones.includes(milestone.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {userProgress.milestones.includes(milestone.id) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">+{milestone.creditScoreImpact}</span>
                        )}
                      </div>
                      <span className="text-xs">{milestone.title}</span>
                    </div>
                  ))}
                  {journey.milestones.length > 3 && (
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                      +{journey.milestones.length - 3} more milestones
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJourneySelect(journey);
                }}
              >
                <span>View Credit Journey</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderEducationalModulesGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {CREDIT_EDUCATIONAL_MODULES.map(module => (
          <Card 
            key={module.id} 
            className={`hover:shadow-lg transition-all cursor-pointer overflow-hidden group ${
              userProgress.completedLevels.includes(module.id)
                ? 'border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600'
                : 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600'
            }`}
            onClick={() => handleModuleSelect(module)}
          >
            <div className={`h-2 w-full ${
              userProgress.completedLevels.includes(module.id)
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-green-400 to-green-600'
            }`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-full ${
                  userProgress.completedLevels.includes(module.id)
                    ? 'bg-green-400/30 dark:bg-green-700/50 group-hover:bg-green-400/40 dark:group-hover:bg-green-700/60'
                    : 'bg-green-100 dark:bg-green-900/40 group-hover:bg-green-200 dark:group-hover:bg-green-800/60'
                } transition-colors`}>
                  <div className="text-green-600 dark:text-green-400">
                    {module.icon}
                  </div>
                </div>
                <div className="flex gap-2">
                  {userProgress.completedLevels.includes(module.id) && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {module.difficulty === 'beginner' ? 'Basic' : module.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg mt-2 text-green-700 dark:text-green-400">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.estimatedTime}
                </div>
                {/* Removed age information */}
                <div className="flex items-center">
                  <Film className="h-4 w-4 mr-1" />
                  Videos & Guides
                </div>
              </div>
              
              {userProgress.quizScores[module.id] && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quiz Score: {userProgress.quizScores[module.id]}%
                  </div>
                  <Progress 
                    value={userProgress.quizScores[module.id]} 
                    className={`h-2 ${
                      userProgress.quizScores[module.id] >= 80 ? "bg-green-500" :
                      userProgress.quizScores[module.id] >= 60 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModuleSelect(module);
                }}
              >
                <span>{userProgress.completedLevels.includes(module.id) ? 'Review Material' : 'Start Learning'}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderProgressDashboard = () => {
    const completionPercentage = 
      CREDIT_EDUCATIONAL_MODULES.length > 0 
        ? Math.round((userProgress.completedLevels.length / CREDIT_EDUCATIONAL_MODULES.length) * 100)
        : 0;
    
    const completedMilestonesCount = userProgress.milestones.length;
    const totalMilestonesCount = CREDIT_JOURNEYS.reduce((acc, journey) => acc + journey.milestones.length, 0);
    const milestonesPercentage = totalMilestonesCount > 0 
      ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100)
      : 0;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Credit Score</CardTitle>
              <CardDescription>Current estimated score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {userProgress.creditScore}
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full ${
                      userProgress.creditScore >= 740 ? "bg-green-500" :
                      userProgress.creditScore >= 670 ? "bg-yellow-500" :
                      userProgress.creditScore >= 580 ? "bg-orange-500" :
                      "bg-red-500"
                    }`} 
                    style={{ width: `${Math.max(0, Math.min(100, ((userProgress.creditScore - 300) / 550) * 100))}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Knowledge Progress</CardTitle>
              <CardDescription>Completed modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {completionPercentage}%
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>{userProgress.completedLevels.length} of {CREDIT_EDUCATIONAL_MODULES.length}</span>
                  <span>Modules</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Real-World Progress</CardTitle>
              <CardDescription>Completed milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {milestonesPercentage}%
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>{completedMilestonesCount} of {totalMilestonesCount}</span>
                  <span>Milestones</span>
                </div>
                <Progress value={milestonesPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {userProgress.milestones.length > 0 ? (
                <div className="space-y-2">
                  {userProgress.milestones.slice(-3).map(milestoneId => {
                    // Find the milestone data
                    let milestoneData: CreditMilestone | undefined;
                    let journeyTitle = '';
                    
                    for (const journey of CREDIT_JOURNEYS) {
                      const found = journey.milestones.find(m => m.id === milestoneId);
                      if (found) {
                        milestoneData = found;
                        journeyTitle = journey.title;
                        break;
                      }
                    }
                    
                    if (!milestoneData) return null;
                    
                    return (
                      <div key={milestoneId} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
                          <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{milestoneData.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{journeyTitle}</div>
                          <div className="mt-1 flex gap-3 text-xs">
                            <span className="flex items-center text-amber-600 dark:text-amber-400">
                              <Sparkles className="h-3 w-3 mr-1" />
                              +{milestoneData.pointsAwarded} pts
                            </span>
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +{milestoneData.creditScoreImpact} score
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }).reverse()}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No milestones completed yet</p>
                  <p className="text-sm mt-1">Start a credit journey to begin tracking your real-world progress</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credit Journey Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CREDIT_JOURNEYS.filter(journey => 
                  journey.requiredAge <= 18 && 
                  userProgress.milestones.filter(id => 
                    journey.milestones.some(m => m.id === id)
                  ).length < 2
                ).slice(0, 2).map(journey => (
                  <div key={journey.id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-full">
                          {journey.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{journey.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{journey.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/50"
                        onClick={() => handleJourneySelect(journey)}
                      >
                        Start Journey
                      </Button>
                    </div>
                  </div>
                ))}
                
                {CREDIT_EDUCATIONAL_MODULES.filter(module => 
                  !userProgress.completedLevels.includes(module.id)
                ).slice(0, 1).map(module => (
                  <div key={module.id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-full">
                          {module.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{module.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{module.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                        onClick={() => handleModuleSelect(module)}
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'journey':
        return renderJourneyDialog();
      case 'module':
        return renderModuleDialog();
      case 'scenario':
        return renderScenarioDialog();
      case 'quiz':
        return renderQuizDialog();
      default:
        return null;
    }
  };

  const renderJourneyDialog = () => {
    if (!selectedJourney) return null;

    return (
      <>
        <FullScreenDialogHeader>
          <FullScreenDialogTitle className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
              {selectedJourney.icon}
            </div>
            {selectedJourney.title}
          </FullScreenDialogTitle>
          <FullScreenDialogDescription>
            Credit Building Path for ages {selectedJourney.requiredAge}+
          </FullScreenDialogDescription>
        </FullScreenDialogHeader>

        <FullScreenDialogBody>
          <div className="space-y-8">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="font-medium text-lg text-green-700 dark:text-green-400">About This Journey</h3>
              <p className="mt-1">{selectedJourney.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Key Milestones</h3>
              <div className="space-y-4">
                {selectedJourney.milestones.map((milestone, index) => {
                  const isCompleted = userProgress.milestones.includes(milestone.id);
                  
                  return (
                    <div 
                      key={milestone.id} 
                      className={`rounded-lg border p-4 ${
                        isCompleted 
                          ? 'bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
                          : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{milestone.description}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {milestone.pointsAwarded} points
                              </Badge>
                              
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {milestone.creditScoreImpact > 0 ? '+' : ''}{milestone.creditScoreImpact} score
                              </Badge>
                              
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {milestone.timeToImpact}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {!isCompleted && (
                          <Button 
                            size="sm"
                            onClick={() => handleCompleteMilestone(milestone)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Credit Decision Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedJourney.scenarios.map(scenario => {
                  const hasCompleted = userProgress.simulationDecisions[scenario.id];
                  const selectedOptionId = userProgress.simulationDecisions[scenario.id];
                  const selectedOption = scenario.options.find(o => o.id === selectedOptionId);
                  
                  return (
                    <Card key={scenario.id} className={hasCompleted ? 'border-green-200 dark:border-green-800' : ''}>
                      <CardHeader>
                        <CardTitle className="text-base">{scenario.title}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hasCompleted && selectedOption && (
                          <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded border border-green-200 dark:border-green-800 mb-3">
                            <div className="text-sm font-medium">Your Decision:</div>
                            <div className="text-sm mt-1">{selectedOption.text}</div>
                            <div className="mt-2 flex gap-2">
                              <Badge variant={selectedOption.impact.creditScore >= 0 ? 'default' : 'destructive'} className="text-xs">
                                {selectedOption.impact.creditScore >= 0 ? '+' : ''}{selectedOption.impact.creditScore} credit score
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          className="w-full"
                          variant={hasCompleted ? "outline" : "default"}
                          onClick={() => handleScenarioSelect(scenario)}
                        >
                          {hasCompleted ? 'Review Scenario' : 'Make a Decision'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Tips for Success</h3>
                <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <ul className="space-y-2">
                    {selectedJourney.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-blue-100 dark:bg-blue-800/40 w-5 h-5 rounded-full flex items-center justify-center text-xs text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Next Steps</h3>
                <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                  <ul className="space-y-2">
                    {selectedJourney.recommendedNextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="bg-green-100 dark:bg-green-800/40 w-5 h-5 rounded-full flex items-center justify-center text-xs text-green-700 dark:text-green-400 flex-shrink-0 mt-0.5">
                          <ChevronRight className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FullScreenDialogBody>

        <FullScreenDialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
        </FullScreenDialogFooter>
      </>
    );
  };

  const renderModuleDialog = () => {
    if (!selectedModule) return null;

    return (
      <>
        <FullScreenDialogHeader>
          <FullScreenDialogTitle className="flex items-center gap-2">
            {selectedModule.icon}
            {selectedModule.title}
          </FullScreenDialogTitle>
          <FullScreenDialogDescription>
            {selectedModule.description} • {selectedModule.estimatedTime}
          </FullScreenDialogDescription>
        </FullScreenDialogHeader>

        <FullScreenDialogBody>
          <div className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-green-100 dark:bg-green-900/30">
                <TabsTrigger 
                  value="content" 
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
                >
                  Learning Content
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
                >
                  Video Resources
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz" 
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
                >
                  Practice Quiz
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {selectedModule.content}
                </div>
              </TabsContent>
              
              <TabsContent value="videos" className="mt-4">
                {isLoadingVideos ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-opacity-50 border-t-green-800 rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading video resources...</p>
                  </div>
                ) : youtubeVideos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {youtubeVideos.map(video => (
                      <div key={video.id} className="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="aspect-video relative">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm">{video.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Film className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Videos Available</h3>
                    <p className="text-gray-600 dark:text-gray-400">We couldn't load video resources for this topic.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800 mb-4">
                  <h3 className="font-medium">Test Your Knowledge</h3>
                  <p className="text-sm mt-1">
                    Answer the following questions to check your understanding of {selectedModule.title.toLowerCase()}.
                  </p>
                </div>
                
                <div className="space-y-1 mb-4">
                  <Button onClick={handleStartQuiz}>Start Quiz</Button>
                </div>
                
                {userProgress.quizScores[selectedModule.id] && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Previous Score:</div>
                      <Badge className={
                        userProgress.quizScores[selectedModule.id] >= 80 ? "bg-green-500" :
                        userProgress.quizScores[selectedModule.id] >= 60 ? "bg-yellow-500" :
                        "bg-red-500"
                      }>
                        {userProgress.quizScores[selectedModule.id]}%
                      </Badge>
                    </div>
                    <Progress 
                      value={userProgress.quizScores[selectedModule.id]} 
                      className={`mt-2 h-2 ${
                        userProgress.quizScores[selectedModule.id] >= 80 ? "bg-green-500" :
                        userProgress.quizScores[selectedModule.id] >= 60 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </FullScreenDialogBody>

        <FullScreenDialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
        </FullScreenDialogFooter>
      </>
    );
  };

  const renderScenarioDialog = () => {
    if (!selectedScenario) return null;

    const hasSelectedOption = !!selectedOption;
    const selectedOptionData = selectedScenario.options.find(o => o.id === selectedOption);
    const isRecommendedOption = selectedOption === selectedScenario.recommendedOption;
    
    return (
      <>
        <FullScreenDialogHeader>
          <FullScreenDialogTitle>Financial Decision Scenario</FullScreenDialogTitle>
          <FullScreenDialogDescription>
            Choose the best option for your financial future
          </FullScreenDialogDescription>
        </FullScreenDialogHeader>

        <FullScreenDialogBody>
          <div className="space-y-6">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="font-medium text-lg">{selectedScenario.title}</h3>
              <p className="mt-1">{selectedScenario.description}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Your Options:</h3>
              
              <RadioGroup value={selectedOption || ''} disabled={hasSelectedOption}>
                {selectedScenario.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`rounded-lg border p-4 mb-3 ${
                      hasSelectedOption && selectedOption === option.id
                        ? option.impact.creditScore >= 0 
                          ? 'bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
                          : 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700'
                    } ${hasSelectedOption && option.id !== selectedOption ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id} 
                        onClick={() => !hasSelectedOption && handleScenarioDecision(option.id)}
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={option.id} 
                          className="font-medium text-base cursor-pointer"
                        >
                          {option.text}
                        </Label>
                        
                        {hasSelectedOption && selectedOption === option.id && (
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className={
                                option.impact.creditScore > 0 ? "bg-green-500" :
                                option.impact.creditScore < 0 ? "bg-red-500" :
                                "bg-gray-500"
                              }>
                                {option.impact.creditScore > 0 ? '+' : ''}{option.impact.creditScore} Credit Score
                              </Badge>
                              <Badge variant="outline">
                                {option.impact.timeframe} Impact
                              </Badge>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="text-sm font-medium mb-1">Impact Explanation:</div>
                              <p className="text-sm">{option.impact.explanation}</p>
                            </div>
                            
                            {isRecommendedOption ? (
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-medium">Excellent Choice!</div>
                                  <p className="text-sm">This is the recommended option for maximizing your credit score and financial health.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-medium">Consider Your Options</div>
                                  <p className="text-sm">There might be a better choice available that would have a more positive impact on your credit.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              
              {!hasSelectedOption && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    How to Choose
                  </h4>
                  <p className="text-sm mt-1">
                    Consider which option would best support your long-term credit goals. Think about the impact on your credit score, your current financial situation, and future flexibility.
                  </p>
                </div>
              )}
            </div>
          </div>
        </FullScreenDialogBody>

        <FullScreenDialogFooter>
          <div className="flex gap-2">
            {hasSelectedOption ? (
              <Button 
                variant="default" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Decide Later
              </Button>
            )}
          </div>
        </FullScreenDialogFooter>
      </>
    );
  };

  const renderQuizDialog = () => {
    if (!selectedModule) return null;

    return (
      <>
        <FullScreenDialogHeader>
          <FullScreenDialogTitle>
            {quizSubmitted ? 'Quiz Results' : 'Knowledge Check Quiz'}
          </FullScreenDialogTitle>
          <FullScreenDialogDescription>
            {quizSubmitted 
              ? `You scored ${quizScore}% on the ${selectedModule.title.toLowerCase()} quiz` 
              : `Test your knowledge of ${selectedModule.title.toLowerCase()}`
            }
          </FullScreenDialogDescription>
        </FullScreenDialogHeader>

        <FullScreenDialogBody>
          {quizSubmitted ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{ 
                      borderTopColor: quizScore >= 70 ? '#22c55e' : quizScore >= 50 ? '#eab308' : '#ef4444',
                      transform: `rotate(${45 + (quizScore / 100) * 360}deg)`,
                      transition: 'transform 1s ease'
                    }}
                  ></div>
                  <div className="text-3xl font-bold">
                    {quizScore}%
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                quizScore >= 70 
                  ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                  : quizScore >= 50 
                    ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
              }`}>
                <h3 className="font-medium text-lg">
                  {quizScore >= 70 
                    ? 'Great job!' 
                    : quizScore >= 50 
                      ? 'Good effort!' 
                      : 'Keep learning!'}
                </h3>
                <p className="mt-1">
                  {quizScore >= 70 
                    ? 'You\'ve demonstrated a good understanding of the material.' 
                    : quizScore >= 50 
                      ? 'You\'re on the right track, but could benefit from reviewing some concepts.' 
                      : 'It looks like you might need to review this content more thoroughly.'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-4">Question Review</h3>
                <div className="space-y-6">
                  {selectedModule.questions.map((question, index) => {
                    const userAnswer = quizAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="font-medium">Question {index + 1}</div>
                            {userAnswer !== undefined && (
                              <Badge className={isCorrect ? 'bg-green-500' : 'bg-red-500'}>
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1">{question.question}</p>
                        </div>
                        
                        <div className="p-3">
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex} 
                                className={`p-3 rounded-md ${
                                  userAnswer === optIndex && isCorrect
                                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                    : userAnswer === optIndex && !isCorrect
                                      ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                                      : optIndex === question.correctAnswer
                                        ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
                                        : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    userAnswer === optIndex && isCorrect
                                      ? 'bg-green-500 text-white'
                                      : userAnswer === optIndex && !isCorrect
                                        ? 'bg-red-500 text-white'
                                        : optIndex === question.correctAnswer
                                          ? 'bg-blue-500 text-white'
                                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {userAnswer === optIndex && isCorrect 
                                      ? <CheckCircle className="h-4 w-4" />
                                      : userAnswer === optIndex && !isCorrect
                                        ? <X className="h-4 w-4" />
                                        : <span className="text-xs">{String.fromCharCode(65 + optIndex)}</span>
                                    }
                                  </div>
                                  <span>{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {userAnswer !== undefined && (
                            <div className="mt-3 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="font-medium">Explanation:</div>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Quiz Instructions
                </h3>
                <p className="text-sm mt-1">
                  Answer all questions below and click "Submit" to check your answers. You need a score of 70% or higher to mark this module as complete.
                </p>
              </div>
              
              <div className="space-y-6">
                {selectedModule.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium">Question {index + 1}</div>
                      <p className="mt-1">{question.question}</p>
                    </div>
                    
                    <div className="p-3">
                      <RadioGroup 
                        value={quizAnswers[question.id]?.toString() || ''}
                        onValueChange={(value) => handleQuizOptionSelect(question.id, parseInt(value))}
                      >
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className="flex items-start p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                            >
                              <RadioGroupItem 
                                value={optIndex.toString()} 
                                id={`q${question.id}-opt${optIndex}`} 
                                className="mt-0.5"
                              />
                              <Label 
                                htmlFor={`q${question.id}-opt${optIndex}`} 
                                className="pl-2 cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sticky bottom-4 bg-white dark:bg-gray-850 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Quiz Progress</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(quizAnswers).length} of {selectedModule.questions.length} questions answered
                    </div>
                  </div>
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < selectedModule.questions.length}
                  >
                    Submit Quiz
                  </Button>
                </div>
                <Progress 
                  value={(Object.keys(quizAnswers).length / selectedModule.questions.length) * 100} 
                  className="mt-2 h-2"
                />
              </div>
            </div>
          )}
        </FullScreenDialogBody>

        <FullScreenDialogFooter>
          {quizSubmitted ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDialogType('module');
                  setQuizSubmitted(false);
                }}
              >
                Back to Module
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
              >
                Retake Quiz
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setDialogType('module')}
            >
              Back to Module
            </Button>
          )}
        </FullScreenDialogFooter>
      </>
    );
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Credit Building Skills</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Learn how to build strong credit from scratch and set yourself up for financial success
          </p>
        </div>
        
        <div className="flex items-center bg-green-50/60 dark:bg-green-950/20 p-2 pl-3 rounded-lg border border-green-100 dark:border-green-800">
          <div className="mr-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">Your Credit Score</div>
            <div className="font-bold text-2xl text-green-600 dark:text-green-400">{userProgress.creditScore}</div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            userProgress.creditScore >= 740 ? "bg-green-500" :
            userProgress.creditScore >= 670 ? "bg-yellow-500" :
            userProgress.creditScore >= 580 ? "bg-orange-500" :
            "bg-red-500"
          }`}>
            <span className="text-white text-lg font-bold">
              {userProgress.creditScore >= 740 ? "A" :
               userProgress.creditScore >= 670 ? "B" :
               userProgress.creditScore >= 580 ? "C" :
               "D"}
            </span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="journey" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-green-100 dark:bg-green-900/30">
          <TabsTrigger 
            value="journey" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
          >
            Credit Journeys
          </TabsTrigger>
          <TabsTrigger 
            value="learning" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
          >
            Learning Modules
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600"
          >
            Your Progress
          </TabsTrigger>
        </TabsList>
        <TabsContent value="journey" className="mt-6">
          {renderJourneysGrid()}
        </TabsContent>
        <TabsContent value="learning" className="mt-6">
          {renderEducationalModulesGrid()}
        </TabsContent>
        <TabsContent value="dashboard" className="mt-6">
          {renderProgressDashboard()}
        </TabsContent>
      </Tabs>
      
      <FullScreenDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      >
        <FullScreenDialogContent>
          {renderDialogContent()}
        </FullScreenDialogContent>
      </FullScreenDialog>
    </div>
  );
};

export default CreditBuildingSkillsEnhanced;
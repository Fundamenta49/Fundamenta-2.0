import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home, DollarSign, Calculator, Brain, CreditCard, PiggyBank, Building } from "lucide-react";
import { FINANCE_CATEGORY } from "@/components/chat-interface";
import { BudgetData } from "@/components/budget-calculator";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Import pop-out components
import FinanceAdvisorPopOut from "@/components/finance-advisor-pop-out";
import BudgetCalculatorPopOut from "@/components/budget-calculator-pop-out";
import FinancialDashboardPopOut from "@/components/financial-dashboard-pop-out";
import CreditSkillsPopOut from "@/components/credit-skills-pop-out";
import RetirementPlanningPopOut from "@/components/retirement-planning-pop-out";
import MortgageCalculatorPopOut from "@/components/mortgage-calculator-pop-out";
import BankLinkPopOut from "@/components/bank-link-pop-out";

// Define section properties
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'advisor',
    title: 'Financial AI Advisor',
    description: 'Get personalized financial advice and guidance',
    icon: Brain,
  },
  {
    id: 'budget',
    title: 'Smart Budget Planner',
    description: 'Track your income, expenses, and set savings goals',
    icon: Calculator,
  },
  {
    id: 'dashboard',
    title: 'Financial Dashboard',
    description: 'Visualize your financial health and track progress',
    icon: DollarSign,
  },
  {
    id: 'credit',
    title: 'Credit Building Skills',
    description: 'Learn about credit scores and building good credit',
    icon: CreditCard,
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for your future with retirement calculators and guides',
    icon: PiggyBank,
  },
  {
    id: 'mortgage',
    title: 'Fundamenta Mortgage',
    description: 'Calculate mortgage payments and explore home buying resources',
    icon: Building,
  },
  {
    id: 'bank',
    title: 'Bank Accounts & Transactions',
    description: 'Connect your bank accounts to track spending in real-time',
    icon: Home,
  }
];

export default function Finance() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [, setLocation] = useLocation();
  
  // Dialog states
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isRetirementOpen, setIsRetirementOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);

  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'advisor') {
      setIsAdvisorOpen(true);
    } 
    else if (sectionId === 'budget') {
      setIsBudgetOpen(true);
    }
    else if (sectionId === 'dashboard') {
      setIsDashboardOpen(true);
    }
    else if (sectionId === 'credit') {
      setIsCreditOpen(true);
    }
    else if (sectionId === 'retirement') {
      setIsRetirementOpen(true);
    }
    else if (sectionId === 'mortgage') {
      // Navigate to the dedicated mortgage page instead of opening a dialog
      setLocation('/finance/mortgage');
    }
    else if (sectionId === 'bank') {
      setIsBankOpen(true);
    }
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
      if (route === '/finance') {
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
        Financial Literacy
      </h1>

      <Alert variant="default" className="mx-3 sm:mx-5 mb-2 border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800 text-sm">
          This app provides general financial information for educational purposes only.
          It is not intended to be financial advice. Please consult a qualified financial
          advisor for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      {/* Full-screen dialogs */}
      <FullScreenDialog open={isAdvisorOpen} onOpenChange={setIsAdvisorOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <FinanceAdvisorPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <BudgetCalculatorPopOut onBudgetUpdate={setBudgetData} />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <FinancialDashboardPopOut budgetData={budgetData} />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <CreditSkillsPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isRetirementOpen} onOpenChange={setIsRetirementOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <RetirementPlanningPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isMortgageOpen} onOpenChange={setIsMortgageOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <MortgageCalculatorPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isBankOpen} onOpenChange={setIsBankOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <BankLinkPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Grid-style cards layout (similar to Learning section) */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-green-50 text-green-800 rounded-md border-l-4 border-green-500">
            Financial Tools
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 mt-2">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/finance/${section.id}`}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100",
                  "transition-colors duration-200"
                )}
              >
                <div className="flex items-center justify-center h-10 w-full">
                  <section.icon className="w-7 h-7 text-green-500" />
                </div>
                
                <span className="text-xs sm:text-sm font-medium text-center line-clamp-2 w-full">{section.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
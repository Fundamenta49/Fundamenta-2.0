import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalculatorIcon,
  HomeIcon,
  BookOpen,
  BarChart4,
  Info,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';
import MortgageCalculator from '@/components/mortgage-calculator';
import MortgageMarketTrends from '@/components/mortgage-market-trends';
import MortgageEducation from '@/components/mortgage-education';
import { ClosingCostCalculator } from '@/components/closing-cost-calculator-new';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogTrigger
} from "@/components/ui/full-screen-dialog";

const MortgagePage: React.FC = () => {
  // State for info dialog and fullscreen dialogs
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Calculate the appropriate theme color for Finance section
  const themeColor = "#22c55e"; // Finance green color

  const mortgageTools = [
    {
      id: "calculator",
      title: "Mortgage Calculator",
      description: "Calculate monthly payments, total interest, and view amortization schedules",
      icon: CalculatorIcon,
      component: MortgageCalculator
    },
    {
      id: "costs",
      title: "Closing Costs Calculator",
      description: "Understand all costs associated with buying a home including taxes and insurance",
      icon: DollarSign,
      component: ClosingCostCalculator
    },
    {
      id: "trends",
      title: "Market Trends",
      description: "Real-time mortgage rates and housing market data from the Federal Reserve",
      icon: BarChart4,
      component: MortgageMarketTrends
    },
    {
      id: "education",
      title: "Mortgage Education",
      description: "Essential guides and resources for understanding the mortgage process",
      icon: BookOpen,
      component: MortgageEducation
    }
  ];

  return (
    <div className="container py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <HomeIcon className="h-8 w-8 text-green-500" />
            Mortgage Center
          </h1>
          <p className="text-muted-foreground">
            Comprehensive tools and resources to help you navigate the home buying process
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Powered by FRED API
          </Badge>
          <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8">
                <Info className="h-4 w-4" />
                <span className="sr-only">About Mortgage Center</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About the Mortgage Center</DialogTitle>
                <DialogDescription>
                  The Mortgage Center provides real-time mortgage data and educational resources powered by the Federal Reserve Economic Data (FRED) API.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  This interactive resource helps you:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Calculate monthly mortgage payments and total costs</li>
                  <li>Understand closing costs, PMI, property taxes, and insurance expenses</li>
                  <li>View current mortgage rates and historical trends</li>
                  <li>Monitor housing market indicators</li>
                  <li>Learn about mortgage types, the approval process, and more</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  All data is sourced directly from the Federal Reserve Bank of St. Louis, ensuring you have access to the most accurate and up-to-date information for making informed home buying decisions.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Alert variant="default" className="mx-0 sm:mx-0 mb-4 border-green-500 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-800">
          Click on any card below to access the full interactive experience. All mortgage data is updated daily with the latest market information.
        </AlertDescription>
      </Alert>

      {/* Card grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {mortgageTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <FullScreenDialog key={tool.id}>
              <FullScreenDialogTrigger asChild>
                <Card className="border-2 border-green-100 shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                        <Icon className="h-10 w-10 text-green-500" />
                      </div>
                      <CardTitle className="mb-2">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </FullScreenDialogTrigger>
              <FullScreenDialogContent themeColor={themeColor}>
                <FullScreenDialogHeader>
                  <div className="flex items-center mb-2">
                    <Icon className="h-6 w-6 mr-2 text-green-500" />
                    <FullScreenDialogTitle>{tool.title}</FullScreenDialogTitle>
                  </div>
                  <FullScreenDialogDescription>{tool.description}</FullScreenDialogDescription>
                </FullScreenDialogHeader>
                <FullScreenDialogBody>
                  {tool.id === "costs" ? (
                    <ClosingCostCalculator onClose={() => {
                      const closeButton = document.querySelector("[data-radix-collection-item]") as HTMLElement;
                      if (closeButton) closeButton.click();
                    }} />
                  ) : (
                    <tool.component />
                  )}
                </FullScreenDialogBody>
              </FullScreenDialogContent>
            </FullScreenDialog>
          );
        })}
      </div>
    </div>
  );
};

export default MortgagePage;
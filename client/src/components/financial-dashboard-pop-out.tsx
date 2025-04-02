import { DollarSign, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FinancialDashboard from "@/components/financial-dashboard";
import { BudgetData } from "@/components/budget-calculator";

interface FinancialDashboardPopOutProps {
  budgetData: BudgetData | null;
}

export default function FinancialDashboardPopOut({ budgetData }: FinancialDashboardPopOutProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-500" />
          Financial Dashboard
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Visualize your financial health and track progress
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            {budgetData 
              ? "Your budget data is displayed below. Update your budget in the Budget Planner to see changes here."
              : "No budget data available. Create a budget in the Budget Planner to visualize your financial health here."}
          </AlertDescription>
        </Alert>
        
        <FinancialDashboard budgetData={budgetData} />
      </FullScreenDialogBody>
    </div>
  );
}
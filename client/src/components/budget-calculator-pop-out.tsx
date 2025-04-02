import { Calculator, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BudgetCalculator, { BudgetData } from "@/components/budget-calculator";

interface BudgetCalculatorPopOutProps {
  onBudgetUpdate?: (data: BudgetData) => void;
}

export default function BudgetCalculatorPopOut({ onBudgetUpdate }: BudgetCalculatorPopOutProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-green-500" />
          Smart Budget Planner
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Track your income, expenses, and set savings goals
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Use this calculator to track your monthly budget and plan for your financial goals.
            All data is stored locally on your device.
          </AlertDescription>
        </Alert>
        
        <BudgetCalculator onBudgetUpdate={onBudgetUpdate} />
      </FullScreenDialogBody>
    </div>
  );
}
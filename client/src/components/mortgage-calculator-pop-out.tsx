import { Building, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MortgageCalculator from "@/components/mortgage-calculator";

export default function MortgageCalculatorPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Building className="h-6 w-6 text-green-500" />
          Fundamenta Mortgage
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Calculate mortgage payments and explore home buying resources
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Use this calculator to estimate mortgage payments and understand the total cost
            of home ownership. Adjust parameters to see how they impact your monthly payment.
          </AlertDescription>
        </Alert>
        
        <MortgageCalculator />
      </FullScreenDialogBody>
    </div>
  );
}
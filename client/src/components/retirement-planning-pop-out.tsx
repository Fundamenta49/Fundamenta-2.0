import { PiggyBank, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RetirementPlanning from "@/components/retirement-planning";

export default function RetirementPlanningPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <PiggyBank className="h-6 w-6 text-green-500" />
          Retirement Planning
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Plan for your future with retirement calculators and guides
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            It's never too early to start planning for retirement. Use these tools to understand
            how much you'll need to save and how to create a sustainable retirement plan.
          </AlertDescription>
        </Alert>
        
        <RetirementPlanning />
      </FullScreenDialogBody>
    </div>
  );
}
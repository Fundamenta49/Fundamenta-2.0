import { DollarSign, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SalaryInsights from "@/components/salary-insights";

export default function SalaryInsightsPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-500" />
          Salary Insights
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Research and compare salary information
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Browse salary data by job title, location, and experience level.
            Use this information to negotiate better compensation or plan your career path.
          </AlertDescription>
        </Alert>
        
        <SalaryInsights />
      </FullScreenDialogBody>
    </div>
  );
}
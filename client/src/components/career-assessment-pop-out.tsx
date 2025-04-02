import { GraduationCap, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RiasecTest from "@/components/riasec-test";

export default function CareerAssessmentPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-500" />
          Career Assessment
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Discover your career interests and strengths
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            This assessment uses the RIASEC model to identify career interests. The results 
            provide general guidance and should be considered alongside other factors when 
            making career decisions.
          </AlertDescription>
        </Alert>
        
        <RiasecTest />
      </FullScreenDialogBody>
    </div>
  );
}
import { 
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import ComprehensiveWellnessAssessment from "@/components/comprehensive-wellness-assessment";

export default function ComprehensiveWellnessPopOut() {
  return (
    <>
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-600" />
          Comprehensive Wellness Assessment
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          A holistic evaluation of your physical and mental wellbeing
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <div className="max-w-4xl mx-auto w-full">
          <ComprehensiveWellnessAssessment />
        </div>
      </FullScreenDialogBody>
      
      <FullScreenDialogFooter>
        <div className="text-center text-sm text-gray-500">
          This assessment is not a diagnostic tool. Always consult healthcare professionals for medical advice.
        </div>
      </FullScreenDialogFooter>
    </>
  );
}
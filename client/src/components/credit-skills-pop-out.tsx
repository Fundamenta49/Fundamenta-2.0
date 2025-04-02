import { CreditCard, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreditSkills from "@/components/credit-skills";

export default function CreditSkillsPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-green-500" />
          Credit Building Skills
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about credit scores and building good credit
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Understanding credit is essential for your financial wellbeing. Learn how to build, maintain,
            and improve your credit score with these resources.
          </AlertDescription>
        </Alert>
        
        <CreditSkills />
      </FullScreenDialogBody>
    </div>
  );
}
import { Home, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LifeSkillsComponent } from "@/components/life-skills";

export default function LifeSkillsPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Home className="h-6 w-6 text-rose-500" />
          Life Skills
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn practical skills for everyday life
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            Browse essential life skills by category or search for specific topics to get practical guidance.
          </AlertDescription>
        </Alert>
        
        <LifeSkillsComponent />
      </FullScreenDialogBody>
    </div>
  );
}
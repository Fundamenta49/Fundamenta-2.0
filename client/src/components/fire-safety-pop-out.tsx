import { Flame, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FireSafety from "@/components/fire-safety";

export default function FireSafetyPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-red-500" />
          Fire Safety
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about fire prevention and emergency procedures
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In a fire emergency, evacuate immediately and call 911. Your safety comes first - never delay evacuation 
            to gather belongings or use an elevator. These guidelines complement, not replace, professional fire safety training.
          </AlertDescription>
        </Alert>
        
        <FireSafety />
      </FullScreenDialogBody>
    </div>
  );
}
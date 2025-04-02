import { Brain, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmotionalResilienceTracker from "@/components/emotional-resilience-tracker";

export default function EmotionalResiliencePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          EQ & Resilience
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Build emotional intelligence and career resilience
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Track your emotional intelligence development and build career resilience skills.
            These capabilities are critical for navigating workplace challenges and advancement.
          </AlertDescription>
        </Alert>
        
        <EmotionalResilienceTracker />
      </FullScreenDialogBody>
    </div>
  );
}
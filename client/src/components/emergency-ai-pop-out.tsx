import { Brain, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatInterface, { EMERGENCY_CATEGORY } from "@/components/chat-interface";

export default function EmergencyAIPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-red-500" />
          Emergency AI Assistant
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get immediate guidance for emergency situations
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
            This AI assistant provides general guidance only and is not a substitute for professional emergency services.
          </AlertDescription>
        </Alert>
        
        <ChatInterface category={EMERGENCY_CATEGORY} />
      </FullScreenDialogBody>
    </div>
  );
}
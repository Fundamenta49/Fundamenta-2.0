import { Brain, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatRedirect from "@/components/chat-redirect";
import { CAREER_CATEGORY } from "@/components/chat-interface";

export default function CareerCoachPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          Career AI Coach
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get professional guidance for your career journey
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            The AI coach provides career guidance based on general industry knowledge. 
            For personalized advice, consider consulting with a professional career counselor.
          </AlertDescription>
        </Alert>
        
        <ChatRedirect category={CAREER_CATEGORY} />
      </FullScreenDialogBody>
    </div>
  );
}
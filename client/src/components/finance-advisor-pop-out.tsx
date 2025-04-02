import { Brain, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatInterface, { FINANCE_CATEGORY } from "@/components/chat-interface";

export default function FinanceAdvisorPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-green-500" />
          Financial AI Advisor
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get personalized financial advice and guidance
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            The AI advisor provides general guidance based on publicly available financial information.
            For specific advice, please consult with a qualified financial professional.
          </AlertDescription>
        </Alert>
        
        <ChatInterface category={FINANCE_CATEGORY} />
      </FullScreenDialogBody>
    </div>
  );
}
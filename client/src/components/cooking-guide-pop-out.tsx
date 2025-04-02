import { ChefHat, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatInterface, { COOKING_CATEGORY } from "@/components/chat-interface";
import CookingGuide from "@/components/cooking-guide";

export default function CookingGuidePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-rose-500" />
          Cooking Basics
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Master essential cooking techniques and recipes
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            Learn essential cooking skills, techniques, and recipes with step-by-step instructions.
          </AlertDescription>
        </Alert>
        
        <CookingGuide />
      </FullScreenDialogBody>
    </div>
  );
}
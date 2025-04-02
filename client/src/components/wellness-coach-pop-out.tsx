import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Brain, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatInterface, { WELLNESS_CATEGORY } from "@/components/chat-interface";

export default function WellnessCoachPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          Wellness AI Coach
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get personalized guidance on nutrition, mental health, and wellness
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-purple-500 bg-purple-50">
          <AlertCircle className="h-4 w-4 text-purple-500" />
          <AlertDescription className="text-purple-800 text-sm">
            The AI coach provides general wellness guidance based on public health information.
            Always consult healthcare professionals for medical advice.
          </AlertDescription>
        </Alert>
        
        <ChatInterface category={WELLNESS_CATEGORY} />
      </FullScreenDialogBody>
    </div>
  );
}
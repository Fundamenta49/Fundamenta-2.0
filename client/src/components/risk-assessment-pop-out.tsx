import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import RiskAssessment from "./risk-assessment";

export default function RiskAssessmentPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          BrainTap Assessment
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Check in with yourself and discover personalized mental wellness resources
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <RiskAssessment />
      </FullScreenDialogBody>
    </div>
  );
}
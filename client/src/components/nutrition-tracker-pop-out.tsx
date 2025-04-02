import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import NutritionTracker from "./nutrition-tracker";

export default function NutritionTrackerPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-purple-500" />
          Food Tracker
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Monitor your daily nutrition and eating habits for better wellness awareness
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <NutritionTracker />
      </FullScreenDialogBody>
    </div>
  );
}
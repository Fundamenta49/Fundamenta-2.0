import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import ShoppingBuddy from "./shopping-buddy";

export default function ShoppingBuddyPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-purple-500" />
          Shopping Buddy
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Get help with grocery planning and healthy food choices for your wellness goals
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <ShoppingBuddy />
      </FullScreenDialogBody>
    </div>
  );
}
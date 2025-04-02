import { Wrench, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HandymanGuide from "@/components/handyman-guide";

export default function HandymanGuidePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-rose-500" />
          Home Repairs
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Essential home maintenance skills
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            Learn how to handle common home repairs and maintenance tasks with these step-by-step guides.
          </AlertDescription>
        </Alert>
        
        <HandymanGuide />
      </FullScreenDialogBody>
    </div>
  );
}
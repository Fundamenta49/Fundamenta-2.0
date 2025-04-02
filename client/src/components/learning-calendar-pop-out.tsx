import { Clock, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LearningCalendar from "@/components/learning-calendar";

export default function LearningCalendarPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-rose-500" />
          Learning Schedule
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Plan and track your learning activities
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            Use this calendar to schedule your learning activities and track your progress.
          </AlertDescription>
        </Alert>
        
        <LearningCalendar />
      </FullScreenDialogBody>
    </div>
  );
}
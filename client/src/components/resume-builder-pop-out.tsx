import { FileText, AlertCircle, Zap } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ResumeBuilderEnhanced from "@/components/resume-builder-enhanced";

export default function ResumeBuilderPopOut() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" />
          Resume Builder
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Create and manage your professional resume
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <Zap className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Our AI-powered resume builder helps you create interview-winning resumes in minutes. 
            Upload an existing resume or start from scratch, and let our AI enhance it with impactful bullet points 
            and targeted optimizations.
          </AlertDescription>
        </Alert>
        
        <ResumeBuilderEnhanced />
      </FullScreenDialogBody>
    </div>
  );
}
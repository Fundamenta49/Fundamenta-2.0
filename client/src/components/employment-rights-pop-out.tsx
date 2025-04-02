import { Scale, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmploymentRights from "@/components/employment-rights";

export default function EmploymentRightsPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-blue-500" />
          Employment Rights
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about your workplace rights and protections
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            This guide provides general information about employment rights and is not legal advice.
            For specific situations, consult with a qualified employment attorney.
          </AlertDescription>
        </Alert>
        
        <EmploymentRights />
      </FullScreenDialogBody>
    </div>
  );
}
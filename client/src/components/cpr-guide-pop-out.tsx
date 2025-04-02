import { Heart, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CPRGuide from "@/components/cpr-guide";

export default function CPRGuidePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          CPR Training
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn essential CPR and first aid techniques
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            This guide is not a substitute for professional CPR training. Please seek certified training 
            from organizations like the American Heart Association or Red Cross for proper CPR techniques. 
            Always call emergency services (911) immediately in a cardiac emergency.
          </AlertDescription>
        </Alert>
        
        <CPRGuide />
      </FullScreenDialogBody>
    </div>
  );
}
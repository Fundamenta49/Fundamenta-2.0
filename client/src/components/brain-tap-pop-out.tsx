import BrainTap from "./brain-tap";
import { 
  FullScreenDialogHeader, 
  FullScreenDialogTitle, 
  FullScreenDialogDescription,
  FullScreenDialogBody
} from "./ui/full-screen-dialog";
import { Brain } from "lucide-react";

export default function BrainTapPopOut() {
  return (
    <>
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-6 w-6 text-purple-600" />
          Brain Tap
        </FullScreenDialogTitle>
        <FullScreenDialogDescription className="text-purple-600">
          Mental wellness check-in using clinical screening tools
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <BrainTap />
      </FullScreenDialogBody>
    </>
  );
}
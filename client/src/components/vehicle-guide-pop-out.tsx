import { Car, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VehicleGuide from "@/components/vehicle-guide";

export default function VehicleGuidePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Car className="h-6 w-6 text-rose-500" />
          Vehicle Maintenance
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn basic car maintenance and care
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-rose-500 bg-rose-50">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          <AlertDescription className="text-rose-800 text-sm">
            This guide helps you understand basic vehicle maintenance to keep your car running safely and efficiently.
          </AlertDescription>
        </Alert>
        
        <VehicleGuide />
      </FullScreenDialogBody>
    </div>
  );
}
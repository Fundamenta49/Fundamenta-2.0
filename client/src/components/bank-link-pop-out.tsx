import { Home, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BankLink from "@/components/bank-link";

export default function BankLinkPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Home className="h-6 w-6 text-green-500" />
          Bank Accounts & Transactions
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Connect your bank accounts to track spending in real-time
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Connect your bank accounts securely using Plaid. Your credentials are never stored by Fundamenta,
            and all data is encrypted using industry-standard practices.
          </AlertDescription>
        </Alert>
        
        <BankLink />
      </FullScreenDialogBody>
    </div>
  );
}
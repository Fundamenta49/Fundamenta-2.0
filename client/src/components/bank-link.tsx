import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, Building } from "lucide-react"; 

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export default function BankLink() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        const response = await fetch("/api/plaid/exchange_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange token");
        }

        // After successful token exchange, fetch transactions
        fetchTransactions();
      } catch (error) {
        console.error("Error exchanging token:", error);
      }
    },
    onExit: (err, metadata) => {
      // Handle exit
      console.log("Plaid Link exit:", err, metadata);
    },
  });

  // Get link token on component mount
  const initializePlaidLink = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plaid/create_link_token");
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error("Error creating link token:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plaid/transactions");
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 text-sm">
          Connect your bank account securely through Plaid to track your transactions in real-time.
          Your banking credentials are never stored on our servers.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Connect Your Bank Account
          </CardTitle>
          <CardDescription>
            Securely link your bank account to track transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              if (!linkToken) {
                initializePlaidLink();
              } else {
                open();
              }
            }}
            disabled={loading || (!!linkToken && !ready)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Connecting..." : "Connect Bank Account"}
          </Button>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-stone-50/80 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                  <p className={`font-semibold ${
                    transaction.amount < 0 ? "text-destructive" : "text-green-500"
                  }`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
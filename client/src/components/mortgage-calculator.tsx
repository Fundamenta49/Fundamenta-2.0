import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { fetchCurrentMortgageRates, FredDataSeries, formatFredValue } from '@/lib/fred-service';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HomeIcon, DollarSign, Clock, Percent, CalculatorIcon, PiggyBankIcon } from 'lucide-react';

interface MortgageResult {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalCost: number;
  loanTerm: number;
  amortizationSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}

const MortgageCalculator: React.FC = () => {
  // Current FRED mortgage rates
  const [currentRates, setCurrentRates] = useState<{
    thirtyYear: string | null;
    fifteenYear: string | null;
  }>({
    thirtyYear: null,
    fifteenYear: null,
  });

  // Input states
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Calculated result
  const [mortgageResult, setMortgageResult] = useState<MortgageResult | null>(null);

  // Fetch current mortgage rates when component mounts
  useEffect(() => {
    const getRates = async () => {
      try {
        const rates = await fetchCurrentMortgageRates();
        setCurrentRates({
          thirtyYear: rates.thirtyYear?.value || null,
          fifteenYear: rates.fifteenYear?.value || null,
        });
        
        // Set initial interest rate based on fetched 30-year rate
        if (rates.thirtyYear?.value) {
          setInterestRate(parseFloat(rates.thirtyYear.value));
        }
      } catch (error) {
        console.error('Error fetching mortgage rates:', error);
      }
    };
    
    getRates();
  }, []);

  // Calculate mortgage when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, interestRate, loanTerm]);

  // Handle home price change
  const handleHomePriceChange = (value: string) => {
    const price = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setHomePrice(price);
    updateDownPaymentAmount(price, downPaymentPercent);
  };

  // Handle down payment percentage change
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    setDownPaymentPercent(percent);
    updateDownPaymentAmount(homePrice, percent);
  };

  // Handle down payment amount change
  const handleDownPaymentChange = (value: string) => {
    const amount = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setDownPayment(amount);
    setDownPaymentPercent(Math.round((amount / homePrice) * 100));
  };

  // Update down payment amount based on percentage
  const updateDownPaymentAmount = (price: number, percent: number) => {
    const amount = Math.round((price * percent) / 100);
    setDownPayment(amount);
  };

  // Handle interest rate change
  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  // Handle loan term change
  const handleLoanTermChange = (term: number) => {
    setLoanTerm(term);
  };

  // Use current market rate
  const useMarketRate = (term: number) => {
    if (term === 30 && currentRates.thirtyYear) {
      setInterestRate(parseFloat(currentRates.thirtyYear));
    } else if (term === 15 && currentRates.fifteenYear) {
      setInterestRate(parseFloat(currentRates.fifteenYear));
    }
  };

  // Calculate mortgage
  const calculateMortgage = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using formula: M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment = 
      loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
    // Calculate total cost
    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - loanAmount;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    let remainingBalance = loanAmount;
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      // Only add to schedule at yearly intervals to keep it manageable
      if (month % 12 === 0 || month === 1) {
        amortizationSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance),  // Prevent negative balance due to rounding
        });
      }
    }
    
    setMortgageResult({
      monthlyPayment,
      totalPrincipal: loanAmount,
      totalInterest,
      totalCost,
      loanTerm,
      amortizationSchedule,
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // More precise format for monthly payments
  const formatCurrencyPrecise = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Home Price Input */}
          <div className="space-y-2">
            <Label htmlFor="homePrice" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4 text-green-500" /> Home Price
            </Label>
            <Input
              id="homePrice"
              type="text"
              value={formatCurrency(homePrice)}
              onChange={(e) => handleHomePriceChange(e.target.value)}
              className="font-mono"
            />
          </div>
          
          {/* Down Payment Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="downPayment" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" /> Down Payment
              </Label>
              <span className="text-sm text-muted-foreground">{downPaymentPercent}%</span>
            </div>
            <Input
              id="downPayment"
              type="text"
              value={formatCurrency(downPayment)}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="font-mono"
            />
            <Slider
              value={[downPaymentPercent]}
              min={5}
              max={50}
              step={1}
              onValueChange={handleDownPaymentPercentChange}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>20%</span>
              <span>50%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Interest Rate Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interestRate" className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" /> Interest Rate
              </Label>
              <span className="text-sm text-muted-foreground">{interestRate.toFixed(2)}%</span>
            </div>
            <Slider
              id="interestRate"
              value={[interestRate]}
              min={1}
              max={12}
              step={0.125}
              onValueChange={handleInterestRateChange}
            />
            <div className="text-xs text-muted-foreground">
              {currentRates.thirtyYear && (
                <span>Current 30-yr rate: {formatFredValue(currentRates.thirtyYear, FredDataSeries.MORTGAGE_30YR)}</span>
              )}
              {currentRates.fifteenYear && (
                <span className="ml-3">15-yr: {formatFredValue(currentRates.fifteenYear, FredDataSeries.MORTGAGE_15YR)}</span>
              )}
            </div>
          </div>
          
          {/* Loan Term Selector */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" /> Loan Term
            </Label>
            <div className="flex gap-2">
              <Button
                variant={loanTerm === 30 ? "default" : "outline"}
                onClick={() => handleLoanTermChange(30)}
                className="flex-1"
              >
                30 Years
              </Button>
              <Button
                variant={loanTerm === 15 ? "default" : "outline"}
                onClick={() => handleLoanTermChange(15)}
                className="flex-1"
              >
                15 Years
              </Button>
            </div>
            <div className="flex justify-end">
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => useMarketRate(loanTerm)}
                className="text-xs h-auto p-0 text-green-600"
              >
                Use current market rate
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {mortgageResult && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Card className="border-2 border-green-100 shadow-md bg-white">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <PiggyBankIcon className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Monthly Payment</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrencyPrecise(mortgageResult.monthlyPayment)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-100 shadow-md bg-white">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <HomeIcon className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Loan Amount</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(mortgageResult.totalPrincipal)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-100 shadow-md bg-white">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Interest</h3>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {formatCurrency(mortgageResult.totalInterest)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              className="border-green-200 hover:bg-green-50 hover:text-green-700"
              onClick={() => setShowAmortization(!showAmortization)}
            >
              {showAmortization ? "Hide" : "Show"} Amortization Schedule
            </Button>
          </div>
          
          {showAmortization && (
            <div className="w-full mt-6 overflow-auto border rounded-lg">
              <Table>
                <TableCaption>
                  Amortization schedule showing first payment and annual payments thereafter
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead>Period</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mortgageResult.amortizationSchedule.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month === 1 ? "First Payment" : `Year ${Math.floor(row.month / 12)}`}</TableCell>
                      <TableCell>{formatCurrencyPrecise(row.payment)}</TableCell>
                      <TableCell>{formatCurrencyPrecise(row.principal)}</TableCell>
                      <TableCell>{formatCurrencyPrecise(row.interest)}</TableCell>
                      <TableCell>{formatCurrencyPrecise(row.remainingBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;
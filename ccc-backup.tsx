import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Gauge, 
  HomeIcon, 
  DollarSign, 
  Calculator, 
  Percent, 
  Clock, 
  FilePlus, 
  FileText, 
  ShieldCheck, 
  Building, 
  Scale, 
  ArrowRight,
  HelpCircle,
  Check,
  X,
  InfoIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FredDataSeries, formatFredValue } from '@/lib/fred-service';
import { getMortgageRates, formatRate } from '@/lib/mortgage-data-service';

// Interfaces
interface ClosingCosts {
  loanOrigination: number;
  appraisalFee: number;
  creditReportFee: number;
  titleServices: number;
  governmentRecordingCharges: number;
  transferTaxes: number;
  homeInspection: number;
  other: number;
}

interface RecurringCosts {
  propertyTax: number;
  homeownersInsurance: number;
  mortgageInsurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
}

interface MortgageBreakdown {
  principal: number;
  interest: number;
  pmi: number;
  taxes: number;
  insurance: number;
  hoa: number;
  total: number;
}

interface NetSheet {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  closingCosts: ClosingCosts;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  recurringCosts: RecurringCosts;
  monthlyPayment: MortgageBreakdown;
  cashToClose: number;
  firstYearTotal: number;
}

interface NetSheetResults {
  upfrontCosts: {
    downPayment: number;
    closingCosts: number;
    totalCashNeeded: number;
  };
  monthlyPayment: MortgageBreakdown;
  yearlyTotal: number;
  fiveYearTotal: number;
  thirtyYearTotal: number;
}

// Default values
const DEFAULT_HOME_PRICE = 350000;
const DEFAULT_DOWN_PAYMENT_PERCENT = 20;
const DEFAULT_LOAN_TERM = 30;
const DEFAULT_INTEREST_RATE = 6.5;
const DEFAULT_PROPERTY_TAX_RATE = 1.1; // % of home value per year
const DEFAULT_HOME_INSURANCE_RATE = 0.35; // % of home value per year
const DEFAULT_PMI_RATE = 0.5; // % of loan amount per year for down payments < 20%
const DEFAULT_HOA_MONTHLY = 0;
const DEFAULT_CLOSING_COST_PERCENT = 3; // % of home value
const DEFAULT_HOME_MAINTENANCE = 1; // % of home value per year
const DEFAULT_UTILITIES = 300; // monthly

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format currency with cents
export const formatCurrencyPrecise = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format percentage
export const formatPercent = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

const ClosingCostCalculator: React.FC = () => {
  // Current FRED mortgage rates
  const [currentRates, setCurrentRates] = useState<{
    thirtyYear: string | null;
    fifteenYear: string | null;
  }>({
    thirtyYear: null,
    fifteenYear: null,
  });

  // Primary state for the calculator
  const [netSheet, setNetSheet] = useState<NetSheet>({
    homePrice: DEFAULT_HOME_PRICE,
    downPayment: DEFAULT_HOME_PRICE * (DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT,
    loanAmount: DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    loanTerm: DEFAULT_LOAN_TERM,
    interestRate: DEFAULT_INTEREST_RATE,
    closingCosts: {
      loanOrigination: DEFAULT_HOME_PRICE * 0.01, // 1% of loan amount
      appraisalFee: 500,
      creditReportFee: 25,
      titleServices: 1200,
      governmentRecordingCharges: 125,
      transferTaxes: DEFAULT_HOME_PRICE * 0.004, // 0.4% of home price
      homeInspection: 400,
      other: 500
    },
    recurringCosts: {
      propertyTax: (DEFAULT_HOME_PRICE * DEFAULT_PROPERTY_TAX_RATE) / 100 / 12, // Monthly
      homeownersInsurance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12, // Monthly
      mortgageInsurance: DEFAULT_DOWN_PAYMENT_PERCENT < 20 ? 
        (DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100) * DEFAULT_PMI_RATE) / 100 / 12 : 0, // Monthly
      hoaFees: DEFAULT_HOA_MONTHLY,
      utilities: DEFAULT_UTILITIES,
      maintenance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_MAINTENANCE) / 100 / 12 // Monthly
    },
    monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
    cashToClose: 0,
    firstYearTotal: 0
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>("purchase");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [selectedBreakdownView, setSelectedBreakdownView] = useState<string>("monthly");
  const [showEducation, setShowEducation] = useState<{ [key: string]: boolean }>({
    pmi: false,
    taxes: false,
    insurance: false,
    closingCosts: false
  });
  
  // Results state
  const [results, setResults] = useState<NetSheetResults | null>(null);

  // Fetch current mortgage rates when component mounts
  useEffect(() => {
    const getRates = async () => {
      try {
        // Use new mortgage data service that handles fallbacks
        const mortgageRates = await getMortgageRates();
        
        setCurrentRates({
          thirtyYear: mortgageRates.thirtyYearFixed.rate.toString(),
          fifteenYear: mortgageRates.fifteenYearFixed.rate.toString(),
        });
        
        // Set initial interest rate based on fetched 30-year rate
        setNetSheet(prev => ({
          ...prev,
          interestRate: mortgageRates.thirtyYearFixed.rate
        }));
        
        console.log(`Mortgage rates loaded from: ${mortgageRates.thirtyYearFixed.source}`);
        
      } catch (error) {
        console.error('Error fetching mortgage rates:', error);
        // Continue with default values
      }
    };
    
    getRates();
  }, []);

  // Calculate monthly payment whenever loan details change
  useEffect(() => {
    calculateResults();
  }, [
    netSheet.homePrice, 
    netSheet.downPayment, 
    netSheet.interestRate, 
    netSheet.loanTerm,
    netSheet.recurringCosts.propertyTax,
    netSheet.recurringCosts.homeownersInsurance,
    netSheet.recurringCosts.mortgageInsurance,
    netSheet.recurringCosts.hoaFees
  ]);

  // Handle home price change
  const handleHomePriceChange = (value: string) => {
    const price = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    // Calculate new down payment amount while keeping percentage the same
    const newDownPayment = Math.round((price * netSheet.downPaymentPercent) / 100);
    
    // Update property tax and insurance based on new home price
    const newPropertyTax = (price * DEFAULT_PROPERTY_TAX_RATE) / 100 / 12;
    const newHomeownersInsurance = (price * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12;
    
    // Update PMI based on new loan amount
    const newLoanAmount = price - newDownPayment;
    const newPMI = netSheet.downPaymentPercent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
      
    // Update maintenance costs based on new home price
    const newMaintenance = (price * DEFAULT_HOME_MAINTENANCE) / 100 / 12;
    
    // Update closing costs based on new home price
    const newClosingCosts = {
      ...netSheet.closingCosts,
      loanOrigination: newLoanAmount * 0.01,
      transferTaxes: price * 0.004
    };
    
    setNetSheet(prev => ({
      ...prev,
      homePrice: price,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount,
      closingCosts: newClosingCosts,
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: newPropertyTax,
        homeownersInsurance: newHomeownersInsurance,
        mortgageInsurance: newPMI,
        maintenance: newMaintenance
      }
    }));
  };

  // Handle down payment percentage change
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    const amount = Math.round((netSheet.homePrice * percent) / 100);
    const newLoanAmount = netSheet.homePrice - amount;
    
    // Update PMI based on new down payment percentage
    const newPMI = percent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
      
    // Update loan origination fee based on new loan amount
    const newLoanOrigination = newLoanAmount * 0.01;
    
    setNetSheet(prev => ({
      ...prev,
      downPaymentPercent: percent,
      downPayment: amount,
      loanAmount: newLoanAmount,
      closingCosts: {
        ...prev.closingCosts,
        loanOrigination: newLoanOrigination
      },
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newPMI
      }
    }));
  };

  // Handle down payment amount change
  const handleDownPaymentChange = (value: string) => {
    const amount = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const percent = Math.min(100, Math.round((amount / netSheet.homePrice) * 100));
    const newLoanAmount = netSheet.homePrice - amount;
    
    // Update PMI based on new down payment percentage
    const newPMI = percent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
      
    // Update loan origination fee based on new loan amount
    const newLoanOrigination = newLoanAmount * 0.01;
    
    setNetSheet(prev => ({
      ...prev,
      downPayment: amount,
      downPaymentPercent: percent,
      loanAmount: newLoanAmount,
      closingCosts: {
        ...prev.closingCosts,
        loanOrigination: newLoanOrigination
      },
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newPMI
      }
    }));
  };

  // Handle interest rate change
  const handleInterestRateChange = (value: number[]) => {
    setNetSheet(prev => ({
      ...prev,
      interestRate: value[0]
    }));
  };

  // Handle loan term change
  const handleLoanTermChange = (term: number) => {
    setNetSheet(prev => ({
      ...prev,
      loanTerm: term
    }));
  };

  // Use current market rate
  const useMarketRate = (term: number) => {
    if (term === 30 && currentRates.thirtyYear) {
      setNetSheet(prev => ({
        ...prev,
        interestRate: parseFloat(currentRates.thirtyYear as string)
      }));
    } else if (term === 15 && currentRates.fifteenYear) {
      setNetSheet(prev => ({
        ...prev,
        interestRate: parseFloat(currentRates.fifteenYear as string)
      }));
    } else {
      // Use typical rates if FRED data isn't available
      const typicalRate = term === 15 ? 6.2 : 6.8; // Typical rates as of early 2024
      setNetSheet(prev => ({
        ...prev,
        interestRate: typicalRate
      }));
    }
  };

  // Handle property tax change
  const handlePropertyTaxChange = (value: string) => {
    const annualTax = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: annualTax / 12 // Convert to monthly
      }
    }));
  };

  // Handle insurance change
  const handleInsuranceChange = (value: string) => {
    const annualInsurance = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        homeownersInsurance: annualInsurance / 12 // Convert to monthly
      }
    }));
  };

  // Handle HOA fee change
  const handleHOAChange = (value: string) => {
    const hoaFee = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        hoaFees: hoaFee
      }
    }));
  };

  // Calculate all results
  const calculateResults = () => {
    // Calculate monthly principal and interest payment using the loan formula
    const loanAmount = netSheet.loanAmount;
    const monthlyRate = netSheet.interestRate / 100 / 12;
    const numberOfPayments = netSheet.loanTerm * 12;
    
    let monthlyPrincipalAndInterest = 0;
    
    if (monthlyRate > 0) {
      monthlyPrincipalAndInterest = 
        loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPrincipalAndInterest = loanAmount / numberOfPayments;
    }
    
    // Calculate the breakdown of the first payment
    const firstInterestPayment = loanAmount * monthlyRate;
    const firstPrincipalPayment = monthlyPrincipalAndInterest - firstInterestPayment;
    
    // Calculate total monthly payment including taxes, insurance, etc.
    const monthlyPayment: MortgageBreakdown = {
      principal: firstPrincipalPayment,
      interest: firstInterestPayment,
      pmi: netSheet.recurringCosts.mortgageInsurance,
      taxes: netSheet.recurringCosts.propertyTax,
      insurance: netSheet.recurringCosts.homeownersInsurance,
      hoa: netSheet.recurringCosts.hoaFees,
      total: 0
    };
    
    monthlyPayment.total = 
      monthlyPrincipalAndInterest + 
      monthlyPayment.pmi + 
      monthlyPayment.taxes + 
      monthlyPayment.insurance + 
      monthlyPayment.hoa;
    
    // Calculate cash needed to close
    const totalClosingCosts = 
      netSheet.closingCosts.loanOrigination +
      netSheet.closingCosts.appraisalFee +
      netSheet.closingCosts.creditReportFee +
      netSheet.closingCosts.titleServices +
      netSheet.closingCosts.governmentRecordingCharges +
      netSheet.closingCosts.transferTaxes +
      netSheet.closingCosts.homeInspection +
      netSheet.closingCosts.other;
    
    const cashToClose = netSheet.downPayment + totalClosingCosts;
    
    // Calculate first year total
    const firstYearTotal = (monthlyPayment.total * 12) + 
      (netSheet.recurringCosts.utilities * 12) +
      (netSheet.recurringCosts.maintenance * 12);
    
    // Update the state with calculated values
    setNetSheet(prev => ({
      ...prev,
      monthlyPayment,
      cashToClose,
      firstYearTotal
    }));
    
    // Set the results
    setResults({
      upfrontCosts: {
        downPayment: netSheet.downPayment,
        closingCosts: totalClosingCosts,
        totalCashNeeded: cashToClose
      },
      monthlyPayment,
      yearlyTotal: firstYearTotal,
      fiveYearTotal: firstYearTotal * 5,
      thirtyYearTotal: (monthlyPayment.total * 12 * netSheet.loanTerm) + cashToClose
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Toggle advanced mode
  const handleAdvancedModeToggle = () => {
    setAdvancedMode(!advancedMode);
  };

  // Reset all fields to default
  const handleReset = () => {
    setNetSheet({
      homePrice: DEFAULT_HOME_PRICE,
      downPayment: DEFAULT_HOME_PRICE * (DEFAULT_DOWN_PAYMENT_PERCENT / 100),
      downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT,
      loanAmount: DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100),
      loanTerm: DEFAULT_LOAN_TERM,
      interestRate: DEFAULT_INTEREST_RATE,
      closingCosts: {
        loanOrigination: DEFAULT_HOME_PRICE * 0.01,
        appraisalFee: 500,
        creditReportFee: 25,
        titleServices: 1200,
        governmentRecordingCharges: 125,
        transferTaxes: DEFAULT_HOME_PRICE * 0.004,
        homeInspection: 400,
        other: 500
      },
      recurringCosts: {
        propertyTax: (DEFAULT_HOME_PRICE * DEFAULT_PROPERTY_TAX_RATE) / 100 / 12,
        homeownersInsurance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12,
        mortgageInsurance: DEFAULT_DOWN_PAYMENT_PERCENT < 20 ? 
          (DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100) * DEFAULT_PMI_RATE) / 100 / 12 : 0,
        hoaFees: DEFAULT_HOA_MONTHLY,
        utilities: DEFAULT_UTILITIES,
        maintenance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_MAINTENANCE) / 100 / 12
      },
      monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
      cashToClose: 0,
      firstYearTotal: 0
    });
  };

  // Toggle education panel
  const toggleEducation = (section: string) => {
    setShowEducation(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Closing Cost & Total Ownership Calculator
          </CardTitle>
          <CardDescription className="text-primary-foreground/90">
            Understand all costs associated with buying a home, from closing to long-term ownership
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="advanced-mode" className="cursor-pointer">Advanced Mode</Label>
              <Switch 
                id="advanced-mode" 
                checked={advancedMode}
                onCheckedChange={handleAdvancedModeToggle}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset to Defaults
            </Button>
          </div>
          
          <Tabs defaultValue="purchase" onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="purchase" className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Additional Costs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="purchase" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Home Price Input */}
                  <div className="space-y-2">
                    <Label htmlFor="homePrice" className="flex items-center gap-2">
                      <HomeIcon className="h-4 w-4" /> Home Price
                    </Label>
                    <Input
                      id="homePrice"
                      type="text"
                      value={formatCurrency(netSheet.homePrice)}
                      onChange={(e) => handleHomePriceChange(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  {/* Down Payment Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="downPayment" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Down Payment
                      </Label>
                      <Badge variant="outline" className={`flex items-center gap-1 ${netSheet.downPaymentPercent >= 20 ? "bg-green-100 text-green-800 border-green-300" : ""}`}>
                        {netSheet.downPaymentPercent >= 20 ? 
                          <Check className="h-3 w-3" /> : 
                          <X className="h-3 w-3" />}
                        {netSheet.downPaymentPercent}%
                      </Badge>
                    </div>
                    <Input
                      id="downPayment"
                      type="text"
                      value={formatCurrency(netSheet.downPayment)}
                      onChange={(e) => handleDownPaymentChange(e.target.value)}
                      className="font-mono"
                    />
                    <Slider
                      value={[netSheet.downPaymentPercent]}
                      min={3}
                      max={50}
                      step={1}
                      onValueChange={handleDownPaymentPercentChange}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3%</span>
                      <span className="text-primary font-medium">20%</span>
                      <span>50%</span>
                    </div>
                    
                    {netSheet.downPaymentPercent < 20 && (
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800 flex items-center gap-2 mt-2">
                        <InfoIcon className="h-3 w-3 flex-shrink-0" />
                        <span>Down payments under 20% typically require Private Mortgage Insurance (PMI)</span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-amber-800 text-xs underline"
                          onClick={() => toggleEducation('pmi')}
                        >
                          Learn more
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Interest Rate Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="interestRate" className="flex items-center gap-2">
                        <Percent className="h-4 w-4" /> Interest Rate
                      </Label>
                      <span className="text-sm text-muted-foreground">{netSheet.interestRate.toFixed(3)}%</span>
                    </div>
                    <Slider
                      id="interestRate"
                      value={[netSheet.interestRate]}
                      min={1}
                      max={12}
                      step={0.125}
                      onValueChange={handleInterestRateChange}
                    />
                    <div className="text-xs text-muted-foreground">
                      {currentRates.thirtyYear ? (
                        <span>Current 30-yr rate: {formatFredValue(currentRates.thirtyYear, FredDataSeries.MORTGAGE_30YR)}</span>
                      ) : (
                        <span>Typical 30-yr rate: 6.8%</span>
                      )}
                      {currentRates.fifteenYear ? (
                        <span className="ml-3">15-yr: {formatFredValue(currentRates.fifteenYear, FredDataSeries.MORTGAGE_15YR)}</span>
                      ) : (
                        <span className="ml-3">15-yr: 6.2%</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Loan Term Selector */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Loan Term
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant={netSheet.loanTerm === 30 ? "default" : "outline"}
                        onClick={() => handleLoanTermChange(30)}
                        className="flex-1"
                      >
                        30 Years
                      </Button>
                      <Button
                        variant={netSheet.loanTerm === 15 ? "default" : "outline"}
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
                        onClick={() => useMarketRate(netSheet.loanTerm)}
                        className="text-xs h-auto p-0"
                      >
                        Use current market rate
                      </Button>
                    </div>
                  </div>
                  
                  {/* Loan Amount & LTV Section */}
                  <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-lg mt-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Loan Amount</Label>
                      <div className="font-mono font-medium">{formatCurrency(netSheet.loanAmount)}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Loan-to-Value (LTV)</Label>
                      <div className="font-mono font-medium">{(100 - netSheet.downPaymentPercent).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="costs" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Property Tax Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="propertyTax" className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> Annual Property Tax
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('taxes')}>
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Property taxes typically range from 0.5% to 2.5% of home value annually, 
                              depending on your location. Click for more info.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="propertyTax"
                      type="text"
                      value={formatCurrency(netSheet.recurringCosts.propertyTax * 12)}
                      onChange={(e) => handlePropertyTaxChange(e.target.value)}
                      className="font-mono"
                    />
                    <div className="text-xs text-muted-foreground">
                      Estimated at {DEFAULT_PROPERTY_TAX_RATE}% of home value annually
                    </div>
                  </div>
                  
                  {/* Homeowners Insurance Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="insurance" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Annual Homeowners Insurance
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('insurance')}>
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Homeowners insurance typically costs between 0.25% and 0.5% of home value annually. 
                              Click for more details.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="insurance"
                      type="text"
                      value={formatCurrency(netSheet.recurringCosts.homeownersInsurance * 12)}
                      onChange={(e) => handleInsuranceChange(e.target.value)}
                      className="font-mono"
                    />
                    <div className="text-xs text-muted-foreground">
                      Estimated at {DEFAULT_HOME_INSURANCE_RATE}% of home value annually
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* HOA Fees Input */}
                  <div className="space-y-2">
                    <Label htmlFor="hoaFees" className="flex items-center gap-2">
                      <Building className="h-4 w-4" /> Monthly HOA Fees
                    </Label>
                    <Input
                      id="hoaFees"
                      type="text"
                      value={formatCurrency(netSheet.recurringCosts.hoaFees)}
                      onChange={(e) => handleHOAChange(e.target.value)}
                      className="font-mono"
                    />
                    <div className="text-xs text-muted-foreground">
                      If applicable (for condos, townhomes, or certain neighborhoods)
                    </div>
                  </div>
                  
                  {/* Closing Costs Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <FilePlus className="h-4 w-4" /> Closing Costs
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('closingCosts')}>
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Closing costs typically range from 2-5% of the home price. 
                              Click for a detailed breakdown.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {advancedMode ? (
                      <Accordion type="single" collapsible className="w-full" defaultValue="closing-costs">
                        <AccordionItem value="closing-costs" className="border-b-0">
                          <AccordionTrigger className="py-2">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span>Estimated Total</span>
                              <span className="font-mono">
                                {formatCurrency(
                                  netSheet.closingCosts.loanOrigination +
                                  netSheet.closingCosts.appraisalFee +
                                  netSheet.closingCosts.creditReportFee +
                                  netSheet.closingCosts.titleServices +
                                  netSheet.closingCosts.governmentRecordingCharges +
                                  netSheet.closingCosts.transferTaxes +
                                  netSheet.closingCosts.homeInspection +
                                  netSheet.closingCosts.other
                                )}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 mt-2">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Loan Origination Fee</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.loanOrigination)}</div>
                                
                                <div>Appraisal Fee</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.appraisalFee)}</div>
                                
                                <div>Credit Report Fee</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.creditReportFee)}</div>
                                
                                <div>Title Services</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.titleServices)}</div>
                                
                                <div>Government Recording</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.governmentRecordingCharges)}</div>
                                
                                <div>Transfer Taxes</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.transferTaxes)}</div>
                                
                                <div>Home Inspection</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.homeInspection)}</div>
                                
                                <div>Other Costs</div>
                                <div className="text-right font-mono">{formatCurrency(netSheet.closingCosts.other)}</div>
                              </div>
                              
                              <div className="flex justify-between text-sm font-medium pt-2 border-t">
                                <div>Total Closing Costs</div>
                                <div className="text-right font-mono">
                                  {formatCurrency(
                                    netSheet.closingCosts.loanOrigination +
                                    netSheet.closingCosts.appraisalFee +
                                    netSheet.closingCosts.creditReportFee +
                                    netSheet.closingCosts.titleServices +
                                    netSheet.closingCosts.governmentRecordingCharges +
                                    netSheet.closingCosts.transferTaxes +
                                    netSheet.closingCosts.homeInspection +
                                    netSheet.closingCosts.other
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                Approximately {((
                                  netSheet.closingCosts.loanOrigination +
                                  netSheet.closingCosts.appraisalFee +
                                  netSheet.closingCosts.creditReportFee +
                                  netSheet.closingCosts.titleServices +
                                  netSheet.closingCosts.governmentRecordingCharges +
                                  netSheet.closingCosts.transferTaxes +
                                  netSheet.closingCosts.homeInspection +
                                  netSheet.closingCosts.other
                                ) / netSheet.homePrice * 100).toFixed(1)}% of home price
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <div className="bg-muted p-3 rounded flex justify-between">
                        <span className="text-sm">Estimated Total (2-5% of price)</span>
                        <span className="font-mono">
                          {formatCurrency(
                            netSheet.closingCosts.loanOrigination +
                            netSheet.closingCosts.appraisalFee +
                            netSheet.closingCosts.creditReportFee +
                            netSheet.closingCosts.titleServices +
                            netSheet.closingCosts.governmentRecordingCharges +
                            netSheet.closingCosts.transferTaxes +
                            netSheet.closingCosts.homeInspection +
                            netSheet.closingCosts.other
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Results Section */}
          {results && (
            <div className="mt-8 border-t pt-6 space-y-6">
              <h3 className="text-lg font-medium">Home Ownership Cost Summary</h3>
              
              {/* Key Figures */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Cash Needed to Close
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(results.upfrontCosts.totalCashNeeded)}</div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Down Payment</span>
                        <span>{formatCurrency(results.upfrontCosts.downPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Closing Costs</span>
                        <span>{formatCurrency(results.upfrontCosts.closingCosts)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Monthly Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrencyPrecise(results.monthlyPayment.total)}</div>
                    <div className="mt-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${((results.monthlyPayment.principal + results.monthlyPayment.interest) / results.monthlyPayment.total) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Principal & Interest</span>
                        <span>{formatCurrencyPrecise(results.monthlyPayment.principal + results.monthlyPayment.interest)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      Total Cost of Ownership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground">First Year</div>
                      <div className="font-semibold">{formatCurrency(results.yearlyTotal)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground">Over {netSheet.loanTerm} Years</div>
                      <div className="font-semibold">{formatCurrency(results.thirtyYearTotal)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Detailed Breakdown */}
              <div className="rounded-lg border">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Payment Breakdown</h4>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant={selectedBreakdownView === 'monthly' ? 'default' : 'outline'} 
                      onClick={() => setSelectedBreakdownView('monthly')}
                    >
                      Monthly
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBreakdownView === 'annual' ? 'default' : 'outline'} 
                      onClick={() => setSelectedBreakdownView('annual')}
                    >
                      Annual
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedBreakdownView === 'total' ? 'default' : 'outline'} 
                      onClick={() => setSelectedBreakdownView('total')}
                    >
                      Total Cost
                    </Button>
                  </div>
                </div>
                
                {selectedBreakdownView === 'monthly' && (
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Monthly Payment Components</Label>
                        <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                          {/* Principal */}
                          <div 
                            className="h-full bg-primary absolute" 
                            style={{ 
                              width: `${(results.monthlyPayment.principal / results.monthlyPayment.total) * 100}%` 
                            }}
                          />
                          {/* Interest */}
                          <div 
                            className="h-full bg-primary/70 absolute" 
                            style={{ 
                              left: `${(results.monthlyPayment.principal / results.monthlyPayment.total) * 100}%`,
                              width: `${(results.monthlyPayment.interest / results.monthlyPayment.total) * 100}%` 
                            }}
                          />
                          {/* Taxes */}
                          <div 
                            className="h-full bg-amber-500 absolute" 
                            style={{ 
                              left: `${((results.monthlyPayment.principal + results.monthlyPayment.interest) / results.monthlyPayment.total) * 100}%`,
                              width: `${(results.monthlyPayment.taxes / results.monthlyPayment.total) * 100}%` 
                            }}
                          />
                          {/* Insurance */}
                          <div 
                            className="h-full bg-blue-500 absolute" 
                            style={{ 
                              left: `${((results.monthlyPayment.principal + results.monthlyPayment.interest + results.monthlyPayment.taxes) / results.monthlyPayment.total) * 100}%`,
                              width: `${(results.monthlyPayment.insurance / results.monthlyPayment.total) * 100}%` 
                            }}
                          />
                          {/* PMI */}
                          {results.monthlyPayment.pmi > 0 && (
                            <div 
                              className="h-full bg-red-500 absolute" 
                              style={{ 
                                left: `${((results.monthlyPayment.principal + results.monthlyPayment.interest + results.monthlyPayment.taxes + results.monthlyPayment.insurance) / results.monthlyPayment.total) * 100}%`,
                                width: `${(results.monthlyPayment.pmi / results.monthlyPayment.total) * 100}%` 
                              }}
                            />
                          )}
                          {/* HOA */}
                          {results.monthlyPayment.hoa > 0 && (
                            <div 
                              className="h-full bg-purple-500 absolute" 
                              style={{ 
                                left: `${((results.monthlyPayment.principal + results.monthlyPayment.interest + results.monthlyPayment.taxes + results.monthlyPayment.insurance + results.monthlyPayment.pmi) / results.monthlyPayment.total) * 100}%`,
                                width: `${(results.monthlyPayment.hoa / results.monthlyPayment.total) * 100}%` 
                              }}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>Principal</div>
                          <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.principal)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary/70"></div>
                          <div>Interest</div>
                          <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.interest)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div>Property Tax</div>
                          <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.taxes)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>Insurance</div>
                          <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.insurance)}</div>
                        </div>
                        
                        {results.monthlyPayment.pmi > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div>PMI</div>
                            <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.pmi)}</div>
                          </div>
                        )}
                        
                        {results.monthlyPayment.hoa > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <div>HOA</div>
                            <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.hoa)}</div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 font-semibold col-span-2 sm:col-span-3 border-t pt-2 mt-1">
                          <div>Total Monthly Payment</div>
                          <div className="ml-auto font-mono">{formatCurrencyPrecise(results.monthlyPayment.total)}</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-semibold mb-2">
                          Additional Homeownership Costs (Monthly)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div>Utilities</div>
                            <div className="ml-auto font-mono">{formatCurrencyPrecise(netSheet.recurringCosts.utilities)}</div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div>Maintenance</div>
                            <div className="ml-auto font-mono">{formatCurrencyPrecise(netSheet.recurringCosts.maintenance)}</div>
                          </div>
                          
                          <div className="flex items-center gap-2 font-semibold col-span-2 sm:col-span-3 border-t pt-2 mt-1">
                            <div>Total Monthly Cost of Ownership</div>
                            <div className="ml-auto font-mono">
                              {formatCurrencyPrecise(
                                results.monthlyPayment.total + 
                                netSheet.recurringCosts.utilities + 
                                netSheet.recurringCosts.maintenance
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedBreakdownView === 'annual' && (
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Annual Cost Breakdown</Label>
                        <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                          {/* P&I */}
                          <div 
                            className="h-full bg-primary absolute" 
                            style={{ 
                              width: `${(
                                (results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 / 
                                results.yearlyTotal
                              ) * 100}%` 
                            }}
                          />
                          {/* Taxes */}
                          <div 
                            className="h-full bg-amber-500 absolute" 
                            style={{ 
                              left: `${(
                                (results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 / 
                                results.yearlyTotal
                              ) * 100}%`,
                              width: `${(
                                results.monthlyPayment.taxes * 12 / 
                                results.yearlyTotal
                              ) * 100}%` 
                            }}
                          />
                          {/* Insurance */}
                          <div 
                            className="h-full bg-blue-500 absolute" 
                            style={{ 
                              left: `${(
                                ((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 + 
                                results.monthlyPayment.taxes * 12) / 
                                results.yearlyTotal
                              ) * 100}%`,
                              width: `${(
                                results.monthlyPayment.insurance * 12 / 
                                results.yearlyTotal
                              ) * 100}%` 
                            }}
                          />
                          {/* PMI */}
                          {results.monthlyPayment.pmi > 0 && (
                            <div 
                              className="h-full bg-red-500 absolute" 
                              style={{ 
                                left: `${(
                                  ((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 + 
                                  results.monthlyPayment.taxes * 12 + 
                                  results.monthlyPayment.insurance * 12) / 
                                  results.yearlyTotal
                                ) * 100}%`,
                                width: `${(
                                  results.monthlyPayment.pmi * 12 / 
                                  results.yearlyTotal
                                ) * 100}%` 
                              }}
                            />
                          )}
                          {/* HOA */}
                          {results.monthlyPayment.hoa > 0 && (
                            <div 
                              className="h-full bg-purple-500 absolute" 
                              style={{ 
                                left: `${(
                                  ((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 + 
                                  results.monthlyPayment.taxes * 12 + 
                                  results.monthlyPayment.insurance * 12 + 
                                  results.monthlyPayment.pmi * 12) / 
                                  results.yearlyTotal
                                ) * 100}%`,
                                width: `${(
                                  results.monthlyPayment.hoa * 12 / 
                                  results.yearlyTotal
                                ) * 100}%` 
                              }}
                            />
                          )}
                          {/* Utilities */}
                          <div 
                            className="h-full bg-green-500 absolute" 
                            style={{ 
                              left: `${(
                                ((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 + 
                                results.monthlyPayment.taxes * 12 + 
                                results.monthlyPayment.insurance * 12 + 
                                results.monthlyPayment.pmi * 12 + 
                                results.monthlyPayment.hoa * 12) / 
                                results.yearlyTotal
                              ) * 100}%`,
                              width: `${(
                                netSheet.recurringCosts.utilities * 12 / 
                                results.yearlyTotal
                              ) * 100}%` 
                            }}
                          />
                          {/* Maintenance */}
                          <div 
                            className="h-full bg-orange-500 absolute" 
                            style={{ 
                              left: `${(
                                ((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 + 
                                results.monthlyPayment.taxes * 12 + 
                                results.monthlyPayment.insurance * 12 + 
                                results.monthlyPayment.pmi * 12 + 
                                results.monthlyPayment.hoa * 12 +
                                netSheet.recurringCosts.utilities * 12) / 
                                results.yearlyTotal
                              ) * 100}%`,
                              width: `${(
                                netSheet.recurringCosts.maintenance * 12 / 
                                results.yearlyTotal
                              ) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>Principal & Interest</div>
                          <div className="ml-auto font-mono">
                            {formatCurrency((results.monthlyPayment.principal + results.monthlyPayment.interest) * 12)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div>Property Tax</div>
                          <div className="ml-auto font-mono">{formatCurrency(results.monthlyPayment.taxes * 12)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>Insurance</div>
                          <div className="ml-auto font-mono">{formatCurrency(results.monthlyPayment.insurance * 12)}</div>
                        </div>
                        
                        {results.monthlyPayment.pmi > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div>PMI</div>
                            <div className="ml-auto font-mono">{formatCurrency(results.monthlyPayment.pmi * 12)}</div>
                          </div>
                        )}
                        
                        {results.monthlyPayment.hoa > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <div>HOA</div>
                            <div className="ml-auto font-mono">{formatCurrency(results.monthlyPayment.hoa * 12)}</div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>Utilities</div>
                          <div className="ml-auto font-mono">{formatCurrency(netSheet.recurringCosts.utilities * 12)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <div>Maintenance</div>
                          <div className="ml-auto font-mono">{formatCurrency(netSheet.recurringCosts.maintenance * 12)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2 font-semibold col-span-2 sm:col-span-3 border-t pt-2 mt-1">
                          <div>Total Annual Cost</div>
                          <div className="ml-auto font-mono">{formatCurrency(results.yearlyTotal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedBreakdownView === 'total' && (
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Upfront Costs
                          </Label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Down Payment</span>
                              <span className="font-mono">{formatCurrency(results.upfrontCosts.downPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Closing Costs</span>
                              <span className="font-mono">{formatCurrency(results.upfrontCosts.closingCosts)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t font-medium">
                              <span>Total Upfront</span>
                              <span className="font-mono">{formatCurrency(results.upfrontCosts.totalCashNeeded)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Lifetime Costs ({netSheet.loanTerm} years)
                          </Label>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Principal (Loan Amount)</span>
                              <span className="font-mono">{formatCurrency(netSheet.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interest Payments</span>
                              <span className="font-mono">
                                {formatCurrency(
                                  (results.monthlyPayment.principal + results.monthlyPayment.interest) * 12 * netSheet.loanTerm - 
                                  netSheet.loanAmount
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Property Taxes</span>
                              <span className="font-mono">
                                {formatCurrency(results.monthlyPayment.taxes * 12 * netSheet.loanTerm)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Insurance</span>
                              <span className="font-mono">
                                {formatCurrency(results.monthlyPayment.insurance * 12 * netSheet.loanTerm)}
                              </span>
                            </div>
                            {results.monthlyPayment.pmi > 0 && (
                              <div className="flex justify-between">
                                <span>
                                  PMI 
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (est. 7 years)
                                  </span>
                                </span>
                                <span className="font-mono">
                                  {formatCurrency(results.monthlyPayment.pmi * 12 * 7)}
                                </span>
                              </div>
                            )}
                            {results.monthlyPayment.hoa > 0 && (
                              <div className="flex justify-between">
                                <span>HOA Fees</span>
                                <span className="font-mono">
                                  {formatCurrency(results.monthlyPayment.hoa * 12 * netSheet.loanTerm)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Maintenance & Repairs</span>
                              <span className="font-mono">
                                {formatCurrency(netSheet.recurringCosts.maintenance * 12 * netSheet.loanTerm)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Utilities</span>
                              <span className="font-mono">
                                {formatCurrency(netSheet.recurringCosts.utilities * 12 * netSheet.loanTerm)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-1 border-t font-medium">
                              <span>Total Lifetime Cost</span>
                              <span className="font-mono">{formatCurrency(results.thirtyYearTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/40 p-3 rounded border text-sm">
                        <div className="font-semibold mb-1">Points to Consider:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Home appreciation is not included and may offset some costs</li>
                          <li>Tax benefits from mortgage interest and property tax deductions are not calculated</li>
                          <li>If your down payment is less than 20%, PMI typically drops off once you reach 20% equity</li>
                          <li>Energy-efficient homes may have lower utility costs than estimated</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <p>
            This calculator provides estimates only and does not guarantee exact costs. 
            Consult with a loan officer and real estate professional for personalized advice.
          </p>
        </CardFooter>
      </Card>
      
      {/* Educational Dialogs */}
      <Dialog open={showEducation.pmi} onOpenChange={() => toggleEducation('pmi')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 
              Understanding Private Mortgage Insurance (PMI)
            </DialogTitle>
            <DialogDescription>
              PMI protects lenders when borrowers make smaller down payments
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What is PMI?</h4>
                <p className="mt-1 text-sm">
                  Private Mortgage Insurance (PMI) is insurance that protects the lender if you stop making payments on your loan. 
                  PMI is typically required when you make a down payment of less than 20% on a conventional loan.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How much does PMI cost?</h4>
                <p className="mt-1 text-sm">
                  PMI typically costs between 0.3% and 1.5% of your loan amount annually. The exact cost depends on:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Your credit score (higher scores = lower PMI rates)</li>
                  <li>Your loan-to-value ratio (LTV)</li>
                  <li>The type of loan you choose</li>
                  <li>Whether you pay monthly or upfront</li>
                </ul>
                <p className="mt-2 text-sm">
                  For example, on a $300,000 loan with a 0.5% PMI rate, you would pay about $1,500 per year, or $125 per month.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How to avoid or eliminate PMI</h4>
                <div className="mt-1 space-y-2">
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Make a 20% down payment</div>
                    <p className="mt-1 text-sm">
                      The simplest way to avoid PMI is by making a down payment of at least 20% of the home's purchase price.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Request PMI cancellation at 20% equity</div>
                    <p className="mt-1 text-sm">
                      Once you've paid down your mortgage to 80% of the home's original value, you can request that the lender cancel PMI.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Automatic termination at 22% equity</div>
                    <p className="mt-1 text-sm">
                      By law, PMI must automatically terminate when your loan balance reaches 78% of the original value of your home.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Refinance after building equity</div>
                    <p className="mt-1 text-sm">
                      If your home has appreciated in value or you've paid down enough of your loan, refinancing may eliminate the need for PMI.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Is paying PMI worth it?</h4>
                <p className="mt-1 text-sm">
                  While PMI adds to your monthly costs, it may be worth it if:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Waiting to save 20% would take several years</li>
                  <li>Home prices in your area are rising quickly</li>
                  <li>The cost of PMI is outweighed by the benefits of homeownership</li>
                  <li>You can reasonably expect to reach 20% equity within a few years</li>
                </ul>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium">PMI vs. Other Loan Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-sm font-medium">Conventional Loan with PMI</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>Lower down payment (as low as 3%)</li>
                      <li>PMI can be cancelled at 20% equity</li>
                      <li>Usually better rates than FHA loans</li>
                      <li>No upfront mortgage insurance premium</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">FHA Loan</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>3.5% down payment minimum</li>
                      <li>Mortgage insurance for the life of the loan (if less than 10% down)</li>
                      <li>Upfront mortgage insurance premium (UFMIP)</li>
                      <li>Cannot be cancelled without refinancing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEducation.taxes} onOpenChange={() => toggleEducation('taxes')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-4 w-4" /> 
              Understanding Property Taxes
            </DialogTitle>
            <DialogDescription>
              Property taxes fund local services and vary significantly by location
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What are property taxes?</h4>
                <p className="mt-1 text-sm">
                  Property taxes are taxes assessed by local governments on real estate. These taxes fund essential local services 
                  such as schools, roads, police, fire departments, and other public services.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How are property taxes calculated?</h4>
                <p className="mt-1 text-sm">
                  Property taxes are typically calculated as a percentage of your home's assessed value. The formula is:
                </p>
                <div className="bg-muted p-3 rounded mt-2 text-sm">
                  <strong>Property Tax = Assessed Value × Tax Rate</strong>
                </div>
                <p className="mt-2 text-sm">
                  For example, if your home's assessed value is $300,000 and your tax rate is 1%, your annual property tax would be $3,000.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Property tax rates by state</h4>
                <p className="mt-1 text-sm">
                  Property tax rates vary dramatically depending on your location:
                </p>
                <div className="overflow-x-auto mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Level</TableHead>
                        <TableHead>States</TableHead>
                        <TableHead>Effective Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>High</TableCell>
                        <TableCell>New Jersey, Illinois, New Hampshire, Connecticut, Vermont</TableCell>
                        <TableCell>1.8% - 2.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medium</TableCell>
                        <TableCell>Texas, Nebraska, Wisconsin, Ohio, Rhode Island</TableCell>
                        <TableCell>1.4% - 1.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average</TableCell>
                        <TableCell>Michigan, Pennsylvania, Kansas, Massachusetts, Virginia</TableCell>
                        <TableCell>0.9% - 1.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Low</TableCell>
                        <TableCell>Colorado, South Carolina, California, Wyoming, Hawaii</TableCell>
                        <TableCell>0.3% - 0.9%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: Even within states, tax rates can vary significantly by county and municipality.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How property taxes are paid</h4>
                <div className="mt-1 space-y-2">
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Escrow accounts</div>
                    <p className="mt-1 text-sm">
                      Most homeowners pay property taxes through an escrow account set up by their mortgage lender. 
                      Your monthly mortgage payment includes a portion for property taxes, which the lender holds in 
                      escrow until taxes are due.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Direct payment</div>
                    <p className="mt-1 text-sm">
                      Some homeowners, especially those without a mortgage, pay property taxes directly to their local 
                      tax authority, typically in annual, semi-annual, or quarterly installments.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Property tax considerations for homebuyers</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    <strong>Research local tax rates:</strong> Property tax rates can vary dramatically between neighboring towns or districts.
                  </li>
                  <li>
                    <strong>Ask about reassessments:</strong> Some areas reassess property values upon sale, which could significantly increase taxes.
                  </li>
                  <li>
                    <strong>Budget for increases:</strong> Property taxes typically increase over time as property values rise and local budgets change.
                  </li>
                  <li>
                    <strong>Check for exemptions:</strong> Many areas offer exemptions for primary residences, seniors, veterans, or people with disabilities.
                  </li>
                  <li>
                    <strong>Tax benefits:</strong> Property taxes may be tax-deductible if you itemize deductions on your federal income tax return.
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium">Tax Rate vs. Assessment</h4>
                <p className="mt-1 text-sm">
                  When evaluating property taxes, consider both the tax rate and how properties are assessed:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-sm font-medium">High Rate, Low Assessment</h5>
                    <p className="text-xs mt-1">
                      Some areas have high tax rates but assess properties at only a fraction of their market value.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Low Rate, Full Assessment</h5>
                    <p className="text-xs mt-1">
                      Other areas may have lower rates but assess properties at close to 100% of market value.
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-3">
                  The effective tax rate (taxes paid relative to actual home value) provides the clearest picture of your true tax burden.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEducation.insurance} onOpenChange={() => toggleEducation('insurance')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 
              Understanding Homeowners Insurance
            </DialogTitle>
            <DialogDescription>
              Protecting your home, belongings, and financial security
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What is homeowners insurance?</h4>
                <p className="mt-1 text-sm">
                  Homeowners insurance is a package policy that covers damage to your property, liability for injuries or 
                  property damage you cause to others, and living expenses if you need to temporarily live elsewhere due to a 
                  covered claim.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Types of coverage in a standard policy</h4>
                <div className="mt-1 space-y-2">
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Dwelling coverage</div>
                    <p className="mt-1 text-sm">
                      Pays to repair or rebuild your home if damaged by covered perils such as fire, windstorms, hail, or lightning.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Personal property coverage</div>
                    <p className="mt-1 text-sm">
                      Covers your belongings (furniture, clothing, electronics, etc.) if they're damaged, destroyed, or stolen.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Liability protection</div>
                    <p className="mt-1 text-sm">
                      Covers legal expenses if you're sued and damages if you're found responsible for injury or property damage.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Additional living expenses</div>
                    <p className="mt-1 text-sm">
                      Covers hotel bills, restaurant meals, and other costs if you need to live elsewhere while your home is repaired.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">How much does homeowners insurance cost?</h4>
                <p className="mt-1 text-sm">
                  The national average cost is around $1,200 per year, but prices vary widely based on:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Home location (areas prone to natural disasters cost more)</li>
                  <li>Home value and size</li>
                  <li>Construction type and age</li>
                  <li>Deductible amount</li>
                  <li>Coverage limits</li>
                  <li>Credit history (in most states)</li>
                  <li>Claims history</li>
                  <li>Safety features (smoke detectors, security systems, etc.)</li>
                </ul>
                
                <div className="overflow-x-auto mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Home Value</TableHead>
                        <TableHead>Low Risk Area</TableHead>
                        <TableHead>Medium Risk Area</TableHead>
                        <TableHead>High Risk Area</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>$200,000</TableCell>
                        <TableCell>$600-800</TableCell>
                        <TableCell>$900-1,200</TableCell>
                        <TableCell>$1,500-2,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>$300,000</TableCell>
                        <TableCell>$800-1,000</TableCell>
                        <TableCell>$1,200-1,600</TableCell>
                        <TableCell>$2,000-3,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>$400,000</TableCell>
                        <TableCell>$1,000-1,300</TableCell>
                        <TableCell>$1,500-2,000</TableCell>
                        <TableCell>$2,500-4,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>$500,000+</TableCell>
                        <TableCell>$1,300-1,800</TableCell>
                        <TableCell>$1,800-2,500</TableCell>
                        <TableCell>$3,000-6,000+</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: High-risk areas include coastal regions prone to hurricanes, areas with high wildfire risk, 
                  or regions with frequent severe weather.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Common coverage gaps to watch for</h4>
                <div className="mt-1 space-y-2">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-800">
                    <div className="font-medium">Flood damage</div>
                    <p className="mt-1 text-xs">
                      Standard policies do NOT cover flood damage. You need separate flood insurance, especially in flood-prone areas.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-800">
                    <div className="font-medium">Earthquake damage</div>
                    <p className="mt-1 text-xs">
                      Also excluded from standard policies. Separate earthquake insurance is available and recommended in seismic zones.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-800">
                    <div className="font-medium">High-value items</div>
                    <p className="mt-1 text-xs">
                      Coverage for jewelry, art, collectibles, etc., is usually limited. Consider scheduled personal property coverage.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Tips for finding the best insurance</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    <strong>Shop around:</strong> Get quotes from at least 3-5 different insurers.
                  </li>
                  <li>
                    <strong>Consider bundling:</strong> Many insurers offer discounts if you bundle home and auto insurance.
                  </li>
                  <li>
                    <strong>Increase your deductible:</strong> A higher deductible means lower premiums, but make sure you can afford the out-of-pocket cost.
                  </li>
                  <li>
                    <strong>Ask about discounts:</strong> Many insurers offer discounts for security systems, smoke detectors, new roofs, etc.
                  </li>
                  <li>
                    <strong>Review annually:</strong> Insurance needs change as your home appreciates and your belongings change.
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium">Replacement Cost vs. Actual Cash Value</h4>
                <p className="mt-1 text-sm">
                  This distinction can dramatically affect your coverage:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-sm font-medium">Replacement Cost</h5>
                    <p className="text-xs mt-1">
                      Pays to replace your damaged items with new ones of similar type and quality, without deducting for depreciation.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Actual Cash Value</h5>
                    <p className="text-xs mt-1">
                      Pays the depreciated value of your items at the time of loss (what they're worth used, not what they cost new).
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-3 font-medium">
                  Replacement cost coverage is more expensive but provides much better protection.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEducation.closingCosts} onOpenChange={() => toggleEducation('closingCosts')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> 
              Understanding Closing Costs
            </DialogTitle>
            <DialogDescription>
              One-time fees and expenses paid at the closing of a real estate transaction
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What are closing costs?</h4>
                <p className="mt-1 text-sm">
                  Closing costs are the fees and expenses you pay when finalizing a home purchase or refinance. 
                  They typically range from 2% to 5% of the loan amount and are paid on closing day.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Common closing costs for buyers</h4>
                <div className="mt-2 space-y-3">
                  <div>
                    <h5 className="text-sm font-medium">Lender fees</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>
                        <strong>Loan origination fee:</strong> (0.5-1% of loan amount) Covers the lender's administrative costs for processing the loan
                      </li>
                      <li>
                        <strong>Application fee:</strong> ($300-500) Covers the cost of processing your mortgage application
                      </li>
                      <li>
                        <strong>Credit report fee:</strong> ($25-50) Cost of pulling your credit history
                      </li>
                      <li>
                        <strong>Underwriting fee:</strong> ($300-900) Covers the cost of evaluating your loan application
                      </li>
                      <li>
                        <strong>Rate lock fee:</strong> (0-1% of loan amount) Sometimes charged to guarantee an interest rate for a specific period
                      </li>
                      <li>
                        <strong>Discount points:</strong> (Optional) Fees paid to reduce your interest rate (1 point = 1% of loan amount)
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Third-party fees</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>
                        <strong>Appraisal fee:</strong> ($300-600) Determines the home's market value
                      </li>
                      <li>
                        <strong>Home inspection:</strong> ($300-500) Thorough examination of the home's condition (optional but recommended)
                      </li>
                      <li>
                        <strong>Title search:</strong> ($200-400) Research to verify the title is clear of claims
                      </li>
                      <li>
                        <strong>Title insurance:</strong> ($500-1,500) Protects against future claims to the property
                      </li>
                      <li>
                        <strong>Attorney fees:</strong> ($500-1,500) In some states, attorneys must be present at closing
                      </li>
                      <li>
                        <strong>Survey fee:</strong> ($300-800) Verifies property boundaries (not required in all states)
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Government and taxes</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>
                        <strong>Recording fees:</strong> ($25-250) Charged by local government to record the deed
                      </li>
                      <li>
                        <strong>Transfer taxes:</strong> (Varies widely) Tax on the transfer of property from seller to buyer
                      </li>
                      <li>
                        <strong>Property taxes:</strong> (Varies) May need to pay for remaining months of the current year
                      </li>
                      <li>
                        <strong>HOA transfer fee:</strong> ($200-500) If applicable for condos or HOA communities
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Prepaid items and escrow deposits</h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                      <li>
                        <strong>Homeowners insurance premium:</strong> (Typically 1 year) Prepaid for the first year
                      </li>
                      <li>
                        <strong>Property tax reserves:</strong> (2-6 months) Initial deposit for the escrow account
                      </li>
                      <li>
                        <strong>Mortgage insurance premium:</strong> May include upfront and monthly premiums
                      </li>
                      <li>
                        <strong>Prepaid interest:</strong> Interest from closing date to first payment date
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">How to reduce closing costs</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>
                    <strong>Shop around for lenders:</strong> Compare Loan Estimate forms from multiple lenders
                  </li>
                  <li>
                    <strong>Ask the seller to contribute:</strong> In buyer-friendly markets, sellers may pay some closing costs
                  </li>
                  <li>
                    <strong>Schedule closing at the end of the month:</strong> Reduces the amount of prepaid interest due at closing
                  </li>
                  <li>
                    <strong>Negotiate fees:</strong> Some lender fees may be negotiable or could be waived
                  </li>
                  <li>
                    <strong>Consider no-closing-cost options:</strong> The lender covers closing costs in exchange for a higher interest rate
                  </li>
                  <li>
                    <strong>Check for closing cost assistance programs:</strong> First-time homebuyer programs may help cover costs
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Closing disclosure and loan estimate</h4>
                <p className="mt-1 text-sm">
                  Federal law requires two key documents that help you understand closing costs:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Loan Estimate (LE)</div>
                    <p className="mt-1 text-xs">
                      Provided within 3 business days of your loan application. Shows estimated closing costs and mortgage terms.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-medium">Closing Disclosure (CD)</div>
                    <p className="mt-1 text-xs">
                      Provided at least 3 business days before closing. Shows final closing costs and mortgage terms.
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-3">
                  Compare these documents carefully. If the Closing Disclosure shows significantly higher costs than the 
                  Loan Estimate, ask your lender to explain the differences.
                </p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium">Closing Cost Averages by State</h4>
                <p className="mt-1 text-sm">
                  Closing costs vary significantly by state due to differences in taxes, insurance, and other fees:
                </p>
                <div className="overflow-x-auto mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cost Level</TableHead>
                        <TableHead>States</TableHead>
                        <TableHead>Average Costs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>High</TableCell>
                        <TableCell>New York, Delaware, Washington, Maryland, Pennsylvania</TableCell>
                        <TableCell>3.5-5.5% of loan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medium</TableCell>
                        <TableCell>California, Florida, Texas, Illinois, New Jersey</TableCell>
                        <TableCell>2.5-3.5% of loan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Low</TableCell>
                        <TableCell>Missouri, Indiana, Iowa, Kentucky, Arkansas</TableCell>
                        <TableCell>1.5-2.5% of loan</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: Transfer taxes in some states can add significant costs to closing.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClosingCostCalculator;
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
import { getMortgageRates, formatRate, MortgageRateData } from '@/lib/mortgage-data-service';
import { SimpleFullScreenDialog } from '@/components/ui/full-screen-dialog-simple';

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
  selectedState: string;
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

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrencyPrecise = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercent = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100);
};

// Constants
const DEFAULT_HOME_PRICE = 350000;
const DEFAULT_DOWN_PAYMENT_PERCENT = 20;
const DEFAULT_INTEREST_RATE = 6.5;
const DEFAULT_LOAN_TERM = 30;
const DEFAULT_PROPERTY_TAX_RATE = 1.1; // percent annually
const DEFAULT_HOME_INSURANCE_RATE = 0.5; // percent annually
const DEFAULT_PMI_RATE = 0.5; // percent annually
const DEFAULT_HOA_MONTHLY = 250;
const DEFAULT_UTILITIES = 300;
const DEFAULT_HOME_MAINTENANCE = 1; // percent annually
const DEFAULT_STATE = "CA"; // Default state (California)

// State-specific data
interface StateData {
  name: string;
  propertyTaxRate: number; // percentage annually
  transferTaxRate: number; // percentage of home price
  recordingFees: number; // flat fee
  abbreviation: string;
}

const STATE_DATA: { [key: string]: StateData } = {
  "AL": { name: "Alabama", propertyTaxRate: 0.41, transferTaxRate: 0.1, recordingFees: 150, abbreviation: "AL" },
  "AK": { name: "Alaska", propertyTaxRate: 1.19, transferTaxRate: 0, recordingFees: 125, abbreviation: "AK" },
  "AZ": { name: "Arizona", propertyTaxRate: 0.62, transferTaxRate: 0, recordingFees: 175, abbreviation: "AZ" },
  "AR": { name: "Arkansas", propertyTaxRate: 0.63, transferTaxRate: 0.33, recordingFees: 135, abbreviation: "AR" },
  "CA": { name: "California", propertyTaxRate: 0.74, transferTaxRate: 0.11, recordingFees: 225, abbreviation: "CA" },
  "CO": { name: "Colorado", propertyTaxRate: 0.51, transferTaxRate: 0.01, recordingFees: 160, abbreviation: "CO" },
  "CT": { name: "Connecticut", propertyTaxRate: 2.14, transferTaxRate: 1.25, recordingFees: 175, abbreviation: "CT" },
  "DE": { name: "Delaware", propertyTaxRate: 0.57, transferTaxRate: 1.5, recordingFees: 150, abbreviation: "DE" },
  "FL": { name: "Florida", propertyTaxRate: 0.83, transferTaxRate: 0.7, recordingFees: 185, abbreviation: "FL" },
  "GA": { name: "Georgia", propertyTaxRate: 0.87, transferTaxRate: 0.1, recordingFees: 160, abbreviation: "GA" },
  "HI": { name: "Hawaii", propertyTaxRate: 0.28, transferTaxRate: 0.1, recordingFees: 175, abbreviation: "HI" },
  "ID": { name: "Idaho", propertyTaxRate: 0.69, transferTaxRate: 0, recordingFees: 130, abbreviation: "ID" },
  "IL": { name: "Illinois", propertyTaxRate: 2.27, transferTaxRate: 0.1, recordingFees: 175, abbreviation: "IL" },
  "IN": { name: "Indiana", propertyTaxRate: 0.85, transferTaxRate: 0, recordingFees: 145, abbreviation: "IN" },
  "IA": { name: "Iowa", propertyTaxRate: 1.53, transferTaxRate: 0.16, recordingFees: 140, abbreviation: "IA" },
  "KS": { name: "Kansas", propertyTaxRate: 1.41, transferTaxRate: 0, recordingFees: 130, abbreviation: "KS" },
  "KY": { name: "Kentucky", propertyTaxRate: 0.86, transferTaxRate: 0.1, recordingFees: 150, abbreviation: "KY" },
  "LA": { name: "Louisiana", propertyTaxRate: 0.55, transferTaxRate: 0, recordingFees: 175, abbreviation: "LA" },
  "ME": { name: "Maine", propertyTaxRate: 1.36, transferTaxRate: 0.44, recordingFees: 145, abbreviation: "ME" },
  "MD": { name: "Maryland", propertyTaxRate: 1.09, transferTaxRate: 0.5, recordingFees: 185, abbreviation: "MD" },
  "MA": { name: "Massachusetts", propertyTaxRate: 1.23, transferTaxRate: 0.46, recordingFees: 200, abbreviation: "MA" },
  "MI": { name: "Michigan", propertyTaxRate: 1.54, transferTaxRate: 0.86, recordingFees: 160, abbreviation: "MI" },
  "MN": { name: "Minnesota", propertyTaxRate: 1.12, transferTaxRate: 0.33, recordingFees: 175, abbreviation: "MN" },
  "MS": { name: "Mississippi", propertyTaxRate: 0.65, transferTaxRate: 0, recordingFees: 135, abbreviation: "MS" },
  "MO": { name: "Missouri", propertyTaxRate: 0.97, transferTaxRate: 0, recordingFees: 150, abbreviation: "MO" },
  "MT": { name: "Montana", propertyTaxRate: 0.84, transferTaxRate: 0, recordingFees: 140, abbreviation: "MT" },
  "NE": { name: "Nebraska", propertyTaxRate: 1.73, transferTaxRate: 0.225, recordingFees: 145, abbreviation: "NE" },
  "NV": { name: "Nevada", propertyTaxRate: 0.69, transferTaxRate: 0.51, recordingFees: 160, abbreviation: "NV" },
  "NH": { name: "New Hampshire", propertyTaxRate: 2.18, transferTaxRate: 1.5, recordingFees: 150, abbreviation: "NH" },
  "NJ": { name: "New Jersey", propertyTaxRate: 2.49, transferTaxRate: 1.21, recordingFees: 200, abbreviation: "NJ" },
  "NM": { name: "New Mexico", propertyTaxRate: 0.8, transferTaxRate: 0, recordingFees: 145, abbreviation: "NM" },
  "NY": { name: "New York", propertyTaxRate: 1.72, transferTaxRate: 0.4, recordingFees: 225, abbreviation: "NY" },
  "NC": { name: "North Carolina", propertyTaxRate: 0.84, transferTaxRate: 0.2, recordingFees: 160, abbreviation: "NC" },
  "ND": { name: "North Dakota", propertyTaxRate: 0.98, transferTaxRate: 0, recordingFees: 135, abbreviation: "ND" },
  "OH": { name: "Ohio", propertyTaxRate: 1.56, transferTaxRate: 0.1, recordingFees: 155, abbreviation: "OH" },
  "OK": { name: "Oklahoma", propertyTaxRate: 0.9, transferTaxRate: 0.075, recordingFees: 145, abbreviation: "OK" },
  "OR": { name: "Oregon", propertyTaxRate: 0.97, transferTaxRate: 0.1, recordingFees: 170, abbreviation: "OR" },
  "PA": { name: "Pennsylvania", propertyTaxRate: 1.58, transferTaxRate: 1, recordingFees: 185, abbreviation: "PA" },
  "RI": { name: "Rhode Island", propertyTaxRate: 1.63, transferTaxRate: 0.46, recordingFees: 170, abbreviation: "RI" },
  "SC": { name: "South Carolina", propertyTaxRate: 0.57, transferTaxRate: 0.37, recordingFees: 155, abbreviation: "SC" },
  "SD": { name: "South Dakota", propertyTaxRate: 1.32, transferTaxRate: 0.1, recordingFees: 140, abbreviation: "SD" },
  "TN": { name: "Tennessee", propertyTaxRate: 0.71, transferTaxRate: 0.37, recordingFees: 150, abbreviation: "TN" },
  "TX": { name: "Texas", propertyTaxRate: 1.8, transferTaxRate: 0, recordingFees: 175, abbreviation: "TX" },
  "UT": { name: "Utah", propertyTaxRate: 0.66, transferTaxRate: 0, recordingFees: 150, abbreviation: "UT" },
  "VT": { name: "Vermont", propertyTaxRate: 1.9, transferTaxRate: 1.25, recordingFees: 145, abbreviation: "VT" },
  "VA": { name: "Virginia", propertyTaxRate: 0.8, transferTaxRate: 0.33, recordingFees: 180, abbreviation: "VA" },
  "WA": { name: "Washington", propertyTaxRate: 0.98, transferTaxRate: 1.28, recordingFees: 190, abbreviation: "WA" },
  "WV": { name: "West Virginia", propertyTaxRate: 0.59, transferTaxRate: 0.22, recordingFees: 140, abbreviation: "WV" },
  "WI": { name: "Wisconsin", propertyTaxRate: 1.85, transferTaxRate: 0.3, recordingFees: 160, abbreviation: "WI" },
  "WY": { name: "Wyoming", propertyTaxRate: 0.61, transferTaxRate: 0, recordingFees: 135, abbreviation: "WY" },
  "DC": { name: "District of Columbia", propertyTaxRate: 0.56, transferTaxRate: 1.1, recordingFees: 200, abbreviation: "DC" }
}

export const ClosingCostCalculator: React.FC<{onClose?: () => void}> = ({ onClose }) => {
  // State for net sheet
  const [netSheet, setNetSheet] = useState<NetSheet>({
    homePrice: DEFAULT_HOME_PRICE,
    downPayment: DEFAULT_HOME_PRICE * (DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT,
    loanAmount: DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    loanTerm: DEFAULT_LOAN_TERM,
    interestRate: DEFAULT_INTEREST_RATE,
    selectedState: DEFAULT_STATE,
    closingCosts: {
      loanOrigination: DEFAULT_HOME_PRICE * 0.01,
      appraisalFee: 500,
      creditReportFee: 25,
      titleServices: 1200,
      governmentRecordingCharges: STATE_DATA[DEFAULT_STATE].recordingFees,
      transferTaxes: DEFAULT_HOME_PRICE * (STATE_DATA[DEFAULT_STATE].transferTaxRate / 100),
      homeInspection: 400,
      other: 500
    },
    recurringCosts: {
      propertyTax: (DEFAULT_HOME_PRICE * STATE_DATA[DEFAULT_STATE].propertyTaxRate) / 100 / 12,
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

  // Results state
  const [results, setResults] = useState<NetSheetResults>({
    upfrontCosts: {
      downPayment: 0,
      closingCosts: 0,
      totalCashNeeded: 0
    },
    monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
    yearlyTotal: 0,
    fiveYearTotal: 0,
    thirtyYearTotal: 0
  });

  // Market data
  const [currentRates, setCurrentRates] = useState<{ [key: string]: number }>({
    thirtyYearFixed: 0,
    fifteenYearFixed: 0
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
  
  // Dialog state for full-screen card
  const [showFullCard, setShowFullCard] = useState<boolean>(false);

  // Calculate mortgage payment
  const calculateMonthlyPayment = (): MortgageBreakdown => {
    // Monthly interest rate
    const monthlyRate = netSheet.interestRate / 100 / 12;
    
    // Total number of payments
    const numberOfPayments = netSheet.loanTerm * 12;
    
    // Calculate principal and interest payment using formula
    let principalAndInterest = 0;
    
    if (monthlyRate > 0) {
      principalAndInterest = netSheet.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      principalAndInterest = netSheet.loanAmount / numberOfPayments;
    }
    
    // Separate principal and interest for the first payment
    const interestPayment = netSheet.loanAmount * monthlyRate;
    const principalPayment = principalAndInterest - interestPayment;
    
    // Calculate total monthly payment
    const monthlyPayment: MortgageBreakdown = {
      principal: principalPayment,
      interest: interestPayment,
      pmi: netSheet.recurringCosts.mortgageInsurance,
      taxes: netSheet.recurringCosts.propertyTax,
      insurance: netSheet.recurringCosts.homeownersInsurance,
      hoa: netSheet.recurringCosts.hoaFees,
      total: principalAndInterest + 
        netSheet.recurringCosts.propertyTax + 
        netSheet.recurringCosts.homeownersInsurance + 
        netSheet.recurringCosts.mortgageInsurance +
        netSheet.recurringCosts.hoaFees
    };
    
    return monthlyPayment;
  };

  // Calculate total closing costs
  const calculateTotalClosingCosts = (): number => {
    return (
      netSheet.closingCosts.loanOrigination +
      netSheet.closingCosts.appraisalFee +
      netSheet.closingCosts.creditReportFee +
      netSheet.closingCosts.titleServices +
      netSheet.closingCosts.governmentRecordingCharges +
      netSheet.closingCosts.transferTaxes +
      netSheet.closingCosts.homeInspection +
      netSheet.closingCosts.other
    );
  };

  // Calculate all results
  const calculateResults = () => {
    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment();
    
    // Calculate cash needed to close
    const totalClosingCosts = calculateTotalClosingCosts();
    const cashToClose = netSheet.downPayment + totalClosingCosts;
    
    // Calculate yearly costs
    const yearlyPrincipalAndInterest = monthlyPayment.principal + monthlyPayment.interest;
    const yearlyTaxes = netSheet.recurringCosts.propertyTax * 12;
    const yearlyInsurance = netSheet.recurringCosts.homeownersInsurance * 12;
    const yearlyPMI = netSheet.recurringCosts.mortgageInsurance * 12;
    const yearlyHOA = netSheet.recurringCosts.hoaFees * 12;
    const yearlyUtilities = netSheet.recurringCosts.utilities * 12;
    const yearlyMaintenance = netSheet.recurringCosts.maintenance * 12;
    
    const yearlyTotal = (yearlyPrincipalAndInterest + yearlyTaxes + yearlyInsurance + 
      yearlyPMI + yearlyHOA + yearlyUtilities + yearlyMaintenance);
    
    // Calculate total costs over time
    const fiveYearTotal = yearlyTotal * 5;
    const thirtyYearTotal = yearlyTotal * 30;
    
    // Update state
    setNetSheet(prevState => ({
      ...prevState,
      loanAmount: prevState.homePrice - prevState.downPayment,
      monthlyPayment,
      cashToClose,
      firstYearTotal: yearlyTotal
    }));
    
    setResults({
      upfrontCosts: {
        downPayment: netSheet.downPayment,
        closingCosts: totalClosingCosts,
        totalCashNeeded: cashToClose
      },
      monthlyPayment,
      yearlyTotal,
      fiveYearTotal,
      thirtyYearTotal
    });
  };

  // Fetch current rates
  const getRates = async () => {
    try {
      const rates = await getMortgageRates();
      setCurrentRates({
        thirtyYearFixed: rates.thirtyYearFixed.rate,
        fifteenYearFixed: rates.fifteenYearFixed.rate
      });
      
      // Update interest rate in form to match current market rate
      setNetSheet(prev => ({
        ...prev,
        interestRate: rates.thirtyYearFixed.rate
      }));
    } catch (error) {
      console.error("Failed to fetch mortgage rates:", error);
      // Keep default interest rate if API fails
    }
  };

  // Initialization
  useEffect(() => {
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
    
    // Get state data for the currently selected state
    const stateData = STATE_DATA[netSheet.selectedState];
    
    // Update property tax and insurance based on new home price and selected state
    const newPropertyTax = (price * stateData.propertyTaxRate) / 100 / 12;
    const newHomeownersInsurance = (price * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12;
    
    // Update PMI based on new loan amount
    const newLoanAmount = price - newDownPayment;
    const newMortgageInsurance = netSheet.downPaymentPercent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    // Update maintenance cost
    const newMaintenance = (price * DEFAULT_HOME_MAINTENANCE) / 100 / 12;
    
    // Update transfer taxes based on selected state
    const newTransferTaxes = price * (stateData.transferTaxRate / 100);
    
    // Update loan origination fee
    const newLoanOrigination = price * 0.01;
    
    setNetSheet(prev => ({
      ...prev,
      homePrice: price,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount,
      closingCosts: {
        ...prev.closingCosts,
        loanOrigination: newLoanOrigination,
        transferTaxes: newTransferTaxes
      },
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: newPropertyTax,
        homeownersInsurance: newHomeownersInsurance,
        mortgageInsurance: newMortgageInsurance,
        maintenance: newMaintenance
      }
    }));
  };

  // Handle down payment changes
  const handleDownPaymentChange = (value: string) => {
    const downPayment = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const downPaymentPercent = Math.min(100, Math.round((downPayment / netSheet.homePrice) * 100));
    
    // Recalculate PMI
    const newLoanAmount = netSheet.homePrice - downPayment;
    const newMortgageInsurance = downPaymentPercent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    setNetSheet(prev => ({
      ...prev,
      downPayment,
      downPaymentPercent,
      loanAmount: newLoanAmount,
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newMortgageInsurance
      }
    }));
  };

  // Handle down payment percentage changes
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    const downPayment = Math.round((netSheet.homePrice * percent) / 100);
    
    // Recalculate PMI
    const newLoanAmount = netSheet.homePrice - downPayment;
    const newMortgageInsurance = percent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    setNetSheet(prev => ({
      ...prev,
      downPayment,
      downPaymentPercent: percent,
      loanAmount: newLoanAmount,
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newMortgageInsurance
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
  const handleLoanTermChange = (value: string) => {
    setNetSheet(prev => ({
      ...prev,
      loanTerm: parseInt(value)
    }));
  };
  
  // Handle state change
  const handleStateChange = (value: string) => {
    const stateData = STATE_DATA[value];
    
    // Calculate new property tax based on selected state
    const newPropertyTax = (netSheet.homePrice * stateData.propertyTaxRate) / 100 / 12;
    
    // Update transfer taxes and recording fees based on selected state
    const newTransferTaxes = netSheet.homePrice * (stateData.transferTaxRate / 100);
    const newRecordingFees = stateData.recordingFees;
    
    setNetSheet(prev => ({
      ...prev,
      selectedState: value,
      closingCosts: {
        ...prev.closingCosts,
        governmentRecordingCharges: newRecordingFees,
        transferTaxes: newTransferTaxes
      },
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: newPropertyTax
      }
    }));
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
      selectedState: DEFAULT_STATE,
      closingCosts: {
        loanOrigination: DEFAULT_HOME_PRICE * 0.01,
        appraisalFee: 500,
        creditReportFee: 25,
        titleServices: 1200,
        governmentRecordingCharges: STATE_DATA[DEFAULT_STATE].recordingFees,
        transferTaxes: DEFAULT_HOME_PRICE * (STATE_DATA[DEFAULT_STATE].transferTaxRate / 100),
        homeInspection: 400,
        other: 500
      },
      recurringCosts: {
        propertyTax: (DEFAULT_HOME_PRICE * STATE_DATA[DEFAULT_STATE].propertyTaxRate) / 100 / 12,
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
    <div>
      {/* Small Card for Homepage View */}
      <Card 
        className="border-green-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowFullCard(true)}
      >
        <CardHeader className="bg-green-100 text-green-800 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Closing Cost & Total Ownership Calculator
          </CardTitle>
          <CardDescription className="text-green-700/90">
            Understand all costs associated with buying a home, from closing to long-term ownership
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="text-center p-4">
            <p className="text-sm mb-4">Click to calculate all costs associated with buying a home:</p>
            <ul className="text-left list-disc list-inside mb-4">
              <li>Down payment requirements</li>
              <li>Closing costs breakdown</li>
              <li>Monthly payment analysis</li>
              <li>Long-term homeownership expenses</li>
            </ul>
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              Open Calculator
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Full Screen Dialog */}
      <SimpleFullScreenDialog 
        isOpen={showFullCard} 
        onClose={() => setShowFullCard(false)}
        title="Closing Cost & Total Ownership Calculator"
      >
        <div className="container max-w-5xl mx-auto p-4">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-green-600" />
                  Closing Cost & Total Ownership Calculator
                </h1>
                <p className="text-gray-600">
                  Understand all costs associated with buying a home, from closing to long-term ownership
                </p>
              </div>
              
              {/* Desktop Close Button */}
              <Button 
                variant="outline" 
                size="sm"
                className="hidden md:flex rounded-full h-10 w-10 p-0 border-2 border-green-500"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    setShowFullCard(false);
                  }
                }}
              >
                <X className="h-6 w-6 text-green-600" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <Separator className="my-4" />
          </div>
          
          {/* Main Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {/* Input Section */}
              <Card>
                <CardHeader className="bg-green-50 dark:bg-green-900">
                  <CardTitle className="text-lg text-green-900 dark:text-green-50">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="home-price">Home Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="home-price"
                        type="text"
                        className="pl-8"
                        value={formatCurrency(netSheet.homePrice)}
                        onChange={(e) => handleHomePriceChange(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="down-payment">Down Payment</Label>
                      <span className="text-sm text-gray-500">{formatPercent(netSheet.downPaymentPercent)}</span>
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="down-payment"
                        type="text"
                        className="pl-8"
                        value={formatCurrency(netSheet.downPayment)}
                        onChange={(e) => handleDownPaymentChange(e.target.value)}
                      />
                    </div>
                    <Slider
                      defaultValue={[DEFAULT_DOWN_PAYMENT_PERCENT]}
                      max={50}
                      step={1}
                      value={[netSheet.downPaymentPercent]}
                      onValueChange={handleDownPaymentPercentChange}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="interest-rate">Interest Rate</Label>
                      <span className="text-sm text-gray-500">{netSheet.interestRate.toFixed(2)}%</span>
                    </div>
                    <Slider
                      defaultValue={[DEFAULT_INTEREST_RATE]}
                      min={2}
                      max={10}
                      step={0.125}
                      value={[netSheet.interestRate]}
                      onValueChange={handleInterestRateChange}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>2%</span>
                      <span>6%</span>
                      <span>10%</span>
                    </div>
                    {currentRates.thirtyYearFixed > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        Current average 30-year rate: {formatRate(currentRates.thirtyYearFixed)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term</Label>
                    <Select value={netSheet.loanTerm.toString()} onValueChange={handleLoanTermChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Years</SelectItem>
                        <SelectItem value="20">20 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    {currentRates.fifteenYearFixed > 0 && netSheet.loanTerm === 15 && (
                      <div className="mt-1 text-xs text-gray-600">
                        Current average 15-year rate: {formatRate(currentRates.fifteenYearFixed)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={netSheet.selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(STATE_DATA).sort().map((stateCode) => (
                          <SelectItem key={stateCode} value={stateCode}>
                            {STATE_DATA[stateCode].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-1 text-xs text-gray-600">
                      Rates are specific to each state
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="advanced-mode"
                        checked={advancedMode}
                        onCheckedChange={handleAdvancedModeToggle}
                      />
                      <Label htmlFor="advanced-mode">Advanced Options</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {advancedMode && (
                <Card className="mt-4">
                  <CardHeader className="bg-green-50 dark:bg-green-900">
                    <CardTitle className="text-lg text-green-900 dark:text-green-50">Advanced Options</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs defaultValue="closing" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-green-100 dark:bg-green-950">
                        <TabsTrigger value="closing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Closing Costs</TabsTrigger>
                        <TabsTrigger value="recurring" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Recurring Costs</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="closing" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Loan Origination Fee</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              className="pl-8"
                              value={formatCurrency(netSheet.closingCosts.loanOrigination)}
                              onChange={(e) => {
                                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                setNetSheet(prev => ({
                                  ...prev,
                                  closingCosts: {
                                    ...prev.closingCosts,
                                    loanOrigination: value
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Add more closing cost fields here */}
                        <div className="space-y-2">
                          <Label>Appraisal Fee</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              className="pl-8"
                              value={formatCurrency(netSheet.closingCosts.appraisalFee)}
                              onChange={(e) => {
                                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                setNetSheet(prev => ({
                                  ...prev,
                                  closingCosts: {
                                    ...prev.closingCosts,
                                    appraisalFee: value
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="recurring" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Property Tax (Monthly)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              className="pl-8"
                              value={formatCurrencyPrecise(netSheet.recurringCosts.propertyTax)}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                                setNetSheet(prev => ({
                                  ...prev,
                                  recurringCosts: {
                                    ...prev.recurringCosts,
                                    propertyTax: value
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Homeowners Insurance (Monthly)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              className="pl-8"
                              value={formatCurrencyPrecise(netSheet.recurringCosts.homeownersInsurance)}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                                setNetSheet(prev => ({
                                  ...prev,
                                  recurringCosts: {
                                    ...prev.recurringCosts,
                                    homeownersInsurance: value
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>HOA Fees (Monthly)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              className="pl-8"
                              value={formatCurrency(netSheet.recurringCosts.hoaFees)}
                              onChange={(e) => {
                                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                setNetSheet(prev => ({
                                  ...prev,
                                  recurringCosts: {
                                    ...prev.recurringCosts,
                                    hoaFees: value
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {/* Results Section */}
              <Card>
                <CardHeader className="bg-green-50 dark:bg-green-900">
                  <CardTitle className="text-lg text-green-900 dark:text-green-50">
                    Estimated Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Tabs defaultValue="monthly" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-green-100 dark:bg-green-950">
                      <TabsTrigger value="upfront" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Upfront Costs</TabsTrigger>
                      <TabsTrigger value="monthly" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Monthly Payment</TabsTrigger>
                      <TabsTrigger value="longterm" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Long-term Costs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upfront" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Down Payment</p>
                          <p className="text-2xl font-bold">{formatCurrency(netSheet.downPayment)}</p>
                          <p className="text-xs text-gray-500">{formatPercent(netSheet.downPaymentPercent)} of home price</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">Closing Costs</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('closingCosts')}>
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p>Closing costs are fees paid at closing including loan origination, appraisal, title insurance, and {STATE_DATA[netSheet.selectedState].name}-specific transfer taxes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-2xl font-bold">{formatCurrency(calculateTotalClosingCosts())}</p>
                          <p className="text-xs text-gray-500">About {formatPercent(calculateTotalClosingCosts() / netSheet.homePrice * 100)} of home price (based on {STATE_DATA[netSheet.selectedState].name} rates)</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Total Cash Needed to Close</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(netSheet.cashToClose)}</p>
                      </div>
                      
                      {advancedMode && (
                        <div className="mt-6">
                          <h3 className="font-medium mb-2">Closing Costs Breakdown</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Loan Origination Fee</span>
                              <span>{formatCurrency(netSheet.closingCosts.loanOrigination)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Appraisal Fee</span>
                              <span>{formatCurrency(netSheet.closingCosts.appraisalFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Credit Report Fee</span>
                              <span>{formatCurrency(netSheet.closingCosts.creditReportFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Title Services</span>
                              <span>{formatCurrency(netSheet.closingCosts.titleServices)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Government Recording Charges</span>
                              <span>{formatCurrency(netSheet.closingCosts.governmentRecordingCharges)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Transfer Taxes</span>
                              <span>{formatCurrency(netSheet.closingCosts.transferTaxes)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Home Inspection</span>
                              <span>{formatCurrency(netSheet.closingCosts.homeInspection)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Other Fees</span>
                              <span>{formatCurrency(netSheet.closingCosts.other)}</span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between text-sm font-medium">
                              <span>Total Closing Costs</span>
                              <span>{formatCurrency(calculateTotalClosingCosts())}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="monthly" className="pt-4">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="text-center md:text-left">
                          <p className="text-sm font-medium">Total Monthly Payment</p>
                          <p className="text-3xl font-bold text-green-700">
                            {formatCurrencyPrecise(netSheet.monthlyPayment.total)}
                          </p>
                          <p className="text-xs text-gray-500">Principal, interest, taxes, insurance & HOA</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Based on rates for {STATE_DATA[netSheet.selectedState].name}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-1/2 h-24">
                          <div className="relative h-8 flex items-center">
                            <div
                              className="absolute h-8 bg-blue-500 rounded-l-md"
                              style={{ width: `${((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest) / netSheet.monthlyPayment.total) * 100}%` }}
                            ></div>
                            <div
                              className="absolute h-8 bg-amber-500"
                              style={{ 
                                left: `${((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest) / netSheet.monthlyPayment.total) * 100}%`,
                                width: `${(netSheet.monthlyPayment.taxes / netSheet.monthlyPayment.total) * 100}%` 
                              }}
                            ></div>
                            <div
                              className="absolute h-8 bg-green-500"
                              style={{ 
                                left: `${((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest + netSheet.monthlyPayment.taxes) / netSheet.monthlyPayment.total) * 100}%`,
                                width: `${(netSheet.monthlyPayment.insurance / netSheet.monthlyPayment.total) * 100}%` 
                              }}
                            ></div>
                            <div
                              className="absolute h-8 bg-red-500"
                              style={{ 
                                left: `${((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest + netSheet.monthlyPayment.taxes + netSheet.monthlyPayment.insurance) / netSheet.monthlyPayment.total) * 100}%`,
                                width: `${(netSheet.monthlyPayment.pmi / netSheet.monthlyPayment.total) * 100}%` 
                              }}
                            ></div>
                            <div
                              className="absolute h-8 bg-purple-500 rounded-r-md"
                              style={{ 
                                left: `${((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest + netSheet.monthlyPayment.taxes + netSheet.monthlyPayment.insurance + netSheet.monthlyPayment.pmi) / netSheet.monthlyPayment.total) * 100}%`,
                                width: `${(netSheet.monthlyPayment.hoa / netSheet.monthlyPayment.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="flex text-xs mt-2 justify-between">
                            <span className="text-blue-500">Principal & Interest</span>
                            <span className="text-amber-500">Taxes</span>
                            <span className="text-green-500">Insurance</span>
                            <span className="text-red-500">PMI</span>
                            <span className="text-purple-500">HOA</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">Principal & Interest</p>
                          </div>
                          <p className="text-lg font-bold">
                            {formatCurrencyPrecise(netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">Property Taxes</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('taxes')}>
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p>Monthly property tax is estimated at {(STATE_DATA[netSheet.selectedState].propertyTaxRate).toFixed(2)}% of home value annually in {STATE_DATA[netSheet.selectedState].name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-lg font-bold">{formatCurrencyPrecise(netSheet.monthlyPayment.taxes)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">Homeowners Insurance</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('insurance')}>
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p>Monthly insurance estimated at {(DEFAULT_HOME_INSURANCE_RATE).toFixed(2)}% of home value annually</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-lg font-bold">{formatCurrencyPrecise(netSheet.monthlyPayment.insurance)}</p>
                        </div>
                        
                        {netSheet.monthlyPayment.pmi > 0 && (
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium">Mortgage Insurance (PMI)</p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleEducation('pmi')}>
                                      <HelpCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm">
                                    <p>PMI is required when down payment is less than 20%. Estimated at {DEFAULT_PMI_RATE.toFixed(2)}% of loan amount annually</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-lg font-bold text-red-500">{formatCurrencyPrecise(netSheet.monthlyPayment.pmi)}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium">HOA Fees</p>
                          <p className="text-lg font-bold">{formatCurrencyPrecise(netSheet.monthlyPayment.hoa)}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="longterm" className="pt-4">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">First Year Total</p>
                            <p className="text-2xl font-bold">{formatCurrency(results.yearlyTotal)}</p>
                            <p className="text-xs text-gray-500">All housing costs for 12 months in {STATE_DATA[netSheet.selectedState].name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">5-Year Total</p>
                            <p className="text-2xl font-bold">{formatCurrency(results.fiveYearTotal)}</p>
                            <p className="text-xs text-gray-500">Projected costs for 5 years</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">30-Year Total</p>
                            <p className="text-2xl font-bold">{formatCurrency(results.thirtyYearTotal)}</p>
                            <p className="text-xs text-gray-500">Lifetime costs (not adjusted for inflation)</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-3">Yearly Cost Breakdown</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Principal & Interest (Yearly)</span>
                              <span>{formatCurrency((netSheet.monthlyPayment.principal + netSheet.monthlyPayment.interest) * 12)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Property Taxes ({STATE_DATA[netSheet.selectedState].abbreviation}, Yearly)</span>
                              <span>{formatCurrency(netSheet.recurringCosts.propertyTax * 12)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Homeowners Insurance (Yearly)</span>
                              <span>{formatCurrency(netSheet.recurringCosts.homeownersInsurance * 12)}</span>
                            </div>
                            {netSheet.recurringCosts.mortgageInsurance > 0 && (
                              <div className="flex justify-between text-sm">
                                <span>Mortgage Insurance (Yearly)</span>
                                <span>{formatCurrency(netSheet.recurringCosts.mortgageInsurance * 12)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>HOA Fees (Yearly)</span>
                              <span>{formatCurrency(netSheet.recurringCosts.hoaFees * 12)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Home Maintenance (Yearly)</span>
                              <span>{formatCurrency(netSheet.recurringCosts.maintenance * 12)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Utilities (Yearly)</span>
                              <span>{formatCurrency(netSheet.recurringCosts.utilities * 12)}</span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Total Yearly Housing Cost</span>
                              <span>{formatCurrency(results.yearlyTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1 text-green-600" />
                          Loan Information
                        </p>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Loan Amount:</span>
                            <span>{formatCurrency(netSheet.loanAmount)}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Loan Term:</span>
                            <span>{netSheet.loanTerm} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Interest Rate:</span>
                            <span>{netSheet.interestRate.toFixed(3)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1 text-green-600" />
                          Affordability Check
                        </p>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Home Price to Income Ratio:</span>
                            <span>Calculation needed</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Cash to Close:</span>
                            <span>{formatCurrency(netSheet.cashToClose)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm mb-2">Common buying tips for {STATE_DATA[netSheet.selectedState].name}:</p>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>A 20% down payment ({formatPercent(20)}) avoids PMI, saving {formatCurrencyPrecise(netSheet.recurringCosts.mortgageInsurance)} monthly</li>
                      <li>Property taxes in {STATE_DATA[netSheet.selectedState].name} average {STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}% of home value yearly</li>
                      <li>Consider all recurring expenses when budgeting for homeownership</li>
                      <li>Include funds for maintenance (typically 1% of home value annually)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Education Dialogs */}
        <Dialog open={showEducation.pmi} onOpenChange={() => toggleEducation('pmi')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding PMI (Private Mortgage Insurance)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                <strong>What is PMI?</strong> Private Mortgage Insurance protects the lender if you default on your loan.
              </p>
              <p>
                <strong>When is it required?</strong> PMI is typically required when your down payment is less than 20% of the home's purchase price.
              </p>
              <p>
                <strong>How much does it cost?</strong> PMI usually costs between 0.3% to 1.2% of your loan amount annually. In this calculator, we're using {DEFAULT_PMI_RATE.toFixed(2)}%.
              </p>
              <p>
                <strong>How to avoid PMI:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Make a down payment of at least 20%</li>
                <li>Consider a piggyback loan (80-10-10 loan)</li>
                <li>Look into lender-paid PMI options (higher interest rate)</li>
              </ul>
              <p>
                <strong>How to remove PMI:</strong> Once you reach 20% equity in your home, you can request PMI removal. It's automatically terminated at 22% equity.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.taxes} onOpenChange={() => toggleEducation('taxes')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Property Taxes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                <strong>What are property taxes?</strong> Property taxes are assessed by local governments to fund schools, infrastructure, public services, and more.
              </p>
              <p>
                <strong>How are they calculated?</strong> Property taxes are typically a percentage of your home's assessed value. For {STATE_DATA[netSheet.selectedState].name}, we're using {STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}% annually, which is the average rate for this state.
              </p>
              <p>
                <strong>How are they paid?</strong> Property taxes are usually paid:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Through an escrow account with your mortgage payment</li>
                <li>Directly to your county/municipality (typically annually or semi-annually)</li>
              </ul>
              <p>
                <strong>Important considerations:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Property tax rates vary significantly by location</li>
                <li>Tax assessments may not match market value</li>
                <li>You might qualify for exemptions (homestead, senior, etc.)</li>
                <li>Property taxes typically increase over time</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.insurance} onOpenChange={() => toggleEducation('insurance')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Homeowners Insurance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                <strong>What is homeowners insurance?</strong> Homeowners insurance protects your home and belongings from damage, theft, and liability claims.
              </p>
              <p>
                <strong>Why is it required?</strong> Mortgage lenders require homeowners insurance to protect their investment in your property.
              </p>
              <p>
                <strong>What does it typically cover?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Dwelling coverage (structure of your home)</li>
                <li>Personal property (belongings)</li>
                <li>Liability protection</li>
                <li>Additional living expenses if your home is uninhabitable</li>
              </ul>
              <p>
                <strong>What's NOT typically covered?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Flood damage (requires separate flood insurance)</li>
                <li>Earthquake damage (requires separate policy)</li>
                <li>Normal wear and tear</li>
              </ul>
              <p>
                <strong>Factors affecting premiums:</strong> Location, home value, deductible amount, credit score, claim history, and coverage options.
              </p>
              <p>
                <strong>How to save:</strong> Bundle with auto insurance, increase deductibles, install security systems, or improve your home's resilience.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.closingCosts} onOpenChange={() => toggleEducation('closingCosts')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Closing Costs</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                <strong>What are closing costs?</strong> Closing costs are fees and expenses you pay when finalizing your mortgage and home purchase.
              </p>
              <p>
                <strong>How much are they?</strong> Typically, closing costs range from 2% to 5% of the loan amount. In {STATE_DATA[netSheet.selectedState].name}, transfer taxes are approximately {STATE_DATA[netSheet.selectedState].transferTaxRate.toFixed(2)}% of the property value.
              </p>
              <p>
                <strong>Common closing costs include:</strong>
              </p>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Lender Fees:</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Loan origination fee (typically 0.5-1% of loan amount)</li>
                    <li>Application fee</li>
                    <li>Credit report fee</li>
                    <li>Underwriting fee</li>
                    <li>Loan processing fee</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Third-Party Fees:</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Appraisal fee</li>
                    <li>Home inspection fee</li>
                    <li>Title search and insurance</li>
                    <li>Survey fee</li>
                    <li>Attorney fees</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Government Fees:</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Recording fees</li>
                    <li>Transfer taxes</li>
                    <li>Property tax prepayments</li>
                  </ul>
                </div>
              </div>
              <p>
                <strong>Who pays closing costs?</strong> Typically the buyer pays most closing costs, but some may be negotiable with the seller.
              </p>
              <p>
                <strong>How to reduce closing costs:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Shop around for lenders and service providers</li>
                <li>Ask for seller concessions</li>
                <li>Close at the end of the month</li>
                <li>Look for lender credits (in exchange for a higher interest rate)</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </SimpleFullScreenDialog>
    </div>
  );
};
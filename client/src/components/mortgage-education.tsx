import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  BookText,
  FileText, 
  PiggyBank,
  Home,
  Calculator,
  Clock,
  Landmark,
  BarChart4
} from 'lucide-react';

interface MortgageGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

const MortgageEducation: React.FC = () => {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const mortgageGuides: MortgageGuide[] = [
    {
      id: 'mortgage-basics',
      title: 'Mortgage Basics',
      description: 'Learn the fundamentals of mortgages and home loans',
      icon: <Home className="h-5 w-5" />,
      difficulty: 'beginner',
      estimatedTime: '5 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What is a Mortgage?</h3>
          <p>
            A mortgage is a loan used to purchase or maintain a home, land, or other types of real estate. The borrower agrees to pay the lender over time, typically in a series of regular payments that are divided into principal and interest. The property serves as collateral to secure the loan.
          </p>
          
          <h3 className="text-lg font-semibold">Key Mortgage Terms</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Principal:</strong> The original amount borrowed from the lender
            </li>
            <li>
              <strong>Interest:</strong> The cost of borrowing the principal, expressed as a percentage
            </li>
            <li>
              <strong>Down Payment:</strong> The initial upfront payment you make when purchasing a home (typically 3-20% of the purchase price)
            </li>
            <li>
              <strong>Loan Term:</strong> The length of time you have to repay the loan (commonly 15 or 30 years)
            </li>
            <li>
              <strong>Fixed-Rate Mortgage:</strong> A mortgage with an interest rate that remains the same for the entire term
            </li>
            <li>
              <strong>Adjustable-Rate Mortgage (ARM):</strong> A mortgage with an interest rate that can change periodically
            </li>
          </ul>
          
          <h3 className="text-lg font-semibold">How Mortgages Work</h3>
          <p>
            When you get a mortgage, your lender gives you a set amount of money to buy the home. You agree to pay back your loan – with interest – over a period of several years. The lender holds the deed until the mortgage is fully paid off. If you fail to pay the mortgage, the lender can take possession of the property through foreclosure.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-800 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              Quick Tips for First-Time Homebuyers
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Get pre-approved before house hunting</li>
              <li>Save for a down payment of at least 20% to avoid PMI</li>
              <li>Check your credit score and improve it if needed</li>
              <li>Consider all costs beyond the mortgage (taxes, insurance, maintenance)</li>
              <li>Compare offers from multiple lenders</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'types-of-mortgages',
      title: 'Types of Mortgages',
      description: 'Explore different mortgage options and which might be right for you',
      icon: <Landmark className="h-5 w-5" />,
      difficulty: 'beginner',
      estimatedTime: '7 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Common Types of Mortgages</h3>
          
          <div className="space-y-3">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Conventional Loans</h4>
              <p className="text-sm mt-1">
                Not insured or guaranteed by the government. Can be conforming (meet Fannie Mae and Freddie Mac requirements) or non-conforming (jumbo loans).
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Higher credit requirements</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Usually requires 3-20% down</Badge>
              </div>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">FHA Loans</h4>
              <p className="text-sm mt-1">
                Insured by the Federal Housing Administration. Designed for borrowers with lower credit scores or smaller down payments.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Lower credit requirements</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Down payment as low as 3.5%</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Mortgage insurance required</Badge>
              </div>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">VA Loans</h4>
              <p className="text-sm mt-1">
                Guaranteed by the Department of Veterans Affairs. Available to eligible service members, veterans, and their spouses.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">No down payment required</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">No mortgage insurance</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Limited to eligible veterans</Badge>
              </div>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">USDA Loans</h4>
              <p className="text-sm mt-1">
                Guaranteed by the U.S. Department of Agriculture. Designed for rural and some suburban homebuyers.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">No down payment required</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Income limits apply</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">Rural/suburban areas only</Badge>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">Fixed vs. Adjustable Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Fixed-Rate Mortgages</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Interest rate remains constant throughout the loan term</li>
                <li>Predictable monthly payments</li>
                <li>Higher initial rates than ARMs</li>
                <li>Good for long-term homeowners</li>
                <li>Common terms: 15, 20, and 30 years</li>
              </ul>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Adjustable-Rate Mortgages (ARMs)</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Rate changes periodically after initial fixed period</li>
                <li>Lower initial rates than fixed-rate loans</li>
                <li>Payment can increase significantly over time</li>
                <li>Good for short-term homeowners</li>
                <li>Common types: 5/1, 7/1, 10/1 ARM</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              Which Mortgage Type Is Right For You?
            </h4>
            <p className="text-sm mt-1 text-amber-800">
              The best mortgage type depends on your financial situation, how long you plan to stay in the home, and current market conditions. If you plan to stay in your home long-term and prefer predictable payments, a fixed-rate mortgage is likely the better choice. If you plan to move within a few years or expect your income to increase, an ARM might save you money.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'mortgage-approval-process',
      title: 'The Mortgage Approval Process',
      description: 'Step-by-step guide to getting approved for a mortgage',
      icon: <CheckCircle2 className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '6 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">The Path to Mortgage Approval</h3>
          
          <div className="relative border-l-2 border-muted-foreground/30 pl-6 pb-2 space-y-6">
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">1</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Check Your Credit</h4>
              <p className="text-sm mt-1">
                Review your credit reports and scores. Good credit (usually 620+) is essential for favorable mortgage terms. Higher scores (740+) receive the best rates.
              </p>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Do this 6-12 months before applying
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">2</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Determine Your Budget</h4>
              <p className="text-sm mt-1">
                Calculate how much house you can afford. As a rule of thumb, your monthly housing costs should not exceed 28% of your gross monthly income.
              </p>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calculator className="h-3 w-3" /> Include taxes, insurance, and other housing costs
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">3</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Get Pre-Approved</h4>
              <p className="text-sm mt-1">
                Submit financial documents to a lender for review. The lender will verify your information and issue a pre-approval letter stating how much they're willing to lend you.
              </p>
              <div className="mt-2 bg-green-50/80 dark:bg-green-950/30 p-3 rounded-md text-sm border border-green-100 dark:border-green-800">
                <strong>Documents you'll need:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Proof of income (pay stubs, tax returns)</li>
                  <li>Employment verification</li>
                  <li>Proof of assets (bank statements)</li>
                  <li>Identification (driver's license, social security number)</li>
                  <li>Debt information (credit cards, student loans, etc.)</li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">4</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Shop for a Home & Make an Offer</h4>
              <p className="text-sm mt-1">
                With pre-approval in hand, find a home within your budget and make an offer. Once accepted, proceed to formal mortgage application.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">5</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Loan Processing & Underwriting</h4>
              <p className="text-sm mt-1">
                The lender verifies all information, orders an appraisal, and checks title. The underwriter reviews everything to make the final lending decision.
              </p>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Typically takes 30-45 days
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-xs text-white font-bold">6</div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Closing</h4>
              <p className="text-sm mt-1">
                Sign final paperwork, pay closing costs, and receive the keys to your new home. Closing costs typically range from 2-5% of the loan amount.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-800 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              Tips for a Smooth Approval Process
            </h4>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Don't make major purchases or apply for new credit during the mortgage process</li>
              <li>Maintain stable employment and income</li>
              <li>Respond quickly to lender requests for additional documentation</li>
              <li>Keep detailed records of all financial transactions</li>
              <li>Consider paying down high-interest debt before applying</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'understanding-mortgage-rates',
      title: 'Understanding Mortgage Rates',
      description: 'Factors that influence mortgage rates and how they affect your loan',
      icon: <BarChart4 className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '8 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What Determines Mortgage Rates?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Economic Factors</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Federal Reserve monetary policy</li>
                <li>Inflation rates</li>
                <li>Economic growth</li>
                <li>Employment data</li>
                <li>Housing market conditions</li>
                <li>Bond market movements (especially 10-year Treasury yields)</li>
              </ul>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Personal Factors</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Credit score (higher scores = lower rates)</li>
                <li>Loan-to-value ratio (LTV)</li>
                <li>Down payment amount</li>
                <li>Loan term (15-year vs. 30-year)</li>
                <li>Loan type (conventional, FHA, VA, etc.)</li>
                <li>Property type and location</li>
                <li>Debt-to-income ratio (DTI)</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">How Rates Impact Your Mortgage</h3>
          <p className="text-sm">
            Even small changes in interest rates can have a significant impact on your monthly payment and the total interest paid over the life of the loan. Here's how different rates affect a $300,000 loan:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="py-2 px-4 text-left text-sm font-medium">Interest Rate</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Monthly Payment (30-yr)</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Total Interest Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                <tr>
                  <td className="py-2 px-4 text-sm">3.5%</td>
                  <td className="py-2 px-4 text-sm">$1,347</td>
                  <td className="py-2 px-4 text-sm">$184,968</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">4.0%</td>
                  <td className="py-2 px-4 text-sm">$1,432</td>
                  <td className="py-2 px-4 text-sm">$215,609</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">4.5%</td>
                  <td className="py-2 px-4 text-sm">$1,520</td>
                  <td className="py-2 px-4 text-sm">$247,220</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">5.0%</td>
                  <td className="py-2 px-4 text-sm">$1,610</td>
                  <td className="py-2 px-4 text-sm">$279,767</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">5.5%</td>
                  <td className="py-2 px-4 text-sm">$1,703</td>
                  <td className="py-2 px-4 text-sm">$313,212</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">6.0%</td>
                  <td className="py-2 px-4 text-sm">$1,799</td>
                  <td className="py-2 px-4 text-sm">$347,515</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">6.5%</td>
                  <td className="py-2 px-4 text-sm">$1,896</td>
                  <td className="py-2 px-4 text-sm">$382,623</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-lg font-semibold">Strategies for Getting the Best Rate</h3>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-800 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              Strategies for Getting the Best Rate
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Improve your credit score</strong> – Pay down debt, check for errors on your credit report, and make all payments on time</li>
              <li><strong>Save for a larger down payment</strong> – Aim for 20% or more to avoid PMI and possibly qualify for a lower rate</li>
              <li><strong>Shop around</strong> – Get quotes from at least 3-5 lenders to compare rates and terms</li>
              <li><strong>Consider paying points</strong> – Upfront fees that can lower your interest rate (1 point = 1% of loan amount)</li>
              <li><strong>Choose a shorter loan term</strong> – 15-year mortgages typically have lower rates than 30-year mortgages</li>
              <li><strong>Lock in your rate</strong> – Once you find a good rate, consider locking it in to protect against increases</li>
              <li><strong>Time your application</strong> – Try to apply when rates are trending downward (though this can be difficult to predict)</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              Should You Wait for Lower Rates?
            </h4>
            <p className="text-sm mt-1 text-amber-800">
              Trying to time the market is risky. If you need a home now and find one you can afford, it may be better to proceed rather than wait for potentially lower rates. Remember, you can always refinance if rates drop significantly in the future.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'mortgage-costs-beyond-principal-interest',
      title: 'Mortgage Costs Beyond Principal & Interest',
      description: 'Hidden costs and expenses to prepare for when buying a home',
      icon: <PiggyBank className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '5 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Understanding PITI</h3>
          <p>
            Your monthly mortgage payment typically consists of four components, often abbreviated as PITI:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-xs font-bold">P</div>
                Principal
              </h4>
              <p className="text-sm mt-1">
                The repayment of the original loan amount. In the early years of a mortgage, a smaller portion of your payment goes toward principal.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-xs font-bold">I</div>
                Interest
              </h4>
              <p className="text-sm mt-1">
                The cost of borrowing money, calculated as a percentage of the remaining loan balance. Early payments are mostly interest.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-xs font-bold">T</div>
                Taxes
              </h4>
              <p className="text-sm mt-1">
                Property taxes assessed by your local government. Often collected monthly by your lender and held in escrow until due.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-xs font-bold">I</div>
                Insurance
              </h4>
              <p className="text-sm mt-1">
                Homeowners insurance and, if required, private mortgage insurance (PMI). Also usually collected and held in escrow.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">One-Time Closing Costs</h3>
          <p className="text-sm">
            Beyond your down payment, expect to pay 2-5% of your loan amount in closing costs, which may include:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="py-2 px-4 text-left text-sm font-medium">Fee Type</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Typical Cost</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                <tr>
                  <td className="py-2 px-4 text-sm">Loan Origination Fee</td>
                  <td className="py-2 px-4 text-sm">0.5-1% of loan amount</td>
                  <td className="py-2 px-4 text-sm">Fee charged by the lender to process your loan application</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Appraisal Fee</td>
                  <td className="py-2 px-4 text-sm">$300-$500</td>
                  <td className="py-2 px-4 text-sm">Cost of determining the home's market value</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Home Inspection</td>
                  <td className="py-2 px-4 text-sm">$300-$500</td>
                  <td className="py-2 px-4 text-sm">Fee for professional inspection of the home's condition</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Title Search & Insurance</td>
                  <td className="py-2 px-4 text-sm">$500-$1,000</td>
                  <td className="py-2 px-4 text-sm">Protection against property ownership disputes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Attorney Fees</td>
                  <td className="py-2 px-4 text-sm">$500-$1,000</td>
                  <td className="py-2 px-4 text-sm">Legal fees for reviewing contracts and handling closing</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Recording Fees</td>
                  <td className="py-2 px-4 text-sm">$25-$250</td>
                  <td className="py-2 px-4 text-sm">Government fees for officially recording the new deed</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm">Prepaid Costs</td>
                  <td className="py-2 px-4 text-sm">Varies</td>
                  <td className="py-2 px-4 text-sm">Property taxes, homeowners insurance, and interest paid in advance</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-lg font-semibold">Ongoing Homeownership Costs</h3>
          <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800 space-y-3">
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Maintenance & Repairs</h4>
              <p className="text-sm mt-1">
                Budget 1-3% of your home's value annually for maintenance and unexpected repairs. Older homes typically require more maintenance.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Utilities</h4>
              <p className="text-sm mt-1">
                Water, electricity, gas, trash removal, etc. These costs vary by region, home size, and efficiency.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400">HOA Fees</h4>
              <p className="text-sm mt-1">
                If applicable, Homeowners Association fees can range from $100 to $700+ monthly, depending on the community and amenities.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400">Home Improvements</h4>
              <p className="text-sm mt-1">
                Renovations or upgrades to maintain or increase your home's value are additional costs to consider.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-800 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              Planning for Total Housing Costs
            </h4>
            <p className="text-sm mt-1">
              A good rule of thumb is to keep your total housing costs (PITI plus utilities and maintenance) below 30-35% of your gross monthly income to ensure you can comfortably afford your home long-term.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'mortgage-refinancing',
      title: 'Mortgage Refinancing',
      description: 'When and why to refinance your mortgage',
      icon: <FileText className="h-5 w-5" />,
      difficulty: 'advanced',
      estimatedTime: '6 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What is Refinancing?</h3>
          <p>
            Mortgage refinancing is the process of replacing your existing mortgage with a new one, typically to secure better terms or access equity in your home. The new loan pays off the old one, and you begin making payments on the new loan.
          </p>
          
          <h3 className="text-lg font-semibold">Common Reasons to Refinance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Lower Your Interest Rate</h4>
              <p className="text-sm mt-1">
                If market rates have dropped significantly since you got your mortgage, refinancing could reduce your rate and monthly payment.
              </p>
              <div className="mt-2 text-xs">
                <strong>Rule of thumb:</strong> Consider refinancing if you can reduce your interest rate by at least 0.5-1 percentage point.
              </div>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Change Your Loan Term</h4>
              <p className="text-sm mt-1">
                Refinance to a shorter term (e.g., 30-year to 15-year) to pay off your mortgage faster and save on interest, or to a longer term to reduce monthly payments.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Switch Loan Types</h4>
              <p className="text-sm mt-1">
                Convert from an adjustable-rate mortgage (ARM) to a fixed-rate mortgage for more payment stability, or vice versa.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Cash-Out Refinance</h4>
              <p className="text-sm mt-1">
                Borrow against your home's equity by taking out a new mortgage for more than you currently owe and receiving the difference in cash.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Remove PMI</h4>
              <p className="text-sm mt-1">
                If your home has appreciated or you've paid down enough of your mortgage, refinancing may allow you to eliminate private mortgage insurance.
              </p>
            </div>
            
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400">Consolidate Debt</h4>
              <p className="text-sm mt-1">
                Use a cash-out refinance to pay off high-interest debt like credit cards or personal loans, potentially saving on interest.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">The Refinancing Process</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li className="text-sm">
              <strong>Assess your goals and financial situation</strong> – Determine why you want to refinance and if it aligns with your long-term plans
            </li>
            <li className="text-sm">
              <strong>Check your credit score and home equity</strong> – Higher scores and more equity lead to better refinance terms
            </li>
            <li className="text-sm">
              <strong>Shop around for the best rates</strong> – Compare offers from multiple lenders, just as you would for an initial mortgage
            </li>
            <li className="text-sm">
              <strong>Apply for the new loan</strong> – Submit an application with your chosen lender
            </li>
            <li className="text-sm">
              <strong>Lock in your rate</strong> – Secure your interest rate to protect against market fluctuations
            </li>
            <li className="text-sm">
              <strong>Complete the underwriting process</strong> – The lender verifies your information, orders an appraisal, etc.
            </li>
            <li className="text-sm">
              <strong>Close on the new loan</strong> – Sign paperwork and pay closing costs
            </li>
          </ol>
          
          <h3 className="text-lg font-semibold">Is Refinancing Worth It?</h3>
          <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-medium text-green-700 dark:text-green-400">Break-Even Point Analysis</h4>
            <p className="text-sm mt-1">
              To determine if refinancing makes financial sense, calculate your break-even point:
            </p>
            <div className="p-3 bg-white rounded mt-2 text-sm">
              <strong>Break-Even Point = Total Closing Costs ÷ Monthly Savings</strong>
              <p className="mt-1 text-xs">
                For example, if refinancing costs $4,000 and saves you $200 per month, your break-even point is 20 months ($4,000 ÷ $200 = 20).
              </p>
            </div>
            <p className="text-sm mt-2">
              If you plan to stay in your home longer than the break-even point, refinancing may be worthwhile.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              Potential Drawbacks of Refinancing
            </h4>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-amber-800">
              <li>Closing costs (typically 2-5% of loan amount)</li>
              <li>Extending your loan term could mean paying more interest overall</li>
              <li>If you move before reaching the break-even point, you may lose money</li>
              <li>Cash-out refinancing increases your debt and could put your home at risk</li>
              <li>Potential tax implications (consult a tax professional)</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const getDifficultyBadge = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-green-200 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-green-300 text-green-800 hover:bg-green-300 border-green-400 dark:bg-green-900/70 dark:text-green-400 dark:border-green-700">Advanced</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-500 dark:border-green-400 shadow-md">
        <CardHeader className="bg-green-500 dark:bg-green-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mortgage Education Center
          </CardTitle>
          <CardDescription className="text-white/90">
            Essential guides and resources for first-time homebuyers and homeowners
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mortgageGuides.map((guide) => (
              <Card key={guide.id} className="border border-green-100 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="text-green-600 dark:text-green-500">
                      {guide.icon}
                    </div>
                    {guide.title}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <div>
                      {getDifficultyBadge(guide.difficulty)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {guide.estimatedTime} read
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800"
                        onClick={() => setOpenGuide(guide.id)}
                      >
                        Read Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          {guide.icon}
                          {guide.title}
                        </DialogTitle>
                        <div className="flex items-center justify-between mt-1.5 mb-1">
                          <span className="inline-block">
                            {getDifficultyBadge(guide.difficulty)}
                          </span>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {guide.estimatedTime} read
                          </div>
                        </div>
                      </DialogHeader>
                      
                      <ScrollArea className="mt-4 max-h-[60vh]">
                        <div className="p-1">
                          {guide.content}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 text-center text-sm text-muted-foreground">
          <div className="mx-auto flex items-center gap-2">
            <BookText className="h-4 w-4" />
            More educational resources will be added regularly to help you make informed decisions
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border-green-500 dark:border-green-400 shadow-md">
        <CardHeader className="bg-green-500/10 dark:bg-green-950/30 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about mortgages and home buying
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>How much house can I afford?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Most financial experts recommend following these guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Your monthly mortgage payment (including principal, interest, taxes, and insurance) should not exceed 28% of your gross monthly income.</li>
                  <li>Your total monthly debt payments (mortgage plus other debts like car loans, student loans, and credit cards) should not exceed 36% of your gross monthly income.</li>
                  <li>Consider saving at least 20% for a down payment to avoid private mortgage insurance (PMI).</li>
                  <li>Remember to budget for closing costs (2-5% of the purchase price), moving expenses, and ongoing maintenance.</li>
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the mortgage calculator above to estimate monthly payments for different loan amounts, interest rates, and terms.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>What's the difference between pre-qualification and pre-approval?</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Pre-Qualification</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Quick, informal process</li>
                      <li>Based on self-reported information about income, assets, and debt</li>
                      <li>No credit check required</li>
                      <li>Provides a rough estimate of how much you might be able to borrow</li>
                      <li>Not a commitment from the lender</li>
                      <li>Less valuable when making an offer on a home</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Pre-Approval</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>More formal, detailed process</li>
                      <li>Requires documentation of income, assets, and debt</li>
                      <li>Includes a full credit check</li>
                      <li>Results in a specific loan amount you're approved for</li>
                      <li>Written commitment from the lender (usually valid for 60-90 days)</li>
                      <li>Strengthens your offer when buying a home</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  Always get pre-approved before shopping for homes. Sellers and real estate agents take pre-approved buyers more seriously, and you'll have a clearer picture of your budget.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>Should I choose a fixed-rate or adjustable-rate mortgage?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    The choice depends on your specific situation and risk tolerance:
                  </p>
                  
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Fixed-Rate Mortgage Might Be Better If:</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>You plan to stay in the home for a long time (5+ years)</li>
                      <li>You prefer predictable monthly payments</li>
                      <li>Current interest rates are low</li>
                      <li>You have a low tolerance for financial risk</li>
                      <li>You're on a fixed income or tight budget</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Adjustable-Rate Mortgage (ARM) Might Be Better If:</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>You plan to move or refinance within 5-7 years</li>
                      <li>Current fixed rates are high and expected to decrease</li>
                      <li>You can handle potential payment increases</li>
                      <li>You want lower initial payments to qualify for a larger loan</li>
                      <li>Your income is likely to increase significantly in the future</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    Remember that with an ARM, your rate will adjust periodically after the initial fixed period (typically 3, 5, 7, or 10 years), which could result in higher or lower payments based on market conditions.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>What are points and should I pay them?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-sm">
                  Mortgage points (also called discount points) are fees you pay directly to the lender at closing in exchange for a reduced interest rate. One point equals one percent of your loan amount ($2,000 on a $200,000 mortgage).
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">When to Consider Paying Points:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>You plan to stay in the home long enough to recoup the cost through interest savings</li>
                    <li>You have extra cash available at closing</li>
                    <li>You want to lower your monthly payment</li>
                    <li>You're in a higher tax bracket (points may be tax-deductible)</li>
                  </ul>
                  
                  <h4 className="font-medium text-green-700 dark:text-green-400">When to Avoid Paying Points:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>You plan to move or refinance within a few years</li>
                    <li>You have limited cash for closing</li>
                    <li>You need the funds for other expenses (repairs, furniture, etc.)</li>
                    <li>The interest rate reduction is minimal</li>
                  </ul>
                </div>
                
                <div className="mt-3 p-3 bg-green-50/60 dark:bg-green-950/20 rounded text-sm border border-green-100 dark:border-green-800">
                  <strong>Calculate your break-even point:</strong> Divide the cost of the points by your monthly savings. For example, if one point costs $2,000 and saves you $30 per month, your break-even point is about 67 months ($2,000 ÷ $30 = 66.7). If you plan to stay in the home longer than that, paying points might make sense.
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>How can I improve my chances of getting approved for a mortgage?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                      Improve Your Credit Score
                    </h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>Pay all bills on time</li>
                      <li>Reduce credit card balances (aim for less than 30% of your available credit)</li>
                      <li>Don't close old credit accounts</li>
                      <li>Limit applications for new credit</li>
                      <li>Check your credit report for errors and dispute any inaccuracies</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                      Strengthen Your Financial Profile
                    </h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>Save for a larger down payment (20% is ideal to avoid PMI)</li>
                      <li>Pay down existing debt to improve your debt-to-income ratio</li>
                      <li>Maintain steady employment (lenders prefer at least 2 years at the same job)</li>
                      <li>Build an emergency fund (demonstrates financial responsibility)</li>
                      <li>Document all income and assets thoroughly</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                      During the Application Process
                    </h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>Shop around and compare offers from multiple lenders</li>
                      <li>Get pre-approved before house hunting</li>
                      <li>Be honest and thorough with your application information</li>
                      <li>Respond promptly to requests for additional documentation</li>
                      <li>Avoid major financial changes during the approval process (don't change jobs, make large purchases, or open new credit accounts)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                    <h4 className="font-medium flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      Consider Alternative Options
                    </h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-amber-800">
                      <li>If you have less-than-ideal credit, look into FHA loans (minimum credit score of 580 with 3.5% down)</li>
                      <li>If you're a veteran, explore VA loans (no down payment required for eligible veterans)</li>
                      <li>First-time homebuyer programs offered by states and local governments</li>
                      <li>Consider adding a co-signer with strong credit</li>
                      <li>Look at smaller homes or less expensive areas to start with</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border-green-200 dark:border-green-800">
              <AccordionTrigger>What documents do I need for a mortgage application?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    Be prepared to provide the following documentation when applying for a mortgage:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-400">Income Documentation</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Pay stubs from the last 30 days</li>
                        <li>W-2 forms from the last two years</li>
                        <li>Federal tax returns from the last two years</li>
                        <li>If self-employed: 1099 forms, profit & loss statements, and business tax returns</li>
                        <li>Proof of additional income (alimony, bonuses, etc.)</li>
                        <li>Employment verification letter</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-400">Asset Documentation</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Bank statements for the last 2-3 months</li>
                        <li>Investment/retirement account statements</li>
                        <li>Documentation for the source of your down payment</li>
                        <li>Gift letters (if receiving gift funds for down payment)</li>
                        <li>Proof of other real estate owned</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-400">Debt & Liability Documentation</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>List of all current debts and minimum payment amounts</li>
                        <li>Information about any previous bankruptcies or foreclosures</li>
                        <li>Rent payment history (if currently renting)</li>
                        <li>Alimony or child support payment information</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-400">Personal Documentation</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Government-issued ID (driver's license, passport)</li>
                        <li>Social Security number</li>
                        <li>Proof of residence</li>
                        <li>Marriage certificate, divorce decree, or separation agreement (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50/60 dark:bg-green-950/20 p-3 rounded border border-green-100 dark:border-green-800">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Property Information (once you've found a home)</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      <li>Purchase agreement/contract</li>
                      <li>Home insurance information</li>
                      <li>Property tax information</li>
                      <li>HOA documents (if applicable)</li>
                      <li>Appraisal and inspection reports</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Note: Lenders may request additional documentation based on your specific situation. Having all documents organized and readily available can help speed up the approval process.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageEducation;
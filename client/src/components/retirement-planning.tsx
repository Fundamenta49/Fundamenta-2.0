import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { 
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription
} from '@/components/ui/full-screen-dialog';
import { PiggyBank, BarChart2, BookOpen } from "lucide-react";

export default function RetirementPlanning() {
  // User inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [annualContribution, setAnnualContribution] = useState<number>(6000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [desiredIncome, setDesiredIncome] = useState<number>(60000);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  // Define the types for our projection data
  interface ProjectionData {
    age: number;
    savings: number;
    contribution: number;
    interest: number;
  }

  interface WithdrawalData {
    age: number;
    savings: number;
    withdrawal: number;
  }
  
  // Calculation results
  const [retirementResults, setRetirementResults] = useState({
    futureValue: 0,
    yearsToRetirement: 0,
    yearsInRetirement: 0,
    monthlyIncomeInRetirement: 0,
    inflationAdjustedMonthlyIncome: 0,
    savingsGap: 0,
    additionalMonthlySavingsNeeded: 0,
    projectedSavingsData: [] as ProjectionData[],
    withdrawalData: [] as WithdrawalData[],
  });
  
  // Calculate retirement projections when inputs change
  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, currentSavings, annualContribution, expectedReturn, inflationRate, desiredIncome, lifeExpectancy]);
  
  const calculateRetirement = () => {
    // Basic calculations
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Future value calculation with compound interest
    let futureValue = currentSavings;
    const realRate = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    
    // Generate projection data for chart
    const projectedSavingsData: ProjectionData[] = [];
    let yearlyContribution = annualContribution;
    let yearlyInterest = 0;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      // For the first year, just use current savings
      if (year === 0) {
        projectedSavingsData.push({
          age: currentAge,
          savings: Math.round(futureValue),
          contribution: 0,
          interest: 0,
        });
        continue;
      }
      
      // Apply some variability to create a more realistic curve
      // Annual returns fluctuate slightly to avoid perfectly straight growth
      const yearVariance = 0.7 + Math.random() * 0.6; // Random factor between 0.7 and 1.3
      const adjustedReturn = expectedReturn * yearVariance;
      
      // Calculate interest earned this year
      yearlyInterest = futureValue * (adjustedReturn / 100);
      
      // Add contributions and interest to future value
      futureValue = futureValue + yearlyInterest + yearlyContribution;
      
      // Occasionally have a slightly higher or lower contribution year
      // This creates a more natural curve with slight variability
      if (Math.random() > 0.75) {
        yearlyContribution = annualContribution * (0.9 + Math.random() * 0.2);
      } else {
        yearlyContribution = annualContribution;
      }
      
      projectedSavingsData.push({
        age: currentAge + year,
        savings: Math.round(futureValue),
        contribution: Math.round(yearlyContribution),
        interest: Math.round(yearlyInterest),
      });
    }
    
    // Calculate withdrawals in retirement
    const withdrawalRate = 0.04; // 4% rule
    const monthlyIncomeInRetirement = futureValue * withdrawalRate / 12;
    
    // Adjust for inflation
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const inflationAdjustedMonthlyIncome = monthlyIncomeInRetirement / inflationFactor;
    
    // Calculate savings gap
    const totalNeeded = (desiredIncome / withdrawalRate);
    const savingsGap = Math.max(0, totalNeeded - futureValue);
    
    // Calculate additional monthly savings needed
    const additionalSavingsNeeded = savingsGap > 0 ? savingsGap / (Math.pow(1 + expectedReturn / 100, yearsToRetirement) - 1) * (expectedReturn / 100) / 12 : 0;
    
    // Generate withdrawal data for retirement years
    const withdrawalData: WithdrawalData[] = [];
    let remainingSavings = futureValue;
    
    for (let year = 0; year <= yearsInRetirement; year++) {
      const age = retirementAge + year;
      // Only withdraw once retirement starts, and only withdraw what's available
      const annualWithdrawal = year === 0 ? 0 : Math.min(desiredIncome, remainingSavings * 0.04);
      
      if (year > 0) {
        // Adjust remaining savings based on returns and withdrawals
        // Clamp the value to prevent unrealistic projections
        const growthAmount = remainingSavings * (expectedReturn / 100);
        remainingSavings = Math.max(0, remainingSavings + growthAmount - annualWithdrawal);
        
        // If savings are depleted, make sure withdrawals reflect that reality
        if (remainingSavings <= 0) {
          remainingSavings = 0;
        }
      }
      
      withdrawalData.push({
        age,
        savings: Math.round(remainingSavings),
        withdrawal: Math.round(annualWithdrawal),
      });
    }
    
    setRetirementResults({
      futureValue,
      yearsToRetirement,
      yearsInRetirement,
      monthlyIncomeInRetirement,
      inflationAdjustedMonthlyIncome,
      savingsGap,
      additionalMonthlySavingsNeeded: additionalSavingsNeeded,
      projectedSavingsData,
      withdrawalData,
    });
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Dialog management
  const [activeDialog, setActiveDialog] = useState<'calculator' | 'projections' | 'resources' | null>(null);
  const openDialog = (dialog: 'calculator' | 'projections' | 'resources') => {
    setActiveDialog(dialog);
  };
  const closeDialog = () => {
    setActiveDialog(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDialog('calculator')}
        >
          <CardHeader className="pb-2">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full w-fit mb-2">
              <PiggyBank className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg text-green-700 dark:text-green-400">Retirement Calculator</CardTitle>
            <CardDescription>Plan your savings and forecast your retirement funds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estimate how much you'll need to save for a comfortable retirement based on your current situation and future goals.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">Open Calculator</Button>
          </CardFooter>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDialog('projections')}
        >
          <CardHeader className="pb-2">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full w-fit mb-2">
              <BarChart2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg text-green-700 dark:text-green-400">Savings Projections</CardTitle>
            <CardDescription>Visualize the growth of your retirement funds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See how your retirement savings will grow over time and plan for withdrawals during your retirement years.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">View Projections</Button>
          </CardFooter>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openDialog('resources')}
        >
          <CardHeader className="pb-2">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full w-fit mb-2">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg text-green-700 dark:text-green-400">Retirement Resources</CardTitle>
            <CardDescription>Learn about retirement accounts and strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore different retirement account options and learn strategies for maximizing your retirement savings.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">View Resources</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Calculator Dialog */}
      <FullScreenDialog open={activeDialog === 'calculator'} onOpenChange={closeDialog}>
        <FullScreenDialogContent>
          <FullScreenDialogHeader>
            <FullScreenDialogTitle className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-green-500" />
              Retirement Calculator
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              Plan your savings and forecast your retirement funds
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <FullScreenDialogBody>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-age">Current Age</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="current-age"
                            min={18}
                            max={80}
                            step={1}
                            value={[currentAge]}
                            onValueChange={(value) => setCurrentAge(value[0])}
                          />
                          <span className="w-12 text-right">{currentAge}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="retirement-age">Planned Retirement Age</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="retirement-age"
                            min={Math.max(currentAge + 1, 50)}
                            max={80}
                            step={1}
                            value={[retirementAge]}
                            onValueChange={(value) => setRetirementAge(value[0])}
                          />
                          <span className="w-12 text-right">{retirementAge}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="life-expectancy">Life Expectancy</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="life-expectancy"
                            min={Math.max(retirementAge + 1, 70)}
                            max={105}
                            step={1}
                            value={[lifeExpectancy]}
                            onValueChange={(value) => setLifeExpectancy(value[0])}
                          />
                          <span className="w-12 text-right">{lifeExpectancy}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Savings Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-savings">Current Retirement Savings</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">$0</span>
                          <Slider
                            id="current-savings"
                            min={0}
                            max={500000}
                            step={1000}
                            value={[currentSavings]}
                            onValueChange={(value) => setCurrentSavings(value[0])}
                          />
                          <span className="text-sm">$500k</span>
                        </div>
                        <Input
                          type="number"
                          value={currentSavings}
                          onChange={(e) => setCurrentSavings(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="annual-contribution">Annual Contribution</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">$0</span>
                          <Slider
                            id="annual-contribution"
                            min={0}
                            max={20000}
                            step={500}
                            value={[annualContribution]}
                            onValueChange={(value) => setAnnualContribution(value[0])}
                          />
                          <span className="text-sm">$20k</span>
                        </div>
                        <Input
                          type="number"
                          value={annualContribution}
                          onChange={(e) => setAnnualContribution(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Retirement Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="desired-income">Desired Annual Income in Retirement</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">$20k</span>
                          <Slider
                            id="desired-income"
                            min={20000}
                            max={200000}
                            step={5000}
                            value={[desiredIncome]}
                            onValueChange={(value) => setDesiredIncome(value[0])}
                          />
                          <span className="text-sm">$200k</span>
                        </div>
                        <Input
                          type="number"
                          value={desiredIncome}
                          onChange={(e) => setDesiredIncome(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Assumptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="expected-return">
                          Expected Average Annual Return (%)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">0%</span>
                          <Slider
                            id="expected-return"
                            min={0}
                            max={12}
                            step={0.5}
                            value={[expectedReturn]}
                            onValueChange={(value) => setExpectedReturn(value[0])}
                          />
                          <span className="text-sm">12%</span>
                        </div>
                        <Input
                          type="number"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          className="mt-1"
                          step={0.1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inflation-rate">
                          Expected Inflation Rate (%)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">0%</span>
                          <Slider
                            id="inflation-rate"
                            min={0}
                            max={8}
                            step={0.5}
                            value={[inflationRate]}
                            onValueChange={(value) => setInflationRate(value[0])}
                          />
                          <span className="text-sm">8%</span>
                        </div>
                        <Input
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="mt-1"
                          step={0.1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Results Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Projected Retirement Savings:</span>
                        <span className="font-bold">
                          {formatCurrency(retirementResults.futureValue)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Monthly Income in Retirement:</span>
                        <span className="font-bold">
                          {formatCurrency(retirementResults.monthlyIncomeInRetirement)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Inflation-Adjusted Monthly Income:</span>
                        <span className="font-bold">
                          {formatCurrency(retirementResults.inflationAdjustedMonthlyIncome)}
                        </span>
                      </div>
                      
                      {retirementResults.savingsGap > 0 && (
                        <>
                          <div className="flex justify-between text-amber-600">
                            <span>Savings Gap:</span>
                            <span className="font-bold">
                              {formatCurrency(retirementResults.savingsGap)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-amber-600">
                            <span>Additional Monthly Savings Needed:</span>
                            <span className="font-bold">
                              {formatCurrency(retirementResults.additionalMonthlySavingsNeeded)}
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Years Until Retirement:</span>
                          <span>{retirementResults.yearsToRetirement}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Expected Years in Retirement:</span>
                          <span>{retirementResults.yearsInRetirement}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </FullScreenDialogBody>
          
          <FullScreenDialogFooter>
            <Button variant="outline" onClick={closeDialog}>Close</Button>
          </FullScreenDialogFooter>
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Projections Dialog */}
      <FullScreenDialog open={activeDialog === 'projections'} onOpenChange={closeDialog}>
        <FullScreenDialogContent>
          <FullScreenDialogHeader>
            <FullScreenDialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-green-500" />
              Savings Projections
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              Visualize the growth of your retirement funds
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <FullScreenDialogBody>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={retirementResults.projectedSavingsData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Age', position: 'bottom', offset: 0 }} 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `$${value / 1000}k`} 
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `$${value.toLocaleString()}`, 
                            name === "savings" ? "Total Savings" : name
                          ]} 
                          labelFormatter={(label) => `Age: ${label}`}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px'
                          }}
                        />
                        <Legend iconType="circle" />
                        <Line 
                          type="monotone" 
                          dataKey="savings" 
                          name="Total Savings" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: 'white' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="contribution" 
                          name="Annual Contribution" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interest" 
                          name="Annual Interest" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: 'white' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Savings Withdrawal in Retirement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={retirementResults.withdrawalData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Age', position: 'bottom', offset: 0 }} 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `$${value / 1000}k`} 
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `$${value.toLocaleString()}`, 
                            name === "savings" ? "Remaining Savings" : name
                          ]} 
                          labelFormatter={(label) => `Age: ${label}`}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px'
                          }}
                        />
                        <Legend iconType="circle" />
                        <Line 
                          type="monotone" 
                          dataKey="savings" 
                          name="Remaining Savings" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: 'white' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={retirementResults.withdrawalData.filter(d => d.withdrawal > 0)}
                        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Age', position: 'bottom', offset: 0 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `$${value / 1000}k`}
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `$${value.toLocaleString()}`, 
                            name === "withdrawal" ? "Annual Withdrawal" : name
                          ]} 
                          labelFormatter={(label) => `Age: ${label}`}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px'
                          }}
                        />
                        <Legend iconType="circle" />
                        <Bar 
                          dataKey="withdrawal" 
                          name="Annual Withdrawal" 
                          fill="#a855f7"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Breakdown</CardTitle>
                  <p className="text-sm text-gray-500">Recommended Asset Allocation Based on Age</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Stocks', value: 100 - currentAge },
                              { name: 'Bonds', value: currentAge }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={30}
                            fill="#8884d8"
                            dataKey="value"
                            cornerRadius={4}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#3b82f6" name="Stocks" />
                            <Cell fill="#22c55e" name="Bonds" />
                          </Pie>
                          <Tooltip 
                            formatter={(value: number, name: string) => [`${value}%`, name]}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              padding: '10px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Guidelines for Age-Based Allocation</h3>
                      <p className="text-sm">
                        A common rule of thumb for asset allocation is to subtract your age from 100 to determine 
                        the percentage of your portfolio that should be in stocks.
                      </p>
                      <p className="text-sm">
                        At your current age of {currentAge}, you might consider allocating approximately:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li><span className="font-medium">{100 - currentAge}%</span> to stocks (higher risk, higher potential return)</li>
                        <li><span className="font-medium">{currentAge}%</span> to bonds (lower risk, more stable return)</li>
                      </ul>
                      <p className="text-sm mt-2">
                        Adjust this allocation based on your personal risk tolerance and financial goals.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FullScreenDialogBody>
          
          <FullScreenDialogFooter>
            <Button variant="outline" onClick={closeDialog}>Close</Button>
          </FullScreenDialogFooter>
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Resources Dialog */}
      <FullScreenDialog open={activeDialog === 'resources'} onOpenChange={closeDialog}>
        <FullScreenDialogContent>
          <FullScreenDialogHeader>
            <FullScreenDialogTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-green-500" />
              Retirement Resources
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              Learn about retirement accounts and strategies
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <FullScreenDialogBody>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Account Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">401(k) Plans</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium">Eligibility:</span> Employer-sponsored</li>
                        <li><span className="font-medium">Contribution Limit (2024):</span> $23,000</li>
                        <li><span className="font-medium">Catch-up (Age 50+):</span> Additional $7,500</li>
                        <li><span className="font-medium">Tax Treatment:</span> Pre-tax contributions, tax-deferred growth</li>
                        <li><span className="font-medium">Withdrawal Age:</span> 59½ (penalties may apply for earlier withdrawals)</li>
                        <li><span className="font-medium">Required Minimum Distributions:</span> Age 73</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">IRA (Individual Retirement Account)</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium">Eligibility:</span> Anyone with earned income</li>
                        <li><span className="font-medium">Contribution Limit (2024):</span> $7,000</li>
                        <li><span className="font-medium">Catch-up (Age 50+):</span> Additional $1,000</li>
                        <li><span className="font-medium">Tax Treatment:</span> Pre-tax contributions, tax-deferred growth</li>
                        <li><span className="font-medium">Withdrawal Age:</span> 59½ (penalties may apply for earlier withdrawals)</li>
                        <li><span className="font-medium">Required Minimum Distributions:</span> Age 73</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Roth IRA</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium">Eligibility:</span> Income restrictions apply</li>
                        <li><span className="font-medium">Contribution Limit (2024):</span> $7,000</li>
                        <li><span className="font-medium">Catch-up (Age 50+):</span> Additional $1,000</li>
                        <li><span className="font-medium">Tax Treatment:</span> After-tax contributions, tax-free growth and withdrawals</li>
                        <li><span className="font-medium">Withdrawal Age:</span> Contributions can be withdrawn anytime; earnings after 59½ and 5-year holding period</li>
                        <li><span className="font-medium">Required Minimum Distributions:</span> None</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Roth 401(k)</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium">Eligibility:</span> Employer-sponsored</li>
                        <li><span className="font-medium">Contribution Limit (2024):</span> $23,000</li>
                        <li><span className="font-medium">Catch-up (Age 50+):</span> Additional $7,500</li>
                        <li><span className="font-medium">Tax Treatment:</span> After-tax contributions, tax-free growth and withdrawals</li>
                        <li><span className="font-medium">Withdrawal Age:</span> 59½ and 5-year holding period (penalties may apply for earlier withdrawals)</li>
                        <li><span className="font-medium">Required Minimum Distributions:</span> None with rollover to Roth IRA</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Savings Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Early Career (20s - 30s)</h3>
                      <ul className="space-y-2 text-sm list-disc pl-4">
                        <li>Start early: Even small contributions benefit from decades of compound growth</li>
                        <li>Maximize employer match: Contribute at least enough to get the full match (it's free money)</li>
                        <li>Consider Roth accounts: Pay taxes now while you're likely in a lower tax bracket</li>
                        <li>Aggressive allocation: With decades until retirement, you can afford to be stock-heavy</li>
                        <li>Establish good savings habits: Aim to save 15-20% of income for retirement</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Mid-Career (40s - 50s)</h3>
                      <ul className="space-y-2 text-sm list-disc pl-4">
                        <li>Catch-up aggressively: These are often your highest earning years</li>
                        <li>Maximize tax-advantaged accounts: Contribute to 401(k), IRA, HSA if eligible</li>
                        <li>Reassess risk tolerance: Begin moderating portfolio risk as retirement approaches</li>
                        <li>Consider catch-up contributions: Available once you reach age 50</li>
                        <li>Review retirement income needs: Calculate what you'll need in retirement</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Pre-Retirement (5-10 years before)</h3>
                      <ul className="space-y-2 text-sm list-disc pl-4">
                        <li>Increase conservative allocations: Protect against market volatility</li>
                        <li>Max out all retirement accounts: Make final push to build savings</li>
                        <li>Pay down high-interest debt: Enter retirement with minimal debt obligations</li>
                        <li>Develop income strategy: Plan how you'll withdraw from accounts in retirement</li>
                        <li>Consider working longer: Even a year or two can significantly impact savings</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FullScreenDialogBody>
          
          <FullScreenDialogFooter>
            <Button variant="outline" onClick={closeDialog}>Close</Button>
          </FullScreenDialogFooter>
        </FullScreenDialogContent>
      </FullScreenDialog>
    </div>
  );
}
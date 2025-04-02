import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { BudgetData, SavingsGoal } from "@/components/budget-calculator";

interface FinancialDashboardProps {
  budgetData: BudgetData | null;
}

export default function FinancialDashboard({ budgetData }: FinancialDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // If no budget data is available, show a message to create one
  if (!budgetData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">No Financial Data Available</h2>
        <p className="text-gray-600 max-w-md">
          You haven't created a budget yet. Visit the Smart Budget Planner to create your budget and see your financial dashboard.
        </p>
      </div>
    );
  }

  const { income, expenses, remaining, expensePercentage, savingsGoals, retirementSavings } = budgetData;

  // Transform expense data for charts
  const expenseData = expenses.map((expense) => ({
    name: expense.category,
    value: expense.amount,
  }));

  // Create expense by category data for pie chart
  const expenseByCategory = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(
      (item) => item.name === expense.category
    );
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Mock historical data for line chart
  const monthlyData = [
    { name: "Jan", income: income * 0.9, expenses: income * 0.7, savings: income * 0.2 },
    { name: "Feb", income: income * 0.95, expenses: income * 0.8, savings: income * 0.15 },
    { name: "Mar", income: income * 0.97, expenses: income * 0.75, savings: income * 0.22 },
    { name: "Apr", income: income * 1.0, expenses: income - remaining, savings: remaining },
    { name: "May", income: income * 1.0, expenses: income * 0.7, savings: income * 0.3 },
    { name: "Jun", income: income * 1.05, expenses: income * 0.65, savings: income * 0.4 },
  ];

  // Financial health score calculation (simple example)
  const savingsRatio = remaining / income;
  const hasEmergencyFund = savingsGoals.some((goal) => 
    goal.name.toLowerCase().includes("emergency") && goal.currentAmount >= goal.targetAmount * 0.5
  );
  const debtToIncomeRatio = 0.3; // Mock value
  
  // Calculate score (0-100)
  const financialHealthScore = Math.round(
    (savingsRatio * 40) + // 40% of score based on savings ratio
    (hasEmergencyFund ? 30 : 0) + // 30% based on emergency fund
    ((1 - debtToIncomeRatio) * 30) // 30% based on debt-to-income ratio
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${income.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">${(income - remaining).toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Remaining/Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">${remaining.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="relative h-48 w-48 mb-4">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{financialHealthScore}</span>
                  <span className="text-sm text-gray-500">out of 100</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Score", value: financialHealthScore },
                        { name: "Remaining", value: 100 - financialHealthScore }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell key="cell-0" fill={
                        financialHealthScore >= 80 ? "#22c55e" : 
                        financialHealthScore >= 60 ? "#84cc16" : 
                        financialHealthScore >= 40 ? "#eab308" : 
                        "#ef4444"
                      } />
                      <Cell key="cell-1" fill="#f3f4f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                {financialHealthScore >= 80 ? (
                  <p className="text-green-600">Great! Your finances are in excellent shape.</p>
                ) : financialHealthScore >= 60 ? (
                  <p className="text-green-500">Your finances are healthy, but there's room for improvement.</p>
                ) : financialHealthScore >= 40 ? (
                  <p className="text-amber-500">You're on the right track, but should focus on improving your financial health.</p>
                ) : (
                  <p className="text-red-500">Your financial health needs attention. Consider reducing expenses and increasing savings.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: "This Month", income, expenses: income - remaining, savings: remaining }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Legend />
                  <Bar dataKey="income" fill="#8884d8" name="Income" />
                  <Bar dataKey="expenses" fill="#ff8042" name="Expenses" />
                  <Bar dataKey="savings" fill="#82ca9d" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value}`}
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {expenses.map((expense, i) => (
                  <li key={i} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">{expense.category}</span>
                    <span className="text-red-500">${expense.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {savingsGoals.length === 0 ? (
                  <p>No savings goals yet. Add some in the Budget Planner!</p>
                ) : (
                  savingsGoals.map((goal, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{goal.name}</span>
                        <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Current Retirement Savings</h3>
                  <p className="text-2xl font-bold">${retirementSavings.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Monthly Contribution</h3>
                  <p className="text-xl">${(remaining * 0.15).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Recommended: 15% of remaining budget</p>
                </div>
                
                <Button className="w-full">Set Retirement Goals</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Trends (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#ff8042" name="Expenses" />
                  <Line type="monotone" dataKey="savings" stroke="#82ca9d" name="Savings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your savings rate is {Math.round((remaining / income) * 100)}% of your income.</li>
                <li>Your largest expense category is {expenseByCategory.length > 0 ? expenseByCategory.sort((a, b) => b.value - a.value)[0].name : "N/A"}.</li>
                <li>You're {savingsRatio >= 0.2 ? "on track" : "below target"} for recommended savings (20% of income).</li>
                <li>Your debt-to-income ratio is {Math.round(debtToIncomeRatio * 100)}%, which is {debtToIncomeRatio <= 0.36 ? "healthy" : "higher than recommended"}.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
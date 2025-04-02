import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface BudgetData {
  income: number;
  expenses: BudgetItem[];
  totalExpenses: number;
  remaining: number;
  expensePercentage: number;
  retirementSavings: number;
  savingsGoals: SavingsGoal[];
}

interface BudgetCalculatorProps {
  onBudgetUpdate?: (data: BudgetData) => void;
}

const STORAGE_KEY = 'budget_calculator_data';

export default function BudgetCalculator({ onBudgetUpdate }: BudgetCalculatorProps) {
  // Initialize state from localStorage or default values
  const [income, setIncome] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.income || 0;
    }
    return 0;
  });

  const [newCategory, setNewCategory] = useState<string>("");
  const [expenses, setExpenses] = useState<BudgetItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.expenses || [
        { id: "1", category: "Housing", amount: 0 },
        { id: "2", category: "Transportation", amount: 0 },
        { id: "3", category: "Food", amount: 0 },
        { id: "4", category: "Utilities", amount: 0 },
        { id: "5", category: "Healthcare", amount: 0 },
      ];
    }
    return [
      { id: "1", category: "Housing", amount: 0 },
      { id: "2", category: "Transportation", amount: 0 },
      { id: "3", category: "Food", amount: 0 },
      { id: "4", category: "Utilities", amount: 0 },
      { id: "5", category: "Healthcare", amount: 0 },
    ];
  });

  const [retirementSavings, setRetirementSavings] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.retirementSavings || 0;
    }
    return 0;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.savingsGoals || [];
    }
    return [];
  });

  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState<number>(0);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = income - totalExpenses - retirementSavings;
  const expensePercentage = income > 0 ? (totalExpenses / income) * 100 : 0;

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const budgetData = {
      income,
      expenses,
      totalExpenses,
      remaining,
      expensePercentage,
      retirementSavings,
      savingsGoals,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));

    if (onBudgetUpdate) {
      onBudgetUpdate(budgetData);
    }
  }, [income, expenses, totalExpenses, remaining, expensePercentage, retirementSavings, savingsGoals, onBudgetUpdate]);

  const handleExpenseChange = (id: string, value: string) => {
    setExpenses(expenses.map(expense =>
      expense.id === id
        ? { ...expense, amount: parseFloat(value) || 0 }
        : expense
    ));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const newId = String(Date.now());
    setExpenses([
      ...expenses,
      { id: newId, category: newCategory, amount: 0 }
    ]);
    setNewCategory("");
  };

  const removeCategory = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addSavingsGoal = () => {
    if (!newGoalName.trim() || newGoalAmount <= 0) return;

    const newGoal: SavingsGoal = {
      id: String(Date.now()),
      name: newGoalName,
      targetAmount: newGoalAmount,
      currentAmount: 0,
    };

    setSavingsGoals([...savingsGoals, newGoal]);
    setNewGoalName("");
    setNewGoalAmount(0);
  };

  const updateSavingsGoal = (id: string, field: "currentAmount" | "targetAmount", value: number) => {
    setSavingsGoals(savingsGoals.map(goal =>
      goal.id === id
        ? { ...goal, [field]: value }
        : goal
    ));
  };

  const removeSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Label htmlFor="income">Monthly Income</Label>
            <Input
              id="income"
              type="number"
              value={income || ""}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your monthly income"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New expense category"
            />
            <Button
              onClick={addCategory}
              disabled={!newCategory.trim()}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center gap-2">
              <Label className="min-w-[150px]">{expense.category}</Label>
              <Input
                type="number"
                value={expense.amount || ""}
                onChange={(e) => handleExpenseChange(expense.id, e.target.value)}
                placeholder={`Enter ${expense.category.toLowerCase()} expenses`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCategory(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Goal name (e.g., Car, House)"
            />
            <Input
              type="number"
              value={newGoalAmount || ""}
              onChange={(e) => setNewGoalAmount(parseFloat(e.target.value) || 0)}
              placeholder="Target amount"
            />
          </div>
          <Button
            onClick={addSavingsGoal}
            disabled={!newGoalName.trim() || newGoalAmount <= 0}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Savings Goal
          </Button>

          {savingsGoals.map((goal) => (
            <div key={goal.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{goal.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSavingsGoal(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Current Amount:</Label>
                  <Input
                    type="number"
                    value={goal.currentAmount || ""}
                    onChange={(e) => updateSavingsGoal(goal.id, "currentAmount", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Target Amount:</Label>
                  <Input
                    type="number"
                    value={goal.targetAmount || ""}
                    onChange={(e) => updateSavingsGoal(goal.id, "targetAmount", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Progress 
                  value={(goal.currentAmount / goal.targetAmount) * 100} 
                  className="h-2" 
                />
                <p className="text-sm text-right text-muted-foreground">
                  {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% Complete
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Savings Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="min-w-[150px]">Retirement Savings</Label>
            <Input
              type="number"
              value={retirementSavings || ""}
              onChange={(e) => setRetirementSavings(parseFloat(e.target.value) || 0)}
              placeholder="Enter monthly retirement savings"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Budget Used</span>
              <span className="font-semibold">
                {expensePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={expensePercentage} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-destructive">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remaining >= 0 ? "text-green-500" : "text-destructive"
                }`}
              >
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-blue-500">
                ${retirementSavings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Retirement Savings</p>
              <p className="text-2xl font-bold text-purple-500">
                ${retirementSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
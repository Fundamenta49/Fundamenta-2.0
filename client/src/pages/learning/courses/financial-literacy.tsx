import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen, Calculator, CreditCard, LineChart, Wallet, DollarSign, PiggyBank, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ModuleProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export default function FinancialLiteracyCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("learn");

  // Course modules with content
  const COURSE_MODULES: ModuleProps[] = [
    {
      id: "fundamentals",
      title: "Financial Fundamentals",
      description: "Understanding the basics of personal finance",
      icon: Wallet,
      content: (
        <div className="space-y-4">
          <p>
            Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. This module will introduce you to the fundamental concepts of personal finance.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Why Financial Literacy Matters</h3>
          <p>
            Being financially literate helps you to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make informed financial decisions</li>
            <li>Manage debt effectively</li>
            <li>Plan for both short and long-term financial goals</li>
            <li>Prepare for emergencies and unexpected expenses</li>
            <li>Build wealth and secure your financial future</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Core Financial Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money received through wages, investments, or other sources.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-green-600" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money spent on needs, wants, and financial obligations.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <PiggyBank className="h-4 w-4 mr-2 text-green-600" />
                  Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money set aside for future use or emergencies.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2 text-green-600" />
                  Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Assets acquired with the goal of generating income or appreciation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "budgeting",
      title: "Budgeting Basics",
      description: "Learn to create and maintain a personal budget",
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <p>
            A budget is a plan that helps you track your income and expenses over a specific period. 
            Creating and maintaining a budget is one of the most important financial skills you can develop.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The 50/30/20 Rule</h3>
          <p>
            One popular budgeting framework is the 50/30/20 rule, which suggests allocating your after-tax income as follows:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">50% for Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Essentials like housing, utilities, groceries, transportation, and minimum debt payments.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">30% for Wants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Non-essentials like dining out, entertainment, hobbies, and subscriptions.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">20% for Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Savings, investments, and additional debt payments beyond the minimum.</p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Steps to Create a Budget</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Track your income:</strong> Calculate your total monthly income after taxes.</li>
            <li><strong>List all expenses:</strong> Record all your spending for at least one month.</li>
            <li><strong>Categorize expenses:</strong> Group expenses into needs, wants, and savings.</li>
            <li><strong>Set goals:</strong> Establish specific financial goals for the short and long term.</li>
            <li><strong>Create the budget:</strong> Allocate your income according to your priorities and goals.</li>
            <li><strong>Adjust as needed:</strong> Review and refine your budget regularly.</li>
          </ol>
        </div>
      ),
    },
    {
      id: "credit",
      title: "Understanding Credit",
      description: "Learn about credit scores, loans, and managing debt",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p>
            Credit plays a significant role in your financial life, affecting everything from loan approval to interest rates. 
            Understanding how credit works is essential for making informed financial decisions.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Credit Scores Explained</h3>
          <p>
            A credit score is a three-digit number that represents your creditworthiness. The most common scoring models range from 300 to 850, with higher scores indicating lower credit risk.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Factors Affecting Your Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Payment history (35%):</strong> Whether you've paid on time</li>
                  <li><strong>Credit utilization (30%):</strong> How much of your available credit you're using</li>
                  <li><strong>Length of credit history (15%):</strong> How long you've had credit</li>
                  <li><strong>Credit mix (10%):</strong> The variety of credit accounts you have</li>
                  <li><strong>New credit (10%):</strong> Recently opened accounts and credit inquiries</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Credit Score Ranges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge className="bg-red-500">300-579</Badge>
                  <span className="ml-2">Poor</span>
                </div>
                <div>
                  <Badge className="bg-orange-500">580-669</Badge>
                  <span className="ml-2">Fair</span>
                </div>
                <div>
                  <Badge className="bg-yellow-500">670-739</Badge>
                  <span className="ml-2">Good</span>
                </div>
                <div>
                  <Badge className="bg-green-500">740-799</Badge>
                  <span className="ml-2">Very Good</span>
                </div>
                <div>
                  <Badge className="bg-emerald-500">800-850</Badge>
                  <span className="ml-2">Excellent</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Practical Tips for Building Credit</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pay bills on time:</strong> Set up automatic payments or reminders to avoid late payments.</li>
            <li><strong>Keep credit card balances low:</strong> Aim to use less than 30% of your available credit.</li>
            <li><strong>Don't close old accounts:</strong> Length of credit history matters.</li>
            <li><strong>Limit new credit applications:</strong> Each application can temporarily lower your score.</li>
            <li><strong>Check your credit reports regularly:</strong> Look for errors and dispute them if necessary.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "investing",
      title: "Investing Basics",
      description: "Introduction to investing concepts and strategies",
      icon: LineChart,
      content: (
        <div className="space-y-4">
          <p>
            Investing is how you make your money work for you, potentially growing your wealth over time. 
            While investing involves risk, understanding the basics can help you make informed decisions.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Key Investment Principles</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Start early:</strong> Time in the market is one of the most powerful factors due to compound growth.</li>
            <li><strong>Diversify:</strong> Spread your investments across different asset classes to reduce risk.</li>
            <li><strong>Understand risk vs. return:</strong> Higher potential returns typically come with higher risk.</li>
            <li><strong>Invest regularly:</strong> Consistent investing over time can help smooth out market fluctuations.</li>
            <li><strong>Keep costs low:</strong> Investment fees can significantly impact your returns over time.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Common Investment Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Ownership shares in individual companies. Higher potential return but also higher risk and volatility.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bonds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Loans to companies or governments. Generally lower risk and return than stocks, providing regular income.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mutual Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Professionally managed pools of stocks, bonds, or other securities. Provides diversification and professional management.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ETFs (Exchange-Traded Funds)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Similar to mutual funds but traded like stocks. Often have lower fees and more tax efficiency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  // Render the selected module content
  const renderModuleContent = (moduleId: string) => {
    const module = COURSE_MODULES.find((m) => m.id === moduleId);
    if (!module) return null;
    
    const Icon = module.icon;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Icon className="h-6 w-6 mr-2 text-green-600" />
          <h2 className="text-xl font-semibold">{module.title}</h2>
        </div>
        {module.content}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-green-500" />
          Financial Literacy
        </h1>
      </div>

      <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Financial Literacy</CardTitle>
              <CardDescription>
                Master essential financial concepts to build a secure future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Financial literacy provides the knowledge and skills necessary to make informed and effective decisions 
                about money management. Whether you're just starting your financial journey or looking to strengthen 
                your financial foundation, this course will help you develop the skills to navigate today's complex 
                financial landscape.
              </p>
              <p className="mb-4">
                From creating a budget to understanding credit to planning for the future, you'll learn practical 
                strategies you can implement immediately to improve your financial well-being.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`#${module.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Icon className="h-5 w-5 mr-2 text-green-500" />
                      {module.title}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2">
                      {typeof module.content === 'string' 
                        ? module.content 
                        : 'Explore key concepts and practical applications.'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {/* Module content sections */}
          {COURSE_MODULES.map((module) => (
            <div key={module.id} id={module.id} className="mt-10 pt-6 border-t">
              {renderModuleContent(module.id)}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="practice" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Literacy Quiz</CardTitle>
              <CardDescription>
                Test your knowledge of key financial concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Take this quiz to assess your understanding of financial literacy concepts. 
                Each question has one correct answer. Choose the best option for each question.
              </p>
              
              {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
              <div className="mt-8 hidden sm:block">
                <Button className="w-full sm:w-auto">
                  Ask Learning Coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
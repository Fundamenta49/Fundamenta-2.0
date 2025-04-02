import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Apple,
  ClipboardList,
  Info,
  Book,
  Utensils,
  Wheat,
  Fish,
  Egg,
  Milk,
  Carrot,
  Coffee,
  Salad,
  BarChart4,
  Leaf
} from "lucide-react";
import NutritionAssessment from "@/components/nutrition-assessment";

// Nutrition Guide Component
function NutritionGuideContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Book className="h-5 w-5 mr-2 text-purple-500" />
          Nutrition Basics
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Understanding the foundation of good nutrition helps you make better food choices every day.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-purple-400">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-purple-500" />
                Macronutrients
              </h4>
              <p className="text-xs text-gray-600">
                Carbohydrates, proteins, and fats are the three main macronutrients that provide energy and support bodily functions.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-400">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-purple-500" />
                Micronutrients
              </h4>
              <p className="text-xs text-gray-600">
                Vitamins and minerals are essential in smaller amounts for health, immunity, and preventing deficiencies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <BarChart4 className="h-5 w-5 mr-2 text-purple-500" />
          Food Groups
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          A balanced diet includes foods from all major groups in appropriate proportions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Wheat className="h-4 w-4 mr-1 text-amber-500" />
                Grains
              </h4>
              <p className="text-xs text-gray-600">
                Whole grains provide energy, fiber, and essential nutrients. Aim to make half your grains whole.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Carrot className="h-4 w-4 mr-1 text-orange-500" />
                Vegetables
              </h4>
              <p className="text-xs text-gray-600">
                Diverse in color and nutrients, vegetables should fill a large portion of your plate.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Apple className="h-4 w-4 mr-1 text-red-500" />
                Fruits
              </h4>
              <p className="text-xs text-gray-600">
                Sweet natural treats packed with vitamins, minerals, and fiber. Aim for 2-4 servings daily.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Milk className="h-4 w-4 mr-1 text-blue-400" />
                Dairy
              </h4>
              <p className="text-xs text-gray-600">
                Good sources of calcium and protein. Look for low-fat or non-fat options when possible.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Fish className="h-4 w-4 mr-1 text-indigo-500" />
                Protein
              </h4>
              <p className="text-xs text-gray-600">
                Essential for building and repairing tissues. Choose lean meats, seafood, beans, nuts, and seeds.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-purple-100">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Coffee className="h-4 w-4 mr-1 text-yellow-700" />
                Beverages
              </h4>
              <p className="text-xs text-gray-600">
                Water is essential. Limit sugary drinks and alcohol. Unsweetened coffee and tea can be part of a healthy diet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Salad className="h-5 w-5 mr-2 text-green-500" />
          Healthy Eating Patterns
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          How you eat is just as important as what you eat. Focus on balanced meals and mindful eating.
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
          <li>Eat regular meals and snacks to maintain energy</li>
          <li>Incorporate a variety of foods in each meal</li>
          <li>Practice portion control using your hand as a guide</li>
          <li>Listen to your body's hunger and fullness cues</li>
          <li>Slow down and savor your food without distractions</li>
          <li>Stay hydrated throughout the day</li>
        </ul>
      </div>
    </div>
  );
}

export default function IntegratedNutrition() {
  const [activeTab, setActiveTab] = useState<string>("guide");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Apple className="h-5 w-5 text-purple-500" />
            <span>Nutrition</span>
          </CardTitle>
          <CardDescription>
            Learn about nutrition and get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="guide"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="guide">
                <Apple className="h-4 w-4 mr-2" />
                <span className="inline">Nutrition Guide</span>
              </TabsTrigger>
              <TabsTrigger value="assessment">
                <ClipboardList className="h-4 w-4 mr-2" />
                <span className="inline">Nutrition Assessment</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <NutritionGuideContent />
            </TabsContent>

            <TabsContent value="assessment">
              <NutritionAssessment />
            </TabsContent>
          </Tabs>

          {activeTab === "guide" && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => setActiveTab("assessment")}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Start Assessment
              </Button>
            </div>
          )}
          
          <Alert className="mt-4 bg-purple-50 border-purple-200">
            <Info className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700">
              This nutrition information is for educational purposes only. Always consult healthcare professionals for personalized dietary advice.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
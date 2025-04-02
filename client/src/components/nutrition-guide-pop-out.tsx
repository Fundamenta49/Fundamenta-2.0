import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Apple, Utensils, Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionGuide from "./nutrition-guide";
import NutritionAssessment from "./nutrition-assessment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NutritionGuidePopOut() {
  const [activeTab, setActiveTab] = useState("guide");

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Apple className="h-6 w-6 text-purple-500" />
          Nutrition Center
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about healthy eating, get personalized assessments, and create meal plans
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Tabs defaultValue="guide" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span>Nutrition Guide</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Nutrition Assessment</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="text-xl">Nutrition Guide</CardTitle>
                <CardDescription>
                  Learn about healthy eating habits and nutrition fundamentals
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <NutritionGuide />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessment">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="text-xl">Personalized Nutrition Assessment</CardTitle>
                <CardDescription>
                  Get customized recommendations based on your body metrics, goals, and preferences
                </CardDescription>
                <Alert variant="default" className="mt-2 border-purple-500 bg-purple-50">
                  <AlertDescription className="text-purple-800 text-sm">
                    This assessment tool uses the USDA FoodData Central database along with AI-powered recommendations. Always consult with healthcare professionals for medical advice.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent className="px-0">
                <NutritionAssessment />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FullScreenDialogBody>
    </div>
  );
}
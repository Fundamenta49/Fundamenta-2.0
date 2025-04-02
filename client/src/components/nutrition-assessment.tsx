import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Apple, Utensils, Calendar, AlertCircle, ListChecks, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { cn } from "@/lib/utils";

// Types for the assessment form
interface NutritionAssessmentInput {
  age: number;
  gender: string;
  heightFeet: number; // feet
  heightInches: number; // inches
  weight: number; // in lbs
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  existingConditions: string[];
  currentDiet: {
    mealFrequency: number;
    typicalFoods: string[];
    restrictions: string[];
    otherRestriction?: string;
    supplements: string[];
  };
}

// Types for the assessment results
interface NutritionMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  weightCategory: string;
}

interface NutritionRecommendations {
  summary: string;
  macronutrients: {
    protein: string;
    carbs: string;
    fat: string;
  };
  micronutrients: string[];
  mealTiming: string;
  mealPlan: {
    day1: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
    day2: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
    day3: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
  };
  foodGroups: {
    increase: string[];
    decrease: string[];
  };
  dietaryChanges: string[];
  supplements: string[];
  hydration: string;
  longTermStrategy: string;
}

interface NutritionAssessmentResult {
  metrics: NutritionMetrics;
  recommendations: NutritionRecommendations;
}

// Initial state for the assessment form
const initialAssessmentState: NutritionAssessmentInput = {
  age: 25,
  gender: "female",
  heightFeet: 5, // feet
  heightInches: 6, // inches
  weight: 154, // lbs
  activityLevel: "lightly active",
  dietaryPreferences: [],
  healthGoals: [],
  existingConditions: [],
  currentDiet: {
    mealFrequency: 3,
    typicalFoods: [],
    restrictions: [],
    otherRestriction: '',
    supplements: [],
  },
};

// Options for the form selects
const dietaryPreferenceOptions = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-free",
  "Dairy-free",
  "Low carb",
  "High protein",
];

const healthGoalOptions = [
  "Weight loss",
  "Weight gain",
  "Muscle building",
  "Improved energy",
  "Better sleep",
  "Digestive health",
  "Heart health",
  "Blood sugar management",
  "Reduce inflammation",
  "General wellness",
];

const conditionOptions = [
  "None",
  "Diabetes",
  "Hypertension",
  "Heart disease",
  "Celiac disease",
  "IBS/IBD",
  "Food allergies",
  "Lactose intolerance",
  "Thyroid issues",
  "Kidney disease",
  "Arthritis",
];

const foodRestrictionOptions = [
  "None",
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts",
  "Soy",
  "Fish",
  "Shellfish",
  "Red meat",
  "Nightshades",
  "FODMAPs",
  "Added sugars",
  "Other",
];

const typicalFoodOptions = [
  "Fast food",
  "Processed/Packaged foods",
  "Homemade meals",
  "Fresh fruits",
  "Vegetables",
  "Whole grains",
  "Red meat",
  "Poultry",
  "Fish",
  "Beans/Legumes",
  "Dairy products",
  "Plant-based proteins",
];

const supplementOptions = [
  "None",
  "Multivitamin",
  "Vitamin D",
  "Vitamin B12",
  "Iron",
  "Calcium",
  "Omega-3",
  "Probiotics",
  "Protein powder",
  "Pre-workout",
  "Creatine",
];

export default function NutritionAssessment() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [assessment, setAssessment] = useState<NutritionAssessmentInput>(initialAssessmentState);
  const [results, setResults] = useState<NutritionAssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("summary");

  const totalSteps = 4;
  
  const updateAssessment = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setAssessment(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(parentObj as object),
            [child]: value
          }
        };
      });
    } else {
      setAssessment(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleArrayUpdate = (key: string, value: string, isChecked: boolean) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setAssessment(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        const currentArray = [...((parentObj as any)[child] as string[])];
        
        if (isChecked && !currentArray.includes(value)) {
          currentArray.push(value);
        } else if (!isChecked && currentArray.includes(value)) {
          const index = currentArray.indexOf(value);
          currentArray.splice(index, 1);
        }
        
        return {
          ...prev,
          [parent]: {
            ...(parentObj as object),
            [child]: currentArray
          }
        };
      });
    } else {
      setAssessment(prev => {
        const currentArray = [...prev[key as keyof typeof prev] as string[]];
        
        if (isChecked && !currentArray.includes(value)) {
          currentArray.push(value);
        } else if (!isChecked && currentArray.includes(value)) {
          const index = currentArray.indexOf(value);
          currentArray.splice(index, 1);
        }
        
        return {
          ...prev,
          [key]: currentArray
        };
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          assessment.age > 0 &&
          assessment.gender !== "" &&
          assessment.heightFeet > 0 &&
          assessment.weight > 0 &&
          assessment.activityLevel !== ""
        );
      case 2:
        return assessment.dietaryPreferences.length > 0 && assessment.healthGoals.length > 0;
      case 3:
        return assessment.currentDiet.mealFrequency > 0 && assessment.currentDiet.typicalFoods.length > 0;
      default:
        return true;
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/nutrition/assessment', assessment);
      setResults(response.data);
      setCurrentStep(5); // Move to results step
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate nutrition recommendations');
      console.error('Assessment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Apple className="h-5 w-5 text-purple-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Let's start with some basic information about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={assessment.age === 0 ? '' : assessment.age}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      updateAssessment('age', value);
                    }}
                    min={1}
                    max={120}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={assessment.gender} 
                    onValueChange={(value) => updateAssessment('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Height</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heightFeet">Feet</Label>
                    <Input
                      id="heightFeet"
                      type="number"
                      value={assessment.heightFeet === 0 ? '' : assessment.heightFeet}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        updateAssessment('heightFeet', value);
                      }}
                      min={1}
                      max={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heightInches">Inches</Label>
                    <Input
                      id="heightInches"
                      type="number"
                      value={assessment.heightInches === 0 ? '' : assessment.heightInches}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        updateAssessment('heightInches', value);
                      }}
                      min={0}
                      max={11}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={assessment.weight === 0 ? '' : assessment.weight}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      updateAssessment('weight', value);
                    }}
                    min={1}
                    max={500}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select 
                  value={assessment.activityLevel} 
                  onValueChange={(value) => updateAssessment('activityLevel', value)}
                >
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="lightly active">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very active">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extra active">Extra active (very hard exercise & physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        );
        
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Utensils className="h-5 w-5 text-purple-500" />
                Dietary Preferences & Goals
              </CardTitle>
              <CardDescription>
                Tell us about your eating style and health objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Dietary Preferences (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryPreferenceOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`diet-${option}`} 
                        checked={assessment.dietaryPreferences.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('dietaryPreferences', option, checked === true)}
                      />
                      <label
                        htmlFor={`diet-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Health Goals (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthGoalOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`goal-${option}`} 
                        checked={assessment.healthGoals.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('healthGoals', option, checked === true)}
                      />
                      <label
                        htmlFor={`goal-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Existing Health Conditions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {conditionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`condition-${option}`} 
                        checked={assessment.existingConditions.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('existingConditions', option, checked === true)}
                      />
                      <label
                        htmlFor={`condition-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        );
        
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Current Diet
              </CardTitle>
              <CardDescription>
                Tell us about your current eating habits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mealFrequency">How many meals do you typically eat per day?</Label>
                <Select 
                  value={assessment.currentDiet.mealFrequency.toString()} 
                  onValueChange={(value) => updateAssessment('currentDiet.mealFrequency', parseInt(value))}
                >
                  <SelectTrigger id="mealFrequency">
                    <SelectValue placeholder="Select meal frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'meal' : 'meals'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>What types of foods do you typically eat? (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {typicalFoodOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`food-${option}`} 
                        checked={assessment.currentDiet.typicalFoods.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.typicalFoods', option, checked === true)}
                      />
                      <label
                        htmlFor={`food-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Dietary Restrictions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {foodRestrictionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`restriction-${option}`} 
                        checked={assessment.currentDiet.restrictions.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.restrictions', option, checked === true)}
                      />
                      <label
                        htmlFor={`restriction-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                
                {assessment.currentDiet.restrictions.includes("Other") && (
                  <div className="pt-2">
                    <Label htmlFor="otherRestriction">Please specify your other dietary restriction:</Label>
                    <Input
                      id="otherRestriction"
                      type="text"
                      placeholder="Enter your specific restriction"
                      className="mt-1"
                      value={assessment.currentDiet.otherRestriction || ""}
                      onChange={(e) => updateAssessment('currentDiet.otherRestriction', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </>
        );
        
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-purple-500" />
                Supplements & Review
              </CardTitle>
              <CardDescription>
                Tell us about any supplements you take and review your assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Supplements (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {supplementOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`supplement-${option}`} 
                        checked={assessment.currentDiet.supplements.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.supplements', option, checked === true)}
                      />
                      <label
                        htmlFor={`supplement-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-md font-medium mb-2">Assessment Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Age:</span> {assessment.age}</p>
                  <p><span className="font-medium">Gender:</span> {assessment.gender}</p>
                  <p><span className="font-medium">Height:</span> {assessment.heightFeet}' {assessment.heightInches}"</p>
                  <p><span className="font-medium">Weight:</span> {assessment.weight} lbs</p>
                  <p><span className="font-medium">Activity Level:</span> {assessment.activityLevel}</p>
                  <p><span className="font-medium">Dietary Preferences:</span> {assessment.dietaryPreferences.join(', ') || 'None specified'}</p>
                  <p><span className="font-medium">Health Goals:</span> {assessment.healthGoals.join(', ') || 'None specified'}</p>
                  <p><span className="font-medium">Health Conditions:</span> {assessment.existingConditions.length ? assessment.existingConditions.join(', ') : 'None'}</p>
                  <p><span className="font-medium">Meals per day:</span> {assessment.currentDiet.mealFrequency}</p>
                  <p><span className="font-medium">Typical Foods:</span> {assessment.currentDiet.typicalFoods.join(', ') || 'None specified'}</p>
                  <p><span className="font-medium">Restrictions:</span> {
                    assessment.currentDiet.restrictions.length 
                      ? (
                          assessment.currentDiet.restrictions.join(', ') + 
                          (assessment.currentDiet.restrictions.includes("Other") && assessment.currentDiet.otherRestriction 
                            ? ` (Other: ${assessment.currentDiet.otherRestriction})` 
                            : '')
                        ) 
                      : 'None'
                  }</p>
                  <p><span className="font-medium">Supplements:</span> {assessment.currentDiet.supplements.length ? assessment.currentDiet.supplements.join(', ') : 'None'}</p>
                </div>
              </div>
              
              <Alert variant="default" className="mt-4 border-purple-500 bg-purple-50">
                <AlertCircle className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-purple-800 text-sm">
                  This assessment will generate personalized nutrition recommendations based on your input. These are general suggestions, not medical advice.
                </AlertDescription>
              </Alert>
            </CardContent>
          </>
        );
        
      case 5:
        if (!results) {
          return (
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
                <p className="text-lg font-medium">Something went wrong</p>
                <p className="text-sm text-gray-500 mt-1">
                  We couldn't generate your nutrition recommendations.
                </p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => setCurrentStep(1)}
                >
                  Start Over
                </Button>
              </div>
            </CardContent>
          );
        }
        
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Apple className="h-5 w-5 text-purple-500" />
                Your Nutrition Assessment
              </CardTitle>
              <CardDescription>
                Personalized nutrition recommendations based on your inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-purple-700 font-medium">BMI</p>
                  <p className="text-xl font-bold">{results.metrics.bmi.toFixed(1)}</p>
                  <p className="text-xs text-purple-600">{results.metrics.weightCategory}</p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-purple-700 font-medium">BMR</p>
                  <p className="text-xl font-bold">{Math.round(results.metrics.bmr)}</p>
                  <p className="text-xs text-purple-600">calories/day</p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-purple-700 font-medium">TDEE</p>
                  <p className="text-xl font-bold">{Math.round(results.metrics.tdee)}</p>
                  <p className="text-xs text-purple-600">calories/day</p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-purple-700 font-medium">Weight</p>
                  <p className="text-xl font-bold">{assessment.weight}</p>
                  <p className="text-xs text-purple-600">lbs</p>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="mealplan">Meal Plan</TabsTrigger>
                  <TabsTrigger value="strategy">Strategy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Nutritional Status</h3>
                    <p className="text-sm">{results.recommendations.summary}</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Key Dietary Changes</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.dietaryChanges.map((change, index) => (
                        <li key={index} className="text-sm">{change}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="nutrition" className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Macronutrients</h3>
                    <dl className="space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Protein:</dt>
                        <dd className="text-sm">{results.recommendations.macronutrients.protein}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Carbohydrates:</dt>
                        <dd className="text-sm">{results.recommendations.macronutrients.carbs}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Fat:</dt>
                        <dd className="text-sm">{results.recommendations.macronutrients.fat}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Key Micronutrients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.micronutrients.map((nutrient, index) => (
                        <li key={index} className="text-sm">{nutrient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <h3 className="text-lg font-medium mb-2">Increase</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.recommendations.foodGroups.increase.map((food, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border">
                      <h3 className="text-lg font-medium mb-2">Decrease</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.recommendations.foodGroups.decrease.map((food, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="mealplan" className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Meal Timing</h3>
                    <p className="text-sm">{results.recommendations.mealTiming}</p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="day1">
                      <AccordionTrigger className="text-md font-medium">Day 1</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Breakfast</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day1.breakfast}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Lunch</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day1.lunch}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Dinner</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day1.dinner}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Snacks</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.recommendations.mealPlan.day1.snacks.map((snack, index) => (
                              <li key={index} className="text-sm">{snack}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="day2">
                      <AccordionTrigger className="text-md font-medium">Day 2</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Breakfast</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day2.breakfast}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Lunch</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day2.lunch}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Dinner</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day2.dinner}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Snacks</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.recommendations.mealPlan.day2.snacks.map((snack, index) => (
                              <li key={index} className="text-sm">{snack}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="day3">
                      <AccordionTrigger className="text-md font-medium">Day 3</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Breakfast</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day3.breakfast}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Lunch</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day3.lunch}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Dinner</h4>
                          <p className="text-sm">{results.recommendations.mealPlan.day3.dinner}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Snacks</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.recommendations.mealPlan.day3.snacks.map((snack, index) => (
                              <li key={index} className="text-sm">{snack}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="strategy" className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Supplements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.supplements.map((supplement, index) => (
                        <li key={index} className="text-sm">{supplement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Hydration</h3>
                    <p className="text-sm">{results.recommendations.hydration}</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Long-Term Strategy</h3>
                    <p className="text-sm">{results.recommendations.longTermStrategy}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="w-full border-purple-200">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {currentStep < 5 && (
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
            <p className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</p>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      )}
      
      {renderStepContent()}
      
      {currentStep < 5 && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={submitAssessment}
              disabled={isSubmitting || !validateStep(currentStep)}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Processing</span>
                  <span className="animate-spin">
                    <Clock className="h-4 w-4" />
                  </span>
                </>
              ) : 'Generate Recommendations'}
            </Button>
          )}
        </CardFooter>
      )}
      
      {currentStep === 5 && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            Start New Assessment
          </Button>
          
          <Button onClick={() => window.print()}>
            Print Results
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
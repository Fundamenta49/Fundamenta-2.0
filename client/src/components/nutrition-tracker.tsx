import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Plus, UploadCloud, Utensils, Target, History } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NutritionGoal {
  dailyCalories: number;
  dailyCarbs: number;
}

interface FoodEntry {
  id: string;
  timestamp: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  calories: number;
  carbs: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  name: string;
  description?: string;
  servingUnit?: string;
  servingQty?: number;
  servingWeight?: number;
  aiAnalyzed: boolean;
  dataSource?: string;
}

export default function NutritionTracker() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [goals, setGoals] = useState<NutritionGoal>({
    dailyCalories: 2000,
    dailyCarbs: 250,
  });
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [manualEntry, setManualEntry] = useState({
    name: "",
    calories: "",
    carbs: "",
  });

  const { toast } = useToast();
    
  const analyzeMutation = useMutation({
    mutationFn: async (image: File) => {
      try {
        console.log("Sending image for analysis...");
        const formData = new FormData();
        formData.append("image", image);
        
        // Use a direct fetch call instead of apiRequest to bypass JSON parsing
        const response = await fetch("/api/nutrition/analyze-food", {
          method: "POST",
          body: formData,
          // Don't set Content-Type header, let the browser set it with boundary for multipart/form-data
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Failed to analyze food image");
        }
        
        const data = await response.json();
        console.log("Analysis result:", data);
        return data;
      } catch (error) {
        console.error("Error in analyze mutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Successfully analyzed food:", data);
      addFoodEntry({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: previewUrl || undefined,
        thumbnailUrl: data.thumbnailUrl,
        calories: data.calories,
        carbs: data.carbs,
        protein: data.protein,
        fat: data.fat,
        fiber: data.fiber,
        sugar: data.sugar,
        name: data.foodName,
        description: data.description,
        servingUnit: data.servingUnit,
        servingQty: data.servingQty,
        servingWeight: data.servingWeight,
        aiAnalyzed: true,
        dataSource: data.source || 'openai'
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      
      toast({
        title: "Food analyzed!",
        description: `Added ${data.foodName} to your food log${data.source === 'nutritionix' ? ' (Nutritionix data)' : ''}`,
        variant: "default"
      });
    },
    onError: (error) => {
      console.error("Food analysis failed:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze food image",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFoodEntry = (entry: FoodEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFoodEntry({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      calories: Number(manualEntry.calories),
      carbs: Number(manualEntry.carbs),
      name: manualEntry.name,
      aiAnalyzed: false,
    });
    setManualEntry({ name: "", calories: "", carbs: "" });
  };

  const getTodaysTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries
      .filter(entry => entry.timestamp.startsWith(today))
      .reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.calories,
          carbs: acc.carbs + entry.carbs,
        }),
        { calories: 0, carbs: 0 }
      );
  };

  const totals = getTodaysTotals();

  return (
    <div className="space-y-6">
      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Nutrition Goals
          </CardTitle>
          <CardDescription>Set and track your daily nutrition targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Daily Calorie Goal</Label>
            <Input
              type="number"
              value={goals.dailyCalories}
              onChange={(e) =>
                setGoals((prev) => ({
                  ...prev,
                  dailyCalories: Number(e.target.value),
                }))
              }
            />
            <Progress value={(totals.calories / goals.dailyCalories) * 100} />
            <p className="text-sm text-muted-foreground">
              {totals.calories} / {goals.dailyCalories} calories
            </p>
          </div>

          <div className="space-y-2">
            <Label>Daily Carbs Goal (g)</Label>
            <Input
              type="number"
              value={goals.dailyCarbs}
              onChange={(e) =>
                setGoals((prev) => ({
                  ...prev,
                  dailyCarbs: Number(e.target.value),
                }))
              }
            />
            <Progress value={(totals.carbs / goals.dailyCarbs) * 100} />
            <p className="text-sm text-muted-foreground">
              {totals.carbs} / {goals.dailyCarbs}g carbs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            AI Food Analysis
          </CardTitle>
          <CardDescription>
            Upload a photo of your food for automatic nutrition analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Food preview"
                  className="max-w-full h-auto rounded-lg"
                />
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => analyzeMutation.mutate(selectedImage!)}
                    disabled={analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? "Analyzing..." : "Analyze Food"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
                <label className="mt-4 block">
                  <Button variant="outline" className="relative">
                    Choose Image
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </label>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a clear photo of your food
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Manual Entry
          </CardTitle>
          <CardDescription>
            Manually log your food and nutrition information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Food Name</Label>
              <Input
                value={manualEntry.name}
                onChange={(e) =>
                  setManualEntry((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter food name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={manualEntry.calories}
                  onChange={(e) =>
                    setManualEntry((prev) => ({
                      ...prev,
                      calories: e.target.value,
                    }))
                  }
                  placeholder="Enter calories"
                />
              </div>
              <div className="space-y-2">
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  value={manualEntry.carbs}
                  onChange={(e) =>
                    setManualEntry((prev) => ({ ...prev, carbs: e.target.value }))
                  }
                  placeholder="Enter carbs"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Today's Food Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {entries
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-lg">{entry.name}</CardTitle>
                        </div>
                        {entry.aiAnalyzed && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            AI Analyzed
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {entry.description}
                        </p>
                      )}
                      
                      {entry.servingQty && entry.servingUnit && (
                        <p className="text-xs text-muted-foreground mb-2">
                          Serving size: {entry.servingQty} {entry.servingUnit} 
                          {entry.servingWeight && ` (${entry.servingWeight}g)`}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-medium text-sm">{entry.calories}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                          <p className="font-medium text-sm">{entry.carbs}g</p>
                        </div>
                        {entry.protein && (
                          <div>
                            <p className="text-xs text-muted-foreground">Protein</p>
                            <p className="font-medium text-sm">{entry.protein}g</p>
                          </div>
                        )}
                        {entry.fat && (
                          <div>
                            <p className="text-xs text-muted-foreground">Fat</p>
                            <p className="font-medium text-sm">{entry.fat}g</p>
                          </div>
                        )}
                        {entry.fiber && (
                          <div>
                            <p className="text-xs text-muted-foreground">Fiber</p>
                            <p className="font-medium text-sm">{entry.fiber}g</p>
                          </div>
                        )}
                        {entry.sugar && (
                          <div>
                            <p className="text-xs text-muted-foreground">Sugar</p>
                            <p className="font-medium text-sm">{entry.sugar}g</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {entry.dataSource && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            Source: {entry.dataSource === 'nutritionix' ? 'Nutritionix' : 'AI Estimate'}
                          </span>
                        )}
                      </div>
                      
                      {/* Use the Nutritionix thumbnail if available, otherwise use the uploaded image */}
                      {(entry.thumbnailUrl || entry.imageUrl) && (
                        <img
                          src={entry.thumbnailUrl || entry.imageUrl}
                          alt={entry.name}
                          className="mt-2 rounded-lg w-full h-32 object-cover"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

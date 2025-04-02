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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  MapPin,
  TrendingDown,
  AlertCircle,
  X,
  Utensils,
  ChefHat,
  Clock,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StoreComparison {
  storeName: string;
  distance: string;
  prices: {
    item: string;
    price: number;
    deal?: string;
  }[];
}

const mealPrepTips = [
  {
    title: "Prep Basics",
    tips: [
      "Choose 2-3 proteins to cook",
      "Roast multiple vegetables at once",
      "Cook grains in bulk",
      "Use similar ingredients across meals",
      "Store properly in airtight containers"
    ]
  },
  {
    title: "Time-Saving Tricks",
    tips: [
      "Chop vegetables in advance",
      "Use sheet pan meals",
      "Cook proteins in slow cooker",
      "Prepare overnight oats",
      "Use mason jar salads"
    ]
  }
];

export default function ShoppingBuddy() {
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [storeComparisons, setStoreComparisons] = useState<StoreComparison[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [storeError, setStoreError] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [groceryPreferences, setGroceryPreferences] = useState({
    diet: "",
    budget: "",
    meals: 0,
    restrictions: ""
  });

  const [generatedList, setGeneratedList] = useState<{
    items: Array<{ name: string; estimatedCost: number }>;
    totalCost: number;
    suggestions: string[];
  }>({
    items: [],
    totalCost: 0,
    suggestions: []
  });
  
  // Recipe suggestions state
  const [recipeSuggestions, setRecipeSuggestions] = useState<Array<{
    id?: number;
    title: string;
    image?: string;
    description?: string;
    usedIngredientCount?: number;
    missedIngredientCount?: number;
    usedIngredients: string[];
    missedIngredients: string[];
    likes?: number;
  }>>([]);
  
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [recipeError, setRecipeError] = useState("");

  const commonProducts = [
    "Milk", "Bread", "Eggs", "Chicken", "Rice",
    "Pasta", "Apples", "Bananas", "Tomatoes", "Potatoes",
    "Onions", "Cheese", "Yogurt", "Coffee", "Cereal"
  ];

  const searchNearbyStores = async (latitude: number, longitude: number) => {
    setIsLoadingStores(true);
    setStoreError("");

    try {
      // Call our API endpoint to get nearby stores with product prices
      const response = await fetch('/api/shopping/nearby-stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          products: selectedProducts.length > 0 ? selectedProducts : commonProducts
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch store data');
      }

      const data = await response.json();
      
      // If the response has a stores property, use it; otherwise assume the whole response is the stores array
      const stores = data.stores || data;
      
      if (!Array.isArray(stores)) {
        throw new Error('Invalid store data format');
      }
      
      setStoreComparisons(stores);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setStoreError("Failed to fetch nearby stores. Please try again.");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleLocationSearch = (manualLocation: string) => {
    setLocation(manualLocation);
    // In a real app, we would geocode the address here
    // For now, just simulate some coordinates
    searchNearbyStores(37.7749, -122.4194);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        searchNearbyStores(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please enter it manually.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const generateGroceryList = async () => {
    try {
      // Show loading state
      setGeneratedList({
        items: [],
        totalCost: 0,
        suggestions: ['Generating your personalized grocery list...']
      });
      
      // Call our new API endpoint
      const response = await fetch('/api/shopping/generate-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groceryPreferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate grocery list');
      }
      
      const data = await response.json();
      
      // Calculate total cost if not provided
      const totalCost = data.totalCost || 
        data.items.reduce((sum: number, item: { estimatedCost: number }) => 
          sum + item.estimatedCost, 0);
      
      // Update state with the AI-generated list
      setGeneratedList({
        items: data.items,
        totalCost,
        suggestions: data.suggestions
      });
    } catch (error) {
      console.error('Error generating grocery list:', error);
      
      // Fallback to static data if API fails
      setGeneratedList({
        items: [
          { name: "Error occurred", estimatedCost: 0 }
        ],
        totalCost: 0,
        suggestions: [
          "We couldn't generate your list at this time. Please try again later.",
          "Check your internet connection and try again."
        ]
      });
    }
  };
  
  // Get recipe suggestions based on selected ingredients or grocery list
  const getRecipeSuggestions = async () => {
    setIsLoadingRecipes(true);
    setRecipeError("");
    
    try {
      // Use either selected products or items from the generated list
      const items = selectedProducts.length > 0 
        ? selectedProducts 
        : generatedList.items.map(item => item.name);
      
      // Check if we have items to work with
      if (items.length === 0) {
        setRecipeError("Please select some grocery items first");
        setIsLoadingRecipes(false);
        return;
      }
      
      // Call our recipe suggestions API endpoint
      const response = await fetch('/api/shopping/recipe-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipe suggestions');
      }
      
      const data = await response.json();
      
      // Check if the response has the right format
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setRecipeSuggestions(data.suggestions);
      } else {
        throw new Error('Invalid recipe data format');
      }
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      setRecipeError("Failed to get recipe suggestions. Please try again.");
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Meal Prep Guide */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-purple-500" />
            Meal Prep Guide for Beginners
          </CardTitle>
          <CardDescription>
            Quick and easy batch cooking tips for healthy eating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mealPrepTips.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-lg">{section.title}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Grocery List Generator */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            Smart Grocery List Generator
          </CardTitle>
          <CardDescription>
            Get a personalized shopping list based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={groceryPreferences.diet}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, diet: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={groceryPreferences.budget}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, budget: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Weekly budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-low">Under $30</SelectItem>
              <SelectItem value="low">$30-50</SelectItem>
              <SelectItem value="medium">$50-100</SelectItem>
              <SelectItem value="high">$100-150</SelectItem>
              <SelectItem value="very-high">$150+</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={groceryPreferences.restrictions}
            onChange={(e) => setGroceryPreferences(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button
            className="w-full"
            onClick={generateGroceryList}
            disabled={!groceryPreferences.diet || !groceryPreferences.budget}
          >
            Generate Shopping List
          </Button>

          {generatedList.items.length > 0 && (
            <div className="space-y-4 mt-4 p-4 border rounded-md">
              <h3 className="font-medium">Your Personalized Shopping List:</h3>
              <div className="space-y-2">
                {generatedList.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.estimatedCost.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Estimated Total:</span>
                    <span>${generatedList.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Shopping Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {generatedList.suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card className="border-teal-200 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-teal-500" />
            Select Products to Compare
          </CardTitle>
          <CardDescription>
            Choose items you want to compare prices for across stores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add custom product */}
          <div className="flex gap-2">
            <Input
              placeholder="Add your own product"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="flex-1"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && newProduct.trim()) {
                  setSelectedProducts(prev => [...prev, newProduct.trim()]);
                  setNewProduct("");
                }
              }}
            />
            <Button 
              onClick={() => {
                if (newProduct.trim()) {
                  setSelectedProducts(prev => [...prev, newProduct.trim()]);
                  setNewProduct("");
                }
              }}
              disabled={!newProduct.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Common products */}
          <div>
            <h3 className="text-sm font-medium mb-2">Common items:</h3>
            <div className="flex flex-wrap gap-2">
              {commonProducts.map((product) => (
                <Badge
                  key={product}
                  variant={selectedProducts.includes(product) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProducts(prev =>
                      prev.includes(product)
                        ? prev.filter(p => p !== product)
                        : [...prev, product]
                    );
                  }}
                >
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          {/* Selected products */}
          {selectedProducts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Your selected items:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProducts
                  .filter(product => !commonProducts.includes(product))
                  .map((product, index) => (
                    <Badge 
                      key={index} 
                      variant="default"
                      className="cursor-pointer bg-teal-500"
                    >
                      {product}
                      <X 
                        className="h-3 w-3 ml-1" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProducts(prev => prev.filter(p => p !== product));
                        }}
                      />
                    </Badge>
                  ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Selected {selectedProducts.length} items to compare
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Price Comparison */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-teal-500" />
            Smart Price Comparison
          </CardTitle>
          <CardDescription>
            Find the best deals on groceries at stores near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  const inputElement = e.currentTarget;
                  handleLocationSearch(inputElement.value);
                }
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="shrink-0"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLocating ? "Locating..." : "Use Current Location"}
            </Button>
          </div>

          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {storeError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{storeError}</AlertDescription>
            </Alert>
          )}

          {location && (
            <Alert className="bg-teal-50 border-teal-200">
              <MapPin className="h-4 w-4 text-teal-600" />
              <AlertDescription className="text-teal-800">
                {isLoadingStores ? (
                  "Finding stores near your location..."
                ) : (
                  `Showing stores near: ${location}`
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isLoadingStores ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading nearby stores...</p>
              </div>
            ) : (
              storeComparisons.map((store, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{store.storeName}</span>
                      <span className="text-sm text-muted-foreground">{store.distance}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {store.prices
                        .filter(item => selectedProducts.length === 0 || selectedProducts.includes(item.item))
                        .map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between">
                            <span>{item.item}</span>
                            <div className="text-right">
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                              {item.deal && (
                                <Badge variant="secondary" className="ml-2">
                                  {item.deal}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Money-Saving Tips:</h3>
            <ul className="space-y-1">
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Best time to shop: Early mornings for fresh markdowns
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Compare unit prices instead of package prices
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Check store flyers for weekly specials
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Suggestions */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-amber-500" />
            AI-Powered Recipe Suggestions
          </CardTitle>
          <CardDescription>
            Get recipe ideas based on your grocery items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Find recipes using your selected items or grocery list
            </p>
            <Button 
              onClick={getRecipeSuggestions}
              disabled={isLoadingRecipes || (selectedProducts.length === 0 && generatedList.items.length === 0)}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Get Recipe Ideas
            </Button>
          </div>

          {recipeError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{recipeError}</AlertDescription>
            </Alert>
          )}

          {isLoadingRecipes && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Finding delicious recipes...</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recipeSuggestions.map((recipe, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                {recipe.image && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={recipe.image.startsWith('http') ? recipe.image : `https://spoonacular.com/recipeImages/${recipe.image}`} 
                      alt={recipe.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.src = 'https://placehold.co/400x300/orange/white?text=Recipe';
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground mb-4">{recipe.description}</p>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Ingredients you have:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.usedIngredients.map((ing, i) => (
                          <Badge key={i} variant="default" className="bg-green-500">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Additional ingredients needed:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.missedIngredients.map((ing, i) => (
                          <Badge key={i} variant="outline">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {recipe.id && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(`https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${recipe.id}`, '_blank')}
                    >
                      <Utensils className="h-4 w-4 mr-2" />
                      View Full Recipe
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {recipeSuggestions.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-amber-50">
              <h3 className="font-medium text-amber-800 mb-2">Recipe Tips:</h3>
              <ul className="space-y-1">
                <li className="text-sm text-amber-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Prep ingredients in advance to save time when cooking
                </li>
                <li className="text-sm text-amber-700 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-amber-600" />
                  Consider making double portions to have leftovers for another meal
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
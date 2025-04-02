import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChefHat, 
  Utensils, 
  Book, 
  ArrowLeft, 
  PlayCircle, 
  Coffee, 
  UtensilsCrossed, 
  Clock, 
  ShoppingBag,
  Cookie,
  Egg,
  Beef,
  Apple,
  X
} from 'lucide-react';
import RecipeExplorer from '@/components/recipe-explorer';
import KitchenSkillsLearning from '@/components/kitchen-skills-learning-updated';
import CookingTutorialsSpoonacular from '@/components/cooking-tutorials-spoonacular';
import KitchenEssentials from '@/components/kitchen-essentials';
import { Link } from 'wouter';

// Define allowed color values
type ColorKey = 'orange' | 'green' | 'blue' | 'purple' | 'pink' | 'yellow';

// Define category type
type GridCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: ColorKey;
  linkTo: string;
  onClick?: () => void;
};

// Category card component
const GridCard: React.FC<GridCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  linkTo,
  onClick 
}) => {
  // Ensure color is valid
  const safeColor = color || 'orange';
  
  const colorClasses = {
    orange: "border-orange-200 bg-orange-50 hover:bg-orange-100",
    green: "border-green-200 bg-green-50 hover:bg-green-100",
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    purple: "border-purple-200 bg-purple-50 hover:bg-purple-100",
    pink: "border-pink-200 bg-pink-50 hover:bg-pink-100",
    yellow: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100",
  };

  const iconColors = {
    orange: "text-orange-600",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    pink: "text-pink-600",
    yellow: "text-yellow-600",
  };

  return (
    <Card 
      className={`cursor-pointer border transition-all hover:shadow-md ${colorClasses[safeColor]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={iconColors[safeColor]}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-1">
        <a 
          href={linkTo} 
          className="no-underline w-full"
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
        >
          <Button 
            variant="outline" 
            className="w-full border-gray-300"
          >
            Explore
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

// Define component options for the different features
const introContent = (
  <div className="space-y-4">
    <div className="relative rounded-lg overflow-hidden aspect-video">
      <img 
        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1024&auto=format&fit=crop"
        alt="Kitchen with cooking setup"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <h2 className="text-white text-xl font-medium">
          Learn to cook and save money while eating healthier
        </h2>
      </div>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-medium mb-2">Why Learn to Cook?</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Save $2,000+ per year</strong> by preparing homemade meals</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Eat healthier</strong> by controlling ingredients and portions</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Gain independence</strong> and confidence in the kitchen</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Essential kitchen tools and how to use them</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Basic cooking techniques with step-by-step videos</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Simple home recipes like mac & cheese and pancakes</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default function CookingBasics() {
  const [activeDialogContent, setActiveDialogContent] = useState<{
    type: 'intro' | 'kitchen-tools' | 'cooking-tutorials' | 'recipe-explorer';
    title: string;
    description: string;
    icon: React.ReactNode;
    color: ColorKey;
  } | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Opens a dialog with the corresponding content
  const openDialog = (
    type: 'intro' | 'kitchen-tools' | 'cooking-tutorials' | 'recipe-explorer',
    title: string,
    description: string,
    icon: React.ReactNode,
    color: ColorKey
  ) => {
    setActiveDialogContent({
      type,
      title,
      description,
      icon,
      color
    });
    setDialogOpen(true);
    // Scroll to top when opening dialog
    window.scrollTo(0, 0);
  };
  
  // Display the appropriate content based on selection
  const renderDialogContent = () => {
    if (!activeDialogContent) {
      return null;
    }

    switch (activeDialogContent.type) {
      case 'intro':
        return introContent;
      case 'kitchen-tools':
        return <KitchenSkillsLearning />;
      case 'cooking-tutorials':
        return <CookingTutorialsSpoonacular />;
      case 'recipe-explorer':
        return <RecipeExplorer />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/learning">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Learning
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-orange-600">
          <ChefHat className="h-8 w-8" />
          Cooking Basics
        </h1>
        <p className="text-gray-600 mt-2">
          Learn essential cooking skills, discover new recipes, and build your confidence in the kitchen.
        </p>
      </div>
      
      {/* Grid Layout of Cooking Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* Introduction */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-orange-200 bg-orange-50 hover:bg-orange-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('intro', 'Introduction to Cooking', 'Why cooking matters and what you\'ll learn', <Book className="h-5 w-5" />, 'orange' as ColorKey)}
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <Book className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="font-medium">Introduction to Cooking</h3>
          <p className="text-xs text-gray-600 mt-1">Why cooking matters and what you'll learn</p>
        </div>
        
        {/* Kitchen Tools */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-blue-200 bg-blue-50 hover:bg-blue-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('kitchen-tools', 'Essential Kitchen Tools', 'Basic equipment every cook needs', <Utensils className="h-5 w-5" />, 'blue' as ColorKey)}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Utensils className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-medium">Essential Kitchen Tools</h3>
          <p className="text-xs text-gray-600 mt-1">Basic equipment every cook needs</p>
        </div>
        
        {/* Cooking Tutorials */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-green-200 bg-green-50 hover:bg-green-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('cooking-tutorials', 'Cooking Tutorials', 'Step-by-step video guides for beginners', <PlayCircle className="h-5 w-5" />, 'green' as ColorKey)}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <PlayCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-medium">Cooking Tutorials</h3>
          <p className="text-xs text-gray-600 mt-1">Step-by-step video guides</p>
        </div>
        
        {/* Recipe Explorer */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-purple-200 bg-purple-50 hover:bg-purple-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('recipe-explorer', 'Recipe Explorer', 'Discover easy home cooking classics', <ChefHat className="h-5 w-5" />, 'purple' as ColorKey)}
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <ChefHat className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-medium">Recipe Explorer</h3>
          <p className="text-xs text-gray-600 mt-1">Easy home cooking classics</p>
        </div>
        
        {/* Breakfast Basics */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-yellow-200 bg-yellow-50 hover:bg-yellow-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('cooking-tutorials', 'Breakfast Basics', 'Start your day with simple recipes', <Egg className="h-5 w-5" />, 'yellow' as ColorKey)}
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
            <Egg className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="font-medium">Breakfast Basics</h3>
          <p className="text-xs text-gray-600 mt-1">Simple morning recipes</p>
        </div>
        
        {/* Lunch & Dinner Staples */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-orange-200 bg-orange-50 hover:bg-orange-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('cooking-tutorials', 'Lunch & Dinner Staples', 'Everyday meals made simple', <Beef className="h-5 w-5" />, 'orange' as ColorKey)}
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <Beef className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="font-medium">Lunch & Dinner</h3>
          <p className="text-xs text-gray-600 mt-1">Everyday meals made simple</p>
        </div>
        
        {/* Simple Desserts */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-pink-200 bg-pink-50 hover:bg-pink-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('cooking-tutorials', 'Simple Desserts', 'Sweet treats anyone can make', <Cookie className="h-5 w-5" />, 'pink' as ColorKey)}
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2">
            <Cookie className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="font-medium">Simple Desserts</h3>
          <p className="text-xs text-gray-600 mt-1">Sweet treats anyone can make</p>
        </div>
        
        {/* Quick & Easy Meals */}
        <div
          className="cursor-pointer rounded-xl border transition-all hover:shadow-md border-pink-200 bg-pink-50 hover:bg-pink-100 p-3 flex flex-col items-center text-center"
          onClick={() => openDialog('cooking-tutorials', 'Quick & Easy Meals', 'Recipes ready in 30 minutes or less', <Clock className="h-5 w-5" />, 'pink' as ColorKey)}
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="font-medium">Quick & Easy Meals</h3>
          <p className="text-xs text-gray-600 mt-1">Ready in 30 minutes or less</p>
        </div>
      </div>
      
      {/* Full Screen Dialog for Content */}
      {dialogOpen && activeDialogContent && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={
                  activeDialogContent.color === 'orange' ? 'text-orange-600' :
                  activeDialogContent.color === 'blue' ? 'text-blue-600' :
                  activeDialogContent.color === 'green' ? 'text-green-600' :
                  activeDialogContent.color === 'purple' ? 'text-purple-600' :
                  activeDialogContent.color === 'yellow' ? 'text-yellow-600' : 
                  'text-pink-600'
                }>
                  {activeDialogContent.icon}
                </div>
                <h2 className="text-xl font-semibold">{activeDialogContent.title}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDialogOpen(false)}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
          
          <div className="container max-w-6xl mx-auto px-4 py-6">
            {renderDialogContent()}
          </div>
        </div>
      )}
    </div>
  );
}
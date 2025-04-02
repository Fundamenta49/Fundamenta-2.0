import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, BookOpen, ChefHat, PlayCircle, Utensils, ShieldAlert, BookMarked, Coffee, Salad, UtensilsCrossed } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCookingVideos } from '@/lib/youtube-service';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CookingTutorial {
  id: string;
  name: string;
  description: string;
  category: 'technique' | 'kitchen-safety' | 'basic-recipe' | 'breakfast' | 'lunch' | 'dinner';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId: string;
  tips: string[];
  commonUses?: string[];
  ingredients?: string[];
  thumbnailUrl?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

type Category = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const CookingTutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<CookingTutorial | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Scroll to top when showing search results or changing categories
  useEffect(() => {
    if (showSearchResults || selectedCategory) {
      window.scrollTo(0, 0);
    }
  }, [showSearchResults, selectedCategory]);

  // Categories of cooking content
  const categories: Category[] = [
    {
      id: 'technique',
      name: 'Cooking Techniques',
      description: 'Master essential cooking methods like sautéing, braising, and baking',
      icon: <Utensils className="h-5 w-5 text-orange-600" />
    },
    {
      id: 'kitchen-safety',
      name: 'Kitchen Tools & Safety',
      description: 'Learn proper tool usage, food safety, and kitchen organization',
      icon: <ShieldAlert className="h-5 w-5 text-orange-600" />
    },
    {
      id: 'basic-recipe',
      name: 'Basic Recipes',
      description: 'Simple, foundational recipes every home cook should know',
      icon: <BookMarked className="h-5 w-5 text-orange-600" />
    },
    {
      id: 'breakfast',
      name: 'Breakfast Recipes',
      description: 'Start your day with delicious morning meal ideas',
      icon: <Coffee className="h-5 w-5 text-orange-600" />
    },
    {
      id: 'lunch',
      name: 'Lunch Recipes',
      description: 'Quick and satisfying midday meal options',
      icon: <Salad className="h-5 w-5 text-orange-600" />
    },
    {
      id: 'dinner',
      name: 'Dinner Recipes',
      description: 'Hearty and flavorful evening meal recipes',
      icon: <UtensilsCrossed className="h-5 w-5 text-orange-600" />
    }
  ];

  // Cooking tutorials by category
  const cookingTutorials: CookingTutorial[] = [
    // COOKING TECHNIQUES
    {
      id: 'saute-technique',
      name: 'How to Sauté Properly',
      description: 'Master the quick cooking technique for vegetables, meats, and more.',
      category: 'technique',
      difficulty: 'beginner',
      videoId: 'u0j7bCj5uQ4',
      thumbnailUrl: 'https://img.youtube.com/vi/u0j7bCj5uQ4/hqdefault.jpg',
      tips: [
        'Use a wide, shallow pan with sloped sides',
        'Heat the pan before adding oil or butter',
        'Don\'t overcrowd the pan - cook in batches if needed',
        'Keep food moving with a quick flipping motion'
      ]
    },
    {
      id: 'baking-technique',
      name: 'Baking Fundamentals',
      description: 'Learn the science and technique behind successful baking.',
      category: 'technique',
      difficulty: 'beginner',
      videoId: 'MtR9QO36M4w',
      thumbnailUrl: 'https://img.youtube.com/vi/MtR9QO36M4w/hqdefault.jpg',
      tips: [
        'Always measure ingredients precisely',
        'Understand how your oven heats (use an oven thermometer)',
        'Let the oven fully preheat before baking',
        'Use the middle rack for most even cooking'
      ]
    },
    {
      id: 'braising-technique',
      name: 'Braising For Tender Results',
      description: 'Transform tough cuts into tender, flavorful meals with this slow-cooking method.',
      category: 'technique',
      difficulty: 'intermediate',
      videoId: 'qZ4LPgq5JEo',
      thumbnailUrl: 'https://img.youtube.com/vi/qZ4LPgq5JEo/hqdefault.jpg',
      tips: [
        'Brown meat well before adding liquid',
        'Use just enough liquid to cover meat halfway',
        'Keep at a gentle simmer, not a rolling boil',
        'Allow plenty of time - rushing defeats the purpose'
      ]
    },
    {
      id: 'roasting-technique',
      name: 'Perfect Roasting Method',
      description: 'Create caramelized, flavorful vegetables and meats with dry heat cooking.',
      category: 'technique',
      difficulty: 'beginner',
      videoId: 'x8PrvBYod-U',
      thumbnailUrl: 'https://img.youtube.com/vi/x8PrvBYod-U/hqdefault.jpg',
      tips: [
        'Pat ingredients dry before roasting',
        'Cut vegetables into uniform sizes for even cooking',
        'Use high heat (400°F-450°F) for caramelization',
        'Don\'t overcrowd the pan - use multiple sheets if needed'
      ]
    },

    // KITCHEN TOOLS & SAFETY
    {
      id: 'knife-skills',
      name: 'Basic Knife Skills',
      description: 'Learn safe and proper cutting techniques that every home cook should know.',
      category: 'kitchen-safety',
      difficulty: 'beginner',
      videoId: '20gwf7YttQM',
      thumbnailUrl: 'https://img.youtube.com/vi/20gwf7YttQM/hqdefault.jpg',
      tips: [
        'Keep your fingers curled under when holding food',
        'Let the knife do the work - don\'t force it',
        'Keep your knife sharp - dull knives are dangerous',
        'Use a claw grip to protect your fingertips'
      ]
    },
    {
      id: 'cutting-board-safety',
      name: 'Cutting Board Selection & Care',
      description: 'Understand how to choose, use, and maintain different types of cutting boards.',
      category: 'kitchen-safety',
      difficulty: 'beginner',
      videoId: 'S_s-Gj7eWdo',
      thumbnailUrl: 'https://img.youtube.com/vi/S_s-Gj7eWdo/maxresdefault.jpg',
      tips: [
        'Use separate boards for raw meat and produce',
        'Wooden boards are gentler on knife edges than plastic',
        'Sanitize with diluted bleach solution (for plastic) or vinegar (for wood)',
        'Replace boards with deep grooves that can harbor bacteria'
      ]
    },
    {
      id: 'food-storage',
      name: 'Proper Food Storage',
      description: 'Learn how to store different foods for maximum freshness and safety.',
      category: 'kitchen-safety',
      difficulty: 'beginner',
      videoId: '6DgfrO-aJQ0',
      thumbnailUrl: 'https://img.youtube.com/vi/6DgfrO-aJQ0/maxresdefault.jpg',
      tips: [
        'Keep refrigerator at 40°F or below, freezer at 0°F',
        'Store raw meat on the bottom shelf to prevent cross-contamination',
        'Don\'t store produce in airtight containers - they need to breathe',
        'Use the FIFO method: First In, First Out'
      ]
    },
    {
      id: 'kitchen-organization',
      name: 'Kitchen Organization Basics',
      description: 'Set up your kitchen workspace for efficiency and safety.',
      category: 'kitchen-safety',
      difficulty: 'beginner',
      videoId: 'CwT9nF4vQ_Y',
      thumbnailUrl: 'https://img.youtube.com/vi/CwT9nF4vQ_Y/maxresdefault.jpg',
      tips: [
        'Group similar items together in storage',
        'Keep frequently used tools within easy reach',
        'Store heavy items in lower cabinets',
        'Organize workspace with prep, cooking, and cleaning zones'
      ]
    },

    // BASIC RECIPES
    {
      id: 'pasta-basics',
      name: 'Perfect Pasta Cooking',
      description: 'Learn to cook pasta properly and make simple, delicious sauces.',
      category: 'basic-recipe',
      difficulty: 'beginner',
      videoId: 'UYhKDweME3A',
      thumbnailUrl: 'https://img.youtube.com/vi/UYhKDweME3A/hqdefault.jpg',
      tips: [
        'Use plenty of water - at least 4 quarts per pound of pasta',
        'Salt the water generously (it should taste like seawater)',
        'Save some pasta water for sauces',
        'Cook until al dente - firm to the bite'
      ],
      ingredients: [
        'Pasta of your choice',
        'Kosher salt',
        'Olive oil',
        'Garlic (optional)',
        'Parmesan cheese (optional)'
      ]
    },
    {
      id: 'rice-cooking',
      name: 'Foolproof Rice Cooking',
      description: 'Master the basic technique for perfectly cooked rice every time.',
      category: 'basic-recipe',
      difficulty: 'beginner',
      videoId: 'Jf75I9LKhvg',
      thumbnailUrl: 'https://img.youtube.com/vi/Jf75I9LKhvg/maxresdefault.jpg',
      tips: [
        'Rinse rice until water runs clear to remove excess starch',
        'Use the correct water ratio for your type of rice',
        'Let rice rest covered for 10 minutes after cooking',
        'Fluff with a fork, not a spoon, to prevent mashing'
      ],
      ingredients: [
        'Rice (long grain, short grain, basmati, etc.)',
        'Water',
        'Salt (optional)',
        'Butter or oil (optional)'
      ]
    },
    {
      id: 'basic-salad',
      name: 'Simple Green Salad & Vinaigrette',
      description: 'Create fresh, flavorful salads with homemade dressing.',
      category: 'basic-recipe',
      difficulty: 'beginner',
      videoId: 'GtAzKL-qm-o',
      thumbnailUrl: 'https://img.youtube.com/vi/GtAzKL-qm-o/maxresdefault.jpg',
      tips: [
        'Dry greens thoroughly after washing',
        'Basic vinaigrette ratio: 3 parts oil to 1 part acid',
        'Season dressing properly - it should taste slightly too strong on its own',
        'Dress salad just before serving to prevent wilting'
      ],
      ingredients: [
        'Mixed greens or lettuce',
        'Olive oil',
        'Vinegar or lemon juice',
        'Dijon mustard',
        'Salt and pepper',
        'Optional add-ins: herbs, garlic, shallot'
      ]
    },
    {
      id: 'roasted-vegetables',
      name: 'Basic Roasted Vegetables',
      description: 'Transform ordinary vegetables into caramelized, flavorful side dishes.',
      category: 'basic-recipe',
      difficulty: 'beginner',
      videoId: 'OesqF5IjJJc',
      thumbnailUrl: 'https://img.youtube.com/vi/OesqF5IjJJc/maxresdefault.jpg',
      tips: [
        'Cut vegetables into uniform sizes for even cooking',
        'Don\'t overcrowd the pan - use multiple sheets if needed',
        'Toss with oil, salt and pepper before roasting',
        'Roast at 400-425°F for best caramelization'
      ],
      ingredients: [
        'Vegetables of choice (broccoli, cauliflower, carrots, etc.)',
        'Olive oil',
        'Salt and pepper',
        'Optional: garlic, herbs, lemon zest'
      ]
    },

    // BREAKFAST RECIPES
    {
      id: 'pancakes',
      name: 'Fluffy Homemade Pancakes',
      description: 'Master the technique for light, fluffy pancakes perfect for breakfast.',
      category: 'breakfast',
      difficulty: 'beginner',
      videoId: 'GLdxV0PTX3s',
      thumbnailUrl: 'https://img.youtube.com/vi/GLdxV0PTX3s/hqdefault.jpg',
      tips: [
        'Don\'t overmix the batter - lumps are okay',
        'Let the batter rest for 5-10 minutes before cooking',
        'Flip when bubbles form and edges look set',
        'Keep warm in a 200°F oven while making the batch'
      ],
      ingredients: [
        'All-purpose flour',
        'Baking powder',
        'Sugar',
        'Salt',
        'Milk',
        'Eggs',
        'Butter or oil',
        'Vanilla extract (optional)'
      ]
    },
    {
      id: 'omelet',
      name: 'Perfect French Omelet',
      description: 'Create a light, fluffy omelet with your favorite fillings.',
      category: 'breakfast',
      difficulty: 'intermediate',
      videoId: 'qXPhVYpQLPA',
      thumbnailUrl: 'https://img.youtube.com/vi/qXPhVYpQLPA/hqdefault.jpg',
      tips: [
        'Beat eggs until completely blended',
        'Use a nonstick pan and proper heat control',
        'Keep the eggs moving for the first 30 seconds',
        'Don\'t overfill - less is more with fillings'
      ],
      ingredients: [
        'Eggs',
        'Salt and pepper',
        'Butter',
        'Optional fillings: cheese, herbs, vegetables, ham'
      ]
    },
    {
      id: 'avocado-toast',
      name: 'Avocado Toast Variations',
      description: 'Create the perfect balance of creamy avocado and crunchy toast with delicious toppings.',
      category: 'breakfast',
      difficulty: 'beginner',
      videoId: 'MfKyCF8brRo',
      thumbnailUrl: 'https://img.youtube.com/vi/MfKyCF8brRo/hqdefault.jpg',
      tips: [
        'Choose ripe but firm avocados',
        'Toast bread until golden and firm',
        'Season avocado generously with salt and acid (lemon/lime)',
        'Add texture contrasts with toppings'
      ],
      ingredients: [
        'Bread (sourdough recommended)',
        'Ripe avocados',
        'Salt and pepper',
        'Lemon or lime juice',
        'Optional toppings: eggs, tomatoes, microgreens, seeds'
      ]
    },

    // LUNCH RECIPES
    {
      id: 'grilled-cheese',
      name: 'Perfect Grilled Cheese',
      description: 'Master this classic sandwich - crispy outside, gooey melted cheese inside.',
      category: 'lunch',
      difficulty: 'beginner',
      videoId: 'OMPr7YP4fd8',
      thumbnailUrl: 'https://img.youtube.com/vi/OMPr7YP4fd8/hqdefault.jpg',
      tips: [
        'Use butter at room temperature for easy spreading',
        'Cook on medium-low heat for even browning and melting',
        'Cover with a lid to help the cheese melt completely',
        'Add extras like tomato or ham for variations'
      ],
      ingredients: [
        'Bread (white, sourdough, etc.)',
        'Cheese (American, cheddar, gruyere, etc.)',
        'Butter',
        'Optional add-ins: tomato, ham, herbs'
      ]
    },
    {
      id: 'grain-bowl',
      name: 'Balanced Grain Bowl',
      description: 'Create a nutritious and satisfying lunch bowl with grains, proteins, and vegetables.',
      category: 'lunch',
      difficulty: 'beginner',
      videoId: 'nJTg9-I0XdE',
      thumbnailUrl: 'https://img.youtube.com/vi/nJTg9-I0XdE/hqdefault.jpg',
      tips: [
        'Cook grains in broth for extra flavor',
        'Include a mix of raw and cooked vegetables',
        'Add a source of protein (eggs, chicken, tofu, beans)',
        'Finish with a flavorful sauce or dressing'
      ],
      ingredients: [
        'Grains (quinoa, brown rice, farro, etc.)',
        'Vegetables (roasted or fresh)',
        'Protein source',
        'Dressing or sauce',
        'Toppings: seeds, nuts, herbs, etc.'
      ]
    },
    {
      id: 'simple-soup',
      name: 'Quick Homemade Soup',
      description: 'Learn the basics of making flavorful soups from scratch in under 30 minutes.',
      category: 'lunch',
      difficulty: 'beginner',
      videoId: 'GC9JoAYxfSM',
      thumbnailUrl: 'https://img.youtube.com/vi/GC9JoAYxfSM/hqdefault.jpg',
      tips: [
        'Start with aromatic vegetables (onion, carrot, celery)',
        'Use good quality broth or bouillon',
        'Add acid (lemon juice, vinegar) to brighten flavors',
        'Fresh herbs added at the end add brightness'
      ],
      ingredients: [
        'Onion, carrot, celery',
        'Garlic',
        'Broth or stock',
        'Vegetables of choice',
        'Optional protein (beans, shredded chicken, etc.)',
        'Herbs and seasonings'
      ]
    },

    // DINNER RECIPES
    {
      id: 'baked-chicken',
      name: 'Easy Baked Chicken',
      description: 'A foolproof method for juicy, flavorful chicken every time.',
      category: 'dinner',
      difficulty: 'beginner',
      videoId: '1TlVgW-pM5g',
      thumbnailUrl: 'https://img.youtube.com/vi/1TlVgW-pM5g/hqdefault.jpg',
      tips: [
        'Pat chicken dry before seasoning for crispy skin',
        'Use a meat thermometer for perfect doneness',
        'Let rest 5-10 minutes before cutting',
        'Chicken is done at 165°F internal temperature'
      ],
      ingredients: [
        'Chicken pieces (breast, thigh, etc.)',
        'Olive oil',
        'Salt and pepper',
        'Herbs and spices of choice',
        'Optional: lemon, garlic, butter'
      ]
    },
    {
      id: 'simple-stir-fry',
      name: 'Customizable Stir Fry',
      description: 'Master the basics of quick high-heat cooking for endless dinner possibilities.',
      category: 'dinner',
      difficulty: 'beginner',
      videoId: 'JGPGHrGpwuM',
      thumbnailUrl: 'https://img.youtube.com/vi/JGPGHrGpwuM/hqdefault.jpg',
      tips: [
        'Prep all ingredients before heating the wok/pan',
        'Cook proteins first, then remove while cooking vegetables',
        'Keep everything moving - stir constantly',
        'Add sauce at the very end'
      ],
      ingredients: [
        'Protein (chicken, beef, tofu, etc.)',
        'Mixed vegetables',
        'Garlic and ginger',
        'Soy sauce',
        'Oil with high smoke point',
        'Cornstarch (for thickening sauce)',
        'Rice or noodles for serving'
      ]
    },
    {
      id: 'meatloaf',
      name: 'Classic Homemade Meatloaf',
      description: 'A homestyle favorite that\'s easy to prepare and customize.',
      category: 'dinner',
      difficulty: 'beginner',
      videoId: 'ZtZmlK2xLcY',
      thumbnailUrl: 'https://img.youtube.com/vi/ZtZmlK2xLcY/hqdefault.jpg',
      tips: [
        'Use a mix of ground meats for better flavor',
        'Don\'t overmix or it will become dense',
        'Add a glaze during the last 15 minutes of baking',
        'Let rest 10 minutes before slicing'
      ],
      ingredients: [
        'Ground beef (or mix with pork, veal)',
        'Onion and garlic',
        'Breadcrumbs',
        'Eggs',
        'Ketchup, Worcestershire sauce',
        'Herbs and seasonings',
        'Glaze ingredients: ketchup, brown sugar, vinegar'
      ]
    },
    {
      id: 'mac-and-cheese',
      name: 'Homemade Mac and Cheese',
      description: 'Make this classic comfort food from scratch - creamy, cheesy, and delicious.',
      category: 'dinner',
      difficulty: 'beginner',
      videoId: 'FUeyrEN14Rk',
      thumbnailUrl: 'https://img.youtube.com/vi/FUeyrEN14Rk/hqdefault.jpg',
      tips: [
        'Use medium or sharp cheddar for more flavor',
        'Cook pasta just under al dente since it will cook more in the sauce',
        'Add a little mustard powder for depth of flavor',
        'Salt your pasta water well'
      ],
      ingredients: [
        'Pasta (macaroni or other short shape)',
        'Butter',
        'Flour',
        'Milk',
        'Cheese (cheddar, gruyere, etc.)',
        'Mustard powder',
        'Salt and pepper',
        'Optional toppings: breadcrumbs, herbs'
      ]
    }
  ];

  // Filter tutorials by selected category
  const filteredTutorials = selectedCategory 
    ? cookingTutorials.filter(tutorial => tutorial.category === selectedCategory)
    : cookingTutorials;

  // Handle video search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setShowSearchResults(true);
      setSelectedCategory(null);
      const results = await searchCookingVideos(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for videos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a category
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowSearchResults(false);
  };

  // Handle back to all categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowSearchResults(false);
  };

  // Handle opening a tutorial video
  const openTutorialVideo = (tutorial: CookingTutorial) => {
    setSelectedTutorial(tutorial);
    setSelectedVideo(null);
    setVideoDialogOpen(true);
  };

  // Handle opening a search result video
  const openSearchVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setSelectedTutorial(null);
    setVideoDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
        <div className="flex gap-2">
          <BookOpen className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-800">Cooking Basics</h3>
            <p className="text-sm text-orange-700 mt-1">
              Learn essential cooking skills with step-by-step video tutorials.
              Click any card to watch in fullscreen mode.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cooking tutorials (e.g., 'how to make mac and cheese')"
              className="flex-1"
            />
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Main Content Area - conditionally render search results, category, or categories list */}
      {showSearchResults ? (
        // SEARCH RESULTS
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Search Results</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSearchResults(false)}
                  className="text-sm"
                >
                  Back to Categories
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Searching for tutorials...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map(video => (
                    <Card key={video.id} className="overflow-hidden flex flex-col h-full">
                      <div 
                        className="aspect-video relative cursor-pointer" 
                        onClick={() => openSearchVideo(video)}
                      >
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                          <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {video.channelTitle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <ScrollArea className="h-16">
                          <p className="text-sm text-gray-600">
                            {video.description}
                          </p>
                        </ScrollArea>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => openSearchVideo(video)}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Watch Tutorial
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {searchResults.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No tutorials found</h3>
                      <p className="text-gray-500 mt-1">
                        Try searching for different cooking techniques or recipes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : selectedCategory ? (
        // SELECTED CATEGORY VIEW
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {categories.find(cat => cat.id === selectedCategory)?.icon}
                  <CardTitle>{categories.find(cat => cat.id === selectedCategory)?.name}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleBackToCategories}
                  className="text-sm"
                >
                  All Categories
                </Button>
              </div>
              <CardDescription>
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Tutorials Grid for Selected Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTutorials.map(tutorial => (
              <Card key={tutorial.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div 
                  className="aspect-video relative cursor-pointer" 
                  onClick={() => openTutorialVideo(tutorial)}
                >
                  {tutorial.thumbnailUrl ? (
                    <img 
                      src={tutorial.thumbnailUrl} 
                      alt={tutorial.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{tutorial.name}</CardTitle>
                    <Badge 
                      className={
                        tutorial.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : tutorial.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <h4 className="text-sm font-medium mb-2">Quick Tips:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                    {tutorial.tips.slice(0, 2).map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openTutorialVideo(tutorial)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // CATEGORIES VIEW
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <CardTitle>Cooking Categories</CardTitle>
              </div>
              <CardDescription>
                Choose a category to explore cooking tutorials
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card 
                key={category.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(category.id);
                    }}
                  >
                    View Tutorials
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Video Dialog */}
      {selectedTutorial && (
        <VideoPlayerDialog
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={selectedTutorial.videoId}
          title={selectedTutorial.name}
          description={selectedTutorial.description}
        />
      )}

      {selectedVideo && (
        <VideoPlayerDialog
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
};

export default CookingTutorials;
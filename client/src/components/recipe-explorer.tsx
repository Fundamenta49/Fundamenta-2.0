import { useState, useEffect } from 'react';
import { 
  Search, 
  Utensils, 
  ChefHat, 
  Clock, 
  Users, 
  Plus, 
  Youtube,
  ExternalLink,
  ThumbsUp,
  PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpoonacularService, Recipe } from '@/services/spoonacular-service';
import { searchCookingVideos, getYouTubeEmbedUrl } from '@/lib/youtube-service';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeDetailDialog } from '@/components/recipe-detail-dialog';
import { VideoPlayerDialog } from '@/components/video-player-dialog';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

const RecipeExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Load recipes for basic home cooking meals on component mount
  useEffect(() => {
    fetchBasicHomeCookingRecipes();
  }, []);

  // Fetch basic home-style recipes that beginners can easily make
  const fetchBasicHomeCookingRecipes = async () => {
    try {
      setLoadingRecipes(true);
      // Focus on simple, popular dishes for beginners
      const basicHomeCookingDishes = [
        "mac and cheese", 
        "simple burger", 
        "basic pancakes", 
        "easy meatloaf", 
        "homemade pizza", 
        "grilled cheese sandwich", 
        "baked chicken", 
        "spaghetti"
      ];
      
      // Get a random selection of dishes to search for
      const randomSelections = basicHomeCookingDishes.sort(() => 0.5 - Math.random()).slice(0, 3);
      const promises = randomSelections.map((dish: string) => 
        SpoonacularService.searchRecipes(dish, undefined, undefined, undefined, 30)
      );
      
      const results = await Promise.all(promises);
      
      // Combine and shuffle the results
      const combinedRecipes = results.flatMap((result: any) => result.results || [])
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      
      setRandomRecipes(combinedRecipes);
    } catch (error) {
      console.error('Error fetching home cooking recipes:', error);
      // Fallback to random recipes if the specific search fails
      try {
        const response = await SpoonacularService.getRandomRecipes(8);
        setRandomRecipes(response.recipes || []);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoadingRecipes(true);
      setLoadingVideos(true);
      
      // Search for recipes via Spoonacular
      const response = await fetch(`/api/cooking/recipes/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setRecipes(data.results || []);
      
      // Search for videos on YouTube
      const videoResults = await searchCookingVideos(searchQuery);
      setVideos(videoResults);
      
      // Switch to the results tab
      setActiveTab('results');
    } catch (error) {
      console.error('Error searching for recipes:', error);
    } finally {
      setLoadingRecipes(false);
      setLoadingVideos(false);
    }
  };

  const viewRecipeDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/cooking/recipes/${id}/information`);
      const recipe = await response.json();
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for recipes or ingredients..."
            className="flex-1"
          />
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="discover" className="flex-1">
            <ChefHat className="mr-2 h-4 w-4" />
            Discover Recipes
          </TabsTrigger>
          <TabsTrigger value="results" className="flex-1">
            <Utensils className="mr-2 h-4 w-4" />
            Search Results
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">
            <Youtube className="mr-2 h-4 w-4" />
            Video Tutorials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingRecipes ? (
              Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-[200px] w-full" />
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))
            ) : (
              randomRecipes.map(recipe => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-[200px] overflow-hidden">
                    {recipe.image ? (
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {recipe.readyInMinutes && (
                      <div className="absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.readyInMinutes} min
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                    {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                      <CardDescription className="flex flex-wrap gap-1 mt-1">
                        {recipe.dishTypes.slice(0, 2).map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    {recipe.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2" 
                        dangerouslySetInnerHTML={{ __html: recipe.summary }}
                      />
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => viewRecipeDetails(recipe.id)}
                      variant="outline" 
                      className="w-full"
                    >
                      View Recipe
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          {!loadingRecipes && randomRecipes.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <ChefHat className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No recipes found</h3>
              <p className="text-gray-500 mt-1">Try searching for recipes or ingredients</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results">
          {searchQuery && (
            <h3 className="text-lg font-medium mb-4">Search results for "{searchQuery}"</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingRecipes ? (
              Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-[200px] w-full" />
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))
            ) : (
              recipes.map(recipe => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-[200px] overflow-hidden">
                    {recipe.image ? (
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {recipe.readyInMinutes && (
                      <div className="absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.readyInMinutes} min
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                    {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                      <CardDescription className="flex flex-wrap gap-1 mt-1">
                        {recipe.dishTypes.slice(0, 2).map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    {recipe.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2" 
                        dangerouslySetInnerHTML={{ __html: recipe.summary }}
                      />
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => viewRecipeDetails(recipe.id)}
                      variant="outline" 
                      className="w-full"
                    >
                      View Recipe
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          {!loadingRecipes && recipes.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-gray-500 mt-1">Try searching with different keywords</p>
              <Button onClick={fetchBasicHomeCookingRecipes} className="mt-4">
                Show Home Cooking recipes
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingVideos ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-[250px] w-full" />
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))
            ) : (
              videos.map(video => (
                <Card key={video.id} className="overflow-hidden flex flex-col h-full">
                  <div 
                    className="aspect-video relative cursor-pointer" 
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideoDialogOpen(true);
                    }}
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
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {video.channelTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {video.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedVideo(video);
                        setVideoDialogOpen(true);
                      }}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          {!loadingVideos && videos.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Youtube className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No videos found</h3>
              <p className="text-gray-500 mt-1">Search for cooking tutorials to see results</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recipe detail dialog */}
      {selectedRecipe && (
        <RecipeDetailDialog
          open={!!selectedRecipe}
          onOpenChange={(open) => {
            if (!open) setSelectedRecipe(null);
          }}
          recipe={selectedRecipe}
        />
      )}

      {/* Video player dialog */}
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

export default RecipeExplorer;
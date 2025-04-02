import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { SpoonacularService, Video } from '@/services/spoonacular-service';
import { useQuery } from '@tanstack/react-query';
import { RotateCw, Search, PlayCircle, Eye, Clock, Filter, Bookmark, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoDetails {
  videoId: string;
  title: string;
}

interface VideoCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  query: string;
}

const SpoonacularVideoTutorials: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('breakfast');
  const [selectedTab, setSelectedTab] = useState<string>('categories');
  const [videoDialog, setVideoDialog] = useState<{ open: boolean; videoId: string; title: string; }>({
    open: false,
    videoId: '',
    title: ''
  });
  
  const { toast } = useToast();
  
  // Video categories
  const videoCategories: VideoCategory[] = [
    {
      id: 'breakfast',
      name: 'Breakfast Basics',
      description: 'Quick and easy breakfast recipes and techniques',
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      query: 'breakfast'
    },
    {
      id: 'lunch',
      name: 'Lunch Ideas',
      description: 'Simple and satisfying lunch recipes',
      color: 'bg-green-50 border-green-200 text-green-700',
      query: 'lunch'
    },
    {
      id: 'dinner',
      name: 'Dinner Recipes',
      description: 'Delicious dinner options for any night',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      query: 'dinner'
    },
    {
      id: 'desserts',
      name: 'Simple Desserts',
      description: 'Sweet treats anyone can make',
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      query: 'desserts'
    },
    {
      id: 'quick',
      name: 'Quick Meals',
      description: 'Recipes ready in 30 minutes or less',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      query: 'quick'
    },
    {
      id: 'techniques',
      name: 'Cooking Techniques',
      description: 'Essential cooking methods and skills',
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      query: 'techniques'
    }
  ];
  
  // Get category videos query
  const { 
    data: categoryVideos, 
    isLoading: isLoadingCategoryVideos,
    isError: isCategoryVideosError,
    error: categoryVideosError
  } = useQuery({
    queryKey: ['cooking-videos', 'category', activeCategory],
    queryFn: () => SpoonacularService.getVideosByCategory(
      videoCategories.find(cat => cat.id === activeCategory)?.query || activeCategory
    ),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Search videos query (only runs when search is submitted)
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch
  } = useQuery({
    queryKey: ['cooking-videos', 'search', searchQuery],
    queryFn: () => SpoonacularService.searchVideos(searchQuery),
    enabled: false, // Don't run on component mount
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Random videos query
  const {
    data: randomVideos,
    isLoading: isLoadingRandom,
    isError: isRandomError,
    error: randomError,
    refetch: refetchRandom
  } = useQuery({
    queryKey: ['cooking-videos', 'random'],
    queryFn: () => SpoonacularService.getRandomVideos(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Function to handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      toast({
        title: 'Please enter a search term',
        description: 'Enter a recipe or technique to search for videos',
        variant: 'destructive'
      });
      return;
    }
    
    setSelectedTab('search');
    refetchSearch();
  };
  
  // Function to play a video
  const playVideo = (video: Video) => {
    setVideoDialog({
      open: true,
      videoId: video.youTubeId,
      title: video.title
    });
  };
  
  // Function to refresh random videos
  const refreshRandomVideos = () => {
    refetchRandom();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex w-full gap-2">
            <Input
              placeholder="Search for cooking tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="default">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </div>
      
      <Tabs defaultValue="categories" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="search" disabled={!searchResults}>Search Results</TabsTrigger>
          <TabsTrigger value="explore">Explore</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {videoCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer border ${category.color} ${activeCategory === category.id ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              {videoCategories.find(cat => cat.id === activeCategory)?.name || 'Videos'}
            </h3>
            
            {isCategoryVideosError && (
              <div className="p-4 border rounded-md bg-red-50 text-red-700 mb-4">
                <p className="font-medium">Error loading videos</p>
                <p className="text-sm">{(categoryVideosError as Error)?.message || 'Please try again later.'}</p>
              </div>
            )}
            
            {isLoadingCategoryVideos ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-0">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {categoryVideos?.videos && categoryVideos.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryVideos.videos.map((video) => (
                      <Card key={video.youTubeId} className="overflow-hidden">
                        <div 
                          className="aspect-video relative cursor-pointer group"
                          onClick={() => playVideo(video)}
                        >
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-16 w-16 text-white drop-shadow-md" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {SpoonacularService.formatVideoLength(video.length)}
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {video.views.toLocaleString()} views
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => playVideo(video)}
                          >
                            Watch
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No videos found for this category.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={() => setActiveCategory('breakfast')}
                    >
                      Try another category
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Search Results Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Search Results: {searchQuery}
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedTab('categories')}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Search
            </Button>
          </div>
          
          {isSearchError && (
            <div className="p-4 border rounded-md bg-red-50 text-red-700 mb-4">
              <p className="font-medium">Error searching for videos</p>
              <p className="text-sm">{(searchError as Error)?.message || 'Please try again later.'}</p>
            </div>
          )}
          
          {isLoadingSearch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-0">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {searchResults?.videos && searchResults.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.videos.map((video) => (
                    <Card key={video.youTubeId} className="overflow-hidden">
                      <div 
                        className="aspect-video relative cursor-pointer group"
                        onClick={() => playVideo(video)}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-16 w-16 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {SpoonacularService.formatVideoLength(video.length)}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.views.toLocaleString()} views
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => playVideo(video)}
                        >
                          Watch
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No videos found for "{searchQuery}".</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords or browse by category.</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTab('categories')}
                    >
                      Browse Categories
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTab('explore')}
                    >
                      Explore Random Videos
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Explore Tab */}
        <TabsContent value="explore" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Explore Cooking Videos
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshRandomVideos}
              disabled={isLoadingRandom}
            >
              <RotateCw className={`h-4 w-4 mr-1 ${isLoadingRandom ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {isRandomError && (
            <div className="p-4 border rounded-md bg-red-50 text-red-700 mb-4">
              <p className="font-medium">Error loading videos</p>
              <p className="text-sm">{(randomError as Error)?.message || 'Please try again later.'}</p>
            </div>
          )}
          
          {isLoadingRandom ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-0">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {randomVideos?.videos && randomVideos.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {randomVideos.videos.map((video) => (
                    <Card key={video.youTubeId} className="overflow-hidden">
                      <div 
                        className="aspect-video relative cursor-pointer group"
                        onClick={() => playVideo(video)}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-16 w-16 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {SpoonacularService.formatVideoLength(video.length)}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.views.toLocaleString()} views
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => playVideo(video)}
                        >
                          Watch
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No videos available at the moment.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={refreshRandomVideos}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Try Again
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={videoDialog.open}
        onOpenChange={(open) => setVideoDialog({ ...videoDialog, open })}
        videoId={videoDialog.videoId}
        title={videoDialog.title}
      />
    </div>
  );
};

export default SpoonacularVideoTutorials;
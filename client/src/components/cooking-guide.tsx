import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Utensils, ChefHat, ThermometerSun, Trash2, Timer, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/components/chat-interface";
import { cn } from "@/lib/utils";

// Define cooking topics with their icons and descriptions
const COOKING_TOPICS = [
  {
    id: 'safety',
    title: "Kitchen Safety Essentials",
    description: "Learn fundamental kitchen safety practices",
    icon: ThermometerSun,
    topics: [
      "Fire safety in the kitchen",
      "Proper knife handling",
      "Food temperature safety",
      "Emergency procedures"
    ]
  },
  {
    id: 'tools',
    title: "Kitchen Tools & Equipment",
    description: "How to use common kitchen tools safely",
    icon: Utensils,
    topics: [
      "Safe microwave usage",
      "Can opener techniques",
      "Proper pan handling",
      "Kitchen appliance safety"
    ]
  },
  {
    id: 'sanitation',
    title: "Kitchen Sanitation",
    description: "Keep your cooking space clean and safe",
    icon: Trash2,
    topics: [
      "Proper hand washing",
      "Surface sanitization",
      "Food storage safety",
      "Cross-contamination prevention"
    ]
  },
  {
    id: 'methods',
    title: "Basic Cooking Methods",
    description: "Learn essential cooking techniques",
    icon: ChefHat,
    topics: [
      "Boiling and simmering",
      "Safe pan frying",
      "Oven safety",
      "Microwave cooking"
    ]
  },
  {
    id: 'timing',
    title: "Cooking Times & Temperatures",
    description: "Essential guidelines for safe cooking",
    icon: Timer,
    topics: [
      "Safe internal temperatures",
      "Cooking time guidelines",
      "Defrosting safety",
      "Food storage temperatures"
    ]
  }
];

const COOKING_RESOURCES = [
  {
    name: "America's Test Kitchen",
    url: "https://www.americastestkitchen.com",
    description: "A great site for reviews on the best tools and recipe ideas."
  },
  {
    name: "Reddit Kitchen Confidential",
    url: "https://www.reddit.com/r/KitchenConfidential",
    description: "A wonderful community for professional and home cooks alike."
  },
  {
    name: "Food Network Safety Tips",
    url: "https://www.foodnetwork.com/kitchen/safety-tips",
    description: "Comprehensive guides to maintaining a safe and healthy kitchen environment."
  },
  {
    name: "Home Safety Smart Check",
    url: "https://www.homesafety.com/kitchen-safety",
    description: "Complete kitchen safety assessment and checklist for your home."
  }
];

interface SkillGuidanceResponse {
  guidance: string;
  videos: Array<{
    id: string;
    title: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    duration: string;
  }>;
}

export default function CookingGuide() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [videos, setVideos] = useState<SkillGuidanceResponse['videos']>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTopicClick = async (topic: typeof COOKING_TOPICS[0]) => {
    setSelectedTopic(topic.id);
    setIsLoading(true);
    setError(null);
    setGuidance(null);

    try {
      // First, fetch cooking guidance
      const guidanceResponse = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "cooking",
          userQuery: `${topic.title}: ${topic.topics.join(", ")}`,
        }),
      });

      if (!guidanceResponse.ok) {
        throw new Error("Failed to fetch guidance");
      }

      const guidanceData = await guidanceResponse.json();
      setGuidance(guidanceData.guidance);
      
      // Then, fetch YouTube videos
      try {
        const videoResponse = await fetch(
          `/api/youtube-search?q=${encodeURIComponent(topic.title)}&category=cooking`
        );
        
        if (!videoResponse.ok) {
          throw new Error("Failed to fetch videos");
        }
        
        const videoData = await videoResponse.json();
        
        if (videoData.items && Array.isArray(videoData.items)) {
          setVideos(videoData.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: {
              url: item.snippet.thumbnails.medium.url,
              width: item.snippet.thumbnails.medium.width,
              height: item.snippet.thumbnails.medium.height
            },
            duration: "Video"
          })));
        }
      } catch (videoError) {
        console.error("Error fetching cooking videos:", videoError);
        // Don't fail the whole operation if videos can't be loaded
      }
    } catch (error) {
      console.error("Error fetching guidance:", error);
      setError("Failed to load cooking guidance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COOKING_TOPICS.map((topic) => (
          <Card
            key={topic.id}
            className={cn(
              "w-full transition-all duration-200",
              "shadow hover:shadow-md",
              "border-2 border-primary/10"
            )}
          >
            <CardHeader 
              className="cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex items-center gap-3">
                <topic.icon className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t p-3 sm:p-6">
              <div className="overflow-y-auto max-h-[200px]">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {topic.topics.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTopic && (() => {
                  const topic = COOKING_TOPICS.find(t => t.id === selectedTopic);
                  if (topic?.icon) {
                    const Icon = topic.icon;
                    return <Icon className="h-6 w-6 text-primary" />;
                  }
                  return null;
                })()}
              {selectedTopic && COOKING_TOPICS.find(t => t.id === selectedTopic)?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {guidance && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="prose prose-slate max-w-none">
                        {guidance.split('\n\n').map((section, idx) => (
                          <p key={idx} className="mb-4">{section}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {videos && videos.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border-t border-muted"></div>
                      <h2 className="text-xl font-semibold flex items-center">
                        <span className="bg-orange-100 text-orange-800 p-1 rounded-md mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                        </span>
                        Cooking Tutorial Videos
                      </h2>
                      <div className="flex-1 border-t border-muted"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Visual step-by-step cooking demonstrations and techniques
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                          <div className="aspect-video w-full">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                              title={video.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <h3 className="font-medium text-md line-clamp-2">{video.title}</h3>
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Beginner</Badge>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Free</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Resources */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Resources</h3>
                  <div className="grid gap-4">
                    {COOKING_RESOURCES.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-primary group-hover:underline flex items-center gap-2">
                            {resource.name}
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* AI Chat Interface */}
      <Card className="w-full shadow border-2 border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ChefHat className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">Cooking AI Assistant</CardTitle>
              <CardDescription>
                Get personalized help with cooking questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t p-3 sm:p-6">
          <div className="overflow-y-auto max-h-[60vh] w-full">
            <ChatInterface category="cooking" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
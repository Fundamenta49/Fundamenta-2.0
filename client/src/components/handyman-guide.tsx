import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Wrench, AlertCircle, Star, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface MaintenanceGuide {
  title: string;
  steps: string[];
  tools: string[];
  difficulty: string;
  time: string;
  notes: string;
  isCustom?: boolean;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

export default function HandymanGuide() {
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customMaintenanceQuery, setCustomMaintenanceQuery] = useState("");

  const [maintenanceTasks, setMaintenanceTasks] = useState<Record<string, MaintenanceGuide>>({
    "sink-ptrap": {
      title: "How to Clear a P-Trap",
      steps: [
        "Place bucket under P-trap to catch water",
        "Loosen slip nuts at both ends of P-trap",
        "Remove P-trap and clean thoroughly",
        "Check for any damaged washers",
        "Reinstall P-trap and tighten nuts",
        "Run water to test for leaks",
      ],
      tools: [
        "Bucket",
        "Adjustable wrench or pliers",
        "Cleaning brush",
        "Rubber gloves",
      ],
      difficulty: "Easy",
      time: "15-20 minutes",
      notes: "If P-trap is corroded or damaged, consider replacement",
    },
    "toilet-plunge": {
      title: "How to Properly Plunge a Toilet",
      steps: [
        "Use proper flanged toilet plunger",
        "Ensure enough water covers plunger head",
        "Create good seal around drain",
        "Push and pull firmly several times",
        "Flush to test drainage",
        "Repeat if necessary",
      ],
      tools: [
        "Flanged toilet plunger",
        "Rubber gloves",
        "Old towels",
      ],
      difficulty: "Easy",
      time: "5-10 minutes",
      notes: "If problem persists after several attempts, may need professional help",
    },
    "drywall-repair": {
      title: "How to Repair Drywall Holes",
      steps: [
        "Clean edges of hole",
        "Cut drywall patch slightly larger than hole",
        "Apply joint compound around edges",
        "Place patch and press firmly",
        "Apply second coat of compound",
        "Sand smooth when dry",
        "Paint to match wall",
      ],
      tools: [
        "Drywall patch",
        "Joint compound",
        "Putty knife",
        "Sandpaper",
        "Paint and brush",
      ],
      difficulty: "Moderate",
      time: "1-2 hours (plus drying time)",
      notes: "For larger holes, may need different repair method",
    },
    "ac-filter": {
      title: "How to Change AC Filter",
      steps: [
        "Turn off AC unit",
        "Locate filter housing",
        "Note airflow direction on old filter",
        "Remove old filter carefully",
        "Insert new filter matching airflow direction",
        "Turn AC back on",
      ],
      tools: [
        "New AC filter (correct size)",
        "Vacuum cleaner (optional)",
      ],
      difficulty: "Easy",
      time: "5-10 minutes",
      notes: "Change every 1-3 months depending on usage and environment",
    },
    "caulk-bathtub": {
      title: "How to Recaulk Bathtub",
      steps: [
        "Remove old caulk completely",
        "Clean surface thoroughly",
        "Let surface dry completely",
        "Apply painter's tape for clean lines",
        "Apply new silicone caulk",
        "Smooth bead with finger or tool",
        "Remove tape while caulk is wet",
      ],
      tools: [
        "Caulk removal tool",
        "Silicone caulk",
        "Caulk gun",
        "Painter's tape",
        "Cleaning supplies",
      ],
      difficulty: "Moderate",
      time: "1-2 hours",
      notes: "Wait 24 hours before using shower/tub",
    }
  });

  const filteredTasks = Object.entries(maintenanceTasks).filter(([id, task]) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.steps.some(step => step.toLowerCase().includes(searchLower)) ||
      task.tools.some(tool => tool.toLowerCase().includes(searchLower))
    );
  });

  const addCustomTask = () => {
    if (customMaintenanceQuery.trim()) {
      const taskId = `custom-${Date.now()}`;
      const newTask: MaintenanceGuide = {
        title: customMaintenanceQuery,
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        difficulty: "Variable",
        time: "Variable",
        notes: "Custom saved task from search",
        isCustom: true
      };

      setMaintenanceTasks(prev => ({
        ...prev,
        [taskId]: newTask
      }));

      fetchYouTubeVideos(customMaintenanceQuery);
      setCustomMaintenanceQuery("");
    }
  };

  const fetchYouTubeVideos = async (searchTerm: string) => {
    setIsLoadingVideos(true);
    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(searchTerm)}&category=home-repair`);
      const data = await response.json();
      
      if (data.error) {
        console.error('YouTube API error:', data.error);
        return;
      }
      
      if (data.items && Array.isArray(data.items)) {
        setVideos(data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url
        })));
      } else {
        console.error('Invalid YouTube API response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleCustomSearch = () => {
    if (customMaintenanceQuery.trim()) {
      fetchYouTubeVideos(customMaintenanceQuery);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            Home Repair Guide
          </CardTitle>
          <CardDescription>
            Step-by-step instructions for common home repairs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Search for any home repair task..."
              value={customMaintenanceQuery}
              onChange={(e) => setCustomMaintenanceQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomSearch();
                }
              }}
              className="w-full mb-4"
            />
            <div className="flex gap-2">
              <Button variant="wood" onClick={handleCustomSearch} className="flex-none">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={addCustomTask}
                disabled={!customMaintenanceQuery.trim()}
                className="flex-none hover:bg-wood hover:text-[#f4f1de]"
              >
                <Star className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Or choose from common repairs:
          </div>

          <Command className="rounded-lg border shadow-md bg-[#F3F4F6]">
            <CommandInput
              placeholder="Search available tasks..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="bg-[#F3F4F6] border-wood/20"
            />
            <CommandList className="bg-[#F3F4F6] border-t border-wood/20">
              <CommandEmpty>No repair tasks found.</CommandEmpty>
              <CommandGroup heading="Common Tasks">
                {filteredTasks.map(([id, task]) => (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => {
                      setSelectedTask(id);
                      fetchYouTubeVideos(task.title);
                    }}
                    className="flex items-center justify-between py-2 hover:bg-wood/5"
                  >
                    <div className="flex items-center gap-2">
                      {task.isCustom ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Wrench className="h-4 w-4" />
                      )}
                      <span>{task.title}</span>
                    </div>
                    <Badge variant="outline">{task.difficulty}</Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {selectedTask && maintenanceTasks[selectedTask] && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  {maintenanceTasks[selectedTask].title}
                </CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Difficulty: {maintenanceTasks[selectedTask].difficulty}</span>
                  <span>Time: {maintenanceTasks[selectedTask].time}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Required Tools:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {maintenanceTasks[selectedTask].tools.map((tool, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{tool}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {maintenanceTasks[selectedTask].steps.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>

                <Alert className="mt-4 bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-orange-800">
                    Note: {maintenanceTasks[selectedTask].notes}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {videos.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 border-t border-muted"></div>
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-md mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                  </span>
                  DIY Home Improvement Videos
                </h2>
                <div className="flex-1 border-t border-muted"></div>
              </div>
              <div className="text-sm text-muted-foreground">
                Step-by-step visual guides for home repairs and maintenance
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

          {isLoadingVideos && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading video guides...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
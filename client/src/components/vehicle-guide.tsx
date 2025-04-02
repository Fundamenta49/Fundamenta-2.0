import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, Info, Car, Wrench, Star, Search, 
  Maximize2, Minimize2, FileText, BarChart4, Calendar, FileCheck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { 
  VehicleDetails, 
  MaintenanceItem, 
  MaintenanceSchedule, 
  RecallInfo, 
  decodeVIN, 
  getRecalls, 
  getMaintenanceSchedule 
} from '@/lib/nhtsa-service';
import { YouTubeVideo, searchVehicleVideos, getYouTubeEmbedUrl } from '@/lib/youtube-service';

interface VehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
}

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Variable';
  estimatedTime: string;
  steps: string[];
  tools: string[];
  icon: React.ReactNode;
  isCustom?: boolean;
}

const COMMON_TASKS: MaintenanceTask[] = [
  {
    id: 'oil-change',
    title: 'Oil Change',
    description: 'Regular oil changes are essential for engine health and performance',
    difficulty: 'Easy',
    estimatedTime: '30-45 min',
    steps: [
      'Warm up engine for 5 minutes',
      'Lift vehicle and secure with jack stands',
      'Locate and remove drain plug',
      'Replace oil filter',
      'Add new oil to proper level',
      'Check for leaks'
    ],
    tools: [
      'Oil filter wrench',
      'Socket set',
      'Oil pan',
      'New oil filter',
      'Fresh oil'
    ],
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'tire-rotation',
    title: 'Tire Rotation',
    description: 'Rotate tires regularly for even wear and extended life',
    difficulty: 'Easy',
    estimatedTime: '45-60 min',
    steps: [
      'Loosen lug nuts while car is on ground',
      'Lift vehicle and secure with jack stands',
      'Remove wheels',
      'Rotate according to pattern',
      'Torque lug nuts to spec'
    ],
    tools: [
      'Car jack',
      'Jack stands',
      'Lug wrench',
      'Torque wrench'
    ],
    icon: <Car className="h-4 w-4 text-blue-500" />
  },
  // ... other common tasks
];

export default function VehicleGuide() {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recalls, setRecalls] = useState<any[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customMaintenanceQuery, setCustomMaintenanceQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(COMMON_TASKS);
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState<VehicleInfo[]>([]);


  // Load saved vehicles from localStorage on component mount
  useEffect(() => {
    const savedVehiclesData = localStorage.getItem('savedVehicles');
    if (savedVehiclesData) {
      try {
        const savedVehiclesParsed = JSON.parse(savedVehiclesData);
        setSavedVehicles(savedVehiclesParsed);
      } catch (e) {
        console.error('Error loading saved vehicles:', e);
      }
    }
  }, []);

  // Save vehicle to localStorage
  const saveVehicle = () => {
    if (!vehicleInfo.vin || !isVehicleInfoComplete()) return;
    
    // Check if this vehicle is already saved
    if (!savedVehicles.some(v => v.vin === vehicleInfo.vin)) {
      const updatedSavedVehicles = [...savedVehicles, vehicleInfo];
      setSavedVehicles(updatedSavedVehicles);
      localStorage.setItem('savedVehicles', JSON.stringify(updatedSavedVehicles));
    }
  };

  // Load selected saved vehicle
  const loadSavedVehicle = (vehicle: VehicleInfo) => {
    setVehicleInfo(vehicle);
  };

  // Populate vehicle information from VIN
  const populateFromVin = async () => {
    if (!vehicleInfo.vin) {
      setError("Please enter a VIN number.");
      return;
    }

    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicleInfo.vin)) {
      setError("Invalid VIN format. VIN must be 17 characters and contain only letters (except I, O, Q) and numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const details = await decodeVIN(vehicleInfo.vin);
      
      // Update vehicle info with data from VIN
      setVehicleInfo(prev => ({
        ...prev,
        make: details.Make,
        model: details.Model,
        year: details.ModelYear
      }));
      
      setVehicleDetails(details);
    } catch (error) {
      console.error('Error populating from VIN:', error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to decode VIN. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleInfo = async () => {
    if (!vehicleInfo.vin) {
      setError("Please enter a VIN number.");
      return;
    }

    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicleInfo.vin)) {
      setError("Invalid VIN format. VIN must be 17 characters and contain only letters (except I, O, Q) and numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    setVehicleDetails(null);
    setRecalls([]);

    try {
      // Step 1: VIN Decode
      const vinUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vehicleInfo.vin)}?format=json`;
      console.log('Fetching VIN details from:', vinUrl);

      const vinResponse = await fetch(vinUrl);
      console.log('VIN Response status:', vinResponse.status);

      if (!vinResponse.ok) {
        throw new Error(`VIN lookup failed: ${vinResponse.status}`);
      }

      const vinData = await vinResponse.json();
      console.log('VIN Data:', vinData);

      if (!vinData.Results || !Array.isArray(vinData.Results)) {
        throw new Error('Invalid response format from VIN lookup');
      }

      // Extract vehicle details
      const details: VehicleDetails = {};
      vinData.Results.forEach((item: any) => {
        if (item.Value && item.Value !== "null" && item.Value !== "Not Applicable") {
          switch (item.Variable) {
            case "Make":
              details.Make = item.Value;
              break;
            case "Model":
              details.Model = item.Value;
              break;
            case "Model Year":
              details.ModelYear = item.Value;
              break;
            case "Body Class":
              details.BodyClass = item.Value;
              break;
            case "Plant Country":
              details.PlantCountry = item.Value;
              break;
            case "Engine Type":
              details.EngineType = item.Value;
              break;
            case "Fuel Type - Primary":
              details.FuelTypePrimary = item.Value;
              break;
            case "Vehicle Type":
              details.VehicleType = item.Value;
              break;
          }
        }
      });

      setVehicleDetails(details);

      // Step 2: Recalls with proper error handling
      const recallUrl = `https://api.nhtsa.gov/recalls/recallsByVIN?vin=${encodeURIComponent(vehicleInfo.vin)}`;
      console.log('Fetching recalls from:', recallUrl);

      const recallResponse = await fetch(recallUrl);
      console.log('Recall Response status:', recallResponse.status);

      if (!recallResponse.ok) {
        throw new Error(`Recall lookup failed: ${recallResponse.status}`);
      }

      const recallData = await recallResponse.json();
      console.log('Recall Data:', recallData);

      if (recallData.results) {
        setRecalls(recallData.results);
      } else {
        setRecalls([]);
      }

    } catch (error) {
      console.error('Error details:', error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to fetch vehicle information. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search
  const filteredTasks = maintenanceTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (customMaintenanceQuery.trim() && isVehicleInfoComplete()) {
      const searchTask: MaintenanceTask = {
        id: `search-${Date.now()}`,
        title: customMaintenanceQuery,
        description: "Custom maintenance task",
        difficulty: 'Variable',
        estimatedTime: 'Variable',
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        icon: <Wrench className="h-4 w-4 text-blue-500" />
      };

      setSelectedTask(searchTask);
      fetchYouTubeVideos(searchTask);
    }
  };

  const addCustomTask = () => {
    if (customMaintenanceQuery.trim() && isVehicleInfoComplete()) {
      const newTask: MaintenanceTask = {
        id: `custom-${Date.now()}`,
        title: customMaintenanceQuery,
        description: "Custom saved maintenance task",
        difficulty: 'Variable',
        estimatedTime: 'Variable',
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        icon: <Star className="h-4 w-4 text-yellow-500" />,
        isCustom: true
      };

      setMaintenanceTasks(prev => [...prev, newTask]);
      setSelectedTask(newTask);
      fetchYouTubeVideos(newTask);
      setCustomMaintenanceQuery("");
    }
  };

  const isVehicleInfoComplete = () => {
    return vehicleInfo.year && vehicleInfo.make && vehicleInfo.model;
  };

  const getVehicleString = () => {
    return `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`.trim();
  };

  const fetchYouTubeVideos = async (task: MaintenanceTask) => {
    if (!isVehicleInfoComplete()) return;

    setIsLoadingVideos(true);
    try {
      const vehicleString = getVehicleString();
      const query = `${vehicleString} ${task.title} tutorial how to`;
      const videoResults = await searchVehicleVideos(query);
      setVideos(videoResults);
      
      // Scroll to the videos section for better UX
      const proseElement = document.querySelector('.prose');
      if (proseElement) {
        window.scrollTo({
          top: proseElement.getBoundingClientRect().top + window.pageYOffset,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Variable':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderGuidanceContent = () => {
    if (isLoadingVideos) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!selectedTask) return null;

    return (
      <div className="relative">
        {videos.length > 0 && (
          <div className={`
            transition-all duration-300 ease-in-out
            ${isVideoFocused ? 
              'fixed inset-0 z-50 bg-background/95 p-6 flex flex-col items-center justify-center' : 
              'relative w-full'
            }
          `}>
            <div className="flex justify-between items-center w-full max-w-4xl mb-4">
              <h3 className={`text-lg font-semibold ${isVideoFocused ? 'text-white' : ''}`}>
                Tutorial Videos
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newFocusState = !isVideoFocused;
                  setIsVideoFocused(newFocusState);
                  
                  // If exiting focus mode, scroll back to videos section
                  if (!newFocusState) {
                    setTimeout(() => {
                      const proseElement = document.querySelector('.prose');
                      if (proseElement) {
                        window.scrollTo({
                          top: proseElement.getBoundingClientRect().top + window.pageYOffset,
                          behavior: 'smooth'
                        });
                      }
                    }, 100); // Small delay to ensure DOM is updated
                  }
                }}
                aria-label={isVideoFocused ? "Exit focus mode" : "Enter focus mode"}
              >
                {isVideoFocused ? (
                  <><Minimize2 className="h-4 w-4 mr-2" /> Exit Focus Mode</>
                ) : (
                  <><Maximize2 className="h-4 w-4 mr-2" /> Enter Focus Mode</>
                )}
              </Button>
            </div>

            <div className={`
              grid gap-4 w-full
              ${isVideoFocused ? 'max-w-4xl' : 'grid-cols-1'}
            `}>
              {videos.map((video) => (
                <div key={video.id} className="space-y-2">
                  <div className="relative aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(video.id)}
                      title={video.title}
                      className="absolute inset-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium line-clamp-2 ${isVideoFocused ? 'text-white' : ''}`}>
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`
          space-y-6 transition-all duration-300
          ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}
        `}>
          <div className="prose prose-gray max-w-none space-y-4">
            <h3 className="text-lg font-semibold mb-4">{selectedTask.title}</h3>
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium mb-2">Steps:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedTask.steps.map((step, idx) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Required Tools:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTask.tools.map((tool, idx) => (
                    <li key={idx} className="text-gray-700">{tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isVideoFocused ? 'overflow-hidden h-screen' : ''}`}>
      <div className={`transition-all duration-300 ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {/* Vehicle Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-[#4D9EAF]" />
              Vehicle Maintenance Guide
            </CardTitle>
            <CardDescription>
              Step-by-step instructions for vehicle maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* VIN Input */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Enter VIN (17 characters)"
                    value={vehicleInfo.vin || ''}
                    onChange={(e) => handleVehicleInfoChange('vin', e.target.value.toUpperCase())}
                    className="w-full font-mono"
                    maxLength={17}
                    aria-label="Vehicle Identification Number"
                  />
                  <Button
                    variant="default"
                    onClick={populateFromVin}
                    disabled={!vehicleInfo.vin || vehicleInfo.vin.length !== 17}
                    className="whitespace-nowrap sm:flex-shrink-0"
                  >
                    <FileCheck className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span>Decode VIN</span>
                  </Button>
                </div>

                {savedVehicles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Saved Vehicles:</p>
                    <div className="flex gap-2 flex-wrap">
                      {savedVehicles.map((vehicle, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => loadSavedVehicle(vehicle)}
                        >
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                <Input
                  type="text"
                  placeholder="Year"
                  value={vehicleInfo.year || ''}
                  onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                  className="w-full"
                  aria-label="Vehicle Year"
                />
                <Input
                  type="text"
                  placeholder="Make"
                  value={vehicleInfo.make || ''}
                  onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                  className="w-full"
                  aria-label="Vehicle Make"
                />
                <Input
                  type="text"
                  placeholder="Model"
                  value={vehicleInfo.model || ''}
                  onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                  className="w-full col-span-2 sm:col-span-1"
                  aria-label="Vehicle Model"
                />
              </div>
              
              {/* Save Vehicle Button */}
              {isVehicleInfoComplete() && vehicleInfo.vin && (
                <Button
                  variant="outline"
                  onClick={saveVehicle}
                  className="w-full md:w-auto"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Save Vehicle
                </Button>
              )}

              <div>
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={customMaintenanceQuery}
                  onChange={(e) => setCustomMaintenanceQuery(e.target.value)}
                  className="w-full mb-2 sm:mb-4"
                  aria-label="Search for vehicle maintenance tasks"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="default"
                    onClick={handleSearch}
                    className="w-full"
                    disabled={!isVehicleInfoComplete() || !customMaintenanceQuery.trim()}
                  >
                    <Search className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Search</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addCustomTask}
                    disabled={!customMaintenanceQuery.trim() || !isVehicleInfoComplete()}
                    className="w-full hover:bg-primary/5"
                  >
                    <Star className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Save Task</span>
                  </Button>
                </div>
              </div>

              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="text-sm"
                />
                <CommandList className="max-h-[200px] sm:max-h-[300px]">
                  <CommandEmpty>No maintenance tasks found.</CommandEmpty>
                  <CommandGroup heading="Common Tasks">
                    {filteredTasks.map((task) => (
                      <CommandItem
                        key={task.id}
                        value={task.id}
                        onSelect={() => {
                          setSelectedTask(task);
                          if (isVehicleInfoComplete()) {
                            fetchYouTubeVideos(task);
                          }
                        }}
                        className="flex items-center justify-between py-3 hover:bg-primary/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0">
                            {task.isCustom ? (
                              <Star className="h-4 w-4 text-yellow-500" />
                            ) : (
                              task.icon
                            )}
                          </span>
                          <span className="truncate">{task.title}</span>
                        </div>
                        <Badge variant="outline" className={`${getDifficultyStyle(task.difficulty)} text-xs ml-2 flex-shrink-0`}>
                          {task.difficulty}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </CardContent>
        </Card>
      </div>

      {renderGuidanceContent()}
    </div>
  );
}
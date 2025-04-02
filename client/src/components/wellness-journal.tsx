import { useState, useEffect, useRef } from "react";
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  Smile,
  Clock,
  Camera,
  Mail,
  Sparkles,
  Heart,
  Brain,
  Book,
  Plus,
  ArrowLeft,
  Save,
  Edit,
  Trash,
  PanelLeftOpen,
  PanelRightOpen,
  Mic,
  MicOff,
  Lock,
  Unlock,
  BarChart,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Tag,
  Download,
  Eraser,
  Loader2,
} from "lucide-react";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { 
  analyzeJournalEntry, 
  analyzeMoodTrends, 
  detectMoodFromText,
  type JournalAnalysis, 
  type MoodData,
  type ToolboxSuggestion,
  type WellnessTrend
} from "@/lib/journal-analysis";
import WordCloud from "./word-cloud";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Chart.js and react-chartjs-2 are not installed, so we'll create a simplified chart component
// Will add back when chart.js dependencies are installed
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip as ChartTooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// Simple replacement for Line chart component
const Line = ({ data, options }: any) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-purple-500 mb-4">Mood Trend Chart</div>
    <div className="text-sm text-muted-foreground">
      (Chart.js visualization will appear here)
    </div>
  </div>
);

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  detectedMood?: {
    label: string;
    emoji: string;
    confidence: number;
  };
  imageUrl?: string;
  timestamp: string;
  futureEmail?: {
    date: string;
    email: string;
  };
  prompt?: string;
  category?: string;
  tags?: string[];
  isPrivate?: boolean;
  analysis?: JournalAnalysis;
}

// Default moods with emojis
const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🌟", label: "Inspired" },
];

// Journal prompt categories and prompts
const journalPrompts = {
  daily: [
    "What's one thing you're grateful for today?",
    "What made you smile today?",
    "What's one small win you had today?",
    "What's something you're looking forward to?",
    "Who made a positive impact on your day?",
  ],
  cbt: [
    "Describe a situation that challenged you today. What thoughts and feelings came up?",
    "What evidence supports and challenges your thoughts about this situation?",
    "How else could you look at this situation?",
    "What would you tell a friend in this situation?",
    "What's a more balanced way to think about this?",
  ],
  healing: [
    "What makes you feel safe and supported?",
    "Write about a moment when you felt strong",
    "What would you tell your younger self?",
    "What boundaries do you want to set or maintain?",
    "What positive changes have you noticed in yourself?",
  ],
  confidence: [
    "List three things you're good at",
    "Describe a challenge you overcame",
    "What qualities do others appreciate in you?",
    "Write about a time you were proud of yourself",
    "What unique perspectives do you bring?",
  ],
  future: [
    "Where do you see yourself in one year?",
    "What dreams would you pursue if you knew you couldn't fail?",
    "What habits would you like to develop?",
    "What would make you feel fulfilled?",
    "What legacy do you want to leave?",
  ],
};

const promptCategories = [
  { value: "daily", label: "Daily Reflection", icon: Sparkles },
  { value: "cbt", label: "Therapeutic Reflection", icon: Brain },
  { value: "healing", label: "Healing & Growth", icon: Heart },
  { value: "confidence", label: "Building Confidence", icon: Smile },
  { value: "future", label: "Future Self", icon: Calendar },
];

// Common tags for journal entries
const commonTags = [
  "work", "school", "health", "family", "friends", 
  "relationship", "creative", "mindfulness", "goals",
  "challenge", "success", "growth", "setback", "self-care"
];

// Component for insight cards in the analysis view
interface InsightCardProps {
  title: string;
  description: string;
  score?: number;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function InsightCard({ title, description, score, icon: Icon, className }: InsightCardProps) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-2 bg-white hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-purple-500" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {score !== undefined && (
        <Progress value={score} className="h-2 bg-purple-100" />
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Component for toolbox suggestions
interface ToolboxCardProps {
  suggestion: ToolboxSuggestion;
}

function ToolboxCard({ suggestion }: ToolboxCardProps) {
  return (
    <div className="border border-purple-100 rounded-lg p-4 bg-purple-50 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-purple-800">{suggestion.title}</h4>
        {suggestion.duration && (
          <Badge variant="outline" className="text-xs bg-white text-purple-700 border-purple-200">
            {suggestion.duration}
          </Badge>
        )}
      </div>
      <p className="text-sm text-purple-700">{suggestion.description}</p>
    </div>
  );
}

// Main Wellness Journal component
export default function WellnessJournal() {
  // State for journal entries and current entry
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    // Load entries from localStorage if available
    const savedEntries = localStorage.getItem('wellness-journal-entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("daily");
  const [currentPrompt, setCurrentPrompt] = useState<string>(journalPrompts.daily[0]);
  const [futureEmail, setFutureEmail] = useState({
    email: "",
    date: "",
  });
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  
  // UI state
  const [showInsights, setShowInsights] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<JournalAnalysis | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("write");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | 'all'>('7days');
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  
  // AI mood detection state
  const [isAiMoodDetectionEnabled, setIsAiMoodDetectionEnabled] = useState(true);
  const [detectedMood, setDetectedMood] = useState<{
    label: string;
    emoji: string;
    confidence: number;
  } | null>(null);
  
  // Get the selected entry
  const selectedEntry = entries.find(entry => entry.id === selectedEntryId) || null;

  // Set up Speech Recognition API
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsSpeechSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognitionAPI();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;
      
      // Set up speech recognition event handlers
      if (speechRecognition.current) {
        speechRecognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          // Update the current entry content with the transcript
          setCurrentEntry(prev => ({
            ...prev,
            content: transcript
          }));
          
          // If AI mood detection is enabled, detect mood from speech text
          if (isAiMoodDetectionEnabled && transcript.length > 20) {
            detectMoodMutation.mutate(transcript);
          }
        };
        
        speechRecognition.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        speechRecognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    // Clean up speech recognition on component unmount
    return () => {
      if (speechRecognition.current) {
        speechRecognition.current.stop();
      }
    };
  }, [isAiMoodDetectionEnabled]);
  
  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('wellness-journal-entries', JSON.stringify(entries));
  }, [entries]);
  
  // Set up smart prompts for entries not created in a while
  useEffect(() => {
    if (entries.length > 0) {
      const lastEntryDate = new Date(entries[0].timestamp);
      const threeDaysAgo = subDays(new Date(), 3);
      
      if (isAfter(threeDaysAgo, lastEntryDate) && !isCreateDialogOpen) {
        // If it's been more than 3 days, suggest a prompt
        const randomPromptCategory = promptCategories[Math.floor(Math.random() * promptCategories.length)].value;
        const prompts = journalPrompts[randomPromptCategory as keyof typeof journalPrompts];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        setSelectedCategory(randomPromptCategory);
        setCurrentPrompt(randomPrompt);
        
        // Show the prompt and open the journal creation dialog
        setTimeout(() => {
          setIsCreateDialogOpen(true);
        }, 1000);
      }
    }
  }, [entries, isCreateDialogOpen]);
  
  // Get mood trends data
  const { data: moodTrends } = useQuery({
    queryKey: ['moodTrends'],
    queryFn: () => analyzeMoodTrends(entries),
    enabled: entries.length > 0
  });
  
  // Mutation for AI mood detection
  const detectMoodMutation = useMutation({
    mutationFn: (text: string) => detectMoodFromText(text),
    onSuccess: (data) => {
      // Transform the mood data to match our state format
      const transformedMood = {
        label: data.mood,
        emoji: data.emoji,
        confidence: data.confidence
      };
      setDetectedMood(transformedMood);
      if (data.confidence > 0.6) {
        setCurrentEntry(prev => ({
          ...prev,
          mood: data.mood
        }));
      }
    }
  });
  
  // Mutation for journal entry analysis
  const analyzeEntryMutation = useMutation({
    mutationFn: (content: string) => analyzeJournalEntry(content),
    onSuccess: (data) => {
      setCurrentAnalysis(data);
      setShowInsights(true);
      setActiveTab("insights");
    }
  });
  
  // Handle image upload
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
  
  // Get a random journal prompt
  const getRandomPrompt = (category: string) => {
    const prompts = journalPrompts[category as keyof typeof journalPrompts];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPrompt(getRandomPrompt(category));
  };
  
  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechRecognition.current?.stop();
      setIsListening(false);
    } else {
      speechRecognition.current?.start();
      setIsListening(true);
    }
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  // Add custom tag
  const addCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags(prev => [...prev, customTag]);
      setCustomTag("");
    }
  };
  
  // Submit journal entry
  const handleEntrySubmit = async () => {
    if (!currentEntry.title || !currentEntry.content) return;

    try {
      // Analyze the journal entry with AI
      analyzeEntryMutation.mutate(currentEntry.content);

      // Create the new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentEntry.title,
        content: currentEntry.content,
        mood: currentEntry.mood,
        detectedMood: detectedMood || undefined,
        imageUrl: previewUrl || undefined,
        timestamp: new Date().toISOString(),
        prompt: currentPrompt,
        category: selectedCategory,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        isPrivate: isPrivate,
        ...(selectedCategory === "future" && futureEmail.email && futureEmail.date
          ? { futureEmail }
          : {}),
      };

      setEntries([newEntry, ...entries]);
      setCurrentEntry({ title: "", content: "", mood: "" });
      setSelectedImage(null);
      setPreviewUrl(null);
      setFutureEmail({ email: "", date: "" });
      setSelectedTags([]);
      setIsPrivate(false);
      setDetectedMood(null);
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };
  
  // Open journal entry view
  const openEntryView = (id: string) => {
    setSelectedEntryId(id);
    setIsViewDialogOpen(true);
  };
  
  // Delete journal entry
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (selectedEntryId === id) {
      setSelectedEntryId(null);
      setIsViewDialogOpen(false);
    }
  };
  
  // Create new journal entry
  const openNewEntry = () => {
    setCurrentEntry({ title: "", content: "", mood: "" });
    setSelectedImage(null);
    setPreviewUrl(null);
    setFutureEmail({ email: "", date: "" });
    setSelectedTags([]);
    setIsPrivate(false);
    setShowInsights(false);
    setCurrentAnalysis(null);
    setDetectedMood(null);
    setActiveTab("write");
    setIsCreateDialogOpen(true);
    
    // Get a random prompt
    setCurrentPrompt(getRandomPrompt(selectedCategory));
  };

  // Handle content change with AI mood detection
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setCurrentEntry(prev => ({
      ...prev,
      content
    }));

    // If content is long enough and AI mood detection is enabled, detect mood
    if (isAiMoodDetectionEnabled && content.length > 50 && !detectedMood) {
      detectMoodMutation.mutate(content);
    }
  };
  
  // Filter entries based on search, tags, and privacy settings
  const filteredEntries = entries.filter(entry => {
    // Filter by search query
    const matchesSearch = searchQuery ? 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) : 
      true;
    
    // Filter by tag
    const matchesTag = filterTag ? 
      entry.tags?.includes(filterTag) : 
      true;
    
    // Don't show private entries in the main view
    const matchesPrivacy = !entry.isPrivate;
    
    return matchesSearch && matchesTag && matchesPrivacy;
  });
  
  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });

  // Filter entries by timeframe
  const timeframeEntries = sortedEntries.filter(entry => {
    if (timeframe === 'all') return true;
    
    const entryDate = parseISO(entry.timestamp);
    const today = new Date();
    const limitDate = timeframe === '7days' ? 
      subDays(today, 7) : 
      subDays(today, 30);
    
    return isAfter(entryDate, limitDate);
  });
  
  // Export journal entries
  const exportJournal = () => {
    const exportData = JSON.stringify(entries, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-journal-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Clear all journal entries
  const clearJournal = () => {
    if (confirm('Are you sure you want to clear all journal entries? This cannot be undone!')) {
      setEntries([]);
      localStorage.removeItem('wellness-journal-entries');
    }
  };
  
  // Prepare chart data for mood trend visualization
  const prepareMoodChartData = () => {
    if (!moodTrends || !moodTrends.moodData || moodTrends.moodData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // Sort by date and get last 7 or 30 days based on timeframe
    const sortedData = [...moodTrends.moodData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const limit = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : sortedData.length;
    const limitedData = sortedData.slice(-limit);
    
    return {
      labels: limitedData.map(d => format(new Date(d.timestamp), 'MMM d')),
      datasets: [
        {
          label: 'Mood Score',
          data: limitedData.map(d => d.score),
          borderColor: 'rgba(147, 51, 234, 0.8)',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: limitedData.map(d => {
            // Color based on mood score
            if (d.score > 75) return 'rgba(34, 197, 94, 1)'; // Green for positive
            if (d.score > 50) return 'rgba(59, 130, 246, 1)'; // Blue for neutral
            if (d.score > 25) return 'rgba(249, 115, 22, 1)'; // Orange for concerned
            return 'rgba(239, 68, 68, 1)'; // Red for negative
          }),
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const data = context.dataset.data[index];
            const moodData = moodTrends?.moodData?.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            ).slice(-context.chart.data.labels.length)[index];
            
            return `${moodData?.emoji || ''} ${moodData?.label || 'Mood'}: ${data}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(147, 51, 234, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            if (value === 0) return 'Low';
            if (value === 50) return 'Neutral';
            if (value === 100) return 'High';
            return '';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Create tag counts for tag cloud
  const getTagCounts = () => {
    const tagCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts).map(([tag, count]) => ({
      text: tag,
      value: count
    }));
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <div className="flex items-center justify-between">
          <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
            <Book className="h-6 w-6 text-purple-600" />
            Wellness Journal
          </FullScreenDialogTitle>
          <div className="flex gap-2">
            <Button 
              onClick={openNewEntry} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
        <FullScreenDialogDescription className="text-purple-600/80">
          Track your thoughts, feelings, and personal growth journey
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        {/* Journal entries view with filters and controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search journal entries..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as '7days' | '30days' | 'all')}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="all">All entries</SelectItem>
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}>
                      {sortOrder === 'newest' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                      {viewMode === 'grid' ? <PanelLeftOpen className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{viewMode === 'grid' ? 'Grid view' : 'List view'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={exportJournal}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export journal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="text-red-500" onClick={clearJournal}>
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all entries</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Tag filters */}
          {entries.length > 0 && (
            <ScrollArea className="whitespace-nowrap pb-2 max-w-full">
              <div className="flex gap-2">
                <Button
                  variant={!filterTag ? "default" : "outline"}
                  size="sm"
                  className={!filterTag ? "bg-purple-600 hover:bg-purple-700" : ""}
                  onClick={() => setFilterTag(null)}
                >
                  All
                </Button>
                {getTagCounts().map(({text}) => (
                  <Button
                    key={text}
                    variant={filterTag === text ? "default" : "outline"}
                    size="sm"
                    className={filterTag === text ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setFilterTag(text)}
                  >
                    #{text}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
          
          {/* Mood trend chart */}
          {moodTrends && moodTrends.moodData && moodTrends.moodData.length > 1 && (
            <Card className="shadow-sm border-purple-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-purple-700">Mood Trends</CardTitle>
                  <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value as '7days' | '30days' | 'all')}>
                    <ToggleGroupItem value="7days" size="sm" className="data-[state=on]:bg-purple-600 data-[state=on]:text-white">7 Days</ToggleGroupItem>
                    <ToggleGroupItem value="30days" size="sm" className="data-[state=on]:bg-purple-600 data-[state=on]:text-white">30 Days</ToggleGroupItem>
                    <ToggleGroupItem value="all" size="sm" className="data-[state=on]:bg-purple-600 data-[state=on]:text-white">All</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <CardDescription className="text-purple-600/80">
                  {moodTrends.insightSummary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={prepareMoodChartData()} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Entry list */}
          {entries.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {timeframeEntries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-all duration-300 border border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm",
                    viewMode === 'list' ? "flex flex-col sm:flex-row" : ""
                  )}
                  onClick={() => openEntryView(entry.id)}
                >
                  <CardHeader className={cn("pb-2", viewMode === 'list' ? "sm:w-1/3" : "")}>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base truncate">{entry.title}</CardTitle>
                      {entry.isPrivate && (
                        <Lock className="h-4 w-4 text-purple-500 ml-2 flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="text-xs flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(entry.timestamp), "PP")}
                      {entry.mood && (
                        <span className="flex items-center gap-1">
                          <span>•</span> 
                          {moods.find(m => m.label === entry.mood)?.emoji || ''} {entry.mood}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={cn("pt-0", viewMode === 'list' ? "sm:w-2/3" : "")}>
                    <p className="text-sm line-clamp-3 text-muted-foreground mb-2">
                      {entry.content}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center py-16 text-center text-muted-foreground">
              <Book className="h-16 w-16 mb-6 opacity-20" />
              <p className="text-lg mb-2">Your journal is empty</p>
              <p className="text-sm mb-6 max-w-md">Start writing to track your wellness journey and gain insights into your emotional patterns</p>
              <Button 
                onClick={openNewEntry} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Entry
              </Button>
            </div>
          )}
        </div>
      </FullScreenDialogBody>

      {/* New Entry Dialog */}
      <FullScreenDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <FullScreenDialogContent themeColor="#a855f7">
          <FullScreenDialogHeader>
            <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
              <Book className="h-6 w-6 text-purple-600" />
              Create New Journal Entry
            </FullScreenDialogTitle>
            <FullScreenDialogDescription className="text-purple-600/80">
              Write freely and reflect on your thoughts and feelings
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 border-b">
              <TabsList className="h-14 w-full justify-start gap-4">
                <TabsTrigger 
                  value="write" 
                  className="data-[state=active]:text-purple-700 data-[state=active]:border-purple-700 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-2 rounded-none h-14"
                >
                  Write
                </TabsTrigger>
                {showInsights && (
                  <TabsTrigger 
                    value="insights" 
                    className="data-[state=active]:text-purple-700 data-[state=active]:border-purple-700 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-2 rounded-none h-14"
                  >
                    AI Insights
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="write" className="mt-0 pt-6">
              <FullScreenDialogBody className="space-y-6">
                {/* Prompt selection */}
                <div className="space-y-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a journaling focus" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2 text-purple-800">Today's Prompt:</p>
                    <p className="text-purple-700">{currentPrompt}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-100"
                      onClick={() => setCurrentPrompt(getRandomPrompt(selectedCategory))}
                    >
                      Try Another Prompt
                    </Button>
                  </div>
                </div>

                {/* Entry title */}
                <div className="space-y-2">
                  <Input
                    placeholder="Entry Title"
                    value={currentEntry.title}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="text-lg font-medium"
                  />
                </div>

                {/* Mood selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="mood-selection" className="text-sm font-medium">
                      How are you feeling?
                    </Label>
                    
                    {/* AI mood detection toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ai-mood"
                        checked={isAiMoodDetectionEnabled}
                        onCheckedChange={setIsAiMoodDetectionEnabled}
                      />
                      <Label htmlFor="ai-mood" className="text-xs text-muted-foreground">
                        AI mood detection
                      </Label>
                    </div>
                  </div>
                  
                  {/* Detected mood indicator */}
                  {detectedMood && (
                    <div className="flex items-center gap-2 mb-2 bg-blue-50 p-2 rounded-md text-sm">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-700">
                        AI detected: {detectedMood.emoji} {detectedMood.label} 
                        <span className="text-blue-500 ml-1">
                          ({Math.round(detectedMood.confidence * 100)}% confidence)
                        </span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {moods.map((mood) => (
                      <Button
                        key={mood.label}
                        variant={currentEntry.mood === mood.label ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setCurrentEntry((prev) => ({ ...prev, mood: mood.label }))
                        }
                        className={currentEntry.mood === mood.label ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        <span className="mr-1">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Journal content with speech-to-text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="journal-content" className="text-sm font-medium">
                      Journal Entry
                    </Label>
                    
                    {/* Speech-to-text button */}
                    {isSpeechSupported && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSpeechRecognition}
                        className={isListening ? "bg-red-50 text-red-500 border-red-200" : ""}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Speak
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <Textarea
                    id="journal-content"
                    placeholder="Write your thoughts here..."
                    className="min-h-[300px] text-base resize-none"
                    value={currentEntry.content}
                    onChange={handleContentChange}
                  />
                </div>

                {/* Tags section */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagSelect(tag)}
                        className={selectedTags.includes(tag) ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={addCustomTag}
                      disabled={!customTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Privacy toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="private-mode"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private-mode" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private Entry
                  </Label>
                </div>

                {/* Future email feature */}
                {selectedCategory === "future" && (
                  <div className="space-y-2 bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-purple-800">
                      <Mail className="h-4 w-4 text-purple-600" />
                      Send to Future Self
                    </h3>
                    <p className="text-sm text-purple-700 mb-4">Schedule this entry to be emailed to you in the future as a reminder of your thoughts today.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={futureEmail.email}
                        onChange={(e) =>
                          setFutureEmail((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                      <Input
                        type="date"
                        min={format(new Date(Date.now() + 86400000), "yyyy-MM-dd")}
                        value={futureEmail.date}
                        onChange={(e) =>
                          setFutureEmail((prev) => ({ ...prev, date: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Image upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Add Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="w-full py-8" asChild>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Choose an image
                          </span>
                        </div>
                      </label>
                    </Button>
                    
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Image preview"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl(null);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </FullScreenDialogBody>
              
              <FullScreenDialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        analyzeEntryMutation.mutate(currentEntry.content);
                      }}
                      variant="outline"
                      disabled={!currentEntry.content || currentEntry.content.length < 20 || analyzeEntryMutation.isPending}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      {analyzeEntryMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Analyze
                    </Button>
                    
                    <Button
                      onClick={handleEntrySubmit}
                      disabled={!currentEntry.title || !currentEntry.content}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </Button>
                  </div>
                </div>
              </FullScreenDialogFooter>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0 pt-6">
              {currentAnalysis ? (
                <FullScreenDialogBody className="space-y-6">
                  {/* Emotional score and sentiment */}
                  <Card className="border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Emotional Wellness</CardTitle>
                      <CardDescription>AI analysis of your emotional state from this entry</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Emotional Balance</span>
                            <span className="font-medium">{Math.round(currentAnalysis.emotionalScore)}%</span>
                          </div>
                          <Progress value={currentAnalysis.emotionalScore} className="h-2.5 bg-purple-100" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-purple-50 rounded-lg text-center">
                            <div className="text-xl mb-1">
                              {currentAnalysis.detectedMood?.emoji || "😊"}
                            </div>
                            <div className="text-sm font-medium">
                              {currentAnalysis.detectedMood?.label || currentAnalysis.sentiment}
                            </div>
                          </div>
                          
                          <div className="col-span-2 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 italic">
                              "{currentAnalysis.affirmation}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Key insights */}
                  {currentAnalysis.keyInsights && currentAnalysis.keyInsights.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {currentAnalysis.keyInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Toolbox suggestions */}
                  {currentAnalysis.toolboxSuggestions && currentAnalysis.toolboxSuggestions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Wellness Toolbox</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentAnalysis.toolboxSuggestions.map((suggestion, index) => (
                          <ToolboxCard key={index} suggestion={suggestion} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Word cloud and frequency */}
                  {currentAnalysis.wordFrequency && Object.keys(currentAnalysis.wordFrequency).length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Word Patterns</CardTitle>
                        <CardDescription>Words that appeared most frequently in your entry</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-40">
                          <WordCloud
                            words={Object.entries(currentAnalysis.wordFrequency).map(([word, count]) => ({
                              text: word,
                              size: count as number,
                            }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Suggestions */}
                  {currentAnalysis.suggestions && currentAnalysis.suggestions.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Reflection Prompts</CardTitle>
                        <CardDescription>Questions to consider based on your entry</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {currentAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 flex-shrink-0">
                                {index + 1}
                              </div>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </FullScreenDialogBody>
              ) : (
                <FullScreenDialogBody className="flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
                    <p>Analyzing your journal entry...</p>
                  </div>
                </FullScreenDialogBody>
              )}
              
              <FullScreenDialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("write")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Writing
                  </Button>
                  
                  <Button
                    onClick={handleEntrySubmit}
                    disabled={!currentEntry.title || !currentEntry.content}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </FullScreenDialogFooter>
            </TabsContent>
          </Tabs>
        </FullScreenDialogContent>
      </FullScreenDialog>
      
      {/* View Entry Dialog */}
      <FullScreenDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <FullScreenDialogContent themeColor="#a855f7">
          {selectedEntry && (
            <>
              <FullScreenDialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
                      <Book className="h-6 w-6 text-purple-600" />
                      {selectedEntry.title}
                      {selectedEntry.isPrivate && (
                        <Lock className="h-4 w-4 text-purple-600 ml-1" />
                      )}
                    </FullScreenDialogTitle>
                    <FullScreenDialogDescription className="text-purple-600/80">
                      {format(new Date(selectedEntry.timestamp), "PPP 'at' p")}
                      {selectedEntry.mood && (
                        <span className="ml-2">• Feeling {moods.find(m => m.label === selectedEntry.mood)?.emoji || ''} {selectedEntry.mood}</span>
                      )}
                    </FullScreenDialogDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all"
                    onClick={() => deleteEntry(selectedEntry.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </FullScreenDialogHeader>
              
              <FullScreenDialogBody className="space-y-6">
                {/* Prompt used */}
                {selectedEntry.prompt && (
                  <Alert variant="default" className="bg-purple-50 border-purple-200">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <AlertTitle>Prompt: {
                      promptCategories.find(cat => cat.value === selectedEntry.category)?.label
                    }</AlertTitle>
                    <AlertDescription className="text-purple-800 italic">
                      "{selectedEntry.prompt}"
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Entry content */}
                <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm bg-gradient-to-r from-white to-purple-50/30">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{selectedEntry.content}</p>
                </div>
                
                {/* Tags */}
                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Entry image */}
                {selectedEntry.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={selectedEntry.imageUrl}
                      alt="Journal entry image"
                      className="max-w-full rounded-lg shadow-sm"
                    />
                  </div>
                )}
                
                {/* Future email reminder */}
                {selectedEntry.futureEmail && (
                  <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Future Email Reminder</AlertTitle>
                    <AlertDescription className="text-blue-800">
                      This entry will be sent to {selectedEntry.futureEmail.email} on {format(new Date(selectedEntry.futureEmail.date), "PPP")}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* AI Analysis */}
                {selectedEntry.analysis && (
                  <Card className="border-purple-100 mt-6 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                        <Brain className="h-5 w-5 text-purple-600" />
                        AI Analysis
                      </CardTitle>
                      <CardDescription className="text-purple-600/70">
                        Insights from your journal entry
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                          <h4 className="font-medium text-sm text-purple-700">Emotional Wellness</h4>
                          <Progress 
                            value={selectedEntry.analysis.emotionalScore} 
                            className="h-2.5 bg-purple-100" 
                          />
                          <p className="text-sm text-purple-800 flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5" />
                            Primary emotion: <span className="font-medium">{selectedEntry.analysis.sentiment}</span>
                          </p>
                        </div>
                        
                        {selectedEntry.analysis.keyInsights && selectedEntry.analysis.keyInsights.length > 0 && (
                          <div className="space-y-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-sm text-blue-700">Key Insights</h4>
                            <ul className="text-sm space-y-1.5">
                              {selectedEntry.analysis.keyInsights.map((insight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                  <span className="text-blue-800">{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </FullScreenDialogBody>
              
              <FullScreenDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-all"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Journal
                </Button>
              </FullScreenDialogFooter>
            </>
          )}
        </FullScreenDialogContent>
      </FullScreenDialog>
    </div>
  );
}
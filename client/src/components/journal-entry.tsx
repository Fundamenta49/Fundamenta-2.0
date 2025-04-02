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
} from "lucide-react";
import { format } from "date-fns";
import { analyzeJournalEntry, analyzeMoodTrends, type JournalAnalysis } from "@/lib/journal-analysis";
import WordCloud from "./word-cloud";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";


interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  imageUrl?: string;
  timestamp: string;
  futureEmail?: {
    date: string;
    email: string;
  };
  prompt?: string;
  category?: string;
}

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

interface InsightCardProps {
  title: string;
  description: string;
  score?: number;
  icon: React.ComponentType<{ className?: string }>;
}

function InsightCard({ title, description, score, icon: Icon }: InsightCardProps) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {score !== undefined && (
        <Progress value={score} className="h-2" />
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function JournalEntry() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
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
  const [showInsights, setShowInsights] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<JournalAnalysis | null>(null);

  const { data: moodTrends } = useQuery({
    queryKey: ['moodTrends'],
    queryFn: () => analyzeMoodTrends(entries),
    enabled: entries.length > 0
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

  const getRandomPrompt = (category: string) => {
    const prompts = journalPrompts[category as keyof typeof journalPrompts];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPrompt(getRandomPrompt(category));
  };

  const handleEntrySubmit = async () => {
    if (!currentEntry.title || !currentEntry.content) return;

    try {
      const analysis = await analyzeJournalEntry(currentEntry.content);
      setCurrentAnalysis(analysis);

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentEntry.title,
        content: currentEntry.content,
        mood: currentEntry.mood,
        imageUrl: previewUrl || undefined,
        timestamp: new Date().toISOString(),
        prompt: currentPrompt,
        category: selectedCategory,
        ...(selectedCategory === "future" && futureEmail.email && futureEmail.date
          ? { futureEmail }
          : {}),
      };

      setEntries([newEntry, ...entries]);
      setCurrentEntry({ title: "", content: "", mood: "" });
      setSelectedImage(null);
      setPreviewUrl(null);
      setFutureEmail({ email: "", date: "" });
      setShowInsights(true);
    } catch (error) {
      console.error('Error analyzing entry:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Entry Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Create New Entry
          </CardTitle>
          <CardDescription>
            Capture your thoughts, feelings, and moments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Today's Prompt:</p>
              <p className="text-muted-foreground">{currentPrompt}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setCurrentPrompt(getRandomPrompt(selectedCategory))}
              >
                Try Another Prompt
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Entry Title"
              value={currentEntry.title}
              onChange={(e) =>
                setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant={currentEntry.mood === mood.label ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setCurrentEntry((prev) => ({ ...prev, mood: mood.label }))
                  }
                >
                  <span className="mr-1">{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Write your thoughts here..."
            className="min-h-[200px]"
            value={currentEntry.content}
            onChange={(e) =>
              setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          {selectedCategory === "future" && (
            <div className="space-y-2 bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send to Future Self
              </h3>
              <Input
                type="email"
                placeholder="Your email"
                value={futureEmail.email}
                onChange={(e) =>
                  setFutureEmail((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                type="date"
                value={futureEmail.date}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) =>
                  setFutureEmail((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <label className="cursor-pointer">
                <Button variant="outline" className="relative">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </label>
            </div>
            <Button onClick={handleEntrySubmit}>Save Entry</Button>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      {showInsights && currentAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Analysis and suggestions based on your journal entry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <InsightCard
                title="Emotional Score"
                description={`Your entry shows ${currentAnalysis.sentiment} sentiment`}
                score={currentAnalysis.emotionalScore}
                icon={Heart}
              />
              <InsightCard
                title="Mood Trend"
                description={currentAnalysis.moodTrend}
                icon={Sparkles}
              />
            </div>

            <div>
              <h3 className="font-medium mb-4">Word Cloud</h3>
              <WordCloud
                words={Object.entries(currentAnalysis.wordFrequency).map(([text, size]) => ({
                  text,
                  size: Math.min(size * 2, 10)
                }))}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">AI Suggestions</h3>
              <div className="space-y-2">
                {currentAnalysis.suggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            {moodTrends && moodTrends.trends && moodTrends.trends.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Mood Trends</h3>
                <div className="space-y-2">
                  {moodTrends.trends.map((trend, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {trend}
                    </p>
                  ))}
                </div>
                {moodTrends.recommendations && moodTrends.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    {moodTrends.recommendations.map((rec, index) => (
                      <Alert key={index} className="mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Past Entries Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Journal History
          </CardTitle>
          <CardDescription>Your past reflections and memories</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(entry.timestamp), "PPp")}
                      </div>
                    </div>
                    {entry.mood && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Smile className="h-4 w-4" />
                        Feeling {entry.mood}
                      </span>
                    )}
                    {entry.prompt && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Prompt: </span>
                        {entry.prompt}
                      </div>
                    )}
                    {entry.futureEmail && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Will be sent to {entry.futureEmail.email} on{" "}
                        {format(new Date(entry.futureEmail.date), "PP")}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="whitespace-pre-wrap mb-4">{entry.content}</p>
                    {entry.imageUrl && (
                      <img
                        src={entry.imageUrl}
                        alt="Journal entry"
                        className="rounded-lg w-full h-auto object-cover"
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
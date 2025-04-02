import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  RefreshCw,
  Moon,
  Sun,
  Wind,
  Waves,
} from "lucide-react";

const meditationSessions = [
  {
    title: "Mindful Breathing",
    description: "Focus on your breath to center yourself",
    duration: 5,
    guide: [
      "Find a comfortable position",
      "Close your eyes gently",
      "Focus on your natural breath",
      "Notice the sensation of breathing",
      "If your mind wanders, return focus to breath",
    ],
  },
  {
    title: "Body Scan",
    description: "Progressive relaxation from head to toe",
    duration: 10,
    guide: [
      "Lie down comfortably",
      "Focus attention on your toes",
      "Move attention up through your body",
      "Notice any tension and release it",
      "Maintain steady, relaxed breathing",
    ],
  },
  {
    title: "Loving-Kindness",
    description: "Cultivate compassion and positive emotions",
    duration: 15,
    guide: [
      "Start with self-compassion",
      "Extend well-wishes to loved ones",
      "Include neutral people",
      "Embrace challenging relationships",
      "Extend to all beings",
    ],
  },
];

const ambientSounds = [
  { name: "Night", icon: Moon },
  { name: "Day", icon: Sun },
  { name: "Wind", icon: Wind },
  { name: "Ocean", icon: Waves },
];

export default function MeditationGuide() {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedSession.duration * 60);
  const [volume, setVolume] = useState(50);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setTimeRemaining(selectedSession.duration * 60);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meditation Timer</CardTitle>
            <CardDescription>
              {selectedSession.title} - {selectedSession.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-4xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            
            <Progress 
              value={(timeRemaining / (selectedSession.duration * 60)) * 100} 
            />

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ambient Sounds</CardTitle>
            <CardDescription>
              Enhance your meditation with calming sounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {ambientSounds.map((sound) => (
                <Button
                  key={sound.name}
                  variant={activeSound === sound.name ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setActiveSound(
                    activeSound === sound.name ? null : sound.name
                  )}
                >
                  <sound.icon className="h-4 w-4 mr-2" />
                  {sound.name}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Volume</Label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meditation Sessions</CardTitle>
          <CardDescription>
            Choose from our guided meditation sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {meditationSessions.map((session) => (
                <Card
                  key={session.title}
                  className={`cursor-pointer transition-colors ${
                    selectedSession.title === session.title
                      ? "border-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedSession(session);
                    resetTimer();
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>
                      {session.duration} minutes - {session.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-1">
                      {session.guide.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
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

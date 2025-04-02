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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Target,
  Video,
  Bell,
  Star,
  Crown,
  Award,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FitnessGoal {
  id: string;
  type: "weightlifting" | "yoga" | "running" | "meditation";
  target: number;
  current: number;
  unit: string;
  deadline: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  unlocked: boolean;
}

export default function FitnessProgress() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const achievements: Achievement[] = [
    {
      id: "first-workout",
      title: "First Step",
      description: "Complete your first workout",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      progress: 100,
      unlocked: true,
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      progress: (streak / 7) * 100,
      unlocked: streak >= 7,
    },
    {
      id: "all-activities",
      title: "Renaissance Athlete",
      description: "Try all workout types",
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      progress: 75,
      unlocked: false,
    },
  ];

  const enableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll receive updates about your fitness goals",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: "Could not enable notifications",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Fitness Journey
          </CardTitle>
          <CardDescription>Track your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Streak</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streak} days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Fitness Points</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{points} XP</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Level</CardTitle>
                  <Award className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Level {Math.floor(points / 1000) + 1}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock rewards as you progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked ? "bg-primary/5" : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      achievement.unlocked ? "bg-primary/10" : "bg-muted-foreground/10"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <Progress value={achievement.progress} className="mt-2" />
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="default">Unlocked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Stay motivated with timely reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={enableNotifications}
            disabled={notificationsEnabled}
            className="w-full"
          >
            {notificationsEnabled ? "Notifications Enabled" : "Enable Notifications"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

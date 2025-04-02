import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Star,
  Trophy,
  Play,
  RefreshCw,
  Dumbbell,
  Heart,
  Activity,
  MoveVertical,
  Timer,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Yoga,
  Bird as YogaIcon,
} from "lucide-react";
import { FitnessProfile } from "./fitness-profile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: "star" | "trophy" | "award";
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  description: string;
  technique?: string;
  mistakes?: string[];
  modifications?: {
    easier: string;
    harder: string;
  };
  goalAlignment?: string;
  videoId?: string;
  illustration?: string;
}

interface WorkoutPlan {
  exercises: Exercise[];
  schedule: string;
  progressionPlan?: string;
  tips: {
    general?: string[];
    goalSpecific?: {
      [key: string]: string[];
    };
    safety?: string[];
  };
}

interface FitnessPlanProps {
  profile: FitnessProfile;
}

export default function FitnessPlan({ profile }: FitnessPlanProps) {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingVideos, setIsValidatingVideos] = useState(false);
  const [failedValidations, setFailedValidations] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initializeProfile = async () => {
      const baseAchievements: Achievement[] = [
        {
          id: "profile-created",
          title: "Getting Started",
          description: "Created your fitness profile",
          isUnlocked: true,
          icon: "star"
        }
      ];

      profile.goals.forEach(goal => {
        baseAchievements.push({
          id: `goal-${goal.toLowerCase().replace(/\s+/g, '-')}`,
          title: `${goal} Champion`,
          description: `Make progress in your ${goal.toLowerCase()} journey`,
          isUnlocked: false,
          icon: "trophy"
        });
      });

      setAchievements(baseAchievements);
      await loadSavedWorkoutPlan();
    };

    initializeProfile();
  }, [profile]);

  const validateYouTubeVideo = async (videoId: string): Promise<boolean> => {
    if (failedValidations.has(videoId)) {
      return false;
    }

    try {
      const response = await fetch(`/api/youtube-search?videoId=${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to validate video');
      }
      const data = await response.json();

      if (!data.isValid) {
        setFailedValidations(prev => new Set([...prev, videoId]));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating YouTube video:', error);
      setFailedValidations(prev => new Set([...prev, videoId]));
      return false;
    }
  };

  const loadSavedWorkoutPlan = async () => {
    try {
      const savedPlan = localStorage.getItem('workoutPlan');
      if (savedPlan) {
        const plan = JSON.parse(savedPlan);
        setWorkoutPlan(plan);

        setFailedValidations(new Set());
        setIsValidatingVideos(true);

        const validatedPlan = { ...plan };
        const validationPromises = validatedPlan.exercises.map(async (exercise) => {
          if (exercise.videoId) {
            const isValid = await validateYouTubeVideo(exercise.videoId);
            if (!isValid) {
              exercise.videoId = undefined;
            }
          }
        });

        await Promise.all(validationPromises);
        setWorkoutPlan(validatedPlan);
        localStorage.setItem('workoutPlan', JSON.stringify(validatedPlan));
        setIsValidatingVideos(false);
      } else {
        await generateWorkoutPlan();
      }
    } catch (error) {
      console.error('Error loading saved workout plan:', error);
      setIsValidatingVideos(false);
      await generateWorkoutPlan();
    }
  };

  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    setFailedValidations(new Set());

    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            fitnessLevel: profile.fitnessLevel,
            goals: profile.goals,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout plan');
      }

      const plan = await response.json();
      setWorkoutPlan(plan);

      setIsValidatingVideos(true);
      const validationPromises = plan.exercises.map(async (exercise) => {
        if (exercise.videoId) {
          const isValid = await validateYouTubeVideo(exercise.videoId);
          if (!isValid) {
            exercise.videoId = undefined;
          }
        }
      });

      await Promise.all(validationPromises);
      setWorkoutPlan({ ...plan });
      localStorage.setItem('workoutPlan', JSON.stringify(plan));

      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized fitness plan is ready.",
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsValidatingVideos(false);
    }
  };

  const getIconComponent = (iconName: Achievement["icon"]) => {
    switch (iconName) {
      case "star":
        return <Star className="h-5 w-5" />;
      case "trophy":
        return <Trophy className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
    }
  };

  const getExerciseIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "dumbbell":
        return <Dumbbell className="h-6 w-6 text-primary" />;
      case "heart":
        return <Heart className="h-6 w-6 text-red-500" />;
      case "activity":
        return <Activity className="h-6 w-6 text-green-500" />;
      case "movevertical":
        return <MoveVertical className="h-6 w-6 text-blue-500" />;
      case "timer":
        return <Timer className="h-6 w-6 text-orange-500" />;
      case "zap":
        return <Zap className="h-6 w-6 text-yellow-500" />;
      case "yoga":
        return <YogaIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <Dumbbell className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Personalized Fitness Plan</CardTitle>
              <CardDescription>
                Track your progress and follow your customized workout routine
              </CardDescription>
            </div>
            <Button
              onClick={() => generateWorkoutPlan()}
              disabled={isLoading || isValidatingVideos}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Generating...' : 'Regenerate Plan'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Weekly Progress</h3>
              <Progress value={weeklyProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {weeklyProgress}% of weekly goals completed
              </p>
            </div>

            {workoutPlan && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Workout Schedule</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {workoutPlan.schedule}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Exercises</h3>
                  {isValidatingVideos && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Validating video tutorials...
                    </p>
                  )}
                  <div className="grid gap-4">
                    {workoutPlan.exercises.map((exercise, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getExerciseIcon(exercise.illustration)}
                              <div>
                                <CardTitle className="text-xl">{exercise.name}</CardTitle>
                                <CardDescription>
                                  {exercise.sets} sets × {exercise.reps} reps
                                </CardDescription>
                              </div>
                            </div>
                            {exercise.videoId && (
                              <a
                                href={`https://www.youtube.com/watch?v=${exercise.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-primary hover:text-primary/80"
                              >
                                <Play className="h-5 w-5 mr-1" />
                                Watch Tutorial
                              </a>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                            <div>
                              <h4 className="font-medium mb-2">Instructions</h4>
                              <p className="text-sm">{exercise.description}</p>
                            </div>
                          </div>

                          {exercise.technique && (
                            <div className="flex items-start gap-3">
                              <ChevronUp className="h-5 w-5 mt-1 flex-shrink-0 text-green-500" />
                              <div>
                                <h4 className="font-medium mb-2">Proper Form</h4>
                                <p className="text-sm">{exercise.technique}</p>
                              </div>
                            </div>
                          )}

                          {exercise.mistakes && exercise.mistakes.length > 0 && (
                            <div className="flex items-start gap-3">
                              <ChevronDown className="h-5 w-5 mt-1 flex-shrink-0 text-red-500" />
                              <div>
                                <h4 className="font-medium mb-2">Common Mistakes to Avoid</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {exercise.mistakes.map((mistake, i) => (
                                    <li key={i}>{mistake}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {exercise.modifications && (
                            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                              <div>
                                <p className="font-medium text-green-600 dark:text-green-400 mb-2">Easier Version</p>
                                <p>{exercise.modifications.easier}</p>
                              </div>
                              <div>
                                <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Challenge Version</p>
                                <p>{exercise.modifications.harder}</p>
                              </div>
                            </div>
                          )}

                          {exercise.goalAlignment && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">How This Helps Your Goals</h4>
                              <p className="text-sm">{exercise.goalAlignment}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {workoutPlan.progressionPlan && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Progression Plan</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {workoutPlan.progressionPlan}
                    </p>
                  </div>
                )}

                <div className="grid gap-4">
                  {workoutPlan.tips.general && workoutPlan.tips.general.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">General Tips</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {workoutPlan.tips.general.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {workoutPlan.tips.goalSpecific && Object.entries(workoutPlan.tips.goalSpecific).map(([goal, tips]) => (
                    <div key={goal}>
                      <h3 className="text-lg font-semibold mb-2">Tips for {goal}</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {workoutPlan.tips.safety && workoutPlan.tips.safety.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Safety Guidelines</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {workoutPlan.tips.safety.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.isUnlocked
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getIconComponent(achievement.icon)}
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
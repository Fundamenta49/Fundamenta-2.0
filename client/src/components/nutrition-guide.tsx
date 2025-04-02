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
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Apple,
  Brain,
  Dumbbell,
  Moon,
  Heart,
  Droplets,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Refrigerator } from "lucide-react";

interface HabitTracker {
  water: number;
  sleep: number;
  exercise: number;
  meditation: number;
}

interface QuizAnswers {
  nutrition: {
    fruitsAndVegetables: string;
    sugaryDrinks: string;
    processedFood: string;
    skipMeals: string;
  };
  activity: {
    physicalActivity: string;
    limitations: string;
    dailyActivity: string;
  };
  sleep: {
    hoursOfSleep: string;
    feelingRested: string;
    sleepTrouble: string;
  };
  mentalHealth: {
    stressLevel: string;
    relaxationActivities: string;
    anxiety: string;
  };
  healthcare: {
    lastCheckup: string;
    provider: string;
    insurance: string;
  };
}

interface ResultsBasedRecommendation {
  category: string;
  level: 'good' | 'moderate' | 'needs-improvement';
  advice: string[];
  resources: {
    title: string;
    description: string;
    link?: string;
  }[];
  actionSteps: string[];
}

const initialQuizState: QuizAnswers = {
  nutrition: {
    fruitsAndVegetables: "",
    sugaryDrinks: "",
    processedFood: "",
    skipMeals: "",
  },
  activity: {
    physicalActivity: "",
    limitations: "",
    dailyActivity: "",
  },
  sleep: {
    hoursOfSleep: "",
    feelingRested: "",
    sleepTrouble: "",
  },
  mentalHealth: {
    stressLevel: "",
    relaxationActivities: "",
    anxiety: "",
  },
  healthcare: {
    lastCheckup: "",
    provider: "",
    insurance: "",
  },
};

export default function NutritionGuide() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof QuizAnswers>("nutrition");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(initialQuizState);
  const [recommendations, setRecommendations] = useState<ResultsBasedRecommendation[]>([]);
  const [habits, setHabits] = useState<HabitTracker>({
    water: 0,
    sleep: 7,
    exercise: 0,
    meditation: 0,
  });

  const generateRecommendations = (answers: QuizAnswers): ResultsBasedRecommendation[] => {
    const recommendations: ResultsBasedRecommendation[] = [];

    // Nutrition Recommendations
    const nutritionScore = ['A', 'B', 'C'].indexOf(answers.nutrition.fruitsAndVegetables);
    recommendations.push({
      category: 'Nutrition',
      level: nutritionScore === 2 ? 'good' : nutritionScore === 1 ? 'moderate' : 'needs-improvement',
      advice: answers.nutrition.fruitsAndVegetables === 'A' ? [
        "Increase your daily fruit and vegetable intake",
        "Start with adding one serving of vegetables to each meal",
        "Try meal prepping to make healthy options more accessible"
      ] : answers.nutrition.fruitsAndVegetables === 'B' ? [
        "You're on the right track with your produce intake",
        "Try adding one more serving to reach the recommended amount",
        "Experiment with different types of fruits and vegetables"
      ] : [
        "Great job meeting your fruit and vegetable needs!",
        "Keep up the variety in your diet",
        "Consider sharing your healthy eating tips with others"
      ],
      resources: [
        {
          title: "Meal Planning Guide",
          description: "Easy ways to incorporate more produce into your meals",
          link: "/resources/meal-planning"
        },
        {
          title: "Seasonal Produce Guide",
          description: "Find what's fresh and affordable in your area",
          link: "/resources/seasonal-produce"
        }
      ],
      actionSteps: [
        "Create a weekly meal plan",
        "Stock up on frozen vegetables for convenience",
        "Try one new fruit or vegetable each week"
      ]
    });

    // Physical Activity Recommendations
    const activityScore = ['A', 'B', 'C'].indexOf(answers.activity.physicalActivity);
    recommendations.push({
      category: 'Physical Activity',
      level: activityScore === 2 ? 'good' : activityScore === 1 ? 'moderate' : 'needs-improvement',
      advice: answers.activity.physicalActivity === 'A' ? [
        "Start with small, achievable exercise goals",
        "Focus on activities you enjoy",
        "Build up gradually to avoid injury"
      ] : answers.activity.physicalActivity === 'B' ? [
        "You have a good foundation with regular exercise",
        "Consider adding variety to your routine",
        "Gradually increase intensity or duration"
      ] : [
        "Excellent work maintaining regular physical activity!",
        "Focus on maintaining this healthy habit",
        "Consider new challenges to keep motivated"
      ],
      resources: [
        {
          title: "Beginner's Workout Guide",
          description: "Simple exercises to get started",
          link: "/resources/beginner-workout"
        },
        {
          title: "Exercise Library",
          description: "Video demonstrations of proper form",
          link: "/resources/exercise-library"
        }
      ],
      actionSteps: [
        "Schedule specific times for exercise",
        "Find a workout buddy for accountability",
        "Track your progress in a fitness journal"
      ]
    });

    // Sleep Recommendations
    const sleepScore = ['A', 'B', 'C'].indexOf(answers.sleep.hoursOfSleep);
    recommendations.push({
      category: 'Sleep & Energy',
      level: sleepScore === 2 ? 'good' : sleepScore === 1 ? 'moderate' : 'needs-improvement',
      advice: answers.sleep.hoursOfSleep === 'A' ? [
        "Prioritize getting more sleep each night",
        "Create a relaxing bedtime routine",
        "Limit screen time before bed"
      ] : answers.sleep.hoursOfSleep === 'B' ? [
        "You're close to getting enough sleep",
        "Focus on sleep quality improvements",
        "Maintain consistent sleep/wake times"
      ] : [
        "You're getting good sleep duration",
        "Continue your healthy sleep habits",
        "Fine-tune your sleep environment"
      ],
      resources: [
        {
          title: "Sleep Hygiene Guide",
          description: "Tips for better sleep quality",
          link: "/resources/sleep-hygiene"
        },
        {
          title: "Relaxation Techniques",
          description: "Methods to help you unwind",
          link: "/resources/relaxation"
        }
      ],
      actionSteps: [
        "Set a consistent bedtime",
        "Create a calming bedroom environment",
        "Practice relaxation techniques before bed"
      ]
    });

    // Mental Health Recommendations
    const stressScore = ['A', 'B', 'C'].indexOf(answers.mentalHealth.stressLevel);
    recommendations.push({
      category: 'Mental Well-being',
      level: stressScore === 2 ? 'good' : stressScore === 1 ? 'moderate' : 'needs-improvement',
      advice: answers.mentalHealth.stressLevel === 'A' ? [
        "Learn stress management techniques",
        "Consider speaking with a mental health professional",
        "Practice daily relaxation exercises"
      ] : answers.mentalHealth.stressLevel === 'B' ? [
        "You're managing stress relatively well",
        "Build on your existing coping strategies",
        "Practice preventive stress management"
      ] : [
        "Great job managing your stress levels",
        "Continue your effective coping strategies",
        "Share your stress management tips with others"
      ],
      resources: [
        {
          title: "Stress Management Guide",
          description: "Effective techniques for managing stress",
          link: "/resources/stress-management"
        },
        {
          title: "Mental Health Resources",
          description: "Professional support options",
          link: "/resources/mental-health"
        }
      ],
      actionSteps: [
        "Practice daily mindfulness",
        "Schedule regular breaks during the day",
        "Maintain a stress journal"
      ]
    });

    // Healthcare Recommendations
    const checkupScore = ['A', 'B', 'C'].indexOf(answers.healthcare.lastCheckup);
    recommendations.push({
      category: 'Preventive Healthcare',
      level: checkupScore === 2 ? 'good' : checkupScore === 1 ? 'moderate' : 'needs-improvement',
      advice: answers.healthcare.lastCheckup === 'A' ? [
        "Schedule a check-up as soon as possible",
        "Start tracking your health metrics",
        "Research healthcare providers in your area"
      ] : answers.healthcare.lastCheckup === 'B' ? [
        "You're maintaining regular check-ups",
        "Plan your next appointment",
        "Keep track of health concerns to discuss"
      ] : [
        "Excellent job staying on top of your health!",
        "Continue regular check-ups",
        "Stay informed about preventive care"
      ],
      resources: [
        {
          title: "Preventive Care Guide",
          description: "Recommended screenings by age",
          link: "/resources/preventive-care"
        },
        {
          title: "Healthcare Provider Directory",
          description: "Find providers in your area",
          link: "/resources/provider-directory"
        }
      ],
      actionSteps: [
        "Schedule regular check-ups",
        "Maintain health records",
        "Stay up to date with vaccinations"
      ]
    });

    return recommendations;
  };

  const handleQuizSubmit = () => {
    const newRecommendations = generateRecommendations(quizAnswers);
    setRecommendations(newRecommendations);
    setQuizCompleted(true);
  };

  const updateHabit = (habit: keyof HabitTracker, value: number) => {
    setHabits((prev) => ({
      ...prev,
      [habit]: value,
    }));
  };

  const updateQuizAnswer = (section: keyof QuizAnswers, question: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: answer
      }
    }));
  };

  const renderQuizSection = () => {
    switch (currentSection) {
      case "nutrition":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How many servings of fruits and vegetables do you eat per day?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "A")}
                >0-1</Button>
                <Button
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "B")}
                >2-3</Button>
                <Button
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "C")}
                >4+</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-2">How often do you drink sugary drinks?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.nutrition.sugaryDrinks === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "A")}
                >Daily</Button>
                <Button
                  variant={quizAnswers.nutrition.sugaryDrinks === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "B")}
                >A few times a week</Button>
                <Button
                  variant={quizAnswers.nutrition.sugaryDrinks === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "C")}
                >Rarely/Never</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={true}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("activity")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How often do you engage in physical activity?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.activity.physicalActivity === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "A")}
                >Rarely/Never</Button>
                <Button
                  variant={quizAnswers.activity.physicalActivity === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "B")}
                >2-3 times a week</Button>
                <Button
                  variant={quizAnswers.activity.physicalActivity === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "C")}
                >4+ times a week</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("nutrition")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("sleep")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "sleep":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How many hours of sleep do you get on average?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.sleep.hoursOfSleep === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "A")}
                >Less than 5</Button>
                <Button
                  variant={quizAnswers.sleep.hoursOfSleep === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "B")}
                >5-7</Button>
                <Button
                  variant={quizAnswers.sleep.hoursOfSleep === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "C")}
                >7+</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("activity")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("mentalHealth")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "mentalHealth":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How often do you feel stressed or overwhelmed?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.mentalHealth.stressLevel === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "A")}
                >Daily</Button>
                <Button
                  variant={quizAnswers.mentalHealth.stressLevel === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "B")}
                >A few times a week</Button>
                <Button
                  variant={quizAnswers.mentalHealth.stressLevel === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "C")}
                >Rarely</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("sleep")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("healthcare")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "healthcare":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">When was your last full health check-up?</h3>
              <div className="space-x-2">
                <Button
                  variant={quizAnswers.healthcare.lastCheckup === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "A")}
                >Over a year ago / Never</Button>
                <Button
                  variant={quizAnswers.healthcare.lastCheckup === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "B")}
                >6-12 months ago</Button>
                <Button
                  variant={quizAnswers.healthcare.lastCheckup === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "C")}
                >Within 6 months</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("mentalHealth")}
              >
                Previous
              </Button>
              <Button
                onClick={handleQuizSubmit}
              >
                Complete Quiz
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wellness Quiz Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Wellness Quiz
          </CardTitle>
          <CardDescription>
            Take our comprehensive wellness assessment to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!quizCompleted ? (
            <>
              <div className="mb-4">
                <Progress value={(Object.values(quizAnswers[currentSection]).filter(Boolean).length / 3) * 100} />
              </div>
              {renderQuizSection()}
            </>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`border-l-4 ${
                  rec.level === 'good' ? 'border-l-green-500' :
                  rec.level === 'moderate' ? 'border-l-yellow-500' :
                  'border-l-red-500'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {rec.category}
                      <Badge variant={
                        rec.level === 'good' ? 'default' :
                        rec.level === 'moderate' ? 'secondary' :
                        'destructive'
                      } className="ml-2">
                        {rec.level === 'good' ? 'Good' :
                         rec.level === 'moderate' ? 'Moderate' :
                         'Needs Improvement'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {rec.advice.map((advice, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{advice}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Action Steps:</h4>
                      <ul className="space-y-2">
                        {rec.actionSteps.map((step, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Helpful Resources:</h4>
                      <div className="grid gap-2">
                        {rec.resources.map((resource, i) => (
                          <div key={i} className="p-2 rounded-lg bg-stone-50/80 border border-gray-200">
                            <h5 className="font-medium text-sm">{resource.title}</h5>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                onClick={() => {
                  setQuizCompleted(false);
                  setQuizAnswers(initialQuizState);
                  setCurrentSection("nutrition");
                }}
                className="w-full"
              >
                Retake Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Habit Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Daily Habit Tracker
          </CardTitle>
          <CardDescription>
            Track your daily wellness habits to build healthy routines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Water Intake (cups)</label>
                <span>{habits.water}/8</span>
              </div>
              <Slider
                value={[habits.water]}
                onValueChange={(value) => updateHabit("water", value[0])}
                max={8}
                step={1}
              />
              <Progress value={(habits.water / 8) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Sleep (hours)</label>
                <span>{habits.sleep}</span>
              </div>
              <Slider
                value={[habits.sleep]}
                onValueChange={(value) => updateHabit("sleep", value[0])}
                min={4}
                max={12}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Exercise (minutes)</label>
                <span>{habits.exercise}/30</span>
              </div>
              <Slider
                value={[habits.exercise]}
                onValueChange={(value) => updateHabit("exercise", value[0])}
                max={30}
                step={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Small Changes Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            Small Changes for Big Results
          </CardTitle>
          <CardDescription>
            Simple, actionable tips to improve your health and wellness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {healthTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tip.icon className="h-5 w-5" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {/* This section is removed because it's redundant with the new detailed recommendations */}
    </div>
  );
}

const healthTips = [
  {
    title: "Morning Ritual",
    description: "Start your day with a glass of water and 5 minutes of stretching",
    icon: Brain,
  },
  {
    title: "Mindful Eating",
    description: "Take time to eat slowly and without distractions",
    icon: Apple,
  },
  {
    title: "Movement Breaks",
    description: "Stand up and move for 2-3 minutes every hour",
    icon: Dumbbell,
  },
  {
    title: "Better Sleep",
    description: "Create a relaxing bedtime routine without screens",
    icon: Moon,
  },
];
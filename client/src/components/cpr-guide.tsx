import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Award, CheckCircle2, Heart } from "lucide-react";

interface CPRStep {
  id: number;
  title: string;
  description: string;
  keyPoints: string[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

const cprSteps: CPRStep[] = [
  {
    id: 1,
    title: "Check the Scene",
    description: "Before starting CPR, ensure the scene is safe for you and the victim.",
    keyPoints: [
      "Look for immediate dangers",
      "Check for fire, traffic, or electrical hazards",
      "Ensure you're not putting yourself at risk",
    ],
    quiz: {
      question: "What should you check first before approaching someone who needs CPR?",
      options: [
        "The person's pulse",
        "Scene safety",
        "Your phone battery",
        "Your CPR certification",
      ],
      correctAnswer: 1,
    },
  },
  {
    id: 2,
    title: "Check Responsiveness",
    description: "Check if the person is responsive by tapping and shouting.",
    keyPoints: [
      "Tap shoulders firmly",
      "Ask loudly 'Are you okay?'",
      "Look for any movement or response",
    ],
    quiz: {
      question: "How should you check if someone is responsive?",
      options: [
        "Wait and see if they wake up",
        "Shake them violently",
        "Tap their shoulders and ask if they're okay",
        "Start CPR immediately",
      ],
      correctAnswer: 2,
    },
  },
  {
    id: 3,
    title: "Call 911",
    description: "If the person is unresponsive, call 911 or ask someone else to call.",
    keyPoints: [
      "Call 911 immediately",
      "Put phone on speaker",
      "Follow dispatcher instructions",
      "Send someone to get an AED if available",
    ],
    quiz: {
      question: "When should you call 911?",
      options: [
        "After performing CPR",
        "Only if the person doesn't wake up after CPR",
        "Immediately if the person is unresponsive",
        "After checking their pulse",
      ],
      correctAnswer: 2,
    },
  },
  {
    id: 4,
    title: "Check Breathing",
    description: "Look for normal breathing for no more than 10 seconds.",
    keyPoints: [
      "Tilt head back slightly",
      "Look for chest movement",
      "Listen for breathing sounds",
      "Feel for breath on your cheek",
    ],
    quiz: {
      question: "How long should you check for breathing?",
      options: [
        "No more than 10 seconds",
        "At least 30 seconds",
        "1-2 minutes",
        "Until they start breathing",
      ],
      correctAnswer: 0,
    },
  },
  {
    id: 5,
    title: "Begin Chest Compressions",
    description: "Start CPR with chest compressions if there's no normal breathing.",
    keyPoints: [
      "Place hands in center of chest",
      "Keep arms straight",
      "Push hard and fast (100-120 compressions per minute)",
      "Allow chest to fully recoil",
      "Minimize interruptions",
    ],
    quiz: {
      question: "What is the correct rate for chest compressions?",
      options: [
        "50-60 per minute",
        "80-100 per minute",
        "100-120 per minute",
        "150+ per minute",
      ],
      correctAnswer: 2,
    },
  },
];

const achievements = [
  {
    id: "basics_mastered",
    title: "CPR Basics Mastered",
    description: "Completed all basic CPR steps",
    icon: <Award className="h-6 w-6 text-yellow-500" />,
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Answered all quizzes correctly",
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  },
  {
    id: "speed_learner",
    title: "Speed Learner",
    description: "Completed the course in under 5 minutes",
    icon: <Heart className="h-6 w-6 text-red-500" />,
  },
];

export default function CPRGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const progress = (completedSteps.length / cprSteps.length) * 100;

  const handleAnswer = (stepId: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [stepId]: answerIndex });
    
    const step = cprSteps[currentStep];
    if (step.quiz && answerIndex === step.quiz.correctAnswer) {
      setScore(score + 100);
      if (!isStepCompleted(stepId)) {
        setCompletedSteps([...completedSteps, stepId]);
      }
    }

    // Check achievements
    if (completedSteps.length + 1 === cprSteps.length) {
      if (!unlockedAchievements.includes('basics_mastered')) {
        setUnlockedAchievements([...unlockedAchievements, 'basics_mastered']);
      }
    }

    const allCorrect = Object.entries(quizAnswers).every(
      ([stepId, answer]) => cprSteps[parseInt(stepId) - 1].quiz?.correctAnswer === answer
    );
    if (allCorrect && !unlockedAchievements.includes('quiz_master')) {
      setUnlockedAchievements([...unlockedAchievements, 'quiz_master']);
    }

    const timeSpent = (Date.now() - startTime) / 1000 / 60; // minutes
    if (timeSpent < 5 && !unlockedAchievements.includes('speed_learner')) {
      setUnlockedAchievements([...unlockedAchievements, 'speed_learner']);
    }
  };

  const nextStep = () => {
    if (currentStep < cprSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            CPR Learning Progress
          </CardTitle>
          <CardDescription>
            Learn life-saving CPR skills with interactive guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {progress.toFixed(0)}%</span>
              <span>Score: {score} points</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Notice */}
      <Alert className="border-red-500 bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-800">
          This is a learning tool. In a real emergency, call 911 immediately.
          This guide does not replace proper CPR certification.
        </AlertDescription>
      </Alert>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle>Step {cprSteps[currentStep].id}: {cprSteps[currentStep].title}</CardTitle>
          <CardDescription>{cprSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Key Points:</h3>
            <ul className="list-disc list-inside space-y-1">
              {cprSteps[currentStep].keyPoints.map((point, index) => (
                <li key={index} className="text-sm">{point}</li>
              ))}
            </ul>
          </div>

          {cprSteps[currentStep].quiz && (
            <div className="space-y-4">
              <h3 className="font-medium">Knowledge Check:</h3>
              <p className="text-sm">{cprSteps[currentStep].quiz.question}</p>
              <div className="grid gap-2">
                {cprSteps[currentStep].quiz.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      quizAnswers[cprSteps[currentStep].id] === index
                        ? index === cprSteps[currentStep].quiz?.correctAnswer
                          ? "success"
                          : "destructive"
                        : "outline"
                    }
                    className="justify-start"
                    onClick={() => handleAnswer(cprSteps[currentStep].id, index)}
                    disabled={quizAnswers[cprSteps[currentStep].id] !== undefined}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                currentStep === cprSteps.length - 1 ||
                !isStepCompleted(cprSteps[currentStep].id)
              }
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  unlockedAchievements.includes(achievement.id)
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {achievement.icon}
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

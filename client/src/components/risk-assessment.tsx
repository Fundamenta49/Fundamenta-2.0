import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Sparkles, Phone, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  category?: string;
}

interface Question {
  id: number;
  text: string;
  category: 'emotional' | 'physical' | 'mental' | 'social';
  options: Array<{
    text: string;
    value: number;
  }>;
  immediateResources?: Array<{
    threshold: number;
    resource: Resource;
  }>;
}

interface Resource {
  title: string;
  description: string;
  action: string;
  link?: string;
  phone?: string;
  urgent: boolean;
  category: 'emotional' | 'physical' | 'mental' | 'social';
}

const generalResources: Resource[] = [
  {
    title: "Guided Meditation",
    description: "Take a moment to center yourself with our guided meditation",
    action: "Start Now",
    link: "/wellness?tab=meditation",
    urgent: false,
    category: 'mental'
  },
  {
    title: "Wellness Journal",
    description: "Track your emotional well-being and identify patterns",
    action: "Start Journaling",
    link: "/wellness?tab=journal",
    urgent: false,
    category: 'emotional'
  },
  {
    title: "Community Support",
    description: "Connect with others on similar wellness journeys",
    action: "Join Community",
    link: "/wellness?tab=chat",
    urgent: false,
    category: 'social'
  }
];

const wellnessQuestions: Question[] = [
  {
    id: 1,
    text: "How have you been feeling emotionally over the past two weeks?",
    category: 'emotional',
    options: [
      { text: "Very positive and stable", value: 0 },
      { text: "Generally good with some ups and downs", value: 1 },
      { text: "More down than usual", value: 2 },
      { text: "Consistently struggling", value: 3 }
    ],
    immediateResources: [
      {
        threshold: 3,
        resource: {
          title: "Wellness Support",
          description: "Connect with our supportive wellness community",
          action: "Learn More",
          link: "/wellness?tab=chat",
          urgent: false,
          category: 'emotional'
        }
      }
    ]
  },
  {
    id: 2,
    text: "How would you rate your sleep quality lately?",
    category: 'physical',
    options: [
      { text: "Sleeping well consistently", value: 0 },
      { text: "Some nights are better than others", value: 1 },
      { text: "Often having trouble sleeping", value: 2 },
      { text: "Severe sleep difficulties", value: 3 }
    ],
    immediateResources: [
      {
        threshold: 2,
        resource: {
          title: "Sleep Improvement Guide",
          description: "Access immediate relaxation techniques and sleep hygiene tips",
          action: "View Guide",
          link: "/wellness?tab=sleep",
          urgent: false,
          category: 'physical'
        }
      }
    ]
  },
  {
    id: 3,
    text: "How often do you feel overwhelmed by stress?",
    category: 'mental',
    options: [
      { text: "Rarely or never", value: 0 },
      { text: "Occasionally", value: 1 },
      { text: "Frequently", value: 2 },
      { text: "Almost constantly", value: 3 }
    ],
    immediateResources: [
      {
        threshold: 2,
        resource: {
          title: "Stress Relief Tools",
          description: "Try these immediate stress-reduction techniques",
          action: "Start Now",
          link: "/wellness?tab=stress",
          urgent: false,
          category: 'mental'
        }
      }
    ]
  },
  {
    id: 4,
    text: "How connected do you feel to others in your life?",
    category: 'social',
    options: [
      { text: "Very connected and supported", value: 0 },
      { text: "Moderately connected", value: 1 },
      { text: "Somewhat isolated", value: 2 },
      { text: "Very isolated", value: 3 }
    ],
    immediateResources: [
      {
        threshold: 2,
        resource: {
          title: "Community Connection",
          description: "Join our supportive community and connect with others",
          action: "Connect Now",
          link: "/wellness?tab=chat",
          urgent: false,
          category: 'social'
        }
      }
    ]
  },
  {
    id: 5,
    text: "How do you feel about your ability to cope with challenges?",
    category: 'mental',
    options: [
      { text: "Very confident in my coping skills", value: 0 },
      { text: "Generally able to cope", value: 1 },
      { text: "Sometimes struggle to cope", value: 2 },
      { text: "Often feel unable to cope", value: 3 }
    ],
    immediateResources: [
      {
        threshold: 2,
        resource: {
          title: "Coping Skills Workshop",
          description: "Learn and practice effective coping strategies",
          action: "Start Learning",
          link: "/wellness?tab=coping",
          urgent: false,
          category: 'mental'
        }
      }
    ]
  }
];

export default function RiskAssessment({ category }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [immediateResource, setImmediateResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  const progress = (currentQuestion / wellnessQuestions.length) * 100;

  const evaluateWellness = (answers: Record<number, number>) => {
    const recommendedResources = [...generalResources];

    Object.entries(answers).forEach(([questionId, value]) => {
      const question = wellnessQuestions.find(q => q.id === parseInt(questionId));
      if (question?.immediateResources) {
        question.immediateResources.forEach(({ threshold, resource }) => {
          if (value >= threshold && !recommendedResources.some(r => r.title === resource.title)) {
            recommendedResources.push(resource);
          }
        });
      }
    });

    return recommendedResources.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return 0;
    });
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < wellnessQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const recommendedResources = evaluateWellness(answers);
    setResources(recommendedResources);
    setShowResults(true);
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResources([]);
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.phone) {
      window.location.href = `tel:${resource.phone}`;
    } else if (resource.link) {
      if (resource.link.startsWith('/wellness')) {
        const tabMatch = resource.link.match(/\?tab=(.+)/);
        const tab = tabMatch ? tabMatch[1] : null;

        if (tab) {
          window.location.href = `/wellness`;
          setTimeout(() => {
            const tabElement = document.querySelector(`[value="${tab}"]`) as HTMLElement;
            if (tabElement) {
              tabElement.click();
            }
          }, 100);
        } else {
          window.location.href = resource.link;
        }
      } else {
        window.location.href = resource.link;
      }
    }
  };

  const renderResourceButton = (resource: Resource) => {
    if (resource.phone) {
      return (
        <Button
          variant="outline"
          className="bg-blue-50 hover:bg-blue-100 text-blue-700"
          onClick={() => handleResourceClick(resource)}
        >
          <Phone className="h-4 w-4 mr-2" />
          {resource.action}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="bg-primary/10 hover:bg-primary/20"
        onClick={() => handleResourceClick(resource)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        {resource.action}
      </Button>
    );
  };

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Your Wellness Insights
          </CardTitle>
          <CardDescription>
            Based on your responses, here are some personalized resources for your well-being:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  resource.urgent ? 'bg-red-50 border-red-200' : 'bg-card'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {resource.urgent ? <Phone className="h-5 w-5 text-red-500" /> : <Heart className="h-5 w-5 text-primary" />}
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-3">{resource.description}</p>
                {renderResourceButton(resource)}
              </div>
            ))}

            <div className="mt-6">
              <Alert>
                <AlertDescription>
                  Remember, this is just a preliminary assessment. For personalized guidance,
                  consider speaking with a mental health professional.
                </AlertDescription>
              </Alert>
            </div>

            <Button onClick={handleRestart} variant="outline" className="mt-4">
              Take Assessment Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Educational Assessment
        </CardTitle>
        <CardDescription>
          Take a moment to reflect on your learning preferences and goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {wellnessQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-6">
          <Label className="text-lg font-medium">
            {wellnessQuestions[currentQuestion].text}
          </Label>

          <RadioGroup
            value={answers[wellnessQuestions[currentQuestion].id]?.toString()}
            onValueChange={(value) => {
              const currentQuestionData = wellnessQuestions[currentQuestion];
              const numValue = parseInt(value);
              setAnswers(prev => ({ ...prev, [currentQuestionData.id]: numValue }));
            }}
          >
            <div className="space-y-3">
              {wellnessQuestions[currentQuestion].options.map((option) => (
                <div
                  key={option.text}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent"
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={option.text}
                  />
                  <Label htmlFor={option.text} className="flex-grow">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            Back
          </Button>

          {currentQuestion < wellnessQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[wellnessQuestions[currentQuestion].id]}
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!answers[wellnessQuestions[currentQuestion].id]}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
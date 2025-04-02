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
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Brain,
  Heart,
  Target,
  HandHeart,
  Users
} from "lucide-react";

const EQ_CATEGORIES = [
  {
    id: "self-awareness",
    title: "Self-Awareness",
    icon: Brain,
    description: "Understanding your own emotions and their impact"
  },
  {
    id: "self-regulation",
    title: "Self-Regulation",
    icon: Target,
    description: "Managing emotions and adapting to change"
  },
  {
    id: "motivation",
    title: "Motivation",
    icon: LineChart,
    description: "Internal drive and resilience"
  },
  {
    id: "empathy",
    title: "Empathy",
    icon: Heart,
    description: "Understanding and sharing others' feelings"
  },
  {
    id: "social-skills",
    title: "Social Skills",
    icon: Users,
    description: "Building and maintaining relationships"
  }
];

const RESILIENCE_FACTORS = [
  {
    id: "adaptability",
    title: "Adaptability",
    description: "Ability to adjust to change"
  },
  {
    id: "problem-solving",
    title: "Problem-Solving",
    description: "Finding solutions under pressure"
  },
  {
    id: "stress-management",
    title: "Stress Management",
    description: "Handling work-related stress"
  },
  {
    id: "growth-mindset",
    title: "Growth Mindset",
    description: "Learning from challenges"
  }
];

export default function EmotionalResilienceTracker() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HandHeart className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Emotional Intelligence & Career Resilience</CardTitle>
              <CardDescription>
                Track and improve your emotional intelligence and career resilience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* EQ Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emotional Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EQ_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const score = scores[category.id] || 0;

                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <Label>{category.title}</Label>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {score}%
                          </span>
                        </div>
                        <Progress value={score} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Resilience Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Career Resilience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {RESILIENCE_FACTORS.map((factor) => {
                    const score = scores[factor.id] || 0;

                    return (
                      <div key={factor.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{factor.title}</Label>
                          <span className="text-sm text-muted-foreground">
                            {score}%
                          </span>
                        </div>
                        <Progress value={score} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="pt-4 text-center">
              <Button
                size="lg"
                onClick={() => {
                  // TODO: Implement assessment flow
                }}
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
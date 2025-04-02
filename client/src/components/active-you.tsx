import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import RunningTracker from "./running-tracker";
import {
  Dumbbell,
  Bird as YogaIcon,
} from "lucide-react";

type TabType = "meditation" | "weightlifting" | "yoga" | "running";

interface ActiveYouProps {
  defaultTab: TabType;
}

export default function ActiveYou({ defaultTab }: ActiveYouProps) {
  if (defaultTab === "meditation") {
    return <MeditationGuide />;
  }

  if (defaultTab === "weightlifting") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            AI Weight Lifting Guide
          </CardTitle>
          <CardDescription>
            Get personalized workout plans and form guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FitnessProgress />
        </CardContent>
      </Card>
    );
  }

  if (defaultTab === "yoga") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <YogaIcon className="h-5 w-5 text-primary" />
            Yoga Sessions
          </CardTitle>
          <CardDescription>
            Follow guided yoga sessions with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FitnessProgress />
        </CardContent>
      </Card>
    );
  }

  if (defaultTab === "running") {
    return <RunningTracker />;
  }

  return null;
}
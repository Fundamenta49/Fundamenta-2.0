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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Questions from Open Source Psychometrics Project's RIASEC Test
const questions = [
  {
    id: 1,
    text: "How do you prefer to express yourself best?",
    options: [
      "Through writing and analysis",
      "Through physical or hands-on creation",
      "Through artistic and visual means",
      "Through verbal communication and teaching",
      "Through problem-solving and innovation"
    ]
  },
  // Additional questions will be added here
];

export default function RiasecTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleSelectAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Educational Path Assessment</CardTitle>
        <CardDescription>
          Answer these questions to get personalized recommendations for university degrees or trade school programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {questions[currentQuestionIndex].text}
            </Label>

            <RadioGroup
              value={answers[questions[currentQuestionIndex].id]}
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 border rounded-lg p-4"
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-grow">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={!answers[questions[currentQuestionIndex].id]}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
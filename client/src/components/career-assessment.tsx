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
  {
    id: 2,
    text: "What energizes you most during your day?",
    options: [
      "Solving complex mental challenges",
      "Creating or preparing things for others",
      "Moving around and staying physically active",
      "Interacting with many different people",
      "Working with machinery or technology"
    ]
  },
  {
    id: 3,
    text: "Which activities do you find yourself naturally drawn to?",
    options: [
      "Cooking and experimenting with recipes",
      "Fixing or building things",
      "Helping and caring for others",
      "Operating vehicles or machinery",
      "Designing and decorating spaces"
    ]
  },
  {
    id: 4,
    text: "What type of shows or content do you enjoy most?",
    options: [
      "Cooking shows and food documentaries",
      "DIY and home improvement shows",
      "Travel and aviation programs",
      "Medical and healthcare documentaries",
      "Technology and innovation features"
    ]
  },
  {
    id: 5,
    text: "What aspect of work matters most to you?",
    options: [
      "Creating experiences for others",
      "Building or fixing tangible things",
      "Having variety in daily tasks",
      "Making a direct impact on people",
      "Achieving technical excellence"
    ]
  },
  {
    id: 6,
    text: "How do you prefer to learn new skills?",
    options: [
      "Through apprenticeship and mentoring",
      "Through hands-on practice and repetition",
      "Through formal education and theory",
      "Through creative experimentation",
      "Through technical training and certification"
    ]
  },
  {
    id: 7,
    text: "What kind of work environment appeals to you most?",
    options: [
      "Dynamic environment like a kitchen or restaurant",
      "Workshop or construction setting",
      "Travel-oriented or aviation environment",
      "Healthcare or wellness facility",
      "Traditional office or remote work"
    ]
  },
  {
    id: 8,
    text: "How do you prefer to structure your work day?",
    options: [
      "Variable shifts with high energy periods",
      "Regular daytime hours with physical activity",
      "Flexible schedule with travel opportunities",
      "Structured shifts helping others",
      "Project-based work with deadlines"
    ]
  },
  {
    id: 9,
    text: "What skills come most naturally to you?",
    options: [
      "Attention to detail and precision",
      "Physical coordination and dexterity",
      "Social awareness and communication",
      "Spatial awareness and navigation",
      "Analytical thinking and planning"
    ]
  },
  {
    id: 10,
    text: "How do you handle pressure and deadlines?",
    options: [
      "Thrive in fast-paced, high-energy situations",
      "Prefer methodical, steady progress",
      "Enjoy dynamic, changing priorities",
      "Work best with clear, structured deadlines",
      "Adapt easily to unexpected changes"
    ]
  }
];

export default function CareerAssessment() {
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
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription>
          {Math.round(progress)}% Complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={progress} />

          <div className="space-y-4">
            <Label className="text-lg">
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

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
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
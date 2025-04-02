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
import CareerGuidance from "./career-guidance";

const QUESTIONS = [
  // Realistic questions
  { text: "I like to build things", category: "R" },
  { text: "I enjoy working with tools and machines", category: "R" },
  { text: "I prefer hands-on physical work", category: "R" },
  { text: "I like to repair things", category: "R" },
  { text: "I enjoy working outdoors", category: "R" },

  // Investigative questions
  { text: "I enjoy solving complex problems", category: "I" },
  { text: "I like to analyze data and information", category: "I" },
  { text: "I enjoy scientific research", category: "I" },
  { text: "I like to investigate how things work", category: "I" },
  { text: "I enjoy learning about new theories", category: "I" },

  // Artistic questions
  { text: "I enjoy creative activities", category: "A" },
  { text: "I like to express myself artistically", category: "A" },
  { text: "I enjoy designing things", category: "A" },
  { text: "I like to think of new ideas", category: "A" },
  { text: "I enjoy working with visual designs", category: "A" },

  // Social questions
  { text: "I like to help others", category: "S" },
  { text: "I enjoy teaching or training people", category: "S" },
  { text: "I like working in teams", category: "S" },
  { text: "I enjoy counseling and advising others", category: "S" },
  { text: "I like to work on improving society", category: "S" },

  // Enterprising questions
  { text: "I enjoy leading projects", category: "E" },
  { text: "I like to persuade others", category: "E" },
  { text: "I enjoy starting new initiatives", category: "E" },
  { text: "I like to manage people and resources", category: "E" },
  { text: "I enjoy making business decisions", category: "E" },

  // Conventional questions
  { text: "I am good at organizing information", category: "C" },
  { text: "I enjoy working with numbers", category: "C" },
  { text: "I like following clear procedures", category: "C" },
  { text: "I enjoy maintaining accurate records", category: "C" },
  { text: "I like creating systematic approaches", category: "C" }
];

// Result descriptions for each category
const RESULT_DESCRIPTIONS = {
  R: "Realistic: You enjoy working with your hands and solving practical problems. Your strengths lie in mechanical, technical, and physical activities. Consider careers in engineering, construction, manufacturing, agriculture, or technical fields. Jobs like mechanical engineer, electrician, carpenter, or pilot might suit you well.",

  I: "Investigative: You have a strong analytical mindset and enjoy solving complex problems. You excel at gathering information, researching, and understanding scientific or mathematical concepts. Consider careers in scientific research, technology, medicine, or analysis. Roles like research scientist, data analyst, doctor, or software developer could be great fits.",

  A: "Artistic: You have a strong creative drive and value self-expression. Your strengths include creativity, innovation, and artistic expression. Explore careers in design, fine arts, music, writing, or performing arts. Jobs like graphic designer, architect, writer, musician, or interior designer might align with your interests.",

  S: "Social: You enjoy working with and helping others. Your strengths include teaching, counseling, and supporting people. Consider careers in education, healthcare, counseling, or social services. Roles like teacher, nurse, counselor, social worker, or human resources specialist could be fulfilling for you.",

  E: "Enterprising: You excel at leading and persuading others. Your strengths include management, sales, and entrepreneurship. Look into careers in business, sales, management, or entrepreneurship. Positions like business manager, sales director, entrepreneur, or marketing executive might suit your skills.",

  C: "Conventional: You enjoy organizing and working with data. Your strengths include attention to detail, organization, and systematic thinking. Consider careers in finance, administration, logistics, or information management. Jobs like accountant, financial analyst, project coordinator, or database administrator could be excellent matches."
};

export default function RiasecTest() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const calculateResults = () => {
    const scores: {[key: string]: number} = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.entries(answers).forEach(([idx, answer]) => {
      const question = QUESTIONS[Number(idx)];
      const value = answer === 'strongly-agree' ? 5 : 
                    answer === 'agree' ? 4 : 
                    answer === 'neutral' ? 3 : 
                    answer === 'disagree' ? 2 : 1;

      if (question.category in scores) {
        scores[question.category] += value;
      }
    });

    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => RESULT_DESCRIPTIONS[category as keyof typeof RESULT_DESCRIPTIONS]);
  };

  if (showGuidance) {
    return (
      <CareerGuidance
        riasecResults={results}
        onBack={() => setShowGuidance(false)}
      />
    );
  }

  if (showResults) {
    if (results.length === 0) {
      setResults(calculateResults());
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Your Career Path Results</CardTitle>
          <CardDescription>
            Based on your answers, here are your top career directions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">#{index + 1}</h3>
                <p>{result}</p>
              </div>
            ))}

            <div className="space-y-4 pt-6 border-t mt-6">
              <Button 
                className="w-full"
                onClick={() => setShowGuidance(true)}
              >
                Get AI Career Guidance
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowResults(false);
                  setQuestionIndex(0);
                  setAnswers({});
                  setResults([]);
                }}
              >
                Take Test Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;
  const isLastQuestion = questionIndex === QUESTIONS.length - 1;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Educational Path Assessment</CardTitle>
        <CardDescription>
          Question {questionIndex + 1} of {QUESTIONS.length} ({Math.round(progress)}% Complete)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={progress} />

          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {QUESTIONS[questionIndex].text}
            </Label>

            <RadioGroup
              value={answers[questionIndex] || ""}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, [questionIndex]: value }))}
              className="space-y-3"
            >
              {[
                ["strongly-disagree", "Strongly Disagree"],
                ["disagree", "Disagree"],
                ["neutral", "Neutral"],
                ["agree", "Agree"],
                ["strongly-agree", "Strongly Agree"]
              ].map(([value, label]) => (
                <div key={value} className="flex items-center space-x-3 border rounded-lg p-4">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setQuestionIndex(prev => prev - 1)}
              disabled={questionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (isLastQuestion) {
                  setShowResults(true);
                } else {
                  setQuestionIndex(prev => prev + 1);
                }
              }}
              disabled={!answers[questionIndex]}
            >
              {isLastQuestion ? "View Results" : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
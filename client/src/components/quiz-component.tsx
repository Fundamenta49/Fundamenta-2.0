import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, RefreshCw, ThumbsUp } from "lucide-react";
import { useAIEventStore } from "@/lib/ai-event-system";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizComponentProps {
  subject: string;
  questions?: QuizQuestion[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  onComplete?: (
    score: number, 
    totalQuestions: number, 
    userAnswers?: number[], 
    correctAnswers?: number[]
  ) => void;
  onGenerateQuiz?: () => void;
  className?: string;
}

export default function QuizComponent({
  subject,
  questions = [],
  difficulty = "beginner",
  onComplete,
  onGenerateQuiz,
  className
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const aiEventStore = useAIEventStore();
  
  const generateAIQuiz = async () => {
    if (!onGenerateQuiz) {
      setIsLoading(true);
      
      // If no questions are provided, we'll simulate generating them
      // In a real implementation, this would make an API call to generate questions
      setTimeout(() => {
        setIsLoading(false);
        // Reset quiz state
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setQuizCompleted(false);
        setShowExplanation(false);
      }, 1500);
    } else {
      onGenerateQuiz();
    }
  };
  
  useEffect(() => {
    if (questions.length === 0) {
      generateAIQuiz();
    }
  }, [subject, difficulty]);
  
  const currentQuestion = questions[currentQuestionIndex] || {
    id: 0,
    question: "Loading question...",
    options: ["Loading options..."],
    correctAnswer: 0,
    explanation: ""
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };
  
  // Track user answers throughout the quiz
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  const handleNextQuestion = () => {
    // Record the user's answer for this question
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedOption !== null ? selectedOption : -1;
    setUserAnswers(updatedUserAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
      
      // Get the correct answers array from questions
      const correctAnswers = questions.map(q => q.correctAnswer);
      
      if (onComplete) {
        // Use the updated onComplete function with optional parameters
        onComplete(finalScore, questions.length, updatedUserAnswers, correctAnswers);
      }
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };
  
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  
  if (isLoading || questions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Preparing Your {subject} Quiz</CardTitle>
          <CardDescription>Generating personalized questions based on {difficulty} level...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-orange-500" />
            <p>Creating quiz questions just for you...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (quizCompleted) {
    const finalScore = (score / questions.length) * 100;
    let feedback = "";
    
    if (finalScore >= 80) {
      feedback = "Excellent! You've mastered this material.";
    } else if (finalScore >= 60) {
      feedback = "Good job! You're on the right track.";
    } else {
      feedback = "Keep practicing! Review the material and try again.";
    }
    
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
          <CardDescription>See how well you did on the {subject} quiz</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-orange-500" />
          <h3 className="text-2xl font-bold mb-2">Your Score: {score}/{questions.length}</h3>
          <Progress value={finalScore} className="h-3 w-full max-w-md mx-auto mb-4" />
          <p className="mb-6">{feedback}</p>
          
          <div className="space-y-6 max-w-md mx-auto mt-8">
            <h4 className="font-semibold text-lg">What's next?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Review the learning materials to reinforce your knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Explore the recommended resources to deepen your understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Take the quiz again to improve your score</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRestartQuiz} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <CardDescription>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level {subject} quiz
            </CardDescription>
          </div>
          <div className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            Score: {score}/{currentQuestionIndex}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">{currentQuestion.question}</h3>
          
          <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => handleOptionSelect(parseInt(value))}>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-md border ${
                    isAnswerSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : selectedOption === index
                        ? "bg-red-50 border-red-200"
                        : "bg-white"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    disabled={isAnswerSubmitted}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex-1 cursor-pointer ${
                      isAnswerSubmitted &&
                      index === currentQuestion.correctAnswer &&
                      "font-medium text-green-700"
                    }`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAnswerSubmitted ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="w-full"
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
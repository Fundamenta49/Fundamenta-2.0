import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, BookOpen, PenTool, Clock, Users, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { useToast } from '@/hooks/use-toast';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import QuizComponent from '@/components/quiz-component';
import { cn } from "@/lib/utils";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogClose
} from '@/components/ui/full-screen-dialog';

// This template can be used to create new course pages with the full-screen dialog approach
export default function TemplateCourse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  
  // This is just for state management, not actually needed for the dialog approach
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Sample quiz questions
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is the first step in the template process?",
      options: [
        "Skip to the end",
        "Review the requirements",
        "Jump into coding immediately",
        "Ask someone else to do it"
      ],
      correctAnswer: 1,
      explanation: "Always start by carefully reviewing the requirements before beginning any work."
    },
    {
      id: 2,
      question: "Which of these is NOT a recommended practice for this template?",
      options: [
        "Using full-screen dialogs for content",
        "Creating tabbed navigation",
        "Skipping the resources section",
        "Including practice exercises"
      ],
      correctAnswer: 2,
      explanation: "All course pages should include resources to help students learn more."
    },
    {
      id: 3,
      question: "What color scheme is used for the learning section?",
      options: [
        "Blue",
        "Green",
        "Orange",
        "Purple"
      ],
      correctAnswer: 2,
      explanation: "The learning section uses an orange color scheme for visual consistency."
    }
  ];

  // Sample resources
  const RESOURCES = [
    {
      title: "Beginner Guide",
      url: "https://example.com/beginner-guide",
      description: "A comprehensive introduction for beginners"
    },
    {
      title: "Practical Exercises",
      url: "https://example.com/exercises",
      description: "Hands-on activities to reinforce learning"
    },
    {
      title: "Video Tutorial",
      url: "https://example.com/video-tutorial",
      description: "Visual demonstrations of key concepts"
    },
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'module1',
      title: 'Module 1: Fundamentals',
      description: 'Learn the core concepts and basic principles',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p>
            This is the content for Module 1. In a real course, this would contain detailed explanations, 
            examples, illustrations, and interactive elements to teach the fundamental concepts.
          </p>
          <h3 className="text-lg font-semibold mt-6">Key Points</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>First important concept with explanation</li>
            <li>Second important concept with more details</li>
            <li>Third important concept that builds on the previous ones</li>
            <li>Practical application of the fundamentals</li>
          </ul>
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Pro Tip</h4>
            <p className="text-orange-800">
              Here's an insider tip that will help you remember this concept more easily!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'module2',
      title: 'Module 2: Practical Application',
      description: 'Apply what you have learned in real-world scenarios',
      icon: PenTool,
      content: (
        <div className="space-y-4">
          <p>
            This is the content for Module 2. Here we focus on practical applications and hands-on exercises
            that reinforce the fundamental concepts from Module 1.
          </p>
          <h3 className="text-lg font-semibold mt-6">Exercise 1</h3>
          <p className="mt-2">
            Try applying the concept in this specific scenario to see how it works in practice.
          </p>
          <div className="p-4 bg-gray-100 rounded-md mt-4">
            <p className="italic">
              "Here's a specific example or scenario that you need to work through using the principles learned."
            </p>
          </div>
          <h3 className="text-lg font-semibold mt-6">Exercise 2</h3>
          <p className="mt-2">
            This more advanced exercise challenges you to combine multiple concepts together.
          </p>
          <div className="p-4 bg-gray-100 rounded-md mt-4">
            <p className="italic">
              "A more complex scenario that requires applying multiple principles from the course."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'module3',
      title: 'Module 3: Advanced Topics',
      description: 'Explore complex concepts and edge cases',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p>
            This is the content for Module 3. Here we delve into more advanced topics and challenging
            scenarios that build upon the earlier modules.
          </p>
          <h3 className="text-lg font-semibold mt-6">Advanced Concept 1</h3>
          <p>
            This advanced concept builds on the fundamentals but introduces additional complexity.
          </p>
          <h3 className="text-lg font-semibold mt-6">Advanced Concept 2</h3>
          <p>
            Another complex topic that requires mastery of the previous modules.
          </p>
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              Pay special attention to this nuanced point which is often overlooked but critical to mastery.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'module4',
      title: 'Module 4: Case Studies',
      description: 'Learn from real-world examples and success stories',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p>
            This is the content for Module 4. This module presents real-world case studies that illustrate the 
            concepts in action and help you understand how they apply in diverse contexts.
          </p>
          <h3 className="text-lg font-semibold mt-6">Case Study 1: Success Story</h3>
          <p>
            This case study examines how someone successfully applied these principles to achieve their goals.
          </p>
          <div className="p-4 bg-gray-100 rounded-md mt-4">
            <p className="italic">
              "Detailed analysis of the approach, challenges faced, solutions applied, and ultimate outcomes."
            </p>
          </div>
          <h3 className="text-lg font-semibold mt-6">Case Study 2: Lessons from Failure</h3>
          <p>
            This case study looks at common mistakes and what we can learn from them.
          </p>
          <div className="p-4 bg-gray-100 rounded-md mt-4">
            <p className="italic">
              "Examination of what went wrong, why it happened, and how it could have been prevented."
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpenIcon className="h-6 w-6 mr-2 text-orange-500" />
          Template Course
        </h1>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'learn' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('learn')}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('practice')}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              <span className="text-sm font-medium">Resources</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to this Course</CardTitle>
              <CardDescription>
                A template for creating life skills courses with consistent layout and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This template demonstrates the recommended approach for building course pages. It uses a card-based 
                layout with full-screen dialogs to present content in a clean, accessible way.
              </p>
              <p className="mb-4">
                Each course module is presented as a card. When clicked, the module opens in a full-screen dialog 
                that displays detailed content, allowing users to focus on one topic at a time.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards with dialogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <FullScreenDialog key={module.id}>
                  <FullScreenDialogTrigger asChild>
                    <Card className="border-2 border-orange-100 shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <Icon className="h-10 w-10 text-orange-500" />
                          </div>
                          <CardTitle className="mb-2">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FullScreenDialogTrigger>
                  <FullScreenDialogContent themeColor="#f97316">
                    <FullScreenDialogHeader>
                      <div className="flex items-center mb-2">
                        <Icon className="w-6 h-6 mr-2 text-orange-500" />
                        <FullScreenDialogTitle>{module.title}</FullScreenDialogTitle>
                      </div>
                      <FullScreenDialogDescription>{module.description}</FullScreenDialogDescription>
                    </FullScreenDialogHeader>
                    <FullScreenDialogBody>
                      {module.content}
                    </FullScreenDialogBody>
                    <FullScreenDialogFooter>
                      <Button 
                        variant="outline" 
                        className="mr-auto"
                      >
                        Mark as Complete
                      </Button>
                      <FullScreenDialogClose asChild>
                        <Button>Close</Button>
                      </FullScreenDialogClose>
                    </FullScreenDialogFooter>
                  </FullScreenDialogContent>
                </FullScreenDialog>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about this topic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Template Course"
                difficulty="beginner"
                questions={QUIZ_QUESTIONS}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                  toast({
                    title: "Quiz completed!",
                    description: `You scored ${score} out of ${total}.`,
                  });
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>
                Additional materials to enhance your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks resources={RESOURCES} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
      <div className="mt-8 hidden sm:block">
        <Button 
          onClick={() => setShowChat(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <BookOpenIcon className="mr-2 h-4 w-4" />
          Ask Learning Coach
        </Button>
      </div>

      {/* Always show either the pop-out chat or the floating chat */}
      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}
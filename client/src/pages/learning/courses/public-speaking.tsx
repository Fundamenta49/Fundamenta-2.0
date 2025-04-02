import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Mic, BookOpenIcon, Users, PresentationIcon, Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
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
  FullScreenDialogClose,
} from "@/components/ui/full-screen-dialog";

export default function PublicSpeakingCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [showChat, setShowChat] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Course modules as cards
  const COURSE_MODULES = [
    {
      id: 'foundation',
      title: 'Speaking Foundations',
      description: 'Master the fundamental skills of effective public speaking',
      icon: Mic,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Building a solid foundation is essential for becoming an effective public speaker. This module covers the core techniques that will help you overcome anxiety, develop your voice, and use body language effectively.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Overcoming Speaking Anxiety', length: '8 min', completed: false },
              { title: 'Vocal Techniques', length: '10 min', completed: false },
              { title: 'Body Language Essentials', length: '7 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'presentation',
      title: 'Presentation Structure',
      description: 'Learn how to organize compelling and memorable speeches',
      icon: PresentationIcon,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            A well-structured presentation keeps your audience engaged and helps them remember your key points. This module teaches you proven frameworks for organizing your thoughts and delivering them effectively.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Organizing Your Speech', length: '9 min', completed: false },
              { title: 'Crafting Compelling Introductions', length: '7 min', completed: false },
              { title: 'Creating Memorable Conclusions', length: '8 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'audience',
      title: 'Audience Engagement',
      description: 'Techniques to captivate and connect with any audience',
      icon: Users,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Engaging your audience is the key to a successful presentation. This module covers proven techniques for creating interaction, maintaining interest, and establishing a connection with any type of audience.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Engaging Your Audience', length: '12 min', completed: false },
              { title: 'Handling Q&A Sessions', length: '8 min', completed: false },
              { title: 'Reading the Room', length: '6 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'technology',
      title: 'Presentation Technology',
      description: 'Effectively use visual aids and presentation tools',
      icon: Megaphone,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Modern presentations often involve technology. This module helps you select and use the right tools for your presentations, from slides to interactive elements, ensuring they enhance rather than distract from your message.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Visual Aids and Technology', length: '8 min', completed: false },
              { title: 'Slide Design Principles', length: '10 min', completed: false },
              { title: 'Presenting in Virtual Environments', length: '9 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Quiz questions
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is the best way to overcome public speaking anxiety?",
      options: [
        "Avoid eye contact with the audience", 
        "Practice regularly and prepare thoroughly", 
        "Memorize your speech word for word", 
        "Speak as quickly as possible to get it over with"
      ],
      correctAnswer: 1,
      explanation: "Regular practice and thorough preparation are the most effective ways to reduce public speaking anxiety. Familiarity with your material builds confidence."
    },
    {
      id: 2,
      question: "Which structure is commonly recommended for presentations?",
      options: [
        "Introduction, Body, Conclusion", 
        "Problem, Solution, Benefits, Call to Action", 
        "Both A and B are valid presentation structures", 
        "Neither structure is effective"
      ],
      correctAnswer: 2,
      explanation: "Both the classic 'Introduction, Body, Conclusion' and the problem-solution approach are valid structures. The best choice depends on your presentation goals and audience."
    },
    {
      id: 3,
      question: "How many main points should most presentations focus on?",
      options: [
        "As many as possible to show expertise", 
        "No more than 3-5 key points", 
        "At least 10 points to be comprehensive", 
        "The number doesn't matter as long as you're engaging"
      ],
      correctAnswer: 1,
      explanation: "Most experts recommend limiting your presentation to 3-5 key points. The human brain processes information in chunks, and too many points can overwhelm your audience."
    },
    {
      id: 4,
      question: "What is the 10-20-30 rule for presentations?",
      options: [
        "10 slides, 20 minutes, 30-point font", 
        "Start 10 minutes early, speak for 20 minutes, allow 30 minutes for questions", 
        "Prepare for 10 hours, rehearse for 20 hours, deliver for 30 minutes", 
        "10 introduction slides, 20 content slides, 30 conclusion slides"
      ],
      correctAnswer: 0,
      explanation: "The 10-20-30 rule, popularized by Guy Kawasaki, suggests presentations should have no more than 10 slides, last no more than 20 minutes, and use no smaller than 30-point font."
    },
    {
      id: 5,
      question: "What percentage of communication is non-verbal according to research?",
      options: [
        "About 10%", 
        "About 35%", 
        "About 55%", 
        "About 93%"
      ],
      correctAnswer: 3,
      explanation: "According to Albert Mehrabian's research, approximately 93% of communication is non-verbal - 55% body language, 38% tone of voice, and only 7% the actual words used."
    }
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'TED Talk Guide',
      url: 'https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker',
      description: 'Tips from the experts at TED'
    },
    {
      title: 'Toastmasters Resources',
      url: 'https://www.toastmasters.org/resources',
      description: 'Free public speaking resources and guides'
    },
    {
      title: 'Speech Structure Template',
      url: 'https://sixminutes.dlugan.com/speech-preparation-3-outline-examples/',
      description: 'Templates for organizing effective speeches'
    },
    {
      title: 'Public Speaking For Dummies',
      url: 'https://www.dummies.com/article/body-mind-spirit/emotional-health-psychology/personal-development/general-personal-development/ten-tips-for-giving-a-great-speech-138530',
      description: 'Ten tips for giving a great speech'
    }
  ];

  // This function is no longer needed with the FullScreenDialog approach
  // but keeping the state for potential future use
  const handleCardClick = (id: string) => {
    setExpandedCard(id);
  };

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
          <Mic className="h-6 w-6 mr-2 text-orange-500" />
          Public Speaking
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
              <CardTitle>Introduction to Public Speaking</CardTitle>
              <CardDescription>
                Learn how to deliver impactful presentations and speeches that captivate your audience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Public speaking is one of the most valuable skills you can develop for both personal and professional success. This course helps you build confidence, craft compelling messages, and deliver presentations that engage and inspire audiences.
              </p>
              <p className="mb-4">
                Whether you're preparing for a work presentation, a school speech, or simply want to express yourself more effectively, these techniques will help you communicate with impact.
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
                Answer these questions to see how much you've learned about public speaking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Public Speaking"
                difficulty="beginner"
                questions={QUIZ_QUESTIONS}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
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
              <CardTitle>Public Speaking Resources</CardTitle>
              <CardDescription>
                Helpful links and tools to improve your public speaking skills
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
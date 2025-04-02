import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Brain, PenTool, Users, Lightbulb, X, Filter, MessageSquare } from 'lucide-react';
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
  FullScreenDialogClose
} from '@/components/ui/full-screen-dialog';

export default function CriticalThinkingCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Critical Thinking
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which of the following is NOT one of the core skills in critical thinking?",
      options: [
        "Analysis",
        "Evaluation", 
        "Memorization",
        "Inference"
      ],
      correctAnswer: 2,
      explanation: "Memorization is not a core critical thinking skill. Critical thinking involves analysis, evaluation, inference, interpretation, explanation, and self-regulation."
    },
    {
      id: 2,
      question: "What is confirmation bias?",
      options: [
        "The tendency to seek information that confirms our existing beliefs",
        "The bias that comes from consulting multiple sources",
        "The tendency to make decisions based on the order in which information is presented",
        "The bias that results from following logical reasoning"
      ],
      correctAnswer: 0,
      explanation: "Confirmation bias is the tendency to seek, interpret, and remember information that confirms our existing beliefs while giving less attention to information that contradicts them."
    },
    {
      id: 3,
      question: "Which approach is most aligned with critical thinking?",
      options: [
        "Accepting information from authority figures without question",
        "Believing the first explanation that makes sense",
        "Evaluating evidence and considering alternative perspectives",
        "Trusting your intuition over evidence"
      ],
      correctAnswer: 2,
      explanation: "Critical thinking involves evaluating evidence objectively and considering multiple perspectives before drawing conclusions, rather than accepting information uncritically."
    },
    {
      id: 4,
      question: "What is the Socratic method?",
      options: [
        "A mathematical formula for solving complex problems",
        "A technique that uses focused questioning to stimulate critical thinking",
        "A memorization strategy for learning new concepts",
        "A method for organizing ideas in written form"
      ],
      correctAnswer: 1,
      explanation: "The Socratic method is a form of cooperative dialogue where individuals are prompted to examine their ideas through focused questioning, helping to stimulate critical thinking and illuminate ideas."
    },
    {
      id: 5,
      question: "Which logical fallacy involves attacking the person making the argument rather than addressing the argument itself?",
      options: [
        "Straw man fallacy",
        "Appeal to authority",
        "Ad hominem fallacy",
        "False dichotomy"
      ],
      correctAnswer: 2,
      explanation: "The ad hominem fallacy occurs when someone attacks the character, motives, or attributes of the person making an argument rather than addressing the substance of the argument itself."
    },
    {
      id: 6,
      question: "What is 'intellectual humility' in critical thinking?",
      options: [
        "The belief that all opinions are equally valid",
        "Recognition of the limits of one's knowledge and openness to new information",
        "Assuming you are wrong about most things",
        "Deferring to experts on all matters"
      ],
      correctAnswer: 1,
      explanation: "Intellectual humility involves recognizing that your knowledge is limited, being open to new evidence and perspectives, and being willing to revise your beliefs when warranted by new information."
    },
    {
      id: 7,
      question: "Which of the following is an example of deductive reasoning?",
      options: [
        "Drawing a general conclusion from specific observations",
        "Making a prediction based on past trends",
        "Applying a general rule to a specific case",
        "Using intuition to solve a problem"
      ],
      correctAnswer: 2,
      explanation: "Deductive reasoning involves applying general rules or principles to specific cases to draw a conclusion. It moves from the general to the specific, unlike inductive reasoning which does the opposite."
    },
    {
      id: 8,
      question: "What is a 'red herring' in an argument?",
      options: [
        "A piece of information that definitively proves a point",
        "An irrelevant topic introduced to divert attention from the original issue",
        "A logical conclusion based on sound premises",
        "A controversial statement designed to provoke emotional response"
      ],
      correctAnswer: 1,
      explanation: "A red herring is a diversionary tactic that involves introducing an irrelevant topic to distract from the original issue being discussed, derailing the argument and avoiding the actual point of contention."
    },
    {
      id: 9,
      question: "Which critical thinking skill involves breaking complex ideas into component parts?",
      options: [
        "Synthesis",
        "Evaluation",
        "Analysis",
        "Inference"
      ],
      correctAnswer: 2,
      explanation: "Analysis involves breaking down complex information or problems into smaller, more manageable parts to understand the relationships between these components and identify patterns or causes."
    },
    {
      id: 10,
      question: "What is 'cognitive dissonance'?",
      options: [
        "The mental state achieved during deep critical thinking",
        "The inability to think critically due to mental fatigue",
        "The psychological discomfort experienced when holding contradictory beliefs",
        "The process of analyzing different perspectives simultaneously"
      ],
      correctAnswer: 2,
      explanation: "Cognitive dissonance is the mental discomfort that results from holding contradictory beliefs, values, or attitudes. People tend to seek consistency in their cognitions, which can sometimes lead to irrational or maladaptive behavior."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "The Critical Thinking Community",
      url: "https://www.criticalthinking.org/",
      description: "Foundation for Critical Thinking resources and research"
    },
    {
      title: "Logical Fallacies",
      url: "https://yourlogicalfallacyis.com/",
      description: "Interactive guide to common logical fallacies"
    },
    {
      title: "How to Think Critically - TED Talk",
      url: "https://www.ted.com/talks/samantha_agoos_5_tips_to_improve_your_critical_thinking",
      description: "5-minute video on improving critical thinking skills"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'foundations',
      title: 'Foundations of Critical Thinking',
      description: 'Understanding the core components of critical thinking',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p>
            Critical thinking is the intellectually disciplined process of actively conceptualizing, applying, analyzing, 
            synthesizing, and evaluating information to reach an answer or conclusion. This module introduces the 
            fundamental concepts and skills that form the foundation of critical thinking.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Core Elements of Critical Thinking</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Analysis:</strong> Breaking down complex information into smaller, manageable parts</li>
            <li><strong>Evaluation:</strong> Assessing the credibility and logical strength of information</li>
            <li><strong>Inference:</strong> Drawing reasonable conclusions from available evidence</li>
            <li><strong>Interpretation:</strong> Understanding and expressing the meaning of information</li>
            <li><strong>Explanation:</strong> Clearly presenting reasoning and results</li>
            <li><strong>Self-regulation:</strong> Monitoring and correcting your own thinking</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Why Critical Thinking Matters</h3>
          <p>
            In today's information-rich world, critical thinking is essential for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Making better decisions in personal and professional life</li>
            <li>Avoiding manipulation by misinformation or propaganda</li>
            <li>Solving complex problems more effectively</li>
            <li>Evaluating claims and arguments based on evidence</li>
            <li>Developing intellectual autonomy and self-confidence</li>
          </ul>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              Critical thinking is not about being critical in the negative sense. It's about approaching information 
              with curiosity and disciplined evaluation rather than passive acceptance.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'cognitive-biases',
      title: 'Recognizing Cognitive Biases',
      description: 'Understanding biases that cloud judgment and decision-making',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <p>
            Cognitive biases are systematic patterns of deviation from norm or rationality in judgment. They create 
            their own subjective reality from their perception of the input. This module helps you identify and 
            overcome common biases that can impair critical thinking.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Common Cognitive Biases</h3>
          
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Confirmation Bias</h4>
              <p className="text-sm">The tendency to search for, interpret, and recall information that confirms pre-existing beliefs</p>
              <p className="text-sm mt-2 italic">Example: Only reading news sources that align with your political views</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Anchoring Bias</h4>
              <p className="text-sm">Relying too heavily on the first piece of information encountered</p>
              <p className="text-sm mt-2 italic">Example: A $2,000 watch seems reasonable after looking at a $10,000 watch</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Availability Heuristic</h4>
              <p className="text-sm">Overestimating the likelihood of events based on their availability in memory</p>
              <p className="text-sm mt-2 italic">Example: Fearing air travel after hearing about a plane crash in the news</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Dunning-Kruger Effect</h4>
              <p className="text-sm">Overestimating one's abilities when knowledge or competence is low</p>
              <p className="text-sm mt-2 italic">Example: A beginner believing they've mastered a skill after basic training</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Overcoming Cognitive Biases</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Actively seek out contradictory evidence and viewpoints</li>
            <li>Be aware of your personal biases and blind spots</li>
            <li>Engage with diverse perspectives and sources</li>
            <li>Practice intellectual humility and openness to being wrong</li>
            <li>Use structured decision-making frameworks</li>
          </ul>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              Everyone has cognitive biases—awareness is the first step to mitigation. Even experts in critical 
              thinking must constantly work to recognize and overcome their own biases.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'logical-fallacies',
      title: 'Identifying Logical Fallacies',
      description: 'Recognizing common errors in reasoning and argumentation',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p>
            Logical fallacies are errors in reasoning that undermine the logic of an argument. Recognizing these 
            fallacies helps you evaluate arguments more effectively and construct stronger arguments yourself.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Common Logical Fallacies</h3>
          
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Ad Hominem</h4>
              <p className="text-sm">Attacking the person instead of addressing their argument</p>
              <p className="text-sm mt-2 italic">Example: "You can't trust his economic policy because he's never had a real job."</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Straw Man</h4>
              <p className="text-sm">Misrepresenting someone's argument to make it easier to attack</p>
              <p className="text-sm mt-2 italic">Example: "You want better healthcare? So you want complete government control of medicine!"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">False Dichotomy</h4>
              <p className="text-sm">Presenting only two options when others exist</p>
              <p className="text-sm mt-2 italic">Example: "Either we cut education funding or we go bankrupt."</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Appeal to Authority</h4>
              <p className="text-sm">Claiming something is true because an authority says it is</p>
              <p className="text-sm mt-2 italic">Example: "This famous doctor endorsed this supplement, so it must work."</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Slippery Slope</h4>
              <p className="text-sm">Asserting that a small first step will inevitably lead to extreme consequences</p>
              <p className="text-sm mt-2 italic">Example: "If we ban assault rifles, all guns will eventually be banned."</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">How to Spot and Counter Fallacies</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Focus on the structure of arguments rather than just content</li>
            <li>Ask what evidence actually supports the conclusion</li>
            <li>Identify hidden assumptions in the reasoning</li>
            <li>Consider whether premises logically connect to conclusions</li>
            <li>Address fallacies by redirecting to the actual argument</li>
          </ul>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Pro Tip</h4>
            <p className="text-orange-800">
              When you spot a fallacy in someone else's argument, pointing it out directly can make them defensive. 
              Instead, ask questions that help them see the gap in their reasoning.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'application',
      title: 'Practical Applications',
      description: 'Applying critical thinking skills to real-world situations',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p>
            Critical thinking isn't just theoretical—it's a practical skill for navigating daily life. This module 
            provides frameworks and approaches for applying critical thinking to various contexts and situations.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The IDEA Framework for Critical Thinking</h3>
          
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">I - Identify</h4>
              <p className="text-sm">Identify the claim, assertion, or decision to be evaluated</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">D - Determine</h4>
              <p className="text-sm">Determine relevant facts, evidence, and perspectives</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">E - Evaluate</h4>
              <p className="text-sm">Evaluate the quality of information and logic of arguments</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">A - Act</h4>
              <p className="text-sm">Act based on your reasoned conclusion</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Applying Critical Thinking to Different Contexts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">Media & News</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Verify information with multiple credible sources</li>
                <li>Distinguish between facts and opinions</li>
                <li>Recognize emotional manipulation techniques</li>
                <li>Consider what information might be missing</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">Personal Decisions</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Clarify your goals and values</li>
                <li>Generate multiple alternatives</li>
                <li>Evaluate pros and cons systematically</li>
                <li>Consider long-term implications</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">Workplace</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Define problems clearly before solving</li>
                <li>Gather relevant data and expertise</li>
                <li>Challenge group assumptions</li>
                <li>Evaluate solutions against objectives</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">Social Media</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Be skeptical of viral content</li>
                <li>Check the source and creation date</li>
                <li>Look for context before sharing</li>
                <li>Be aware of algorithmic bubbles</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              Start small by applying critical thinking to one area of your life. As it becomes habitual, expand 
              to other areas. The skill strengthens with regular practice.
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
          <Brain className="h-6 w-6 mr-2 text-orange-500" />
          Critical Thinking
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
              <CardTitle>Introduction to Critical Thinking</CardTitle>
              <CardDescription>
                Learn how to analyze information, evaluate arguments, and make better decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Critical thinking is the ability to think clearly and rationally about what to believe or do. It's about 
                evaluating information, questioning assumptions, analyzing arguments, and drawing logical conclusions.
              </p>
              <p className="mb-4">
                In today's world of information overload and misinformation, critical thinking skills are more important 
                than ever. This course will help you develop a toolkit for analyzing claims, spotting logical fallacies, 
                overcoming cognitive biases, and making better decisions in all areas of life.
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
              <CardTitle>Test Your Critical Thinking Skills</CardTitle>
              <CardDescription>
                Answer these questions to check your understanding of critical thinking concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Critical Thinking"
                difficulty="intermediate"
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
              <CardTitle>Critical Thinking Resources</CardTitle>
              <CardDescription>
                Useful websites, books, and tools to further develop your critical thinking skills
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
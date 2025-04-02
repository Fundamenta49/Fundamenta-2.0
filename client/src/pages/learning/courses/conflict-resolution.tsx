import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Users, ShieldQuestion, Handshake, MessagesSquare, Scale } from 'lucide-react';
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

export default function ConflictResolutionCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Conflict Resolution
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which conflict resolution style seeks to satisfy everyone's concerns?",
      options: [
        "Competing",
        "Accommodating",
        "Compromising",
        "Collaborating"
      ],
      correctAnswer: 3,
      explanation: "Collaborating aims to find a solution that fully satisfies everyone's concerns, creating a win-win outcome."
    },
    {
      id: 2,
      question: "What is active listening?",
      options: [
        "Waiting for your turn to speak",
        "Fully concentrating on, understanding, and responding to the speaker",
        "Finishing the speaker's sentences to show engagement",
        "Providing immediate solutions to problems"
      ],
      correctAnswer: 1,
      explanation: "Active listening involves fully focusing on the speaker, understanding their message, and responding thoughtfully."
    },
    {
      id: 3,
      question: "Which of the following is NOT an effective way to de-escalate a heated conflict?",
      options: [
        "Using 'I' statements to express feelings",
        "Taking a timeout to cool down",
        "Pointing out all the ways the other person is wrong",
        "Finding common ground to build upon"
      ],
      correctAnswer: 2,
      explanation: "Pointing out all the ways someone is wrong typically escalates conflict rather than resolving it. The other options are effective de-escalation techniques."
    },
    {
      id: 4,
      question: "What is the primary purpose of the 'compromising' conflict style?",
      options: [
        "To find a solution where both parties win completely",
        "To sacrifice your needs to maintain the relationship",
        "To find middle ground where each party gets some of what they want",
        "To assert your position regardless of others' needs"
      ],
      correctAnswer: 2,
      explanation: "Compromising involves finding a middle ground where each party gives up something while gaining something else, creating a partial win for everyone involved."
    },
    {
      id: 5,
      question: "Which statement best describes the 'competing' conflict style?",
      options: [
        "Prioritizing relationships over personal goals",
        "Pursuing your concerns at the expense of others",
        "Finding middle ground through give and take",
        "Avoiding the conflict altogether"
      ],
      correctAnswer: 1,
      explanation: "The competing style (also called forcing) involves pursuing your own concerns at the expense of others, using power to win the conflict."
    },
    {
      id: 6,
      question: "What is a 'trigger phrase' in conflict situations?",
      options: [
        "A phrase that helps resolve conflicts quickly",
        "Words or statements that tend to escalate emotions and defensiveness",
        "A technique for changing the subject",
        "A specialized term in conflict mediation"
      ],
      correctAnswer: 1,
      explanation: "Trigger phrases are statements that typically provoke an emotional reaction, escalate tension, and increase defensiveness, such as 'you always' or 'you never'."
    },
    {
      id: 7,
      question: "Which of these is an example of an effective 'I' statement?",
      options: [
        "I think you're being unreasonable about this.",
        "I feel disrespected when meetings start without me being notified.",
        "I want you to stop interrupting me all the time.",
        "I know you're deliberately trying to avoid this topic."
      ],
      correctAnswer: 1,
      explanation: "An effective 'I' statement focuses on expressing your feelings about a specific behavior without accusation. 'I feel disrespected when meetings start without me being notified' follows the format of 'I feel [emotion] when [specific behavior happens].'"
    },
    {
      id: 8,
      question: "What is the 'avoidance' approach to conflict resolution?",
      options: [
        "Addressing conflict head-on with assertive communication",
        "Delaying or ignoring the conflict altogether",
        "Using a neutral third party to facilitate resolution",
        "Finding ways to compete more effectively"
      ],
      correctAnswer: 1,
      explanation: "The avoidance approach involves physically or psychologically removing yourself from the conflict, or postponing dealing with it indefinitely."
    },
    {
      id: 9,
      question: "What is conflict transformation?",
      options: [
        "Changing the topic to avoid conflict",
        "Finding a quick solution to end the conflict",
        "Viewing conflict as an opportunity for growth and positive change",
        "Transforming negative emotions into positive ones"
      ],
      correctAnswer: 2,
      explanation: "Conflict transformation is an approach that views conflict as a potential catalyst for growth and positive social change, focusing not just on resolving the immediate issue but on addressing underlying relationships and structures."
    },
    {
      id: 10,
      question: "What is the most productive mindset to adopt during conflict resolution?",
      options: [
        "Viewing the other person as an opponent to be defeated",
        "Seeing the conflict as a problem to be solved together",
        "Focusing on who started the conflict",
        "Preparing to compromise on everything"
      ],
      correctAnswer: 1,
      explanation: "Viewing the conflict as a shared problem to be solved collaboratively creates the foundation for productive conflict resolution, as it puts both parties on the same side against the problem rather than against each other."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Crucial Conversations: Tools for Talking When Stakes Are High",
      url: "https://www.vitalsmarts.com/crucial-conversations-book/",
      description: "Book on handling high-stakes conversations effectively"
    },
    {
      title: "Harvard Negotiation Project",
      url: "https://www.pon.harvard.edu/",
      description: "Research on successful negotiation and conflict resolution"
    },
    {
      title: "Conflict Resolution Network",
      url: "http://www.crnhq.org/",
      description: "Tools and training resources for resolving conflicts"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'basics',
      title: 'Understanding Conflict',
      description: 'Learn about the nature of conflict and common causes',
      icon: ShieldQuestion,
      content: (
        <div className="space-y-4">
          <p>
            Conflict is a natural part of human interaction. Understanding the nature of conflict is the first 
            step to resolving it effectively. This module explores what conflict is, why it occurs, and how 
            it can actually lead to positive outcomes when handled appropriately.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">What is Conflict?</h3>
          <p>
            Conflict is a disagreement or struggle between people with opposing needs, ideas, beliefs, values, 
            or goals. It can range from minor disagreements to serious disputes that damage relationships.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Common Causes of Conflict</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Poor Communication:</strong> Misunderstandings, lack of information, or unclear expectations</li>
            <li><strong>Different Values:</strong> Clashes in personal beliefs, priorities, or cultural backgrounds</li>
            <li><strong>Scarce Resources:</strong> Competition for limited time, money, space, or attention</li>
            <li><strong>Incompatible Goals:</strong> Different objectives that can't all be achieved simultaneously</li>
            <li><strong>Relationship Tensions:</strong> Past conflicts, distrust, or personality differences</li>
            <li><strong>Role Conflicts:</strong> Unclear responsibilities or expectations in relationships</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Conflict Styles</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Competing (I win, you lose)</h4>
              <p className="text-sm">Assertive and uncooperative approach that prioritizes your concerns over others</p>
              <p className="text-sm italic mt-2">Useful when: Quick action is vital, unpopular decisions need to be made</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Accommodating (I lose, you win)</h4>
              <p className="text-sm">Unassertive and cooperative approach that neglects your concerns to satisfy others</p>
              <p className="text-sm italic mt-2">Useful when: The issue is more important to others, preserving harmony is critical</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Avoiding (No winners, no losers)</h4>
              <p className="text-sm">Unassertive and uncooperative approach that sidesteps or postpones the conflict</p>
              <p className="text-sm italic mt-2">Useful when: The issue is trivial, tensions are high and cooling off is needed</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Compromising (Partial win, partial lose)</h4>
              <p className="text-sm">Moderately assertive and cooperative approach seeking middle ground</p>
              <p className="text-sm italic mt-2">Useful when: Time constraints exist, temporary solutions are needed</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Collaborating (I win, you win)</h4>
              <p className="text-sm">Assertive and cooperative approach working to fully satisfy all concerns</p>
              <p className="text-sm italic mt-2">Useful when: Long-term relationships matter, creative solutions are possible</p>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              Conflict itself isn't necessarily negative—it's how we handle conflict that determines whether the 
              outcome is destructive or constructive. Productive conflict can lead to better solutions, stronger 
              relationships, and personal growth.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Master the art of effective communication in conflicts',
      icon: MessagesSquare,
      content: (
        <div className="space-y-4">
          <p>
            Communication is at the heart of conflict resolution. How we express ourselves and listen to others 
            can either escalate or de-escalate conflicts. This module covers essential communication skills for 
            navigating difficult conversations successfully.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Active Listening</h3>
          <p>
            Active listening means fully concentrating on what the other person is saying rather than just passively 
            hearing. It involves:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Giving your full attention without planning your response while they speak</li>
            <li>Showing you're listening through body language (eye contact, nodding)</li>
            <li>Paraphrasing to confirm understanding ("What I hear you saying is...")</li>
            <li>Asking clarifying questions to gather more information</li>
            <li>Acknowledging emotions ("I can see this is really frustrating for you")</li>
            <li>Avoiding interruptions or jumping to conclusions</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Using "I" Statements</h3>
          <div className="space-y-4 mt-4">
            <p>
              "I" statements express feelings and concerns without blaming or criticizing. They have three parts:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">Formula:</p>
              <p className="italic">"I feel [emotion] when [specific situation] because [reason]."</p>
              
              <div className="mt-4">
                <p className="font-medium">Instead of:</p>
                <p className="text-red-600">"You never help with the housework. You're so lazy."</p>
                
                <p className="font-medium mt-2">Try:</p>
                <p className="text-green-600">"I feel overwhelmed when I have to handle all the housework because it leaves me with little time for myself."</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Non-Verbal Communication</h3>
          <p>
            Body language often speaks louder than words. Pay attention to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Facial expressions (maintain a neutral or open expression)</li>
            <li>Body posture (uncrossed arms, facing the person)</li>
            <li>Tone of voice (calm, measured speech)</li>
            <li>Eye contact (engaged but not intimidating)</li>
            <li>Personal space (respectful distance)</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">De-escalation Techniques</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Speak slowly and calmly, even if the other person is not</li>
            <li>Lower your volume rather than raising it</li>
            <li>Take deep breaths to manage your own emotions</li>
            <li>Suggest a short break if emotions are running too high</li>
            <li>Use validating statements: "I understand why you might feel that way"</li>
            <li>Focus on areas of agreement before addressing disagreements</li>
          </ul>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              Research shows that how something is said often matters more than what is said. Tone, facial 
              expressions, and body language account for over 90% of emotional communication.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'resolution',
      title: 'Resolution Strategies',
      description: 'Learn practical approaches to resolving different types of conflicts',
      icon: Handshake,
      content: (
        <div className="space-y-4">
          <p>
            Once you understand the nature of conflict and have developed strong communication skills, you can 
            apply specific strategies to resolve conflicts. This module presents practical approaches that can 
            be adapted to different situations and relationships.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Resolution Process</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">1. Create a Suitable Environment</h4>
              <p className="text-sm">Choose a neutral, private space with enough time to talk without interruption</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">2. Clarify Positions and Interests</h4>
              <p className="text-sm">Distinguish between what people say they want (positions) and why they want it (interests)</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">3. Focus on Interests, Not Positions</h4>
              <p className="text-sm">Look beneath surface demands to find underlying needs that might be satisfied in multiple ways</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">4. Generate Multiple Solutions</h4>
              <p className="text-sm">Brainstorm options without judgment before evaluating them</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">5. Evaluate and Select Solutions</h4>
              <p className="text-sm">Use objective criteria to assess options and choose the best approach</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">6. Create an Action Plan</h4>
              <p className="text-sm">Establish who will do what, by when, and how progress will be measured</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">7. Follow Up</h4>
              <p className="text-sm">Check in on the implementation and adjust as needed</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Negotiation Principles</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Separate people from the problem:</strong> Address issues without attacking individuals</li>
            <li><strong>Focus on interests:</strong> Look for the needs behind stated positions</li>
            <li><strong>Invent options for mutual gain:</strong> Expand possibilities before narrowing choices</li>
            <li><strong>Use objective criteria:</strong> Base decisions on fair standards or principles</li>
            <li><strong>Know your BATNA:</strong> Understand your Best Alternative To a Negotiated Agreement</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Mediation Basics</h3>
          <p>
            When direct negotiation isn't working, a neutral third party can help:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Creates a safe space for open discussion</li>
            <li>Ensures both parties are heard</li>
            <li>Helps identify common ground</li>
            <li>Facilitates brainstorming solutions</li>
            <li>Maintains focus on resolution rather than blame</li>
          </ul>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              The most successful conflict resolution occurs when both parties shift from seeing each other as 
              opponents to viewing themselves as partners in solving a shared problem.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'difficult',
      title: 'Handling Difficult Situations',
      description: 'Strategies for particularly challenging conflicts',
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>
            Some conflicts are particularly challenging due to power imbalances, high emotions, cultural differences, 
            or the personalities involved. This module provides specialized strategies for navigating these more 
            difficult situations.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Dealing with Strong Emotions</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Recognize emotions without being controlled by them</li>
            <li>Allow emotional expression in controlled ways</li>
            <li>Take breaks when emotions become overwhelming</li>
            <li>Use grounding techniques (deep breathing, focusing on physical sensations)</li>
            <li>Name the emotion to help process it: "I notice I'm feeling frustrated right now"</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Addressing Power Imbalances</h3>
          <div className="space-y-4 mt-4">
            <p>
              Power differences (boss/employee, parent/child, etc.) can complicate conflict resolution:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Focus on mutual interests and shared goals</li>
              <li>Use objective standards rather than personal authority</li>
              <li>Consider involving a mediator or facilitator</li>
              <li>Document agreements for accountability</li>
              <li>Ensure psychological safety for the less powerful party</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Cross-Cultural Conflict</h3>
          <div className="space-y-4 mt-4">
            <p>
              Cultural differences can lead to misunderstandings and conflicts:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be aware of different communication styles (direct vs. indirect)</li>
              <li>Recognize varying attitudes toward hierarchy and authority</li>
              <li>Understand different approaches to time and deadlines</li>
              <li>Consider collectivist vs. individualist cultural values</li>
              <li>Ask questions to understand cultural context rather than making assumptions</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Dealing with Difficult Personalities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Aggressive Person</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Stay calm and don't match their intensity</li>
                <li>Set clear boundaries on acceptable behavior</li>
                <li>Use timeouts if necessary</li>
                <li>Focus on the issue, not the attacks</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Passive-Aggressive Person</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Address behaviors directly but non-accusatorily</li>
                <li>Create safety for honest expression</li>
                <li>Focus on specific actions, not character</li>
                <li>Be patient but persistent</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Stonewaller</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Take breaks when communication shuts down</li>
                <li>Try different formats (writing vs. talking)</li>
                <li>Use gentle, open-ended questions</li>
                <li>Express the importance of their input</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium">The Victim</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Validate feelings without reinforcing helplessness</li>
                <li>Focus on what can be controlled</li>
                <li>Encourage solution-oriented thinking</li>
                <li>Break problems into manageable pieces</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">When to Step Back</h3>
          <p>
            Sometimes the wisest approach is to recognize when a conflict can't be resolved immediately:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>When safety is at risk (physical or psychological)</li>
            <li>When one party is unwilling to engage in good faith</li>
            <li>When the timing is wrong (e.g., during crisis or extreme stress)</li>
            <li>When professional help is needed (counselor, mediator, lawyer)</li>
          </ul>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Not all conflicts need to be resolved immediately. Sometimes setting the issue aside temporarily 
              or agreeing to disagree respectfully is the best approach. Choose your battles wisely.
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
          <Users className="h-6 w-6 mr-2 text-orange-500" />
          Conflict Resolution
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
              <CardTitle>Introduction to Conflict Resolution</CardTitle>
              <CardDescription>
                Learn skills to navigate disagreements and build stronger relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Conflict is a natural part of human interaction. Learning to handle conflicts effectively can 
                transform potential relationship damage into opportunities for growth, understanding, and 
                stronger connections.
              </p>
              <p className="mb-4">
                This course teaches practical conflict resolution skills that you can apply in personal relationships, 
                workplace settings, and other situations. You'll learn how to communicate effectively during 
                disagreements, understand different conflict styles, and develop strategies for finding solutions 
                that work for everyone involved.
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
              <CardTitle>Test Your Conflict Resolution Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about resolving conflicts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Conflict Resolution"
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
              <CardTitle>Conflict Resolution Resources</CardTitle>
              <CardDescription>
                Helpful links and tools to improve your conflict resolution skills
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
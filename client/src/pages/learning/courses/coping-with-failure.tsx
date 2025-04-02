import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Dumbbell, HeartPulse, Brain, RefreshCw, Footprints } from 'lucide-react';
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

export default function CopingWithFailureCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Coping with Failure
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is a growth mindset?",
      options: [
        "The belief that abilities are fixed and cannot be changed",
        "The belief that abilities can be developed through dedication and hard work",
        "The belief that only certain people can succeed in life",
        "The belief that failure should be avoided at all costs"
      ],
      correctAnswer: 1,
      explanation: "A growth mindset is the belief that abilities can be developed through dedication, hard work, and learning from failure. This contrasts with a fixed mindset, which sees abilities as static traits."
    },
    {
      id: 2,
      question: "Which of the following is NOT a healthy way to cope with failure?",
      options: [
        "Acknowledging your emotions",
        "Practicing self-compassion",
        "Avoiding similar situations in the future",
        "Identifying lessons learned"
      ],
      correctAnswer: 2,
      explanation: "Avoiding similar situations prevents growth and learning. Healthy coping involves acknowledging emotions, practicing self-compassion, and identifying lessons for future attempts."
    },
    {
      id: 3,
      question: "What is 'post-traumatic growth'?",
      options: [
        "A mental illness that occurs after experiencing failure",
        "The negative consequences of repeated failures",
        "Positive psychological changes experienced after challenging circumstances",
        "A medical treatment for depression caused by failure"
      ],
      correctAnswer: 2,
      explanation: "Post-traumatic growth refers to positive psychological changes that can occur as a result of struggling with highly challenging life circumstances, including failures and setbacks."
    },
    {
      id: 4,
      question: "Which of the following statements best describes resilience?",
      options: [
        "Never experiencing failure or setbacks",
        "The ability to bounce back from difficulties and adapt to change",
        "The ability to avoid challenging situations",
        "Being emotionally unaffected by failure"
      ],
      correctAnswer: 1,
      explanation: "Resilience is the capacity to recover quickly from difficulties and adapt to change. It's not about avoiding challenges or being emotionally unaffected, but rather about how effectively you respond to and grow from adversity."
    },
    {
      id: 5,
      question: "What is 'toxic positivity' in the context of coping with failure?",
      options: [
        "Using positive affirmations to overcome negative thoughts",
        "The practice of maintaining a positive attitude in all situations",
        "Dismissing negative emotions and insisting on positive thinking only",
        "Being optimistic about future attempts after failure"
      ],
      correctAnswer: 2,
      explanation: "Toxic positivity is the excessive and ineffective overgeneralization of a happy, optimistic state that minimizes and denies any genuine human emotions that are not strictly positive. It involves dismissing negative emotions rather than acknowledging and processing them."
    },
    {
      id: 6,
      question: "According to research, which of the following is most strongly associated with successful recovery from failure?",
      options: [
        "Having never failed before",
        "Having a strong social support network",
        "Being naturally talented",
        "Being younger when failure occurs"
      ],
      correctAnswer: 1,
      explanation: "Research consistently shows that having a strong social support network—people who can provide emotional support, practical help, and perspective—is strongly associated with successful recovery from failure and increased resilience."
    },
    {
      id: 7,
      question: "What is 'attributional retraining' in the context of dealing with failure?",
      options: [
        "Learning to blame others for your failures",
        "Changing how you explain the causes of your successes and failures",
        "Attributing all failures to bad luck",
        "Training yourself to forget about past failures"
      ],
      correctAnswer: 1,
      explanation: "Attributional retraining is a cognitive technique that involves changing how you explain the causes of events in your life. It helps people shift from unhelpful explanatory styles (like seeing failure as permanent and pervasive) to more constructive ones (viewing failure as temporary and specific)."
    },
    {
      id: 8,
      question: "Which of the following is an example of a productive 'failure analysis'?",
      options: [
        "Concluding that you're simply not good enough",
        "Finding someone else to blame for the failure",
        "Identifying specific factors that contributed to the outcome and potential improvements",
        "Deciding to never attempt that type of task again"
      ],
      correctAnswer: 2,
      explanation: "Productive failure analysis involves objectively identifying the specific factors that contributed to a failure and determining what can be improved in future attempts. It's focused on learning and adaptation rather than blame or avoidance."
    },
    {
      id: 9,
      question: "What is the concept of 'failing forward'?",
      options: [
        "Moving physically forward after failure to change your environment",
        "Blaming yourself for failures and moving on",
        "Using failures as stepping stones to success through learning and adaptation",
        "Quickly moving on to the next project without analyzing what went wrong"
      ],
      correctAnswer: 2,
      explanation: "Failing forward is the concept of using failures as stepping stones toward success by extracting valuable lessons from each setback, adapting your approach, and continuing to move toward your goals with new insights."
    },
    {
      id: 10,
      question: "Which psychological trait is characterized by the ability to stay committed to goals despite setbacks and view challenges as opportunities rather than threats?",
      options: [
        "Grit",
        "Narcissism",
        "Perfectionism",
        "Neuroticism"
      ],
      correctAnswer: 0,
      explanation: "Grit, a concept popularized by psychologist Angela Duckworth, is the combination of passion and perseverance for long-term goals, especially in the face of obstacles and failures. It involves staying committed to goals despite setbacks and viewing challenges as opportunities."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Mindset: The New Psychology of Success",
      url: "https://www.mindsetonline.com/",
      description: "Carol Dweck's groundbreaking book on growth mindset"
    },
    {
      title: "Option B: Facing Adversity, Building Resilience, and Finding Joy",
      url: "https://optionb.org/",
      description: "Book and resources by Sheryl Sandberg and Adam Grant"
    },
    {
      title: "The Gifts of Imperfection",
      url: "https://brenebrown.com/book/the-gifts-of-imperfection/",
      description: "Brené Brown's guide to wholehearted living"
    },
    {
      title: "Resilience Skills with the American Psychological Association",
      url: "https://www.apa.org/topics/resilience",
      description: "Research-based resources on building resilience"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'understanding',
      title: 'Understanding Failure',
      description: 'Reframing how we think about failure and setbacks',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p>
            Failure is an inevitable part of life and growth. Yet many of us have been conditioned to fear, avoid,
            and feel ashamed of our failures. Understanding what failure truly represents is the first step toward
            transforming how we respond to it.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">What Is Failure?</h3>
          <p>
            In simple terms, failure is the state or condition of not meeting a desired outcome. But this
            definition is incomplete. Failure is:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A natural part of any growth process</li>
            <li>A source of valuable information and feedback</li>
            <li>An opportunity for learning and development</li>
            <li>A universal human experience shared by even the most successful people</li>
            <li>Temporary and specific, not permanent or definitive of one's worth</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Common Misconceptions About Failure</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Misconception: Failure means I'm not good enough</h4>
              <p className="text-sm mt-2"><strong>Reality:</strong> Failure is about actions and outcomes, not your worth as a person</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Misconception: Successful people don't fail</h4>
              <p className="text-sm mt-2"><strong>Reality:</strong> Successful people often fail more frequently because they take more risks and attempt more challenging goals</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Misconception: Failure is final</h4>
              <p className="text-sm mt-2"><strong>Reality:</strong> Failure is a moment in time, not the end of the story unless you choose to stop trying</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Misconception: Failure should be avoided at all costs</h4>
              <p className="text-sm mt-2"><strong>Reality:</strong> Avoiding failure limits growth, innovation, and often leads to even bigger failures later</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Misconception: If I fail, everyone will judge me</h4>
              <p className="text-sm mt-2"><strong>Reality:</strong> Most people are too focused on their own challenges to spend time judging yours; those who do judge harshly are typically projecting their own fears</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Fixed vs. Growth Mindset</h3>
          <p>
            Stanford psychologist Carol Dweck's research on mindsets provides a powerful framework for understanding 
            different responses to failure:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-4">Fixed Mindset</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Believes intelligence and abilities are static traits</li>
                <li>Avoids challenges to prevent failure</li>
                <li>Gives up easily when facing obstacles</li>
                <li>Sees effort as fruitless</li>
                <li>Ignores useful negative feedback</li>
                <li>Feels threatened by others' success</li>
                <li>Views failure as defining of identity</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-4">Growth Mindset</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Believes abilities can be developed through effort</li>
                <li>Embraces challenges as opportunities to grow</li>
                <li>Persists in the face of setbacks</li>
                <li>Sees effort as the path to mastery</li>
                <li>Learns from criticism and feedback</li>
                <li>Finds inspiration in others' success</li>
                <li>Views failure as a temporary state and learning opportunity</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-4">
            A growth mindset doesn't eliminate the sting of failure, but it fundamentally changes how we interpret 
            and respond to failure, allowing us to learn and grow from the experience rather than being defined by it.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Value of Failure</h3>
          <p>
            When approached with the right mindset, failure provides unique benefits:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Practical feedback:</strong> Reveals what doesn't work so you can adjust your approach</li>
            <li><strong>Resilience building:</strong> Strengthens your ability to bounce back from adversity</li>
            <li><strong>Creativity stimulation:</strong> Forces you to think differently and find new solutions</li>
            <li><strong>Perspective development:</strong> Helps you distinguish between minor setbacks and true catastrophes</li>
            <li><strong>Character growth:</strong> Builds humility, empathy, and perseverance</li>
            <li><strong>Success appreciation:</strong> Enhances your gratitude for achievements when they come</li>
          </ul>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              Failure isn't the opposite of success—it's part of success. By reframing how we understand failure, 
              we transform it from something to fear into a valuable tool for growth and achievement.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'emotions',
      title: 'Emotional Responses to Failure',
      description: 'Managing difficult emotions that arise after setbacks',
      icon: HeartPulse,
      content: (
        <div className="space-y-4">
          <p>
            Failure often triggers strong emotional responses. These feelings are natural and universal, but they 
            can either propel us forward or hold us back, depending on how we process and respond to them.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Common Emotional Responses to Failure</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Shame</h4>
              <p className="text-sm">The painful feeling that we are fundamentally flawed or unworthy</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Recognize the difference between "I made a mistake" and "I am a mistake"</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">Embarrassment</h4>
              <p className="text-sm">Discomfort from having others witness our failure</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Remember that everyone fails and most people are too focused on their own concerns to dwell on your mistakes</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-medium">Disappointment</h4>
              <p className="text-sm">Sadness when reality doesn't match our expectations</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Allow yourself to feel disappointed without dwelling on it, then reassess your goals and expectations</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-medium">Frustration</h4>
              <p className="text-sm">Feeling upset when our efforts don't yield desired results</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Channel frustration into problem-solving energy rather than giving up</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">Fear</h4>
              <p className="text-sm">Anxiety about future failures or consequences</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Distinguish between realistic concerns and catastrophic thinking</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Self-Doubt</h4>
              <p className="text-sm">Questioning your abilities or future potential</p>
              <p className="text-sm mt-2"><strong>Healthy response:</strong> Challenge negative self-talk with evidence of past successes and strengths</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Emotional Processing Journey</h3>
          <p>
            Processing emotions after failure typically follows a pattern:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Impact:</strong> The initial emotional reaction, often intense</li>
            <li><strong>Acknowledgment:</strong> Recognizing and naming the emotions you're feeling</li>
            <li><strong>Expression:</strong> Finding healthy ways to express these feelings</li>
            <li><strong>Release:</strong> Gradually letting go of the emotional intensity</li>
            <li><strong>Integration:</strong> Finding meaning and learning from the experience</li>
            <li><strong>Renewal:</strong> Moving forward with new insights and perspective</li>
          </ol>
          
          <h3 className="text-lg font-semibold mt-6">Emotional Regulation Techniques</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Mindful Awareness</h4>
              <p className="text-sm mt-2">Practice observing your emotions without judgment. Notice physical sensations, thoughts, and the urge to react.</p>
              <p className="text-sm italic mt-2">Try this: "I notice I'm feeling disappointed right now. My chest feels tight, and I'm thinking that I'll never succeed."</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Self-Compassion</h4>
              <p className="text-sm mt-2">Treat yourself with the same kindness you would offer a good friend facing failure.</p>
              <p className="text-sm italic mt-2">Try this: "This is really hard right now. Failure is part of being human. May I be kind to myself in this moment."</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Cognitive Reframing</h4>
              <p className="text-sm mt-2">Challenge distorted thoughts about the failure and consider alternative interpretations.</p>
              <p className="text-sm italic mt-2">Try this: Instead of "This proves I'm incompetent," try "This specific approach didn't work, but that doesn't define my abilities."</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Emotional Distancing</h4>
              <p className="text-sm mt-2">Create space between yourself and the emotional intensity by using third-person perspective.</p>
              <p className="text-sm italic mt-2">Try this: "Sarah is feeling disappointed about not getting the job, but she has many skills to offer the right employer."</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Expressive Writing</h4>
              <p className="text-sm mt-2">Write freely about your feelings and thoughts regarding the failure for 15-20 minutes.</p>
              <p className="text-sm italic mt-2">Research shows this can reduce rumination and help you process emotions more effectively.</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">When Emotions Become Overwhelming</h3>
          <p>
            Sometimes the emotional impact of failure can be intense and persistent, especially if:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The failure relates to something deeply important to you</li>
            <li>It connects to past traumas or core insecurities</li>
            <li>You're experiencing multiple stressors simultaneously</li>
            <li>You're physically depleted (tired, hungry, ill)</li>
            <li>You have a history of depression or anxiety</li>
          </ul>
          <p className="mt-4">
            In these cases, additional support can be valuable:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Talk to trusted friends or family members</li>
            <li>Consider speaking with a counselor or therapist</li>
            <li>Join a support group related to your specific challenge</li>
            <li>Take extra care of your physical needs (sleep, nutrition, exercise)</li>
            <li>Temporarily reduce other stressors when possible</li>
          </ul>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              Emotions are information, not directives. They tell us something important about our experience, 
              but they don't have to determine our actions. By developing emotional awareness and regulation 
              skills, you can use the emotional energy of failure to fuel growth rather than being overwhelmed by it.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'resilience',
      title: 'Building Resilience',
      description: 'Developing the ability to bounce back stronger after setbacks',
      icon: Dumbbell,
      content: (
        <div className="space-y-4">
          <p>
            Resilience is the ability to adapt well in the face of adversity, trauma, tragedy, threats, or significant 
            sources of stress. It's not about avoiding failure but rather developing the capacity to recover, 
            learn, and grow stronger from challenges. Like a muscle, resilience can be developed and strengthened 
            over time.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Core Components of Resilience</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Mental Flexibility</h4>
              <p className="text-sm">The ability to consider different perspectives and adapt your thinking</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Practice considering alternative explanations for events and challenging your initial assumptions</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Emotional Regulation</h4>
              <p className="text-sm">Managing intense emotions effectively without being overwhelmed</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Develop mindfulness practices and emotional awareness techniques</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Optimistic Thinking</h4>
              <p className="text-sm">Maintaining hope and positive expectations while being realistic</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Practice gratitude, focus on what's within your control, and remember past challenges you've overcome</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Social Support</h4>
              <p className="text-sm">Strong, supportive relationships that provide encouragement and perspective</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Invest in key relationships, be vulnerable with trusted others, and ask for help when needed</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Self-Efficacy</h4>
              <p className="text-sm">Belief in your ability to handle challenges and influence outcomes</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Set and achieve small goals, acknowledge your strengths, and focus on past successes</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Purpose and Meaning</h4>
              <p className="text-sm">A sense that your life has meaning beyond immediate circumstances</p>
              <p className="text-sm mt-2"><strong>How to build it:</strong> Connect to your core values, contribute to others, and view challenges within a larger context</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Resilience-Building Practices</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Develop a Resilience Narrative</h4>
              <p className="text-sm mt-2">
                Create a personal story that emphasizes how you've overcome past challenges. Research shows that how we 
                tell our life story significantly impacts our resilience.
              </p>
              <p className="text-sm mt-2">
                Ask yourself: "How have previous difficulties helped me grow stronger? What have I learned about myself 
                through overcoming obstacles?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Practice Adaptive Thinking</h4>
              <p className="text-sm mt-2">
                Challenge unhelpful thought patterns using these questions:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Is this thought based on emotion or evidence?</li>
                <li>Am I overestimating the likelihood of a negative outcome?</li>
                <li>Am I catastrophizing or exaggerating the consequences?</li>
                <li>What would I tell a friend in this situation?</li>
                <li>How might this situation look from another perspective?</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Build Your Support Network</h4>
              <p className="text-sm mt-2">
                Identify key relationships that provide different types of support:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Emotional support (empathy and understanding)</li>
                <li>Informational support (advice and guidance)</li>
                <li>Tangible support (practical help)</li>
                <li>Belonging support (community and connection)</li>
              </ul>
              <p className="text-sm mt-2">
                Actively nurture these relationships and don't hesitate to reach out during difficult times.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Practice Self-Care Fundamentals</h4>
              <p className="text-sm mt-2">
                Physical well-being significantly impacts resilience. Prioritize:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Adequate sleep (7-9 hours for most adults)</li>
                <li>Regular physical activity (especially rhythmic exercise like walking)</li>
                <li>Balanced nutrition (emphasizing whole foods)</li>
                <li>Stress reduction techniques (meditation, deep breathing)</li>
                <li>Limited alcohol and caffeine, especially during stressful periods</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Develop a Growth-Oriented Response Plan</h4>
              <p className="text-sm mt-2">
                Create a personal protocol for handling failures:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li>Allow yourself to feel the initial emotional impact</li>
                <li>Activate your support system</li>
                <li>Analyze what happened objectively</li>
                <li>Identify lessons and insights</li>
                <li>Adjust your approach based on what you've learned</li>
                <li>Take one concrete step forward</li>
              </ol>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Post-Traumatic Growth</h3>
          <p>
            Beyond resilience lies the concept of post-traumatic growth—the positive psychological change experienced 
            as a result of the struggle with highly challenging life circumstances. Research by psychologists Richard 
            Tedeschi and Lawrence Calhoun has identified five areas where people often experience growth after significant failures or trauma:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Greater appreciation of life</strong> and changed sense of priorities</li>
            <li><strong>Warmer, more intimate relationships</strong> with others</li>
            <li><strong>Greater sense of personal strength</strong> and self-reliance</li>
            <li><strong>Recognition of new possibilities</strong> or paths for one's life</li>
            <li><strong>Spiritual development</strong> or deepened existential understanding</li>
          </ul>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              Resilience isn't about never falling—it's about rising every time you fall. By deliberately 
              practicing resilience-building strategies, you not only become better at handling failure, but 
              you develop the capacity to transform challenges into opportunities for profound personal growth.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'learning',
      title: 'Learning from Failure',
      description: 'Extracting valuable lessons from setbacks to improve future performance',
      icon: RefreshCw,
      content: (
        <div className="space-y-4">
          <p>
            One of the most powerful ways to transform failure from a negative experience into a catalyst for 
            growth is to effectively extract and apply lessons from the experience. This module explores how to 
            systematically learn from failures of all sizes.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Learning Loop: A Framework for Growth</h3>
          <div className="space-y-2">
            <p>
              The Learning Loop provides a structured approach to extract valuable insights from failure:
            </p>
            <div className="mt-4">
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-orange-100 p-4">
                  <h4 className="font-medium text-center">1. Experience</h4>
                  <p className="text-sm text-center">The failure or setback itself</p>
                </div>
                <div className="bg-blue-100 p-4">
                  <h4 className="font-medium text-center">2. Reflection</h4>
                  <p className="text-sm text-center">Objectively examining what happened</p>
                </div>
                <div className="bg-purple-100 p-4">
                  <h4 className="font-medium text-center">3. Analysis</h4>
                  <p className="text-sm text-center">Understanding why it happened</p>
                </div>
                <div className="bg-green-100 p-4">
                  <h4 className="font-medium text-center">4. Integration</h4>
                  <p className="text-sm text-center">Applying insights to future situations</p>
                </div>
                <div className="bg-orange-100 p-4">
                  <h4 className="font-medium text-center">5. New Experience</h4>
                  <p className="text-sm text-center">Testing new approaches based on learning</p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Reflection Strategies</h3>
          <p>
            Effective learning requires quality reflection that balances emotional processing with objective analysis. 
            Consider these approaches:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Journaling Prompts</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>What specifically happened? (Focus on observable facts)</li>
                <li>What were my goals or expectations?</li>
                <li>At what point did things begin to deviate from expectations?</li>
                <li>What was within my control? What wasn't?</li>
                <li>What emotions did I experience during and after?</li>
                <li>How might someone else describe this situation?</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Structured Debrief Questions</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>What went well, despite the ultimate outcome?</li>
                <li>What didn't go as planned?</li>
                <li>What surprised me?</li>
                <li>What resources did I have? What resources did I lack?</li>
                <li>What assumptions did I make that proved incorrect?</li>
                <li>How did my actions contribute to the outcome?</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Alternate Perspective Taking</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>How would a mentor or role model view this situation?</li>
                <li>If I were advising a friend in this exact situation, what would I say?</li>
                <li>What might I see differently if I were viewing this from 5 years in the future?</li>
                <li>What would someone with a completely different background notice?</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Root Cause Analysis</h3>
          <p>
            Moving beyond surface-level explanations helps identify deeper patterns and more effective solutions. 
            Try these analytical approaches:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">The Five Whys Technique</h4>
              <p className="text-sm mt-2">
                Ask "why" repeatedly (typically five times) to move beyond symptoms to underlying causes:
              </p>
              <div className="mt-2 text-sm">
                <p><strong>Failure:</strong> I missed the project deadline</p>
                <p><strong>Why?</strong> I ran out of time to complete all the required elements</p>
                <p><strong>Why?</strong> The final phase took much longer than I expected</p>
                <p><strong>Why?</strong> I encountered technical issues I didn't anticipate</p>
                <p><strong>Why?</strong> I didn't do enough research on that aspect of the project</p>
                <p><strong>Why?</strong> I assumed my existing knowledge was sufficient</p>
                <p><strong>Root cause:</strong> Overconfidence in my knowledge and insufficient planning for unknowns</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Contribution Analysis</h4>
              <p className="text-sm mt-2">
                Identify the multiple factors that likely contributed to the failure, categorizing them:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Personal factors:</strong> Skills, knowledge, mindset, physical/emotional state</li>
                <li><strong>Interpersonal factors:</strong> Communication, relationships, team dynamics</li>
                <li><strong>Environmental factors:</strong> Resources, timing, external constraints</li>
                <li><strong>Systemic factors:</strong> Processes, structures, incentives, cultural aspects</li>
              </ul>
              <p className="text-sm mt-2 italic">
                This helps you move beyond oversimplified explanations and identify multiple leverage points for improvement.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Success-Failure Comparison</h4>
              <p className="text-sm mt-2">
                Compare a similar situation where you succeeded with the current failure:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>What was different about your approach?</li>
                <li>What resources or support did you have then that were missing now?</li>
                <li>How did your mindset or emotional state differ?</li>
                <li>What external factors were different?</li>
              </ul>
              <p className="text-sm mt-2 italic">
                This comparison can reveal critical success factors you may have overlooked.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Insight Integration</h3>
          <p>
            The most critical step is converting insights into action. These strategies help ensure learning translates to improvement:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Lesson Documentation</h4>
              <p className="text-sm mt-2">
                Create a personal "lessons learned" document or journal where you record key insights from failures. 
                Review this regularly, especially when starting similar projects.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Action Planning</h4>
              <p className="text-sm mt-2">
                Convert each key lesson into a specific, actionable change:
              </p>
              <div className="mt-2 text-sm">
                <p><strong>Lesson:</strong> I need more technical knowledge in area X</p>
                <p><strong>Action:</strong> Complete online course on X by [specific date]</p>
                <p><strong>Lesson:</strong> I tend to underestimate complex tasks</p>
                <p><strong>Action:</strong> Add 30% buffer time to all estimates for complex tasks</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Environmental Design</h4>
              <p className="text-sm mt-2">
                Create systems, reminders, or environmental cues that make implementing your insights easier:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Checklists for critical processes</li>
                <li>Calendar reminders for regular check-ins</li>
                <li>Visual cues in your workspace</li>
                <li>Accountability partners for important changes</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Mental Rehearsal</h4>
              <p className="text-sm mt-2">
                Mentally rehearse applying your new insights in future scenarios:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Visualize yourself implementing specific changes</li>
                <li>Anticipate challenges to your new approach</li>
                <li>Imagine how you'll handle similar situations differently</li>
                <li>Prepare responses to potential obstacles</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Not all lessons from failure are obvious or immediate. Sometimes the most profound insights emerge 
              after reflection over time. Make learning from failure a consistent practice rather than a one-time 
              event, and you'll continue to extract value from even your most challenging experiences.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'moving-forward',
      title: 'Moving Forward After Failure',
      description: 'Taking positive action and renewing confidence after setbacks',
      icon: Footprints,
      content: (
        <div className="space-y-4">
          <p>
            After processing emotions and extracting lessons from failure, the final crucial step is taking 
            positive action to move forward. This module focuses on practical strategies for rebuilding 
            confidence and momentum after setbacks.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Courage to Begin Again</h3>
          <p>
            Moving forward after failure requires courage—the willingness to risk potential disappointment again. 
            Here's how to cultivate that courage:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Embrace Vulnerability</h4>
              <p className="text-sm mt-2">
                Recognize that vulnerability—the willingness to put yourself in situations where you might fail again—is 
                not weakness but profound courage. As researcher Brené Brown notes, vulnerability is "the birthplace of innovation, 
                creativity, and change."
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Redefine Risk and Reward</h4>
              <p className="text-sm mt-2">
                Shift your thinking from "What if I fail again?" to "What if I succeed?" and "What will I miss if I don't try?" 
                Consider the risk of inaction alongside the risk of action.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Create Safety Nets</h4>
              <p className="text-sm mt-2">
                Identify ways to make trying again feel safer: start smaller, build in checkpoints, have contingency plans, 
                or ensure you have support systems in place.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Connect to Purpose</h4>
              <p className="text-sm mt-2">
                Remind yourself why your goal matters to you. A strong sense of purpose provides the motivation to overcome 
                the fear of repeated failure.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Rebuilding Confidence</h3>
          <p>
            Failure often damages self-confidence, which can make moving forward challenging. These strategies 
            help rebuild confidence authentically:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Evidence Collection</h4>
              <p className="text-sm mt-2">
                Create a concrete record of past successes, strengths, and obstacles you've overcome. Review this 
                evidence when self-doubt creeps in.
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Make a list of 10+ past successes, big and small</li>
                <li>Collect positive feedback you've received</li>
                <li>Note previous challenges you've overcome</li>
                <li>Identify transferable skills from other areas of life</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Small Wins Strategy</h4>
              <p className="text-sm mt-2">
                Design a series of small, achievable goals that build toward your larger objective. Each small success 
                rebuilds confidence and creates positive momentum.
              </p>
              <p className="text-sm mt-2 italic">
                Example: If you failed at launching a business, you might start with creating a single product prototype, 
                then getting feedback from five potential customers, then making one sale.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Skills Development</h4>
              <p className="text-sm mt-2">
                Identify specific skills that would help you succeed in your next attempt and create a plan to develop them. 
                Competence builds confidence.
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Take courses to fill knowledge gaps</li>
                <li>Practice specific techniques or approaches</li>
                <li>Seek mentoring in challenging areas</li>
                <li>Read books or studies on relevant topics</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Self-Talk Renovation</h4>
              <p className="text-sm mt-2">
                Pay attention to your internal dialogue and actively replace destructive thoughts with constructive alternatives.
              </p>
              <div className="mt-2 text-sm">
                <p><strong>Instead of:</strong> "I always mess things up."</p>
                <p><strong>Try:</strong> "I'm learning and improving with each attempt."</p>
                <p><strong>Instead of:</strong> "I'll never be good enough."</p>
                <p><strong>Try:</strong> "I have specific skills I can develop to improve my performance."</p>
                <p><strong>Instead of:</strong> "This failure proves I shouldn't try again."</p>
                <p><strong>Try:</strong> "This setback provided valuable information for my next attempt."</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Taking Strategic Action</h3>
          <p>
            Moving forward effectively requires not just any action, but strategic action informed by your 
            experience and learning:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Create a Revised Approach</h4>
              <p className="text-sm mt-2">
                Develop a detailed plan incorporating what you've learned from your failure. Specifically identify:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>What you'll do differently this time</li>
                <li>What you'll keep from your previous approach</li>
                <li>New resources or support you'll leverage</li>
                <li>How you'll monitor progress along the way</li>
                <li>Potential obstacles and how you'll address them</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Implement Deliberate Practice</h4>
              <p className="text-sm mt-2">
                Apply the principles of deliberate practice to improve in areas that contributed to your failure:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Focus on specific, challenging aspects just beyond your current ability</li>
                <li>Seek immediate feedback on your performance</li>
                <li>Reflect on what's working and what isn't</li>
                <li>Make targeted adjustments based on feedback</li>
                <li>Repeat with sustained concentration</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Enlist Support and Accountability</h4>
              <p className="text-sm mt-2">
                Strategically involve others in your renewed efforts:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Share your revised plan with someone who will hold you accountable</li>
                <li>Connect with mentors who have overcome similar failures</li>
                <li>Join communities of practice where you can learn from others</li>
                <li>Consider partnerships that complement your weaknesses</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Establish Reflection Points</h4>
              <p className="text-sm mt-2">
                Schedule regular times to pause and evaluate your progress:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Set specific milestones for reviewing your approach</li>
                <li>Create metrics or indicators to track improvement</li>
                <li>Journal about challenges and breakthroughs</li>
                <li>Seek feedback from trusted sources at key points</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">When to Pivot vs. Persist</h3>
          <p>
            Sometimes the wisest response to failure is not to try again in exactly the same way, but to pivot 
            to a modified goal or approach. Consider these questions when deciding:
          </p>
          <div className="mt-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium">Questions for Discernment</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Are you failing repeatedly in the same way despite genuine effort to change?</li>
                <li>Is the cost (emotional, financial, time) of continuing worth the potential benefit?</li>
                <li>Are you pursuing this goal for intrinsic reasons or to please others?</li>
                <li>Are there alternative paths to achieve the same underlying values or needs?</li>
                <li>Would a modified version of your goal still be meaningful and satisfying?</li>
                <li>Has new information emerged that changes the desirability of the original goal?</li>
              </ul>
              <p className="text-sm mt-2 italic">
                Remember: Pivoting is not giving up—it's making a strategic choice to redirect your energy 
                toward a more promising path based on what you've learned.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Continuous Improvement</h4>
            <p className="text-blue-800">
              The way you handle failure becomes a skill in itself. Each time you move forward after a setback, 
              you're not just pursuing a specific goal—you're strengthening your capacity to bounce back from 
              future challenges. This meta-skill of recovering and growing from failure may ultimately prove 
              more valuable than any individual success.
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
          <Dumbbell className="h-6 w-6 mr-2 text-orange-500" />
          Coping with Failure
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
              <CardTitle>Introduction to Coping with Failure</CardTitle>
              <CardDescription>
                Learn how to transform setbacks into opportunities for growth and resilience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Failure is an inevitable part of the human experience, yet most of us never learn effective 
                strategies for dealing with it. This course explores how to navigate setbacks in a healthy way 
                that builds resilience, promotes growth, and ultimately leads to greater success.
              </p>
              <p className="mb-4">
                Through evidence-based approaches and practical techniques, you'll discover how to process the 
                emotional impact of failure, extract valuable lessons from your experiences, and move forward 
                with renewed confidence and purpose.
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
              <CardTitle>Test Your Knowledge on Coping with Failure</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about handling setbacks effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Coping with Failure"
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
              <CardTitle>Coping with Failure Resources</CardTitle>
              <CardDescription>
                Books, websites, and tools to help you develop resilience and growth through setbacks
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
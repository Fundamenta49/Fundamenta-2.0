import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Workflow, Brain, Calendar, BarChart, Lightbulb } from 'lucide-react';
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

export default function FormingPositiveHabitsCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Forming Positive Habits
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is the 'habit loop' according to Charles Duhigg?",
      options: [
        "A mental technique for breaking bad habits",
        "A cycle of cue, routine, and reward that forms habits",
        "A 21-day program for habit formation",
        "A type of cognitive behavioral therapy"
      ],
      correctAnswer: 1,
      explanation: "The habit loop is a neurological pattern consisting of a cue (trigger), routine (behavior), and reward (benefit). Understanding this loop is key to changing or forming habits."
    },
    {
      id: 2,
      question: "What is 'habit stacking'?",
      options: [
        "Creating multiple habits simultaneously",
        "Breaking habits into smaller components",
        "Building new habits on top of existing ones",
        "Replacing bad habits with good ones"
      ],
      correctAnswer: 2,
      explanation: "Habit stacking involves attaching a new habit to an existing one by using the existing habit as the cue for the new behavior. For example: 'After I brush my teeth, I will meditate for one minute.'"
    },
    {
      id: 3,
      question: "According to research, how long does it typically take to form a habit?",
      options: [
        "Exactly 21 days",
        "Between 18-254 days, with an average of 66 days",
        "At least 90 days with no exceptions",
        "Between 7-30 days depending on the habit"
      ],
      correctAnswer: 1,
      explanation: "Research by Phillippa Lally at University College London found habit formation takes anywhere from 18 to 254 days, with 66 days being the average. The time varies based on the person, the habit, and circumstances."
    },
    {
      id: 4,
      question: "Which part of the brain is primarily responsible for habit formation?",
      options: [
        "Prefrontal cortex",
        "Hippocampus",
        "Basal ganglia",
        "Amygdala"
      ],
      correctAnswer: 2,
      explanation: "The basal ganglia plays a critical role in habit formation. This brain structure is involved in movement control, procedural learning, and reward processing, all central to the development of automatic behaviors."
    },
    {
      id: 5,
      question: "What is the 'implementation intention' strategy for habit formation?",
      options: [
        "Setting a vague goal to pursue a habit 'whenever possible'",
        "Creating a specific plan for when and where you will perform a behavior",
        "Implementing rewards for successful habit completion",
        "Gradually increasing the difficulty of a habit over time"
      ],
      correctAnswer: 1,
      explanation: "Implementation intentions are specific plans that detail exactly when and where you will perform a habit. For example: 'I will meditate for 5 minutes at 7am in my bedroom.' Research shows they significantly increase follow-through on intentions."
    },
    {
      id: 6,
      question: "According to James Clear's framework, what is the first 'law' of behavior change?",
      options: [
        "Make it obvious",
        "Make it attractive", 
        "Make it easy",
        "Make it satisfying"
      ],
      correctAnswer: 0,
      explanation: "In 'Atomic Habits,' James Clear outlines four laws of behavior change. The first is 'Make it obvious,' which focuses on creating clear cues for your habits through strategies like implementation intentions and environmental design."
    },
    {
      id: 7,
      question: "What is 'temptation bundling' in habit formation?",
      options: [
        "Avoiding temptations that interfere with good habits",
        "Pairing something you want to do with something you need to do",
        "Creating several small habits instead of one large one",
        "Giving yourself a reward after completing a habit"
      ],
      correctAnswer: 1,
      explanation: "Temptation bundling involves linking an activity you enjoy (want to do) with one you need motivation for (need to do). For example, only watching your favorite show while exercising. This makes the necessary habit more attractive."
    },
    {
      id: 8,
      question: "What is BJ Fogg's 'Tiny Habits' approach centered on?",
      options: [
        "Making habits so small they're impossible to fail at",
        "Tracking habits with specialized technology",
        "Focusing on high-impact keystone habits",
        "Gradually increasing the difficulty of a habit over extended periods"
      ],
      correctAnswer: 0,
      explanation: "BJ Fogg's Tiny Habits method emphasizes starting with habits so small they require minimal motivation - often taking 30 seconds or less. This approach focuses on consistency and building the habit identity rather than impressive results upfront."
    },
    {
      id: 9,
      question: "What is the significance of celebration in BJ Fogg's habit formation method?",
      options: [
        "It's just a nice bonus but not essential to the method",
        "It replaces the need for discipline and willpower",
        "It creates positive emotions that help wire in the habit",
        "It provides accountability by making habits public"
      ],
      correctAnswer: 2,
      explanation: "In Fogg's method, celebration—creating an immediate positive feeling after performing the tiny behavior—is essential for habit formation. This positive emotion helps your brain associate the behavior with pleasure, strengthening the neural pathway."
    },
    {
      id: 10,
      question: "What is a 'keystone habit'?",
      options: [
        "The most difficult habit to form",
        "A habit that naturally leads to multiple positive behaviors",
        "The first habit you should establish",
        "A habit that requires the most consistency"
      ],
      correctAnswer: 1,
      explanation: "Keystone habits are habits that naturally lead to other positive behaviors and outcomes. For example, regular exercise often leads to better eating choices, improved sleep, and increased productivity. They create a 'cascade' of positive changes."
    },
    {
      id: 11,
      question: "What does the 'two-minute rule' state about habit formation?",
      options: [
        "All new habits should be started in two-minute increments",
        "A new habit should take no more than two minutes to complete",
        "Wait two minutes before giving in to a craving",
        "Practice a new habit for at least two minutes daily"
      ],
      correctAnswer: 1,
      explanation: "The two-minute rule, popularized by James Clear, suggests that when starting a new habit, it should take less than two minutes to complete. This makes the habit extremely easy to perform, increasing the likelihood of consistency."
    },
    {
      id: 12,
      question: "What is 'identity-based' habit formation?",
      options: [
        "Forming habits based on your personality type",
        "Focusing on who you wish to become rather than what you want to achieve",
        "Creating a public identity around your habits for accountability",
        "Adapting habits from role models whose identity you admire"
      ],
      correctAnswer: 1,
      explanation: "Identity-based habits focus on changing your beliefs about yourself rather than just your behaviors. Instead of 'I want to run a marathon,' your focus becomes 'I am a runner.' This approach creates internal motivation as behaviors become expressions of identity."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Atomic Habits",
      url: "https://jamesclear.com/atomic-habits",
      description: "James Clear's guide to building good habits and breaking bad ones"
    },
    {
      title: "The Power of Habit",
      url: "https://charlesduhigg.com/the-power-of-habit/",
      description: "Charles Duhigg's exploration of how habits work and how to change them"
    },
    {
      title: "Tiny Habits",
      url: "https://www.tinyhabits.com/",
      description: "BJ Fogg's method for behavior change through small actions"
    },
    {
      title: "Habitica",
      url: "https://habitica.com/",
      description: "A free habit-building app that treats your life like a game"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'science',
      title: 'The Science of Habit Formation',
      description: 'Understanding how habits work in your brain',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p>
            Habits are the brain's way of conserving energy. By turning repeated actions into automatic behaviors, 
            your brain frees up mental resources for other tasks. Understanding the neuroscience of habits 
            provides a foundation for effective habit formation.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">What Are Habits?</h3>
          <p>
            Habits are automated routines triggered by specific cues in your environment or internal states. 
            They share these key characteristics:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Automatic:</strong> Require minimal conscious thought to execute</li>
            <li><strong>Consistent:</strong> Happen in response to the same triggers</li>
            <li><strong>Regular:</strong> Occur with predictable frequency</li>
            <li><strong>Context-dependent:</strong> Associated with specific situations or environments</li>
            <li><strong>Efficient:</strong> Free up mental bandwidth for other tasks</li>
            <li><strong>Resilient:</strong> Difficult to change once established</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">The Neuroscience of Habits</h3>
          <div className="space-y-4 mt-4">
            <p>
              Habits are formed in the basal ganglia, a part of the brain involved in movement control, procedural learning, and reward:
            </p>
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Neural Pathway Formation</h4>
              <p className="text-sm mt-2">
                When you repeat a behavior in response to a specific cue and receive a reward, neurons in your brain form 
                connections that strengthen each time the pattern is repeated.
              </p>
              <p className="text-sm mt-2 italic">
                "Neurons that fire together, wire together." As these neural pathways strengthen, the behavior becomes more automatic.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">The Role of Dopamine</h4>
              <p className="text-sm mt-2">
                Dopamine, often called the "reward chemical," plays a crucial role in habit formation. It reinforces the connection 
                between the cue, behavior, and reward, teaching your brain to anticipate the reward before it arrives.
              </p>
              <p className="text-sm mt-2 italic">
                Initially, dopamine is released when you experience the reward. Eventually, dopamine release shifts to the moment 
                the cue appears, creating an urge to complete the habit.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Chunking</h4>
              <p className="text-sm mt-2">
                As habits form, your brain "chunks" complex sequences of actions into single units, allowing you to perform 
                complicated routines with minimal cognitive effort.
              </p>
              <p className="text-sm mt-2 italic">
                Consider driving a car: initially, each step requires concentration, but eventually, the entire sequence becomes one 
                mental "chunk" that feels like a single action.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Cue-Routine-Reward Loop</h4>
              <p className="text-sm mt-2">
                Charles Duhigg popularized the "habit loop" concept, explaining how habits consist of three components:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Cue:</strong> The trigger that initiates the behavior</li>
                <li><strong>Routine:</strong> The behavior itself</li>
                <li><strong>Reward:</strong> The benefit gained from the behavior</li>
              </ul>
              <p className="text-sm mt-2 italic">
                This loop becomes increasingly automatic with repetition.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Why Habits Are Hard to Change</h3>
          <p>
            Once formed, habits are remarkably persistent due to several neurological factors:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Persistence of Neural Pathways</h4>
              <p className="text-sm mt-2">
                Habit-related neural connections aren't erased when you stop performing the habit—they remain dormant, 
                which is why old habits can easily be reactivated.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Automaticity</h4>
              <p className="text-sm mt-2">
                Once a behavior becomes automatic, it requires conscious effort to override it, which consumes mental energy 
                and willpower—limited resources that deplete throughout the day.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Emotional Attachment</h4>
              <p className="text-sm mt-2">
                Many habits are linked to emotional rewards, making them particularly difficult to change. Your brain strongly 
                defends behaviors that provide emotional relief or pleasure.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Environmental Cues</h4>
              <p className="text-sm mt-2">
                Your environment is filled with cues that trigger habitual behaviors. Unless these environmental triggers 
                change, they continue to activate the habit loop.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Myth of the 21-Day Rule</h3>
          <p>
            A common misconception is that it takes exactly 21 days to form a habit. This belief originated from plastic surgeon 
            Dr. Maxwell Maltz's observation that amputees took about 21 days to adjust to the loss of a limb, which was later 
            misinterpreted as applying to all habit formation.
          </p>
          <div className="bg-yellow-50 p-4 rounded-md mt-4">
            <h4 className="font-medium text-yellow-800">Research Shows:</h4>
            <p className="text-yellow-800 mt-2">
              A 2009 study by Phillippa Lally at University College London found that habit formation actually takes anywhere 
              from 18 to 254 days, with 66 days being the average. The time varies based on:
            </p>
            <ul className="list-disc pl-5 mt-2 text-yellow-800 space-y-1">
              <li>The complexity of the habit</li>
              <li>The individual's personality and motivation</li>
              <li>Environmental factors and context</li>
              <li>Consistency of practice</li>
            </ul>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              Understanding the neurological basis of habits shifts the focus from "trying harder" to "designing smarter." 
              By working with your brain's natural mechanisms rather than fighting against them, you can create systems 
              that make positive habit formation more achievable and sustainable.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'framework',
      title: 'A Framework for Habit Change',
      description: 'A systematic approach to forming new habits',
      icon: Workflow,
      content: (
        <div className="space-y-4">
          <p>
            Creating sustainable habits requires more than just motivation or willpower. It demands a systematic 
            approach that addresses all components of the habit loop and makes the desired behavior as easy and 
            rewarding as possible.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">James Clear's Four Laws of Behavior Change</h3>
          <p>
            In "Atomic Habits," James Clear outlines a comprehensive framework for habit formation based on four laws:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">1. Make It Obvious (Cue)</h4>
              <p className="text-sm">Create clear, specific cues for your new habit</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Implementation intentions:</strong> "I will [BEHAVIOR] at [TIME] in [LOCATION]."</li>
                <li><strong>Habit stacking:</strong> "After [CURRENT HABIT], I will [NEW HABIT]."</li>
                <li><strong>Environmental design:</strong> Place visual reminders or tools in your environment.</li>
                <li><strong>Attention shaping:</strong> Actively notice the cues that lead to good habits.</li>
              </ul>
              <p className="text-sm mt-2"><strong>Example:</strong> "After I pour my morning coffee (current habit), I will meditate for one minute (new habit)."</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">2. Make It Attractive (Craving)</h4>
              <p className="text-sm">Increase the appeal of the habit to strengthen motivation</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Temptation bundling:</strong> Pair something you want to do with something you need to do.</li>
                <li><strong>Social influence:</strong> Join communities where your desired behavior is the norm.</li>
                <li><strong>Reframing:</strong> Highlight the benefits rather than the difficulties.</li>
                <li><strong>Motivation rituals:</strong> Create a ritual that you enjoy before a difficult habit.</li>
              </ul>
              <p className="text-sm mt-2"><strong>Example:</strong> "I only get to watch my favorite show (want to do) while folding laundry (need to do)."</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">3. Make It Easy (Response)</h4>
              <p className="text-sm">Reduce friction and decrease the effort required</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Environment optimization:</strong> Arrange your space to reduce steps needed.</li>
                <li><strong>Reduce friction:</strong> Eliminate obstacles to your good habits.</li>
                <li><strong>Two-minute rule:</strong> Scale habits down to a two-minute version.</li>
                <li><strong>Commitment devices:</strong> Create mechanisms that lock in future behaviors.</li>
              </ul>
              <p className="text-sm mt-2"><strong>Example:</strong> "I'll set out my workout clothes the night before so they're ready in the morning."</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">4. Make It Satisfying (Reward)</h4>
              <p className="text-sm">Ensure the habit delivers immediate satisfaction</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Immediate rewards:</strong> Add a small, immediate pleasure to reinforce the behavior.</li>
                <li><strong>Habit tracking:</strong> Use a visual measurement of your progress.</li>
                <li><strong>Never miss twice:</strong> Get back on track immediately after a missed day.</li>
                <li><strong>Accountability partners:</strong> Have someone who expects you to maintain the habit.</li>
              </ul>
              <p className="text-sm mt-2"><strong>Example:</strong> "After each workout, I'll mark an X on my calendar and take a moment to feel proud of my consistency."</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">BJ Fogg's Tiny Habits Method</h3>
          <p>
            Stanford researcher BJ Fogg offers a complementary approach focused on starting extremely small:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">The Tiny Habits Formula</h4>
              <p className="text-sm mt-2">
                Fogg's formula consists of three components:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                <li><strong>Anchor:</strong> An existing habit or event (equivalent to a cue)</li>
                <li><strong>Tiny Behavior:</strong> A simplified version of the target habit (must take less than 30 seconds)</li>
                <li><strong>Celebration:</strong> An immediate positive emotion to reinforce the behavior</li>
              </ol>
              <p className="text-sm mt-2">
                Written formula: "After I [ANCHOR], I will [TINY BEHAVIOR], then [CELEBRATE]."
              </p>
              <p className="text-sm mt-2"><strong>Example:</strong> "After I brush my teeth, I will floss one tooth, then smile at myself in the mirror."</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">The Power of Celebration</h4>
              <p className="text-sm mt-2">
                Fogg emphasizes that creating a positive emotion immediately after the behavior is critical for habit formation. 
                This can be as simple as saying "Good job!" to yourself, making a victory gesture, or feeling a sense of pride.
              </p>
              <p className="text-sm mt-2">
                This celebration creates a positive feeling that helps your brain associate the behavior with pleasure, strengthening 
                the habit faster than the behavior alone.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Focus on Scaling Down, Not Motivation</h4>
              <p className="text-sm mt-2">
                The key insight of Tiny Habits is that it's more effective to make behaviors tiny and easy (increasing ability) 
                than to focus on increasing motivation, which fluctuates naturally.
              </p>
              <p className="text-sm mt-2">
                A behavior will occur when motivation and ability align with a prompt. By making the behavior extremely small, 
                you need less motivation to take action.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Combining Approaches for Optimal Results</h3>
          <p>
            The most effective habit formation system often combines elements from multiple frameworks:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Start tiny</strong> to ensure early success (Fogg)</li>
            <li><strong>Create obvious cues</strong> through habit stacking or implementation intentions (Clear)</li>
            <li><strong>Design your environment</strong> to make the behavior easier (Clear/Fogg)</li>
            <li><strong>Add immediate satisfaction</strong> through celebration or rewards (Clear/Fogg)</li>
            <li><strong>Track progress</strong> to make the long-term benefits visible (Clear)</li>
            <li><strong>Join communities</strong> where your desired habits are the norm (Clear)</li>
          </ol>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              These frameworks apply to both creating positive habits and breaking unwanted habits. For breaking 
              habits, invert the laws: make the cue invisible, make the routine unattractive, make it difficult, 
              and make it unsatisfying.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'implementation',
      title: 'Implementing Habit Systems',
      description: 'Practical strategies for establishing sustainable habits',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <p>
            Understanding habit science and frameworks provides the foundation, but success comes from effective 
            implementation. This module explores the practical aspects of establishing robust habit systems that 
            can withstand the challenges of daily life.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Selecting the Right Habits</h3>
          <p>
            Not all potential habits are equally valuable. Consider these factors when choosing habits to develop:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">High-Impact Habits</h4>
              <p className="text-sm mt-2">
                Focus on "keystone habits" that create a cascade of positive effects. These are habits that naturally lead to other 
                positive behaviors and outcomes.
              </p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Regular exercise (improves sleep, mood, energy, focus), daily planning, adequate sleep</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Identity-Based Habits</h4>
              <p className="text-sm mt-2">
                Connect habits to the person you want to become, not just the outcomes you want to achieve. Focus on who you wish 
                to be, rather than what you want to have.
              </p>
              <p className="text-sm mt-2"><strong>Examples:</strong> "I'm someone who moves every day" vs. "I want to lose weight"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Process-Oriented Habits</h4>
              <p className="text-sm mt-2">
                Emphasize consistent processes over specific outcomes. This maintains motivation when results are slow to appear 
                and builds sustainable behaviors.
              </p>
              <p className="text-sm mt-2"><strong>Examples:</strong> "Read for 20 minutes daily" vs. "Read 30 books this year"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Personal Values Alignment</h4>
              <p className="text-sm mt-2">
                Choose habits that genuinely align with your core values and intrinsic motivation. Externally imposed habits 
                are much harder to maintain.
              </p>
              <p className="text-sm mt-2"><strong>Examples:</strong> If you value connection, habits involving quality time with loved ones</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Habit Implementation Planning</h3>
          <p>
            Successful habit formation requires detailed planning:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Specific Implementation Intentions</h4>
              <div className="mt-2 text-sm">
                <p>Beyond vague goals, create precise plans for when, where, and how you'll perform the habit:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Weak plan:</strong> "I'll meditate more often."</li>
                  <li><strong>Strong plan:</strong> "I'll meditate for 5 minutes in my bedroom immediately after brushing my teeth each morning."</li>
                </ul>
                <p className="mt-2">Research shows implementation intentions dramatically increase follow-through.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Habit Stacking Strategies</h4>
              <div className="mt-2 text-sm">
                <p>Effectively linking new habits to existing routines:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Morning routine stack:</strong> "After pouring coffee, I'll write three things I'm grateful for."</li>
                  <li><strong>Workplace stack:</strong> "After logging into my computer, I'll set three priorities for the day."</li>
                  <li><strong>Evening routine stack:</strong> "After dinner, I'll go for a 10-minute walk."</li>
                </ul>
                <p className="mt-2">Choose reliable, consistent anchors that happen at appropriate times for the new habit.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Environmental Design</h4>
              <div className="mt-2 text-sm">
                <p>Structuring your physical environment to support your habits:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Proximity principle:</strong> Make tools for good habits visible and accessible</li>
                  <li><strong>Friction reduction:</strong> Eliminate steps between intention and action</li>
                  <li><strong>Visual cues:</strong> Create reminders in your environment</li>
                  <li><strong>Context switching:</strong> Create dedicated spaces for specific activities</li>
                </ul>
                <p className="mt-2">Example: Prepare a "habit station" with everything needed for your morning routine.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Scaling Strategy</h4>
              <div className="mt-2 text-sm">
                <p>Plan how the habit will grow over time:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li><strong>Starting point:</strong> Begin with a version so small you can't say no (1 minute of meditation)</li>
                  <li><strong>Consistency phase:</strong> Focus only on showing up consistently, not duration or quality</li>
                  <li><strong>Advancing phase:</strong> Once consistent, gradually increase duration or difficulty</li>
                  <li><strong>Optimization phase:</strong> Fine-tune the habit for maximum benefit</li>
                </ol>
                <p className="mt-2">Don't increase difficulty until consistency is established at the current level.</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Tracking and Accountability</h3>
          <p>
            Monitoring progress and creating accountability significantly increases habit success:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Habit Tracking Methods</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Physical trackers:</strong> Wall calendars, bullet journals, habit tracking cards</li>
                <li><strong>Digital apps:</strong> Dedicated habit tracking applications</li>
                <li><strong>Minimalist approach:</strong> Simple checkmark or tally systems</li>
                <li><strong>Measurement tracking:</strong> Recording specific metrics for quantifiable habits</li>
              </ul>
              <p className="text-sm mt-2">Effective tracking creates visual progress, establishes "don't break the chain" motivation, and provides data for improvement.</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Accountability Systems</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Accountability partners:</strong> Someone who checks in on your habit progress</li>
                <li><strong>Public commitments:</strong> Sharing your intentions with a larger group</li>
                <li><strong>Habit contracts:</strong> Formal agreements with defined consequences</li>
                <li><strong>Coaching relationships:</strong> Professional guidance and accountability</li>
              </ul>
              <p className="text-sm mt-2">The most effective accountability combines social pressure with personal investment.</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Review Systems</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Daily reflection:</strong> Brief assessment of habit completion and challenges</li>
                <li><strong>Weekly review:</strong> More comprehensive evaluation of trends and adjustments</li>
                <li><strong>Monthly assessment:</strong> Deeper analysis of progress and system optimization</li>
                <li><strong>Quarterly recalibration:</strong> Major evaluation of habit portfolio and priorities</li>
              </ul>
              <p className="text-sm mt-2">Regular reviews help identify obstacles early and refine your approach.</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Creating Habit Calendars</h3>
          <p>
            Scheduling habits effectively increases consistency and prevents overwhelm:
          </p>
          <div className="border rounded-md p-4 mt-4">
            <h4 className="font-medium">Sample Habit Calendar Structure</h4>
            <div className="mt-2 text-sm">
              <p><strong>Morning Block (6-8am):</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-0">
                <li>Hydration habit (16oz water upon waking)</li>
                <li>Movement habit (10 min stretching/yoga)</li>
                <li>Mindfulness habit (5 min meditation)</li>
                <li>Planning habit (Review daily priorities)</li>
              </ul>
              
              <p className="mt-2"><strong>Work/Day Block:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-0">
                <li>Productivity habit (25 min focused work, 5 min break)</li>
                <li>Posture habit (Stand for 10 min each hour)</li>
                <li>Connection habit (One meaningful conversation)</li>
              </ul>
              
              <p className="mt-2"><strong>Evening Block:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-0">
                <li>Movement habit (30 min exercise or walking)</li>
                <li>Learning habit (20 min reading)</li>
                <li>Wind-down habit (No screens 30 min before bed)</li>
                <li>Reflection habit (Journal 3 positive things)</li>
              </ul>
            </div>
            <p className="text-sm mt-2 italic">
              Balance is crucial! Start with just 1-3 new habits and establish consistency before adding more.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              Remember that implementation is where most habit efforts succeed or fail. A mediocre habit with 
              excellent implementation will outperform an ideal habit with poor implementation. Focus on making 
              your habits automatic, inevitable parts of your day rather than items on a to-do list that require 
              constant decision-making.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'obstacles',
      title: 'Overcoming Habit Obstacles',
      description: 'Solutions for common challenges to habit consistency',
      icon: BarChart,
      content: (
        <div className="space-y-4">
          <p>
            Even with solid planning and good intentions, obstacles to habit consistency inevitably arise. 
            Anticipating and preparing for these challenges dramatically increases your chances of long-term success.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Understanding Habit Inconsistency</h3>
          <p>
            Recognize that occasional missed days are normal, not catastrophic:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">The Plateau of Latent Potential</h4>
              <p className="text-sm mt-2">
                Progress often follows a plateau-breakthrough pattern rather than a steady upward line. During plateaus, it's easy 
                to become discouraged and abandon habits, not realizing that breakthrough results are often just ahead.
              </p>
              <p className="text-sm mt-2">
                This "valley of disappointment" is where most habit efforts fail. Understanding this pattern helps maintain 
                motivation during periods of invisible progress.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">The Impact of Missing Once vs. Twice</h4>
              <p className="text-sm mt-2">
                Research shows that missing your habit once has minimal impact on long-term success. However, missing twice in a row 
                significantly increases the likelihood of abandoning the habit altogether.
              </p>
              <p className="text-sm mt-2">
                This is why James Clear's advice to "never miss twice" is so powerful. If you miss a day, make returning to the 
                habit your top priority, even if you can only do a minimal version.
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Habit Elasticity</h4>
              <p className="text-sm mt-2">
                Different types of habits have different levels of "elasticity" or sensitivity to disruption:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>High elasticity:</strong> Habits that quickly degrade with inconsistency (e.g., language learning, musical practice)</li>
                <li><strong>Medium elasticity:</strong> Habits that tolerate some inconsistency (e.g., exercise, meditation)</li>
                <li><strong>Low elasticity:</strong> Habits that persist despite occasional misses (e.g., dietary patterns, basic hygiene)</li>
              </ul>
              <p className="text-sm mt-2">
                Knowing your habit's elasticity helps you prioritize consistency where it matters most.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Common Obstacles and Solutions</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Motivation Fluctuations</h4>
              <p className="text-sm mt-2">
                <strong>Challenge:</strong> Natural ebbs and flows in enthusiasm and energy for your habits
              </p>
              <p className="text-sm mt-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Scale habits down during low-motivation periods rather than skipping entirely</li>
                <li>Use "minimum viable effort" versions for challenging days</li>
                <li>Build systems that don't require motivation (automation, environment design)</li>
                <li>Connect to deeper "why" behind habits when motivation wanes</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Schedule Disruptions</h4>
              <p className="text-sm mt-2">
                <strong>Challenge:</strong> Travel, illness, work crises, or other factors that disrupt normal routines
              </p>
              <p className="text-sm mt-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Create "travel versions" or "disruption protocols" for key habits</li>
                <li>Focus on maintaining keystone habits during disruptions</li>
                <li>Prepare contingency plans for predictable disruptions</li>
                <li>Use disruptions as opportunities to practice flexibility</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Plateau Effects and Boredom</h4>
              <p className="text-sm mt-2">
                <strong>Challenge:</strong> Loss of novelty and excitement as habits become routine
              </p>
              <p className="text-sm mt-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Introduce strategic variation while maintaining the core habit</li>
                <li>Set new challenges or milestones within the habit framework</li>
                <li>Connect with communities to maintain engagement</li>
                <li>Use habit tracking to visualize non-obvious progress</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">All-or-Nothing Thinking</h4>
              <p className="text-sm mt-2">
                <strong>Challenge:</strong> Tendency to abandon habits after imperfect performance
              </p>
              <p className="text-sm mt-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Define success as "showing up" rather than perfect performance</li>
                <li>Track consistency separate from quality or duration metrics</li>
                <li>Use the "two-day rule" (never miss twice in a row)</li>
                <li>Celebrate partial efforts and adaptations</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Social Environment Resistance</h4>
              <p className="text-sm mt-2">
                <strong>Challenge:</strong> Friends, family, or colleagues who directly or indirectly undermine habits
              </p>
              <p className="text-sm mt-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Communicate your goals and request specific support</li>
                <li>Find like-minded communities for positive reinforcement</li>
                <li>Prepare responses for social pressure situations</li>
                <li>Align habits with social activities when possible</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Habit Recovery Protocol</h3>
          <p>
            Having a specific plan for getting back on track after disruptions is crucial:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">1. No-Guilt Restart</h4>
              <p className="text-sm mt-2">
                Eliminate self-criticism or shame about missed days. Research shows negative emotions about habit lapses make 
                recovery less likely, not more likely.
              </p>
              <p className="text-sm mt-2 italic">
                "I'm back to my habit now, and that's what matters."
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">2. Analyze Without Judgment</h4>
              <p className="text-sm mt-2">
                Objectively examine what led to the disruption—was it a specific trigger, environment, emotional state, or 
                circumstance? This information is valuable for future prevention.
              </p>
              <p className="text-sm mt-2 italic">
                "I noticed I skipped my morning routine when I stayed up late the night before."
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">3. Scale Down for Immediate Success</h4>
              <p className="text-sm mt-2">
                Temporarily reduce the habit to its smallest, most manageable form to rebuild momentum and confidence.
              </p>
              <p className="text-sm mt-2 italic">
                "Today I'll just do five minutes of my normal thirty-minute routine."
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">4. Strengthen the Cue</h4>
              <p className="text-sm mt-2">
                Enhance your reminder system—make the habit trigger more obvious or add additional cues.
              </p>
              <p className="text-sm mt-2 italic">
                "I'll set an additional reminder and put my running shoes by the door."
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">5. Recommit and Move Forward</h4>
              <p className="text-sm mt-2">
                Make a clear, specific commitment to resuming the habit, then focus entirely on the present and future practice.
              </p>
              <p className="text-sm mt-2 italic">
                "Starting tomorrow morning, I'm back to my meditation practice."
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              The most successful habit practitioners aren't those who never falter—they're those who recover quickly 
              when they do. Resilience, not perfection, is the true hallmark of effective habit formation. By planning 
              for obstacles and having specific recovery strategies, you transform potential failure points into 
              opportunities to strengthen your habit systems.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'identity',
      title: 'Identity-Based Habits',
      description: 'The deeper dimension of lasting behavioral change',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p>
            The most powerful and sustainable habit changes occur at the level of identity—who you believe yourself 
            to be. When your habits align with your self-conception, they become not just things you do, but 
            expressions of who you are.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Three Layers of Behavior Change</h3>
          <p>
            James Clear describes three levels where change can occur:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Outcomes: Changing Your Results</h4>
              <p className="text-sm mt-2">
                The most surface level of change—focusing on specific goals or desired results.
              </p>
              <p className="text-sm mt-2">
                <strong>Examples:</strong> Losing weight, publishing a book, saving $10,000
              </p>
              <p className="text-sm mt-2 italic">
                "I want to achieve X outcome."
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Processes: Changing Your Habits</h4>
              <p className="text-sm mt-2">
                The middle level—focusing on systems, habits, and routines.
              </p>
              <p className="text-sm mt-2">
                <strong>Examples:</strong> Following a workout program, writing daily, automating savings
              </p>
              <p className="text-sm mt-2 italic">
                "I want to follow X habit or system."
              </p>
            </div>
            
            <div className="border rounded-md p-4 bg-orange-50">
              <h4 className="font-medium">Identity: Changing Your Beliefs</h4>
              <p className="text-sm mt-2">
                The deepest level—focusing on who you believe yourself to be.
              </p>
              <p className="text-sm mt-2">
                <strong>Examples:</strong> Seeing yourself as an athlete, a writer, a financially responsible person
              </p>
              <p className="text-sm mt-2 italic">
                "I want to become the type of person who X."
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Why Identity-Based Habits Work</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Intrinsic Motivation</h4>
              <p className="text-sm mt-2">
                When behavior aligns with identity, the motivation becomes internal rather than external. You're no longer acting 
                to get approval, avoid guilt, or reach an external goal—you're expressing who you are.
              </p>
              <p className="text-sm mt-2">
                Research shows intrinsically motivated behaviors are far more sustainable than extrinsically motivated ones.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Decision Simplification</h4>
              <p className="text-sm mt-2">
                Identity-based habits reduce decision fatigue because they transform choices from deliberations into simple 
                expressions of identity: "What would a person like me do in this situation?"
              </p>
              <p className="text-sm mt-2">
                Example: A person who identifies as a health-conscious individual doesn't need to deliberate about healthy food 
                choices—they simply choose what aligns with their identity.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Consistency Pressure</h4>
              <p className="text-sm mt-2">
                Humans have a strong psychological need for consistency with their self-image. Once you adopt an identity, 
                behaviors that contradict it create uncomfortable cognitive dissonance.
              </p>
              <p className="text-sm mt-2">
                This creates a natural gravitational pull toward habits that align with your identity and away from those that don't.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Resilience to Setbacks</h4>
              <p className="text-sm mt-2">
                Identity-based habits are more resilient to temporary failures. While outcome-based motivation disappears if you fall 
                behind on your goals, identity persists through ups and downs.
              </p>
              <p className="text-sm mt-2">
                Example: If a "runner" misses a run, they still see themselves as a runner who missed a day—not someone who stopped being a runner.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Building Identity-Based Habits</h3>
          <p>
            The process of developing identity-based habits works in both directions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-2">Identity → Habits</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Decide on the type of person you want to be</li>
                <li>Prove it to yourself with small wins</li>
                <li>Let evidence accumulate to strengthen identity</li>
                <li>Expand habits that align with this identity</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-2">Habits → Identity</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Start with a small habit</li>
                <li>Consistently show up and perform it</li>
                <li>Reflect on what this behavior says about you</li>
                <li>Allow identity to form around consistent behavior</li>
              </ol>
            </div>
          </div>
          <p className="mt-4">
            Both approaches can be effective, and they often work in tandem, creating a virtuous cycle where identity 
            drives habits and habits strengthen identity.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Practical Implementation</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Identity Reflection</h4>
              <p className="text-sm mt-2">
                Regularly ask yourself identity-forming questions:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>"Who is the type of person who would achieve my goals?"</li>
                <li>"What would someone who [identity] do in this situation?"</li>
                <li>"What beliefs would I need to hold to become [identity]?"</li>
                <li>"What small action would provide evidence that I am [identity]?"</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Identity Affirmations and Reframing</h4>
              <p className="text-sm mt-2">
                Use language that reinforces your desired identity:
              </p>
              <div className="mt-2 text-sm">
                <p><strong>Instead of:</strong> "I'm trying to quit smoking."</p>
                <p><strong>Say:</strong> "I'm not a smoker."</p>
                <p className="mt-2"><strong>Instead of:</strong> "I'm going to try to exercise more."</p>
                <p><strong>Say:</strong> "I'm an active person who prioritizes movement."</p>
              </div>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Evidence Collection</h4>
              <p className="text-sm mt-2">
                Actively gather and reflect on evidence that supports your desired identity:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Keep a "proof journal" documenting behaviors that align with your identity</li>
                <li>Take photos of yourself engaging in identity-consistent behaviors</li>
                <li>Track metrics that provide evidence of your identity</li>
                <li>Celebrate and acknowledge when you act in alignment with your desired identity</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Community Reinforcement</h4>
              <p className="text-sm mt-2">
                Join groups where your desired identity is the norm:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Find communities (online or in-person) where your desired behaviors are standard</li>
                <li>Participate in group activities that reinforce your identity</li>
                <li>Share your identity journey with supportive others</li>
                <li>Seek mentors who embody the identity you aspire to</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Identity Evolution and Integration</h3>
          <p>
            Identity is not static—it evolves as you grow and gain new experiences:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Expect progression</strong> as your identity develops through stages</li>
            <li><strong>Integrate multiple identities</strong> rather than seeing them as separate</li>
            <li><strong>Allow for contextual expression</strong> of different identity aspects</li>
            <li><strong>Revise and refine</strong> your identity based on authentic experience</li>
          </ul>
          
          <div className="p-4 bg-blue-50 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Continuous Improvement</h4>
            <p className="text-blue-800">
              The most profound habit transformations come when you stop trying to change what you do and start 
              changing who you believe yourself to be. Small actions, consistently repeated, don't just build habits—they 
              build new identities. As these identities strengthen, they create a powerful foundation for lasting 
              behavior change that feels less like forcing yourself to follow rules and more like expressing your 
              authentic self.
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
          <Workflow className="h-6 w-6 mr-2 text-orange-500" />
          Forming Positive Habits
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
              <CardTitle>Introduction to Forming Positive Habits</CardTitle>
              <CardDescription>
                Learn evidence-based strategies for building sustainable habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Habits shape our lives more than we realize—about 40-50% of our daily actions are habitual rather 
                than conscious decisions. Yet most people struggle to establish positive habits that stick.
              </p>
              <p className="mb-4">
                This course presents the science of habit formation and practical, research-backed frameworks for 
                creating sustainable habits. Whether you want to develop healthier behaviors, improve productivity, 
                or master new skills, these strategies will help you design systems that make positive habits 
                inevitable rather than draining.
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
              <CardTitle>Test Your Knowledge on Habit Formation</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about creating sustainable habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Forming Positive Habits"
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
              <CardTitle>Habit Formation Resources</CardTitle>
              <CardDescription>
                Books, tools, and resources to help you develop positive habits
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
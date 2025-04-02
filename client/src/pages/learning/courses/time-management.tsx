import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, Clock, CalendarClock, ClipboardList, LineChart, Hourglass } from 'lucide-react';
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

export default function TimeManagementCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Time Management
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is the Eisenhower Matrix used for?",
      options: [
        "Financial planning",
        "Prioritizing tasks based on urgency and importance",
        "Setting up calendar events",
        "Managing team workflows"
      ],
      correctAnswer: 1,
      explanation: "The Eisenhower Matrix helps prioritize tasks by categorizing them along two dimensions: urgent/not urgent and important/not important."
    },
    {
      id: 2,
      question: "Which of the following is an example of the Pareto Principle (80/20 rule) in time management?",
      options: [
        "20% of your tasks produce 80% of your results",
        "You should work for 80 minutes, then rest for 20 minutes",
        "80% of people are naturally good at time management",
        "You should spend 20% of your day planning and 80% executing"
      ],
      correctAnswer: 0,
      explanation: "The Pareto Principle suggests that roughly 80% of effects come from 20% of causes. In time management, this means 20% of your tasks typically produce 80% of your results."
    },
    {
      id: 3,
      question: "What is 'time blocking'?",
      options: [
        "Scheduling specific time periods for specific tasks or activities",
        "Completely eliminating distractions during work hours",
        "Taking regular breaks between tasks",
        "Delegating tasks to save time"
      ],
      correctAnswer: 0,
      explanation: "Time blocking is a productivity method where you divide your day into blocks of time, each dedicated to accomplishing a specific task or group of tasks."
    },
    {
      id: 4,
      question: "What is the Pomodoro Technique?",
      options: [
        "Working in short, focused sprints with breaks in between",
        "Completing the hardest tasks at the beginning of the day",
        "Organizing tasks by color coding",
        "Delegating tasks to team members based on their strengths"
      ],
      correctAnswer: 0,
      explanation: "The Pomodoro Technique involves working in focused intervals (typically 25 minutes) followed by short breaks (5 minutes), with longer breaks after completing several work intervals."
    },
    {
      id: 5,
      question: "Which strategy helps combat procrastination?",
      options: [
        "Multitasking to complete more in less time",
        "Setting unrealistic deadlines to push yourself",
        "Breaking large tasks into smaller, manageable steps",
        "Waiting for the perfect moment to begin"
      ],
      correctAnswer: 2,
      explanation: "Breaking large, overwhelming tasks into smaller steps makes them feel more manageable and reduces the psychological resistance that leads to procrastination."
    },
    {
      id: 6,
      question: "What does the acronym 'SMART' refer to in goal setting?",
      options: [
        "Simple, Meaningful, Actionable, Realistic, Timely",
        "Specific, Measurable, Achievable, Relevant, Time-bound",
        "Strategic, Motivational, Accurate, Resourceful, Tactical",
        "Scheduled, Monitored, Assigned, Reviewed, Tracked"
      ],
      correctAnswer: 1,
      explanation: "SMART goals are Specific (clearly defined), Measurable (quantifiable), Achievable (realistic), Relevant (aligned with broader objectives), and Time-bound (with deadlines)."
    },
    {
      id: 7,
      question: "Which of these is NOT an effective strategy for managing digital distractions?",
      options: [
        "Using website blockers during focused work time",
        "Having multiple tabs and applications open for quick task switching",
        "Setting specific times to check email and social media",
        "Putting your phone on 'Do Not Disturb' mode"
      ],
      correctAnswer: 1,
      explanation: "Having multiple tabs and applications open encourages multitasking and increases the likelihood of distraction. The other options help minimize digital interruptions."
    },
    {
      id: 8,
      question: "What is 'time batching'?",
      options: [
        "Scheduling all meetings on one day of the week",
        "Grouping similar tasks together to complete them more efficiently",
        "Setting time limits for how long you'll work on any given task",
        "Adding buffer time between tasks to prevent overrun"
      ],
      correctAnswer: 1,
      explanation: "Time batching involves grouping similar tasks together (like responding to all emails, making all phone calls) to reduce the mental switching costs associated with changing between different types of work."
    },
    {
      id: 9,
      question: "What is the '2-minute rule' in time management?",
      options: [
        "Take a 2-minute break after completing each task",
        "Spend 2 minutes planning before starting any task",
        "If a task takes less than 2 minutes, do it immediately",
        "Set a 2-minute timer when feeling stuck on a task"
      ],
      correctAnswer: 2,
      explanation: "The 2-minute rule, popularized by David Allen in 'Getting Things Done,' states that if a task will take less than 2 minutes to complete, you should do it immediately rather than scheduling it for later."
    },
    {
      id: 10,
      question: "Which of the following best describes 'deep work'?",
      options: [
        "Working late into the night when distractions are minimal",
        "Collaborative brainstorming in intensive team meetings",
        "Professional activity performed in a state of distraction-free concentration",
        "Completing many simple tasks in rapid succession"
      ],
      correctAnswer: 2,
      explanation: "Deep work, a term coined by Cal Newport, refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit, creating new value and improving your skills."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "Pomodoro Technique Official Website",
      url: "https://francescocirillo.com/pages/pomodoro-technique",
      description: "Learn about the popular time management method"
    },
    {
      title: "Deep Work: Rules for Focused Success",
      url: "https://www.calnewport.com/books/deep-work/",
      description: "Book by Cal Newport on achieving focused productivity"
    },
    {
      title: "Todoist",
      url: "https://todoist.com/",
      description: "Popular task management app with prioritization features"
    },
    {
      title: "Time Management for Students",
      url: "https://www.goconqr.com/en/examtime/blog/time-management-for-students/",
      description: "Practical time management tips for academic success"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'foundations',
      title: 'Time Management Fundamentals',
      description: 'Learn the core principles of effective time management',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <p>
            Time is our most limited resource. Effective time management isn't about squeezing more tasks 
            into your day—it's about getting the right things done, making the most of your time, and maintaining 
            a healthy work-life balance.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Why Time Management Matters</h3>
          <p>
            Good time management allows you to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Accomplish more with less effort</li>
            <li>Reduce stress and avoid burnout</li>
            <li>Improve decision-making abilities</li>
            <li>Create more time for things you enjoy</li>
            <li>Follow through on commitments</li>
            <li>Focus on high-value activities</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Common Time Management Challenges</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Procrastination</h4>
              <p className="text-sm">Delaying important tasks despite knowing negative consequences</p>
              <p className="text-sm mt-2 italic">Solution: Break tasks into smaller steps, use the "5-minute rule" to get started</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Distractions</h4>
              <p className="text-sm">External (notifications) and internal (wandering thoughts) interruptions</p>
              <p className="text-sm mt-2 italic">Solution: Create a distraction-free environment, practice focused work sessions</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Poor Prioritization</h4>
              <p className="text-sm">Working on low-value activities while neglecting important tasks</p>
              <p className="text-sm mt-2 italic">Solution: Use prioritization frameworks like the Eisenhower Matrix</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Overscheduling</h4>
              <p className="text-sm">Booking too many commitments without buffer time</p>
              <p className="text-sm mt-2 italic">Solution: Build in transition time, learn to say no</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Perfectionism</h4>
              <p className="text-sm">Spending too much time perfecting tasks that don't require it</p>
              <p className="text-sm mt-2 italic">Solution: Determine appropriate quality levels for different tasks</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Time Management Mindset</h3>
          <p>
            Effective time management begins with your mindset. Developing these mental habits can transform your productivity:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Value your time:</strong> Recognize time as a finite, non-renewable resource</li>
            <li><strong>Be intentional:</strong> Make conscious choices about how you spend your time</li>
            <li><strong>Focus on outcomes:</strong> Measure productivity by results, not hours worked</li>
            <li><strong>Embrace imperfection:</strong> Accept that "good enough" is sometimes appropriate</li>
            <li><strong>Practice patience:</strong> Time management is a skill that improves with practice</li>
          </ul>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              The goal of time management isn't to become a productivity machine—it's to create a balanced 
              life where you have time for what truly matters to you while still meeting your responsibilities.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'prioritization',
      title: 'Prioritization Techniques',
      description: 'Learn how to identify and focus on high-impact tasks',
      icon: ClipboardList,
      content: (
        <div className="space-y-4">
          <p>
            Prioritization is arguably the most important component of time management. It's about ensuring 
            that you're focusing your limited time and energy on the tasks that matter most. This module 
            explores frameworks and techniques to help you prioritize effectively.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Eisenhower Matrix</h3>
          <p>
            This powerful prioritization framework categorizes tasks along two dimensions: importance and urgency.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-green-100 p-4">
              <h4 className="font-medium">Important & Urgent</h4>
              <p className="text-sm">DO FIRST</p>
              <p className="text-sm mt-2">Crisis tasks, pressing deadlines, emergency situations</p>
            </div>
            
            <div className="bg-blue-100 p-4">
              <h4 className="font-medium">Important & Not Urgent</h4>
              <p className="text-sm">SCHEDULE</p>
              <p className="text-sm mt-2">Planning, relationship building, personal development</p>
            </div>
            
            <div className="bg-yellow-100 p-4">
              <h4 className="font-medium">Not Important & Urgent</h4>
              <p className="text-sm">DELEGATE</p>
              <p className="text-sm mt-2">Some meetings, some emails, some phone calls</p>
            </div>
            
            <div className="bg-red-100 p-4">
              <h4 className="font-medium">Not Important & Not Urgent</h4>
              <p className="text-sm">ELIMINATE</p>
              <p className="text-sm mt-2">Time wasters, trivial tasks, excessive social media</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Pareto Principle (80/20 Rule)</h3>
          <p>
            This principle suggests that roughly 80% of results come from 20% of efforts. In time management, this means:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Identify the 20% of your tasks that produce 80% of your desired outcomes</li>
            <li>Focus your energy on these high-leverage activities</li>
            <li>Minimize time spent on low-value activities that contribute little to your goals</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">ABC Method</h3>
          <p>
            Categorize your tasks into three priority levels:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">A Tasks</h4>
              <p className="text-sm">High-value activities with significant consequences if not completed</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-medium">B Tasks</h4>
              <p className="text-sm">Medium-value activities with moderate consequences</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">C Tasks</h4>
              <p className="text-sm">Low-value activities with minimal or no consequences</p>
            </div>
          </div>
          <p className="mt-4">
            Always complete A tasks before moving to B tasks, and B tasks before C tasks.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">ABCDE Method</h3>
          <p>
            An extension of the ABC method with additional nuance:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>A:</strong> Must do — Serious consequences if not completed</li>
            <li><strong>B:</strong> Should do — Mild consequences if not completed</li>
            <li><strong>C:</strong> Nice to do — No consequences if not completed</li>
            <li><strong>D:</strong> Delegate — Tasks someone else can do</li>
            <li><strong>E:</strong> Eliminate — Tasks that aren't necessary</li>
          </ul>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              A common mistake is confusing urgency with importance. Just because something feels urgent 
              doesn't mean it's important. Learn to distinguish between the two to avoid spending your 
              time on urgent but unimportant tasks.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'techniques',
      title: 'Productivity Techniques',
      description: 'Practical methods to maximize efficiency and focus',
      icon: Hourglass,
      content: (
        <div className="space-y-4">
          <p>
            Once you've identified your priorities, you need practical techniques to execute them efficiently. 
            This module presents proven productivity methods that can help you manage your time effectively 
            and maintain focus.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Pomodoro Technique</h3>
          <div className="space-y-2">
            <p>
              This time-tested method uses focused work periods followed by short breaks:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Choose a task to work on</li>
              <li>Set a timer for 25 minutes (one "Pomodoro")</li>
              <li>Work with complete focus until the timer rings</li>
              <li>Take a short 5-minute break</li>
              <li>After 4 Pomodoros, take a longer 15-30 minute break</li>
            </ol>
            <p className="mt-2">
              Benefits include improved focus, reduced mental fatigue, and a clear sense of accomplishment.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Time Blocking</h3>
          <div className="space-y-2">
            <p>
              Reserve specific blocks of time for specific activities:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Divide your day into blocks (e.g., 30-90 minute segments)</li>
              <li>Assign specific tasks or categories of work to each block</li>
              <li>Include blocks for breaks, email, meetings, and deep work</li>
              <li>Batch similar tasks together when possible</li>
              <li>Be realistic about how long tasks will take</li>
            </ul>
            <p className="mt-2">
              Time blocking creates a visual schedule, reduces decision fatigue, and helps prevent multitasking.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The 2-Minute Rule</h3>
          <p>
            From David Allen's Getting Things Done methodology:
          </p>
          <div className="bg-gray-50 p-4 rounded-md mt-2">
            <p className="italic">
              "If an action will take less than two minutes, it should be done at the moment it's defined."
            </p>
          </div>
          <p className="mt-2">
            This simple rule prevents small tasks from piling up and taking more time later.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The ABCDE Method in Practice</h3>
          <div className="space-y-2">
            <p>
              Here's how to implement the ABCDE method in your daily routine:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Before starting your day or the night before, list everything you need to do</li>
              <li>Assign each task a letter from A to E</li>
              <li>Number all A tasks by priority (A1, A2, A3...)</li>
              <li>Do the same for B and C tasks</li>
              <li>Start with A1 and work your way down the list</li>
            </ol>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Eat That Frog</h3>
          <div className="space-y-2">
            <p>
              Based on Brian Tracy's productivity system:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="italic">
                "If the first thing you do each morning is to eat a live frog, you can go through the day with the satisfaction of knowing that it's probably the worst thing that's going to happen to you all day long."
              </p>
            </div>
            <p className="mt-2">
              Your "frog" is your biggest, most important task—the one you're most likely to procrastinate on. 
              Do it first thing in the morning when your willpower and energy are highest.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              Don't try to implement all of these techniques at once. Choose one that resonates with you, 
              practice it until it becomes a habit, then consider adding another. Consistency with one technique 
              is better than inconsistent use of many.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'planning',
      title: 'Planning and Goal Setting',
      description: 'Creating effective systems for short and long-term success',
      icon: CalendarClock,
      content: (
        <div className="space-y-4">
          <p>
            Planning and goal setting create the foundation for effective time management. Without clear goals, 
            it's impossible to prioritize properly. This module explores how to set meaningful goals and create 
            planning systems that help you achieve them.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">SMART Goal Setting</h3>
          <p>
            Effective goals should be:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Specific</h4>
              <p className="text-sm">Clearly defined and precise</p>
              <p className="text-sm italic mt-2">Not: "Get better at math" | Instead: "Improve my calculus grade from B- to B+"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Measurable</h4>
              <p className="text-sm">Include specific criteria to track progress</p>
              <p className="text-sm italic mt-2">Not: "Save more money" | Instead: "Save $500 per month"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Achievable</h4>
              <p className="text-sm">Challenging but realistic given your resources and constraints</p>
              <p className="text-sm italic mt-2">Not: "Run a marathon next week" (if you're a beginner) | Instead: "Run a 5K in 8 weeks"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Relevant</h4>
              <p className="text-sm">Aligned with your broader objectives and values</p>
              <p className="text-sm italic mt-2">Not: "Learn to juggle" (if it doesn't support your priorities) | Instead: "Learn public speaking to advance my career"</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Time-bound</h4>
              <p className="text-sm">Has a specific deadline or timeframe</p>
              <p className="text-sm italic mt-2">Not: "Someday I'll write a book" | Instead: "Complete first draft by December 31st"</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Planning Horizons</h3>
          <p>
            Effective planning happens at multiple time scales:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Annual Planning</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Set 3-5 major goals for the year</li>
                <li>Identify key projects and milestones</li>
                <li>Align with your longer-term vision</li>
                <li>Review and revise quarterly</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Monthly Planning</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Break annual goals into monthly objectives</li>
                <li>Schedule key appointments and deadlines</li>
                <li>Allocate resources and time commitments</li>
                <li>Review progress on larger projects</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Weekly Planning</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Review upcoming week every Sunday or Monday</li>
                <li>Identify 3-5 key priorities for the week</li>
                <li>Schedule blocks of time for important tasks</li>
                <li>Prepare for upcoming meetings and events</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Daily Planning</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Identify 1-3 "must do" tasks for the day</li>
                <li>Review and update your schedule</li>
                <li>Apply prioritization techniques</li>
                <li>Build in buffer time for unexpected issues</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Planning Systems</h3>
          <div className="space-y-2">
            <p>Choose a planning system that works for your lifestyle:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Digital planners:</strong> Calendar apps, task management software, digital notes</li>
              <li><strong>Paper planners:</strong> Bullet journals, day planners, wall calendars</li>
              <li><strong>Hybrid approach:</strong> Combining digital and paper methods for different needs</li>
            </ul>
            <p className="mt-2">
              Regardless of your system, the key is consistency. Review and update your plans regularly.
            </p>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Habit Stacking</h3>
          <p>
            Connect new planning habits to existing routines:
          </p>
          <div className="bg-gray-50 p-4 rounded-md mt-2">
            <p className="italic">
              "After I [current habit], I will [new planning habit]."
            </p>
          </div>
          <p className="mt-2">
            Examples:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>"After I pour my morning coffee, I will review my top three priorities for the day."</li>
            <li>"After I brush my teeth on Sunday evening, I will plan my upcoming week."</li>
          </ul>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              Plans are valuable, but flexibility is essential. Think of your plans as a compass that helps 
              you navigate, not as rigid rules that can't be adjusted when circumstances change.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'habits',
      title: 'Building Better Time Habits',
      description: 'Creating sustainable systems for long-term success',
      icon: LineChart,
      content: (
        <div className="space-y-4">
          <p>
            Time management isn't just about techniques—it's about developing sustainable habits that become 
            automatic over time. This module explores how to build better time habits and overcome common 
            obstacles to productivity.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Understanding Habit Formation</h3>
          <p>
            According to James Clear's "Atomic Habits," every habit consists of four stages:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">1. Cue</h4>
              <p className="text-sm">The trigger that initiates the behavior (time of day, location, emotional state)</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">2. Craving</h4>
              <p className="text-sm">The motivation or desire for the reward</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-medium">3. Response</h4>
              <p className="text-sm">The actual habit or action you take</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-medium">4. Reward</h4>
              <p className="text-sm">The benefit gained from performing the habit</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Building Better Time Habits</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Obvious</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Set clear implementation intentions ("At 9am, I will...")</li>
                <li>Design your environment to support good habits</li>
                <li>Use visual cues and reminders</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Attractive</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Use temptation bundling (pair difficult tasks with something enjoyable)</li>
                <li>Join a culture where your desired behavior is the norm</li>
                <li>Create a motivation ritual before difficult tasks</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Easy</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Reduce friction for good habits (set out materials in advance)</li>
                <li>Start with two-minute versions of habits</li>
                <li>Automate and eliminate decisions where possible</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Satisfying</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Use immediate rewards to reinforce behavior</li>
                <li>Track your habits with a habit tracker</li>
                <li>Never miss twice (if you break a streak, get back on track immediately)</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Breaking Bad Time Habits</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Invisible</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Remove cues for bad habits from your environment</li>
                <li>Leave your phone in another room while working</li>
                <li>Use website blockers during focused work</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Unattractive</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Reframe your mindset about the habit</li>
                <li>Highlight the benefits of avoiding bad habits</li>
                <li>Find a community that reinforces positive behaviors</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Difficult</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Increase friction for bad habits</li>
                <li>Use commitment devices (like website blockers)</li>
                <li>Create an environment where good choices are easier</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Make It Unsatisfying</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Create accountability through a habit contract</li>
                <li>Find an accountability partner</li>
                <li>Make the costs of bad habits immediate and visible</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Power of Identity</h3>
          <p>
            The most effective way to change your habits is to focus on who you wish to become:
          </p>
          <div className="bg-gray-50 p-4 rounded-md mt-2">
            <p className="italic">
              "The goal is not to read a book, the goal is to become a reader.<br />
              The goal is not to run a marathon, the goal is to become a runner.<br />
              The goal is not to learn an instrument, the goal is to become a musician."
            </p>
          </div>
          <p className="mt-2">
            When you focus on building identity-based habits, you're not just doing things differently, 
            you're becoming someone different.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Continuous Improvement</h4>
            <p className="text-blue-800">
              The goal isn't perfection; it's continuous improvement. Aim to get 1% better each day. 
              These small improvements compound over time, leading to remarkable changes in your productivity 
              and time management abilities.
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
          <Clock className="h-6 w-6 mr-2 text-orange-500" />
          Time Management
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
              <CardTitle>Introduction to Time Management</CardTitle>
              <CardDescription>
                Learn strategies to maximize productivity and reduce stress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Effective time management isn't about squeezing more tasks into your day—it's about prioritizing 
                what's important, eliminating time-wasters, and creating systems that help you work more efficiently.
              </p>
              <p className="mb-4">
                This course teaches practical strategies for managing your time effectively, setting meaningful 
                priorities, overcoming procrastination, and building sustainable productivity habits that will serve 
                you in school, work, and personal life.
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
              <CardTitle>Test Your Time Management Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about managing your time effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Time Management"
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
              <CardTitle>Time Management Resources</CardTitle>
              <CardDescription>
                Helpful links and tools to improve your time management skills
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
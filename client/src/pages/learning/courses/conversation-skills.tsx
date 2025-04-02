import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, BookOpenIcon, MessageCircle, Users, Ear, Presentation, Sparkles } from 'lucide-react';
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

export default function ConversationSkillsCourse() {
  const [, navigate] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Quiz questions for Conversation Skills
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "What is active listening?",
      options: [
        "Hearing what someone says while planning your response",
        "Fully focusing on, understanding and responding to the speaker",
        "Agreeing with everything the speaker says",
        "Taking notes during a conversation"
      ],
      correctAnswer: 1,
      explanation: "Active listening involves giving your full attention to the speaker, understanding their message, and thoughtfully responding. It's about being fully present rather than just waiting for your turn to speak."
    },
    {
      id: 2,
      question: "Which of these is NOT generally considered effective body language during conversation?",
      options: [
        "Maintaining appropriate eye contact",
        "Crossing your arms tightly across your chest",
        "Nodding occasionally to show understanding",
        "Facing the person you're speaking with"
      ],
      correctAnswer: 1,
      explanation: "Crossing arms tightly across your chest often communicates defensiveness or closed-mindedness. Open body language that signals engagement and receptiveness is more effective for conversation."
    },
    {
      id: 3,
      question: "What is a conversation killer?",
      options: [
        "Asking open-ended questions",
        "Sharing a related personal experience",
        "Giving one-word responses that end the topic",
        "Paraphrasing what someone just said"
      ],
      correctAnswer: 2,
      explanation: "One-word answers that don't invite further discussion typically shut down conversation. Effective conversation involves building upon topics through questions, related experiences, and showing interest."
    },
    {
      id: 4,
      question: "What is 'paraphrasing' in the context of active listening?",
      options: [
        "Correcting someone's grammar during conversation",
        "Restating what the speaker said in your own words to confirm understanding",
        "Using more sophisticated vocabulary to sound intelligent",
        "Interrupting someone to finish their thought for them"
      ],
      correctAnswer: 1,
      explanation: "Paraphrasing is restating what someone has said in your own words to verify that you've understood them correctly. It demonstrates that you're actively engaged in the conversation and trying to comprehend their message."
    },
    {
      id: 5,
      question: "Which of the following is an example of an open-ended question?",
      options: [
        "Did you enjoy the movie?",
        "Was the meeting productive?",
        "What aspects of the project did you find most challenging?",
        "Are you going to attend the event?"
      ],
      correctAnswer: 2,
      explanation: "Open-ended questions can't be answered with a simple 'yes' or 'no' and invite more detailed responses. 'What aspects of the project did you find most challenging?' requires an explanation rather than a one-word answer."
    },
    {
      id: 6,
      question: "In conversation, what does 'proxemics' refer to?",
      options: [
        "The use of hand gestures while speaking",
        "Voice tone and pitch variations",
        "The physical distance between conversational partners",
        "The facial expressions used to convey meaning"
      ],
      correctAnswer: 2,
      explanation: "Proxemics refers to the study of spatial requirements and the effects of population density on behavior, communication, and social interaction. In conversation, it specifically relates to the physical distance between people."
    },
    {
      id: 7,
      question: "What percentage of communication is estimated to be nonverbal?",
      options: [
        "Around 10-20%",
        "Around 30-40%",
        "Around 60-93%",
        "100% - all communication includes nonverbal elements"
      ],
      correctAnswer: 2,
      explanation: "Research suggests that between 60-93% of communication is nonverbal, depending on the context. This includes body language, facial expressions, gestures, and vocal elements like tone and pace."
    },
    {
      id: 8,
      question: "What is 'mirroring' in conversation?",
      options: [
        "Mocking or imitating someone in a disrespectful way",
        "Subtly adopting similar postures or gestures as your conversation partner",
        "Always agreeing with whatever the other person says",
        "Ensuring you speak for exactly the same amount of time as the other person"
      ],
      correctAnswer: 1,
      explanation: "Mirroring is the unconscious or conscious subtly matching of another person's body language, vocal tone, or other behaviors. It naturally occurs when people are engaged and can help build rapport and connection."
    },
    {
      id: 9,
      question: "What should you do if you realize you've been talking for too long in a conversation?",
      options: [
        "Abruptly stop mid-sentence to show you recognize the issue",
        "Talk even faster to finish your point more quickly",
        "Continue as planned - if your story is interesting, people won't mind",
        "Wrap up your point briefly and then ask a question to engage the other person"
      ],
      correctAnswer: 3,
      explanation: "If you notice you've been dominating the conversation, the best approach is to briefly conclude your point and then shift focus to the other person with a question. This rebalances the conversation and shows respect for the other person's input."
    },
    {
      id: 10,
      question: "Which of these is an example of empathic communication?",
      options: [
        "\"That's nothing compared to what happened to me last year.\"",
        "\"You shouldn't feel that way about it.\"",
        "\"I can see why that situation would make you feel frustrated.\"",
        "\"Let me tell you what you should do about that.\""
      ],
      correctAnswer: 2,
      explanation: "Empathic communication acknowledges and validates the other person's feelings without judgment. Saying \"I can see why that situation would make you feel frustrated\" shows you're trying to understand their perspective and emotional experience."
    }
  ];

  // Resources
  const RESOURCES = [
    {
      title: "How to Win Friends and Influence People",
      url: "https://www.dalecarnegie.com/en/resources/how-to-win-friends-and-influence-people-pdf",
      description: "Dale Carnegie's classic book on human relations and communication"
    },
    {
      title: "TED Talk: 10 Ways to Have a Better Conversation",
      url: "https://www.ted.com/talks/celeste_headlee_10_ways_to_have_a_better_conversation",
      description: "Celeste Headlee's insights on effective conversation skills"
    },
    {
      title: "Nonviolent Communication: A Language of Life",
      url: "https://www.nonviolentcommunication.com/product/nvc/",
      description: "Marshall Rosenberg's guide to compassionate communication"
    },
    {
      title: "Toastmasters International",
      url: "https://www.toastmasters.org/",
      description: "Organization dedicated to improving public speaking and leadership skills"
    }
  ];

  // Course modules with content
  const COURSE_MODULES = [
    {
      id: 'foundations',
      title: 'Conversation Fundamentals',
      description: 'Understanding the basics of effective communication',
      icon: MessageCircle,
      content: (
        <div className="space-y-4">
          <p>
            Conversation is one of our most fundamental human skills—yet it's rarely taught explicitly. 
            Good conversation skills enhance our relationships, career prospects, and overall well-being. 
            This module explores the core elements that make up effective conversations.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">What Makes a Good Conversation?</h3>
          <p>
            Effective conversations typically include these key elements:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Balance:</strong> Both people share and listen in roughly equal measure</li>
            <li><strong>Engagement:</strong> Participants are genuinely interested and attentive</li>
            <li><strong>Connection:</strong> People feel understood and respected</li>
            <li><strong>Flow:</strong> Topics develop naturally without awkward interruptions</li>
            <li><strong>Purpose:</strong> The conversation serves a social, emotional, or practical function</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Conversation Types and Contexts</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Small Talk</h4>
              <p className="text-sm">Brief, relatively impersonal exchanges that establish rapport</p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Weather, sports, recent local events, general interests</p>
              <p className="text-sm mt-2"><strong>Function:</strong> Creates comfort, builds initial connection, identifies potential shared interests</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Social/Relationship Conversations</h4>
              <p className="text-sm">Exchanges focused on building and maintaining personal connections</p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Personal updates, shared experiences, feelings, plans</p>
              <p className="text-sm mt-2"><strong>Function:</strong> Strengthens bonds, provides emotional support, creates shared history</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Informational Conversations</h4>
              <p className="text-sm">Exchanges primarily to share or gather information</p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Directions, instructions, educational discussions</p>
              <p className="text-sm mt-2"><strong>Function:</strong> Transmits knowledge or data, clarifies understanding</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Problem-Solving Conversations</h4>
              <p className="text-sm">Discussions aimed at working through challenges or decisions</p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Work meetings, relationship conflicts, planning sessions</p>
              <p className="text-sm mt-2"><strong>Function:</strong> Identifies issues, generates options, reaches agreements</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Deep/Meaningful Conversations</h4>
              <p className="text-sm">Exchanges about significant topics that reveal values, beliefs, and deeper thoughts</p>
              <p className="text-sm mt-2"><strong>Examples:</strong> Life goals, philosophical perspectives, personal growth</p>
              <p className="text-sm mt-2"><strong>Function:</strong> Creates intimacy, promotes self-understanding, builds trust</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Barriers to Effective Conversation</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="font-medium">Environmental Barriers</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Noisy surroundings that make hearing difficult</li>
                <li>Physical distractions or interruptions</li>
                <li>Uncomfortable setting (temperature, seating, etc.)</li>
                <li>Time pressure or rushed atmosphere</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="font-medium">Internal Barriers</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Anxiety or self-consciousness</li>
                <li>Preoccupation with other matters</li>
                <li>Assumptions and prejudgments</li>
                <li>Poor listening habits</li>
                <li>Fear of judgment or rejection</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="font-medium">Interpersonal Barriers</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Different communication styles</li>
                <li>Cultural differences in conversational norms</li>
                <li>Power imbalances</li>
                <li>History of conflict or misunderstanding</li>
                <li>Competing conversation goals</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">The Conversation Process</h3>
          <p>
            Conversations typically follow a process with these phases:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">1. Opening</h4>
              <p className="text-sm mt-2">
                Establishing contact through greetings, small talk, or addressing the reason for the conversation
              </p>
              <p className="text-sm italic mt-2">
                "Hi Sarah, it's great to see you! How have you been since we last caught up?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">2. Exploration</h4>
              <p className="text-sm mt-2">
                Developing topics through questions, sharing, and building on each other's contributions
              </p>
              <p className="text-sm italic mt-2">
                "You mentioned you started a new project at work. What's that been like for you?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">3. Maintenance</h4>
              <p className="text-sm mt-2">
                Sustaining the conversation through active listening, appropriate responses, and topic transitions
              </p>
              <p className="text-sm italic mt-2">
                "That's fascinating how your team solved that challenge. It reminds me of something similar..."
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">4. Closing</h4>
              <p className="text-sm mt-2">
                Ending the conversation respectfully with summary, appreciation, or future plans
              </p>
              <p className="text-sm italic mt-2">
                "It's been great talking with you! Let's plan to continue this conversation over coffee next week."
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-md mt-6">
            <h4 className="font-medium text-orange-800">Key Insight</h4>
            <p className="text-orange-800">
              Conversation is a skill that can be developed with conscious practice. While some people 
              seem naturally gifted at conversing, everyone can improve their conversation abilities 
              through understanding the fundamental principles and deliberately applying them.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'listening',
      title: 'Active Listening',
      description: 'The art and practice of truly hearing what others say',
      icon: Ear,
      content: (
        <div className="space-y-4">
          <p>
            Listening is half of every conversation, yet it's often the neglected half. Active listening—fully 
            concentrating on what is being said rather than passively hearing—is perhaps the single most 
            important skill for effective conversation.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Difference Between Hearing and Listening</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-2">Hearing</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Passive physical process</li>
                <li>Simply perceiving sounds</li>
                <li>Happens automatically</li>
                <li>No interpretation required</li>
                <li>No focus or intention needed</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-md">
              <h4 className="font-medium text-center border-b pb-2 mb-2">Active Listening</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Active mental process</li>
                <li>Attaching meaning to sounds</li>
                <li>Requires conscious effort</li>
                <li>Involves interpretation</li>
                <li>Demands focus and intention</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Core Components of Active Listening</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Attention</h4>
              <p className="text-sm">Giving your complete focus to the speaker</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Minimize distractions (put away devices, find a quiet space)</li>
                <li>Maintain appropriate eye contact</li>
                <li>Use receptive body language that shows engagement</li>
                <li>Resist the urge to interrupt or finish sentences</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Comprehension</h4>
              <p className="text-sm">Working to truly understand the speaker's message</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Focus on the speaker's main points</li>
                <li>Notice both the content (what is said) and emotion (how it's said)</li>
                <li>Consider the context and the speaker's perspective</li>
                <li>Recognize non-verbal cues that add meaning</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Response</h4>
              <p className="text-sm">Providing feedback that demonstrates understanding</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Use encouraging verbal cues ("I see," "Go on," "Tell me more")</li>
                <li>Provide non-verbal feedback (nodding, facial expressions)</li>
                <li>Ask clarifying questions when needed</li>
                <li>Paraphrase to confirm understanding</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-medium">Retention</h4>
              <p className="text-sm">Remembering key information from the conversation</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Make mental connections to existing knowledge</li>
                <li>Identify the most important points to remember</li>
                <li>For complex discussions, take minimal notes if appropriate</li>
                <li>Review important information mentally after the conversation</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Active Listening Techniques</h3>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Paraphrasing</h4>
              <p className="text-sm mt-2">
                Restating what you've heard in your own words to verify understanding
              </p>
              <p className="text-sm italic mt-2">
                "So what I'm hearing is that you feel overwhelmed by the new responsibilities at work, especially with the tight deadlines. Is that right?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Reflecting Feelings</h4>
              <p className="text-sm mt-2">
                Acknowledging the emotions behind the speaker's words
              </p>
              <p className="text-sm italic mt-2">
                "It sounds like you're feeling frustrated about how the meeting went."
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Asking Open Questions</h4>
              <p className="text-sm mt-2">
                Using questions that encourage elaboration rather than yes/no responses
              </p>
              <p className="text-sm italic mt-2">
                Instead of "Did the presentation go well?" try "How did the presentation go?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Clarifying</h4>
              <p className="text-sm mt-2">
                Asking for more information to ensure understanding
              </p>
              <p className="text-sm italic mt-2">
                "Could you explain what you mean by 'the system isn't working'? Which aspects specifically are causing problems?"
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Summarizing</h4>
              <p className="text-sm mt-2">
                Pulling together the main points of a longer discussion
              </p>
              <p className="text-sm italic mt-2">
                "Let me make sure I understand the three main concerns you've raised: first, the timeline seems unrealistic; second, the budget doesn't account for potential material cost increases; and third, you're worried about team capacity. Is that accurate?"
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Common Listening Pitfalls</h3>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Rehearsing</h4>
              <p className="text-sm">Planning what you'll say next while the other person is speaking</p>
              <p className="text-sm mt-2"><strong>Alternative:</strong> Trust that you'll think of a response when needed and focus fully on understanding</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Filtering</h4>
              <p className="text-sm">Listening only for specific information while tuning out the rest</p>
              <p className="text-sm mt-2"><strong>Alternative:</strong> Stay open to the full message, even parts that seem less immediately relevant</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Judging</h4>
              <p className="text-sm">Evaluating the speaker or message before fully understanding</p>
              <p className="text-sm mt-2"><strong>Alternative:</strong> Temporarily suspend judgment to focus on comprehension first</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Advising</h4>
              <p className="text-sm">Jumping to provide solutions before being asked</p>
              <p className="text-sm mt-2"><strong>Alternative:</strong> Ask if the person wants advice or simply needs to be heard</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Mind Reading</h4>
              <p className="text-sm">Assuming you know what the speaker means without confirmation</p>
              <p className="text-sm mt-2"><strong>Alternative:</strong> Check your understanding with clarifying questions or paraphrasing</p>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-md mt-6">
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-yellow-800">
              Active listening takes practice and can be mentally taxing, especially at first. Start by 
              focusing on one aspect (like avoiding interruptions or practicing paraphrasing) in low-stakes 
              conversations. As these skills become more natural, you can incorporate additional techniques.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'verbal',
      title: 'Verbal Communication',
      description: 'Using words effectively to express yourself clearly',
      icon: Presentation,
      content: (
        <div className="space-y-4">
          <p>
            While listening is critical to good conversation, how you express yourself verbally is equally 
            important. Effective verbal communication ensures your message is understood as intended and 
            keeps conversations engaging.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Clarity and Conciseness</h3>
          <div className="space-y-2">
            <p>
              Clear communication helps prevent misunderstandings and makes conversations more efficient:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Organize your thoughts</strong> before speaking, especially for complex topics</li>
              <li><strong>Use simple, precise language</strong> appropriate to your audience</li>
              <li><strong>Avoid jargon, slang, or acronyms</strong> unless you're sure they're understood</li>
              <li><strong>Get to the point</strong> without unnecessary tangents</li>
              <li><strong>Check for understanding</strong> when discussing important matters</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h4 className="font-medium">Examples:</h4>
              <div className="mt-2">
                <p className="text-sm"><strong>Unclear:</strong> "I was thinking maybe we could possibly get together sometime soon to discuss that thing we talked about earlier."</p>
                <p className="text-sm mt-2"><strong>Clear:</strong> "Could we meet on Tuesday at 3pm to discuss the marketing plan?"</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Conversation Flow and Engagement</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Building on Topics</h4>
              <p className="text-sm">Keep conversations flowing by adding to what's been said</p>
              <div className="mt-2 text-sm">
                <p><strong>Basic response:</strong> "Yes, I've been to France."</p>
                <p><strong>Building response:</strong> "Yes, I spent two weeks in France last summer. The food in Provence was incredible. Have you visited the south?"</p>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Asking Thoughtful Questions</h4>
              <p className="text-sm">Use questions to show interest and learn more</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Open questions</strong> invite detailed responses: "What did you enjoy most about the film?"</li>
                <li><strong>Follow-up questions</strong> show you're listening: "You mentioned it reminded you of your hometown—how so?"</li>
                <li><strong>Reflective questions</strong> explore thoughts and feelings: "How did that experience change your perspective?"</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Transitioning Between Topics</h4>
              <p className="text-sm">Smoothly move conversations in new directions</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Find connections</strong> between topics: "Speaking of travel, I just read an interesting book about..."</li>
                <li><strong>Acknowledge the current topic</strong> before shifting: "That's fascinating about your job. By the way, I've been meaning to ask you about..."</li>
                <li><strong>Check interest</strong> when introducing new topics: "Would you be interested in hearing about..."</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium">Balancing Sharing and Asking</h4>
              <p className="text-sm">Create conversational give-and-take</p>
              <p className="text-sm mt-2">
                Aim for a roughly equal exchange where you share your thoughts, experiences, and questions while giving the other person similar opportunities to contribute. Watch for signs you might be dominating the conversation, like the other person checking the time or looking disengaged.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Voice and Delivery</h3>
          <p>
            How you say something can be as important as what you say:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Volume</h4>
              <p className="text-sm mt-2">
                Speak loudly enough to be heard without straining, but not so loudly that you overwhelm. 
                Adjust based on the environment and distance to your listener.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Pace</h4>
              <p className="text-sm mt-2">
                Speaking too quickly can make you hard to follow, while speaking too slowly can cause listeners to lose interest. 
                Vary your pace for emphasis—slow down for important points and to allow complex ideas to be processed.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Tone</h4>
              <p className="text-sm mt-2">
                Your voice tone conveys emotion and attitude. Be aware if you sound bored, condescending, aggressive, or uncertain 
                when that's not your intention. Match your tone to your message and the context of the conversation.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Articulation</h4>
              <p className="text-sm mt-2">
                Clear pronunciation makes you easier to understand, especially in noisy environments or when speaking with people 
                who aren't fluent in your language. Avoid mumbling or trailing off at the ends of sentences.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Language Choices for Positive Conversations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-red-600">Less Effective</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Absolutes:</strong> "You always interrupt me"</li>
                <li><strong>Accusatory you:</strong> "You made me feel bad"</li>
                <li><strong>Dismissive language:</strong> "That's ridiculous"</li>
                <li><strong>Generalizations:</strong> "Everyone thinks this way"</li>
                <li><strong>Conversation stoppers:</strong> "Whatever"</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-green-600">More Effective</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Specific observations:</strong> "I felt interrupted several times"</li>
                <li><strong>I-statements:</strong> "I felt hurt when that happened"</li>
                <li><strong>Curious language:</strong> "I see it differently"</li>
                <li><strong>Personal perspective:</strong> "In my experience..."</li>
                <li><strong>Engagement phrases:</strong> "Tell me more about that"</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md mt-6">
            <h4 className="font-medium text-green-800">Success Strategy</h4>
            <p className="text-green-800">
              Record yourself in casual conversation (with permission) and listen back to notice your verbal 
              patterns. Most people are surprised by certain habits—like filler words, interrupting, or leaving 
              thoughts unfinished—that they weren't aware of. Self-awareness is the first step to improvement.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'nonverbal',
      title: 'Nonverbal Communication',
      description: 'Understanding the messages sent without words',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p>
            Nonverbal communication—body language, facial expressions, gestures, and other wordless signals—plays 
            a crucial role in conversation. Research suggests that between 60-93% of communication is nonverbal, 
            depending on the context. Both sending and reading nonverbal cues effectively will significantly 
            enhance your conversation skills.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The Power of Nonverbal Cues</h3>
          <p>
            Nonverbal communication serves multiple important functions in conversation:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Reinforces verbal messages</strong> to strengthen your point</li>
            <li><strong>Conveys emotions</strong> that might be difficult to express in words</li>
            <li><strong>Establishes relationship dynamics</strong> like power, affection, or distance</li>
            <li><strong>Regulates conversational flow</strong> through turn-taking signals</li>
            <li><strong>Replaces words entirely</strong> in some cases (like a thumbs up)</li>
            <li><strong>Provides context</strong> for interpreting verbal messages</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Key Elements of Nonverbal Communication</h3>
          <div className="space-y-4 mt-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Facial Expressions</h4>
              <p className="text-sm">The most expressive way we communicate emotions</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Be aware</strong> of your expressions during conversations</li>
                <li><strong>Match your expression</strong> to your message and the conversation's tone</li>
                <li><strong>Notice micro-expressions</strong> (brief, involuntary expressions) in others</li>
                <li><strong>Remember cultural differences</strong> in expressive norms</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Eye Contact</h4>
              <p className="text-sm">Powerful way to signal attention, interest, and connection</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Maintain appropriate eye contact</strong> (not staring, not avoiding)</li>
                <li><strong>Cultural norms vary widely</strong> - adjust accordingly</li>
                <li><strong>General guideline:</strong> 60-70% eye contact while listening, slightly less while speaking</li>
                <li><strong>Break contact occasionally</strong> by looking thoughtfully away (not down at devices)</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Posture and Body Orientation</h4>
              <p className="text-sm">Signals interest, attentiveness, and attitude</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Leaning slightly forward</strong> shows engagement and interest</li>
                <li><strong>Face the person</strong> you're speaking with</li>
                <li><strong>Uncrossed arms</strong> suggests openness (though comfort is important too)</li>
                <li><strong>Stand or sit at an appropriate height</strong> to avoid power imbalance</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Gestures</h4>
              <p className="text-sm">Hand and body movements that enhance verbal communication</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Natural gestures</strong> add emphasis and clarity to your words</li>
                <li><strong>Be conscious of cultural differences</strong> in gesture meaning</li>
                <li><strong>Excessive gesturing</strong> can be distracting</li>
                <li><strong>Contradictory gestures</strong> (like nodding while saying no) confuse listeners</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Proxemics (Personal Space)</h4>
              <p className="text-sm">The distance between conversational partners</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Respect others' comfort zones</strong> (typically 1.5-4 feet for social conversation in Western cultures)</li>
                <li><strong>Cultural and individual preferences vary widely</strong></li>
                <li><strong>Notice if someone steps back</strong> and adjust accordingly</li>
                <li><strong>Consider context</strong> - appropriate distance changes in different situations</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Paralanguage</h4>
              <p className="text-sm">Vocal elements beyond the words themselves</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Tone</strong> (warmth, coldness, excitement)</li>
                <li><strong>Pitch</strong> (high, low, variations)</li>
                <li><strong>Volume</strong> (loud, soft, emphasis)</li>
                <li><strong>Pace</strong> (speed, pauses, rhythm)</li>
                <li><strong>Vocal fillers</strong> (um, uh, like, you know)</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">Touch</h4>
              <p className="text-sm">Physical contact during conversation</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Highly contextual and culturally variable</strong></li>
                <li><strong>Professional contexts</strong> typically limit touch to handshakes</li>
                <li><strong>Social contexts</strong> may include brief touches on arm/shoulder to emphasize points</li>
                <li><strong>Always prioritize respect</strong> and others' comfort levels</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Reading Nonverbal Cues</h3>
          <div className="space-y-2">
            <p>
              Being attuned to others' nonverbal communication helps you respond appropriately:
            </p>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h4 className="font-medium">Signs of Engagement</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Leaning forward</li>
                <li>Steady eye contact</li>
                <li>Nodding</li>
                <li>Mirroring your posture</li>
                <li>Relaxed, open posture</li>
                <li>Responsive facial expressions</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h4 className="font-medium">Signs of Discomfort or Disinterest</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Leaning away</li>
                <li>Crossed arms or legs</li>
                <li>Checking the time or phone repeatedly</li>
                <li>Minimal eye contact</li>
                <li>Tense posture</li>
                <li>Limited facial responsiveness</li>
                <li>Feet pointed away from you</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h4 className="font-medium">Context Is Key</h4>
              <p className="text-sm mt-2">
                Always consider nonverbal cues in clusters and context. Someone with crossed arms might be cold, not defensive. 
                Someone avoiding eye contact might come from a culture where direct eye contact is considered disrespectful. 
                Look for patterns rather than interpreting isolated behaviors.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Aligning Verbal and Nonverbal Messages</h3>
          <p>
            When your words and nonverbal cues contradict each other, people typically trust the nonverbal:
          </p>
          <div className="mt-4">
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <h4 className="font-medium">Misalignment Example</h4>
              <p className="text-sm mt-2">
                Saying "I'm really interested in your idea" while checking your phone, with a flat tone of voice and minimal eye contact.
              </p>
              <p className="text-sm italic mt-2">
                The listener will likely perceive disinterest despite your words.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium">Alignment Example</h4>
              <p className="text-sm mt-2">
                Saying "I'm really interested in your idea" while leaning forward, making eye contact, with an enthusiastic tone and responsive facial expressions.
              </p>
              <p className="text-sm italic mt-2">
                The listener perceives genuine interest, reinforced by consistent nonverbal cues.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md mt-6">
            <h4 className="font-medium text-purple-800">Wisdom Note</h4>
            <p className="text-purple-800">
              While it's important to be conscious of your nonverbal communication, excessive self-monitoring 
              can make you appear unnatural and interfere with authentic connection. Focus first on genuine 
              interest in the conversation and the other person. When you're truly engaged, many positive 
              nonverbal behaviors will follow naturally.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'advanced',
      title: 'Advanced Conversation Skills',
      description: 'Taking your interactions to the next level',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p>
            Once you've developed a solid foundation in listening, verbal, and nonverbal communication, you 
            can focus on more advanced skills that elevate your conversations from merely functional to truly 
            memorable and meaningful.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Empathic Communication</h3>
          <p>
            Empathy—the ability to understand and share the feelings of another—creates deeper connection:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Perspective Taking</h4>
              <p className="text-sm mt-2">
                Deliberately viewing the situation from the other person's position
              </p>
              <p className="text-sm mt-2">
                <strong>Try this:</strong> "Let me see if I can understand how this looks from your perspective..."
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Validation</h4>
              <p className="text-sm mt-2">
                Acknowledging the other person's feelings and experiences as legitimate
              </p>
              <p className="text-sm mt-2">
                <strong>Try this:</strong> "It makes sense that you'd feel frustrated by that situation."
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Emotional Resonance</h4>
              <p className="text-sm mt-2">
                Showing that you're emotionally affected by their experience
              </p>
              <p className="text-sm mt-2">
                <strong>Try this:</strong> "I can feel how important this is to you."
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium">Supporting Without Solving</h4>
              <p className="text-sm mt-2">
                Being present with someone's struggle without immediately trying to fix it
              </p>
              <p className="text-sm mt-2">
                <strong>Try this:</strong> "Would you like my advice, or would you prefer I just listen right now?"
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Conversational Versatility</h3>
          <p>
            Adapting your communication style to different situations and people:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Reading the Room</h4>
              <p className="text-sm mt-2">
                Assess the social context and adjust accordingly:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>What's the purpose of this gathering?</li>
                <li>What's the energy level of the group?</li>
                <li>What topics would be appropriate/inappropriate?</li>
                <li>What level of formality is expected?</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Adapting to Different Communication Styles</h4>
              <p className="text-sm mt-2">
                Recognize and adapt to various preferences:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Direct communicators</strong> value clarity and efficiency (match with concise, straightforward language)</li>
                <li><strong>Relational communicators</strong> value connection and context (match with personal touches and broader context)</li>
                <li><strong>Analytical communicators</strong> value precision and logic (match with structured, evidence-based discussion)</li>
                <li><strong>Expressive communicators</strong> value enthusiasm and creativity (match with animated engagement and big-picture thinking)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Conversational Gear-Shifting</h4>
              <p className="text-sm mt-2">
                Move smoothly between different types of conversation:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li><strong>Light social chat</strong> → <strong>Deeper personal discussion:</strong> "That reminds me of something I've been thinking about lately..."</li>
                <li><strong>Emotional topic</strong> → <strong>Lighter subject:</strong> "Thanks for sharing that with me. On a completely different note..."</li>
                <li><strong>Group conversation</strong> → <strong>One-on-one:</strong> "I'd love to hear more about your experience with that sometime."</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Navigating Difficult Conversations</h3>
          <div className="space-y-4 mt-4">
            <p>
              Some conversations are inherently challenging but can be managed skillfully:
            </p>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">Handling Disagreement</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Focus on understanding before being understood</li>
                <li>Separate the person from the position ("I disagree with this approach" vs. "You're wrong")</li>
                <li>Find points of agreement before addressing differences</li>
                <li>Be curious about their reasoning rather than dismissive</li>
                <li>Recognize when to respectfully "agree to disagree"</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">Giving Constructive Feedback</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Choose an appropriate time and private setting</li>
                <li>Focus on specific behaviors rather than character</li>
                <li>Balance concerns with genuine positive observations</li>
                <li>Frame feedback as your perspective, not absolute truth</li>
                <li>Suggest alternatives rather than just identifying problems</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">Responding to Emotional Disclosure</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Acknowledge the trust they've shown in sharing</li>
                <li>Validate their feelings without minimizing</li>
                <li>Ask how you can support them before offering solutions</li>
                <li>Maintain appropriate boundaries while showing empathy</li>
                <li>Follow up later to show continued care</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium">De-escalating Tension</h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Speak calmly and lower your volume if tensions rise</li>
                <li>Acknowledge emotions: "I can see this is frustrating"</li>
                <li>Find common ground: "We both want to resolve this"</li>
                <li>Suggest a brief pause if emotions are overwhelming</li>
                <li>Focus on the issue rather than making personal comments</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Conversation as Connection</h3>
          <p>
            Moving beyond functional exchange to create meaningful connection:
          </p>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Self-Disclosure</h4>
              <p className="text-sm mt-2">
                Sharing appropriate personal information builds trust and invites reciprocal sharing. Start with lower-risk disclosures and gradually increase depth based on the relationship and context.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Finding Shared Reality</h4>
              <p className="text-sm mt-2">
                Identifying common values, experiences, or perspectives creates connection. Look for moments of "me too" that strengthen bonds, even amidst differences.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Appreciative Attention</h4>
              <p className="text-sm mt-2">
                Noticing what's interesting or admirable about the other person and expressing genuine appreciation creates positive feeling. "I really value your perspective on this" or "I appreciate how thoughtfully you approach this."
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">Co-creating Moments</h4>
              <p className="text-sm mt-2">
                Building on each other's ideas, sharing humor, or solving problems together creates a sense of "us" rather than just parallel experiences. These collaborative moments are often remembered long after the content of the conversation is forgotten.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Continuous Improvement</h4>
            <p className="text-blue-800">
              Conversation is an art that continues to develop throughout life. Each interaction is an opportunity 
              to learn and grow. After important conversations, take a moment to reflect: What went well? What 
              might you try differently next time? How did the other person respond to different approaches? 
              This reflective practice accelerates your development as a skilled conversationalist.
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
          <MessageCircle className="h-6 w-6 mr-2 text-orange-500" />
          Conversation Skills
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
              <CardTitle>Introduction to Conversation Skills</CardTitle>
              <CardDescription>
                Master the art of engaging and meaningful conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The ability to converse effectively is one of life's most valuable skills. Good conversations 
                strengthen relationships, advance careers, solve problems, and enrich daily experiences. Yet many 
                of us have never been explicitly taught how to have great conversations.
              </p>
              <p className="mb-4">
                This course breaks down the elements of effective conversation—from fundamentals to advanced 
                techniques—to help you become a more confident, engaging, and thoughtful communicator in any 
                context, whether professional networking, social gatherings, or personal relationships.
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
              <CardTitle>Test Your Conversation Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about effective communication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Conversation Skills"
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
              <CardTitle>Conversation Skills Resources</CardTitle>
              <CardDescription>
                Books, videos, and resources to help you become a better communicator
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
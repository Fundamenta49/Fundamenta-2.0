import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { CheckCircle, PlayCircle, Award, ChefHat, BookOpen, Utensils, CircleCheck, Star, Clock, Video, ExternalLink, Info, Trophy, Brain, Diamond, X } from 'lucide-react';

// Define skill levels
enum SkillLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert'
}

// Define a kitchen skill category
interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  skills: Skill[];
}

// Define a skill
interface Skill {
  id: string;
  name: string;
  description: string;
  level: SkillLevel;
  completed: boolean;
  quiz: Quiz;
  practicalTask: string;
  tipAndTricks: string[];
  videoTimestamp?: string; // Optional timestamp in the main video
  image: string; // Image URL for the tool or technique
}

// Define a quiz for a skill
interface Quiz {
  questions: Question[];
}

// Define a question for a quiz
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

// User context to track progress
interface UserProgress {
  completedSkills: string[];
  earnedBadges: string[];
  skillLevels: Record<SkillLevel, number>;
  totalSkillsCompleted: number;
  quizResults: Record<string, boolean>;
}

const KitchenSkillsLearning: React.FC = () => {
  // Main training video ID from Joshua Weissman
  const mainVideoId = 'O5hW_65fTxs';
  
  // State for the selected skill and video dialog
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [videoDialog, setVideoDialog] = useState<{ open: boolean; videoId: string; title: string; }>({
    open: false,
    videoId: '',
    title: ''
  });
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // State for user progress
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSkills: [],
    earnedBadges: [],
    skillLevels: {
      [SkillLevel.Beginner]: 0,
      [SkillLevel.Intermediate]: 0,
      [SkillLevel.Expert]: 0
    },
    totalSkillsCompleted: 0,
    quizResults: {}
  });
  
  // State for quiz
  const [quizState, setQuizState] = useState<{
    active: boolean;
    currentQuestion: number;
    selectedAnswer: number | null;
    isAnswered: boolean;
    isCorrect: boolean;
    skillId: string;
  }>({
    active: false,
    currentQuestion: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: false,
    skillId: ''
  });

  // Define all kitchen skill categories
  const skillCategories: SkillCategory[] = [
    {
      id: 'knives',
      name: 'Knife Skills & Care',
      description: 'Master the essential tools in your kitchen - knives, cutting boards, and proper techniques.',
      icon: <Utensils className="h-5 w-5" />,
      skills: [
        {
          id: 'knife-grip',
          name: 'Proper Knife Grip',
          description: 'Learn how to safely and efficiently hold a chef\'s knife for maximum control and safety.',
          level: SkillLevel.Beginner,
          completed: false,
          videoTimestamp: '1:20',
          image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=500&auto=format&fit=crop',
          quiz: {
            questions: [
              {
                id: 'knife-grip-q1',
                text: 'What is the correct way to grip a chef\'s knife?',
                options: [
                  'With the index finger and thumb pinching the blade near the bolster',
                  'With all fingers wrapped tightly around the handle',
                  'With the index finger on top of the blade for control',
                  'With a loose grip on the end of the handle'
                ],
                correctAnswer: 0
              },
              {
                id: 'knife-grip-q2',
                text: 'Why is the "pinch grip" recommended for chef\'s knives?',
                options: [
                  'It looks more professional',
                  'It provides better control and precision',
                  'It\'s easier on your wrist',
                  'It allows for faster cutting'
                ],
                correctAnswer: 1
              },
              {
                id: 'knife-grip-q3',
                text: 'What part of the knife should your index finger and thumb pinch?',
                options: [
                  'The tip of the blade',
                  'The middle of the blade',
                  'Where the blade meets the handle (the bolster)',
                  'The handle only'
                ],
                correctAnswer: 2
              }
            ]
          },
          practicalTask: 'Practice the proper grip with your chef\'s knife. Take a photo of your grip and compare it with the demonstration in the video.',
          tipAndTricks: [
            'The "pinch grip" provides the most control',
            'Your guiding hand should form a "claw" with fingertips tucked under',
            'A properly gripped knife feels like an extension of your hand'
          ]
        },
        {
          id: 'knife-sharpening',
          name: 'Knife Sharpening',
          description: 'Learn different methods to keep your knives sharp and techniques for proper maintenance.',
          level: SkillLevel.Intermediate,
          completed: false,
          videoTimestamp: '3:45',
          image: 'https://images.unsplash.com/photo-1588967073625-13ad5b395709?q=80&w=500&auto=format&fit=crop',
          quiz: {
            questions: [
              {
                id: 'knife-sharp-q1',
                text: 'How often should home cooks sharpen their knives?',
                options: [
                  'Once a year',
                  'Every time before cooking',
                  'Every 3-6 months depending on use',
                  'Only when they no longer cut tomatoes easily'
                ],
                correctAnswer: 2
              },
              {
                id: 'knife-sharp-q2',
                text: 'What is the difference between honing and sharpening?',
                options: [
                  'They are different words for the same process',
                  'Honing straightens the edge while sharpening removes metal to create a new edge',
                  'Honing is for Japanese knives, sharpening is for Western knives',
                  'Honing creates a sharp edge, sharpening smooths the blade'
                ],
                correctAnswer: 1
              },
              {
                id: 'knife-sharp-q3',
                text: 'What angle should most Western chef\'s knives be sharpened at?',
                options: [
                  '10-15 degrees per side',
                  '20-22 degrees per side',
                  '30-35 degrees per side',
                  '45 degrees per side'
                ],
                correctAnswer: 1
              }
            ]
          },
          practicalTask: 'Practice honing your chef\'s knife with a honing rod, maintaining the correct angle. Test sharpness by carefully slicing paper.',
          tipAndTricks: [
            'Hone your knife regularly, but sharpen only when necessary',
            'A sharp knife is actually safer than a dull one',
            'Different knife types require different sharpening angles',
            'Japanese knives often use water stones for sharpening'
          ]
        },
        {
          id: 'cutting-techniques',
          image: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=500&auto=format&fit=crop',
          name: 'Advanced Cutting Techniques',
          description: 'Master julienne, brunoise, chiffonade and other precise cutting methods.',
          level: SkillLevel.Expert,
          completed: false,
          videoTimestamp: '5:30',
          quiz: {
            questions: [
              {
                id: 'cut-tech-q1',
                text: 'What is the technique called when you finely slice herbs or leafy greens into thin ribbons?',
                options: [
                  'Julienne',
                  'Brunoise',
                  'Chiffonade',
                  'Batonnet'
                ],
                correctAnswer: 2
              },
              {
                id: 'cut-tech-q2',
                text: 'What are the approximate dimensions of a brunoise cut?',
                options: [
                  '1/8 inch (3mm) cubes',
                  '1/4 inch (6mm) cubes',
                  '1/2 inch (12mm) cubes',
                  '1 inch (25mm) cubes'
                ],
                correctAnswer: 0
              },
              {
                id: 'cut-tech-q3',
                text: 'Which cutting technique would be most appropriate for creating thin strips of carrot for a stir-fry?',
                options: [
                  'Dice',
                  'Julienne',
                  'Brunoise',
                  'Mince'
                ],
                correctAnswer: 1
              }
            ]
          },
          practicalTask: 'Practice julienne cuts on a carrot, brunoise cuts on an onion, and chiffonade on basil leaves. Take photos of each result.',
          tipAndTricks: [
            'Julienne cuts should be consistent in size for even cooking',
            'For chiffonade, stack and roll leaves before slicing',
            'A sharp knife is essential for precision cuts',
            'Practice makes perfect - don\'t expect to master these techniques immediately'
          ]
        }
      ]
    },
    {
      id: 'prep-tools',
      name: 'Preparation Tools',
      description: 'Master common prep tools like graters, peelers, zesters, and measuring tools.',
      icon: <ChefHat className="h-5 w-5" />,
      skills: [
        {
          id: 'measuring-basics',
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=500&auto=format&fit=crop',
          name: 'Measuring Ingredients',
          description: 'Learn the difference between volume and weight measurements and when to use each.',
          level: SkillLevel.Beginner,
          completed: false,
          videoTimestamp: '8:15',
          quiz: {
            questions: [
              {
                id: 'measure-q1',
                text: 'Which is more accurate for measuring flour?',
                options: [
                  'Measuring with a dry measuring cup',
                  'Measuring with a liquid measuring cup',
                  'Measuring by weight on a scale',
                  'They are all equally accurate'
                ],
                correctAnswer: 2
              },
              {
                id: 'measure-q2',
                text: 'What is the correct way to measure dry ingredients in a measuring cup?',
                options: [
                  'Scoop directly with the measuring cup and level off',
                  'Spoon into the measuring cup and level off',
                  'Pour until it looks right',
                  'Pack it down firmly and level off'
                ],
                correctAnswer: 1
              },
              {
                id: 'measure-q3',
                text: 'For liquid measurements, where should the liquid level be read?',
                options: [
                  'From above, looking down',
                  'At eye level with the measurement line',
                  'From below, looking up',
                  'It doesn\'t matter as long as it\'s close'
                ],
                correctAnswer: 1
              }
            ]
          },
          practicalTask: 'Practice measuring 1 cup of flour both by volume (spooning into cup) and by weight. Note the difference.',
          tipAndTricks: [
            'Use measuring cups for liquids and measuring spoons/cups for dry ingredients',
            'Weight measurements (grams/ounces) are always more precise',
            'For baking, precision matters more than in most cooking',
            'Eye-level reading of liquid measures ensures accuracy'
          ]
        },
        {
          id: 'grater-techniques',
          image: 'https://images.unsplash.com/photo-1615228939096-9c99e81b55bd?q=80&w=500&auto=format&fit=crop',
          name: 'Grater & Microplane Techniques',
          description: 'Learn how to efficiently use different sides of a box grater and microplane tools.',
          level: SkillLevel.Intermediate,
          completed: false,
          videoTimestamp: '10:30',
          quiz: {
            questions: [
              {
                id: 'grater-q1',
                text: 'Which side of a box grater would be best for shredding cheese for pizza?',
                options: [
                  'The smallest holes',
                  'The medium-sized holes',
                  'The largest holes',
                  'The slicing side'
                ],
                correctAnswer: 2
              },
              {
                id: 'grater-q2',
                text: 'What is a microplane best used for?',
                options: [
                  'Shredding large amounts of cheese',
                  'Grating nutmeg, citrus zest, garlic, or hard cheese',
                  'Slicing vegetables',
                  'Crushing ice'
                ],
                correctAnswer: 1
              },
              {
                id: 'grater-q3',
                text: 'What is the safest way to hold food when using a box grater?',
                options: [
                  'With your bare hands, applying firm pressure',
                  'With a fork to hold the food in place',
                  'Using the palm of your hand',
                  'Using a food holder or the end piece of the food'
                ],
                correctAnswer: 3
              }
            ]
          },
          practicalTask: 'Practice using different sides of a box grater with a cheese block and a microplane with a lemon and garlic clove.',
          tipAndTricks: [
            'Always grate away from your hand and fingers',
            'Keep fingers away from the grating surface',
            'Use the end of the food item or a food holder',
            'Microplanes are excellent for zesting citrus without the bitter pith'
          ]
        },
        {
          id: 'specialty-tools',
          image: 'https://images.unsplash.com/photo-1565192259022-0427b058f372?q=80&w=500&auto=format&fit=crop',
          name: 'Specialty Tool Mastery',
          description: 'Learn to use kitchen gadgets like mandolines, garlic presses, and zesters safely and effectively.',
          level: SkillLevel.Expert,
          completed: false,
          videoTimestamp: '12:45',
          quiz: {
            questions: [
              {
                id: 'special-q1',
                text: 'Why is a mandoline considered potentially dangerous?',
                options: [
                  'It\'s electric and can short-circuit',
                  'It contains extremely sharp blades exposed during use',
                  'It can become very hot during operation',
                  'It\'s too expensive to replace if broken'
                ],
                correctAnswer: 1
              },
              {
                id: 'special-q2',
                text: 'What safety accessory should always be used with a mandoline?',
                options: [
                  'Oven mitts',
                  'Safety goggles',
                  'Hand guard or cut-resistant glove',
                  'Apron'
                ],
                correctAnswer: 2
              },
              {
                id: 'special-q3',
                text: 'What is the advantage of a citrus zester over a microplane?',
                options: [
                  'It creates longer strips of zest',
                  'It\'s safer to use',
                  'It extracts more flavor',
                  'It\'s faster'
                ],
                correctAnswer: 0
              }
            ]
          },
          practicalTask: 'If you have a mandoline, practice slicing cucumber with the hand guard. If not, practice with a specialized zester or garlic press.',
          tipAndTricks: [
            'NEVER use a mandoline without the hand guard or cut-resistant gloves',
            'Specialty tools should save time or improve results - otherwise they\'re just clutter',
            'Clean specialty tools immediately after use for longevity',
            'Store sharp tools with blade guards when possible'
          ]
        }
      ]
    },
    {
      id: 'cookware',
      name: 'Cookware Mastery',
      description: 'Learn proper usage techniques for pots, pans, and bakeware to elevate your cooking.',
      icon: <ChefHat className="h-5 w-5" />,
      skills: [
        {
          id: 'pan-selection',
          image: 'https://images.unsplash.com/photo-1575318634028-6a0cfcb60c1f?q=80&w=500&auto=format&fit=crop',
          name: 'Choosing the Right Pan',
          description: 'Learn which pans to use for different cooking methods and why materials matter.',
          level: SkillLevel.Beginner,
          completed: false,
          videoTimestamp: '15:00',
          quiz: {
            questions: [
              {
                id: 'pan-q1',
                text: 'Which type of pan is best for searing meat?',
                options: [
                  'Non-stick aluminum',
                  'Cast iron or carbon steel',
                  'Enameled dutch oven',
                  'Copper pan'
                ],
                correctAnswer: 1
              },
              {
                id: 'pan-q2',
                text: 'Why is a non-stick pan NOT ideal for high-heat cooking?',
                options: [
                  'It won\'t get hot enough',
                  'Food won\'t brown properly',
                  'The non-stick coating can break down and release chemicals',
                  'It\'s too expensive to risk damaging'
                ],
                correctAnswer: 2
              },
              {
                id: 'pan-q3',
                text: 'What is the advantage of a heavy-bottomed saucepan?',
                options: [
                  'It\'s less expensive',
                  'It heats up faster',
                  'It distributes heat more evenly and prevents burning',
                  'It\'s easier to clean'
                ],
                correctAnswer: 2
              }
            ]
          },
          practicalTask: 'Identify 3 different types of pans in your kitchen and list what each is best used for.',
          tipAndTricks: [
            'Match your pan to your cooking method',
            'Non-stick is great for eggs and delicate foods',
            'Stainless steel is versatile but requires more fat to prevent sticking',
            'Cast iron retains heat well for searing and can go from stovetop to oven'
          ]
        },
        {
          id: 'pan-techniques',
          image: 'https://images.unsplash.com/photo-1620146344904-097a0002d797?q=80&w=500&auto=format&fit=crop',
          name: 'Pan Techniques',
          description: 'Master techniques like sautéing, frying, deglazing, and making pan sauces.',
          level: SkillLevel.Intermediate,
          completed: false,
          videoTimestamp: '17:30',
          quiz: {
            questions: [
              {
                id: 'pantech-q1',
                text: 'What is "deglazing" a pan?',
                options: [
                  'Cleaning it thoroughly after use',
                  'Adding liquid to dissolve flavorful browned bits stuck to the pan',
                  'Removing excess fat before continuing cooking',
                  'Preheating it before adding ingredients'
                ],
                correctAnswer: 1
              },
              {
                id: 'pantech-q2',
                text: 'What causes food to stick to stainless steel pans?',
                options: [
                  'The pan wasn\'t cleaned properly',
                  'The food was added before the pan was hot enough',
                  'Using too much oil',
                  'Cooking at too low a temperature'
                ],
                correctAnswer: 1
              },
              {
                id: 'pantech-q3',
                text: 'What\'s the difference between sautéing and stir-frying?',
                options: [
                  'There is no difference',
                  'Stir-frying uses more oil',
                  'Sautéing is for vegetables only',
                  'Stir-frying uses higher heat and constant movement'
                ],
                correctAnswer: 3
              }
            ]
          },
          practicalTask: 'Practice sautéing vegetables, then deglaze the pan with broth or wine to make a simple pan sauce.',
          tipAndTricks: [
            'Preheat pans properly before adding food to prevent sticking',
            'Listen and watch for visual cues - the sizzle and browning tell you a lot',
            'Don\'t overcrowd the pan when sautéing or food will steam instead',
            'Save those browned bits (fond) by deglazing - they\'re pure flavor'
          ]
        },
        {
          id: 'dutch-oven',
          image: 'https://images.unsplash.com/photo-1621330690567-1bb1eaa0ddc5?q=80&w=500&auto=format&fit=crop',
          name: 'Dutch Oven Mastery',
          description: 'Learn techniques for braising, stewing, bread baking, and one-pot meals in a Dutch oven.',
          level: SkillLevel.Expert,
          completed: false,
          videoTimestamp: '20:00',
          quiz: {
            questions: [
              {
                id: 'dutch-q1',
                text: 'What makes a Dutch oven ideal for braising?',
                options: [
                  'Its non-stick interior',
                  'Its weight and heat retention with tight-fitting lid',
                  'Its ability to go in the dishwasher afterward',
                  'Its lightweight design for easy handling'
                ],
                correctAnswer: 1
              },
              {
                id: 'dutch-q2',
                text: 'Why is preheating the Dutch oven important for bread baking?',
                options: [
                  'It prevents the bread from rising too much',
                  'It creates steam inside the Dutch oven',
                  'It creates a hot surface that gives the bread an initial rise and crisp crust',
                  'It reduces overall baking time'
                ],
                correctAnswer: 2
              },
              {
                id: 'dutch-q3',
                text: 'When braising meat in a Dutch oven, why should you sear the meat first?',
                options: [
                  'To kill bacteria on the surface',
                  'To seal in the juices',
                  'To develop flavor through Maillard reaction',
                  'To reduce cooking time'
                ],
                correctAnswer: 2
              }
            ]
          },
          practicalTask: 'Use a Dutch oven to braise a tough cut of meat or bake a simple no-knead bread.',
          tipAndTricks: [
            'Dutch ovens excel at low-and-slow cooking methods',
            'The heavy lid traps moisture, creating a perfect environment for braising',
            'Enameled Dutch ovens can handle acidic ingredients like tomatoes',
            'Preheat empty Dutch ovens gradually to prevent thermal shock'
          ]
        }
      ]
    }
  ];

  // Calculate total skills
  const totalSkills = skillCategories.reduce((total, category) => {
    return total + category.skills.length;
  }, 0);

  // Calculate completion percentage
  const completionPercentage = (userProgress.totalSkillsCompleted / totalSkills) * 100;
  
  // Function to find a skill by ID
  const findSkillById = (skillId: string): Skill | null => {
    for (const category of skillCategories) {
      const skill = category.skills.find(s => s.id === skillId);
      if (skill) return skill;
    }
    return null;
  };
  
  // Open a skill
  const openSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setQuizState({
      active: false,
      currentQuestion: 0,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: false,
      skillId: skill.id
    });
  };
  
  // Start quiz for current skill
  const startQuiz = () => {
    if (!selectedSkill) return;
    
    setQuizState({
      ...quizState,
      active: true,
      currentQuestion: 0,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: false,
      skillId: selectedSkill.id
    });
  };
  
  // Select an answer in the quiz
  const selectAnswer = (answerIndex: number) => {
    if (!selectedSkill) return;
    
    const currentQuestion = selectedSkill.quiz.questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setQuizState({
      ...quizState,
      selectedAnswer: answerIndex,
      isAnswered: true,
      isCorrect
    });
  };
  
  // Go to next question or finish quiz
  const nextQuestion = () => {
    if (!selectedSkill) return;
    
    if (quizState.currentQuestion < selectedSkill.quiz.questions.length - 1) {
      // Go to next question
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: false
      });
    } else {
      // Quiz finished - update progress
      const updatedProgress = { ...userProgress };
      updatedProgress.quizResults[selectedSkill.id] = true;
      
      // Check if all requirements are complete to mark skill as completed
      if (!updatedProgress.completedSkills.includes(selectedSkill.id)) {
        updatedProgress.completedSkills.push(selectedSkill.id);
        updatedProgress.totalSkillsCompleted++;
        updatedProgress.skillLevels[selectedSkill.level]++;
        
        // Check if new badge earned
        checkForNewBadges(updatedProgress);
      }
      
      setUserProgress(updatedProgress);
      
      // Reset quiz state
      setQuizState({
        ...quizState,
        active: false
      });
    }
  };
  
  // Check for newly earned badges
  const checkForNewBadges = (progress: UserProgress) => {
    // Beginner badge - complete 3 beginner skills
    if (progress.skillLevels[SkillLevel.Beginner] >= 3 && 
        !progress.earnedBadges.includes('beginner-mastery')) {
      progress.earnedBadges.push('beginner-mastery');
    }
    
    // Intermediate badge - complete 3 intermediate skills
    if (progress.skillLevels[SkillLevel.Intermediate] >= 3 && 
        !progress.earnedBadges.includes('intermediate-mastery')) {
      progress.earnedBadges.push('intermediate-mastery');
    }
    
    // Expert badge - complete 2 expert skills
    if (progress.skillLevels[SkillLevel.Expert] >= 2 && 
        !progress.earnedBadges.includes('expert-mastery')) {
      progress.earnedBadges.push('expert-mastery');
    }
    
    // Kitchen Master badge - complete at least 7 total skills
    if (progress.totalSkillsCompleted >= 7 && 
        !progress.earnedBadges.includes('kitchen-master')) {
      progress.earnedBadges.push('kitchen-master');
    }
  };
  
  // Play the main video
  const playMainVideo = () => {
    setVideoDialog({
      open: true,
      videoId: mainVideoId,
      title: "Essential Kitchen Tools & Techniques"
    });
  };
  
  // Watch specific skill section in the video
  const watchSkillSection = (skill: Skill) => {
    if (!skill.videoTimestamp) return;
    
    // Format videoId with timestamp for autoplay at specific time
    // Example: O5hW_65fTxs&t=90s (1:30)
    const startTimeInSeconds = convertTimestampToSeconds(skill.videoTimestamp);
    
    setVideoDialog({
      open: true,
      videoId: `${mainVideoId}?start=${startTimeInSeconds}`,
      title: `${skill.name} - Demonstration`
    });
  };
  
  // Convert timestamp (like "1:30") to seconds
  const convertTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return (minutes * 60) + seconds;
    }
    return 0;
  };
  
  // Get badge label based on ID
  const getBadgeLabel = (badgeId: string): string => {
    switch (badgeId) {
      case 'beginner-mastery':
        return 'Kitchen Apprentice';
      case 'intermediate-mastery':
        return 'Sous Chef';
      case 'expert-mastery':
        return 'Master Chef';
      case 'kitchen-master':
        return 'Kitchen Virtuoso';
      default:
        return 'Unknown Badge';
    }
  };
  
  // Get badge icon based on ID
  const getBadgeIcon = (badgeId: string): React.ReactNode => {
    switch (badgeId) {
      case 'beginner-mastery':
        return <Award className="h-5 w-5 text-blue-500" />;
      case 'intermediate-mastery':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'expert-mastery':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'kitchen-master':
        return <Diamond className="h-5 w-5 text-pink-500" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };
  
  // Get level badge color
  const getLevelBadgeColor = (level: SkillLevel): string => {
    switch (level) {
      case SkillLevel.Beginner:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case SkillLevel.Intermediate:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case SkillLevel.Expert:
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Get readable level name
  const getLevelName = (level: SkillLevel): string => {
    switch (level) {
      case SkillLevel.Beginner:
        return 'Beginner';
      case SkillLevel.Intermediate:
        return 'Intermediate';
      case SkillLevel.Expert:
        return 'Expert';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-orange-800">Kitchen Skills Academy</CardTitle>
              <CardDescription className="text-orange-700 mt-1">
                Master essential kitchen tools and techniques with our comprehensive training program
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-700 mb-1">Your Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={completionPercentage} className="h-2 w-24" />
                <span className="text-sm font-medium text-orange-800">{Math.round(completionPercentage)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border bg-white">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                    <Button 
                      onClick={playMainVideo} 
                      variant="outline" 
                      className="gap-2 bg-white/90 backdrop-blur hover:bg-white/100"
                    >
                      <PlayCircle className="h-5 w-5" />
                      <span>Watch Master Video</span>
                    </Button>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" 
                    alt="Kitchen tools and utensils" 
                    className="object-cover w-full h-full" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Essential Kitchen Tools & Techniques</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    A comprehensive guide to the most important kitchen tools and how to use them properly.
                    This video covers knife skills, measuring techniques, cookware usage, and much more.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>20 minutes</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      <span>Full Tutorial</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skillCategories.map(category => (
                  <Card key={category.id} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.skills.map(skill => (
                          <div 
                            key={skill.id} 
                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                            onClick={() => openSkill(skill)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="relative flex-shrink-0">
                                {userProgress.completedSkills.includes(skill.id) ? (
                                  <div className="absolute -top-1 -right-1 z-10">
                                    <CheckCircle className="h-4 w-4 text-green-500 drop-shadow-sm" />
                                  </div>
                                ) : null}
                                <div className="h-10 w-10 rounded-md overflow-hidden border border-gray-200">
                                  <img 
                                    src={skill.image} 
                                    alt={skill.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                              <span className="text-sm font-medium">{skill.name}</span>
                            </div>
                            <Badge className={getLevelBadgeColor(skill.level)}>
                              {getLevelName(skill.level)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full text-sm" 
                        onClick={() => setActiveTab('skills')}
                      >
                        View All Skills
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Kitchen Skills</h2>
                <Input 
                  placeholder="Search skills..." 
                  className="max-w-xs" 
                />
              </div>
              
              <Accordion type="multiple" className="w-full">
                {skillCategories.map(category => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        {category.skills.map(skill => (
                          <div key={skill.id} className="relative">
                            <Card 
                              className={`cursor-pointer transition-all hover:shadow-md ${userProgress.completedSkills.includes(skill.id) ? 'border-green-200 bg-green-50' : ''}`}
                              onClick={() => openSkill(skill)}
                            >
                              {userProgress.completedSkills.includes(skill.id) && (
                                <div className="absolute top-3 right-3 z-10">
                                  <CheckCircle className="h-5 w-5 text-green-500 drop-shadow-md" />
                                </div>
                              )}
                              <div className="relative h-28 overflow-hidden rounded-t-md">
                                <img 
                                  src={skill.image} 
                                  alt={skill.name} 
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-3">
                                  <Badge className={`${getLevelBadgeColor(skill.level)} shadow-sm`}>
                                    {getLevelName(skill.level)}
                                  </Badge>
                                </div>
                                {skill.videoTimestamp && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="absolute top-2 right-2 h-8 w-8 p-1 rounded-full bg-white/80 text-black hover:bg-white shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      watchSkillSection(skill);
                                    }}
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <CardHeader className="pb-2 pt-3">
                                <CardTitle className="text-base">{skill.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {skill.description}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Progress</CardTitle>
                  <CardDescription>Track your kitchen skills journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Overall Completion</h3>
                      <div className="flex items-center gap-4">
                        <Progress value={completionPercentage} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-10">{Math.round(completionPercentage)}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-blue-800 font-medium mb-1">Beginner Skills</h3>
                        <div className="text-2xl font-bold text-blue-900">
                          {userProgress.skillLevels[SkillLevel.Beginner]} 
                          <span className="text-sm font-normal text-blue-700 ml-1">completed</span>
                        </div>
                        <Progress 
                          value={(userProgress.skillLevels[SkillLevel.Beginner] / skillCategories.reduce((count, cat) => count + cat.skills.filter(s => s.level === SkillLevel.Beginner).length, 0)) * 100} 
                          className="h-1.5 mt-2"
                        />
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-purple-800 font-medium mb-1">Intermediate Skills</h3>
                        <div className="text-2xl font-bold text-purple-900">
                          {userProgress.skillLevels[SkillLevel.Intermediate]} 
                          <span className="text-sm font-normal text-purple-700 ml-1">completed</span>
                        </div>
                        <Progress 
                          value={(userProgress.skillLevels[SkillLevel.Intermediate] / skillCategories.reduce((count, cat) => count + cat.skills.filter(s => s.level === SkillLevel.Intermediate).length, 0)) * 100} 
                          className="h-1.5 mt-2"
                        />
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h3 className="text-amber-800 font-medium mb-1">Expert Skills</h3>
                        <div className="text-2xl font-bold text-amber-900">
                          {userProgress.skillLevels[SkillLevel.Expert]} 
                          <span className="text-sm font-normal text-amber-700 ml-1">completed</span>
                        </div>
                        <Progress 
                          value={(userProgress.skillLevels[SkillLevel.Expert] / skillCategories.reduce((count, cat) => count + cat.skills.filter(s => s.level === SkillLevel.Expert).length, 0)) * 100} 
                          className="h-1.5 mt-2"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium text-sm mb-3">Recent Completions</h3>
                      {userProgress.completedSkills.length > 0 ? (
                        <div className="space-y-2">
                          {userProgress.completedSkills.slice(0, 5).map(skillId => {
                            const skill = findSkillById(skillId);
                            return skill ? (
                              <div key={skillId} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md">
                                <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={skill.image} 
                                    alt={skill.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{skill.name}</span>
                                <div className="flex-1 flex justify-end">
                                  <Badge className={getLevelBadgeColor(skill.level)}>
                                    {getLevelName(skill.level)}
                                  </Badge>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Brain className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>You haven't completed any skills yet.</p>
                          <p className="text-sm">Start learning to track your progress!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Badges</CardTitle>
                  <CardDescription>Earn badges as you master kitchen skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Kitchen Apprentice Badge */}
                    <Card className={`border-2 ${userProgress.earnedBadges.includes('beginner-mastery') ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                      <CardHeader className="p-4 text-center">
                        <div className={`mx-auto rounded-full p-3 ${userProgress.earnedBadges.includes('beginner-mastery') ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <Award className={`h-8 w-8 ${userProgress.earnedBadges.includes('beginner-mastery') ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                        <CardTitle className="text-base mt-2">Kitchen Apprentice</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-center">
                        <p className="text-xs text-gray-600">Complete 3 beginner skills</p>
                        <Progress 
                          value={(Math.min(userProgress.skillLevels[SkillLevel.Beginner], 3) / 3) * 100} 
                          className="h-1.5 mt-3"
                        />
                        <p className="text-xs font-medium mt-2">
                          {Math.min(userProgress.skillLevels[SkillLevel.Beginner], 3)}/3 complete
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Sous Chef Badge */}
                    <Card className={`border-2 ${userProgress.earnedBadges.includes('intermediate-mastery') ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                      <CardHeader className="p-4 text-center">
                        <div className={`mx-auto rounded-full p-3 ${userProgress.earnedBadges.includes('intermediate-mastery') ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <Star className={`h-8 w-8 ${userProgress.earnedBadges.includes('intermediate-mastery') ? 'text-purple-600' : 'text-gray-400'}`} />
                        </div>
                        <CardTitle className="text-base mt-2">Sous Chef</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-center">
                        <p className="text-xs text-gray-600">Complete 3 intermediate skills</p>
                        <Progress 
                          value={(Math.min(userProgress.skillLevels[SkillLevel.Intermediate], 3) / 3) * 100} 
                          className="h-1.5 mt-3"
                        />
                        <p className="text-xs font-medium mt-2">
                          {Math.min(userProgress.skillLevels[SkillLevel.Intermediate], 3)}/3 complete
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Master Chef Badge */}
                    <Card className={`border-2 ${userProgress.earnedBadges.includes('expert-mastery') ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                      <CardHeader className="p-4 text-center">
                        <div className={`mx-auto rounded-full p-3 ${userProgress.earnedBadges.includes('expert-mastery') ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                          <Trophy className={`h-8 w-8 ${userProgress.earnedBadges.includes('expert-mastery') ? 'text-yellow-600' : 'text-gray-400'}`} />
                        </div>
                        <CardTitle className="text-base mt-2">Master Chef</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-center">
                        <p className="text-xs text-gray-600">Complete 2 expert skills</p>
                        <Progress 
                          value={(Math.min(userProgress.skillLevels[SkillLevel.Expert], 2) / 2) * 100} 
                          className="h-1.5 mt-3"
                        />
                        <p className="text-xs font-medium mt-2">
                          {Math.min(userProgress.skillLevels[SkillLevel.Expert], 2)}/2 complete
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Kitchen Virtuoso Badge */}
                    <Card className={`border-2 ${userProgress.earnedBadges.includes('kitchen-master') ? 'border-pink-400 bg-pink-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                      <CardHeader className="p-4 text-center">
                        <div className={`mx-auto rounded-full p-3 ${userProgress.earnedBadges.includes('kitchen-master') ? 'bg-pink-100' : 'bg-gray-100'}`}>
                          <Diamond className={`h-8 w-8 ${userProgress.earnedBadges.includes('kitchen-master') ? 'text-pink-600' : 'text-gray-400'}`} />
                        </div>
                        <CardTitle className="text-base mt-2">Kitchen Virtuoso</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-center">
                        <p className="text-xs text-gray-600">Complete 7 skills total</p>
                        <Progress 
                          value={(Math.min(userProgress.totalSkillsCompleted, 7) / 7) * 100} 
                          className="h-1.5 mt-3"
                        />
                        <p className="text-xs font-medium mt-2">
                          {Math.min(userProgress.totalSkillsCompleted, 7)}/7 complete
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {userProgress.earnedBadges.length > 0 ? (
                    <div className="mt-8">
                      <h3 className="font-medium text-sm mb-3">Your Earned Badges</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {userProgress.earnedBadges.map(badgeId => (
                          <div 
                            key={badgeId} 
                            className="flex items-center gap-2 bg-white p-2 rounded-lg border"
                          >
                            {getBadgeIcon(badgeId)}
                            <span className="text-sm font-medium">{getBadgeLabel(badgeId)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 mt-4 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>You haven't earned any badges yet.</p>
                      <p className="text-sm">Complete skills to earn recognition!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Skill Dialog */}
      <Dialog open={selectedSkill !== null} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        {selectedSkill && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{selectedSkill.name}</DialogTitle>
                  <DialogDescription>{selectedSkill.description}</DialogDescription>
                </div>
                <Badge className={getLevelBadgeColor(selectedSkill.level)}>
                  {getLevelName(selectedSkill.level)}
                </Badge>
              </div>
            </DialogHeader>
            
            {quizState.active ? (
              // Quiz View
              <div className="space-y-8 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Question {quizState.currentQuestion + 1} of {selectedSkill.quiz.questions.length}
                  </span>
                  <Progress 
                    value={((quizState.currentQuestion + 1) / selectedSkill.quiz.questions.length) * 100} 
                    className="w-24 h-2"
                  />
                </div>
                
                <div className="space-y-4">
                  {/* Display the tool image in the quiz */}
                  <div className="aspect-video max-h-48 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedSkill.image} 
                      alt={selectedSkill.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-medium">
                    {selectedSkill.quiz.questions[quizState.currentQuestion].text}
                  </h3>
                  
                  <div className="space-y-2">
                    {selectedSkill.quiz.questions[quizState.currentQuestion].options.map((option, i) => (
                      <div 
                        key={i}
                        className={`
                          p-3 rounded-md border cursor-pointer transition-colors
                          ${quizState.isAnswered 
                            ? i === selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer
                              ? 'bg-green-50 border-green-200'
                              : i === quizState.selectedAnswer && i !== selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer
                                ? 'bg-red-50 border-red-200'
                                : 'bg-white border-gray-200'
                            : quizState.selectedAnswer === i
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }
                        `}
                        onClick={() => !quizState.isAnswered && selectAnswer(i)}
                      >
                        <div className="flex items-center">
                          <div className={`
                            flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3
                            ${quizState.isAnswered
                              ? i === selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer
                                ? 'bg-green-500 border-green-500 text-white'
                                : i === quizState.selectedAnswer && i !== selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer
                                  ? 'bg-red-500 border-red-500 text-white'
                                  : 'border-gray-300'
                              : quizState.selectedAnswer === i
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-300'
                            }
                          `}>
                            {quizState.isAnswered && i === selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {quizState.isAnswered && i === quizState.selectedAnswer && i !== selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer && (
                              <X className="h-3 w-3" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {quizState.isAnswered && (
                  <div className={`p-3 rounded-md ${quizState.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-medium">
                      {quizState.isCorrect ? 'Correct!' : 'Not quite right.'}
                    </p>
                    <p className="text-sm mt-1">
                      {quizState.isCorrect 
                        ? 'Great job! You selected the right answer.' 
                        : `The correct answer is: ${selectedSkill.quiz.questions[quizState.currentQuestion].options[selectedSkill.quiz.questions[quizState.currentQuestion].correctAnswer]}`
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  {quizState.isAnswered && (
                    <Button onClick={nextQuestion}>
                      {quizState.currentQuestion < selectedSkill.quiz.questions.length - 1 
                        ? 'Next Question' 
                        : 'Finish Quiz'
                      }
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // Skill Info View
              <div className="space-y-6 py-4">
                {/* Tool/Technique Image */}
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={selectedSkill.image} 
                    alt={selectedSkill.name}
                    className="w-full object-cover h-48"
                  />
                  <div className="p-3 bg-white">
                    <h3 className="font-medium">{selectedSkill.name}</h3>
                    <p className="text-sm text-gray-600">Visual reference for this technique/tool</p>
                  </div>
                </div>
                
                {/* Video Section */}
                {selectedSkill.videoTimestamp && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Technique Demonstration</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Watch the video demonstration of this technique from our comprehensive kitchen tools guide.
                    </p>
                    <Button 
                      onClick={() => watchSkillSection(selectedSkill)} 
                      className="w-full sm:w-auto"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Watch Demo Video
                    </Button>
                  </div>
                )}
                
                {/* Tips Section */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium text-amber-800">Tips & Tricks</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedSkill.tipAndTricks.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                        <CircleCheck className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Practical Task */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-blue-800">Practical Task</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    {selectedSkill.practicalTask}
                  </p>
                </div>
                
                {/* Quiz Section */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Knowledge Check</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Test your understanding with a short quiz on {selectedSkill.name.toLowerCase()}.
                  </p>
                  {userProgress.quizResults[selectedSkill.id] ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-800">Quiz Completed</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={startQuiz} 
                      variant="outline" 
                      className="w-full sm:w-auto"
                    >
                      Start Quiz
                    </Button>
                  )}
                </div>
                
                {/* Status */}
                {userProgress.completedSkills.includes(selectedSkill.id) && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Skill Completed</p>
                      <p className="text-xs text-green-700">You've successfully mastered this skill</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
      
      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={videoDialog.open}
        onOpenChange={(open) => setVideoDialog({ ...videoDialog, open })}
        videoId={videoDialog.videoId}
        title={videoDialog.title}
      />
    </div>
  );
};

export default KitchenSkillsLearning;
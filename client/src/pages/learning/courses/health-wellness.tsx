import { useState } from 'react';
import { useLocation } from 'wouter';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import SimpleResourceLinks, { SimpleResource } from '@/components/simple-resource-links';

export default function HealthWellnessCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to health and wellness
  const resources: SimpleResource[] = [
    {
      title: "Physical Activity Guidelines",
      url: "https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines",
      description: "Official physical activity recommendations for Americans"
    },
    {
      title: "Meditation for Beginners",
      url: "https://www.youtube.com/c/Headspace",
      description: "Simple guided meditation videos for stress reduction"
    },
    {
      title: "MyPlate Food Guide",
      url: "https://www.myplate.gov/",
      description: "Nutrition guidance and meal planning resources"
    },
    {
      title: "r/Fitness",
      url: "https://www.reddit.com/r/Fitness/",
      description: "Community forum for fitness advice and motivation"
    },
    {
      title: "Sleep Calculator",
      url: "https://sleepcalculator.com/",
      description: "Calculate optimal bedtimes based on sleep cycles"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-0 sm:mr-4 px-2 py-1 h-auto"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-xl sm:text-2xl font-bold flex items-center">
          <Heart className="h-6 w-6 mr-2 text-orange-500" />
          Health & Wellness
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
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Introduction to Health & Wellness</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Taking care of your physical and mental wellbeing is essential for a balanced, productive life.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <p className="mb-4 text-sm sm:text-base">
                Health and wellness encompasses physical, mental, and emotional wellbeing. Understanding how to maintain a balanced lifestyle is crucial for long-term health, productivity, and happiness.
              </p>
              <p className="mb-4 text-sm sm:text-base">
                In this module, you'll learn about nutrition basics, exercise fundamentals, stress management techniques, sleep hygiene, and mindfulness practices. These tools will help you create sustainable habits for a healthier lifestyle.
              </p>
              <div className="p-3 sm:p-4 bg-amber-50 rounded-md border border-amber-200 mb-4">
                <h3 className="font-semibold text-amber-800 mb-1 sm:mb-2 text-sm sm:text-base">Coming Soon!</h3>
                <p className="text-amber-700 text-xs sm:text-sm">
                  We're currently developing comprehensive health and wellness guides. Check back soon for interactive health assessments and personalized wellness plans!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">5 Pillars of Wellness</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Core areas to focus on for a balanced, healthy lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border rounded-md">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">1. Physical Health</h3>
                  <p className="text-xs sm:text-sm">Regular exercise, balanced nutrition, adequate sleep, and preventive healthcare create the foundation for wellness. Aim for 150 minutes of moderate activity weekly, eat a variety of whole foods, and prioritize 7-9 hours of quality sleep.</p>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-md">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">2. Mental & Emotional Wellbeing</h3>
                  <p className="text-xs sm:text-sm">Practicing stress management, mindfulness, and emotional regulation helps build resilience. Consider meditation, journaling, or therapy as tools to support mental health.</p>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-md">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">3. Social Connection</h3>
                  <p className="text-xs sm:text-sm">Meaningful relationships and community involvement support overall wellbeing. Schedule regular time with friends and family, join clubs or groups with shared interests, and practice active listening.</p>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-md">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">4. Purpose & Personal Growth</h3>
                  <p className="text-xs sm:text-sm">Setting meaningful goals, learning new skills, and engaging in activities that provide a sense of purpose contributes to life satisfaction. Identify values that matter to you and align your activities accordingly.</p>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-md">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">5. Environmental Wellness</h3>
                  <p className="text-xs sm:text-sm">Creating supportive physical environments and developing sustainable practices. Organize your living space, spend time in nature, and consider how your lifestyle impacts the broader environment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Test Your Knowledge</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Answer these questions to see how much you've learned about health and wellness.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <QuizComponent 
                subject="Health and Wellness"
                difficulty="beginner"
                questions={[
                  {
                    id: 1,
                    question: "How much moderate-intensity physical activity is recommended weekly for adults?",
                    options: [
                      "30 minutes once a week", 
                      "At least 150 minutes per week", 
                      "10 minutes per day", 
                      "Only when feeling stressed"
                    ],
                    correctAnswer: 1,
                    explanation: "The CDC and WHO recommend at least 150 minutes of moderate-intensity physical activity per week (about 30 minutes, 5 days a week), plus muscle-strengthening activities on 2 or more days per week."
                  },
                  {
                    id: 2,
                    question: "Which of these is NOT a main food group according to USDA's MyPlate guidelines?",
                    options: [
                      "Fruits", 
                      "Vegetables", 
                      "Proteins", 
                      "Sugars"
                    ],
                    correctAnswer: 3,
                    explanation: "The five main food groups in the USDA's MyPlate guidelines are Fruits, Vegetables, Proteins, Grains, and Dairy. Sugars and added fats are not considered a food group but are recommended to be limited."
                  },
                  {
                    id: 3,
                    question: "What is an effective technique for stress management?",
                    options: [
                      "Consuming caffeine to stay alert", 
                      "Practicing regular mindfulness meditation", 
                      "Avoiding all challenging situations", 
                      "Working longer hours"
                    ],
                    correctAnswer: 1,
                    explanation: "Regular mindfulness meditation has been shown to reduce stress, anxiety, and depression while improving focus and emotional regulation. Even short daily sessions (5-10 minutes) can provide benefits."
                  },
                  {
                    id: 4,
                    question: "How many hours of sleep are generally recommended for adults?",
                    options: [
                      "4-5 hours", 
                      "5-6 hours", 
                      "7-9 hours", 
                      "10-12 hours"
                    ],
                    correctAnswer: 2,
                    explanation: "The National Sleep Foundation recommends that adults get 7-9 hours of quality sleep per night. Consistent sleep schedules, a comfortable environment, and limiting screen time before bed all contribute to better sleep."
                  },
                  {
                    id: 5,
                    question: "Which is generally considered a healthy way to approach nutrition?",
                    options: [
                      "Completely eliminating all carbohydrates", 
                      "Eating only one large meal daily", 
                      "Following strict detox diets monthly", 
                      "Eating a balanced diet with a variety of whole foods"
                    ],
                    correctAnswer: 3,
                    explanation: "A balanced diet containing a variety of whole foods provides the necessary nutrients for optimal health. Most nutritionists recommend emphasizing fruits, vegetables, whole grains, lean proteins, and healthy fats while limiting processed foods, added sugars and excessive salt."
                  }
                ]}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                }}
                className="text-sm sm:text-base"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Health & Wellness Resources</CardTitle>
              <CardDescription>Curated resources to help master these skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks 
                resources={resources}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}
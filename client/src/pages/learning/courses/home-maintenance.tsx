import { useState } from 'react';
import { useLocation } from 'wouter';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HandymanGuide from '@/components/handyman-guide';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import SimpleResourceLinks, { SimpleResource } from '@/components/simple-resource-links';

export default function HomeMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to home maintenance
  const resources: SimpleResource[] = [
    {
      title: "Home Repair Basics",
      url: "https://www.familyhandyman.com/list/100-home-repairs-you-can-do-yourself/",
      description: "Common home repairs you can tackle without calling a pro"
    },
    {
      title: "DIY Home Improvement Videos",
      url: "https://www.youtube.com/c/thisoldhouse",
      description: "Step-by-step visual guides for home repairs and maintenance"
    },
    {
      title: "Home Maintenance Schedule",
      url: "https://www.thespruce.com/home-maintenance-schedule-4156922",
      description: "Seasonal checklist for home maintenance tasks"
    },
    {
      title: "DIY Network",
      url: "https://www.diynetwork.com/how-to",
      description: "Expert guides and project instructions for home improvement"
    },
    {
      title: "HomeAdvisor",
      url: "https://www.homeadvisor.com/",
      description: "Find professionals for jobs you can't handle yourself"
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
          <Wrench className="h-6 w-6 mr-2 text-orange-500" />
          Home Maintenance
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={activeTab === 'learn' ? 'default' : 'outline'}
          className={activeTab === 'learn' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('learn')}
        >
          Learn
        </Button>
        <Button
          variant={activeTab === 'practice' ? 'default' : 'outline'}
          className={activeTab === 'practice' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('practice')}
        >
          Test Your Knowledge
        </Button>
        <Button
          variant={activeTab === 'resources' ? 'default' : 'outline'}
          className={activeTab === 'resources' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </Button>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Home Maintenance</CardTitle>
              <CardDescription>
                Basic home maintenance can save you money and prevent small problems from becoming major disasters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Knowing how to handle common household repairs and maintenance is a fundamental life skill that can save you hundreds or even thousands of dollars over time. From unclogging drains to fixing leaky faucets, these skills help you maintain your living space and respond quickly to problems.
              </p>
              <p className="mb-4">
                In this module, you'll learn about essential home maintenance tasks, basic plumbing repairs, wall patching, and when it's appropriate to call in a professional. You'll also discover how to use common tools safely and effectively.
              </p>
            </CardContent>
          </Card>
          
          <HandymanGuide />
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about home maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Home Maintenance"
                difficulty="beginner"
                questions={[
                  {
                    id: 1,
                    question: "What is the main purpose of regularly checking and replacing HVAC filters?",
                    options: [
                      "To keep your warranty valid",
                      "To improve system efficiency and air quality",
                      "To prevent electrical fires",
                      "It's only necessary in older homes"
                    ],
                    correctAnswer: 1,
                    explanation: "Regular replacement of HVAC filters improves system efficiency (saving energy costs), extends the life of your HVAC system, and improves indoor air quality by removing dust, allergens, and other particles."
                  },
                  {
                    id: 2,
                    question: "How often should you test smoke and carbon monoxide detectors?",
                    options: [
                      "Once a year during daylight savings",
                      "Only when the batteries need replacement",
                      "Monthly",
                      "Only after a power outage"
                    ],
                    correctAnswer: 2,
                    explanation: "Smoke and carbon monoxide detectors should be tested monthly to ensure they're working properly. Batteries should be replaced at least once a year, and the entire units should be replaced according to the manufacturer's recommendations (usually every 10 years for smoke detectors and 5-7 years for carbon monoxide detectors)."
                  },
                  {
                    id: 3,
                    question: "What's the most common cause of clogged drains in the kitchen?",
                    options: [
                      "Hair",
                      "Grease and food particles",
                      "Soap scum",
                      "Foreign objects"
                    ],
                    correctAnswer: 1,
                    explanation: "Grease, oils, and food particles are the most common causes of kitchen drain clogs. They can build up over time, especially if hot grease is poured down the drain where it solidifies as it cools."
                  },
                  {
                    id: 4,
                    question: "How often should gutters be cleaned in a typical home?",
                    options: [
                      "Monthly",
                      "Twice a year (spring and fall)",
                      "Only when they overflow",
                      "Once every few years"
                    ],
                    correctAnswer: 1,
                    explanation: "Gutters should typically be cleaned twice a year - in late spring and early fall. However, if you have many trees near your home, you might need to clean them more frequently. Clogged gutters can lead to water damage to your roof, siding, and foundation."
                  },
                  {
                    id: 5,
                    question: "What should you do first if you have a water leak under a sink?",
                    options: [
                      "Call a plumber immediately",
                      "Turn off the water supply to the sink",
                      "Place a bucket under the leak",
                      "Apply plumber's tape to the leak"
                    ],
                    correctAnswer: 1,
                    explanation: "The first step when dealing with any plumbing leak is to stop the water flow by turning off the water supply to that fixture. This prevents further water damage while you assess the situation and either fix it yourself or call a professional."
                  },
                  {
                    id: 6,
                    question: "What is the recommended depth for attic insulation in most climates?",
                    options: [
                      "3-5 inches",
                      "6-9 inches",
                      "10-14 inches",
                      "15-18 inches"
                    ],
                    correctAnswer: 2,
                    explanation: "For most climates in the United States, the Department of Energy recommends attic insulation with an R-value of R-38 to R-60, which typically equates to about 10-14 inches of fiberglass batt insulation or more. This helps maintain energy efficiency year-round."
                  },
                  {
                    id: 7,
                    question: "What should you check first if your toilet is running continuously?",
                    options: [
                      "The water supply line",
                      "The flush valve (flapper)",
                      "The wax ring seal",
                      "The toilet handle mechanism"
                    ],
                    correctAnswer: 1,
                    explanation: "A continuously running toilet is most commonly caused by a faulty flush valve (flapper) that isn't sealing properly. Check if it's worn, misaligned, or if the chain is preventing it from seating correctly. This is typically an easy and inexpensive fix."
                  },
                  {
                    id: 8,
                    question: "How often should exterior house paint be refreshed in typical climates?",
                    options: [
                      "Every 2-3 years",
                      "Every 5-7 years",
                      "Every 10-15 years",
                      "Only when visibly peeling"
                    ],
                    correctAnswer: 1,
                    explanation: "In typical climates, exterior house paint should be refreshed approximately every 5-7 years. However, this can vary significantly based on climate, sun exposure, paint quality, and home construction. More severe weather conditions may require more frequent painting."
                  },
                  {
                    id: 9,
                    question: "What is the proper way to store paint leftover from home projects?",
                    options: [
                      "Leave the can open to dry out before disposal",
                      "Store in the original can with the lid tightly sealed, in a temperature-controlled environment",
                      "Transfer to plastic containers for better sealing",
                      "It cannot be stored once opened and must be used immediately"
                    ],
                    correctAnswer: 1,
                    explanation: "For longest shelf life, store paint in its original can with the lid tightly sealed. Clean the rim of the can before closing to ensure a good seal. Store in a temperature-controlled environment (not too hot or cold) and away from direct sunlight. Properly stored latex paint can last 2-10 years."
                  },
                  {
                    id: 10,
                    question: "What is the main purpose of a sump pump in a basement?",
                    options: [
                      "To improve air circulation",
                      "To prevent water damage by removing accumulated water",
                      "To reduce humidity levels",
                      "To prevent radon gas buildup"
                    ],
                    correctAnswer: 1,
                    explanation: "A sump pump's primary purpose is to prevent water damage in basements by collecting water in a sump pit and pumping it away from the foundation. This is especially important in areas with high water tables or frequent heavy rainfall that could otherwise lead to basement flooding."
                  }
                ]}
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
              <CardTitle>Home Maintenance Resources</CardTitle>
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
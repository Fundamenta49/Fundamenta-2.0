import { useState } from 'react';
import { useLocation } from 'wouter';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VehicleGuide from '@/components/vehicle-guide';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import SimpleResourceLinks, { SimpleResource } from '@/components/simple-resource-links';

export default function VehicleMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  
  // Function to handle navigation back to Learning page
  const handleBackNavigation = () => {
    navigate('/learning');
    window.scrollTo(0, 0);
  };
  
  // Function to handle tab changes
  const handleTabChange = (tab: 'learn' | 'practice' | 'resources') => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  // Resources specific to vehicle maintenance
  const resources: SimpleResource[] = [
    {
      title: "Car Maintenance 101",
      url: "https://www.aaa.com/autorepair/articles/car-maintenance-basics",
      description: "AAA's guide to essential car maintenance tasks"
    },
    {
      title: "DIY Auto Repair Videos",
      url: "https://www.youtube.com/c/chrisfix",
      description: "Step-by-step visual guides for car maintenance"
    },
    {
      title: "Vehicle Owner's Manual Library",
      url: "https://www.edmunds.com/how-to/how-to-find-your-car-owners-manual-online.html",
      description: "Find manufacturer recommendations for your specific vehicle"
    },
    {
      title: "Car Talk",
      url: "https://www.cartalk.com/",
      description: "Expert advice and community Q&A for car problems"
    },
    {
      title: "RepairPal",
      url: "https://repairpal.com/",
      description: "Estimate repair costs and find reliable mechanics in your area"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackNavigation}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Car className="h-6 w-6 mr-2 text-orange-500" />
          Vehicle Maintenance
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
              onClick={() => handleTabChange('learn')}
              role="tab"
              aria-selected={activeTab === 'learn'}
              tabIndex={0}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('practice')}
              role="tab"
              aria-selected={activeTab === 'practice'}
              tabIndex={0}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('resources')}
              role="tab"
              aria-selected={activeTab === 'resources'}
              tabIndex={0}
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
              <CardTitle>Introduction to Vehicle Maintenance</CardTitle>
              <CardDescription>
                Regular vehicle maintenance saves money, extends your vehicle's life, and ensures your safety on the road.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Understanding the basics of car maintenance is an essential life skill that can save you thousands of dollars over the lifetime of your vehicle. Even if you're not mechanically inclined, learning which issues you can handle yourself and which require professional help is valuable knowledge.
              </p>
              <p className="mb-4">
                In this module, you'll learn about routine maintenance tasks like oil changes, tire rotation, and fluid checks, as well as how to identify common problems before they become expensive repairs.
              </p>
            </CardContent>
          </Card>
          
          <VehicleGuide />
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about vehicle maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Vehicle Maintenance"
                difficulty="beginner"
                questions={[
                  {
                    id: 1,
                    question: "How often should you typically change your engine oil?",
                    options: [
                      "Every 1,000 miles", 
                      "Every 3,000-5,000 miles or as recommended by manufacturer", 
                      "Once a year regardless of miles driven", 
                      "Only when the oil light comes on"
                    ],
                    correctAnswer: 1,
                    explanation: "Most modern vehicles need oil changes every 3,000-5,000 miles, though many newer models with synthetic oil can go 7,500-10,000 miles. Always check your owner's manual for the manufacturer's recommendation."
                  },
                  {
                    id: 2,
                    question: "What is the correct tire pressure for most passenger vehicles?",
                    options: [
                      "As high as possible for better fuel economy", 
                      "Whatever feels right when you press on the tire", 
                      "The PSI listed on the tire sidewall", 
                      "The PSI listed on the sticker inside the driver's door or in the owner's manual"
                    ],
                    correctAnswer: 3,
                    explanation: "The correct tire pressure is found on a sticker inside the driver's door jamb or in your owner's manual. The PSI on the tire sidewall is the maximum pressure, not the recommended pressure."
                  },
                  {
                    id: 3,
                    question: "When should you rotate your tires?",
                    options: [
                      "Every 6,000-8,000 miles", 
                      "Only when they show uneven wear", 
                      "When changing from winter to summer tires", 
                      "Once per year regardless of mileage"
                    ],
                    correctAnswer: 0,
                    explanation: "Tires should be rotated approximately every 6,000-8,000 miles to ensure even wear. This helps extend tire life and maintains optimal handling and traction."
                  },
                  {
                    id: 4,
                    question: "What does the check engine light typically indicate?",
                    options: [
                      "You need to immediately pull over and turn off the engine", 
                      "Your vehicle needs an oil change", 
                      "A sensor has detected an issue that needs attention", 
                      "You're low on windshield washer fluid"
                    ],
                    correctAnswer: 2,
                    explanation: "The check engine light indicates that the onboard diagnostic system has detected an issue. While not always an emergency, it should be checked soon with a diagnostic scanner to determine the specific problem."
                  },
                  {
                    id: 5,
                    question: "Which of these fluids should NOT be topped off if low?",
                    options: [
                      "Windshield washer fluid", 
                      "Engine coolant", 
                      "Transmission fluid", 
                      "Power steering fluid"
                    ],
                    correctAnswer: 2,
                    explanation: "Low transmission fluid is often a sign of a leak, as it operates in a closed system and shouldn't be consumed. Adding fluid without fixing the leak is a temporary solution at best and could mask a serious problem."
                  },
                  {
                    id: 6,
                    question: "What is the purpose of a vehicle's alternator?",
                    options: [
                      "To start the engine", 
                      "To power the vehicle when the engine is off", 
                      "To charge the battery and power electrical systems while the engine runs", 
                      "To control the air conditioning system"
                    ],
                    correctAnswer: 2,
                    explanation: "The alternator charges the battery and powers the vehicle's electrical systems while the engine is running. Without a functioning alternator, the battery would eventually drain completely."
                  },
                  {
                    id: 7,
                    question: "How often should you replace your vehicle's air filter?",
                    options: [
                      "Every 15,000-30,000 miles", 
                      "With every oil change", 
                      "Once a year regardless of mileage", 
                      "Only when the check engine light comes on"
                    ],
                    correctAnswer: 0,
                    explanation: "Most manufacturers recommend replacing the air filter every 15,000-30,000 miles, though this can vary based on driving conditions. Dusty or polluted environments may require more frequent changes."
                  },
                  {
                    id: 8,
                    question: "What is the main purpose of a vehicle's timing belt or chain?",
                    options: [
                      "To connect the transmission to the wheels", 
                      "To synchronize the rotation of the crankshaft and camshaft", 
                      "To control the vehicle's speed", 
                      "To operate the power steering"
                    ],
                    correctAnswer: 1,
                    explanation: "The timing belt or chain synchronizes the rotation of the crankshaft and camshaft, ensuring valves open and close at the proper times relative to piston movement. A broken timing belt can cause serious engine damage in some engine designs."
                  },
                  {
                    id: 9,
                    question: "What should you check first if your car won't start and makes a clicking sound?",
                    options: [
                      "Fuel level", 
                      "Battery and connections", 
                      "Starter motor", 
                      "Spark plugs"
                    ],
                    correctAnswer: 1,
                    explanation: "A clicking sound when trying to start a vehicle often indicates a battery or electrical issue. Check the battery connections for corrosion or looseness, and ensure the battery has sufficient charge before investigating other potential causes."
                  },
                  {
                    id: 10,
                    question: "What is hydroplaning and how can you prevent it?",
                    options: [
                      "Engine overheating due to low coolant; prevent by checking fluid levels", 
                      "Tires losing contact with the road due to water; prevent by reducing speed and maintaining good tires", 
                      "Brakes overheating on long descents; prevent by downshifting", 
                      "Transmission slipping; prevent by changing transmission fluid regularly"
                    ],
                    correctAnswer: 1,
                    explanation: "Hydroplaning occurs when tires lose contact with the road surface due to water, causing a loss of control. Prevent it by reducing speed in wet conditions, maintaining proper tire inflation, and ensuring your tires have adequate tread depth."
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
              <CardTitle>Vehicle Maintenance Resources</CardTitle>
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
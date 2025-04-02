import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Phone,
  MessageSquare,
  Shield,
  AlertTriangle,
  Heart,
  LogOut,
  Check,
  Plus,
  X
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SafetyStep {
  title: string;
  description: string;
  content: string;
  items: string[];
}

// Quick exit functionality
const handleQuickExit = () => {
  window.location.href = "https://weather.com";
};

// Default safety planning information
const defaultSafetyPlanSteps: SafetyStep[] = [
  {
    title: "Important Documents",
    description: "Essential documents to keep safe",
    content: "Keep copies of important documents in a safe place or with a trusted person",
    items: [
      "Driver's license and ID cards",
      "Birth certificates and passports",
      "Social Security cards",
      "Insurance policies",
      "Bank account information",
      "Medical records and prescriptions"
    ]
  },
  {
    title: "Emergency Bag",
    description: "Pack essentials for quick departure",
    content: "Pack an emergency bag with essentials",
    items: [
      "Clothes for a few days",
      "Medications",
      "Cash and change",
      "Copies of keys",
      "Phone charger",
      "Basic toiletries"
    ]
  },
  {
    title: "Safe Contacts",
    description: "Important contacts for emergencies",
    content: "Keep important contact information readily available",
    items: [
      "Trusted friends and family",
      "Local domestic violence shelter",
      "Your doctor's office",
      "Your children's school",
      "Local police non-emergency number",
      "Your lawyer or legal aid"
    ]
  },
  {
    title: "Plan Escape Routes",
    description: "Know your exit strategies",
    content: "Know the safest ways to leave",
    items: [
      "Identify all possible exits from your home",
      "Practice getting out quickly",
      "Know which doors/windows can be used as exits",
      "Keep car keys accessible",
      "Plan where you will go",
      "Have backup transportation options"
    ]
  }
];

const STORAGE_KEY = 'user_safety_plan';

export default function DomesticViolenceHelp() {
  console.log("DomesticViolenceHelp component mounting");

  const [safetyPlanSteps, setSafetyPlanSteps] = useState<SafetyStep[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log("Initial safety plan steps:", stored);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultSafetyPlanSteps;
  });

  const [newStep, setNewStep] = useState<SafetyStep>({
    title: '',
    description: '',
    content: '',
    items: []
  });

  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<{ stepIndex: number, itemIndex: number | null }>({ stepIndex: -1, itemIndex: null });
  const [newItem, setNewItem] = useState("");

  // Listen for Escape key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleQuickExit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Save safety plan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safetyPlanSteps));
    } catch (error) {
      console.error('Error saving safety plan:', error);
    }
  }, [safetyPlanSteps]);

  const handleAddStep = () => {
    if (newStep.title && newStep.content) {
      setSafetyPlanSteps([...safetyPlanSteps, { ...newStep, items: [] }]);
      setNewStep({ title: '', description: '', content: '', items: [] });
      setIsAddingStep(false);
    }
  };

  const handleAddItem = (stepIndex: number) => {
    if (newItem.trim()) {
      const updatedSteps = [...safetyPlanSteps];
      updatedSteps[stepIndex].items.push(newItem.trim());
      setSafetyPlanSteps(updatedSteps);
      setNewItem("");
      setEditingItemIndex({ stepIndex: -1, itemIndex: null });
    }
  };

  const handleRemoveItem = (stepIndex: number, itemIndex: number) => {
    const updatedSteps = [...safetyPlanSteps];
    updatedSteps[stepIndex].items.splice(itemIndex, 1);
    setSafetyPlanSteps(updatedSteps);
  };

  const handleUpdateItem = (stepIndex: number, itemIndex: number, newValue: string) => {
    const updatedSteps = [...safetyPlanSteps];
    updatedSteps[stepIndex].items[itemIndex] = newValue;
    setSafetyPlanSteps(updatedSteps);
    setEditingItemIndex({ stepIndex: -1, itemIndex: null });
  };

  return (
    <div className="space-y-6 relative">
      {/* Quick Exit Button */}
      <Button
        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600"
        onClick={handleQuickExit}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Exit Now
      </Button>

      {/* Emergency Notice */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-800">
          If you are in immediate danger, call 911 or your local emergency number immediately.
        </AlertDescription>
      </Alert>

      {/* Hotlines Section */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            24/7 Crisis Hotlines
          </CardTitle>
          <CardDescription>
            Free, confidential support available anytime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Button
              variant="default"
              className="justify-between"
              onClick={() => window.location.href = "tel:18007997233"}
            >
              National Domestic Violence Hotline
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.location.href = "sms:88788"}
            >
              Text HELP to 88788
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Safety Planning
          </CardTitle>
          <CardDescription>
            Customize your safety plan - add or modify steps and items that work for your situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {safetyPlanSteps.map((step, stepIndex) => (
                <AccordionItem key={stepIndex} value={`step-${stepIndex}`}>
                  <AccordionTrigger>{step.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{step.content}</p>
                      <div className="space-y-2">
                        {step.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2">
                            {editingItemIndex.stepIndex === stepIndex && editingItemIndex.itemIndex === itemIndex ? (
                              <div className="flex-1 flex gap-2">
                                <Input
                                  value={newItem || item}
                                  onChange={(e) => setNewItem(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleUpdateItem(stepIndex, itemIndex, newItem || item);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateItem(stepIndex, itemIndex, newItem || item)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingItemIndex({ stepIndex: -1, itemIndex: null });
                                    setNewItem("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="flex-1">{item}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingItemIndex({ stepIndex, itemIndex });
                                    setNewItem(item);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveItem(stepIndex, itemIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2 mt-4">
                          <Input
                            placeholder="Add new item"
                            value={editingItemIndex.stepIndex === stepIndex ? newItem : ""}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && editingItemIndex.stepIndex === -1) {
                                handleAddItem(stepIndex);
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleAddItem(stepIndex)}
                            disabled={!newItem.trim() || editingItemIndex.stepIndex !== -1}
                          >
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {isAddingStep ? (
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Step Title"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                />
                <Input
                  placeholder="Step Description"
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                />
                <Input
                  placeholder="Step Content"
                  value={newStep.content}
                  onChange={(e) => setNewStep({ ...newStep, content: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddStep} disabled={!newStep.title || !newStep.content}>
                    Save Step
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsAddingStep(false);
                    setNewStep({ title: '', description: '', content: '', items: [] });
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsAddingStep(true)}
                className="w-full mt-4"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Safety Step
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Organizations and resources for support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.thehotline.org", "_blank")}
            >
              National Domestic Violence Hotline Website
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.rainn.org", "_blank")}
            >
              RAINN - Sexual Assault Support
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => window.open("https://www.loveisrespect.org", "_blank")}
            >
              Love Is Respect - Teen Dating Violence
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browser Safety Notice */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          For your safety: Learn how to delete browser history, use private browsing, 
          or call from a safe phone. Press ESC key anytime for quick exit.
        </AlertDescription>
      </Alert>
    </div>
  );
}
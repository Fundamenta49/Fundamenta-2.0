import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Scale,
  FileText,
  AlertTriangle,
  ExternalLink,
  Shield,
  BookOpen
} from "lucide-react";

// Add state-specific form links at the top
const stateCourtForms = {
  "California": "https://www.courts.ca.gov/forms.htm?filter=DV",
  "New York": "https://www.nycourts.gov/forms/familycourt/domesticviolence.shtml",
  "Texas": "https://www.txcourts.gov/programs-services/protective-order-registry/protective-order-forms/",
  "Florida": "https://www.flcourts.org/Resources-Services/Court-Improvement/Family-Courts/Family-Law-Self-Help-Information/Family-Law-Forms",
  "Illinois": "https://www.illinoiscourts.gov/forms/approved-forms/forms-approved-forms-circuit-court/domestic-violence",
  "Pennsylvania": "https://www.pacourts.us/forms/dependency-forms",
  "Ohio": "https://www.supremecourt.ohio.gov/JCS/domesticViolence/protection_forms/DVForms/default.asp",
  "Michigan": "https://courts.michigan.gov/Administration/SCAO/Forms/Pages/Personal-Protection.aspx",
  "Georgia": "https://georgiacourts.gov/domestic-violence-forms/",
  "North Carolina": "https://www.nccourts.gov/documents/forms/complaint-and-motion-for-domestic-violence-protective-order",
  // Add more states
};

// Update the protectiveOrderSteps to include form information
const protectiveOrderSteps = [
  {
    title: "Find Your State's Forms",
    content: "Locate and download the correct protective order forms for your state",
    items: [
      "Visit your state court's website",
      "Look for 'Protection Order' or 'Restraining Order' forms",
      "Download or request the forms",
      "Check if your court offers online filing",
      "Consider contacting your local court clerk for guidance",
      "Some courts offer form-filling assistance"
    ]
  },
  {
    title: "Gather Documentation",
    content: "Collect evidence of abuse and important documents",
    items: [
      "Police reports or incident numbers",
      "Photos of injuries or property damage",
      "Threatening messages or emails",
      "Medical records",
      "Witness statements",
      "Your personal identification"
    ]
  },
  {
    title: "File the Petition",
    content: "Complete and submit the protective order petition",
    items: [
      "Visit your local courthouse",
      "Ask for domestic violence/protective order forms",
      "Fill out all required paperwork completely",
      "Request an emergency temporary order if in immediate danger",
      "Keep copies of all documents"
    ]
  },
  {
    title: "Court Hearing",
    content: "Prepare for and attend the court hearing",
    items: [
      "Arrive early to court",
      "Bring all evidence and documentation",
      "Be prepared to testify about the abuse",
      "Bring witnesses if available",
      "Follow proper court etiquette"
    ]
  },
  {
    title: "After the Order",
    content: "Steps to take after receiving the order",
    items: [
      "Keep copies of the order with you at all times",
      "Give copies to work, school, and security",
      "Register the order with local law enforcement",
      "Document any violations",
      "Have an emergency plan ready"
    ]
  }
];

// Legal Resources by State (remains unchanged)
const legalResources = {
  general: [
    {
      name: "National Domestic Violence Legal Hotline",
      url: "https://www.thehotline.org/resources/legal-help/",
      description: "Free 24/7 legal advice for domestic violence survivors"
    },
    {
      name: "WomensLaw.org",
      url: "https://www.womenslaw.org/",
      description: "Legal information and resources for domestic violence"
    },
    {
      name: "Legal Services Corporation",
      url: "https://www.lsc.gov/what-legal-aid/find-legal-aid",
      description: "Find free legal aid in your area"
    },
    {
      name: "American Bar Association",
      url: "https://www.americanbar.org/groups/legal_services/flh-home/",
      description: "Free legal answers and pro bono services"
    }
  ]
};

const violationSteps = [
  {
    title: "Immediate Safety",
    content: "If you're in immediate danger, call 911 right away",
    items: [
      "Get to a safe location",
      "Call emergency services (911)",
      "Alert trusted neighbors or family",
      "Document the violation",
      "Follow your safety plan"
    ]
  },
  {
    title: "Document Everything",
    content: "Keep detailed records of any violations",
    items: [
      "Write down date, time, and location",
      "Take photos or screenshots",
      "Save any messages or voicemails",
      "Note any witnesses present",
      "Keep a detailed log of all incidents"
    ]
  },
  {
    title: "Report the Violation",
    content: "Report the violation to law enforcement",
    items: [
      "Call non-emergency police if not urgent",
      "Show police your protective order",
      "Get a copy of the police report",
      "Request increased patrol if needed",
      "Follow up with the prosecutor's office"
    ]
  }
];

export default function LegalRightsGuide() {
  const [selectedState, setSelectedState] = useState("");
  const [showStateForm, setShowStateForm] = useState(false);
  const [legalQuestion, setLegalQuestion] = useState("");
  const [legalResponse, setLegalResponse] = useState("");

  const handleLegalQuestion = async () => {
    if (!legalQuestion.trim()) return;

    setLegalResponse("Loading response...");
    // Here we would integrate with an AI service to get state-specific legal information
    // For now, we'll provide a placeholder response
    setLegalResponse(
      "This is a preliminary response. Please consult with a legal professional for accurate advice specific to your situation. " +
        "Your state's domestic violence coalition can provide free legal consultation and resources."
    );
  };

  return (
    <div className="space-y-6">
      {/* Emergency Notice */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-800">
          If you are in immediate danger, call 911. This guide provides general information and is not legal advice.
        </AlertDescription>
      </Alert>

      {/* Protective Order Guide with State Selection */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            How to File a Protective Order
          </CardTitle>
          <CardDescription>
            Select your state to get specific filing information and forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setSelectedState(value);
                setShowStateForm(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(stateCourtForms).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showStateForm && selectedState && (
              <Alert className="bg-blue-50 border-blue-200">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Forms for {selectedState} are available online.</p>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => window.open(stateCourtForms[selectedState], "_blank")}
                    >
                      Access {selectedState} Court Forms
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Accordion type="single" collapsible className="w-full">
              {protectiveOrderSteps.map((step, index) => (
                <AccordionItem key={index} value={`step-${index}`}>
                  <AccordionTrigger>{step.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{step.content}</p>
                      <ul className="list-disc list-inside space-y-2">
                        {step.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      {/* Free Legal Help */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-green-600" />
            Free Legal Help Resources
          </CardTitle>
          <CardDescription>
            Connect with pro bono lawyers and legal aid services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {legalResources.general.map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(resource.url, "_blank")}
              >
                <div className="text-left">
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-muted-foreground">{resource.description}</div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violation Response Guide */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            If an Order is Violated
          </CardTitle>
          <CardDescription>
            Steps to take if someone violates a restraining order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {violationSteps.map((step, index) => (
              <AccordionItem key={index} value={`violation-${index}`}>
                <AccordionTrigger>{step.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{step.content}</p>
                    <ul className="list-disc list-inside space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* AI Legal Assistant */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Legal Information Assistant
          </CardTitle>
          <CardDescription>
            Get information about domestic violence laws in your state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(stateCourtForms).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Ask about domestic violence laws in your state..."
                value={legalQuestion}
                onChange={(e) => setLegalQuestion(e.target.value)}
                className="border-wood/20 text-black placeholder:text-navy-300"
              />
              <Button
                className="w-full"
                onClick={handleLegalQuestion}
                disabled={!selectedState || !legalQuestion.trim()}
              >
                Get Information
              </Button>
            </div>
            {legalResponse && (
              <Alert className="mt-4">
                <AlertDescription>{legalResponse}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
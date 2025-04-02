import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Heart, LogOut, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Quick exit functionality
const handleQuickExit = () => {
  window.location.href = "https://weather.com";
};

const survivorStories = [
  {
    title: "Finding Strength",
    timeframe: "2 years free",
    content: "I never thought I could leave, but with the help of a domestic violence hotline and shelter, I found the courage to start fresh. Today, I have my own apartment, a job I love, and most importantly, peace. It wasn't easy, but it was worth every step.",
    resources: ["Local DV Shelter", "Career Counseling", "Support Groups"]
  },
  {
    title: "A Mother's Journey",
    timeframe: "5 years free",
    content: "Leaving was scary, especially with three kids. But I realized staying was scarier. The local domestic violence organization helped me with everything - from legal help to finding a new home. Now my children are thriving, and we're building happy memories together.",
    resources: ["Legal Aid", "Children's Services", "Housing Assistance"]
  },
  {
    title: "Starting Over at 50",
    timeframe: "18 months free",
    content: "After 25 years of marriage, I thought it was too late to change my life. But with support from my counselor and survivor support group, I found the strength. Now I help other women navigate their journey to freedom. It's never too late to start over.",
    resources: ["Counseling Services", "Financial Planning", "Survivor Support Groups"]
  },
  {
    title: "Breaking the Cycle",
    timeframe: "3 years free",
    content: "Growing up, I thought abuse was normal. When I became a mother, I knew I had to break the cycle. The domestic violence program helped me understand I deserved better. Today, I'm showing my daughter what healthy relationships look like.",
    resources: ["Parenting Support", "Trauma Therapy", "Educational Programs"]
  }
];

const helpfulResources = [
  {
    name: "National Domestic Violence Hotline",
    description: "24/7 support and resources",
    link: "https://www.thehotline.org/"
  },
  {
    name: "RAINN",
    description: "Support for survivors of sexual assault",
    link: "https://www.rainn.org/"
  },
  {
    name: "Love Is Respect",
    description: "Resources for recognizing healthy relationships",
    link: "https://www.loveisrespect.org/"
  }
];

export default function SurvivorStories() {
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

      {/* Safety Notice */}
      <Alert className="border-purple-200 bg-purple-50">
        <Heart className="h-5 w-5 text-purple-500" />
        <AlertDescription className="text-purple-800">
          These are real stories from survivors who found safety and healing. 
          You are not alone, and there is hope and help available.
        </AlertDescription>
      </Alert>

      {/* Survivor Stories Section */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Stories of Hope and Healing
          </CardTitle>
          <CardDescription>
            Real stories from people who found safety and rebuilt their lives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {survivorStories.map((story, index) => (
              <AccordionItem key={index} value={`story-${index}`}>
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    <span>{story.title}</span>
                    <span className="text-sm text-muted-foreground">{story.timeframe}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{story.content}</p>
                    <div className="mt-4">
                      <p className="font-medium">Resources That Helped:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {story.resources.map((resource, resourceIndex) => (
                          <li key={resourceIndex}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Get Help Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            Ready to Take the First Step?
          </CardTitle>
          <CardDescription>
            These organizations are ready to help you 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helpfulResources.map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(resource.link, "_blank")}
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

      {/* Safety Reminder */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Your safety is important. Remember to clear your browser history or use private browsing.
          Press ESC key anytime for quick exit.
        </AlertDescription>
      </Alert>
    </div>
  );
}

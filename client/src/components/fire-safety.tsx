import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Flame, Youtube } from "lucide-react";

const FIRE_SAFETY_CONTENT = {
  extinguishers: {
    types: [
      {
        class: "Class A",
        description: "For ordinary combustibles like wood, paper, cloth",
        color: "Green",
        usage: "Sweep from side to side at base of fire"
      },
      {
        class: "Class B",
        description: "For flammable liquids",
        color: "Red",
        usage: "Sweep from side to side at base of fire"
      },
      {
        class: "Class C",
        description: "For electrical fires",
        color: "Blue",
        usage: "Switch off power first if possible, then use extinguisher"
      },
      {
        class: "Class K",
        description: "For kitchen fires involving oils",
        color: "Black",
        usage: "Never use water, use in sweeping motion"
      }
    ],
    videos: [
      {
        title: "How to Use a Fire Extinguisher (PASS Method)",
        url: "https://www.youtube.com/embed/PQV71INDaqY",
        source: "Official NFPA",
        duration: "2:45"
      }
    ]
  },
  smokeDetectors: {
    maintenance: [
      "Test smoke alarms monthly using the test button",
      "Replace batteries every 6 months (daylight savings time)",
      "Replace entire unit every 10 years",
      "Clean with compressed air or vacuum annually",
      "Keep detailed records of maintenance dates"
    ],
    videos: [
      {
        title: "Smoke Detector Maintenance and Testing",
        url: "https://www.youtube.com/embed/4LQ6uhXAzvk",
        source: "US Fire Administration",
        duration: "3:15"
      }
    ]
  },
  prevention: {
    tips: [
      "Never leave cooking unattended",
      "Keep flammable items away from heat sources",
      "Don't overload electrical outlets",
      "Maintain proper spacing for portable heaters",
      "Store flammable liquids properly",
      "Create and practice a fire escape plan",
      "Install smoke detectors on every level",
      "Keep fire extinguishers accessible"
    ],
    videos: [
      {
        title: "Home Fire Prevention Tips",
        url: "https://www.youtube.com/embed/9GMv4NsLr9o",
        source: "US Fire Administration",
        duration: "4:30"
      }
    ]
  }
};

export default function FireSafety() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-600" />
          <span>Fire Safety Guide</span>
        </CardTitle>
        <CardDescription>
          Essential information about fire safety, extinguishers, and smoke detectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="extinguishers">
            <AccordionTrigger>Fire Extinguisher Guide</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FIRE_SAFETY_CONTENT.extinguishers.types.map((type) => (
                    <div key={type.class} className="p-4 rounded-lg border bg-white">
                      <h4 className="font-medium text-base">{type.class}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      <Badge className="mt-2" variant="outline">{type.color}</Badge>
                      <p className="text-sm mt-2 text-orange-600">{type.usage}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    Training Videos
                  </h4>
                  <div className="mt-2 space-y-4">
                    {FIRE_SAFETY_CONTENT.extinguishers.videos.map((video) => (
                      <div key={video.title} className="border rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="315"
                          src={video.url}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="border-b"
                        />
                        <div className="p-4 bg-orange-50">
                          <h5 className="font-medium">{video.title}</h5>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>{video.source}</span>
                            <span>•</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="smoke-detectors">
            <AccordionTrigger>Smoke Detector Maintenance</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-orange-600" />
                    Maintenance Checklist
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {FIRE_SAFETY_CONTENT.smokeDetectors.maintenance.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    Tutorial Videos
                  </h4>
                  <div className="mt-2 space-y-4">
                    {FIRE_SAFETY_CONTENT.smokeDetectors.videos.map((video) => (
                      <div key={video.title} className="border rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="315"
                          src={video.url}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="border-b"
                        />
                        <div className="p-4 bg-orange-50">
                          <h5 className="font-medium">{video.title}</h5>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>{video.source}</span>
                            <span>•</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prevention">
            <AccordionTrigger>Fire Prevention Tips</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    Prevention Guidelines
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {FIRE_SAFETY_CONTENT.prevention.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    Safety Videos
                  </h4>
                  <div className="mt-2 space-y-4">
                    {FIRE_SAFETY_CONTENT.prevention.videos.map((video) => (
                      <div key={video.title} className="border rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="315"
                          src={video.url}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="border-b"
                        />
                        <div className="p-4 bg-orange-50">
                          <h5 className="font-medium">{video.title}</h5>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>{video.source}</span>
                            <span>•</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

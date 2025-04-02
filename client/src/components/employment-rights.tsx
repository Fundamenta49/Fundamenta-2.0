import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ExternalLink, Shield, Scale, DollarSign, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RightsCategory {
  id: string;
  title: string;
  description: string;
  content: {
    text: string;
    links?: Array<{
      text: string;
      url: string;
    }>;
  }[];
}

const rightsData: RightsCategory[] = [
  {
    id: "employment-types",
    title: "At-Will Employment vs. Contracts",
    description: "Understanding different types of employment arrangements",
    content: [
      {
        text: "At-Will Employment: Most common in the US, meaning either employer or employee can terminate the relationship at any time without cause, subject to anti-discrimination laws.",
      },
      {
        text: "Employment Contracts: Formal agreements specifying terms of employment, including duration, responsibilities, compensation, and termination conditions.",
      },
      {
        text: "Key Differences:",
        links: [
          {
            text: "Department of Labor - Employment Contracts",
            url: "https://www.dol.gov/general/topic/wages/contracts",
          },
        ],
      },
    ],
  },
  {
    id: "workers-rights",
    title: "Workers' Rights",
    description: "Protection against harassment, discrimination, and wrongful termination",
    content: [
      {
        text: "Harassment: Unwelcome conduct based on protected characteristics. Employers must provide a harassment-free workplace.",
      },
      {
        text: "Discrimination: Protection against unfair treatment based on age, race, gender, religion, disability, or other protected characteristics.",
      },
      {
        text: "Wrongful Termination: Firing that violates employment contract terms or federal/state laws.",
        links: [
          {
            text: "EEOC - Discrimination",
            url: "https://www.eeoc.gov/discrimination-type",
          },
        ],
      },
    ],
  },
  {
    id: "wage-laws",
    title: "Minimum Wage & Overtime Laws",
    description: "Understanding wage requirements and overtime compensation",
    content: [
      {
        text: "Federal minimum wage is $7.25 per hour, but states may have higher requirements.",
      },
      {
        text: "Overtime: Non-exempt employees must receive 1.5x regular pay rate for hours worked over 40 in a workweek.",
        links: [
          {
            text: "DOL - Minimum Wage",
            url: "https://www.dol.gov/agencies/whd/minimum-wage",
          },
          {
            text: "DOL - Overtime Pay",
            url: "https://www.dol.gov/agencies/whd/overtime",
          },
        ],
      },
    ],
  },
  {
    id: "reporting",
    title: "How to Report Workplace Issues",
    description: "Guidelines for reporting violations to appropriate authorities",
    content: [
      {
        text: "Equal Employment Opportunity Commission (EEOC): Handles discrimination and harassment complaints.",
        links: [
          {
            text: "File an EEOC Complaint",
            url: "https://www.eeoc.gov/filing-charge-discrimination",
          },
        ],
      },
      {
        text: "Occupational Safety and Health Administration (OSHA): Handles workplace safety violations.",
        links: [
          {
            text: "File an OSHA Complaint",
            url: "https://www.osha.gov/workers/file-complaint",
          },
        ],
      },
      {
        text: "Department of Labor: Handles wage and hour violations.",
        links: [
          {
            text: "File a Wage Complaint",
            url: "https://www.dol.gov/agencies/whd/contact/complaints",
          },
        ],
      },
    ],
  },
];

export default function EmploymentRights() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(rightsData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(rightsData);
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const filtered = rightsData.filter(
      (category) =>
        category.title.toLowerCase().includes(normalizedQuery) ||
        category.description.toLowerCase().includes(normalizedQuery) ||
        category.content.some((item) =>
          item.text.toLowerCase().includes(normalizedQuery)
        )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Main Disclaimer */}
      <Alert variant="warning" className="border-amber-500 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-800">
          This app provides general legal and tax information for educational purposes only. 
          It is not intended to be legal or financial advice. Please consult a licensed attorney 
          or tax professional for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Employment Rights & Workplace Laws
          </CardTitle>
          <CardDescription>
            Learn about your workplace rights, laws, and how to report violations
          </CardDescription>
          {/* Legal Information Disclaimer */}
          <Alert className="mt-4 border-blue-500 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800 text-sm">
              The information provided here is for general guidance only. Laws and tax regulations 
              change frequently, and individual circumstances vary. Always check with a qualified 
              professional before making legal or financial decisions.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rights, laws, or reporting procedures..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-[#F4F1DE] border-wood/20"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredData.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.id === "employment-types" && (
                  <Shield className="h-5 w-5 text-primary" />
                )}
                {category.id === "workers-rights" && (
                  <Scale className="h-5 w-5 text-primary" />
                )}
                {category.id === "wage-laws" && (
                  <DollarSign className="h-5 w-5 text-primary" />
                )}
                {category.id === "reporting" && (
                  <AlertCircle className="h-5 w-5 text-primary" />
                )}
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.content.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      {item.text.split(":")[0]}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {item.text.split(":")[1] || item.text}
                        </p>
                        {item.links && (
                          <div className="space-y-2">
                            {item.links.map((link, linkIndex) => (
                              <Button
                                key={linkIndex}
                                variant="outline"
                                className="w-full justify-between"
                                onClick={() =>
                                  window.open(link.url, "_blank")
                                }
                              >
                                {link.text}
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {/* Additional Legal Notice */}
        <Alert className="border-gray-300 bg-gray-50">
          <AlertCircle className="h-4 w-4 text-gray-500" />
          <AlertDescription className="text-gray-700 text-sm">
            For interactive features and AI-powered assistance, please note that responses are based on 
            publicly available laws and regulations and should not be considered a substitute for 
            professional legal advice.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
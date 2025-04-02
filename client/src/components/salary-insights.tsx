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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, TrendingUp, DollarSign, Users, BadgePercent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalaryData {
  title?: string;
  averageSalary?: string;
  salaryRange?: {
    min: string;
    max: string;
  };
  growthRate?: string;
  demandLevel?: string;
  requiredSkills?: string[];
  marketOutlook?: string;
  industryTrends?: string[];
  
  // Adzuna API response format
  median?: number;
  range?: [number, number];
  growth?: number;
  stateData?: Record<string, {
    median: number;
    range: [number, number];
  }>;
  education?: string[];
  certifications?: string[];
}

export default function SalaryInsights() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const { toast } = useToast();

  const salaryMutation = useMutation({
    mutationFn: async () => {
      console.log("Fetching salary insights for:", jobTitle);
      
      const res = await apiRequest("POST", "/api/salary/insights", {
        jobTitle,
        location: location || "United States"
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch salary insights");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setSalaryData(data);
      toast({
        title: "Insights Retrieved",
        description: "Here are the salary insights and market trends.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Get Insights",
        description: error.message || "Failed to fetch salary insights. Please try again.",
      });
    },
  });

  const handleSearch = () => {
    if (!jobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title to search.",
      });
      return;
    }
    salaryMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Salary Insights & Growth Trends</CardTitle>
          <CardDescription>
            Explore salary ranges, growth potential, and market demand for various careers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Software Engineer, Chef, Marketing Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={salaryMutation.isPending}
            className="w-full"
          >
            {salaryMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get Salary Insights"
            )}
          </Button>
        </CardContent>
      </Card>

      {salaryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {jobTitle} Salary Insights
            </CardTitle>
            <CardDescription>
              Comprehensive salary and market analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Handle both API formats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 bg-primary/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Median Salary</h4>
                </div>
                <p className="text-2xl font-bold">
                  {salaryData.median 
                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salaryData.median)
                    : salaryData.averageSalary || 'Not available'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {salaryData.range ? 
                    `Range: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salaryData.range[0])} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salaryData.range[1])}` :
                    salaryData.salaryRange && salaryData.salaryRange.min && salaryData.salaryRange.max ? 
                      `Range: ${salaryData.salaryRange.min} - ${salaryData.salaryRange.max}` :
                      'Salary range not available'
                  }
                </p>
              </div>

              <div className="space-y-2 bg-primary/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Growth Rate</h4>
                </div>
                <p className="text-2xl font-bold">
                  {salaryData.growth 
                    ? `${salaryData.growth}%` 
                    : salaryData.growthRate || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Annual job growth</p>
              </div>

              <div className="space-y-2 bg-primary/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Location</h4>
                </div>
                <p className="text-2xl font-bold">{location || 'National'}</p>
                <p className="text-sm text-muted-foreground">Market comparison basis</p>
              </div>
            </div>

            {/* Education Requirements (from Adzuna API) */}
            {salaryData.education && salaryData.education.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  Recommended Education
                </h4>
                <div className="flex flex-wrap gap-2">
                  {salaryData.education.map((edu, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary-foreground px-2 py-1 rounded-full">
                      {edu}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications (from Adzuna API) */}
            {salaryData.certifications && salaryData.certifications.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  Valuable Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {salaryData.certifications.map((cert, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary-foreground px-2 py-1 rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Regional Data (from Adzuna API) */}
            {salaryData.stateData && Object.keys(salaryData.stateData).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  Regional Salary Comparison
                </h4>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {Object.entries(salaryData.stateData).slice(0, 6).map(([state, data]) => (
                    <div key={state} className="bg-muted/30 p-2 rounded text-xs">
                      <span className="font-medium">{state}</span>: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.median)}
                      <div className="text-muted-foreground text-xs">
                        Range: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.range[0])} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.range[1])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills (from legacy format) */}
            {salaryData.requiredSkills && salaryData.requiredSkills.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {salaryData.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Market Outlook (from legacy format) */}
            {salaryData.marketOutlook && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Market Outlook</h4>
                <p className="text-muted-foreground">{salaryData.marketOutlook}</p>
              </div>
            )}

            {/* Industry Trends (from legacy format) */}
            {salaryData.industryTrends && salaryData.industryTrends.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Industry Trends</h4>
                <ul className="space-y-2">
                  {salaryData.industryTrends.map((trend, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BadgePercent className="h-4 w-4 text-primary" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Data is based on industry averages and may vary based on specific employers and qualifications.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
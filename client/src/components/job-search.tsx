import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Loader2, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  BarChart4, 
  Network,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  Map,
  BookOpen,
  BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  postedDate: string;
}

// Default fallback salary data (only used if API call fails)
const defaultSalaryData = {
  median: 75000, 
  range: [50000, 120000] as [number, number],
  growth: 5.0,
  stateData: { "national": { median: 75000, range: [50000, 120000] as [number, number] } },
  education: ["Bachelor's degree (recommended)"],
  certifications: ["Industry-specific certifications may be required"]
};

// Format currency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  // Default selected sources (hidden from UI)
  const [selectedSources] = useState({
    indeed: true,
    adzuna: true,
  });
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [salaryData, setSalaryData] = useState<{
    median: number, 
    range: [number, number],
    growth?: number,
    stateData?: Record<string, {median: number, range: [number, number]}>,
    education?: string[],
    certifications?: string[]
  } | null>(null);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/jobs/search", {
        query: searchQuery,
        location,
        industry: industry || undefined, // Only include if it has a value
        sources: Object.entries(selectedSources)
          .filter(([_, enabled]) => enabled)
          .map(([source]) => source),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to search jobs");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setJobListings(data.jobs);
      toast({
        title: "Search Complete",
        description: `Found ${data.jobs.length} matching jobs`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Failed to search jobs. Please try again.",
      });
    },
  });

  // Salary data fetch mutation
  const salaryMutation = useMutation({
    mutationFn: async (jobTitle: string) => {
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
      console.log("Salary insights fetched successfully:", data);
      setSalaryData(data);
      
      toast({
        title: "Salary Insights Available",
        description: `Showing salary data for ${searchQuery}`,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to fetch salary insights:", error);
      // Fall back to default salary data
      setSalaryData(defaultSalaryData);
      
      toast({
        variant: "default",
        title: "Salary Insights Available",
        description: "Using estimated salary data for your search",
      });
    },
  });
  
  // Don't fetch salary data on mount - wait for user to search

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title or keywords to search.",
      });
      return;
    }
    
    // Fetch salary insights from API
    salaryMutation.mutate(searchQuery);
    
    // Perform job search
    searchMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" /> 
            Fundamenta Connects
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Discover career opportunities and salary insights tailored to your skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery" className="text-sm sm:text-base">Job Title or Keywords</Label>
            <Input
              id="searchQuery"
              placeholder="e.g. Software Engineer, Marketing Manager"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-wood/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-wood/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm sm:text-base">Industry (Optional)</Label>
            <Select
              value={industry}
              onValueChange={setIndustry}
            >
              <SelectTrigger id="industry" className="border-wood/20 text-sm sm:text-base">
                <SelectValue placeholder="Select an industry (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="marketing">Marketing & Media</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="nonprofit">Nonprofit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job sources selection removed as requested */}

          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            className="w-full bg-white border-2 border-primary text-primary hover:bg-primary/5 text-sm sm:text-base py-2 h-auto"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Network className="h-4 w-4 mr-2" /> Find Opportunities
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {jobListings.length > 0 && (
        <Card>
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Opportunities Found
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Discovered {jobListings.length} matching positions for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="p-3 sm:p-4 border border-primary/20 bg-white rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1 sm:gap-2">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{job.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {job.company}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {job.location}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-primary/30 text-primary hover:bg-primary/5 text-xs sm:text-sm py-1 h-auto self-start flex items-center gap-1"
                    onClick={() => window.open(job.url, "_blank")}
                  >
                    Connect <Network className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{job.description}</p>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <span>Posted: {job.postedDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Salary Insights Card - appears when search is performed and salary data is available */}
      {salaryData && (
        <Card>
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Salary Insights for {searchQuery}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Comprehensive compensation and market analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Median Salary
                </h4>
                <p className="text-xl font-bold">{formatCurrency(salaryData.median)}</p>
                <p className="text-xs text-muted-foreground">
                  Range: {formatCurrency(salaryData.range[0])} - {formatCurrency(salaryData.range[1])}
                </p>
              </div>

              <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Growth Rate
                </h4>
                <p className="text-xl font-bold">{salaryData.growth ? `${salaryData.growth}%` : 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Annual job growth</p>
              </div>

              <div className="space-y-1 bg-primary/5 p-3 rounded-lg">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-primary" />
                  Location Data
                </h4>
                <p className="text-xl font-bold">{location || 'National'}</p>
                <p className="text-xs text-muted-foreground">Market comparison basis</p>
              </div>
            </div>

            {salaryData.education && salaryData.education.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-primary" />
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

            {salaryData.certifications && salaryData.certifications.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
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

            {salaryData.stateData && Object.keys(salaryData.stateData).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <BarChart className="h-4 w-4 text-primary" />
                  Regional Salary Comparison
                </h4>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {Object.entries(salaryData.stateData).slice(0, 6).map(([state, data]) => (
                    <div key={state} className="bg-muted/30 p-2 rounded text-xs">
                      <span className="font-medium">{state}</span>: {formatCurrency(data.median)}
                      <div className="text-muted-foreground text-xs">
                        Range: {formatCurrency(data.range[0])} - {formatCurrency(data.range[1])}
                      </div>
                    </div>
                  ))}
                </div>
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
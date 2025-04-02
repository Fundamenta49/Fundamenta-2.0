import { useState, useRef } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  UploadCloud, 
  Download, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Lightbulb
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeResume, type ResumeAnalysis } from "@/lib/resume-analysis";

// Form validation schema
const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  resumeText: z.string().min(1, "Resume content is required")
});

type ResumeFormData = z.infer<typeof resumeSchema>;

// Styles for PDF generation
const styles = StyleSheet.create({
  page: { 
    flexDirection: "column", 
    backgroundColor: "#FFFFFF", 
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: { 
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10
  },
  title: { 
    fontSize: 24, 
    marginBottom: 5, 
    fontWeight: 'bold', 
    color: '#d1365a' // Changed from blue to rose primary color
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 10,
    marginRight: 15,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#d1365a', // Changed from blue to rose primary color
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#1F2937',
  },
});

const ResumePDF: React.FC<ResumeFormData> = ({
  name,
  email,
  phone,
  summary,
  education,
  experience,
  skills,
  resumeText
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{email}</Text>
          <Text style={styles.contactItem}>{phone}</Text>
        </View>
      </View>

      {summary && (
        <>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.sectionContent}>{summary}</Text>
        </>
      )}

      {experience && (
        <>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          <Text style={styles.sectionContent}>{experience}</Text>
        </>
      )}

      {education && (
        <>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.sectionContent}>{education}</Text>
        </>
      )}

      {skills && (
        <>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.sectionContent}>{skills}</Text>
        </>
      )}
      
      {/* Include the full text at the bottom if none of the above sections are filled */}
      {(!summary && !education && !experience && !skills) && (
        <Text style={styles.sectionContent}>{resumeText}</Text>
      )}
    </Page>
  </Document>
);

const FileUpload: React.FC<{
  onUpload: (text: string) => void;
  setUploadMessage: (message: string) => void;
  form: any;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}> = ({ onUpload, setUploadMessage, form, isUploading, setIsUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced text extraction from file with improved section detection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage("Processing resume...");
      
      // Use OpenAI to parse resume if available or fall back to manual parsing
      if (file.type === 'application/pdf') {
        try {
          // For PDF files, we'd ideally use server-side parsing
          // This is a placeholder for future implementation
          throw new Error("Direct PDF parsing not implemented - falling back to text extraction");
        } catch (pdfError) {
          console.log("PDF parsing fallback:", pdfError);
          // Continue with text-based parsing below
        }
      }
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          
          // Enhanced parser logic
          const lines = text.split('\n').filter(line => line.trim().length > 0);
          let name = "";
          let email = "";
          let phone = "";
          let summary = "";
          let education = "";
          let experience = "";
          let skills = "";
          
          // Try to detect structural patterns in the resume
          // Improved email detection with regex
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
          // Improved phone detection for various formats
          const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/;
          
          // First pass - identify email and phone
          for (const line of lines) {
            const trimmed = line.trim();
            
            // Look for email pattern with regex
            const emailMatch = trimmed.match(emailRegex);
            if (emailMatch && !email) {
              email = emailMatch[0];
            }
            
            // Look for phone pattern with enhanced regex
            const phoneMatch = trimmed.match(phoneRegex);
            if (phoneMatch && !phone) {
              phone = trimmed;
            }
          }
          
          // Second pass - try to find the name (typically at the beginning)
          // Assume the first line that's not contact info is likely the name
          for (let i = 0; i < Math.min(5, lines.length); i++) {
            const trimmed = lines[i].trim();
            if (trimmed && 
                !trimmed.match(emailRegex) && 
                !trimmed.match(phoneRegex) && 
                !trimmed.match(/^https?:\/\//) && // Not a URL
                trimmed.split(' ').length <= 5 && // Likely a name (not too many words)
                !name) {
              name = trimmed;
              break;
            }
          }
          
          // Third pass - identify sections
          const sectionIndexes = [];
          const sectionNames = [];
          
          // Common section titles in resumes
          const sectionKeywords = {
            summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
            education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
            experience: ['experience', 'employment', 'work history', 'job history', 'professional experience'],
            skills: ['skills', 'expertise', 'technologies', 'technical skills', 'competencies', 'qualifications']
          };
          
          // Find section headings
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            
            // Check if this line looks like a section heading
            let sectionType = null;
            for (const [type, keywords] of Object.entries(sectionKeywords)) {
              if (keywords.some(keyword => line.includes(keyword))) {
                sectionType = type;
                break;
              }
            }
            
            if (sectionType) {
              sectionIndexes.push(i);
              sectionNames.push(sectionType);
            }
          }
          
          // Extract section content based on identified sections
          for (let i = 0; i < sectionIndexes.length; i++) {
            const sectionStart = sectionIndexes[i] + 1; // Start after the heading
            const sectionEnd = i < sectionIndexes.length - 1 ? sectionIndexes[i + 1] : lines.length;
            const sectionContent = lines.slice(sectionStart, sectionEnd).join('\n');
            
            switch (sectionNames[i]) {
              case 'summary':
                summary = sectionContent;
                break;
              case 'education':
                education = sectionContent;
                break;
              case 'experience':
                experience = sectionContent;
                break;
              case 'skills':
                skills = sectionContent;
                break;
            }
          }
          
          // If we couldn't detect sections, use a fallback method for important sections
          if (!summary && !education && !experience && !skills) {
            // Fallback: Try to find chunks that might be sections
            const fullText = lines.join('\n').toLowerCase();
            
            // Simplified fallback approach
            for (const [sectionType, keywords] of Object.entries(sectionKeywords)) {
              for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
                  const keywordIndex = fullText.indexOf(keyword);
                  const sectionStart = fullText.indexOf('\n', keywordIndex) + 1;
                  
                  // Find the end of this section (next keyword or end of text)
                  let sectionEnd = fullText.length;
                  for (const otherKeyword of Object.values(sectionKeywords).flat()) {
                    if (otherKeyword !== keyword) {
                      const nextKeywordIndex = fullText.indexOf(otherKeyword, sectionStart);
                      if (nextKeywordIndex > sectionStart && nextKeywordIndex < sectionEnd) {
                        sectionEnd = nextKeywordIndex;
                      }
                    }
                  }
                  
                  const content = fullText.substring(sectionStart, sectionEnd).trim();
                  
                  switch (sectionType) {
                    case 'summary':
                      if (!summary) summary = content;
                      break;
                    case 'education':
                      if (!education) education = content;
                      break;
                    case 'experience':
                      if (!experience) experience = content;
                      break;
                    case 'skills':
                      if (!skills) skills = content;
                      break;
                  }
                  
                  break; // Found the section, move to next type
                }
              }
            }
          }
          
          // Clean up and format the extracted content
          const cleanText = (txt: string) => {
            return txt.split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .join('\n');
          };
          
          // Update form with the parsed data
          if (name) form.setValue("name", name);
          if (email) form.setValue("email", email);
          if (phone) form.setValue("phone", phone);
          if (summary) form.setValue("summary", cleanText(summary));
          if (education) form.setValue("education", cleanText(education));
          if (experience) form.setValue("experience", cleanText(experience));
          if (skills) form.setValue("skills", cleanText(skills));
          
          // Always set the complete resume text
          form.setValue("resumeText", text);
          
          setUploadMessage(`Successfully parsed: ${file.name}`);
        } catch (parseError) {
          console.error("Error parsing resume:", parseError);
          // Even if parsing fails, still set the raw text
          form.setValue("resumeText", event.target?.result as string || "");
          setUploadMessage(`Partial parsing: ${file.name} (some details may be missing)`);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setUploadMessage(`Error reading file`);
        setIsUploading(false);
      };
      
      // Read the file as text
      reader.readAsText(file);
      
    } catch (error) {
      console.error("Resume upload error:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to upload resume'}`);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-3 sm:p-6 border-2 border-dashed rounded-lg border-rose-100 hover:border-primary/40 transition-colors bg-white">
        <div className="mb-3 sm:mb-4 bg-rose-50 p-2 sm:p-3 rounded-full">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center">Upload your resume</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center max-w-xs">
          Upload your existing resume and we'll extract the important information automatically
        </p>
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white border-primary/30 text-primary hover:bg-primary/5 text-xs sm:text-sm py-1 sm:py-2 h-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          type="button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UploadCloud className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Select File
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.doc,.docx,.pdf,.rtf"
          onChange={handleFileUpload}
          onClick={(e) => e.stopPropagation()}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
          Supports .txt, .doc, .docx, .pdf files
        </p>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      summary: "",
      education: "",
      experience: "",
      skills: "",
      resumeText: ""
    }
  });

  const hasContent = form.watch("resumeText") !== "";
  
  const handleAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      const resumeText = form.getValues("resumeText");
      if (!resumeText) {
        setAnalysisError("Please upload or enter resume content first");
        return;
      }
      
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      
      // Update form with AI analysis results
      if (result.name) form.setValue("name", result.name);
      if (result.email) form.setValue("email", result.email);
      if (result.phone) form.setValue("phone", result.phone);
      if (result.summary) form.setValue("summary", result.summary);
      if (result.education) form.setValue("education", result.education);
      if (result.experience) form.setValue("experience", result.experience);
      if (result.skills) form.setValue("skills", result.skills);
      
    } catch (error) {
      console.error("AI analysis error:", error);
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
      <Card className="shadow-sm bg-white w-full max-w-full overflow-hidden border-t-4 border-t-rose-500">
        {/* Removed redundant header that was showing up twice */}
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              <TabsTrigger value="upload" className="px-2 py-1 sm:px-4 sm:py-2">Upload Resume</TabsTrigger>
              <TabsTrigger value="manual" className="px-2 py-1 sm:px-4 sm:py-2">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-0">
              <FileUpload 
                onUpload={(text) => form.setValue("resumeText", text)}
                setUploadMessage={setUploadMessage}
                form={form}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
              
              {uploadMessage && (
                <div className={cn(
                  "flex items-center gap-2 mt-4 p-3 rounded-md text-sm",
                  uploadMessage.includes('Successfully') 
                    ? "bg-green-50/70 text-green-600 border border-green-100" 
                    : "bg-red-50/70 text-red-600 border border-red-100"
                )}>
                  {uploadMessage.includes('Successfully') ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{uploadMessage}</span>
                </div>
              )}
              
              {hasContent && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Review & Edit</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white border-primary/30 text-primary hover:bg-primary/5"
                        onClick={handleAIAnalysis}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="mr-1 h-3 w-3" />
                            AI Analysis
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white border-primary/30 text-primary hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("manual");
                        }}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                  
                  {analysisError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{analysisError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Name</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("name") || "Not detected"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("email") || "Not detected"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("phone") || "Not detected"}</div>
                    </div>
                  </div>
                  
                  {analysis && (
                    <div className="mt-6 border border-primary/20 rounded-md p-4 bg-primary/5">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        AI Resume Analysis
                      </h3>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium flex items-center gap-1 text-green-600 mb-1">
                            <ThumbsUp className="h-3 w-3" /> Strengths
                          </h4>
                          <ul className="list-disc list-inside space-y-1 pl-1">
                            {analysis.analysis.strengths.map((strength, i) => (
                              <li key={`strength-${i}`} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium flex items-center gap-1 text-amber-600 mb-1">
                            <ThumbsDown className="h-3 w-3" /> Areas for Improvement
                          </h4>
                          <ul className="list-disc list-inside space-y-1 pl-1">
                            {analysis.analysis.weaknesses.map((weakness, i) => (
                              <li key={`weakness-${i}`} className="text-gray-700">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium flex items-center gap-1 text-primary mb-1">
                            <Lightbulb className="h-3 w-3" /> Suggestions
                          </h4>
                          <ul className="list-disc list-inside space-y-1 pl-1">
                            {analysis.analysis.suggestions.map((suggestion, i) => (
                              <li key={`suggestion-${i}`} className="text-gray-700">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="manual" className="mt-0">
              <Form {...form}>
                <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2 sm:left-3 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2 sm:left-3 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-10" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-2 sm:left-3 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief summary of your professional background and key strengths..."
                            className="min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Work Experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your work history and job responsibilities..."
                              className="min-h-[80px] sm:min-h-[120px] text-xs sm:text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Education</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your educational background..."
                              className="min-h-[80px] sm:min-h-[120px] text-xs sm:text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your key skills and competencies..."
                            className="min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="resumeText"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t border-rose-50 p-3 sm:p-6">
          {hasContent && (
            <PDFDownloadLink
              document={
                <ResumePDF 
                  name={form.watch("name")}
                  email={form.watch("email")}
                  phone={form.watch("phone")}
                  summary={form.watch("summary")}
                  education={form.watch("education")}
                  experience={form.watch("experience")}
                  skills={form.watch("skills")}
                  resumeText={form.watch("resumeText")}
                />
              }
              fileName="professional_resume.pdf"
              className="block w-full md:w-auto"
            >
              {({ loading, error }) => (
                <Button 
                  type="button"
                  size="default"
                  className="w-full md:w-auto bg-white border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm py-1.5 sm:py-2 h-auto" 
                  disabled={loading || !form.formState.isValid || isUploading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="sm:inline">Generating PDF...</span>
                      <span className="inline sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sm:inline">Download Resume PDF</span>
                      <span className="inline sm:hidden">Download PDF</span>
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
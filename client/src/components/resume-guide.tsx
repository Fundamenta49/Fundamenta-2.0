import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  Lightbulb,
  List,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeGuideProps {
  className?: string;
}

export function ResumeGuide({ className }: ResumeGuideProps) {
  const [showMoreExamples, setShowMoreExamples] = useState<Record<string, boolean>>({});
  
  const toggleMoreExamples = (section: string) => {
    setShowMoreExamples(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className={cn("shadow-sm border-t-4 border-t-blue-500", className)}>
      <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Resume Guide
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
            Learning Resource
          </Badge>
        </div>
        <CardDescription>
          Learn how to create an effective resume that stands out to employers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 py-0 pb-3 sm:pb-4">
        <div className="text-sm text-muted-foreground mb-4">
          A resume is a key marketing tool for your job search. It should concisely summarize your skills, 
          experience, and qualifications in a way that demonstrates your value to potential employers.
        </div>
        
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="resume-purpose">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                What Makes a Great Resume
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 pb-4 pt-1">
              <p className="mb-3">
                A great resume is more than just a list of jobs – it's a targeted marketing document that presents your
                most relevant qualifications for a specific position.
              </p>
              
              <h4 className="font-medium text-blue-600 mt-4 mb-2">Key Principles:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Relevance:</strong> Tailor your resume to each job application</li>
                <li><strong>Clarity:</strong> Use clean formatting and concise language</li>
                <li><strong>Impact:</strong> Highlight accomplishments with measurable results</li>
                <li><strong>Honesty:</strong> Be truthful while presenting yourself in the best light</li>
                <li><strong>Professional:</strong> Avoid errors and maintain consistent styling</li>
              </ul>
              
              <h4 className="font-medium text-blue-600 mt-4 mb-2">Avoid These Common Mistakes:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Generic content not tailored to the specific job</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Typos, grammatical errors or inconsistent formatting</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Including irrelevant personal information or outdated experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Simple job descriptions instead of accomplishment statements</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Too lengthy – most recruiters only spend 7-10 seconds on initial review</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sections">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Essential Resume Sections
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 pb-4 pt-1">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <div className="bg-blue-100 p-1 rounded-md">
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    Contact Information
                  </h4>
                  <p className="mb-1.5">Include your name, phone number, email, and LinkedIn profile (optional).</p>
                  <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5">
                    David Johnson<br />
                    (555) 123-4567<br />
                    david.johnson@example.com<br />
                    linkedin.com/in/davidjohnson
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use a professional email address and ensure all contact information is current</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <div className="bg-blue-100 p-1 rounded-md">
                      <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    Professional Summary
                  </h4>
                  <p className="mb-1.5">A brief 2-3 sentence overview of your key qualifications and career goals.</p>
                  <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5">
                    <strong>GOOD EXAMPLE:</strong> "Senior Frontend Developer with 5+ years of experience building responsive web applications with React and TypeScript. Proven track record of improving user engagement by 40% and reducing load times by 60% through optimized code and innovative UI solutions."
                  </div>
                  
                  {showMoreExamples['summary'] ? (
                    <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5 mt-2">
                      <strong>POOR EXAMPLE:</strong> "Looking for a job in web development where I can use my skills. I know HTML, CSS and JavaScript and have worked on many websites."
                      <div className="mt-1.5 text-red-500">
                        ↳ Too generic and doesn't highlight specific achievements or value
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 text-xs h-7 text-blue-500"
                      onClick={() => toggleMoreExamples('summary')}
                    >
                      Show Example of Poor Summary
                    </Button>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <div className="bg-blue-100 p-1 rounded-md">
                      <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    Work Experience
                  </h4>
                  <p className="mb-1.5">List your relevant jobs in reverse chronological order with accomplishments.</p>
                  <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5">
                    <strong>GOOD EXAMPLE:</strong><br />
                    <span className="font-semibold">Frontend Developer | Acme Web Solutions | 2020-Present</span>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>Developed responsive e-commerce platform that increased mobile conversions by 35%</li>
                      <li>Reduced page load time by 60% through code optimization and lazy loading</li>
                      <li>Led migration from legacy codebase to React, improving development velocity by 40%</li>
                    </ul>
                  </div>
                  
                  {showMoreExamples['experience'] ? (
                    <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5 mt-2">
                      <strong>POOR EXAMPLE:</strong><br />
                      <span className="font-semibold">Web Developer | ABC Company | 2020-2023</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Responsible for website development</li>
                        <li>Worked with HTML, CSS and JavaScript</li>
                        <li>Fixed bugs and added features</li>
                      </ul>
                      <div className="mt-1.5 text-red-500">
                        ↳ Too vague, describes job duties without specific accomplishments or metrics
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 text-xs h-7 text-blue-500"
                      onClick={() => toggleMoreExamples('experience')}
                    >
                      Show Example of Poor Experience Entry
                    </Button>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <div className="bg-blue-100 p-1 rounded-md">
                      <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    Education
                  </h4>
                  <p className="mb-1.5">Your academic background, including degrees, institutions, and graduation dates.</p>
                  <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5">
                    <strong>Bachelor of Science in Computer Science</strong><br />
                    University of Technology | Graduated: May 2019<br />
                    <span className="text-slate-600">GPA: 3.8/4.0 | Relevant Coursework: Web Development, Data Structures, UX Design</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-600 mb-1.5 flex items-center gap-1.5">
                    <div className="bg-blue-100 p-1 rounded-md">
                      <List className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    Skills
                  </h4>
                  <p className="mb-1.5">A concise list of your technical, professional, and soft skills.</p>
                  <div className="bg-slate-50 p-2.5 rounded-md border text-xs font-medium mb-1.5">
                    <strong>Technical Skills:</strong> React, JavaScript (ES6+), TypeScript, HTML5/CSS3, Git, REST APIs, GraphQL<br />
                    <strong>Tools:</strong> Webpack, Jest, React Testing Library, Figma, JIRA<br />
                    <strong>Soft Skills:</strong> Project management, Team leadership, Problem-solving, Communication
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Prioritize skills mentioned in the job description that you actually possess</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="accomplishments">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                Writing Effective Accomplishments
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 pb-4 pt-1">
              <p className="mb-3">
                The most impactful resumes focus on accomplishments rather than just listing responsibilities.
                Use the <strong>PAR method</strong> to structure your bullet points:
              </p>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-3">
                <h4 className="font-medium text-blue-600 mb-1">The PAR Method:</h4>
                <ul className="list-none space-y-1.5">
                  <li><strong className="text-blue-700">P</strong>roblem: What challenge did you face?</li>
                  <li><strong className="text-blue-700">A</strong>ction: What steps did you take?</li>
                  <li><strong className="text-blue-700">R</strong>esult: What was the outcome? (Quantify when possible)</li>
                </ul>
              </div>
              
              <h4 className="font-medium text-blue-600 mt-4 mb-2">Examples:</h4>
              
              <div className="bg-white rounded-md border p-3 mb-2.5">
                <p className="font-medium text-green-600 mb-1 flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  Strong Accomplishment
                </p>
                <p className="text-sm">
                  "Redesigned checkout process, reducing cart abandonment by 25% and increasing annual revenue by $300K"
                </p>
                <div className="mt-2 text-xs text-slate-600">
                  <div><strong>Problem:</strong> High cart abandonment rate</div>
                  <div><strong>Action:</strong> Redesigned checkout process</div>
                  <div><strong>Result:</strong> 25% reduction in abandonment, $300K revenue increase</div>
                </div>
              </div>
              
              <div className="bg-white rounded-md border p-3">
                <p className="font-medium text-red-600 mb-1 flex items-center">
                  <XCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  Weak Statement
                </p>
                <p className="text-sm">
                  "Responsible for managing the website checkout process"
                </p>
                <div className="mt-2 text-xs text-slate-600">
                  <div>This only describes a responsibility, not an accomplishment with measurable impact</div>
                </div>
              </div>
              
              <h4 className="font-medium text-blue-600 mt-4 mb-2">Tips for Quantifying Results:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Use percentages, dollar amounts, or other metrics when possible</li>
                <li>Include time frames to provide context (e.g., "per month," "within 6 months")</li>
                <li>If exact numbers aren't available, use reasonable estimates with "approximately"</li>
                <li>Focus on outcomes most relevant to the job you're applying for</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ats">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                ATS Optimization Tips
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm px-4 pb-4 pt-1">
              <p className="mb-3">
                Most companies use Applicant Tracking Systems (ATS) to screen resumes before they reach human recruiters.
                Here's how to optimize your resume for ATS:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Use standard section headings</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      "Work Experience," "Education," and "Skills" are better than creative alternatives like "Where I've Made an Impact"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Include keywords from the job description</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Incorporate relevant skills and qualifications mentioned in the job posting
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Use a clean, simple format</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Avoid tables, headers/footers, images, and complex formatting that ATS may not parse correctly
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Save in the right format</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Unless otherwise specified, submit as a .docx or .pdf file (our builder exports ATS-friendly PDFs)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Spell out acronyms at least once</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Example: "Search Engine Optimization (SEO)" before using just "SEO" throughout
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mt-4">
                <h4 className="font-medium text-amber-700 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Pro Tip
                </h4>
                <p className="text-sm text-amber-800">
                  Use our "Job Targeting" feature to analyze your target job description and get AI-powered suggestions to optimize your resume for specific ATS keywords.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex-col items-start">
        <div className="text-xs text-slate-500 mb-2">
          Remember that different industries have varying resume standards. Research examples in your specific field.
        </div>
        <div className="space-x-2">
          <Button variant="default" size="sm" className="h-8">
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            View Resume Templates
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Resume Checklist
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
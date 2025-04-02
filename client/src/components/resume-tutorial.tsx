import React, { useState } from 'react';
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
  ArrowLeft,
  ArrowRight,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  List,
  User,
  Mail,
  Phone,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeTutorialProps {
  className?: string;
  onFinish?: () => void;
}

export function ResumeTutorial({ className, onFinish }: ResumeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: 'Understanding the Purpose of a Resume',
      description: 'A resume is a marketing document that summarizes your skills, experience, and qualifications for a specific job.',
      content: (
        <div className="space-y-3">
          <p>Think of your resume as your personal marketing document. It's often the first impression a potential employer will have of you, typically reviewed for only <strong>7-10 seconds</strong> before deciding whether to consider you further.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-3">
            <h4 className="font-medium text-blue-700 mb-1">Your resume should:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Clearly communicate your value to employers</li>
              <li>Highlight your most relevant qualifications for the specific job</li>
              <li>Demonstrate the impact you've made in previous roles</li>
              <li>Be concise, well-organized, and error-free</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mt-3">
            <h4 className="font-medium text-amber-700 mb-1">Remember:</h4>
            <p className="text-sm">Every resume should be tailored to the specific job you're applying for. One generic resume for all applications is rarely effective.</p>
          </div>
        </div>
      ),
      icon: FileText
    },
    {
      title: 'Contact Information Section',
      description: 'Make it easy for employers to reach you with professional contact details.',
      content: (
        <div className="space-y-3">
          <p>Your contact information should appear at the top of your resume and include:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="flex items-start gap-2 bg-white border rounded-md p-3">
              <User className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Full Name</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Should be prominent, typically in a larger font (14-16pt)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-white border rounded-md p-3">
              <Phone className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Phone Number</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Use a number you reliably answer and check voicemail regularly
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-white border rounded-md p-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Professional Email</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Use a professional email like firstname.lastname@example.com
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-white border rounded-md p-3">
              <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Location (optional)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  City and state is sufficient; full address is not necessary
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-md p-3 mt-2">
            <h4 className="font-medium text-sm mb-1">Example:</h4>
            <div className="text-sm border-l-4 border-blue-300 pl-3 py-1">
              <div className="font-bold text-base">David Johnson</div>
              <div>(555) 123-4567 • david.johnson@example.com</div>
              <div>Chicago, IL • linkedin.com/in/davidjohnson</div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2.5 mt-2">
            <h4 className="font-medium text-amber-700 text-sm mb-0.5">Pro Tips:</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-amber-800">
              <li>Make sure there are no typos in your contact information</li>
              <li>Don't include personal information like age, marital status, or photo</li>
              <li>Consider adding your LinkedIn profile if it's well-maintained</li>
              <li>Make your name stand out with larger font or bold formatting</li>
            </ul>
          </div>
        </div>
      ),
      icon: User
    },
    {
      title: 'Professional Summary',
      description: 'A brief, powerful overview of your qualifications and career goals.',
      content: (
        <div className="space-y-3">
          <p>Your professional summary (sometimes called a profile or summary statement) is a 2-4 sentence paragraph that gives recruiters a quick overview of your key qualifications and career trajectory.</p>
          
          <div className="bg-white border rounded-md p-3 mt-2">
            <h4 className="font-medium text-sm mb-1">Example:</h4>
            <div className="text-sm border-l-4 border-green-300 pl-3 py-1">
              <p>
                <strong>Strong Summary:</strong> "Senior Frontend Developer with 5+ years of experience building responsive web applications with React and TypeScript. Proven track record of improving user engagement by 40% and reducing load times by 60% through optimized code and innovative UI solutions. Passionate about creating intuitive user experiences and mentoring junior developers."
              </p>
            </div>
            
            <div className="text-sm border-l-4 border-red-300 pl-3 py-1 mt-3">
              <p>
                <strong>Weak Summary:</strong> "Looking for a job in web development where I can use my skills. I am hardworking and have experience with many different websites."
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
            <h4 className="font-medium text-blue-700 mb-1">Your summary should include:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5">
              <li><strong>Your professional identity</strong> (job title, years of experience)</li>
              <li><strong>Key skills/expertise</strong> relevant to the targeted position</li>
              <li><strong>Notable achievements</strong> with measurable results when possible</li>
              <li><strong>What you can offer</strong> to the potential employer</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2.5 mt-2">
            <h4 className="font-medium text-amber-700 text-sm mb-0.5">Pro Tips:</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-amber-800">
              <li>Tailor your summary to each job application, highlighting relevant skills</li>
              <li>Use strong action verbs and industry keywords</li>
              <li>Avoid first-person pronouns (I, me, my)</li>
              <li>Keep it concise - aim for 3-4 impactful sentences</li>
              <li>Place this near the top of your resume, just under contact information</li>
            </ul>
          </div>
        </div>
      ),
      icon: FileText
    },
    {
      title: 'Work Experience Section',
      description: 'Showcase your professional history with a focus on achievements.',
      content: (
        <div className="space-y-3">
          <p>The work experience section is typically the most important part of your resume. List your relevant jobs in reverse chronological order (most recent first) with a focus on accomplishments rather than duties.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
            <h4 className="font-medium text-blue-700 mb-1">For each position, include:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5">
              <li><strong>Job title</strong> and company name</li>
              <li><strong>Employment dates</strong> (month and year)</li>
              <li><strong>Location</strong> (city and state)</li>
              <li><strong>3-5 bullet points</strong> highlighting key accomplishments</li>
            </ul>
          </div>
          
          <div className="bg-white border rounded-md p-3 mt-3">
            <h4 className="font-medium text-sm mb-1">Example:</h4>
            <div className="text-sm border-l-4 border-blue-300 pl-3 py-2">
              <div className="font-bold">Frontend Developer</div>
              <div className="text-slate-600">Acme Web Solutions, Chicago, IL | May 2019 - Present</div>
              <ul className="list-disc pl-4 mt-1.5 space-y-1">
                <li>Developed responsive e-commerce platform that increased mobile conversions by 35%</li>
                <li>Reduced page load time by 60% through code optimization and lazy loading</li>
                <li>Led migration from legacy codebase to React, improving development velocity by 40%</li>
                <li>Mentored 3 junior developers who were successfully promoted within a year</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2.5 mt-3">
            <h4 className="font-medium text-amber-700 text-sm mb-0.5">Writing Effective Bullet Points:</h4>
            <p className="text-xs mb-1.5">Use the PAR method for powerful bullet points:</p>
            <ul className="list-none text-xs space-y-1 text-amber-800">
              <li><strong>P</strong>roblem/Project: What challenge did you face or what was assigned?</li>
              <li><strong>A</strong>ction: What specific steps did you take?</li>
              <li><strong>R</strong>esult: What was the outcome? (Quantify when possible)</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-md p-2.5 mt-2">
            <h4 className="font-medium text-green-700 text-sm mb-0.5">Strong Action Verbs to Use:</h4>
            <div className="text-xs text-green-800 flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <span>• Led</span>
              <span>• Developed</span>
              <span>• Implemented</span>
              <span>• Managed</span>
              <span>• Created</span>
              <span>• Optimized</span>
              <span>• Increased</span>
              <span>• Reduced</span>
              <span>• Improved</span>
              <span>• Analyzed</span>
              <span>• Designed</span>
              <span>• Coordinated</span>
            </div>
          </div>
        </div>
      ),
      icon: Briefcase
    },
    {
      title: 'Education Section',
      description: 'Highlight your academic background and relevant coursework.',
      content: (
        <div className="space-y-3">
          <p>The education section should list your academic credentials in reverse chronological order, with your highest or most recent degree first.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
            <h4 className="font-medium text-blue-700 mb-1">For each degree, include:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5">
              <li><strong>Degree name</strong> (e.g., Bachelor of Science in Computer Science)</li>
              <li><strong>Institution name</strong> and location</li>
              <li><strong>Graduation date</strong> (or expected graduation date)</li>
              <li><strong>GPA</strong> (if 3.0 or higher)</li>
              <li><strong>Relevant coursework</strong> (optional, especially useful for recent graduates)</li>
              <li><strong>Academic honors or awards</strong> (optional)</li>
            </ul>
          </div>
          
          <div className="bg-white border rounded-md p-3 mt-3">
            <h4 className="font-medium text-sm mb-1">Example:</h4>
            <div className="text-sm border-l-4 border-blue-300 pl-3 py-2">
              <div className="font-bold">Bachelor of Science in Computer Science</div>
              <div className="text-slate-600">University of Technology, Chicago, IL | May 2019</div>
              <div className="mt-1">GPA: 3.8/4.0</div>
              <div className="mt-1"><strong>Relevant Coursework:</strong> Web Development, Data Structures & Algorithms, User Experience Design, Database Systems</div>
              <div className="mt-1"><strong>Honors:</strong> Dean's List (4 semesters), Outstanding Student Award (2018)</div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2.5 mt-3">
            <h4 className="font-medium text-amber-700 text-sm mb-0.5">Pro Tips:</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-amber-800">
              <li>For experienced professionals, keep education brief and place it after work experience</li>
              <li>Recent graduates can place education before work experience and include more details</li>
              <li>Include certifications, continuing education, or professional development</li>
              <li>If you didn't complete a degree, you can list coursework completed with dates attended</li>
              <li>High school education is typically only included if you have no college experience</li>
            </ul>
          </div>
        </div>
      ),
      icon: GraduationCap
    },
    {
      title: 'Skills Section',
      description: 'Showcase your technical and professional abilities.',
      content: (
        <div className="space-y-3">
          <p>The skills section provides a concise overview of your technical, professional, and soft skills relevant to the position you're applying for.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
            <h4 className="font-medium text-blue-700 mb-1">Common types of skills to include:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5">
              <li><strong>Technical skills:</strong> Software, programming languages, tools</li>
              <li><strong>Industry-specific skills:</strong> Specialized knowledge for your field</li>
              <li><strong>Transferable skills:</strong> Abilities useful across different roles</li>
              <li><strong>Soft skills:</strong> Communication, leadership, problem-solving</li>
              <li><strong>Certifications:</strong> Professional qualifications and licenses</li>
            </ul>
          </div>
          
          <div className="bg-white border rounded-md p-3 mt-3">
            <h4 className="font-medium text-sm mb-1">Example:</h4>
            <div className="text-sm border-l-4 border-blue-300 pl-3 py-2">
              <div className="font-bold">Skills</div>
              <div className="mt-1"><strong>Programming:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3, React, Redux, Node.js</div>
              <div className="mt-1"><strong>Tools & Technologies:</strong> Git, Webpack, Jest, React Testing Library, AWS, Docker</div>
              <div className="mt-1"><strong>Design:</strong> Figma, Adobe XD, Responsive Design, Accessibility Standards</div>
              <div className="mt-1"><strong>Soft Skills:</strong> Problem-solving, Team Leadership, Agile Methodology, Technical Writing</div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2.5 mt-3">
            <h4 className="font-medium text-amber-700 text-sm mb-0.5">Pro Tips:</h4>
            <ul className="list-disc pl-4 text-xs space-y-1 text-amber-800">
              <li>Match skills to those mentioned in the job description (that you actually possess)</li>
              <li>Organize skills into categories for better readability</li>
              <li>Consider using skill level indicators for technical skills (e.g., proficient, advanced)</li>
              <li>Prioritize hard/technical skills over soft skills</li>
              <li>Update your skills section regularly as you learn new technologies</li>
              <li>Only include skills you're comfortable being asked about in an interview</li>
            </ul>
          </div>
        </div>
      ),
      icon: List
    },
    {
      title: 'Finishing Touches & ATS Optimization',
      description: 'Final steps to make your resume polished and ATS-friendly.',
      content: (
        <div className="space-y-3">
          <p>Before submitting your resume, take time to refine it and optimize for Applicant Tracking Systems (ATS) that most employers use to screen candidates.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
            <h4 className="font-medium text-blue-700 mb-1">Final Checklist:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5">
              <li>Proofread thoroughly for spelling and grammar errors</li>
              <li>Ensure consistent formatting (fonts, spacing, bullet styles)</li>
              <li>Verify that all information is accurate and up-to-date</li>
              <li>Check that your resume fits on 1-2 pages maximum</li>
              <li>Save your resume as a PDF with a professional filename (FirstName_LastName_Resume.pdf)</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mt-3">
            <h4 className="font-medium text-amber-700 mb-1">ATS Optimization Tips:</h4>
            <ul className="list-disc pl-4 text-sm space-y-1.5 text-amber-800">
              <li>Use standard section headings (Work Experience, Education, Skills)</li>
              <li>Incorporate keywords from the job description naturally</li>
              <li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
              <li>Avoid tables, text boxes, headers, footers, and columns</li>
              <li>Don't put important information in headers or footers</li>
              <li>Use standard bullet points (•) rather than custom symbols</li>
              <li>Spell out acronyms at least once (e.g., "Search Engine Optimization (SEO)")</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-3">
            <h4 className="font-medium text-green-700 mb-1">Job Targeting Strategy:</h4>
            <p className="text-sm mb-1.5">The most effective resumes are tailored to each position:</p>
            <ul className="list-disc pl-4 text-sm space-y-1 text-green-800">
              <li>Analyze the job description for key skills and requirements</li>
              <li>Customize your professional summary for the specific role</li>
              <li>Prioritize work experience and achievements most relevant to the position</li>
              <li>Adjust your skills section to highlight matching qualifications</li>
              <li>Use the job posting's exact phrasing for key skills when appropriate</li>
            </ul>
          </div>
          
          <div className="flex items-start mt-4">
            <Award className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              <strong className="text-amber-700">Remember:</strong> Our Resume Builder tool makes it easy to customize your resume for different jobs, export in ATS-friendly formats, and save multiple versions!
            </p>
          </div>
        </div>
      ),
      icon: Award
    }
  ];
  
  const currentStepData = tutorialSteps[currentStep];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onFinish) {
      onFinish();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className={cn("shadow-sm border-t-4 border-t-blue-500", className)}>
      <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Resume Tutorial
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
            Step {currentStep + 1} of {tutorialSteps.length}
          </Badge>
        </div>
        <CardDescription>
          {currentStepData.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 py-0 pb-3 sm:pb-4">
        <div className="mb-4 overflow-hidden rounded-lg border">
          <div className="bg-blue-50 px-4 py-2.5 border-b flex items-center gap-2">
            <currentStepData.icon className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">{currentStepData.title}</h3>
          </div>
          <div className="p-4 bg-white text-sm">
            {currentStepData.content}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tutorialSteps.map((step, index) => (
            <Badge 
              key={index}
              variant={index === currentStep ? "default" : "outline"}
              className={index === currentStep 
                ? "bg-blue-500" 
                : "cursor-pointer hover:bg-blue-50"
              }
              onClick={() => setCurrentStep(index)}
            >
              <step.icon className="h-3 w-3 mr-1" />
              Step {index + 1}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 0}
          className="text-sm"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          className="text-sm"
        >
          {currentStep === tutorialSteps.length - 1 ? (
            onFinish ? "Finish Tutorial" : "Complete"
          ) : (
            <>
              Next
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
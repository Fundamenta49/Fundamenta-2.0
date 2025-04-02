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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ListChecks,
  ArrowRight,
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeChecklistProps {
  className?: string;
  onClose?: () => void;
}

export function ResumeChecklist({ className, onClose }: ResumeChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'format': true,
    'content': true,
    'language': true,
    'final': true
  });
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistCategories = [
    {
      id: 'format',
      title: 'Format & Structure',
      items: [
        { id: 'format-1', label: 'Resume fits on one page (or two for very experienced candidates)' },
        { id: 'format-2', label: 'Font is professional and consistent (Arial, Calibri, Times New Roman, etc.)' },
        { id: 'format-3', label: 'Font size is between 10-12pt with headings slightly larger' },
        { id: 'format-4', label: 'Margins are even and at least 0.5" on all sides' },
        { id: 'format-5', label: 'Sections have clear headings and are visually separated' },
        { id: 'format-6', label: 'Format is consistent (same bullet style, spacing, alignment throughout)' },
        { id: 'format-7', label: 'PDF format preserves formatting across devices' }
      ]
    },
    {
      id: 'content',
      title: 'Content & Sections',
      items: [
        { id: 'content-1', label: 'Contact information is complete and professional' },
        { id: 'content-2', label: 'Professional summary highlights key qualifications' },
        { id: 'content-3', label: 'Work experience is in reverse chronological order' },
        { id: 'content-4', label: 'Experience bullet points focus on accomplishments, not just duties' },
        { id: 'content-5', label: 'Quantifiable results are included where possible (%, $, etc.)' },
        { id: 'content-6', label: 'Skills section includes relevant technical and soft skills' },
        { id: 'content-7', label: 'Education section includes degree, institution, and graduation date' },
        { id: 'content-8', label: 'Optional sections (projects, certifications) add relevant value' }
      ]
    },
    {
      id: 'language',
      title: 'Language & Keyword Optimization',
      items: [
        { id: 'language-1', label: 'Action verbs start each bullet point (Led, Developed, Created, etc.)' },
        { id: 'language-2', label: 'No spelling or grammatical errors' },
        { id: 'language-3', label: 'Industry-specific keywords from job description are included' },
        { id: 'language-4', label: 'No personal pronouns (I, me, my)' },
        { id: 'language-5', label: 'Language is specific rather than vague' },
        { id: 'language-6', label: 'Acronyms are spelled out at least once' }
      ]
    },
    {
      id: 'final',
      title: 'Final Review',
      items: [
        { id: 'final-1', label: 'Resume has been proofread by someone else' },
        { id: 'final-2', label: 'Content is tailored to the specific job you\'re applying for' },
        { id: 'final-3', label: 'Resume is ATS-friendly with standard section headers' },
        { id: 'final-4', label: 'File is named professionally (e.g., "FirstName_LastName_Resume.pdf")' },
        { id: 'final-5', label: 'No personal information included (age, marital status, photo)' }
      ]
    }
  ];
  
  // Calculate completion percentage
  const totalItems = checklistCategories.flatMap(category => category.items).length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
  
  const getCompletionStatus = () => {
    if (completionPercentage === 100) return 'complete';
    if (completionPercentage >= 80) return 'good';
    if (completionPercentage >= 50) return 'in-progress';
    return 'needs-work';
  };
  
  const statusInfo = {
    'complete': {
      message: 'Your resume is fully optimized and ready to submit!',
      color: 'text-green-600'
    },
    'good': {
      message: 'Your resume is almost there! Complete the remaining items for a perfect score.',
      color: 'text-blue-600'
    },
    'in-progress': {
      message: 'You\'re making good progress! Continue optimizing your resume.',
      color: 'text-amber-600'
    },
    'needs-work': {
      message: 'Your resume needs more optimization. Use the checklist to guide your improvements.',
      color: 'text-red-600'
    }
  };
  
  const status = getCompletionStatus();

  return (
    <Card className={cn("shadow-sm border-t-4 border-t-blue-500", className)}>
      <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-blue-500" />
            Resume Checklist
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
            Self-Assessment
          </Badge>
        </div>
        <CardDescription>
          Use this checklist to evaluate and improve your resume
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 py-0 pb-3 sm:pb-4">
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium">Completion: {Math.round(completionPercentage)}%</span>
            <span className={`text-sm font-medium ${statusInfo[status].color}`}>
              {completionPercentage === 100 ? (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </span>
              ) : (
                `${checkedCount}/${totalItems} completed`
              )}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className={`text-xs mt-1 ${statusInfo[status].color}`}>
            {statusInfo[status].message}
          </p>
        </div>
        
        <div className="space-y-4">
          {checklistCategories.map((category) => (
            <div key={category.id} className="border rounded-lg">
              <div 
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleCategory(category.id)}
              >
                <h3 className="font-medium text-sm">{category.title}</h3>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 text-xs">
                    {category.items.filter(item => checkedItems[item.id]).length}/{category.items.length}
                  </Badge>
                  {expandedCategories[category.id] ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
              
              {expandedCategories[category.id] && (
                <div className="px-3 pb-3 pt-0 space-y-2">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={item.id} 
                        checked={!!checkedItems[item.id]}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5"
                      />
                      <Label 
                        htmlFor={item.id}
                        className={cn(
                          "text-sm cursor-pointer leading-tight",
                          checkedItems[item.id] && "text-slate-500 line-through"
                        )}
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {completionPercentage >= 90 && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 flex items-start">
            <Award className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-700 text-sm">Great job!</h4>
              <p className="text-xs text-green-600 mt-0.5">
                Your resume meets the key requirements for a professional document. Remember to tailor it for each job application!
              </p>
            </div>
          </div>
        )}
        
        {completionPercentage > 0 && completionPercentage < 50 && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-700 text-sm">Resume needs improvement</h4>
              <p className="text-xs text-amber-600 mt-0.5">
                Your resume needs additional work before submitting to employers. Focus on the unchecked items above.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCheckedItems({})} 
          className="text-xs h-8"
        >
          Reset Checklist
        </Button>
        {onClose && (
          <Button 
            variant="default" 
            size="sm"
            className="text-xs h-8"
            onClick={onClose}
          >
            Return to Builder
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
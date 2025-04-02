import { useState } from "react";
import { Briefcase, AlertCircle, Network, DollarSign } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobSearch from "@/components/job-search";
import SalaryInsights from "@/components/salary-insights";

export default function JobSearchPopOut() {
  const [activeTab, setActiveTab] = useState("job-search");
  
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Network className="h-6 w-6 text-blue-500" />
          Fundamenta Connects
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Find opportunities and research salary insights - all in one place
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Research salary trends and find job opportunities in your field.
            Switch between tabs to access different features.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="job-search" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="job-search" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Find Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="salary-insights" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Salary Research</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-search" className="mt-0">
            <JobSearch />
          </TabsContent>
          
          <TabsContent value="salary-insights" className="mt-0">
            <SalaryInsights />
          </TabsContent>
        </Tabs>
      </FullScreenDialogBody>
    </div>
  );
}
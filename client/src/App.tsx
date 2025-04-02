import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import WhyFundamenta from "@/pages/why-fundamenta";
import Partner from "@/pages/partner";
import Privacy from "@/pages/privacy";
import Invite from "@/pages/invite";
import Emergency from "@/pages/emergency";
import Finance from "@/pages/finance";
import MortgagePage from "@/pages/finance/mortgage";
import Career from "@/pages/career";
import Wellness from "@/pages/wellness";
import Active from "@/pages/active";
import Learning from "@/pages/learning";
import EconomicsCourse from "@/pages/learning/courses/economics";
import VehicleMaintenanceCourse from "@/pages/learning/courses/vehicle-maintenance";
import HomeMaintenanceCourse from "@/pages/learning/courses/home-maintenance";
import CookingBasicsCourse from "@/pages/learning/courses/cooking-basics";
import HealthWellnessCourse from "@/pages/learning/courses/health-wellness";
import CriticalThinkingCourse from "@/pages/learning/courses/critical-thinking";
import ConflictResolutionCourse from "@/pages/learning/courses/conflict-resolution";
import DecisionMakingCourse from "@/pages/learning/courses/decision-making";
import TimeManagementCourse from "@/pages/learning/courses/time-management";
import CopingWithFailureCourse from "@/pages/learning/courses/coping-with-failure";
import ConversationSkillsCourse from "@/pages/learning/courses/conversation-skills";
import FormingPositiveHabitsCourse from "@/pages/learning/courses/forming-positive-habits";
import PublicSpeakingCourse from "@/pages/learning/courses/public-speaking";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/why-fundamenta" component={WhyFundamenta} />
        <Route path="/partner" component={Partner} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/invite" component={Invite} />
        <Route path="/emergency" component={Emergency} />
        <Route path="/finance" component={Finance} />
        <Route path="/finance/mortgage" component={MortgagePage} />
        <Route path="/career" component={Career} />
        <Route path="/wellness" component={Wellness} />
        <Route path="/active" component={Active} />
        <Route path="/learning" component={Learning} />
        <Route path="/learning/courses/vehicle-maintenance" component={VehicleMaintenanceCourse} />
        <Route path="/learning/courses/home-maintenance" component={HomeMaintenanceCourse} />
        <Route path="/learning/courses/cooking-basics" component={CookingBasicsCourse} />
        <Route path="/learning/courses/health-wellness" component={HealthWellnessCourse} />
        <Route path="/learning/courses/economics" component={EconomicsCourse} />
        <Route path="/learning/courses/critical-thinking" component={CriticalThinkingCourse} />
        <Route path="/learning/courses/conflict-resolution" component={ConflictResolutionCourse} />
        <Route path="/learning/courses/decision-making" component={DecisionMakingCourse} />
        <Route path="/learning/courses/time-management" component={TimeManagementCourse} />
        <Route path="/learning/courses/coping-with-failure" component={CopingWithFailureCourse} />
        <Route path="/learning/courses/conversation-skills" component={ConversationSkillsCourse} />
        <Route path="/learning/courses/forming-positive-habits" component={FormingPositiveHabitsCourse} />
        <Route path="/learning/courses/public-speaking" component={PublicSpeakingCourse} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Send,
  Download,
  BarChart4,
  Bookmark,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  InfoIcon,
  Sparkles,
  Share2,
  FileText,
} from "lucide-react";
import { FullScreenDialog, FullScreenDialogContent, FullScreenDialogHeader, FullScreenDialogTitle, FullScreenDialogDescription, FullScreenDialogBody, FullScreenDialogFooter } from "./ui/full-screen-dialog";
import { toast } from "@/hooks/use-toast";

// PHQ-9 questions (depression screening)
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];

// GAD-7 questions (anxiety screening)
const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

// Combined questions for the unified assessment
const combinedQuestions = [
  ...phq9Questions.map((q, i) => ({ id: i, text: q, category: "depression" })),
  ...gad7Questions.map((q, i) => ({ id: i + 9, text: q, category: "anxiety" }))
];

// Frequency options for scoring
const frequencyOptions = [
  { value: 0, label: "Not at all", description: "0 days" },
  { value: 1, label: "Several days", description: "1-7 days" },
  { value: 2, label: "More than half the days", description: "8-12 days" },
  { value: 3, label: "Nearly every day", description: "13+ days" }
];

// Severity levels for PHQ-9 (depression)
const depressionSeverity = [
  { range: [0, 4], level: "Minimal", description: "You're showing minimal signs of depression.", color: "bg-green-500" },
  { range: [5, 9], level: "Mild", description: "You may be experiencing mild depression.", color: "bg-blue-500" },
  { range: [10, 14], level: "Moderate", description: "You may be experiencing moderate depression.", color: "bg-yellow-500" },
  { range: [15, 19], level: "Moderately Severe", description: "You may be experiencing moderately severe depression.", color: "bg-orange-500" },
  { range: [20, 27], level: "Severe", description: "You may be experiencing severe depression.", color: "bg-red-500" }
];

// Severity levels for GAD-7 (anxiety)
const anxietySeverity = [
  { range: [0, 4], level: "Minimal", description: "You're showing minimal signs of anxiety.", color: "bg-green-500" },
  { range: [5, 9], level: "Mild", description: "You may be experiencing mild anxiety.", color: "bg-blue-500" },
  { range: [10, 14], level: "Moderate", description: "You may be experiencing moderate anxiety.", color: "bg-yellow-500" },
  { range: [15, 21], level: "Severe", description: "You may be experiencing severe anxiety.", color: "bg-red-500" }
];

// Create PDF document styles
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7e22ce', // purple-700
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    color: '#9333ea' // purple-600
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#374151' // gray-700
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151' // gray-700
  },
  scoreBox: {
    backgroundColor: '#f3f4f6', // gray-100
    padding: 15,
    borderRadius: 5,
    marginVertical: 10
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  recommendations: {
    backgroundColor: '#f5f3ff', // purple-50
    padding: 15,
    borderRadius: 5,
    marginVertical: 10
  },
  disclaimer: {
    fontSize: 10,
    color: '#9ca3af', // gray-400
    marginTop: 30,
    textAlign: 'center'
  },
  date: {
    fontSize: 10,
    color: '#9ca3af', // gray-400
    marginTop: 5,
    textAlign: 'center'
  }
});

// PDF Document component
const BrainTapPDF = ({ results, aiRecommendations }: { 
  results: { 
    depressionScore: number, 
    anxietyScore: number, 
    depressionLevel: string, 
    anxietyLevel: string,
    answers: {id: number, value: number}[]
  }, 
  aiRecommendations: string[]
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Brain Tap Assessment Results</Text>
      
      <Text style={pdfStyles.subtitle}>Assessment Scores</Text>
      <View style={pdfStyles.scoreBox}>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>Depression Score (PHQ-9):</Text>
          <Text style={pdfStyles.boldText}>{results.depressionScore}/27 - {results.depressionLevel}</Text>
        </View>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>Anxiety Score (GAD-7):</Text>
          <Text style={pdfStyles.boldText}>{results.anxietyScore}/21 - {results.anxietyLevel}</Text>
        </View>
      </View>

      <Text style={pdfStyles.subtitle}>Wellness Recommendations</Text>
      <View style={pdfStyles.recommendations}>
        {aiRecommendations.map((rec, i) => (
          <Text key={i} style={pdfStyles.text}>• {rec}</Text>
        ))}
      </View>

      <Text style={pdfStyles.subtitle}>Your Responses</Text>
      {combinedQuestions.map((q, index) => (
        <View key={index} style={pdfStyles.text}>
          <Text style={pdfStyles.boldText}>{q.text}</Text>
          <Text style={pdfStyles.text}>
            Response: {
              frequencyOptions.find(
                option => option.value === results.answers.find(a => a.id === q.id)?.value
              )?.label || 'Not answered'
            }
          </Text>
        </View>
      ))}

      <Text style={pdfStyles.disclaimer}>
        Disclaimer: This assessment is not a diagnostic tool. The results are meant to provide general guidance and should not replace professional medical advice. If you're experiencing significant distress, please consult with a healthcare professional.
      </Text>
      <Text style={pdfStyles.date}>
        Date: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

// Sample AI recommendations based on severity levels
const getAIRecommendations = async (depressionScore: number, anxietyScore: number) => {
  // This would normally call an API endpoint to get AI-generated recommendations
  // For now, using pre-defined recommendations based on score severity
  
  try {
    const response = await fetch('/api/brain-tap/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        depressionScore,
        anxietyScore
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }
    
    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Fallback recommendations if the API call fails
    const depLevel = getDepressionLevel(depressionScore);
    const anxLevel = getAnxietyLevel(anxietyScore);
    
    const fallbackRecommendations = [
      "Practice daily mindfulness meditation for 10-15 minutes",
      "Maintain a regular sleep schedule, aiming for 7-8 hours per night",
      "Engage in moderate physical activity for at least 30 minutes daily",
      "Connect with friends or family members regularly",
      "Consider speaking with a mental health professional for personalized guidance"
    ];
    
    if (depLevel !== "Minimal" || anxLevel !== "Minimal") {
      fallbackRecommendations.push("Establish a daily routine to provide structure");
      fallbackRecommendations.push("Limit consumption of news and social media");
    }
    
    if (depLevel === "Moderate" || depLevel === "Moderately Severe" || depLevel === "Severe" || 
        anxLevel === "Moderate" || anxLevel === "Severe") {
      fallbackRecommendations.push("Consider reaching out to a mental health professional soon");
    }
    
    return fallbackRecommendations;
  }
};

// Helper function to get depression severity level
const getDepressionLevel = (score: number) => {
  const level = depressionSeverity.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function to get anxiety severity level
const getAnxietyLevel = (score: number) => {
  const level = anxietySeverity.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function to get severity color
const getSeverityColor = (score: number, isDepression: boolean) => {
  const levels = isDepression ? depressionSeverity : anxietySeverity;
  const level = levels.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.color : "bg-gray-400";
};

// Main component
export default function BrainTap() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{id: number, value: number}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [resultsTab, setResultsTab] = useState<"overview" | "details" | "recommendations">("overview");
  const [depressionScore, setDepressionScore] = useState(0);
  const [anxietyScore, setAnxietyScore] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [consentToStore, setConsentToStore] = useState(false);
  
  // Reset assessment
  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setResultsTab("overview");
    setDepressionScore(0);
    setAnxietyScore(0);
    setAiRecommendations([]);
    setConsentToStore(false);
  };
  
  // Calculate scores
  const calculateScores = () => {
    // PHQ-9 score (first 9 questions)
    const depScore = answers
      .filter(a => a.id < 9)
      .reduce((sum, curr) => sum + curr.value, 0);
    
    // GAD-7 score (last 7 questions)
    const anxScore = answers
      .filter(a => a.id >= 9)
      .reduce((sum, curr) => sum + curr.value, 0);
    
    setDepressionScore(depScore);
    setAnxietyScore(anxScore);
    
    return { depScore, anxScore };
  };
  
  // Handle completing the assessment
  const completeAssessment = async () => {
    const { depScore, anxScore } = calculateScores();
    
    // Get AI recommendations
    setIsLoadingRecommendations(true);
    try {
      const recommendations = await getAIRecommendations(depScore, anxScore);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Couldn't load recommendations",
        description: "We'll show you some general suggestions instead.",
        variant: "destructive"
      });
      setAiRecommendations([
        "Practice mindfulness meditation daily",
        "Maintain a regular sleep schedule",
        "Exercise regularly",
        "Connect with supportive friends and family",
        "Consider speaking with a mental health professional"
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
    
    // Save results if user consented
    if (consentToStore) {
      try {
        // This would normally save to the database
        console.log('Saving results with consent:', { depScore, anxScore, answers });
        // Implement API call here if needed
      } catch (error) {
        console.error('Error saving results:', error);
      }
    }
    
    setShowResults(true);
  };
  
  // Handle answering a question
  const handleAnswer = (value: number) => {
    const questionId = combinedQuestions[currentQuestionIndex].id;
    
    // Update answers
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.id === questionId);
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { id: questionId, value };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { id: questionId, value }];
      }
    });
    
    // Move to next question or complete if last question
    if (currentQuestionIndex < combinedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };
  
  // Handle skipping a question
  const handleSkip = () => {
    if (currentQuestionIndex < combinedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };
  
  // Handle going back to a previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Handle saving assessment to journal
  const saveToJournal = async () => {
    try {
      // Format the date
      const date = new Date().toLocaleDateString();
      
      // Create journal entry content
      const journalContent = `
# Brain Tap Assessment (${date})

## Depression Score (PHQ-9): ${depressionScore}/27 - ${getDepressionLevel(depressionScore)}
## Anxiety Score (GAD-7): ${anxietyScore}/21 - ${getAnxietyLevel(anxietyScore)}

### Wellness Recommendations:
${aiRecommendations.map(rec => `- ${rec}`).join('\n')}

This assessment is not a diagnostic tool. The results are meant to provide general guidance and should not replace professional medical advice.
`;
      
      // Create a new journal entry
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Brain Tap Assessment - ${date}`,
          content: journalContent,
          mood: "reflective",
          tags: ["brain-tap", "mental-health", "assessment"],
          isPrivate: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to journal');
      }
      
      toast({
        title: "Saved to Journal",
        description: "Your assessment has been saved to your Wellness Journal",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving to journal:', error);
      toast({
        title: "Couldn't save to journal",
        description: "There was an error saving your assessment",
        variant: "destructive"
      });
    }
  };
  
  // Progress calculation
  const progressPercentage = ((currentQuestionIndex + 1) / combinedQuestions.length) * 100;
  
  return (
    <Card className="shadow-md border-purple-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-100">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-5 w-5 text-purple-600" />
          Brain Tap
        </CardTitle>
        <CardDescription>
          Mental wellness check-in using clinical screening tools
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Take a few minutes to check in with your mental wellness using our clinically-based questionnaire.
            Your responses are private and can help identify areas where you might benefit from additional support.
          </p>
          
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md"
          >
            Start Brain Tap Assessment
            <Brain className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      <FullScreenDialog open={isOpen} onOpenChange={setIsOpen}>
        <FullScreenDialogContent themeColor="#a855f7">
          {!showResults ? (
            // Question screen
            <>
              <FullScreenDialogHeader>
                <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Brain Tap Assessment
                </FullScreenDialogTitle>
                <FullScreenDialogDescription className="flex flex-col gap-3">
                  <div className="text-purple-600">
                    Question {currentQuestionIndex + 1} of {combinedQuestions.length}
                  </div>
                  <Progress value={progressPercentage} className="h-2 w-full bg-purple-100" />
                </FullScreenDialogDescription>
              </FullScreenDialogHeader>
              
              <FullScreenDialogBody>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
                    <h3 className="text-lg font-medium text-purple-900 mb-4">
                      Over the last 2 weeks, how often have you been bothered by:
                    </h3>
                    <p className="text-xl font-medium text-gray-900 mb-6">
                      "{combinedQuestions[currentQuestionIndex].text}"
                    </p>
                    
                    <RadioGroup className="space-y-4">
                      {frequencyOptions.map((option) => (
                        <div key={option.value} className="flex">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`q${currentQuestionIndex}-option-${option.value}`}
                            className="peer sr-only"
                            onClick={() => handleAnswer(option.value)}
                          />
                          <Label
                            htmlFor={`q${currentQuestionIndex}-option-${option.value}`}
                            className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-purple-200 bg-white p-4 hover:bg-purple-50 hover:border-purple-300 peer-checked:border-purple-500 peer-checked:bg-purple-50"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{option.label}</span>
                              <span className="text-xs text-gray-500">{option.description}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-center">
                    <Badge className="text-purple-700 bg-purple-100 hover:bg-purple-200 cursor-pointer" onClick={() => setCurrentQuestionIndex(0)}>
                      {currentQuestionIndex < 9 ? "Depression Screening" : "Anxiety Screening"}
                    </Badge>
                  </div>
                  
                  <Alert variant="default" className="bg-purple-50 border-purple-200">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    <AlertTitle>About this question</AlertTitle>
                    <AlertDescription className="text-purple-800">
                      This is part of the {currentQuestionIndex < 9 ? "PHQ-9 depression" : "GAD-7 anxiety"} screening tool, a clinically validated questionnaire used by healthcare providers.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="store-consent" 
                      checked={consentToStore}
                      onCheckedChange={(checked) => setConsentToStore(checked as boolean)}
                    />
                    <Label htmlFor="store-consent" className="text-xs text-gray-500">
                      I consent to storing my assessment results to track changes over time
                    </Label>
                  </div>
                </div>
              </FullScreenDialogBody>
              
              <FullScreenDialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500"
                    >
                      Skip
                    </Button>
                    
                    <Button
                      onClick={() => handleAnswer(
                        answers.find(a => a.id === combinedQuestions[currentQuestionIndex].id)?.value || 0
                      )}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    >
                      {currentQuestionIndex < combinedQuestions.length - 1 ? (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Complete
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </FullScreenDialogFooter>
            </>
          ) : (
            // Results screen
            <>
              <FullScreenDialogHeader>
                <FullScreenDialogTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Your Brain Tap Results
                </FullScreenDialogTitle>
                <FullScreenDialogDescription className="text-purple-600">
                  Assessment completed on {new Date().toLocaleDateString()}
                </FullScreenDialogDescription>
              </FullScreenDialogHeader>
              
              <FullScreenDialogBody>
                <Tabs defaultValue="overview" value={resultsTab} onValueChange={(v) => setResultsTab(v as any)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Detailed Results</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-purple-100 shadow-sm">
                      <h3 className="text-lg font-medium text-purple-900">Summary</h3>
                      
                      <Alert variant="default" className="bg-purple-50 border-purple-100">
                        <InfoIcon className="h-4 w-4 text-purple-500" />
                        <AlertTitle>Your Wellness Summary</AlertTitle>
                        <AlertDescription className="text-purple-800 font-medium">
                          You may be experiencing {getAnxietyLevel(anxietyScore).toLowerCase()} anxiety 
                          and {getDepressionLevel(depressionScore).toLowerCase()} depression symptoms.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">PHQ-9</Badge>
                            Depression Screening
                          </h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl font-bold text-purple-700">{depressionScore}/27</div>
                            <Badge className={`${getSeverityColor(depressionScore, true)} text-white`}>
                              {getDepressionLevel(depressionScore)}
                            </Badge>
                          </div>
                          <Progress 
                            value={(depressionScore / 27) * 100} 
                            className="h-2 bg-purple-100" 
                          />
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">GAD-7</Badge>
                            Anxiety Screening
                          </h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl font-bold text-blue-700">{anxietyScore}/21</div>
                            <Badge className={`${getSeverityColor(anxietyScore, false)} text-white`}>
                              {getAnxietyLevel(anxietyScore)}
                            </Badge>
                          </div>
                          <Progress 
                            value={(anxietyScore / 21) * 100} 
                            className="h-2 bg-blue-100" 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">What does this mean?</h4>
                        <p className="text-sm text-gray-600">
                          These scores are based on standardized screening tools used by healthcare professionals. 
                          They can help identify potential areas of concern, but they're not a diagnosis.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setResultsTab("recommendations")}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          View wellness recommendations
                        </Button>
                        
                        <PDFDownloadLink 
                          document={<BrainTapPDF 
                            results={{
                              depressionScore,
                              anxietyScore,
                              depressionLevel: getDepressionLevel(depressionScore),
                              anxietyLevel: getAnxietyLevel(anxietyScore),
                              answers
                            }} 
                            aiRecommendations={aiRecommendations}
                          />} 
                          fileName="brain-tap-assessment.pdf"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF Report
                        </PDFDownloadLink>
                      </div>
                    </div>
                    
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle>Important Health Information</AlertTitle>
                      <AlertDescription className="text-yellow-800">
                        This assessment is not a diagnostic tool. If you're experiencing severe symptoms or having thoughts of harming yourself, please contact a healthcare professional or crisis helpline immediately.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
                      <h3 className="text-lg font-medium text-purple-900 mb-4">Your Responses</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-md font-medium text-purple-800 flex items-center gap-2 mb-3">
                            <Badge className="bg-purple-100 text-purple-700">PHQ-9</Badge>
                            Depression Screening Questions
                          </h4>
                          
                          <div className="space-y-4">
                            {phq9Questions.map((question, index) => {
                              const answer = answers.find(a => a.id === index);
                              const answerValue = answer ? answer.value : null;
                              
                              return (
                                <div key={index} className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                                  <div className="mb-1 font-medium text-sm text-gray-700">{question}</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-600">Your answer:</div>
                                    {answerValue !== null ? (
                                      <Badge 
                                        className="bg-white border border-purple-200 text-purple-700"
                                      >
                                        {frequencyOptions.find(o => o.value === answerValue)?.label || 'Not answered'}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-gray-500">
                                        Skipped
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="text-md font-medium text-blue-800 flex items-center gap-2 mb-3">
                            <Badge className="bg-blue-100 text-blue-700">GAD-7</Badge>
                            Anxiety Screening Questions
                          </h4>
                          
                          <div className="space-y-4">
                            {gad7Questions.map((question, index) => {
                              const answer = answers.find(a => a.id === index + 9);
                              const answerValue = answer ? answer.value : null;
                              
                              return (
                                <div key={index} className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                  <div className="mb-1 font-medium text-sm text-gray-700">{question}</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-600">Your answer:</div>
                                    {answerValue !== null ? (
                                      <Badge 
                                        className="bg-white border border-blue-200 text-blue-700"
                                      >
                                        {frequencyOptions.find(o => o.value === answerValue)?.label || 'Not answered'}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-gray-500">
                                        Skipped
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-purple-900">Personalized Wellness Plan</h3>
                        <Badge className="bg-purple-100 text-purple-700">
                          AI-Generated
                        </Badge>
                      </div>
                      
                      {isLoadingRecommendations ? (
                        <div className="text-center py-10">
                          <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                          <p className="text-purple-700">Generating your personalized recommendations...</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <Alert className="bg-indigo-50 border-indigo-100">
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                            <AlertTitle>Your Wellness Roadmap</AlertTitle>
                            <AlertDescription className="text-indigo-800">
                              Based on your assessment, here are some suggested strategies that may help improve your mental well-being.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-4 mt-2">
                            {aiRecommendations.map((recommendation, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/80 to-purple-50/30 rounded-lg border border-purple-100">
                                <div className="bg-white p-1.5 rounded-full border border-purple-200 text-purple-700">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                                <div className="text-gray-700">{recommendation}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-purple-800 mb-3">Track Your Progress</h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Consider retaking this assessment in 2-4 weeks to track changes in your mental wellness.
                              Consistent small improvements can make a significant difference over time.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50 flex-1"
                                onClick={saveToJournal}
                              >
                                <Bookmark className="h-4 w-4 mr-2" />
                                Save to Wellness Journal
                              </Button>
                              
                              <PDFDownloadLink 
                                document={<BrainTapPDF 
                                  results={{
                                    depressionScore,
                                    anxietyScore,
                                    depressionLevel: getDepressionLevel(depressionScore),
                                    anxietyLevel: getAnxietyLevel(anxietyScore),
                                    answers
                                  }} 
                                  aiRecommendations={aiRecommendations}
                                />} 
                                fileName="brain-tap-assessment.pdf"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Export as PDF
                              </PDFDownloadLink>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-purple-100">
                      <h4 className="text-md font-medium text-purple-800 mb-2">Important Note</h4>
                      <p className="text-sm text-gray-600">
                        These recommendations are suggestions based on common evidence-based approaches. For personalized
                        guidance, please consult with a healthcare professional or mental health specialist.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </FullScreenDialogBody>
              
              <FullScreenDialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                  
                  <Button
                    onClick={resetAssessment}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retake Assessment
                  </Button>
                </div>
              </FullScreenDialogFooter>
            </>
          )}
        </FullScreenDialogContent>
      </FullScreenDialog>
    </Card>
  );
}
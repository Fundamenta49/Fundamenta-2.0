import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription
} from '@/components/ui/full-screen-dialog';
import { AlertCircle, CheckCircle, Star, Award, BookOpen, Film, CreditCard, Lock, TrendingUp, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { fetchYouTubeVideos } from '@/lib/youtube-service';

interface CreditQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface CreditSkillLevel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  videoKeywords: string;
  questions: CreditQuestion[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

interface UserProgress {
  completedLevels: string[];
  quizScores: Record<string, number>;
  videosWatched: string[];
  totalPoints: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

const CreditBuildingSkills: React.FC = () => {
  const [activeTab, setActiveTab] = useState('learning');
  const [selectedLevel, setSelectedLevel] = useState<CreditSkillLevel | null>(null);
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLevels: [],
    quizScores: {},
    videosWatched: [],
    totalPoints: 0
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const creditSkillLevels: CreditSkillLevel[] = [
    {
      id: 'credit-basics',
      title: 'Credit Fundamentals',
      description: 'Learn what credit is and how it affects your financial future',
      icon: <BookOpen className="h-5 w-5" />,
      difficulty: 'beginner',
      estimatedTime: '10 min',
      videoKeywords: 'credit basics for beginners',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What is Credit?</h3>
          
          <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-medium text-green-700 dark:text-green-400">Definition of Credit</h4>
            <p className="text-sm mt-1">
              Credit is borrowed money that you can use to purchase goods and services when you need them. You get credit from a credit grantor, whom you agree to pay back the amount you spent, plus applicable finance charges, at an agreed-upon time.
            </p>
          </div>
          
          <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-medium text-green-700 dark:text-green-400">Types of Credit</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="border border-green-200 dark:border-green-800 rounded p-3">
                <h5 className="font-medium text-sm">Revolving Credit</h5>
                <p className="text-xs mt-1">Credit cards and lines of credit that allow you to repeatedly borrow up to a set limit and make payments of your choice above the minimum due.</p>
              </div>
              <div className="border border-green-200 dark:border-green-800 rounded p-3">
                <h5 className="font-medium text-sm">Installment Credit</h5>
                <p className="text-xs mt-1">Loans that you repay with a fixed number of equal payments, such as car loans, mortgages, or student loans.</p>
              </div>
              <div className="border border-green-200 dark:border-green-800 rounded p-3">
                <h5 className="font-medium text-sm">Service Credit</h5>
                <p className="text-xs mt-1">Agreements with service providers like utility companies, cell phone providers, and doctors where you use the service first and pay later.</p>
              </div>
              <div className="border border-green-200 dark:border-green-800 rounded p-3">
                <h5 className="font-medium text-sm">Open Credit</h5>
                <p className="text-xs mt-1">Accounts that must be paid in full monthly, such as charge cards or certain American Express cards.</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">Why Credit Matters</h3>
          <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <p className="text-sm">
              Your credit history affects many aspects of your financial life:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Ability to rent an apartment or home</li>
              <li>Interest rates on loans and credit cards</li>
              <li>Insurance premiums in many states</li>
              <li>Employment opportunities (some employers check credit)</li>
              <li>Cell phone contracts and utility deposits</li>
              <li>Future borrowing potential for major purchases</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              Credit Myth Busting
            </h4>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
                <p className="text-sm text-amber-800"><strong>Myth:</strong> Checking your own credit score lowers it.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                <p className="text-sm text-amber-800"><strong>Fact:</strong> When you check your own score, it's a "soft inquiry" and doesn't affect your score.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
                <p className="text-sm text-amber-800"><strong>Myth:</strong> You need to carry a balance on credit cards to build credit.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                <p className="text-sm text-amber-800"><strong>Fact:</strong> Paying your balance in full each month still builds your credit history and saves you money on interest.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      questions: [
        // Questions are kept the same as your original file
        {
          id: 1,
          question: "What is credit?",
          options: [
            "Money you've saved in a bank account",
            "The ability to borrow money to purchase goods or services",
            "A type of investment strategy",
            "A government benefit program"
          ],
          correctAnswer: 1,
          explanation: "Credit is the ability to borrow money or access goods or services with the understanding that you'll pay later. It's essentially borrowing money with the promise to repay it.",
          difficulty: "beginner"
        },
        {
          id: 2,
          question: "Which of the following is NOT a type of credit?",
          options: [
            "Revolving credit",
            "Installment credit",
            "Investment credit",
            "Service credit"
          ],
          correctAnswer: 2,
          explanation: "Investment credit is not a standard type of credit. The main types are revolving credit (like credit cards), installment credit (like loans), service credit (utilities, etc.), and open credit (charge cards).",
          difficulty: "beginner"
        },
        // Add the rest of the questions here
      ]
    },
    // Add the rest of your credit skill levels here
  ];
  
  // Helper function for badge variants based on difficulty
  const getBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'intermediate':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800';
      case 'advanced':
        return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800';
      default:
        return '';
    }
  };
  
  // Select a level and show its dialog
  const handleSelectLevel = (level: CreditSkillLevel) => {
    setSelectedLevel(level);
    setShowLevelDialog(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    
    // Load videos if none are loaded for this level
    if (videos.length === 0) {
      loadVideosForLevel(level);
    }
  };
  
  // Load videos from YouTube for the selected level
  const loadVideosForLevel = async (level: CreditSkillLevel) => {
    setLoadingVideos(true);
    try {
      const results = await fetchYouTubeVideos(level.videoKeywords, 6);
      setVideos(results);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };
  
  // Start the quiz for the selected level
  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setShowLevelDialog(false);
    setShowQuiz(true);
  };
  
  // Submit an answer for the current quiz question
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    
    // Only update score if it's correct
    if (selectedOption === selectedLevel?.questions[currentQuestionIndex].correctAnswer) {
      const updatedScores = { ...userProgress.quizScores };
      updatedScores[selectedLevel.id] = (updatedScores[selectedLevel.id] || 0) + 1;
      
      setUserProgress({
        ...userProgress,
        quizScores: updatedScores,
        totalPoints: userProgress.totalPoints + 10
      });
    }
  };
  
  // Move to the next question or complete the quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedLevel!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // Quiz completed
      const updatedCompletedLevels = [...userProgress.completedLevels];
      if (!updatedCompletedLevels.includes(selectedLevel!.id)) {
        updatedCompletedLevels.push(selectedLevel!.id);
      }
      
      setUserProgress({
        ...userProgress,
        completedLevels: updatedCompletedLevels,
        totalPoints: userProgress.totalPoints + 50 // Bonus for completing
      });
      
      setShowQuiz(false);
    }
  };
  
  // Record when a user watches a video
  const handleVideoWatched = (videoId: string) => {
    if (!userProgress.videosWatched.includes(videoId)) {
      setUserProgress({
        ...userProgress,
        videosWatched: [...userProgress.videosWatched, videoId],
        totalPoints: userProgress.totalPoints + 5
      });
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Credit Building Skills</h2>
        <p className="text-muted-foreground">Learn how to build and maintain good credit to secure your financial future.</p>
        
        <div className="flex items-center gap-3 mt-1">
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
            Finance
          </Badge>
          <span className="text-sm text-muted-foreground">
            <Star className="h-4 w-4 inline mr-1 text-amber-500" />
            Points: {userProgress.totalPoints}
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="learning" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="learning">Learning Modules</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditSkillLevels.map((level) => (
              <Card 
                key={level.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  userProgress.completedLevels.includes(level.id) ? 'border-green-300 dark:border-green-800' : ''
                }`}
                onClick={() => handleSelectLevel(level)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      {level.icon}
                      <CardTitle className="text-lg">{level.title}</CardTitle>
                    </div>
                    {userProgress.completedLevels.includes(level.id) && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge variant="outline" className={getBadgeVariant(level.difficulty)}>
                      {level.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
                      {level.estimatedTime}
                    </Badge>
                  </div>
                  
                  {userProgress.quizScores[level.id] !== undefined && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Quiz score: {userProgress.quizScores[level.id]}/{level.questions.length}</p>
                      <Progress 
                        value={(userProgress.quizScores[level.id] / level.questions.length) * 100} 
                        className="h-2 bg-gray-100 dark:bg-gray-800" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-4">
          <div className="space-y-6">
            <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                <Award className="h-5 w-5" />
                Your Progress
              </h3>
              <div className="mt-3 space-y-4">
                <div>
                  <p className="text-sm mb-1">Modules completed: {userProgress.completedLevels.length}/{creditSkillLevels.length}</p>
                  <Progress 
                    value={(userProgress.completedLevels.length / creditSkillLevels.length) * 100} 
                    className="h-2 bg-gray-100 dark:bg-gray-800" 
                  />
                </div>
                <div>
                  <p className="text-sm mb-1">Videos watched: {userProgress.videosWatched.length}</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Total points earned: {userProgress.totalPoints}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Learning History</h3>
              
              {userProgress.completedLevels.length > 0 ? (
                <div className="space-y-3">
                  {userProgress.completedLevels.map(levelId => {
                    const level = creditSkillLevels.find(l => l.id === levelId);
                    if (!level) return null;
                    
                    return (
                      <div 
                        key={levelId}
                        className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{level.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              Score: {userProgress.quizScores[levelId] || 0}/{level.questions.length}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleSelectLevel(level)}
                        >
                          Review
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                  <p className="text-muted-foreground">You haven't completed any modules yet.</p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="mt-3 bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('learning')}
                  >
                    Start Learning
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedLevel && (
        <FullScreenDialog open={showLevelDialog} onOpenChange={setShowLevelDialog}>
          <FullScreenDialogContent>
            <FullScreenDialogHeader>
              <FullScreenDialogTitle>{selectedLevel.title}</FullScreenDialogTitle>
              <FullScreenDialogDescription>{selectedLevel.description}</FullScreenDialogDescription>
            </FullScreenDialogHeader>
            <FullScreenDialogBody>
              <Tabs defaultValue="content" className="w-full mt-4">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="content">Learning Content</TabsTrigger>
                  <TabsTrigger value="videos">Video Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getBadgeVariant(selectedLevel.difficulty)}>
                          {selectedLevel.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedLevel.estimatedTime} read</span>
                      </div>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="text-xs h-8 bg-green-600 hover:bg-green-700"
                        onClick={handleStartQuiz}
                      >
                        Take Quiz
                      </Button>
                    </div>
                    {selectedLevel.content}
                  </div>
                </TabsContent>
                <TabsContent value="videos" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Educational Videos</h3>
                    </div>
                    
                    {loadingVideos ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      </div>
                    ) : videos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.map((video) => (
                          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-video">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                            </CardContent>
                            <CardFooter className="p-3 pt-0">
                              <a 
                                href={`https://www.youtube.com/watch?v=${video.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 dark:text-green-400 hover:underline"
                                onClick={() => handleVideoWatched(video.id)}
                              >
                                Watch on YouTube
                              </a>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No videos available. Please check your YouTube API key configuration.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </FullScreenDialogBody>
          </FullScreenDialogContent>
        </FullScreenDialog>
      )}
      
      {selectedLevel && showQuiz && (
        <FullScreenDialog open={showQuiz} onOpenChange={() => setShowQuiz(false)}>
          <FullScreenDialogContent>
            <FullScreenDialogHeader>
              <FullScreenDialogTitle>Credit Knowledge Quiz</FullScreenDialogTitle>
              <FullScreenDialogDescription>Testing your knowledge on {selectedLevel.title}</FullScreenDialogDescription>
            </FullScreenDialogHeader>
            <FullScreenDialogBody>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getBadgeVariant(selectedLevel.difficulty)}>
                      {selectedLevel.difficulty}
                    </Badge>
                    <span className="text-sm">Question {currentQuestionIndex + 1} of {selectedLevel.questions.length}</span>
                  </div>
                  <span className="text-sm font-medium">
                    Score: {userProgress.quizScores[selectedLevel.id] || 0}/{selectedLevel.questions.length}
                  </span>
                </div>
                <Progress value={(currentQuestionIndex / selectedLevel.questions.length) * 100} className="h-2 bg-gray-100 dark:bg-gray-800" />
              </div>
              
              <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
                <h3 className="text-lg font-medium mb-4">{selectedLevel.questions[currentQuestionIndex].question}</h3>
                
                <div className="space-y-3">
                  {selectedLevel.questions[currentQuestionIndex].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedOption === index
                          ? quizSubmitted
                            ? index === selectedLevel.questions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                            : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                      onClick={() => !quizSubmitted && setSelectedOption(index)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                          selectedOption === index
                            ? quizSubmitted
                              ? index === selectedLevel.questions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-red-500 border-red-500 text-white'
                              : 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}>
                          {selectedOption === index && (
                            quizSubmitted ? (
                              index === selectedLevel.questions[currentQuestionIndex].correctAnswer ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )
                            ) : (
                              <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                            )
                          )}
                          {selectedOption !== index && (
                            <span className="text-xs text-gray-700 dark:text-gray-300">{String.fromCharCode(65 + index)}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">{option}</p>
                        {quizSubmitted && index === selectedLevel.questions[currentQuestionIndex].correctAnswer && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Correct answer</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {quizSubmitted && (
                  <div className={`mt-4 p-3 rounded-lg border ${
                    selectedOption === selectedLevel.questions[currentQuestionIndex].correctAnswer
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                      : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
                  }`}>
                    <h4 className="font-medium text-sm mb-1">
                      {selectedOption === selectedLevel.questions[currentQuestionIndex].correctAnswer
                        ? 'Correct!'
                        : 'Incorrect'}
                    </h4>
                    <p className="text-sm">{selectedLevel.questions[currentQuestionIndex].explanation}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                {!quizSubmitted ? (
                  <Button 
                    variant="default" 
                    onClick={handleQuizSubmit}
                    disabled={selectedOption === null}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    onClick={handleNextQuestion}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {currentQuestionIndex < selectedLevel.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                )}
              </div>
            </FullScreenDialogBody>
          </FullScreenDialogContent>
        </FullScreenDialog>
      )}
    </div>
  );
};

export default CreditBuildingSkills;
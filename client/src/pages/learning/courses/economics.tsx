import { useState } from "react";
import { ArrowLeft, BookOpen, ExternalLink, GraduationCap, BookIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "@/components/chat-interface";
import { LEARNING_CATEGORY } from "@/components/chat-interface";

interface Book {
  title: string;
  author: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  link: string;
  coverImage?: string;
}

interface Course {
  title: string;
  provider: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  link: string;
  free: boolean;
}

export default function EconomicsCourse() {
  const [expanded, setExpanded] = useState(false);

  const recommendedBooks: Book[] = [
    {
      title: "Economics in One Lesson",
      author: "Henry Hazlitt",
      description: "A clear, straightforward introduction to basic economics principles, discussing how economic decisions impact society.",
      level: "beginner",
      link: "https://www.amazon.com/Economics-One-Lesson-Shortest-Understand/dp/0517548232",
      coverImage: "https://m.media-amazon.com/images/I/71YjU3WvVUL._AC_UY436_QL65_.jpg"
    },
    {
      title: "Freakonomics",
      author: "Steven D. Levitt & Stephen J. Dubner",
      description: "An engaging look at economics through unconventional topics, showing how economic principles apply to everyday life.",
      level: "beginner",
      link: "https://www.amazon.com/Freakonomics-Economist-Explores-Hidden-Everything/dp/0060731338",
      coverImage: "https://m.media-amazon.com/images/I/51wOOMQ+F3L._SY445_SX342_.jpg"
    },
    {
      title: "The Undercover Economist",
      author: "Tim Harford",
      description: "Demystifies economic concepts by examining real-world situations like shopping, housing markets, and globalization.",
      level: "beginner",
      link: "https://www.amazon.com/Undercover-Economist-Tim-Harford/dp/0345494016",
      coverImage: "https://m.media-amazon.com/images/I/71+W4dZ4WKL._AC_UY436_QL65_.jpg"
    },
    {
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
      description: "A comprehensive textbook covering both microeconomics and macroeconomics, widely used in introductory college courses.",
      level: "intermediate",
      link: "https://www.amazon.com/Principles-Economics-N-Gregory-Mankiw/dp/0357038312",
      coverImage: "https://m.media-amazon.com/images/I/61-gmPtVHaL._AC_UY436_QL65_.jpg"
    },
    {
      title: "The Wealth of Nations",
      author: "Adam Smith",
      description: "The foundational classic of economic thought that introduced concepts like the invisible hand and division of labor.",
      level: "advanced",
      link: "https://www.amazon.com/Wealth-Nations-Adam-Smith/dp/0553585975",
      coverImage: "https://m.media-amazon.com/images/I/71yNLh+3afL._AC_UY436_QL65_.jpg"
    }
  ];

  const onlineCourses: Course[] = [
    {
      title: "Economics: Principles, Problems, & Policies",
      provider: "Khan Academy",
      description: "Free comprehensive introduction to micro and macroeconomics with interactive exercises.",
      level: "beginner",
      duration: "Self-paced",
      link: "https://www.khanacademy.org/economics-finance-domain/ap-macroeconomics",
      free: true
    },
    {
      title: "Microeconomics: The Power of Markets",
      provider: "Coursera (University of Pennsylvania)",
      description: "Learn about supply and demand, market equilibrium, and basic economic models.",
      level: "beginner",
      duration: "7 weeks",
      link: "https://www.coursera.org/learn/microeconomics-part1",
      free: true
    },
    {
      title: "Principles of Economics",
      provider: "edX (MIT)",
      description: "Comprehensive introduction to economic theory from MIT professors.",
      level: "intermediate",
      duration: "11 weeks",
      link: "https://www.edx.org/course/principles-of-economics",
      free: true
    },
    {
      title: "Macroeconomic Forecasting",
      provider: "edX (IMF)",
      description: "Learn forecasting techniques used by the International Monetary Fund.",
      level: "advanced",
      duration: "8 weeks",
      link: "https://www.edx.org/course/macroeconomic-forecasting-imfx",
      free: false
    }
  ];

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/learning">
              <Button variant="ghost" size="icon" aria-label="Back to Learning">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Economics</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-8">
              {/* Overview Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Introduction to Economics</CardTitle>
                  <CardDescription>Understanding the basics of economic theory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Economics is the social science that studies how people interact with value, in particular, the production, 
                    distribution, and consumption of goods and services. It helps us understand how societies allocate scarce 
                    resources to satisfy unlimited wants and needs.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-orange-500" />
                          Microeconomics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          The study of how individual households and firms make decisions and how they interact in markets.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-orange-500" />
                          Macroeconomics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          The study of the economy as a whole, including topics like inflation, unemployment, and economic growth.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6">Why Study Economics?</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Make better personal financial decisions</li>
                    <li>Understand government policies and their impacts</li>
                    <li>Analyze business strategies and market trends</li>
                    <li>Develop critical thinking and analytical skills</li>
                    <li>Prepare for careers in business, finance, government, and more</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Recommended Books Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 border-t border-muted"></div>
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="bg-orange-100 text-orange-800 p-1 rounded-md mr-2">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    Recommended Books
                  </h2>
                  <div className="flex-1 border-t border-muted"></div>
                </div>
                
                <ScrollArea className="max-h-[800px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedBooks.map((book, index) => (
                      <Card key={index} className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-2 h-14">{book.title}</CardTitle>
                          <CardDescription>{book.author}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              book.level === "beginner" ? "bg-green-100 text-green-800" :
                              book.level === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {book.level.charAt(0).toUpperCase() + book.level.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-4">{book.description}</p>
                        </CardContent>
                        <div className="p-4 mt-auto">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(book.link, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Find Book
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Online Courses Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 border-t border-muted"></div>
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="bg-orange-100 text-orange-800 p-1 rounded-md mr-2">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    Online Courses
                  </h2>
                  <div className="flex-1 border-t border-muted"></div>
                </div>
                
                <ScrollArea className="max-h-[800px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {onlineCourses.map((course, index) => (
                      <Card key={index} className="flex flex-col h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {course.provider}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.level === "beginner" ? "bg-green-100 text-green-800" :
                              course.level === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {course.duration}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.free ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {course.free ? "Free" : "Paid"}
                            </span>
                          </div>
                          <p className="text-sm mb-4">{course.description}</p>
                        </CardContent>
                        <div className="p-4 mt-auto">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(course.link, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Go to Course
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-orange-500" />
                  Key Economic Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><strong>Scarcity:</strong> Limited resources vs unlimited wants</li>
                  <li><strong>Opportunity Cost:</strong> What you give up to get something</li>
                  <li><strong>Supply & Demand:</strong> How prices are determined</li>
                  <li><strong>Elasticity:</strong> How responsive quantity is to price changes</li>
                  <li><strong>Market Structures:</strong> Competition vs monopoly</li>
                  <li><strong>Externalities:</strong> Side effects impacting third parties</li>
                  <li><strong>GDP:</strong> Measuring economic output</li>
                  <li><strong>Inflation:</strong> Rising prices over time</li>
                  <li><strong>Fiscal Policy:</strong> Government spending and taxation</li>
                  <li><strong>Monetary Policy:</strong> Central bank control of money supply</li>
                </ul>
              </CardContent>
            </Card>
            
            <ChatInterface 
              category={LEARNING_CATEGORY}
              initialContext={{
                currentPage: "Learning/Economics",
                currentSection: "Economics Course",
                availableActions: [
                  "/learning/courses/economics/books",
                  "/learning/courses/economics/videos",
                  "/learning/courses/economics/quizzes"
                ]
              }}
              expanded={expanded}
              showSuggestions={true}
              onToggleExpand={() => setExpanded(!expanded)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import { QuizQuestion } from '@/components/quiz-component';
import { Resource } from '@/components/resource-links';

interface GenerateQuizParams {
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  numberOfQuestions?: number;
  topics?: string[];
}

interface GenerateResourcesParams {
  subject: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  interests?: string[];
  previousProgress?: number;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

/**
 * Generates quiz questions using the AI backend
 * This leverages our hybrid approach combining template-based questions,
 * OpenAI, and caching for optimal performance and quality
 */
export async function generateQuiz({
  subject,
  difficulty,
  numberOfQuestions = 5,
  topics = []
}: GenerateQuizParams): Promise<QuizQuestion[]> {
  try {
    console.log(`Generating quiz for ${subject} at ${difficulty} level`);
    
    const response = await fetch('/api/learning/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        difficulty,
        numberOfQuestions,
        topics
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }

    const data = await response.json() as QuizResponse;
    if (!data.questions || data.questions.length === 0) {
      throw new Error('No questions received from the server');
    }
    
    return data.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Return some sample questions as fallback in case of API failure
    return getSampleQuizQuestions(subject, difficulty);
  }
}

/**
 * Fetches recommended learning resources from the AI backend
 * These resources are personalized based on user level, interests, and progress
 */
export async function getRecommendedResources({
  subject,
  userLevel,
  interests = [],
  previousProgress = 0
}: GenerateResourcesParams): Promise<Resource[]> {
  try {
    console.log(`Fetching ${userLevel} level resources for ${subject}`);
    
    const response = await fetch('/api/learning/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        userLevel,
        interests,
        previousProgress
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.resources || !Array.isArray(data.resources)) {
      throw new Error('Invalid resource data received from server');
    }
    
    return data.resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    
    // Return some sample resources as fallback in case of API failure
    return getSampleResources(subject);
  }
}

/**
 * Submit quiz results for analysis and personalized feedback
 * This feature tracks learning progress and provides adaptive recommendations
 * based on the user's performance and identified knowledge gaps
 */
export async function submitQuizResults(
  subject: string,
  difficulty: string,
  userAnswers: number[] | null = null,
  correctAnswers: number[] | null = null,
  score?: number,
  totalQuestions?: number
): Promise<{ 
  feedback: string; 
  suggestedActions: string[];
  percentageScore?: number;
  incorrectQuestions?: number[];
}> {
  try {
    // Prepare the request body based on available data
    const requestBody: any = {
      subject,
      difficulty,
      timestamp: new Date().toISOString()
    };
    
    // If we have detailed answer data, use it (preferred for better analysis)
    if (Array.isArray(userAnswers) && Array.isArray(correctAnswers)) {
      console.log(`Submitting detailed quiz results for ${subject}: ${userAnswers.length} answers`);
      requestBody.userAnswers = userAnswers;
      requestBody.correctAnswers = correctAnswers;
    } 
    // Otherwise use legacy score/total approach
    else if (typeof score === 'number' && typeof totalQuestions === 'number') {
      console.log(`Submitting summary quiz results for ${subject}: ${score}/${totalQuestions}`);
      requestBody.score = score;
      requestBody.totalQuestions = totalQuestions;
    }
    else {
      throw new Error('Either user/correct answers or score/total must be provided');
    }
    
    // Submit to our enhanced analytics and feedback API
    const response = await fetch('/api/learning/submit-quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit quiz results: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Also track this activity for personalized recommendations
    await trackLearningProgress(subject, 'quiz', {
      difficulty,
      score: result.percentageScore || result.score,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('Failed to track quiz progress:', err));
    
    return {
      feedback: result.feedback || 'Quiz results submitted successfully!',
      suggestedActions: result.suggestedActions || [],
      percentageScore: result.percentageScore,
      incorrectQuestions: result.incorrectQuestions
    };
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    
    // Calculate basic metrics for fallback response
    let percentScore = 0;
    if (userAnswers && correctAnswers) {
      const correctCount = userAnswers.filter((ans, i) => ans === correctAnswers[i]).length;
      percentScore = (correctCount / userAnswers.length) * 100;
    } else if (typeof score === 'number' && typeof totalQuestions === 'number') {
      percentScore = (score / totalQuestions) * 100;
    }
    
    // Return a generic response as fallback
    return {
      feedback: percentScore >= 70 
        ? 'Great job! You\'re making good progress.' 
        : 'Keep practicing to improve your skills.',
      suggestedActions: [
        'Review the learning materials',
        'Try the practice exercises',
        'Explore the recommended resources'
      ]
    };
  }
}

/**
 * Track user learning progress for personalized recommendations
 * This data powers the adaptive learning system that tailors content
 * to each user's unique learning journey and preference patterns
 */
export async function trackLearningProgress(
  subject: string,
  action: 'view' | 'complete' | 'quiz' | 'resource_click',
  details?: Record<string, any>
): Promise<void> {
  try {
    // Add client-side timestamp and session ID for better analytics
    const eventData = {
      subject,
      action,
      details: {
        ...details,
        client_timestamp: new Date().toISOString(),
        session_id: getOrCreateSessionId(),
        screen_size: `${window.innerWidth}x${window.innerHeight}`, // For mobile vs desktop analytics
      },
      timestamp: new Date().toISOString()
    };
    
    // Fire and forget - don't block the UI while waiting for this
    fetch('/api/learning/track-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    }).catch(err => {
      // Log but don't disrupt user experience
      console.error('Background tracking request failed:', err);
    });
  } catch (error) {
    console.error('Error preparing tracking data:', error);
    // Silent fail - tracking shouldn't block the user experience
  }
}

// Helper to create or retrieve a consistent session ID
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('learning_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('learning_session_id', sessionId);
  }
  return sessionId;
}

// Sample data until backend is implemented
function getSampleQuizQuestions(subject: string, difficulty: string): QuizQuestion[] {
  // Economics sample questions
  if (subject.toLowerCase() === 'economics') {
    return [
      {
        id: 1,
        question: "What is opportunity cost?",
        options: [
          "The cost of taking an opportunity in the stock market",
          "The value of the next best alternative forgone when making a choice",
          "The cost of operating a business",
          "The cost of goods sold in a transaction"
        ],
        correctAnswer: 1,
        explanation: "Opportunity cost refers to the value of what you have to give up in order to choose something else. It's a fundamental concept in economics that emphasizes the trade-offs involved in decision-making."
      },
      {
        id: 2,
        question: "What does GDP stand for?",
        options: [
          "Global Development Process",
          "Gross Domestic Product",
          "General Distribution of Profits",
          "Growth Deficit Percentage"
        ],
        correctAnswer: 1,
        explanation: "GDP (Gross Domestic Product) is the total monetary value of all finished goods and services produced within a country's borders in a specific time period. It's used as a measure of economic output and growth."
      },
      {
        id: 3,
        question: "Which of the following is NOT a type of economic system?",
        options: [
          "Market economy",
          "Command economy",
          "Mixed economy",
          "Bilateral economy"
        ],
        correctAnswer: 3,
        explanation: "Bilateral economy is not a recognized type of economic system. The main types are market economies (driven by private individuals and businesses), command economies (centrally planned by governments), and mixed economies (combining elements of both)."
      },
      {
        id: 4,
        question: "What is inflation?",
        options: [
          "A sustained increase in the general price level of goods and services",
          "The increasing value of currency over time",
          "The process of investing in financial markets",
          "Economic growth that exceeds expectations"
        ],
        correctAnswer: 0,
        explanation: "Inflation is a sustained increase in the general price level of goods and services in an economy over a period of time. When the price level rises, each unit of currency buys fewer goods and services, effectively reducing purchasing power."
      },
      {
        id: 5,
        question: "What happens to demand when price increases, all else being equal?",
        options: [
          "Demand increases",
          "Demand decreases",
          "Demand remains the same",
          "Demand becomes inelastic"
        ],
        correctAnswer: 1,
        explanation: "According to the law of demand, when the price of a good increases, the quantity demanded decreases, assuming all other factors remain constant. This reflects the inverse relationship between price and quantity demanded."
      }
    ];
  }
  
  // Programming sample questions
  if (subject.toLowerCase() === 'programming') {
    return [
      {
        id: 1,
        question: "What is a variable in programming?",
        options: [
          "A mathematical equation",
          "A named storage location for data that can change",
          "A fixed value that never changes",
          "A type of programming language"
        ],
        correctAnswer: 1,
        explanation: "A variable is a named storage location that can hold different values during program execution. Variables are fundamental to programming as they allow data to be stored, updated, and referenced throughout the code."
      },
      {
        id: 2,
        question: "What is the purpose of a function in programming?",
        options: [
          "To make the code look professional",
          "To create visual elements on a webpage",
          "To group related code that performs a specific task",
          "To connect to a database"
        ],
        correctAnswer: 2,
        explanation: "Functions are blocks of reusable code designed to perform a specific task. They help organize code, prevent repetition, and make programs more modular and easier to maintain."
      },
      {
        id: 3,
        question: "What is an array in programming?",
        options: [
          "A collection of variables of different types",
          "A data structure that stores a collection of elements in a specific order",
          "A method to connect to external services",
          "A type of loop structure"
        ],
        correctAnswer: 1,
        explanation: "An array is a data structure that stores a collection of elements (values or variables), typically of the same type, in a contiguous memory location. Each element can be accessed using an index."
      },
      {
        id: 4,
        question: "What is a 'for loop' used for?",
        options: [
          "To repeat a block of code a fixed number of times",
          "To create conditional statements",
          "To define functions",
          "To connect to external APIs"
        ],
        correctAnswer: 0,
        explanation: "A 'for loop' is a control flow statement that allows code to be executed repeatedly based on a condition. It's typically used when the number of iterations is known beforehand, such as iterating through elements in an array."
      },
      {
        id: 5,
        question: "What is debugging?",
        options: [
          "Writing documentation for code",
          "The process of removing insects from computers",
          "The process of finding and fixing errors in programs",
          "Creating a backup of program files"
        ],
        correctAnswer: 2,
        explanation: "Debugging is the process of finding and resolving defects or problems within a program that prevent correct operation. Debugging tactics can involve interactive debugging, control flow analysis, unit testing, and more."
      }
    ];
  }
  
  // Default questions for other subjects
  return [
    {
      id: 1,
      question: `What is a key principle of ${subject}?`,
      options: [
        "First sample answer that's incorrect",
        "Second sample answer that's correct",
        "Third sample answer that's incorrect",
        "Fourth sample answer that's incorrect"
      ],
      correctAnswer: 1,
      explanation: `This is a sample explanation about key principles in ${subject}.`
    },
    {
      id: 2,
      question: `Which of the following best describes ${subject}?`,
      options: [
        "First sample answer that's incorrect",
        "Second sample answer that's incorrect",
        "Third sample answer that's correct",
        "Fourth sample answer that's incorrect"
      ],
      correctAnswer: 2,
      explanation: `This is a sample explanation about the definition of ${subject}.`
    },
    {
      id: 3,
      question: `Which is NOT a common application of ${subject}?`,
      options: [
        "First sample answer that's correct",
        "Second sample answer that's incorrect",
        "Third sample answer that's incorrect",
        "Fourth sample answer that's incorrect"
      ],
      correctAnswer: 0,
      explanation: `This is a sample explanation about applications of ${subject}.`
    },
    {
      id: 4,
      question: `Who is known as a pioneer in the field of ${subject}?`,
      options: [
        "First sample answer that's incorrect",
        "Second sample answer that's incorrect",
        "Third sample answer that's incorrect",
        "Fourth sample answer that's correct"
      ],
      correctAnswer: 3,
      explanation: `This is a sample explanation about important figures in ${subject}.`
    },
    {
      id: 5,
      question: `What is a common misconception about ${subject}?`,
      options: [
        "First sample answer that's incorrect",
        "Second sample answer that's correct",
        "Third sample answer that's incorrect",
        "Fourth sample answer that's incorrect"
      ],
      correctAnswer: 1,
      explanation: `This is a sample explanation about misconceptions in ${subject}.`
    }
  ];
}

function getSampleResources(subject: string): Resource[] {
  // Economics resources
  if (subject.toLowerCase() === 'economics') {
    return [
      {
        id: "eco-article-1",
        title: "Understanding Supply and Demand",
        description: "A clear explanation of the fundamental economic principle of supply and demand and how it affects markets.",
        url: "https://www.investopedia.com/terms/l/law-of-supply-demand.asp",
        type: "article",
        level: "beginner",
        tags: ["microeconomics", "markets", "principles"]
      },
      {
        id: "eco-video-1",
        title: "Economics Explained: GDP",
        description: "An engaging video explanation of Gross Domestic Product and how it's calculated.",
        url: "https://www.youtube.com/watch?v=yTErh3Xt4LY",
        type: "video",
        level: "beginner",
        duration: "12 min",
        free: true,
        tags: ["macroeconomics", "indicators"]
      },
      {
        id: "eco-course-1",
        title: "Principles of Economics",
        description: "A comprehensive introduction to both microeconomics and macroeconomics.",
        url: "https://www.edx.org/course/principles-of-economics",
        type: "course",
        level: "beginner",
        duration: "8 weeks",
        free: true,
        tags: ["fundamentals", "principles"]
      },
      {
        id: "eco-book-1",
        title: "Economics in One Lesson",
        description: "Henry Hazlitt's classic book on economic principles and common misconceptions.",
        url: "https://www.amazon.com/Economics-One-Lesson-Shortest-Understand/dp/0517548232",
        type: "book",
        level: "beginner",
        free: false,
        tags: ["fundamentals", "classics"]
      },
      {
        id: "eco-tool-1",
        title: "FRED Economic Data",
        description: "Federal Reserve Economic Data - a database of economic indicators and data sources.",
        url: "https://fred.stlouisfed.org/",
        type: "tool",
        level: "intermediate",
        free: true,
        tags: ["data", "research"]
      },
      {
        id: "eco-practice-1",
        title: "Supply and Demand Simulation",
        description: "Interactive simulation to practice understanding market equilibrium.",
        url: "https://www.econport.org/econport/request?page=man_ed_pedagogy_experiment_marketSimulation",
        type: "practice",
        level: "beginner",
        free: true,
        tags: ["simulation", "interactive"]
      }
    ];
  }
  
  // Programming resources
  if (subject.toLowerCase() === 'programming') {
    return [
      {
        id: "prog-article-1",
        title: "Learn JavaScript: The Complete Guide",
        description: "A comprehensive guide to JavaScript from basics to advanced concepts.",
        url: "https://javascript.info/",
        type: "article",
        level: "beginner",
        tags: ["javascript", "web development"]
      },
      {
        id: "prog-video-1",
        title: "Introduction to Python Programming",
        description: "A beginner-friendly video series on Python programming fundamentals.",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        type: "video",
        level: "beginner",
        duration: "4 hrs",
        free: true,
        tags: ["python", "fundamentals"]
      },
      {
        id: "prog-course-1",
        title: "CS50: Introduction to Computer Science",
        description: "Harvard University's introduction to computer science and programming.",
        url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
        type: "course",
        level: "beginner",
        duration: "12 weeks",
        free: true,
        tags: ["computer science", "fundamentals"]
      },
      {
        id: "prog-book-1",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        description: "Robert C. Martin's guide to writing maintainable and efficient code.",
        url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
        type: "book",
        level: "intermediate",
        free: false,
        tags: ["best practices", "software design"]
      },
      {
        id: "prog-tool-1",
        title: "Visual Studio Code",
        description: "A powerful, free code editor with extensive language support and features.",
        url: "https://code.visualstudio.com/",
        type: "tool",
        level: "beginner",
        free: true,
        tags: ["editor", "development tools"]
      },
      {
        id: "prog-practice-1",
        title: "LeetCode Programming Challenges",
        description: "Platform with coding challenges to improve algorithmic thinking and problem-solving.",
        url: "https://leetcode.com/",
        type: "practice",
        level: "intermediate",
        free: true,
        tags: ["algorithms", "problem solving"]
      }
    ];
  }
  
  // Default resources for other subjects
  return [
    {
      id: `${subject.toLowerCase()}-article-1`,
      title: `Introduction to ${subject}`,
      description: `A comprehensive introduction to ${subject} for beginners.`,
      url: "https://www.example.com/introduction",
      type: "article",
      level: "beginner",
      tags: ["introduction", "basics"]
    },
    {
      id: `${subject.toLowerCase()}-video-1`,
      title: `${subject} Explained`,
      description: `Visual explanation of key ${subject} concepts.`,
      url: "https://www.youtube.com/example",
      type: "video",
      level: "beginner",
      duration: "15 min",
      free: true,
      tags: ["visual learning", "explanation"]
    },
    {
      id: `${subject.toLowerCase()}-course-1`,
      title: `${subject} 101`,
      description: `Beginner-friendly course covering all ${subject} fundamentals.`,
      url: "https://www.coursera.org/example",
      type: "course",
      level: "beginner",
      duration: "4 weeks",
      free: true,
      tags: ["structured learning", "fundamentals"]
    },
    {
      id: `${subject.toLowerCase()}-book-1`,
      title: `The Complete Guide to ${subject}`,
      description: `Comprehensive guide to all aspects of ${subject}.`,
      url: "https://www.amazon.com/example",
      type: "book",
      level: "intermediate",
      free: false,
      tags: ["reference", "comprehensive"]
    },
    {
      id: `${subject.toLowerCase()}-tool-1`,
      title: `${subject} Practice Tool`,
      description: `Interactive tool to practice ${subject} concepts.`,
      url: "https://www.example-tool.com",
      type: "tool",
      level: "beginner",
      free: true,
      tags: ["interactive", "practice"]
    }
  ];
}
import OpenAI from "openai";
import { textGenerator } from "../huggingface";
import NodeCache from "node-cache";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define quiz related interfaces
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

// Cache for storing generated quizzes to reduce API calls
// TTL (Time To Live) is set to 3 hours (10800 seconds)
const quizCache = new NodeCache({ stdTTL: 10800, checkperiod: 600 });

// Quiz templates by subject to ensure consistent, high-quality questions
const quizTemplates: Record<string, QuizQuestion[]> = {
  "financial_literacy": [
    {
      id: 1,
      question: "If you earn $INCOME_AMOUNT per month and your expenses are $EXPENSE_AMOUNT, how much can you save each month?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 0,
      explanation: "To calculate savings, subtract your expenses from your income. $INCOME_AMOUNT - $EXPENSE_AMOUNT = $ANSWER_1."
    },
    {
      id: 2,
      question: "You're taking out a loan of $LOAN_AMOUNT with an interest rate of INTEREST_RATE% compounded annually. How much will you owe after 1 year if you make no payments?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 2,
      explanation: "To calculate the amount owed after 1 year with compound interest, use the formula: Principal × (1 + interest rate) = $LOAN_AMOUNT × (1 + INTEREST_RATE/100) = $ANSWER_3."
    },
    {
      id: 3,
      question: "If your monthly take-home pay is $INCOME_AMOUNT and financial experts recommend spending no more than PERCENT_AMOUNT% on housing, what's the maximum you should spend on rent or mortgage?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 1,
      explanation: "To calculate the maximum housing expense, multiply your income by the recommended percentage: $INCOME_AMOUNT × (PERCENT_AMOUNT/100) = $ANSWER_2."
    }
  ],
  "budgeting": [
    {
      id: 1,
      question: "Using the 50/30/20 budget rule, if your monthly income is $INCOME_AMOUNT, how much should you allocate for needs?",
      options: [
        "$ANSWER_1", 
        "$ANSWER_2", 
        "$ANSWER_3", 
        "$ANSWER_4"
      ],
      correctAnswer: 0,
      explanation: "The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings. 50% of $INCOME_AMOUNT is $ANSWER_1."
    },
    {
      id: 2,
      question: "If you want to save $GOAL_AMOUNT for a vacation in NUMBER_MONTHS months, how much do you need to set aside each month?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 3,
      explanation: "To calculate monthly savings needed, divide your goal by the number of months: $GOAL_AMOUNT ÷ NUMBER_MONTHS = $ANSWER_4."
    }
  ],
  "credit_and_debt": [
    {
      id: 1,
      question: "If you have a credit card with an APR of INTEREST_RATE% and a balance of $BALANCE_AMOUNT, approximately how much interest would you pay in one month if you make no payments?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 2,
      explanation: "Monthly interest is calculated as: Balance × (APR/12) = $BALANCE_AMOUNT × (INTEREST_RATE/12/100) = $ANSWER_3."
    },
    {
      id: 2,
      question: "If you have a $LOAN_AMOUNT loan with a TERM_YEARS-year term and an interest rate of INTEREST_RATE%, what will your approximate monthly payment be?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 1,
      explanation: "Using the loan payment formula, your monthly payment would be approximately $ANSWER_2, which includes both principal and interest."
    }
  ],
  "taxes": [
    {
      id: 1,
      question: "If your annual gross income is $INCOME_AMOUNT and your effective tax rate is TAX_RATE%, how much will you pay in taxes?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 0,
      explanation: "To calculate tax amount, multiply gross income by the tax rate: $INCOME_AMOUNT × (TAX_RATE/100) = $ANSWER_1."
    }
  ],
  "investing": [
    {
      id: 1,
      question: "If you invest $INVEST_AMOUNT at an annual return of RETURN_RATE% compounded annually, approximately how much will it be worth after TERM_YEARS years?",
      options: [
        "$ANSWER_1",
        "$ANSWER_2",
        "$ANSWER_3",
        "$ANSWER_4"
      ],
      correctAnswer: 3,
      explanation: "Using the compound interest formula: Principal × (1 + rate)^time = $INVEST_AMOUNT × (1 + RETURN_RATE/100)^TERM_YEARS = $ANSWER_4."
    }
  ]
};

/**
 * Fills a quiz template with real values to create a concrete question
 * @param template Template question
 * @param subject Subject area for the quiz
 * @returns Populated question
 */
async function populateTemplate(template: QuizQuestion, subject: string): Promise<QuizQuestion> {
  try {
    // Define variable ranges based on subject
    let variables: Record<string, any> = {};
    
    if (subject.toLowerCase().includes("financ") || subject.toLowerCase().includes("budget")) {
      variables = {
        INCOME_AMOUNT: Math.floor(Math.random() * 4000) + 2000, // $2000-$6000
        EXPENSE_AMOUNT: Math.floor(Math.random() * 2000) + 1000, // $1000-$3000
        LOAN_AMOUNT: Math.floor(Math.random() * 20000) + 5000, // $5000-$25000
        INTEREST_RATE: (Math.random() * 15 + 3).toFixed(2), // 3%-18%
        PERCENT_AMOUNT: [25, 28, 30, 33, 35][Math.floor(Math.random() * 5)], // Common percentages
        GOAL_AMOUNT: Math.floor(Math.random() * 3000) + 1000, // $1000-$4000
        NUMBER_MONTHS: Math.floor(Math.random() * 9) + 3, // 3-12 months
        BALANCE_AMOUNT: Math.floor(Math.random() * 5000) + 1000, // $1000-$6000
        TERM_YEARS: [3, 5, 10, 15, 30][Math.floor(Math.random() * 5)], // Common loan terms
        TAX_RATE: (Math.random() * 15 + 10).toFixed(2), // 10%-25%
        INVEST_AMOUNT: Math.floor(Math.random() * 10000) + 1000, // $1000-$11000
        RETURN_RATE: (Math.random() * 8 + 4).toFixed(2), // 4%-12%
      };
    }
    
    // Clone the template
    const question = { ...template };
    
    // Calculate the correct answer based on the template
    if (template.id === 1 && subject.toLowerCase().includes("financ")) {
      // Income - Expenses calculation
      const savings = variables.INCOME_AMOUNT - variables.EXPENSE_AMOUNT;
      variables.ANSWER_1 = savings.toFixed(2);
      variables.ANSWER_2 = (savings - 100).toFixed(2);
      variables.ANSWER_3 = (savings + 200).toFixed(2);
      variables.ANSWER_4 = (savings - 200).toFixed(2);
    } 
    else if (template.id === 2 && subject.toLowerCase().includes("financ")) {
      // Loan with interest calculation
      const amountOwed = variables.LOAN_AMOUNT * (1 + variables.INTEREST_RATE/100);
      variables.ANSWER_1 = (amountOwed - 100).toFixed(2);
      variables.ANSWER_2 = (amountOwed - 200).toFixed(2);
      variables.ANSWER_3 = amountOwed.toFixed(2);
      variables.ANSWER_4 = (amountOwed + 150).toFixed(2);
    }
    else if (template.id === 3 && subject.toLowerCase().includes("financ")) {
      // Housing percentage calculation
      const housingMax = variables.INCOME_AMOUNT * (variables.PERCENT_AMOUNT/100);
      variables.ANSWER_1 = (housingMax - 100).toFixed(2);
      variables.ANSWER_2 = housingMax.toFixed(2);
      variables.ANSWER_3 = (housingMax + 150).toFixed(2);
      variables.ANSWER_4 = (housingMax - 200).toFixed(2);
    }
    else if (template.id === 1 && subject.toLowerCase().includes("budget")) {
      // 50/30/20 rule calculation
      const needsAmount = variables.INCOME_AMOUNT * 0.5;
      variables.ANSWER_1 = needsAmount.toFixed(2);
      variables.ANSWER_2 = (variables.INCOME_AMOUNT * 0.3).toFixed(2);
      variables.ANSWER_3 = (variables.INCOME_AMOUNT * 0.2).toFixed(2);
      variables.ANSWER_4 = (needsAmount + 100).toFixed(2);
    }
    else if (template.id === 2 && subject.toLowerCase().includes("budget")) {
      // Savings goal calculation
      const monthlySavings = variables.GOAL_AMOUNT / variables.NUMBER_MONTHS;
      variables.ANSWER_1 = (monthlySavings + 20).toFixed(2);
      variables.ANSWER_2 = (monthlySavings - 15).toFixed(2);
      variables.ANSWER_3 = (monthlySavings + 50).toFixed(2);
      variables.ANSWER_4 = monthlySavings.toFixed(2);
    }
    else if (template.id === 1 && subject.toLowerCase().includes("credit")) {
      // Credit card interest calculation
      const monthlyInterest = variables.BALANCE_AMOUNT * (variables.INTEREST_RATE/12/100);
      variables.ANSWER_1 = (monthlyInterest - 5).toFixed(2);
      variables.ANSWER_2 = (monthlyInterest + 10).toFixed(2);
      variables.ANSWER_3 = monthlyInterest.toFixed(2);
      variables.ANSWER_4 = (monthlyInterest * 2).toFixed(2);
    }
    else if (template.id === 2 && subject.toLowerCase().includes("credit")) {
      // Loan payment calculation (simplified)
      const r = variables.INTEREST_RATE / 100 / 12;
      const n = variables.TERM_YEARS * 12;
      const monthlyPayment = variables.LOAN_AMOUNT * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      variables.ANSWER_1 = (monthlyPayment - 25).toFixed(2);
      variables.ANSWER_2 = monthlyPayment.toFixed(2);
      variables.ANSWER_3 = (monthlyPayment + 30).toFixed(2);
      variables.ANSWER_4 = (monthlyPayment - 50).toFixed(2);
    }
    else if (template.id === 1 && subject.toLowerCase().includes("tax")) {
      // Tax calculation
      const taxAmount = variables.INCOME_AMOUNT * (variables.TAX_RATE/100);
      variables.ANSWER_1 = taxAmount.toFixed(2);
      variables.ANSWER_2 = (taxAmount + 100).toFixed(2);
      variables.ANSWER_3 = (taxAmount - 200).toFixed(2);
      variables.ANSWER_4 = (taxAmount * 1.1).toFixed(2);
    }
    else if (template.id === 1 && subject.toLowerCase().includes("invest")) {
      // Investment growth calculation
      const futureValue = variables.INVEST_AMOUNT * Math.pow(1 + variables.RETURN_RATE/100, variables.TERM_YEARS);
      variables.ANSWER_1 = (futureValue * 0.9).toFixed(2);
      variables.ANSWER_2 = (futureValue * 0.95).toFixed(2);
      variables.ANSWER_3 = (futureValue * 1.05).toFixed(2);
      variables.ANSWER_4 = futureValue.toFixed(2);
    }
    
    // Replace all variables in the question text, options, and explanation
    let questionText = template.question;
    let explanation = template.explanation;
    const options = [...template.options];
    
    // Replace variables in question text
    for (const [key, value] of Object.entries(variables)) {
      questionText = questionText.replace(new RegExp(key, 'g'), value.toString());
      explanation = explanation.replace(new RegExp(key, 'g'), value.toString());
      
      for (let i = 0; i < options.length; i++) {
        options[i] = options[i].replace(new RegExp(key, 'g'), value.toString());
      }
    }
    
    return {
      ...question,
      question: questionText,
      options: options,
      explanation: explanation
    };
  } catch (error) {
    console.error("Error populating template:", error);
    return template; // Return the original template as fallback
  }
}

/**
 * Gets the appropriate quiz templates for a subject
 * @param subject Topic for the quiz
 * @returns Array of template questions
 */
function getTemplatesForSubject(subject: string): QuizQuestion[] {
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes("financ") || subjectLower.includes("money") || subjectLower.includes("economic")) {
    return quizTemplates.financial_literacy;
  } else if (subjectLower.includes("budget")) {
    return quizTemplates.budgeting;
  } else if (subjectLower.includes("credit") || subjectLower.includes("debt") || subjectLower.includes("loan")) {
    return quizTemplates.credit_and_debt;
  } else if (subjectLower.includes("tax")) {
    return quizTemplates.taxes;
  } else if (subjectLower.includes("invest") || subjectLower.includes("retirement") || subjectLower.includes("saving")) {
    return quizTemplates.investing;
  }
  
  // Return a mix of financial templates as default
  return [
    ...quizTemplates.financial_literacy.slice(0, 1),
    ...quizTemplates.budgeting.slice(0, 1),
    ...quizTemplates.credit_and_debt.slice(0, 1)
  ];
}

/**
 * Generates quiz using OpenAI API
 * @param subject Subject to create quiz about
 * @param difficulty Level of difficulty
 * @param numberOfQuestions Number of questions to generate
 * @param topics Specific topics to focus on
 * @returns Generated quiz with questions
 */
async function generateQuizWithOpenAI(
  subject: string,
  difficulty: string,
  numberOfQuestions: number = 5,
  topics: string[] = []
): Promise<Quiz> {
  // Build prompt for OpenAI
  const prompt = `
    Create ${numberOfQuestions} multiple-choice quiz questions about ${subject} at a ${difficulty} level.
    ${topics.length > 0 ? `Focus on these specific topics: ${topics.join(', ')}.` : ''}
    
    If the subject is related to finances, focus on practical math for life skills including:
    - Calculating income versus expenses
    - Understanding how interest rates affect payments
    - Budgeting calculations
    - Smart consumer choices
    
    For each question:
    1. Provide a clear, concise question with practical real-world scenarios
    2. Give exactly 4 possible answers with only one correct answer
    3. Mark which answer is correct (0-3, where 0 is the first option)
    4. Include a brief explanation of why the correct answer is right
    
    Format the response as a valid JSON object with this structure:
    {
      "questions": [
        {
          "id": number,
          "question": string,
          "options": string[],
          "correctAnswer": number,
          "explanation": string
        }
      ]
    }
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      {
        role: "system",
        content: "You are an expert educational content creator specializing in creating engaging quiz questions. Your answers should be accurate, educational, and appropriate for the specified difficulty level."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });
  
  // Parse the response
  if (!response.choices[0].message.content) {
    throw new Error('No content received from OpenAI');
  }
  
  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

/**
 * Generates quiz using Hugging Face text generation models
 * @param subject Subject to create quiz about
 * @param difficulty Level of difficulty
 * @param numberOfQuestions Number of questions to generate
 * @returns Generated quiz with questions
 */
async function generateQuizWithHuggingFace(
  subject: string,
  difficulty: string,
  numberOfQuestions: number = 3
): Promise<Quiz> {
  try {
    // Use template-based approach with Hugging Face
    const templates = getTemplatesForSubject(subject);
    const questions: QuizQuestion[] = [];
    
    // Populate a subset of templates based on the number requested
    for (let i = 0; i < Math.min(numberOfQuestions, templates.length); i++) {
      const populatedQuestion = await populateTemplate(templates[i], subject);
      questions.push({
        ...populatedQuestion,
        id: i + 1 // Ensure sequential IDs
      });
    }
    
    return { questions };
  } catch (error) {
    console.error("Error generating quiz with Hugging Face:", error);
    throw error;
  }
}

/**
 * Generate quiz using a hybrid approach (templates, HuggingFace, OpenAI)
 * @param subject Subject area for the quiz
 * @param difficulty Level of difficulty
 * @param numberOfQuestions Number of questions to generate
 * @param topics Specific topics to focus on
 * @returns Generated quiz with questions
 */
export async function generateQuiz(
  subject: string,
  difficulty: string = "beginner",
  numberOfQuestions: number = 5,
  topics: string[] = []
): Promise<Quiz> {
  try {
    // Create a cache key based on input parameters
    const cacheKey = `quiz_${subject}_${difficulty}_${numberOfQuestions}_${topics.join('_')}`;
    
    // Check if we have this quiz cached
    const cachedQuiz = quizCache.get<Quiz>(cacheKey);
    if (cachedQuiz) {
      console.log("Serving quiz from cache");
      return cachedQuiz;
    }
    
    let quiz: Quiz;
    
    // Use different strategies based on subject to create variety
    // For financial literacy, use our templates and math calculations
    if (
      subject.toLowerCase().includes("financ") || 
      subject.toLowerCase().includes("money") || 
      subject.toLowerCase().includes("budget") ||
      subject.toLowerCase().includes("math")
    ) {
      quiz = await generateQuizWithHuggingFace(subject, difficulty, numberOfQuestions);
    } 
    // For other subjects, use OpenAI for richer content
    else {
      quiz = await generateQuizWithOpenAI(subject, difficulty, numberOfQuestions, topics);
    }
    
    // Cache the result for future requests
    quizCache.set(cacheKey, quiz);
    
    return quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Fallback strategy if primary method fails
    try {
      console.log("Falling back to alternative quiz generation method");
      
      // If OpenAI failed, try Hugging Face templates; if Hugging Face failed, try OpenAI
      if (
        subject.toLowerCase().includes("financ") || 
        subject.toLowerCase().includes("money") || 
        subject.toLowerCase().includes("budget")
      ) {
        return await generateQuizWithOpenAI(subject, difficulty, numberOfQuestions, topics);
      } else {
        return await generateQuizWithHuggingFace(subject, difficulty, numberOfQuestions);
      }
    } catch (fallbackError) {
      console.error("Fallback quiz generation also failed:", fallbackError);
      throw new Error("Failed to generate quiz with all available methods");
    }
  }
}

/**
 * Grade a completed quiz and provide feedback
 * @param userAnswers User's selected answers
 * @param correctAnswers The correct answers for comparison
 * @returns Score and feedback
 */
export async function gradeQuiz(
  userAnswers: number[],
  correctAnswers: number[]
): Promise<{
  score: number,
  percentageScore: number,
  feedback: string,
  incorrectQuestions: number[],
  suggestedActions?: string[]
}> {
  // Calculate basic score
  let correctCount = 0;
  const incorrectQuestions: number[] = [];
  
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      correctCount++;
    } else {
      incorrectQuestions.push(i);
    }
  }
  
  const percentageScore = (correctCount / userAnswers.length) * 100;
  
  // Generate feedback based on score
  let feedback = "";
  
  if (percentageScore === 100) {
    feedback = "Perfect score! You've mastered this topic.";
  } else if (percentageScore >= 80) {
    feedback = "Great work! You have a strong understanding of this material.";
  } else if (percentageScore >= 60) {
    feedback = "Good effort! You're grasping the fundamentals, but there's room for improvement.";
  } else if (percentageScore >= 40) {
    feedback = "You're making progress, but reviewing the material would be beneficial.";
  } else {
    feedback = "This topic needs more attention. Consider reviewing the fundamentals before trying again.";
  }
  
  return {
    score: correctCount,
    percentageScore,
    feedback,
    incorrectQuestions
  };
}
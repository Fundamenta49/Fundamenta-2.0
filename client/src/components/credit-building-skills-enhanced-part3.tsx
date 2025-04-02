// Continue from part 2
// This file contains the credit educational modules and resources

const CREDIT_EDUCATIONAL_MODULES: CreditSkillLevel[] = [
  {
    id: 'credit-basics',
    title: 'Credit Fundamentals',
    description: 'Learn what credit is and how it affects your financial future',
    icon: <BookOpen className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '10 min',
    relevantAge: '17+',
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
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Why Credit Matters at Your Age</h4>
          <p className="text-sm mt-1">
            As you transition to adult life, good credit becomes essential for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Renting your first apartment (landlords check credit)</li>
            <li>Getting a cell phone plan without a large deposit</li>
            <li>Qualifying for a car loan with reasonable interest rates</li>
            <li>Avoiding security deposits on utilities</li>
            <li>Future job opportunities (some employers check credit)</li>
            <li>Eventually buying a home with affordable mortgage terms</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            Credit Myth Busting for Young Adults
          </h4>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> You need to be 21 to start building credit.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> You can start building credit at 18, or earlier as an authorized user on a parent's card.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> You need to carry a balance on credit cards to build credit.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> Paying your balance in full each month still builds your credit history and saves you money on interest.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">✗</div>
              <p className="text-sm text-amber-800"><strong>Myth:</strong> Young people should avoid credit entirely until they have a full-time job.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
              <p className="text-sm text-amber-800"><strong>Fact:</strong> Starting to build credit responsibly while young gives you a head start on a positive credit history.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "As a 17-year-old, what's the BEST way to start building credit?",
        options: [
          "Taking out a personal loan",
          "Becoming an authorized user on a parent's credit card",
          "Getting multiple credit cards right away",
          "Waiting until you're 18"
        ],
        correctAnswer: 1,
        explanation: "Becoming an authorized user on a parent's credit card with good standing is the best way to begin building credit before you turn 18. Their positive payment history can help establish your credit profile.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "Which of these will a landlord most likely check when you apply for your first apartment?",
        options: [
          "Your GPA",
          "Your social media profiles",
          "Your credit report",
          "Your high school attendance record"
        ],
        correctAnswer: 2,
        explanation: "Landlords typically check your credit report to assess whether you're likely to pay rent consistently and on time. This is why building good credit early can help you secure housing more easily.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "What percentage of your available credit should you ideally use to maintain a good credit score?",
        options: [
          "0% (not using it at all)",
          "Less than 30%",
          "50-70%",
          "90-100% (maximizing your credit)"
        ],
        correctAnswer: 1,
        explanation: "Credit utilization should ideally be kept below 30% of your available credit. Using more than that can signal financial stress to lenders and potentially lower your score.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "If you're a college student with a part-time job making $800/month, what would be a responsible credit limit for your first credit card?",
        options: [
          "$5,000",
          "$2,500",
          "$1,000",
          "$500"
        ],
        correctAnswer: 3,
        explanation: "A $500 limit is most appropriate for your income level. It's enough to build credit through regular small purchases while limiting the risk of accumulating unmanageable debt.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "How might having no credit history affect your ability to get a cell phone plan?",
        options: [
          "It won't affect it at all",
          "You'll need a cosigner",
          "You might need to pay a security deposit",
          "You'll be limited to prepaid plans only"
        ],
        correctAnswer: 2,
        explanation: "Without established credit, many cell phone providers will require a security deposit to activate your service, which can be several hundred dollars that's held until you establish payment reliability.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: 'credit-scores',
    title: 'Understanding Credit Scores',
    description: 'Learn how credit scores work and what affects them',
    icon: <TrendingUp className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    relevantAge: '17+',
    videoKeywords: 'how credit scores work for beginners',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How Credit Scores Work</h3>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Score Basics</h4>
          <p className="text-sm mt-1">
            A credit score is a three-digit number, typically between 300 and 850, that represents your creditworthiness. Higher scores indicate lower risk to lenders.
          </p>
          <div className="mt-3">
            <div className="relative h-7 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex text-xs">
                <div className="w-1/5 bg-red-500 flex items-center justify-center text-white">300-579<br/>Poor</div>
                <div className="w-1/5 bg-orange-500 flex items-center justify-center text-white">580-669<br/>Fair</div>
                <div className="w-1/5 bg-yellow-500 flex items-center justify-center text-white">670-739<br/>Good</div>
                <div className="w-1/5 bg-lime-500 flex items-center justify-center text-white">740-799<br/>Very Good</div>
                <div className="w-1/5 bg-green-600 flex items-center justify-center text-white">800-850<br/>Excellent</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">What Makes Up Your Credit Score</h4>
          <div className="mt-4 space-y-3">
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[35%] h-full bg-green-600 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Payment History</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">35%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[30%] h-full bg-blue-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Amounts Owed</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">30%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[15%] h-full bg-purple-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Length of History</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">15%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[10%] h-full bg-orange-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">New Credit</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">10%</span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-8 flex rounded-lg bg-gray-200">
                <div className="w-[10%] h-full bg-pink-500 flex items-center px-3">
                  <span className="text-xs font-medium text-white">Credit Mix</span>
                </div>
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium">10%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Score Timeline for Young Adults</h4>
          <p className="text-sm mt-1">
            Building credit takes time. Here's a realistic timeline:
          </p>
          <div className="mt-4 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">No Credit to First Score</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              It typically takes 3-6 months of credit activity to generate your first score.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">First Year (Ages 18-19)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With consistent on-time payments, most young adults can achieve a score in the 650-700 range.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4 pb-2">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">2-3 Years (Ages 19-21)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With responsible management, scores can climb into the 700-740 range, qualifying you for better interest rates.
            </p>
          </div>
          <div className="mt-6 relative border-l-2 border-green-300 dark:border-green-700 pl-4">
            <div className="absolute w-4 h-4 bg-green-400 rounded-full -left-[9px] top-0"></div>
            <h5 className="text-sm font-medium">5+ Years (Ages 23+)</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              With continued responsible habits, scores above 750 become achievable, opening doors to the best financial products.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            How to Check Your Credit Score
          </h4>
          <p className="text-sm mt-1">
            There are several ways to check your credit score for free:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
            <li>Many credit card companies provide free scores</li>
            <li>AnnualCreditReport.com offers free credit reports from all three bureaus once per year</li>
            <li>Credit monitoring services like Credit Karma, Credit Sesame offer free access</li>
            <li>Some banks and credit unions offer free credit scores to their customers</li>
          </ul>
          <p className="text-sm mt-2 text-blue-800 dark:text-blue-300">
            <strong>Important:</strong> Checking your own score is a "soft inquiry" and does not hurt your credit score.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "What factor has the BIGGEST impact on your credit score?",
        options: [
          "The total amount of debt you have",
          "Your payment history (whether you pay on time)",
          "The length of your credit history",
          "The types of credit you have"
        ],
        correctAnswer: 1,
        explanation: "Payment history makes up 35% of your credit score, making it the most influential factor. Consistently paying bills on time is the best way to build and maintain a good credit score.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "How long does it typically take to generate your first credit score after opening your first credit account?",
        options: [
          "Immediately",
          "1 month",
          "3-6 months",
          "At least 1 year"
        ],
        correctAnswer: 2,
        explanation: "It typically takes 3-6 months of credit activity before you generate your first credit score. This is why it's beneficial to start building credit early, even with small accounts.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "Which action would most quickly LOWER your credit score?",
        options: [
          "Applying for several credit cards in a short time period",
          "Paying off a loan early",
          "Checking your own credit score",
          "Closing a recently paid-off credit card"
        ],
        correctAnswer: 0,
        explanation: "Multiple credit applications in a short period create several hard inquiries and can significantly lower your score right away. They suggest to lenders that you may be in financial trouble.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "As a 19-year-old with one year of credit history and perfect payment record, what credit score range could you realistically expect?",
        options: [
          "800-850",
          "740-799",
          "670-739",
          "580-669"
        ],
        correctAnswer: 2,
        explanation: "With just one year of perfect payment history, a score in the 'Good' range (670-739) is realistic. Excellent scores typically require longer credit histories and diverse credit types.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "What does 'credit utilization' refer to?",
        options: [
          "How frequently you use your credit cards",
          "The percentage of your available credit that you're using",
          "How many different types of credit you have",
          "How long you've had credit accounts"
        ],
        correctAnswer: 1,
        explanation: "Credit utilization is the percentage of your total available credit that you're currently using. For example, if you have a $1,000 limit and a $300 balance, your utilization is 30%.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: 'first-credit-card',
    title: 'Your First Credit Card',
    description: 'How to get and manage your first credit card responsibly',
    icon: <CreditCard className="h-5 w-5" />,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    relevantAge: '18-19',
    videoKeywords: 'first credit card for beginners',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Getting Your First Credit Card</h3>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">Credit Card Options for Beginners</h4>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-green-600" />
                Authorized User
              </h5>
              <p className="text-xs mt-1">
                Get added to a parent or family member's existing credit card. Their account history will appear on your credit report.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Easy to obtain</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds credit</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>No credit check</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Limited control</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-green-600" />
                Student Credit Card
              </h5>
              <p className="text-xs mt-1">
                Cards designed for college students with little to no credit history. Often have lower credit limits and student-focused rewards.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Student perks</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds independence</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Requires income</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Hard inquiry</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <Lock className="h-4 w-4 text-green-600" />
                Secured Credit Card
              </h5>
              <p className="text-xs mt-1">
                Requires a security deposit that typically becomes your credit limit. Almost anyone can qualify, even with no credit history.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>High approval odds</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Builds credit fast</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Requires deposit</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Few rewards</span>
                </div>
              </div>
            </div>
            
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-600" />
                Credit Builder Account
              </h5>
              <p className="text-xs mt-1">
                Not a traditional credit card, but a special account that reports payments to credit bureaus. You "borrow" money that's held in a locked account.
              </p>
              <div className="mt-2 grid grid-cols-2 text-xs gap-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>No credit needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Very safe option</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Not a real card</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span>Monthly fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h4 className="font-medium text-green-700 dark:text-green-400">What You Need to Apply</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li><strong>Age:</strong> Must be at least 18 years old</li>
            <li><strong>Income:</strong> Need some form of income (part-time job, regular allowance, scholarships)</li>
            <li><strong>Identification:</strong> Social security number and government ID</li>
            <li><strong>Contact Information:</strong> Address, phone, email</li>
            <li><strong>Bank Account:</strong> Checking account for payments</li>
          </ul>
          <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Under 21? The CARD Act requires you to either have independent income or a co-signer.
          </p>
        </div>
        
        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium text-blue-700 dark:text-blue-400">Using Your First Card Responsibly</h4>
          <div className="mt-3 space-y-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">1</div>
                Start with one card only
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Managing multiple cards is challenging for beginners. Master one card before considering others.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">2</div>
                Set up autopay for at least the minimum
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Missing payments severely damages your credit. Autopay ensures you never miss a payment due date.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">3</div>
                Pay in full each month
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Paying your balance in full avoids interest charges while still building credit. You don't need to carry a balance.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">4</div>
                Keep utilization under 30%
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                If your limit is $500, try not to carry a balance over $150. Low utilization signals responsible credit management.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-900">
              <h5 className="text-sm font-medium flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">5</div>
                Track all spending
              </h5>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Use the card's app or website to monitor transactions. Small purchases can add up quickly when using a card.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            Warning Signs You're Developing Bad Habits
          </h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-amber-800">
            <li>You're regularly maxing out your card</li>
            <li>You can't remember what you purchased</li>
            <li>You're only making minimum payments</li>
            <li>You're using the card for impulse purchases</li>
            <li>You're paying late fees</li>
            <li>You're using the card for everyday expenses you can't afford</li>
          </ul>
          <p className="text-xs mt-2 font-medium text-amber-800">
            If you notice these patterns, it's time to reassess your credit card habits before they damage your financial future.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "As an 18-year-old with no credit history, which of these credit cards would likely be EASIEST to get approved for?",
        options: [
          "A premium rewards card with airline miles",
          "A cash-back card with no annual fee",
          "A secured credit card requiring a $200 deposit",
          "A store credit card from a luxury retailer"
        ],
        correctAnswer: 2,
        explanation: "A secured credit card is specifically designed for people with no credit history. The security deposit reduces the lender's risk, making approval much more likely than with unsecured cards.",
        difficulty: "beginner"
      },
      {
        id: 2,
        question: "What's the MOST important habit to develop with your first credit card?",
        options: [
          "Maximizing reward points",
          "Paying your bill on time every month",
          "Increasing your credit limit quickly",
          "Using the card for every purchase"
        ],
        correctAnswer: 1,
        explanation: "Paying your bill on time is absolutely critical. Payment history is the biggest factor in your credit score, and even one late payment can significantly damage your score for years.",
        difficulty: "beginner"
      },
      {
        id: 3,
        question: "If you get a credit card with a $500 limit, how much should you aim to spend on it each month to optimize your credit score?",
        options: [
          "As close to $0 as possible",
          "No more than $150 (30%)",
          "Around $250-$350 (50-70%)",
          "The full $500 to show you can handle credit"
        ],
        correctAnswer: 1,
        explanation: "Keeping your utilization under 30% ($150 on a $500 limit) is ideal for your credit score. This shows you're using credit responsibly without relying too heavily on it.",
        difficulty: "beginner"
      },
      {
        id: 4,
        question: "Which of these should you AVOID when getting your first credit card?",
        options: [
          "Setting up account alerts for all purchases",
          "Reading the full terms and conditions",
          "Applying for multiple cards at once to see which approves you",
          "Getting a card with no annual fee"
        ],
        correctAnswer: 2,
        explanation: "Applying for multiple cards at once creates several hard inquiries on your credit report, which can lower your score. Each application also makes lenders more hesitant to approve you.",
        difficulty: "beginner"
      },
      {
        id: 5,
        question: "What should you do if you can't qualify for a traditional credit card?",
        options: [
          "Borrow someone else's card occasionally",
          "Wait until you turn 21 to apply again",
          "Consider alternatives like becoming an authorized user or getting a secured card",
          "Use a debit card instead and forget about building credit for now"
        ],
        correctAnswer: 2,
        explanation: "There are good alternatives if you can't qualify for a traditional credit card. Becoming an authorized user on a parent's card or getting a secured card are legitimate ways to start building credit.",
        difficulty: "beginner"
      }
    ]
  }
];
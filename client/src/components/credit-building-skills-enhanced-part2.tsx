// Continue from part 1
// This file contains the credit journeys, milestones, and scenarios data

const CREDIT_JOURNEYS: CreditJourneyPath[] = [
  {
    id: 'first-credit',
    title: 'Getting Your First Credit Card',
    description: 'Learn how to get your first credit card responsibly and build your credit history from scratch',
    icon: <CreditCard className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'research-cards',
        title: 'Research Student Credit Cards',
        description: 'Find cards designed for students with no credit history',
        completed: false,
        pointsAwarded: 10,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'secured-card',
        title: 'Apply for a Secured Credit Card',
        description: 'Get a secured card that requires a security deposit',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'authorized-user',
        title: 'Become an Authorized User',
        description: 'Ask a parent to add you as an authorized user on their card',
        completed: false,
        pointsAwarded: 20,
        creditScoreImpact: 30,
        timeToImpact: '1-2 months'
      },
      {
        id: 'first-payment',
        title: 'Make Your First On-Time Payment',
        description: 'Pay your credit card bill on time and in full',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 5,
        timeToImpact: '1 month'
      },
      {
        id: 'six-months-payments',
        title: 'Six Months of On-Time Payments',
        description: 'Maintain a perfect payment record for 6 months',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 40,
        timeToImpact: '6 months'
      }
    ],
    scenarios: [
      {
        id: 'first-card-choice',
        title: 'Choosing Your First Card',
        description: 'You\'re ready to get your first credit card. Which option is best for building credit?',
        options: [
          {
            id: 'store-card',
            text: 'Apply for a retail store card with 20% off your first purchase',
            impact: {
              creditScore: -5,
              timeframe: 'Short-term',
              explanation: 'Store cards often have high interest rates and low credit limits. The application will create a hard inquiry on your credit.'
            }
          },
          {
            id: 'student-card',
            text: 'Apply for a student credit card with no annual fee',
            impact: {
              creditScore: 10,
              timeframe: 'Medium-term',
              explanation: 'Student cards are designed for first-time users and often have benefits for on-time payments.'
            }
          },
          {
            id: 'premium-card',
            text: 'Apply for a premium rewards card with a $95 annual fee',
            impact: {
              creditScore: -10,
              timeframe: 'Short-term',
              explanation: 'You\'ll likely be denied due to no credit history, resulting in a hard inquiry but no new credit.'
            }
          },
          {
            id: 'secured-card',
            text: 'Apply for a secured credit card with a $200 deposit',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Secured cards are excellent starter cards that almost anyone can qualify for. The deposit reduces the lender\'s risk.'
            }
          }
        ],
        recommendedOption: 'secured-card'
      },
      {
        id: 'credit-limit-usage',
        title: 'Managing Your Credit Limit',
        description: 'You have a new credit card with a $500 limit. How much should you aim to use each month?',
        options: [
          {
            id: 'full-limit',
            text: 'Use the full $500 limit and pay the minimum due each month',
            impact: {
              creditScore: -40,
              timeframe: 'Medium-term',
              explanation: 'High utilization (100%) negatively impacts your score, and paying only the minimum leads to interest charges.'
            }
          },
          {
            id: 'half-limit',
            text: 'Use about $250 (50%) and pay in full each month',
            impact: {
              creditScore: 0,
              timeframe: 'Medium-term',
              explanation: '50% utilization is still considered high and may limit score growth, though paying in full is good.'
            }
          },
          {
            id: 'thirty-percent',
            text: 'Keep usage under $150 (30%) and pay in full each month',
            impact: {
              creditScore: 25,
              timeframe: 'Medium-term',
              explanation: 'Keeping utilization under 30% and paying in full are both great habits for credit building.'
            }
          },
          {
            id: 'no-use',
            text: 'Don\'t use the card at all to avoid any debt',
            impact: {
              creditScore: -5,
              timeframe: 'Long-term',
              explanation: 'Cards need regular activity to help build credit. Inactive cards may eventually be closed by the issuer.'
            }
          }
        ],
        recommendedOption: 'thirty-percent'
      }
    ],
    tips: [
      'Always pay your credit card bill in full and on time every month',
      'Keep your credit utilization under 30% of your credit limit',
      'Don\'t apply for multiple cards when you\'re just starting out',
      'Set up autopay to avoid missing payment due dates',
      'Check your card\'s rewards program to maximize benefits'
    ],
    recommendedNextSteps: [
      'After 6-12 months of responsible use, check if you qualify for a credit limit increase',
      'After a year of on-time payments, consider applying for a card with better rewards',
      'Sign up for free credit monitoring to track your progress'
    ]
  },
  {
    id: 'auto-loan',
    title: 'Financing Your First Car',
    description: 'Navigate auto loans and learn how they affect your credit score',
    icon: <Car className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'research-auto-loan',
        title: 'Research Auto Loan Options',
        description: 'Compare rates from banks, credit unions, and dealerships',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'get-preapproved',
        title: 'Get Pre-approved for a Loan',
        description: 'Secure loan approval before shopping for a car',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: -5,
        timeToImpact: 'Short-term (due to credit inquiry)'
      },
      {
        id: 'make-down-payment',
        title: 'Make a 20% Down Payment',
        description: 'Reduce your loan amount with a substantial down payment',
        completed: false,
        pointsAwarded: 30,
        creditScoreImpact: 10,
        timeToImpact: 'Medium-term'
      },
      {
        id: 'six-months-auto-payments',
        title: 'Six Months of Auto Loan Payments',
        description: 'Consistently pay your car loan on time for 6 months',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 35,
        timeToImpact: '6 months'
      }
    ],
    scenarios: [
      {
        id: 'auto-loan-term',
        title: 'Choosing Your Auto Loan Term',
        description: 'You\'re buying a $15,000 used car. Which loan term should you choose?',
        options: [
          {
            id: '72-month',
            text: '72-month loan at 6.5% interest ($252/month payment)',
            impact: {
              creditScore: 5,
              timeframe: 'Short-term',
              explanation: 'Lower monthly payments are easier to manage, but you\'ll pay more in interest over time and be underwater on the loan longer.'
            }
          },
          {
            id: '60-month',
            text: '60-month loan at 5.9% interest ($289/month payment)',
            impact: {
              creditScore: 10,
              timeframe: 'Medium-term',
              explanation: 'A balance of affordable payments and reasonable interest costs.'
            }
          },
          {
            id: '48-month',
            text: '48-month loan at 5.5% interest ($348/month payment)',
            impact: {
              creditScore: 15,
              timeframe: 'Medium-term',
              explanation: 'Higher monthly payments but less interest paid overall and faster equity building.'
            }
          },
          {
            id: '36-month',
            text: '36-month loan at 4.9% interest ($449/month payment)',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'The highest monthly payment but lowest total interest and fastest path to full ownership.'
            }
          }
        ],
        recommendedOption: '48-month'
      }
    ],
    tips: [
      'Get pre-approved for an auto loan before shopping for cars',
      'Make at least a 20% down payment to avoid being "underwater" on your loan',
      'Consider total cost of ownership, not just the monthly payment',
      'Shop around for the best interest rate, comparing at least 3 lenders',
      'Avoid extending your loan term just to lower monthly payments'
    ],
    recommendedNextSteps: [
      'Set up autopay for your auto loan to ensure on-time payments',
      'Consider making biweekly half-payments to pay off your loan faster',
      'After one year of on-time payments, check if refinancing could lower your rate'
    ]
  },
  {
    id: 'student-loans',
    title: 'Managing Student Loans',
    description: 'Learn how student loans affect your credit and strategies for responsible repayment',
    icon: <GraduationCap className="h-5 w-5" />,
    requiredAge: 17,
    milestones: [
      {
        id: 'understand-loan-terms',
        title: 'Understand Your Loan Terms',
        description: 'Know your interest rates, grace periods, and repayment options',
        completed: false,
        pointsAwarded: 20,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'set-up-loan-tracking',
        title: 'Set Up a Loan Tracking System',
        description: 'Create a system to track all your loans and payment dates',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'first-student-loan-payment',
        title: 'Make Your First Student Loan Payment',
        description: 'Begin your repayment journey on time after grace period ends',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 10,
        timeToImpact: '1 month'
      },
      {
        id: 'consistent-payments-1-year',
        title: 'One Year of On-Time Payments',
        description: 'Maintain consistent, on-time payments for a full year',
        completed: false,
        pointsAwarded: 50,
        creditScoreImpact: 40,
        timeToImpact: '12 months'
      }
    ],
    scenarios: [
      {
        id: 'repayment-plan-choice',
        title: 'Choosing a Repayment Plan',
        description: 'Your grace period is ending on $30,000 of student loans. Which repayment plan should you choose?',
        options: [
          {
            id: 'standard-plan',
            text: 'Standard 10-year repayment plan ($325/month payment)',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'Fixed payments that pay off loans in 10 years, building strong payment history.'
            }
          },
          {
            id: 'graduated-plan',
            text: 'Graduated plan starting at $200/month and increasing every 2 years',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Lower initial payments but higher total interest cost. Still builds positive payment history.'
            }
          },
          {
            id: 'extended-plan',
            text: 'Extended 25-year plan ($180/month payment)',
            impact: {
              creditScore: 10,
              timeframe: 'Long-term',
              explanation: 'Much lower payments but substantially higher total interest paid and slower debt reduction.'
            }
          },
          {
            id: 'income-based',
            text: 'Income-Based Repayment tied to your income level',
            impact: {
              creditScore: 15,
              timeframe: 'Long-term',
              explanation: 'Payments based on income, which can be very manageable. Positive for credit if payments are made consistently.'
            }
          }
        ],
        recommendedOption: 'standard-plan'
      }
    ],
    tips: [
      'Make payments during your grace period if possible to reduce accrued interest',
      'Consider consolidating federal loans if you have many separate loans',
      'Look into forgiveness programs if you work in public service, education, or healthcare',
      'Set up autopay for a small interest rate reduction on federal loans',
      'Pay more than the minimum when you can to reduce total interest paid'
    ],
    recommendedNextSteps: [
      'Create a budget that prioritizes your student loan payments',
      'Set calendar reminders for when your grace period ends',
      'Research if your employer offers student loan repayment assistance'
    ]
  },
  {
    id: 'rent-reporting',
    title: 'Building Credit Through Rent',
    description: 'Learn how to use your rental history to build credit without debt',
    icon: <HomeIcon className="h-5 w-5" />,
    requiredAge: 18,
    milestones: [
      {
        id: 'find-rent-reporting',
        title: 'Find a Rent Reporting Service',
        description: 'Research services that report rent payments to credit bureaus',
        completed: false,
        pointsAwarded: 15,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'enroll-rent-reporting',
        title: 'Enroll in Rent Reporting',
        description: 'Sign up for a service that reports your rent payments',
        completed: false,
        pointsAwarded: 25,
        creditScoreImpact: 0,
        timeToImpact: 'Immediate'
      },
      {
        id: 'six-months-rent-reporting',
        title: 'Six Months of Reported Rent',
        description: 'Build credit history with six months of reported rent payments',
        completed: false,
        pointsAwarded: 40,
        creditScoreImpact: 35,
        timeToImpact: '6 months'
      },
      {
        id: 'twelve-months-rent-reporting',
        title: 'One Year of Reported Rent',
        description: 'Establish a solid payment history with a year of rent reporting',
        completed: false,
        pointsAwarded: 60,
        creditScoreImpact: 50,
        timeToImpact: '12 months'
      }
    ],
    scenarios: [
      {
        id: 'rent-reporting-service',
        title: 'Choosing a Rent Reporting Service',
        description: 'You want to build credit through your $1,000 monthly rent payments. Which option should you choose?',
        options: [
          {
            id: 'free-landlord',
            text: 'Ask your landlord to report your rent payments for free',
            impact: {
              creditScore: 15,
              timeframe: 'Medium-term',
              explanation: 'Excellent if your landlord agrees, but many landlords don\'t have systems in place for reporting.'
            }
          },
          {
            id: 'credit-bureau-service',
            text: 'Use a service that reports to all three credit bureaus for $9.95/month',
            impact: {
              creditScore: 40,
              timeframe: 'Long-term',
              explanation: 'Most comprehensive reporting ensures your rent payments boost your score with all lenders.'
            }
          },
          {
            id: 'single-bureau',
            text: 'Use a free service that only reports to one credit bureau',
            impact: {
              creditScore: 20,
              timeframe: 'Long-term',
              explanation: 'Better than nothing, but limited since many lenders check multiple bureaus.'
            }
          },
          {
            id: 'no-reporting',
            text: 'Don\'t report rent payments and focus on other credit-building methods',
            impact: {
              creditScore: 0,
              timeframe: 'Immediate',
              explanation: 'Misses an opportunity to build credit with payments you\'re already making.'
            }
          }
        ],
        recommendedOption: 'credit-bureau-service'
      }
    ],
    tips: [
      'Always pay rent on time – late payments can hurt your credit score',
      'Ask your landlord if they already work with a rent reporting service',
      'Some services can report up to 24 months of past rent payments',
      'Compare fees and which credit bureaus each service reports to',
      'Keep proof of your rent payments in case of reporting errors'
    ],
    recommendedNextSteps: [
      'Set up autopay or calendar reminders to ensure on-time rent payments',
      'After 6 months of rent reporting, check your credit score to see the impact',
      'Consider combining rent reporting with a secured credit card for faster credit building'
    ]
  }
];
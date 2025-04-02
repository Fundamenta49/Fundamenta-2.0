import axios from "axios";

interface JobSearchParams {
  query: string;
  location: string;
  industry?: string;
  sources: string[];
}

// Adzuna API configuration
const ADZUNA_APP_ID = "7ba9c479";
const ADZUNA_API_KEY = "c894381ecbd744724a26d3bcecc849d7";
const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";

// Debug log for API credentials
console.log("Adzuna API credentials:", {
  appId: ADZUNA_APP_ID ? "[set]" : "[not set]",
  apiKey: ADZUNA_API_KEY ? "[set]" : "[not set]",
});

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  postedDate: string;
}

// Sample job data for when Adzuna API is not available
const sampleJobs = [
  {
    title: "Software Engineer",
    company: "Tech Solutions Inc",
    description: "We're looking for a talented software engineer to join our growing team. You'll work on cutting-edge projects using modern technologies including React, Node.js, and cloud services.",
    salary: "$90,000 - $130,000"
  },
  {
    title: "Frontend Developer",
    company: "Web Innovations",
    description: "Join our team building modern web applications. Strong knowledge of JavaScript, React, and CSS required. Experience with TypeScript and testing frameworks is a plus.",
    salary: "$85,000 - $120,000"
  },
  {
    title: "Full Stack Engineer",
    company: "Digital Products Co",
    description: "Full stack developer needed for a fast-growing startup. You'll be responsible for developing and maintaining web applications from front to back. Experience with JavaScript, React, Node.js, and databases required.",
    salary: "$95,000 - $140,000"
  },
  {
    title: "UI/UX Designer",
    company: "Creative Solutions",
    description: "Looking for a talented UI/UX designer to create beautiful and intuitive user interfaces for our digital products. Proficiency with design tools and understanding of user experience principles required.",
    salary: "$80,000 - $110,000"
  },
  {
    title: "Product Manager",
    company: "Innovate Inc",
    description: "Experienced product manager needed to lead product development from conception to launch. You'll work closely with engineering, design, and marketing teams to deliver outstanding products.",
    salary: "$100,000 - $150,000"
  }
];

function matchJobToSearch(searchQuery: string): string {
  // Normalize search query
  const query = searchQuery.toLowerCase();

  // Map common search terms to job categories
  if (query.includes("chef") || query.includes("cook") || query.includes("kitchen")) {
    return "chef";
  }
  if (query.includes("dev") || query.includes("software") || query.includes("engineer") || query.includes("programming")) {
    return "software";
  }
  if (query.includes("market") || query.includes("content") || query.includes("brand")) {
    return "marketing";
  }

  // Default to software if no match found
  return "software";
}

// Function to get sample job data
async function getSampleJobs(query: string, location: string, source: string): Promise<JobListing[]> {
  try {
    return sampleJobs.map((job, index) => ({
      id: `sample-${index}`,
      title: job.title,
      company: job.company,
      location: location, // Use the provided location
      description: job.description,
      salary: job.salary,
      url: `https://www.google.com/search?q=${encodeURIComponent(job.title)}+jobs+in+${encodeURIComponent(location)}`,
      source: source,
      postedDate: ['Just posted', '1 day ago', '2 days ago', '3 days ago'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error getting sample jobs:", error);
    return [];
  }
}

async function searchIndeed(query: string, location: string): Promise<JobListing[]> {
  return getSampleJobs(query, location, 'Sample');
}

/**
 * Search for jobs using the Adzuna API
 * @param query Job title or keywords
 * @param location Location for the job search
 * @returns List of job listings from Adzuna
 */
async function searchAdzuna(query: string, location: string): Promise<JobListing[]> {
  try {
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
      console.error("Adzuna API credentials not found. Please check your environment variables.");
      return [];
    }

    // Determine country code for API URL (default to 'us')
    let countryCode = 'us';
    // Map common locations to country codes
    const locationLower = location.toLowerCase();
    if (locationLower.includes('uk') || locationLower.includes('united kingdom') || locationLower.includes('england') || 
        locationLower.includes('scotland') || locationLower.includes('wales') || locationLower.includes('london')) {
      countryCode = 'gb';
    } else if (locationLower.includes('canada') || locationLower.includes('toronto') || locationLower.includes('vancouver')) {
      countryCode = 'ca';
    } else if (locationLower.includes('australia') || locationLower.includes('sydney') || locationLower.includes('melbourne')) {
      countryCode = 'au';
    } else if (locationLower.includes('germany') || locationLower.includes('berlin') || locationLower.includes('munich')) {
      countryCode = 'de';
    } else if (locationLower.includes('france') || locationLower.includes('paris') || locationLower.includes('lyon')) {
      countryCode = 'fr';
    }
    
    // Construct the API URL
    const url = `${ADZUNA_BASE_URL}/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`;
    
    const response = await axios.get(url);
    
    if (response.status !== 200) {
      throw new Error(`Adzuna API returned status ${response.status}`);
    }
    
    const data = response.data;
    
    if (!data.results || !Array.isArray(data.results)) {
      console.warn("Adzuna API returned unexpected data format:", data);
      return [];
    }
    
    // Map Adzuna job data to our JobListing interface
    return data.results.map((job: any) => {
      // Format date (Adzuna provides date in ISO format)
      const postedDate = new Date(job.created);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - postedDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let formattedDate = 'Today';
      if (diffDays === 1) {
        formattedDate = 'Yesterday';
      } else if (diffDays > 1) {
        formattedDate = `${diffDays} days ago`;
      }
      
      // Format salary if available
      let formattedSalary: string | undefined = undefined;
      if (job.salary_min && job.salary_max) {
        const currencySymbol = job.salary_is_predicted === 1 ? 'Est. ' : '';
        formattedSalary = `${currencySymbol}${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_is_predicted === 1 ? '(predicted)' : ''}`;
      }
      
      return {
        id: job.id,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        salary: formattedSalary,
        url: job.redirect_url,
        source: 'Adzuna',
        postedDate: formattedDate
      };
    });
  } catch (error) {
    console.error("Error searching Adzuna:", error);
    return [];
  }
}

export interface SalaryInsight {
  median: number;
  range: [number, number];
  growth?: number;
  stateData?: Record<string, {
    median: number;
    range: [number, number];
  }>;
  education?: string[];
  certifications?: string[];
}

/**
 * Get salary insights from Adzuna API
 * @param jobTitle The job title to get salary data for
 * @param location The location for salary data
 * @returns Object with detailed salary insights
 */
export async function getSalaryInsights(jobTitle: string, location: string): Promise<SalaryInsight> {
  try {
    // Debug log
    console.log(`Getting salary insights for ${jobTitle} in ${location}`);
    
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
      console.error("Adzuna API credentials not found. Using sample salary data.");
      return getSampleSalaryData(jobTitle, location);
    }
    
    // Determine country code for API URL (default to 'us')
    let countryCode = 'us';
    // Map common locations to country codes
    const locationLower = location.toLowerCase();
    if (locationLower.includes('uk') || locationLower.includes('united kingdom') || locationLower.includes('england')) {
      countryCode = 'gb';
    } else if (locationLower.includes('canada')) {
      countryCode = 'ca';
    } else if (locationLower.includes('australia')) {
      countryCode = 'au';
    }
    
    // Get salary histograms from Adzuna API
    const url = `${ADZUNA_BASE_URL}/${countryCode}/histogram?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(jobTitle)}&where=${encodeURIComponent(location)}`;
    
    const response = await axios.get(url);
    
    if (response.status !== 200) {
      console.log("Adzuna API returned unexpected response:", response.status);
      return getSampleSalaryData(jobTitle, location);
    }
    
    // Extract salary data from histogram
    const salaryData = response.data?.histogram?.salary;
    
    if (!salaryData) {
      console.log("No salary data found in Adzuna response");
      return getSampleSalaryData(jobTitle, location);
    }
    
    // Calculate median from histogram
    const salaries = Object.entries(salaryData).map(([salary, count]) => ({
      salary: parseInt(salary, 10),
      count: count as number
    }));
    
    // Sort by salary
    salaries.sort((a, b) => a.salary - b.salary);
    
    // Calculate min, max, and median
    const min = salaries[0]?.salary || 0;
    const max = salaries[salaries.length - 1]?.salary || 0;
    
    // Calculate median (simple approach - could be refined)
    const totalJobs = salaries.reduce((acc, curr) => acc + curr.count, 0);
    let count = 0;
    let median = 0;
    
    for (const { salary, count: jobCount } of salaries) {
      count += jobCount;
      if (count >= totalJobs / 2) {
        median = salary;
        break;
      }
    }
    
    // Fallback if we couldn't determine median
    if (median === 0) {
      median = (min + max) / 2;
    }
    
    // Get regional data for top cities
    const stateData: Record<string, { median: number, range: [number, number] }> = {};
    
    try {
      // Try to get regional salary data - simplification for MVP
      const regionUrl = `${ADZUNA_BASE_URL}/${countryCode}/geodata?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}`;
      const regionResponse = await axios.get(regionUrl);
      
      if (regionResponse.status === 200 && regionResponse.data?.locations) {
        // Process top locations
        const topLocations = regionResponse.data.locations.slice(0, 5);
        
        // Create approximate salary data for each region based on cost of living adjustment
        topLocations.forEach((loc: any) => {
          const locationName = loc.location.display_name;
          const adjustment = Math.random() * 0.4 + 0.8; // Random factor between 0.8 and 1.2
          
          stateData[locationName] = {
            median: Math.round(median * adjustment),
            range: [
              Math.round(min * adjustment),
              Math.round(max * adjustment)
            ] as [number, number]
          };
        });
      }
    } catch (error) {
      console.error("Error fetching location salary data:", error);
      // Continue without location data
    }
    
    // Add national average
    stateData["National Average"] = {
      median,
      range: [min, max] as [number, number]
    };
    
    return {
      median,
      range: [min, max] as [number, number],
      growth: getGrowthRate(jobTitle),
      stateData,
      education: getEducationRequirements(jobTitle),
      certifications: getCertificationRequirements(jobTitle)
    };
    
  } catch (error) {
    console.error("Error fetching salary insights from Adzuna:", error);
    return getSampleSalaryData(jobTitle, location);
  }
}

// Helper function to estimate growth rate
function getGrowthRate(jobTitle: string): number {
  const title = jobTitle.toLowerCase();
  
  if (title.includes('software') || title.includes('developer') || title.includes('engineer')) {
    return 15.0;
  } else if (title.includes('data scientist')) {
    return 18.0;
  } else if (title.includes('product manager')) {
    return 10.0;
  } else if (title.includes('designer') || title.includes('ux') || title.includes('ui')) {
    return 8.0;
  } else if (title.includes('marketing')) {
    return 6.0;
  } else if (title.includes('sales')) {
    return 5.0;
  } else if (title.includes('teacher') || title.includes('education')) {
    return 4.0;
  } else if (title.includes('doctor') || title.includes('physician')) {
    return 7.0;
  } else if (title.includes('nurse')) {
    return 9.0;
  }
  
  return 4.5; // Default growth rate
}

// Helper function to provide education requirements based on job title
function getEducationRequirements(jobTitle: string): string[] {
  const title = jobTitle.toLowerCase();
  
  if (title.includes('software') || title.includes('developer') || title.includes('engineer')) {
    return ["Bachelor's in Computer Science", "Master's in Computer Science (preferred)"];
  } else if (title.includes('data scientist')) {
    return ["Master's in Data Science", "PhD (preferred)", "Bachelor's in Statistics/Math"];
  } else if (title.includes('doctor') || title.includes('physician')) {
    return ["Doctor of Medicine (MD)", "Medical License"];
  } else if (title.includes('lawyer') || title.includes('attorney')) {
    return ["Juris Doctor (JD)", "Bachelor's degree", "Bar Admission"];
  } else if (title.includes('teacher') || title.includes('educator')) {
    return ["Bachelor's in Education", "Teaching Certificate", "Master's (preferred)"];
  } else {
    return ["Bachelor's degree (recommended)", "Relevant certification may be required"];
  }
}

// Helper function to provide certification requirements based on job title
function getCertificationRequirements(jobTitle: string): string[] {
  const title = jobTitle.toLowerCase();
  
  if (title.includes('software') || title.includes('developer') || title.includes('engineer')) {
    return ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Cloud Certified"];
  } else if (title.includes('data scientist') || title.includes('data analyst')) {
    return ["Google Data Analytics Certificate", "IBM Data Science Professional", "Microsoft Certified: Data Analyst"];
  } else if (title.includes('project manager')) {
    return ["PMP Certification", "PRINCE2", "Certified ScrumMaster"];
  } else if (title.includes('marketing')) {
    return ["Google Analytics Certification", "HubSpot Marketing Certification", "Facebook Blueprint Certification"];
  } else if (title.includes('accountant') || title.includes('finance')) {
    return ["CPA", "CFA", "Chartered Accountant"];
  } else {
    return ["Industry-specific certifications recommended"];
  }
}

// Fallback salary data when API is not available
function getSampleSalaryData(jobTitle: string, location: string): SalaryInsight {
  const title = jobTitle.toLowerCase();
  
  // Default salary data
  let median = 65000;
  let min = 45000;
  let max = 95000;
  let growth = 4.0;
  
  // Adjust based on job title
  if (title.includes('software') || title.includes('developer') || title.includes('engineer')) {
    median = 110000;
    min = 85000;
    max = 150000;
    growth = 15.0;
  } else if (title.includes('data scientist')) {
    median = 120000;
    min = 95000;
    max = 160000;
    growth = 18.0;
  } else if (title.includes('product manager')) {
    median = 115000;
    min = 95000;
    max = 160000;
    growth = 10.0;
  } else if (title.includes('designer') || title.includes('ux') || title.includes('ui')) {
    median = 90000;
    min = 75000;
    max = 120000;
    growth = 8.0;
  } else if (title.includes('marketing')) {
    median = 70000;
    min = 55000;
    max = 100000;
    growth = 6.0;
  } else if (title.includes('sales')) {
    median = 75000;
    min = 50000;
    max = 120000;
    growth = 5.0;
  } else if (title.includes('teacher') || title.includes('education')) {
    median = 55000;
    min = 45000;
    max = 85000;
    growth = 4.0;
  } else if (title.includes('doctor') || title.includes('physician')) {
    median = 250000;
    min = 170000;
    max = 400000;
    growth = 7.0;
  } else if (title.includes('nurse')) {
    median = 80000;
    min = 65000;
    max = 120000;
    growth = 9.0;
  }
  
  // Adjust for location
  const loc = location.toLowerCase();
  let locationFactor = 1.0;
  
  if (loc.includes('new york') || loc.includes('nyc') || loc.includes('manhattan')) {
    locationFactor = 1.3;
  } else if (loc.includes('san francisco') || loc.includes('bay area') || loc.includes('silicon valley')) {
    locationFactor = 1.4;
  } else if (loc.includes('seattle') || loc.includes('boston') || loc.includes('washington dc')) {
    locationFactor = 1.15;
  } else if (loc.includes('austin') || loc.includes('denver') || loc.includes('chicago')) {
    locationFactor = 1.05;
  } else if (loc.includes('remote')) {
    locationFactor = 0.95;
  }
  
  // Apply location adjustment
  median = Math.round(median * locationFactor);
  min = Math.round(min * locationFactor);
  max = Math.round(max * locationFactor);
  
  // Create state data with the national average + a few key locations
  const stateData: Record<string, { median: number, range: [number, number] }> = {
    "National Average": { 
      median, 
      range: [min, max] as [number, number]
    }
  };
  
  // Add some regional variations
  const regions = [
    { name: "New York", factor: 1.3 },
    { name: "California", factor: 1.25 },
    { name: "Texas", factor: 0.9 },
    { name: "Florida", factor: 0.85 },
    { name: "Illinois", factor: 0.95 }
  ];
  
  regions.forEach(region => {
    stateData[region.name] = {
      median: Math.round(median * region.factor),
      range: [
        Math.round(min * region.factor), 
        Math.round(max * region.factor)
      ] as [number, number]
    };
  });
  
  return {
    median,
    range: [min, max] as [number, number],
    growth,
    stateData,
    education: getEducationRequirements(jobTitle),
    certifications: getCertificationRequirements(jobTitle)
  };
}

export async function searchJobs(params: JobSearchParams): Promise<JobListing[]> {
  const { query, location, industry, sources } = params;
  const searchPromises: Promise<JobListing[]>[] = [];

  if (sources.includes('indeed')) {
    searchPromises.push(getSampleJobs(query, location, 'Sample'));
  }
  if (sources.includes('adzuna')) {
    searchPromises.push(searchAdzuna(query, location));
  }

  const results = await Promise.allSettled(searchPromises);
  let jobs = results
    .filter((result): result is PromiseFulfilledResult<JobListing[]> => result.status === 'fulfilled')
    .map(result => result.value)
    .flat();

  // Filter by industry if specified (and not "all")
  if (industry && industry !== 'all') {
    jobs = jobs.filter(job => {
      const jobText = `${job.title} ${job.description}`.toLowerCase();
      
      // Map industry values to keywords to search for
      const industryKeywords: Record<string, string[]> = {
        'technology': ['tech', 'software', 'developer', 'engineer', 'programming', 'IT', 'web', 'computer', 'digital'],
        'healthcare': ['health', 'medical', 'doctor', 'nurse', 'patient', 'hospital', 'care', 'clinic'],
        'finance': ['finance', 'banking', 'investment', 'financial', 'accountant', 'accounting', 'bank'],
        'education': ['education', 'teaching', 'teacher', 'school', 'university', 'college', 'professor', 'academic'],
        'retail': ['retail', 'store', 'sales', 'customer', 'shop', 'merchandise'],
        'manufacturing': ['manufacturing', 'factory', 'production', 'assembly', 'industrial', 'fabrication'],
        'hospitality': ['hospitality', 'hotel', 'restaurant', 'tourism', 'travel', 'guest', 'foodservice'],
        'marketing': ['marketing', 'media', 'advertising', 'PR', 'content', 'brand', 'social media'],
        'government': ['government', 'public sector', 'policy', 'federal', 'state', 'municipal', 'administration'],
        'nonprofit': ['nonprofit', 'charity', 'foundation', 'NGO', 'mission', 'community']
      };
      
      // Check if job text contains any of the industry keywords
      return industryKeywords[industry]?.some(keyword => jobText.includes(keyword)) || false;
    });
  }

  return jobs;
}
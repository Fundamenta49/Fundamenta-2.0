import axios from 'axios';

// Career One Stop API constants
const BASE_URL = 'https://api.careeronestop.org/v1';
const USER_AGENT = 'Fundamenta Career Development Application';

// Interface for Career API responses
interface CareerInfoResponse {
  Occupations: {
    OccupationDetail: Array<{
      OnetCode: string;
      OnetTitle: string;
      OccupationDescription: string;
      Tasks: Array<{
        TaskDescription: string;
      }>;
      KnowledgeDataList: Array<{
        ElementName: string;
        ElementDescription: string;
      }>;
      SkillsDataList: Array<{
        ElementName: string;
        ElementDescription: string;
      }>;
      InterviewQuestions?: Array<{
        Question: string;
        Category: string;
      }>;
    }>;
  };
}

// Function to generate interview questions based on occupation
export async function getOccupationInterviewQuestions(
  occupation: string,
  apiKey: string
): Promise<string[]> {
  try {
    // Format the occupation for API (replace spaces with +)
    const formattedOccupation = occupation.replace(/\s+/g, '+');
    
    // Make API request
    const response = await axios.get(
      `${BASE_URL}/occupation/${formattedOccupation}/US/0/10`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Process the occupation data
    const data = response.data as CareerInfoResponse;
    
    if (!data.Occupations || !data.Occupations.OccupationDetail || data.Occupations.OccupationDetail.length === 0) {
      return generateFallbackQuestions(occupation);
    }
    
    const occupationDetail = data.Occupations.OccupationDetail[0];
    
    // Extract skills and knowledge
    const skills = occupationDetail.SkillsDataList?.map(skill => skill.ElementName) || [];
    const knowledge = occupationDetail.KnowledgeDataList?.map(k => k.ElementName) || [];
    
    // Generate questions based on the occupation data
    const questions = generateQuestionsFromOccupationData(
      occupationDetail.OnetTitle,
      occupationDetail.OccupationDescription,
      skills,
      knowledge,
      occupationDetail.Tasks?.map(task => task.TaskDescription) || []
    );
    
    return questions;
  } catch (error) {
    console.error('Error fetching career data:', error);
    return generateFallbackQuestions(occupation);
  }
}

// Generate questions based on occupation data
function generateQuestionsFromOccupationData(
  title: string,
  description: string,
  skills: string[],
  knowledge: string[],
  tasks: string[]
): string[] {
  const questions: string[] = [];
  
  // Add general questions about the role
  questions.push(
    `What experience do you have that's relevant to the ${title} role?`,
    `Why are you interested in working as a ${title}?`
  );
  
  // Add skill-based questions
  if (skills.length > 0) {
    const topSkills = skills.slice(0, 3);
    topSkills.forEach(skill => {
      questions.push(`How have you demonstrated ${skill} in your previous roles?`);
    });
  }
  
  // Add knowledge-based questions
  if (knowledge.length > 0) {
    const topKnowledge = knowledge.slice(0, 2);
    topKnowledge.forEach(k => {
      questions.push(`Can you explain your background in ${k}?`);
    });
  }
  
  // Add task-based questions
  if (tasks.length > 0) {
    const topTasks = tasks.slice(0, 3);
    topTasks.forEach(task => {
      questions.push(`How would you approach ${task.toLowerCase()}?`);
    });
  }
  
  // Add behavioral questions related to the field
  questions.push(
    `Describe a challenging situation you've faced in a similar role and how you handled it.`,
    `Tell me about a project you're particularly proud of in this field.`,
    `How do you stay current with trends and developments in ${title}?`,
    `What's the most difficult problem you've solved in this field?`
  );
  
  return questions;
}

// Generate fallback questions if the API fails
function generateFallbackQuestions(occupation: string): string[] {
  return [
    `What experience do you have that's relevant to ${occupation}?`,
    `Why are you interested in working as a ${occupation}?`,
    `What specific skills do you bring to this ${occupation} role?`,
    `Describe a challenging situation you've faced in a similar role.`,
    `How do you stay current with trends in ${occupation}?`,
    `What's a professional achievement you're proud of related to ${occupation}?`,
    `How do you approach problem-solving in your work as a ${occupation}?`,
    `Tell me about a time you had to learn a new skill quickly in this field.`,
    `How do you handle tight deadlines in a ${occupation} role?`,
    `What do you think are the most important qualities for success as a ${occupation}?`
  ];
}
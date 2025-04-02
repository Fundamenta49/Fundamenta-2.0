/**
 * This module handles the API calls for resume analysis
 */

export interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  }
}

/**
 * Sends the resume text to the server for AI analysis
 * @param resumeText The raw text of the resume
 * @returns A structured analysis of the resume
 */
export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    const response = await fetch('/api/resume-analysis/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze resume');
  }
}
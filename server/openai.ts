import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const openaiClient = openai;

/**
 * Generates an AI response using OpenAI's chat completions API.
 * 
 * @param prompt The user's message or prompt
 * @param systemPrompt The system prompt to set context and instructions
 * @param previousMessages Previous messages in the conversation for context
 * @param temperature Controls randomness (0-1), lower is more deterministic
 * @param jsonResponse Whether to request a JSON response format
 * @returns The AI-generated response
 */
export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [],
  temperature: number = 0.7,
  jsonResponse: boolean = false
): Promise<string> {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: prompt }
    ] as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;

    const options: any = {
      model: "gpt-4o",
      messages,
      temperature,
      max_tokens: 1000,
    };

    if (jsonResponse) {
      options.response_format = { type: "json_object" };
    }

    const response = await openai.chat.completions.create(options);
    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI generateResponse error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
    throw new Error("Failed to generate response: unknown error");
  }
}

/**
 * Analyzes the sentiment of the provided text.
 * 
 * @param text Text to analyze for sentiment
 * @returns Object with sentiment rating (1-5) and confidence score (0-1)
 */
export async function analyzeSentiment(text: string): Promise<{
  rating: number,
  confidence: number
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("OpenAI analyzeSentiment error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze sentiment: ${error.message}`);
    }
    throw new Error("Failed to analyze sentiment: unknown error");
  }
}

/**
 * Extracts structured data from text using OpenAI.
 * 
 * @param text Text to extract structured data from
 * @param schema JSON schema structure to extract
 * @returns Extracted structured data as an object
 */
export async function extractStructuredData(
  text: string,
  schema: Record<string, string>
): Promise<Record<string, any>> {
  try {
    const schemaDescription = Object.entries(schema)
      .map(([key, type]) => `${key}: ${type}`)
      .join(', ');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract the following information from the text in JSON format: ${schemaDescription}.
            Only include fields you can confidently extract. Return a valid JSON object.`,
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI extractStructuredData error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract structured data: ${error.message}`);
    }
    throw new Error("Failed to extract structured data: unknown error");
  }
}

/**
 * Analyzes an image using OpenAI's vision capabilities.
 * 
 * @param base64Image Base64-encoded image data
 * @param prompt The prompt describing what to analyze in the image
 * @returns Analysis of the image's contents
 */
export async function analyzeImage(
  base64Image: string,
  prompt: string = "Analyze this image in detail and describe its key elements."
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI analyzeImage error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error("Failed to analyze image: unknown error");
  }
}

/**
 * Generates an image using DALL-E based on the provided text prompt.
 * 
 * @param prompt Text description of the image to generate
 * @param size Size of the generated image (default: 1024x1024)
 * @returns URL of the generated image
 */
export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024"
): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("OpenAI generateImage error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("Failed to generate image: unknown error");
  }
}

// Export a type for the content structure OpenAI can handle
export type ContentItem = 
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

/**
 * Specialized prompt for generating a system roadmap visualization
 * 
 * @param systemDescription Description of the system to visualize
 * @returns Generated image URL
 */
export async function generateSystemRoadmap(systemDescription: string): Promise<string> {
  const prompt = `Create a professional, clean roadmap visualization for this system: ${systemDescription}. 
    Use a modern, minimal design with clear typography and vibrant colors. 
    Include milestone markers, timeline indicators, and logical flow between components. 
    Style it for a professional audience with a focus on clarity and information hierarchy.`;
  
  return generateImage(prompt);
}

/**
 * Specialized prompt for generating career path visualization
 * 
 * @param careerDescription Description of the career path to visualize
 * @returns Generated image URL
 */
export async function generateCareerPathVisualization(careerDescription: string): Promise<string> {
  const prompt = `Create a modern, engaging visualization of this career path: ${careerDescription}. 
    Use a clean design with professional icons representing each career stage. 
    Include directional arrows showing progression and potential branches. 
    Use a color scheme that feels professional yet inspiring, with clear typography for role titles.`;
  
  return generateImage(prompt);
}

/**
 * Specialized prompt for generating financial report visualizations
 * 
 * @param financialData Description of the financial data to visualize
 * @returns Generated image URL
 */
export async function generateFinancialChart(financialData: string): Promise<string> {
  const prompt = `Create a clean, professional financial chart visualization for: ${financialData}.
    Design it with a minimal aesthetic using blue and green color accents on a white background.
    Include clear axis labels, data points, and a legend if necessary. 
    The visualization should be easy to understand at a glance with a focus on data clarity.`;
  
  return generateImage(prompt);
}
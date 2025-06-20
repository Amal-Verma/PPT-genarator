import { getGeminiResponse } from "@/lib/gemini"
import { SubTopic } from "./type";

export const getSubTopics = async (mainPrompt: string, query: string, numResults: number): Promise<SubTopic[]> => {
  try {
    const commonRules = `
IMPORTANT RULES:
- Return your response in proper JSON format according to the schema provided
- Keep information focused, clear, and relevant to the topic
- Always include all required fields in your JSON response
- Every important subtopic should be included, but avoid redundancy.
- Do NOT include any markdown formatting in your content
- Do NOT wrap your response in a code block
- Do NOT include any explanation or comments outside of the JSON structure
- Don't go beyond the scope of the main topic.
- Important: Ensure that the subtopics are sequential and logically connected to the main topic.
`;

    const formatPrompt = `REMINDER: Return ONLY the JSON structure, nothing else.

structure:
[{
    "subTopic": "string", // The Title of the subtopic
    "description": "string" // A brief description of the subtopic
    "expand": boolean // Whether to expand this subtopic further (true/false) [note: only true when the subtopic can be further explored into meaningful subsubtopics for crash course]
    "webSearch": boolean // Whether to perform web search for this subtopic (true/false) [note: only true when the subtopic is not well known or needs more research]
  },
  ...]
`;

    // Construct the prompt for Gemini
    const prompt = `You are an expert researcher. Your task is to generate a list of sequential subtopics (max ${numResults}) related to the main topic: "${query}". Each subtopic should be concise and relevant.

Main Prompt and Instructions by the user:
${mainPrompt}
    
${commonRules}
${formatPrompt}`

    // Call the Gemini API to get the response
    const response = await getGeminiResponse(prompt);

    const data = JSON.parse(response);

    // Validate the response structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response format: Expected an array of subtopics");
    }

    // Ensure each item has the required fields
    for (const item of data) {
      if (typeof item.subTopic !== 'string' || typeof item.description !== 'string' || (item.expand !== undefined && typeof item.expand !== 'boolean')) {
        throw new Error("Invalid response format: Each item must have 'subTopic' and 'description' as strings");
      }
    }

    // Return the subtopics
    return data.map(item => ({
      subTopic: item.subTopic.trim(),
      description: item.description.trim(),
      expand: item.expand !== undefined ? item.expand : true, // Default to true if not provided
      webSearch: item.webSearch !== undefined ? item.webSearch : false // Default to false if not provided
    }));

  } catch (error) {
    console.error("Error fetching subtopics:", error);
    return [];
  }
}
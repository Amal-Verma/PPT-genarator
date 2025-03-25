import { getGeminiResponse } from './gemini';
import slideSchema from '../schemas/slideSchema';

/**
 * Generate presentation slide titles and types based on a prompt
 * 
 * @param {object} params - The parameters for the function
 * @param {string} params.prompt - The prompt describing the presentation topic
 * @param {number} params.numberOfSlides - The number of slides to generate titles for
 * @returns {Promise<Array<{title: string, type: string}>>} - Array of slide titles and types
 */
export async function generateSlideTitles({ 
  prompt, 
  numberOfSlides 
}: { 
  prompt: string, 
  numberOfSlides: number 
}): Promise<Array<{title: string, type: string}>> {
  // Get slide types and their prompt descriptions from the schema
  const slideTypes: Record<string, string> = {};
  
  for (const [type, config] of Object.entries(slideSchema.slides)) {
    if (config['title-Prompt']) {
      slideTypes[type] = config['title-Prompt'];
    }
  }
  
  // Create a prompt to generate slide titles and types
  const titlePrompts = Object.entries(slideTypes).map(([type, prompt]) => {
    return `${type}: ${prompt}`;
  }).join('\n');
  
  const generationPrompt = `
  I need to create a presentation about: "${prompt}"
  
  Please generate ${numberOfSlides} slide titles along with the slide type.
  Available slide types are: ${Object.keys(slideTypes).join(', ')}
  
  Here's information about each slide type:
  ${titlePrompts}
  
  Format your response as a JSON array with each item having a "title" and "type" field.
  Example:
  [
    {"title": "Introduction to AI", "type": "content"},
    {"title": "Wisdom from Alan Turing", "type": "quote"}
  ]
  
  Only include the JSON array in your response, no other text.
  `;
  
  try {
    // Get response from the AI
    const response = await getGeminiResponse(generationPrompt);
    
    // Parse the JSON response
    // Extract just the JSON part in case there's any extra text
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    const validatedResponse = parsedResponse.map((item: any) => ({
      title: item.title || "Untitled Slide",
      type: Object.keys(slideTypes).includes(item.type) ? item.type : "content"
    }));
    
    return validatedResponse;
  } catch (error) {
    console.error("Error generating slide titles:", error);
    // Return a default response in case of error
    return Array(numberOfSlides).fill(null).map((_, i) => ({
      title: `Slide ${i + 1}`,
      type: "content"
    }));
  }
}

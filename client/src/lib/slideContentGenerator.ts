import { getGeminiResponse } from './gemini';
import slideSchema from '../schemas/slideSchema';
import { SlideContent, ContentSlideContent, QuoteSlideContent } from '@/types/schema';

/**
 * Generate content for a slide based on its type and title
 * 
 * @param {object} params - The parameters for content generation
 * @param {string} params.title - The slide title
 * @param {string} params.type - The slide type
 * @param {string} params.topic - The overall presentation topic
 * @returns {Promise<SlideContent>} - Generated content for the slide
 */
export async function generateSlideContent({ 
  title, 
  type, 
  topic 
}: { 
  title: string; 
  type: string; 
  topic: string; 
}): Promise<SlideContent> {
  try {
    // Get the appropriate content prompt for the slide type
    const slideType = slideSchema.slides[type];
    
    if (!slideType || !slideType['content-Prompt']) {
      throw new Error(`Unknown slide type or missing content prompt: ${type}`);
    }
    
    // Common rules for all slide types
    const commonRules = `
IMPORTANT RULES:
- Return your response in proper JSON format according to the schema provided
- Do NOT include any markdown formatting in your content
- Keep information focused, clear, and relevant to the topic
- Do NOT include any explanation or comments outside of the JSON structure
- Always include all required fields in your JSON response
- Content should be professional and suitable for a business presentation
- Limit content to what can comfortably fit on a single slide
`;
    
    // Replace placeholders in the content prompt and add common rules
    const contentPrompt = `
${slideType['content-Prompt']
  .replace('{title}', title)
  .replace('{topic}', topic)}

${commonRules}

${slideType['format-Prompt'] || ''}

REMINDER: Return ONLY the JSON structure, nothing else.
`;
    
    // Get response from the AI
    const response = await getGeminiResponse(contentPrompt);
    
    // Try to extract and parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from the response");
    }
    
    const parsedContent = JSON.parse(jsonMatch[0]);
    
    // Process based on slide type
    if (type === 'content') {
      // Validate content structure
      if (!Array.isArray(parsedContent.content)) {
        return {
          title: title,
          content: parsedContent.content ? [String(parsedContent.content)] : 
            ['Content should be presented as bullet points for better readability.']
        } as ContentSlideContent;
      }
      
      return {
        title: parsedContent.title || title,
        content: parsedContent.content
      } as ContentSlideContent;
    }
    else if (type === 'quote') {
      return {
        quote: parsedContent.quote || "Failed to generate a relevant quote.",
        author: parsedContent.author || "Unknown"
      } as QuoteSlideContent;
    }
    
    // Default fallback
    throw new Error(`Unsupported slide type: ${type}`);
    
  } catch (error) {
    console.error(`Error generating content for slide "${title}" (${type}):`, error);
    
    // Return fallback content based on slide type with proper typing
    if (type === 'content') {
      return {
        title: title,
        content: ['Failed to generate content. Please try again.']
      } as ContentSlideContent;
    } else if (type === 'quote') {
      return {
        quote: "Content generation failed. Please try again.",
        author: "System"
      } as QuoteSlideContent;
    }
    
    throw error;
  }
}

import { getGeminiResponse } from './gemini';
import slideSchema from '../schemas/slideSchema';
import { 
  SlideContent, 
  ContentSlideContent,
  // TitleSlideContent,
  // IndexSlideContent
} from '@/types/schema';
import { withRetry } from '@/utils/retry';
import {
  parseSlideContent,
  getDefaultSlideContent
} from '../schemas/zodSchemas';
import { getTonePrompt } from '../schemas/toneSchema';

/**
 * Generate content for a slide based on its type and title
 * 
 * @param {object} params - The parameters for content generation
 * @param {string} params.title - The slide title
 * @param {string} params.type - The slide type
 * @param {string} params.topic - The overall presentation topic
 * @returns {Promise<SlideContent>} - Generated content for the slide
 */
async function generateSlideContentNoRetry({ 
  presentationName,
  title, 
  type, 
  topic,
  slideTitlesString,
  tone
}: { 
  presentationName: string;
  title: string; 
  type: string; 
  topic: string;
  slideTitlesString: string; 
  tone: string;
}): Promise<SlideContent> {
  try {
    if (type === "thankYou") {
      // Use parseSlideContent for consistency
      return parseSlideContent(
        JSON.stringify({
          message: `Thank you for attending this presentation!`,
          speakNote: ""
        }),
        "thankYou"
      );
    }
    // Get the appropriate content prompt for the slide type
    const slideType = slideSchema.slides[type];
    if (!slideType || !slideType['content-Prompt']) {
      throw new Error(`Unknown slide type or missing content prompt: ${type}`);
    }

    // Add tone to the prompt (always present)
    const tonePrompt = `\nTONE: ${getTonePrompt(tone)}\n`;

    // Common rules for all slide types
    const commonRules = `
IMPORTANT RULES:
- Return your response in proper JSON format according to the schema provided
- Do NOT include any markdown formatting in your content
- Do NOT wrap your response in a code block
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
  .replace('{topic}', topic)
  .replace('{presentationName}', presentationName)
  .replace('{slideTitlesString}', slideTitlesString)}
${tonePrompt}
${commonRules}
${slideType['format-Prompt'] || ''}

REMINDER: Return ONLY the JSON structure, nothing else.
`;
    
    // Get response from the AI
    const response = await getGeminiResponse(contentPrompt);
    return parseSlideContent(response, type);
  } catch (error) {
    console.error(`Error generating content for slide "${title}" (${type}):`, error);    
    throw error;
  }
}

export async function generateSlideContent(params: {
  presentationName: string;
  title: string;
  type: string;
  topic: string;
  slideTitlesString: string;
  tone: string;
}): Promise<SlideContent> {
  return withRetry(
    generateSlideContentNoRetry,
    [params],
    {
      onFail: () => {
        const { type, title, topic } = params;
        try {
          return getDefaultSlideContent(type, title, topic);
        } catch (error) {
          console.error(`Error creating fallback content for ${type} slide:`, error);
          return { title: title, content: ['Content generation failed.'] } as ContentSlideContent;
        }
      }
    }
  );
}

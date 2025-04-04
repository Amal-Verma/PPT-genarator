import { getGeminiResponse } from './gemini';
import slideSchema from '../schemas/slideSchema';
import { 
  SlideContent, 
  ContentSlideContent, 
  QuoteSlideContent, 
  TitleSlideContent, 
  IndexSlideContent, 
  ThankYouSlideContent,
  ComparisonSlideContent,
  StatisticsSlideContent,
  TimelineSlideContent,
  DefinitionSlideContent,
  SectionSlideContent,
  CallToActionSlideContent
} from '@/types/schema';
import { withRetry } from '@/utils/retry';

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
  slideTitlesString
}: { 
  presentationName: string;
  title: string; 
  type: string; 
  topic: string;
  slideTitlesString: string; 
}): Promise<SlideContent> {
  try {
    // Handle special slide types with simpler generation logic
    if (type === 'title') {
      return await generateTitleSlideContent(presentationName, topic);
    } else if (type === 'thankYou') {
      return { message: `Thank you for attending this presentation on ${topic}!` } as ThankYouSlideContent;
    } else if (type === 'index') {
      return await generateIndexSlideContent(slideTitlesString);
    }
    
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
    else if (type === 'comparison') {
      return {
        title: parsedContent.title || title,
        leftHeader: parsedContent.leftHeader || "Option A",
        rightHeader: parsedContent.rightHeader || "Option B",
        leftPoints: Array.isArray(parsedContent.leftPoints) ? parsedContent.leftPoints : ["No points available"],
        rightPoints: Array.isArray(parsedContent.rightPoints) ? parsedContent.rightPoints : ["No points available"]
      } as ComparisonSlideContent;
    }
    else if (type === 'statistics') {
      if (!Array.isArray(parsedContent.stats)) {
        parsedContent.stats = [
          { value: "N/A", description: "Statistics unavailable" }
        ];
      }
      return {
        title: parsedContent.title || title,
        stats: parsedContent.stats
      } as StatisticsSlideContent;
    }
    else if (type === 'timeline') {
      if (!Array.isArray(parsedContent.events)) {
        parsedContent.events = [
          { date: "N/A", description: "Timeline events unavailable" }
        ];
      }
      return {
        title: parsedContent.title || title,
        events: parsedContent.events
      } as TimelineSlideContent;
    }
    else if (type === 'definition') {
      return {
        term: parsedContent.term || title,
        definition: parsedContent.definition || "Definition unavailable",
        examples: Array.isArray(parsedContent.examples) ? parsedContent.examples : ["No examples available"]
      } as DefinitionSlideContent;
    }
    else if (type === 'section') {
      return {
        sectionTitle: parsedContent.sectionTitle || title,
        description: parsedContent.description || "New section of the presentation"
      } as SectionSlideContent;
    }
    else if (type === 'callToAction') {
      return {
        title: parsedContent.title || title,
        mainAction: parsedContent.mainAction || "Take action now",
        steps: Array.isArray(parsedContent.steps) ? parsedContent.steps : ["No steps available"]
      } as CallToActionSlideContent;
    }
    
    // Default fallback
    throw new Error(`Unsupported slide type: ${type}`);
    
  } catch (error) {
    console.error(`Error generating content for slide "${title}" (${type}):`, error);    
    throw error;
  }
}

/**
 * Generate title slide content
 * @param {string} presentationName - The name of the presentation
 * @param {string} topic - The presentation topic
 * @returns {Promise<TitleSlideContent>} - Title slide content
 */
async function generateTitleSlideContent(presentationName: string, topic: string): Promise<TitleSlideContent> {
  try {
    const prompt = `
    Create a compelling title and subtitle for a presentation named "${presentationName}"
    about:
    "${topic}"
    
    FORMAT: Return a JSON object with:
    {
      "mainTitle": "A catchy, clear main title (5-7 words)",
      "subtitle": "A brief subtitle that explains the purpose (10-15 words max)"
    }
    
    Return ONLY the JSON object, no explanations.
    `;
    
    const response = await getGeminiResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from response");
    }
    
    const parsedContent = JSON.parse(jsonMatch[0]);
    
    return {
      mainTitle: parsedContent.mainTitle || topic,
      subtitle: parsedContent.subtitle || "A comprehensive overview"
    };
  } catch (error) {
    console.error("Error generating title slide:", error);
    return {
      mainTitle: topic,
      subtitle: "A comprehensive overview"
    };
  }
}

/**
 * Generate index slide content
 * @param {string} slideTitlesString - String of slide titles
 * @returns {Promise<IndexSlideContent>} - Index slide content
 */
async function generateIndexSlideContent(slideTitlesString: string): Promise<IndexSlideContent> {
  try {
    const prompt = `
    Create a concise table of contents using the following slide titles:
    "${slideTitlesString}"
    
    FORMAT: Return a JSON object with:
    {
      "items": ["Key Topic 1", "Key Topic 2", "Key Topic 3", "Key Topic 4", "Key Topic 5"]
    }
    
    Important:
    - Include 4-5 main points that would be covered in the presentation
    - Keep each point short (3-6 words)
    - Points should be logically ordered
    - Points should be clear and descriptive
    
    Return ONLY the JSON object, no explanations.
    `;
    
    const response = await getGeminiResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from response");
    }
    
    const parsedContent = JSON.parse(jsonMatch[0]);
    
    // Ensure we have an array of items and limit to 5 items maximum
    const items = Array.isArray(parsedContent.items) ? 
      parsedContent.items.slice(0, 5) : 
      ["Introduction", "Key Concepts", "Analysis", "Applications", "Conclusion"];
    
    return { items };
  } catch (error) {
    console.error("Error generating index slide:", error);
    return {
      items: ["Introduction", "Key Concepts", "Analysis", "Applications", "Conclusion"]
    };
  }
}


export async function generateSlideContent(params: {
  presentationName: string;
  title: string;
  type: string;
  topic: string;
  slideTitlesString: string;
}): Promise<SlideContent> {
  return withRetry(
    generateSlideContentNoRetry, 
    [params],

  {onFail: () => {
    // Return fallback content based on slide type with proper typing
    if (params.type === 'content') {
      return {
        title: params.title,
        content: ['Failed to generate content. Please try again.']
      } as ContentSlideContent;
    } else if (params.type === 'quote') {
      return {
        quote: "Content generation failed. Please try again.",
        author: "System"
      } as QuoteSlideContent;
    } else if (params.type === 'title') {
      return {
        mainTitle: params.topic || params.title,
        subtitle: "Presentation Overview"
      } as TitleSlideContent;
    } else if (params.type === 'index') {
      return {
        items: ["Main Points", "Key Concepts", "Analysis", "Conclusion"]
      } as IndexSlideContent;
    } else if (params.type === 'thankYou') {
      return { message: "Thank you for your attention!" } as ThankYouSlideContent;
    } else if (params.type === 'comparison') {
      return {
        title: params.title,
        leftHeader: "Option A",
        rightHeader: "Option B",
        leftPoints: ["Feature 1", "Feature 2", "Feature 3"],
        rightPoints: ["Feature 1", "Feature 2", "Feature 3"]
      } as ComparisonSlideContent;
    } else if (params.type === 'statistics') {
      return {
        title: params.title,
        stats: [
          { value: "75%", description: "Example statistic" },
          { value: "2x", description: "Example growth metric" }
        ]
      } as StatisticsSlideContent;
    } else if (params.type === 'timeline') {
      return {
        title: params.title,
        events: [
          { date: "2020", description: "Initial event" },
          { date: "2022", description: "Latest development" }
        ]
      } as TimelineSlideContent;
    } else if (params.type === 'definition') {
      return {
        term: params.title,
        definition: "Default definition text",
        examples: ["Example 1", "Example 2"]
      } as DefinitionSlideContent;
    } else if (params.type === 'section') {
      return {
        sectionTitle: params.title,
        description: "This section covers important aspects of the topic"
      } as SectionSlideContent;
    } else if (params.type === 'callToAction') {
      return {
        title: params.title,
        mainAction: "Take the next step",
        steps: ["Consider options", "Make a decision", "Implement"]
      } as CallToActionSlideContent;
    }

    // Fallback for unknown slide types
    return { title: params.title, content: ['Failed to generate content.'] };
  }});
}

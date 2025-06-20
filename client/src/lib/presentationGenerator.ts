import { generateSlideContent } from './slideContentGenerator';
import { 
  PresentationSlide, 
  SlideContent, 
} from '@/types/schema';
import {
  getDefaultSlideContent
} from '../schemas/zodSchemas';

import { PresentationTitle } from '@/types/schema';
import { parseSlideContent } from '../schemas/zodSchemas';

/**
 * Generate a complete presentation from slide titles and types
 * 
 * @param {object} params - The parameters for the function
 * @param {Array<{title: string, type: string}>} params.slides - Slide titles and types
 * @param {string} params.topic - Summaried user prompt for the presentation topic
 * @param {function} [params.onSlideGenerated] - Callback function called when each slide is generated
 * @returns {Promise<PresentationSlide[]>} - Complete presentation structure
 */
export async function generatePresentation({ 
  presentationName,
  slides, 
  topic,
  tone,
  onSlideGenerated
}: { 
  presentationName: string;
  slides: Array<PresentationTitle>;
  topic: string;
  tone: string;
  onSlideGenerated?: (slide: PresentationSlide) => void;
}): Promise<PresentationSlide[]> {
  const presentation: PresentationSlide[] = [];

  const slideTitles = slides[1].title === "index" ? slides.slice(2, -1): slides.slice(1, -1);

  const slideTitlesString: string = slideTitles.map(slide => slide.title).join('\n');

  console.log('Slides: ', slides);
  
  // Process each slide sequentially to respect rate limits
  for (let i = 0; i < slides.length; i++) {
    const { title, type, webSearch } = slides[i];
    
    try {
      // Generate content for this slide using the imported function
      const content = await generateSlideContent({ 
        presentationName,
        title, 
        type, 
        topic,
        slideTitlesString,
        tone, // pass tone to slide content generator
        webSearch
      });
      
      // Create the new slide
      const newSlide = {
        SlideNumber: i + 1,
        slideType: type as "title" | "index" | "content" | "quote" | "thankYou" | "comparison" | "statistics" | "timeline" | "definition" | "section" | "callToAction",
        Title: title,
        Content: content,
        webSearch: webSearch
      };
      
      // Add the slide to the presentation
      presentation.push(newSlide);
      
      // Call the callback if provided
      if (onSlideGenerated) {
        onSlideGenerated(newSlide);
      }
      
    } catch (error) {
      console.error(`Failed to generate slide ${i + 1}:`, error);
      
      // Create appropriate fallback content based on slide type using Zod
      let fallbackContent: SlideContent;
      
      try {
        // Use getDefaultSlideContent for fallback content, no switch needed
        fallbackContent = getDefaultSlideContent(type, title, topic);
      } catch (zodError) {
        console.error('Error creating fallback content with Zod:', zodError);
        // Ultimate fallback if Zod validation fails
        fallbackContent = 
        parseSlideContent(
          JSON.stringify({
            title,
            content: [`'Emergency fallback content due to validation error.'`], 
          }),
          'content'
        );
      }
      
      // Create placeholder slide with proper typing for content
      const errorSlide = {
        SlideNumber: i + 1,
        slideType: type as "index" | "title" | "content" | "quote" | "thankYou" | "comparison" | "statistics" | "timeline" | "definition" | "section" | "callToAction",
        Title: title,
        Content: fallbackContent,
        webSearch: webSearch
      };
      
      // Add the placeholder slide to the presentation
      presentation.push(errorSlide);
      
      // Call the callback if provided
      if (onSlideGenerated) {
        onSlideGenerated(errorSlide);
      }
    }
  }
  
  return presentation;
}


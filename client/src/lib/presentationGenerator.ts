import { generateSlideContent } from './slideContentGenerator';
import { PresentationSlide, SlideContent } from '@/types/schema';

/**
 * Generate a complete presentation from slide titles and types
 * 
 * @param {object} params - The parameters for the function
 * @param {Array<{title: string, type: string}>} params.slides - Slide titles and types
 * @param {string} params.topic - The overall presentation topic
 * @param {function} [params.onSlideGenerated] - Callback function called when each slide is generated
 * @returns {Promise<PresentationSlide[]>} - Complete presentation structure
 */
export async function generatePresentation({ 
  slides, 
  topic,
  onSlideGenerated
}: { 
  slides: Array<{ title: string; type: string }>;
  topic: string;
  onSlideGenerated?: (slide: PresentationSlide) => void;
}): Promise<PresentationSlide[]> {
  const presentation: PresentationSlide[] = [];
  
  // Process each slide sequentially to respect rate limits
  for (let i = 0; i < slides.length; i++) {
    const { title, type } = slides[i];
    
    try {
      // Generate content for this slide using the imported function
      const content = await generateSlideContent({ 
        title, 
        type, 
        topic 
      });
      
      // Create the new slide
      const newSlide = {
        SlideNumber: i + 1,
        slideType: type,
        Title: title,
        Content: content
      };
      
      // Add the slide to the presentation
      presentation.push(newSlide);
      
      // Call the callback if provided
      if (onSlideGenerated) {
        onSlideGenerated(newSlide);
      }
      
    } catch (error) {
      console.error(`Failed to generate slide ${i + 1}:`, error);
      
      // Create placeholder slide with proper typing for content
      const errorSlide = {
        SlideNumber: i + 1,
        slideType: type,
        Title: title,
        Content: type === 'content' 
          ? { title: title, content: ['Content generation failed. Please try again.'] } 
          : { quote: 'Content generation failed', author: 'Error' }
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

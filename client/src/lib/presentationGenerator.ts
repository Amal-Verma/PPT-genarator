import { generateSlideContent } from './slideContentGenerator';
import { PresentationSlide, SlideContent } from '@/types/schema';

/**
 * Generate a complete presentation from slide titles and types
 * 
 * @param {object} params - The parameters for the function
 * @param {Array<{title: string, type: string}>} params.slides - Slide titles and types
 * @param {string} params.topic - The overall presentation topic
 * @returns {Promise<PresentationSlide[]>} - Complete presentation structure
 */
export async function generatePresentation({ 
  slides, 
  topic 
}: { 
  slides: Array<{ title: string; type: string }>;
  topic: string;
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
      
      // Add the slide to the presentation
      presentation.push({
        SlideNumber: i + 1,
        slideType: type,
        Title: title,
        Content: content
      });
      
    } catch (error) {
      console.error(`Failed to generate slide ${i + 1}:`, error);
      
      // Add a placeholder slide with proper typing for content
      presentation.push({
        SlideNumber: i + 1,
        slideType: type,
        Title: title,
        Content: type === 'content' 
          ? { title: title, content: ['Content generation failed. Please try again.'] } 
          : { quote: 'Content generation failed', author: 'Error' }
      });
    }
  }
  
  return presentation;
}

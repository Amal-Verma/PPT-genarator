import { generateSlideContent } from './slideContentGenerator';
import { 
  PresentationSlide, 
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
  presentationName,
  slides, 
  topic,
  onSlideGenerated
}: { 
  presentationName: string;
  slides: Array<{ title: string; type: string }>;
  topic: string;
  onSlideGenerated?: (slide: PresentationSlide) => void;
}): Promise<PresentationSlide[]> {
  const presentation: PresentationSlide[] = [];

  const slideTitles = slides[1].title === "index" ? slides.slice(2, -1): slides.slice(1, -1);

  const slideTitlesString: string = slideTitles.map(slide => slide.title).join('\n');

  
  // Process each slide sequentially to respect rate limits
  for (let i = 0; i < slides.length; i++) {
    const { title, type } = slides[i];
    
    try {
      // Generate content for this slide using the imported function
      const content = await generateSlideContent({ 
        presentationName,
        title, 
        type, 
        topic,
        slideTitlesString
      });
      
      // Create the new slide
      const newSlide = {
        SlideNumber: i + 1,
        slideType: type as "title" | "index" | "content" | "quote" | "thankYou" | "comparison" | "statistics" | "timeline" | "definition" | "section" | "callToAction",
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
      
      // Create appropriate fallback content based on slide type
      let fallbackContent: SlideContent;
      
      switch(type) {
        case 'content':
          fallbackContent = { 
            title: title, 
            content: ['Content generation failed. Please try again.'] 
          } as ContentSlideContent;
          break;
        case 'quote':
          fallbackContent = { 
            quote: 'Content generation failed', 
            author: 'Error' 
          } as QuoteSlideContent;
          break;
        case 'title':
          fallbackContent = { 
            mainTitle: topic || 'Presentation Title', 
            subtitle: 'Content generation failed' 
          } as TitleSlideContent;
          break;
        case 'index':
          fallbackContent = { 
            items: ['Failed to generate table of contents'] 
          } as IndexSlideContent;
          break;
        case 'thankYou':
          fallbackContent = { 
            message: 'Thank you for your attention' 
          } as ThankYouSlideContent;
          break;
        case 'comparison':
          fallbackContent = {
            title: title,
            leftHeader: "Option A",
            rightHeader: "Option B",
            leftPoints: ["Content generation failed"],
            rightPoints: ["Content generation failed"]
          } as ComparisonSlideContent;
          break;
        case 'statistics':
          fallbackContent = {
            title: title,
            stats: [
              { value: "N/A", description: "Failed to generate statistics" }
            ]
          } as StatisticsSlideContent;
          break;
        case 'timeline':
          fallbackContent = {
            title: title,
            events: [
              { date: "N/A", description: "Failed to generate timeline" }
            ]
          } as TimelineSlideContent;
          break;
        case 'definition':
          fallbackContent = {
            term: title,
            definition: "Failed to generate definition",
            examples: ["Content generation failed"]
          } as DefinitionSlideContent;
          break;
        case 'section':
          fallbackContent = {
            sectionTitle: title,
            description: "Failed to generate section content"
          } as SectionSlideContent;
          break;
        case 'callToAction':
          fallbackContent = {
            title: title,
            mainAction: "Action Required",
            steps: ["Failed to generate call to action steps"]
          } as CallToActionSlideContent;
          break;
        default:
          fallbackContent = { 
            title: title, 
            content: ['Content generation failed. Unknown slide type.'] 
          } as ContentSlideContent;
      }
      
      // Create placeholder slide with proper typing for content
      const errorSlide = {
        SlideNumber: i + 1,
        slideType: type as "index" | "title" | "content" | "quote" | "thankYou" | "comparison" | "statistics" | "timeline" | "definition" | "section" | "callToAction",
        Title: title,
        Content: fallbackContent
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

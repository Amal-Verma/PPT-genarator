import pptxgen from 'pptxgenjs';
import { createTitleSlide } from './title-slide';
import { createContentSlide } from './content-slide';
import { createQuoteSlide } from './quote-slide';
import { createIndexSlide } from './index-slide';
import { createThankYouSlide } from './thank-you-slide';
import { createComparisonSlide } from './comparison-slide';
import { createStatisticsSlide } from './statistics-slide';
import { createTimelineSlide } from './timeline-slide';
import { createDefinitionSlide } from './definition-slide';
import { createSectionSlide } from './section-slide';
import { createCallToActionSlide } from './call-to-action-slide';
import { CallToActionSlideContent, ComparisonSlideContent, ContentSlideContent, DefinitionSlideContent, IndexSlideContent, QuoteSlideContent, SectionSlideContent, SlideContent, StatisticsSlideContent, TimelineSlideContent, TitleSlideContent } from '@/types/schema';

export interface Slide {
  SlideNumber: number;
  slideType: 'title' | 'content' | 'quote' | 'index' | 'thankYou' | 'comparison' | 'statistics' | 'timeline' | 'definition' | 'section' | 'callToAction';
  Title: string;
  Content: SlideContent; // This will be cast to the appropriate content type for each slide
}

export interface Presentation {
  presentationName: string;
  slides: Slide[];
}

export const generatePowerPoint = async (presentationData: Presentation): Promise<Uint8Array> => {
  try {
    console.log('Generating PowerPoint with data:', presentationData);
    
    // Create a new presentation
    const pres = new pptxgen();
    
    // Set presentation properties
    pres.title = presentationData.presentationName;
    pres.subject = 'Generated Presentation';
    pres.company = 'PPT Generator';
    
    // Set default font and master slide properties
    pres.layout = 'LAYOUT_16x9';
    pres.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: '#FFFFFF' },
      margin: [0.5, 0.5, 0.5, 0.5],
      objects: []
    });
    
    // Sort slides by SlideNumber
    const sortedSlides = [...presentationData.slides].sort((a, b) => a.SlideNumber - b.SlideNumber);
    
    // Create index content - items for index slides
    const indexItems = sortedSlides
      .filter(slide => slide.slideType !== 'title' && slide.slideType !== 'thankYou' && slide.slideType !== 'index')
      .map(slide => slide.Title);
    
    // Process each slide
    for (const slide of sortedSlides) {
      console.log(`Processing slide ${slide.SlideNumber} of type ${slide.slideType}`);
      
      try {
        switch(slide.slideType) {
          case 'title':
            console.log('Creating title slide with content:', slide.Content);
            createTitleSlide(pres, slide.Content as TitleSlideContent);
            break;
            
          case 'content':
            console.log('Creating content slide with content:', slide.Content);
            createContentSlide(pres, slide.Content as ContentSlideContent);
            break;
            
          case 'quote':
            console.log('Creating quote slide with content:', slide.Content);
            createQuoteSlide(pres, slide.Content as QuoteSlideContent);
            break;
            
          case 'index':
            console.log('Creating index slide');
            // For index slides, use either provided items or generated index
            const indexContent = {
              items: (slide.Content as IndexSlideContent)?.items || indexItems
            };
            createIndexSlide(pres, indexContent);
            break;
            
          case 'thankYou':
            console.log('Creating thank you slide with content:', slide.Content);
            // @ts-expect-error: ThankYouSlideContent type is not strictly enforced here
            createThankYouSlide(pres, slide.Content);
            break;
            
          case 'comparison':
            console.log('Creating comparison slide with content:', slide.Content);
            createComparisonSlide(pres, slide.Content as ComparisonSlideContent);
            break;
            
          case 'statistics':
            console.log('Creating statistics slide with content:', slide.Content);
            createStatisticsSlide(pres, slide.Content as StatisticsSlideContent);
            break;
            
          case 'timeline':
            console.log('Creating timeline slide with content:', slide.Content);
            createTimelineSlide(pres, slide.Content as TimelineSlideContent);
            break;
            
          case 'definition':
            console.log('Creating definition slide with content:', slide.Content);
            createDefinitionSlide(pres, slide.Content as DefinitionSlideContent);
            break;
            
          case 'section':
            console.log('Creating section slide with content:', slide.Content);
            createSectionSlide(pres, slide.Content as SectionSlideContent);
            break;
            
          case 'callToAction':
            console.log('Creating call to action slide with content:', slide.Content);
            createCallToActionSlide(pres, slide.Content as CallToActionSlideContent);
            break;
            
          default:
            console.warn(`Unrecognized slide type: ${slide.slideType}`);
            break;
        }
      } catch (err) {
        console.error(`Error creating slide ${slide.SlideNumber}:`, err);
        // Continue with other slides even if one fails
      }
    }
    
    // Generate and return the presentation
    console.log('PowerPoint generation complete, writing file...');
    
    // Use write() for browser context instead of writeFile()
    return await pres.write({ outputType: 'nodebuffer' }) as unknown as Uint8Array;
  } catch (error) {
    console.error('Error in generatePowerPoint:', error);
    throw error;
  }
};

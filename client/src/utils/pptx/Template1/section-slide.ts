import pptxgen from 'pptxgenjs';
import { SectionSlideContent } from '@/types/schema';

/**
 * Creates a section divider slide in the presentation
 * @param pres - The presentation object
 * @param content - The section slide content
 */
export const createSectionSlide = (pres: pptxgen, content: SectionSlideContent): void => {
  // Create a new slide
  const slide = pres.addSlide();
  
  // Add section title background shape
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 2,
    w: '100%',
    h: 1.5,
    fill: { color: '0077CC' }
  });
  
  // Add section title
  slide.addText(content.sectionTitle, {
    x: 0.5,
    y: 2,
    w: '90%',
    h: 1.5,
    fontSize: 40,
    fontFace: 'Arial',
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle',
    bold: true
  });
  
  // Add section description
  slide.addText(content.description, {
    x: 1,
    y: 3.7,
    w: 8.5,
    h: 1,
    fontSize: 16,
    fontFace: 'Arial',
    color: '333333',
    align: 'center',
    valign: 'top'
  });

  // Add speaker notes if present
  if (content.speakNote && content.speakNote.trim() !== '') {
    slide.addNotes(content.speakNote);
  }
};

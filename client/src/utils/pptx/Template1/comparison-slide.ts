import pptxgen from 'pptxgenjs';
import { ComparisonSlideContent } from '@/types/schema';

/**
 * Creates a comparison slide in the presentation
 * @param pres - The presentation object
 * @param content - The comparison slide content
 */
export const createComparisonSlide = (pres: pptxgen, content: ComparisonSlideContent): void => {
  // Create a new slide
  const slide = pres.addSlide();
  
  // Add title
  slide.addText(content.title, {
    x: 0.5,
    y: 0.5,
    w: '90%',
    h: 0.8,
    fontSize: 24,
    fontFace: 'Arial',
    color: '363636',
    align: 'center',
    bold: true
  });
  
  // Set up columns
  const leftColumnX = 0.5;
  const rightColumnX = 5.5;
  const columnWidth = 4.5;
  const headerY = 1.5;
  const contentStartY = 2.2;
  const lineHeight = 0.5;
  
  // Add column headers
  slide.addText(content.leftHeader, {
    x: leftColumnX,
    y: headerY,
    w: columnWidth,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: '0077CC',
    align: 'center',
    bold: true
  });
  
  slide.addText(content.rightHeader, {
    x: rightColumnX,
    y: headerY,
    w: columnWidth,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: '00AA88',
    align: 'center',
    bold: true
  });
  
  // Add vertical divider line
  slide.addShape('line', {
    x: 5.25,
    y: headerY,
    w: 0,
    h: 4.5,
    line: { color: 'DDDDDD', width: 2 }
  });
  
  // Add left column points
  content.leftPoints.forEach((point, index) => {
    slide.addText(`• ${point}`, {
      x: leftColumnX,
      y: contentStartY + (index * lineHeight),
      w: columnWidth,
      h: lineHeight,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333'
    });
  });
  
  // Add right column points
  content.rightPoints.forEach((point, index) => {
    slide.addText(`• ${point}`, {
      x: rightColumnX,
      y: contentStartY + (index * lineHeight),
      w: columnWidth,
      h: lineHeight,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333'
    });
  });

  // Add speaker notes if present
  if (content.speakNote && content.speakNote.trim() !== '') {
    slide.addNotes(content.speakNote);
  }
};

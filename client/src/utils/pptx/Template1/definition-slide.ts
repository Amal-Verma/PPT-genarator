import pptxgen from 'pptxgenjs';
import { DefinitionSlideContent } from '@/types/schema';

/**
 * Creates a definition slide in the presentation
 * @param pres - The presentation object
 * @param content - The definition slide content
 */
export const createDefinitionSlide = (pres: pptxgen, content: DefinitionSlideContent): void => {
  // Create a new slide
  const slide = pres.addSlide();
  
  // Add term (as the title)
  slide.addText(content.term, {
    x: 0.5,
    y: 0.5,
    w: '90%',
    h: 0.8,
    fontSize: 28,
    fontFace: 'Arial',
    color: '0077CC',
    align: 'center',
    bold: true
  });
  
  // Add definition background box
  slide.addShape(pres.ShapeType.rect, {
    x: 1,
    y: 1.5,
    w: 8.5,
    h: 1.5,
    fill: { color: 'F5F5F5' },
    line: { color: 'DDDDDD', width: 1 },
    shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, color: 'CCCCCC', opacity: 0.5 }
  });
  
  // Add definition text
  slide.addText(content.definition, {
    x: 1.25,
    y: 1.6,
    w: 8,
    h: 1.3,
    fontSize: 16,
    fontFace: 'Arial',
    color: '333333',
    italic: true
  });
  
  // Add "Examples" label
  slide.addText('Examples:', {
    x: 1,
    y: 3.2,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: '363636',
    bold: true
  });
  
  // Add examples as bullet points
  const startY = 3.7;
  const lineHeight = 0.5;
  
  content.examples.forEach((example, index) => {
    slide.addText(`• ${example}`, {
      x: 1.25,
      y: startY + (index * lineHeight),
      w: 8,
      h: lineHeight,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333'
    });
  });
};

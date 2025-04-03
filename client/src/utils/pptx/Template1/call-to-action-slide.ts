import pptxgen from 'pptxgenjs';
import { CallToActionSlideContent } from '@/types/schema';

/**
 * Creates a call to action slide in the presentation
 * @param pres - The presentation object
 * @param content - The call to action slide content
 */
export const createCallToActionSlide = (pres: pptxgen, content: CallToActionSlideContent): void => {
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
  
  // Add main action background box
  slide.addShape(pres.ShapeType.rect, {
    x: 2,
    y: 1.5,
    w: 6.5,
    h: 1,
    fill: { color: 'e9f7ff' },
    line: { color: '0077CC', width: 1 },
    shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, color: 'CCCCCC', opacity: 0.5 }
  });
  
  // Add main action text
  slide.addText(content.mainAction, {
    x: 2,
    y: 1.5,
    w: 6.5,
    h: 1,
    fontSize: 20,
    fontFace: 'Arial',
    color: '0077CC',
    align: 'center',
    valign: 'middle',
    bold: true
  });
  
  // Add steps title
  slide.addText('Steps:', {
    x: 2,
    y: 2.8,
    w: 6.5,
    h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: '363636',
    bold: true
  });
  
  // Add steps as numbered list
  const startY = 3.3;
  const lineHeight = 0.6;
  
  content.steps.forEach((step, index) => {
    slide.addText(`${index + 1}. ${step}`, {
      x: 2.5,
      y: startY + (index * lineHeight),
      w: 6,
      h: lineHeight,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333'
    });
  });
};

import pptxgen from 'pptxgenjs';
import { TimelineSlideContent } from '@/types/schema';

/**
 * Creates a timeline slide in the presentation
 * @param pres - The presentation object
 * @param content - The timeline slide content
 */
export const createTimelineSlide = (pres: pptxgen, content: TimelineSlideContent): void => {
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
  
  // Maximum 5 events per slide for readability
  const events = content.events.slice(0, 5);
  const startY = 1.5; // Raised from 1.8 to move the timeline up
  const eventHeight = 0.65; // Further reduced from 0.7
  const spacing = 0.08; // Further reduced from 0.15
  
  // Draw the timeline connector line
  slide.addShape('line', {
    x: 2.5,
    y: startY + 0.2,
    w: 0,
    h: (events.length * (eventHeight + spacing)) - spacing,
    line: { color: '0077CC', width: 2, dashType: 'dash' }
  });
  
  // Add each timeline event
  events.forEach((event, index) => {
    const y = startY + (index * (eventHeight + spacing));
    
    // Add date marker
    slide.addShape(pres.ShapeType.rect, {
      x: 0.9, // Moved slightly left to accommodate increased width
      y: y + 0.1,
      w: 1.4, // Increased from 1.25
      h: 0.5,
      fill: { color: '0077CC' },
      line: { color: '0077CC' },
      shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, color: 'CCCCCC', opacity: 0.5 }
    });
    
    // Add date text
    slide.addText(event.date, {
      x: 0.9, // Adjusted to match rectangle position
      y,
      w: 1.4, // Increased to match rectangle width
      h: 0.7,
      fontSize: 14,
      fontFace: 'Arial',
      color: 'FFFFFF',
      align: 'center',
      bold: true,
      valign: 'middle'
    });
    
    // Add connector circle
    slide.addShape('ellipse', {
      x: 2.375,
      y: y + 0.2, // Adjusted for reduced height
      w: 0.25,
      h: 0.25,
      fill: { color: '0077CC' }
    });
    
    // Add event description
    slide.addText(event.description, {
      x: 3,
      y,
      w: 6.5,
      h: 0.65, // Adjusted to match reduced height
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333',
      valign: 'middle'
    });
  });

  // Add speaker notes if present
  if (content.speakNote && content.speakNote.trim() !== '') {
    slide.addNotes(content.speakNote);
  }
};

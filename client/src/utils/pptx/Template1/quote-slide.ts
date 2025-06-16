import pptxgen from 'pptxgenjs';

interface QuoteSlideContent {
  quote: string;
  author: string;
  speakNote?: string;
}

export const createQuoteSlide = (pres: pptxgen, content: QuoteSlideContent): void => {
  const slide = pres.addSlide();
  
  // Professional color scheme
  const primaryColor = '#1F4E79';  // Deep blue
  const accentColor = '#F1C40F';   // Gold accent
  
  // Simple background color instead of gradient
  slide.background = { color: '#F5F7FA' };
  
  // Add large quote mark
  slide.addText("", {
    x: 0.8,
    y: 0.5,
    w: 1.5,
    h: 1.5,
    fontSize: 120,
    color: primaryColor + '33', // Add transparency to the color
    fontFace: 'Georgia',
    align: 'center',
    valign: 'top'
  });
  
  // Add quote
  slide.addText(`${content.quote}`, {
    x: 1.5,
    y: 1.4,
    w: '75%',
    h: 2.5,
    align: 'center',
    fontSize: 28,
    color: primaryColor,
    fontFace: 'Georgia',
    italic: true,
    lineSpacing: 32
  });
  
  // Add author with accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: 4.5,
    y: 4.0,
    w: 1.5,
    h: 0.08,
    fill: { color: accentColor }
  });
  
  slide.addText(`— ${content.author}`, {
    x: 4.5,
    y: 4.2,
    w: '40%',
    h: 0.5,
    align: 'center',
    fontSize: 20,
    color: '#505050',
    fontFace: 'Arial',
    bold: true
  });
  
  // Add corner decorative elements
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.8,
    h: 0.8,
    fill: { color: accentColor + '66' } // Semi-transparent
  });
  
  slide.addShape(pres.ShapeType.rect, {
    x: 9.2,
    y: 5.1,
    w: 0.8,
    h: 0.8,
    fill: { color: accentColor + '66' } // Semi-transparent
  });

  // Add speaker notes if present
  if (content.speakNote && content.speakNote.trim() !== '') {
    slide.addNotes(content.speakNote);
  }
};

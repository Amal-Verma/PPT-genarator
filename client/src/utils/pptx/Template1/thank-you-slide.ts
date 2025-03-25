import pptxgen from 'pptxgenjs';

interface ThankYouSlideContent {
  message: string;
}

export const createThankYouSlide = (pres: pptxgen, content: ThankYouSlideContent): void => {
  const slide = pres.addSlide();
  
  // Professional color scheme
  const primaryColor = '#1F4E79';  // Deep blue
  const accentColor = '#F1C40F';   // Gold accent
  
  // Simple background color
  slide.background = { color: primaryColor };
  
  // Add decorative corner elements
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 1.5,
    h: 0.15,
    fill: { color: accentColor }
  });
  
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.15,
    h: 1.5,
    fill: { color: accentColor }
  });
  
  slide.addShape(pres.ShapeType.rect, {
    x: 8.5,
    y: 5.35,
    w: 1.5,
    h: 0.15,
    fill: { color: accentColor }
  });
  
  slide.addShape(pres.ShapeType.rect, {
    x: 9.85,
    y: 3.85,
    w: 0.15,
    h: 1.5,
    fill: { color: accentColor }
  });
  
  // Add "Thank You" text with adjusted position and height
  slide.addText('Thank You', {
    x: 1.0,
    y: 1.5,  // Moved up slightly
    w: '80%',
    h: 1.3,  // Reduced height to prevent overflow
    align: 'center',
    fontSize: 66,
    color: '#FFFFFF',
    bold: true,
    fontFace: 'Arial'
  });
  
  // Add decorative element - horizontal line (positioned lower)
  slide.addShape(pres.ShapeType.rect, {
    x: 4.0,
    y: 3.0,  // Moved down to create space
    w: 2,
    h: 0.08,
    fill: { color: accentColor }
  });
  
  // Add custom message if provided (positioned with more space)
  if (content.message && content.message.trim() !== '') {
    slide.addText(content.message, {
      x: 1.0,
      y: 3.4,  // Increased spacing after the line
      w: '80%',
      h: 1.5,  // Increased height for longer messages
      align: 'center',
      fontSize: 24,
      color: '#FFFFFF',
      fontFace: 'Arial',
      breakLine: true  // Allow text to wrap
    });
  }
};

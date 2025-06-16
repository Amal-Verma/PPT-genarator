import pptxgen from 'pptxgenjs';

interface ContentSlideContent {
  title: string;
  content: string[];
  speakNote?: string;
}

export const createContentSlide = (pres: pptxgen, content: ContentSlideContent): void => {
  const slide = pres.addSlide();
  
  // Professional color scheme
  const primaryColor = '#1F4E79';  // Deep blue
  const accentColor = '#F1C40F';   // Gold accent
  const textColor = '#333333';     // Dark gray for text
  
  // Background color
  slide.background = { color: '#FFFFFF' };
  
  // Add header bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.6,
    fill: { color: primaryColor }
  });
  
  // Add accent element in header
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.3,
    h: 0.6,
    fill: { color: accentColor }
  });
  
  // Add title with professional styling
  slide.addText(content.title, {
    x: 0.7,
    y: 0.8,
    w: '90%',
    h: 0.8,
    fontSize: 28,
    color: primaryColor,
    bold: true,
    fontFace: 'Arial'
  });
  
  // Add horizontal line below title
  slide.addShape(pres.ShapeType.line, {
    x: 0.7,
    y: 1.6,
    w: 9,
    h: 0,
    line: { color: '#DDDDDD', width: 1.5 }
  });
  
  // Instead of adding multiple text boxes, create a single text box with all bullet points
  if (content.content && content.content.length > 0) {
    // Process each bullet point with a dot prefix
    const bulletPoints = content.content.map(point => {
      return { 
        text: point, 
        options: { 
          bullet: true
        } 
      };
    });
    
    // Add all bullet points as a single text element
    slide.addText(bulletPoints, {
      x: 0.9,
      y: 1.9,
      w: '85%',
      h: 3.0,
      fontSize: 15, // Decreased from 20 to 18
      color: textColor,
      fontFace: 'Arial',
      lineSpacing: 25, // Adjusted line spacing value (115% is standard for presentation text)
      valign: 'top',
      paraSpaceBefore: 0,
      paraSpaceAfter: 10 // Space after each paragraph/bullet
    });
  }
  
  // Add subtle footer element
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 5.3,
    w: '100%',
    h: 0.2,
    fill: { color: accentColor }
  });

  // Add speaker notes if present
  if (content.speakNote && content.speakNote.trim() !== '') {
    slide.addNotes(content.speakNote);
  }
};

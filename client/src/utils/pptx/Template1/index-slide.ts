import pptxgen from 'pptxgenjs';

interface IndexSlideContent {
  items: string[];
}

export const createIndexSlide = (pres: pptxgen, content: IndexSlideContent): void => {
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
  slide.addText("Table of Contents", {
    x: 0.7,
    y: 0.8,
    w: '90%',
    h: 0.8,
    fontSize: 32,
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
  
  // Left side decorative element
  slide.addShape(pres.ShapeType.rect, {
    x: 0.7,
    y: 1.9,
    w: 0.1,
    h: 3.0,
    fill: { color: accentColor }
  });
  
  // Add index items with improved styling
  content.items.forEach((item, index) => {
    slide.addText(item, {
      x: 1.2,
      y: 1.9 + (index * 0.6),
      w: '80%',
      h: 0.5,
      fontSize: 20,
      color: textColor,
      fontFace: 'Arial',
      bullet: { 
        type: 'number', 
        startAt: index + 1,
        style: '%n.' 
      }
    });
  });
  
  // Add subtle footer element
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 5.3,
    w: '100%',
    h: 0.2,
    fill: { color: accentColor }
  });
};

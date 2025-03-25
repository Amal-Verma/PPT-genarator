import pptxgen from 'pptxgenjs';

interface TitleSlideContent {
  mainTitle: string;
  subtitle: string;
}

export const createTitleSlide = (pres: pptxgen, content: TitleSlideContent): void => {
  const slide = pres.addSlide();
  
  // Professional color scheme
  const primaryColor = '#1F4E79';  // Deep blue
  const accentColor = '#F1C40F';   // Gold accent
  
  // Simple background instead of gradient
  slide.background = { color: '#FFFFFF' };
  
  // Add left accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.3,
    h: '100%',
    fill: { color: primaryColor }
  });
  
  // Add accent line
  slide.addShape(pres.ShapeType.rect, {
    x: 0.7,
    y: 3.7,
    w: 3,
    h: 0.08,
    fill: { color: accentColor }
  });
  
  // Add title with professional styling
  slide.addText(content.mainTitle, {
    x: 0.7,
    y: 1.8,
    w: '85%',
    h: 1.8,
    align: 'left',
    fontSize: 44,
    color: primaryColor,
    bold: true,
    fontFace: 'Arial'
  });
  
  // Add subtitle
  slide.addText(content.subtitle, {
    x: 0.7,
    y: 3.8,
    w: '75%',
    h: 1.2,
    align: 'left',
    fontSize: 22,
    color: '#505050',
    fontFace: 'Arial'
  });
  
  // Add bottom corner decoration
  slide.addShape(pres.ShapeType.rect, {
    x: 9.5,
    y: 5.0,
    w: 1.0,
    h: 1.0,
    fill: { color: accentColor },
    rotate: 45
  });
};

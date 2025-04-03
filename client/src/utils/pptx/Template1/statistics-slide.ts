import pptxgen from 'pptxgenjs';
import { StatisticsSlideContent } from '@/types/schema';

/**
 * Creates a statistics slide in the presentation
 * @param pres - The presentation object
 * @param content - The statistics slide content
 */
export const createStatisticsSlide = (pres: pptxgen, content: StatisticsSlideContent): void => {
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
  
  // Maximum 4 stats per slide for better visibility
  const stats = content.stats.slice(0, 4);
  
  // Determine grid layout based on number of stats
  let layout: { cols: number, rows: number };
  if (stats.length <= 2) {
    layout = { cols: Math.min(stats.length, 2), rows: 1 };
  } else {
    layout = { cols: 2, rows: 2 };
  }
  
  // Calculate dimensions
  const availableWidth = 9; // Total available width
  const availableHeight = 4; // Total available height
  const padding = 0.25; // Padding between stats
  
  const statWidth = (availableWidth / layout.cols) - padding;
  const statHeight = (availableHeight / layout.rows) - padding;
  
  const startX = (10 - (statWidth * layout.cols + padding * (layout.cols - 1))) / 2; // Center horizontally
  const startY = 1.6; // Start position after title
  
  // Add each statistic
  stats.forEach((stat, index) => {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;
    
    const x = startX + (col * (statWidth + padding));
    const y = startY + (row * (statHeight + padding));
    
    // Add statistic background
    slide.addShape(pres.ShapeType.rect, {
      x,
      y,
      w: statWidth,
      h: statHeight,
      fill: { color: 'F5F5F5' },
      line: { color: 'DDDDDD', width: 1 },
      shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, color: 'CCCCCC', opacity: 0.5 }
    });
    
    // Add statistic value with appropriate font size based on length
    const valueLength = stat.value.length;
    const valueFontSize = valueLength > 6 ? 28 : valueLength > 4 ? 30 : 32;
    
    slide.addText(stat.value, {
      x,
      y: y + 0.1,
      w: statWidth,
      h: statHeight * 0.4,
      fontSize: valueFontSize,
      fontFace: 'Arial',
      color: '0077CC',
      align: 'center',
      bold: true,
      valign: 'middle'
    });
    
    // Add statistic description with text breakup if needed
    slide.addText(stat.description, {
      x: x + 0.2,
      y: y + (statHeight * 0.4),
      w: statWidth - 0.4,
      h: statHeight * 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333',
      align: 'center',
      valign: 'top',
      breakLine: true // Allow text to break into multiple lines
    });
  });
};

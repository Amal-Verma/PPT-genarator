import { generatePowerPoint } from './Template1/main';
import { Presentation } from './Template1/main';

export const exportToPowerPoint = async (presentationData: Presentation): Promise<void> => {
  try {
    console.log('Starting PowerPoint export with data:', {
      name: presentationData.presentationName,
      slideCount: presentationData.slides.length
    });
    
    // Validate essential data
    if (!presentationData || !Array.isArray(presentationData.slides) || presentationData.slides.length === 0) {
      throw new Error("Invalid presentation data: no slides found");
    }
    
    // Log slide types for debugging
    console.log('Slide types:', presentationData.slides.map(s => s.slideType));
    
    const pptxData = await generatePowerPoint(presentationData);
    
    if (!pptxData || !(pptxData instanceof Uint8Array) || pptxData.byteLength === 0) {
      throw new Error("Generated PowerPoint data is invalid or empty");
    }
    
    console.log('PowerPoint data generated successfully, size:', pptxData.byteLength);
    
    // Create a blob from the PPTX data
    const blob = new Blob([pptxData], { 
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    console.log('Blob URL created');
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${presentationData.presentationName.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
    
    // Append to the document, click it, and then remove it
    document.body.appendChild(link);
    console.log('Triggering download');
    link.click();
    document.body.removeChild(link);
    
    // Release the object URL
    window.URL.revokeObjectURL(url);
    console.log('PowerPoint export completed successfully');
  } catch (error) {
    console.error('Error exporting presentation to PowerPoint:', error);
    throw error;
  }
};

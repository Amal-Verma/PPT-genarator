// import html2canvas from 'html2canvas';
// import pptxgen from 'pptxgenjs';

// interface GradientStop {
//   color: string;
//   position: number;
// }

// interface GradientOptions {
//   type: 'linear' | 'radial';
//   direction?: string; // For linear: 'to bottom', 'to right', etc.
//   stops: GradientStop[];
// }

// /**
//  * Creates a gradient background for a slide using html2canvas
//  * 
//  * @param pres PowerPoint presentation instance
//  * @param slide Slide to add background to
//  * @param options Gradient options
//  * @returns Promise that resolves when background is applied
//  */
// export const applyGradientBackground = async (
//   pres: pptxgen,
//   slide: pptxgen.Slide,
//   options: GradientOptions
// ): Promise<void> => {
//   try {
//     // Create a container div for the gradient
//     const container = document.createElement('div');
//     container.style.width = '1280px';  // 16:9 aspect ratio, matches PowerPoint slide
//     container.style.height = '720px';
    
//     // Set the gradient CSS
//     let gradientCSS = '';
//     if (options.type === 'linear') {
//       const direction = options.direction || 'to bottom';
//       gradientCSS = `linear-gradient(${direction}, ${options.stops
//         .map(stop => `${stop.color} ${stop.position * 100}%`)
//         .join(', ')})`;
//     } else {
//       gradientCSS = `radial-gradient(circle, ${options.stops
//         .map(stop => `${stop.color} ${stop.position * 100}%`)
//         .join(', ')})`;
//     }
    
//     container.style.background = gradientCSS;
    
//     // Temporarily add to DOM (needed for html2canvas)
//     container.style.position = 'fixed';
//     container.style.left = '-9999px';
//     document.body.appendChild(container);
    
//     // Convert to canvas and then to image
//     const canvas = await html2canvas(container);
//     const imgData = canvas.toDataURL('image/png');
    
//     // Remove temporary element
//     document.body.removeChild(container);
    
//     // Add background image to slide
//     slide.background = { data: imgData };
    
//   } catch (error) {
//     console.error('Error creating gradient background:', error);
//     // Fallback to solid color
//     slide.background = { color: options.stops[0].color };
//   }
// };

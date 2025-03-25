import { getGeminiResponse } from './gemini';
import slideSchema from '../schemas/slideSchema';

/**
 * Generate presentation slide titles and types based on a prompt
 * 
 * @param {object} params - The parameters for the function
 * @param {string} params.prompt - The prompt describing the presentation topic
 * @param {number} params.numberOfSlides - The number of slides to generate titles for
 * @returns {Promise<{name: string, slides: Array<{title: string, type: string}>}>} - Presentation name and array of slide titles and types
 */
export async function generateSlideTitles({ 
  prompt, 
  numberOfSlides 
}: { 
  prompt: string, 
  numberOfSlides: number 
}): Promise<{name: string, slides: Array<{title: string, type: string}>}> {
  // Get slide types and their prompt descriptions from the schema
  const slideTypes: Record<string, string> = {};
  
  for (const [type, config] of Object.entries(slideSchema.slides)) {
    // Skip title and thankYou slide types as these will be added automatically
    if (type !== 'title' && type !== 'thankYou' && config['title-Prompt']) {
      slideTypes[type] = config['title-Prompt'];
    }
  }
  
  // Create a prompt to generate slide titles and types
  // const titlePrompts = Object.entries(slideTypes).map(([type, prompt]) => {
  //   return `${type}: ${prompt}`;
  // }).join('\n');
  let titlePrompts = "";
  for (const [type, prompt] of Object.entries(slideTypes)) {
    if (type === 'index' || type === 'title' || type === 'thankYou') {
      continue;
    }
    titlePrompts += `${type}: ${prompt}\n`;
  }
  
  // Adjust the number of slides to account for title, index (if needed), and thank you slides
  const hasIndexSlide = numberOfSlides >= 10;
  const contentSlidesCount = hasIndexSlide ? 
    numberOfSlides - 3 : // Subtract 3 for title, index and thank you slides
    numberOfSlides - 2;  // Subtract 2 for title and thank you slides
  
  const generationPrompt = `
  I need to create a presentation about: "${prompt}"
  
  First, provide a short, concise name/title that summarizes the entire presentation in 5-8 words.
  
  Then, generate exactly ${contentSlidesCount} slide titles along with the slide type.
  Available slide types are: ${Object.keys(slideTypes).join(', ')}
  
  Here's information about each slide type:
  ${titlePrompts}
  
  IMPORTANT RULES:
  - Create a coherent presentation flow with a logical structure
  - Vary the slide types appropriately for better engagement
  - Ensure titles are clear, concise, and specific to the topic
  - Each slide title should be under 60 characters
  - Do NOT include any formatting, markdown, or explanations in your response
  
  Format your response as a JSON object with a "name" field for the presentation title and a "slides" array:
  {
    "name": "Concise Presentation Title",
    "slides": [
      {"title": "Introduction to AI", "type": "content"},
      {"title": "Key Points", "type": "content"}
    ]
  }
  
  Return ONLY the JSON object in your response, nothing else. No explanation, no markdown formatting.
  `;
  
  try {
    // Get response from the AI
    const response = await getGeminiResponse(generationPrompt);
    
    // Parse the JSON response
    // Extract just the JSON part in case there's any extra text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Extract the presentation name
    const presentationName = parsedResponse.name || `Presentation about ${prompt}`;
    
    // Extract the slides
    let generatedSlides = parsedResponse.slides || [];
    
    // Validate the slide structure
    const validatedSlides = generatedSlides.map((item: any) => ({
      title: item.title || "Untitled Slide",
      type: Object.keys(slideTypes).includes(item.type) ? item.type : "content"
    }));
    
    // Add title slide at the beginning
    const slides = [
      {
        title: "Title",
        type: "title"
      },
      // Conditionally add index slide if presentation has 10 or more slides
      ...(hasIndexSlide ? [{
        title: "Table of Contents",
        type: "index"
      }] : []),
      ...validatedSlides,
      // Add thank you slide at the end
      {
        title: "Thank You",
        type: "thankYou"
      }
    ];
    
    return {
      name: presentationName,
      slides: slides
    };
  } catch (error) {
    console.error("Error generating slide titles:", error);
    // Return a default response in case of error
    const defaultSlides = Array(contentSlidesCount).fill(null).map((_, i) => ({
      title: `Slide ${i + 1}`,
      type: "content"
    }));
    
    return {
      name: `Presentation about ${prompt}`,
      slides: [
        { title: "Title", type: "title" },
        ...(hasIndexSlide ? [{ title: "Table of Contents", type: "index" }] : []),
        ...defaultSlides,
        { title: "Thank You", type: "thankYou" }
      ]
    };
  }
}

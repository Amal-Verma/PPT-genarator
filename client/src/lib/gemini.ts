import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Function that takes a prompt as input and returns the output from Gemini-1.5-flash model
 * Each call creates a new chat instance, so there's no persistent memory between calls
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    // Initialize the API with your API key
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error("Missing Gemini API key. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file");
    }
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Start a new chat for each request (no memory persistence)
    const chat = model.startChat();
    
    // Send the prompt to the model
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    // Return the text response
    return response.text();
  } catch (error) {
    console.error("Error in Gemini API:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// Rate limiter configuration
const MAX_CALLS_PER_MINUTE = 14;
const MINUTE_IN_MS = 60 * 1000;
const apiCallTimestamps: number[] = [];

/**
 * Calculate time to wait before making next API call to respect rate limits
 * @returns {number} - Milliseconds to wait (0 if no wait needed)
 */
function getTimeToWait(): number {
  const now = Date.now();
  
  // Remove timestamps older than 1 minute
  const recentTimestamps = apiCallTimestamps.filter(
    timestamp => now - timestamp < MINUTE_IN_MS
  );
  
  // Update the timestamps array with only recent calls
  apiCallTimestamps.length = 0;
  apiCallTimestamps.push(...recentTimestamps);
  
  // If we haven't reached the limit, no need to wait
  if (recentTimestamps.length < MAX_CALLS_PER_MINUTE) {
    return 0;
  }
  
  // If we've hit the limit, calculate time until oldest call "expires"
  // Add 100ms buffer to ensure we're safely past the limit window
  const oldestCallTime = Math.min(...recentTimestamps);
  return (oldestCallTime + MINUTE_IN_MS) - now + 100;
}

/**
 * Sleep for the specified duration
 * @param {number} ms - Duration to sleep in milliseconds
 * @returns {Promise<void>}
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Record a new API call timestamp
 */
function recordApiCall(): void {
  apiCallTimestamps.push(Date.now());
}

/**
 * Function that takes a prompt as input and returns the output from Gemini-1.5-flash model
 * Each call creates a new chat instance, so there's no persistent memory between calls
 * Rate limited to 14 calls per minute, will wait if rate limit is reached
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    // Check if we need to wait due to rate limiting
    const waitTime = getTimeToWait();
    if (waitTime > 0) {
      console.log(`Rate limit reached. Waiting ${waitTime}ms before next request...`);
      await sleep(waitTime);
      // After waiting, recalculate in case other requests have happened
      const newWaitTime = getTimeToWait();
      if (newWaitTime > 0) {
        await sleep(newWaitTime);
      }
    }
    
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
    
    // Record this API call
    recordApiCall();
    
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

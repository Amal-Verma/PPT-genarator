// "use server";

import { GoogleGenAI } from "@google/genai";

// Rate limiter configuration
const MAX_CALLS_PER_MINUTE = 25;
const MINUTE_IN_MS = 60 * 1000;

// Initialize the API with your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API key. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file");
}

// console.log("Using Gemini API key:", API_KEY);

const genAI = new GoogleGenAI({
  apiKey: API_KEY});

/**
 * Sleep for the specified duration
 * @param {number} ms - Duration to sleep in milliseconds
 * @returns {Promise<void>}
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

function extractJsonFromResponse(text: string): string {
  const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}

// Improved rate limiter: avoid hitting the limit by spacing calls evenly
const CALL_INTERVAL_MS = Math.ceil(MINUTE_IN_MS / MAX_CALLS_PER_MINUTE);
let lastCallTime = 0;

async function rateLimitSafe(): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastCallTime;
  if (timeSinceLast < CALL_INTERVAL_MS) {
    await sleep(CALL_INTERVAL_MS - timeSinceLast);
  }
  lastCallTime = Date.now();
}

function isRateLimitError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === 'object' && error !== null) {
    // @ts-expect-error Gemini API error shape may have response.status
    if (error.response && error.response.status === 429) return true;
    // @ts-expect-error Gemini API error shape may have message string
    if (typeof error.message === 'string' && error.message.toLowerCase().includes('rate limit')) return true;
  }
  return false;
}

/**
 * Function that takes a prompt as input and returns the output from Gemini-1.5-flash model
 * Each call creates a new chat instance, so there's no persistent memory between calls
 * Rate limited to 14 calls per minute, will wait if rate limit is reached
 */
export async function getGeminiResponse(prompt: string, isJson: boolean = true): Promise<string> {
  while (true) {
    try {
      await rateLimitSafe();
      // Use the gemini-2.0-flash-lite-001 model
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-lite-001",
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error("No response text received from Gemini API");
      }

      let outputText = response.text.trim();
      if (isJson) {
        outputText = extractJsonFromResponse(outputText);
      }

      console.log("Prompt:", prompt);
      console.log("Response:", outputText);

      // Return the text response
      return outputText;
    } catch (error) {
      if (isRateLimitError(error)) {
        // Wait a bit and retry (no limit)
        console.warn("Rate limit hit, retrying in 10s...");
        await sleep(10000);
        continue;
      }
      console.error("Error in Gemini API:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }
}

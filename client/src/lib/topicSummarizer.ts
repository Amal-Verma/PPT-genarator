import { getGeminiResponse } from './gemini';

/**
 * Summarizes a presentation topic using Gemini AI
 * 
 * @param {object} params - The parameters for the function
 * @param {string} params.topic - The full presentation topic to summarize
 * @param {number} params.maxLength - Maximum desired length for the summary (default: 150)
 * @returns {Promise<string>} - AI-generated summary of the topic
 */
export async function summarizeTopic({
  topic,
  maxLength = 150
}: {
  topic: string;
  maxLength?: number;
}): Promise<string> {
  // If topic is already short enough, return it as is
  if (topic.length <= maxLength) {
    return topic;
  }
  
  try {
    const prompt = `
    Please summarize the following presentation topic concisely while preserving its key elements:
    
    "${topic}"
    
    Important instructions:
    - Provide a summary in AT MOST ${maxLength} characters
    - Preserve key concepts and focus points
    - Maintain the original intent and meaning
    - Return ONLY the summarized text, no explanations or comments
    `;
    
    const response = await getGeminiResponse(prompt);
    
    // Clean the response (remove quotes if present)
    const summary = response.replace(/^["']|["']$/g, '').trim();
    
    // Fallback to simple truncation if the AI response is too long
    if (summary.length > maxLength) {
      return summary.substring(0, maxLength - 3) + '...';
    }
    
    return summary;
  } catch (error) {
    console.error('Error summarizing topic with AI:', error);
    
    // Fallback to simple truncation if AI summarization fails
    return topic.length > maxLength 
      ? topic.substring(0, maxLength - 3) + '...'
      : topic;
  }
}

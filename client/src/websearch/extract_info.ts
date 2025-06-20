import { getGeminiResponse } from "@/lib/gemini"

const extractInfo = async (topic:string, content: string, words: number): Promise<string> => {
  const prompt = `You are an expert researcher. Your task is to extract key information from the following content and summarizing into minimum words. Focus on identifying important facts, concepts, and insights that are relevant to the topic.
  Note: Only extract information that is directly relevant to the topic at hand. 
  Avoid including any extraneous details or personal opinions.
  Incase the content is not relevant to the topic, return an empty string.
  Limit your response to ${words} words.
  Topic: "${topic}"
  Content: "${content}"
  `;

  try {
    const response = await getGeminiResponse(prompt);
    return response.trim();
  } catch (error) {
    console.error("Error extracting information:", error);
    return "";
  }
}

export const extractInfos = async (topic: string, contents: string[], words: number): Promise<string[]> => {
  const results: string[] = [];
  
  
  for (const content of contents) {
    const extractedInfo = await extractInfo(topic, content, words);
    words = Math.max(50, words*0.9); // Reduce words for next extraction by 10%
    results.push(extractedInfo);
  }
  
  return results;
}
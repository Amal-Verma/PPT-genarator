import { webSearch } from "./webSearch"
import { extractInfos } from "./extract_info"

import { getGeminiResponse } from "@/lib/gemini";

export const getResearchSummaries = async (topic: string, breath: number = 2): Promise<string[]> => {
  const searchResults = await webSearch(topic, breath);
  const contents = searchResults.map(result => result.content);
  return extractInfos(topic, contents, 100);
}


export const generateContent = async (topic: string, description: string,breath: number = 2, webSearch: boolean): Promise<string> => {
  try {
    let summaries: string[] = [];

    if (webSearch) {
      // If web search is enabled, fetch summaries from the web
      summaries = await getResearchSummaries(topic, breath);
    }
    
    const context = `You are an expert researcher and teacher. Your task is to generate a comprehensive and coherent content piece based on the following summaries. Focus on synthesizing the information into a well-structured narrative that covers the main points and insights from the research.
    Topic: "${topic}"
    Description: "${description}"
    ${summaries.length? `Summaries: ${summaries.join("\n\n")}`: ``}
    Ensure that the content is clear, concise, and relevant to the topic at hand. Avoid including any extraneous details or personal opinions.
    Provide Expert-level insights and ensure that the content is suitable for an audience seeking in-depth knowledge on the topic.
    Provide examples where possible to enhance understanding.

    Use best markdown formatting for the content. Avoid using headings, instead use bullet points, lists, code and paragraphs to structure the content.
    if summaries are not relevant to the topic, return an content using your own knowledge.
    
    Awarness: There are other topics besides this so avoid information that is not relevant to the topic at hand.
    Most importantly, ensure that the content as short as possible while still being informative and comprehensive.
    `;

    const response = await getGeminiResponse(context, false);

    return response.trim();

  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content";
  }
}
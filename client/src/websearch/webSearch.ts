"use server";

import axios from "axios";
import * as cheerio from "cheerio";

import { SearchResult } from "./type";

export async function webSearch(query: string, numResults = 5): Promise<SearchResult[]> {
  try{
    const url = "https://www.googleapis.com/customsearch/v1";
    
    // console.log(process.env.GOOGLE_API_KEY, process.env.CSE_ID);
  
    const res = await axios.get(url, {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.CSE_ID,
        q: query,
        num: numResults
      }
    });
  
    return res.data.items
    ? await Promise.all(
          res.data.items.map(async (item: SearchResult) => ({
            link: item.link,
            content: await scrapePage(item.link),
          }))
        )
      : [];
  }
  catch {
    return [];
  }
}


/**
 * Fetches and extracts readable text content from a web page.
 * @param url The URL to scrape
 * @returns Extracted body text
 */
export async function scrapePage(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      headers: {
        // Avoid being blocked
        "User-Agent": "Mozilla/5.0 (compatible; DeepResearcherBot/1.0)",
      },
      timeout: 10000,
    });

    const html = res.data;
    const $ = cheerio.load(html);

    // Remove junk
    $("script, style, nav, footer, header, noscript, iframe").remove();

    // Grab main content — fallback to full body
    let text = $("main").text().trim() || $("body").text().trim();

    // Normalize spacing
    text = text.replace(/\s+/g, " ");

    // Limit to 10000 characters to keep LLMs happy
    return text.slice(0, 10000);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.warn(`⚠️ Failed to scrape ${url}: ${err.message}`);
    } else {
      console.warn(`⚠️ Failed to scrape ${url}: Unknown error`);
    }
    return "";
  }
}

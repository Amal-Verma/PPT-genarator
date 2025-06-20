import { z } from 'zod';

// Basic slide content types
export const contentSlideSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
  speakNote: z.string()
});

export const quoteSlideSchema = z.object({
  quote: z.string(),
  author: z.string(),
  speakNote: z.string()
});

export const titleSlideSchema = z.object({
  mainTitle: z.string(),
  subtitle: z.string(),
  speakNote: z.string()
});

export const indexSlideSchema = z.object({
  items: z.array(z.string()),
  speakNote: z.string()
});

export const thankYouSlideSchema = z.object({
  message: z.string().optional().default("Thank you for your attention!"),
  speakNote: z.string()
});

// Advanced slide content types
export const comparisonSlideSchema = z.object({
  title: z.string(),
  leftHeader: z.string(),
  rightHeader: z.string(),
  leftPoints: z.array(z.string()),
  rightPoints: z.array(z.string()),
  speakNote: z.string()
});

export const statisticsSlideSchema = z.object({
  title: z.string(),
  stats: z.array(z.object({
    value: z.string(),
    description: z.string()
  })),
  speakNote: z.string()
});

export const timelineSlideSchema = z.object({
  title: z.string(),
  events: z.array(z.object({
    date: z.string(),
    description: z.string()
  })),
  speakNote: z.string()
});

export const definitionSlideSchema = z.object({
  term: z.string(),
  definition: z.string(),
  examples: z.array(z.string()),
  speakNote: z.string()
});

export const sectionSlideSchema = z.object({
  sectionTitle: z.string(),
  description: z.string(),
  speakNote: z.string()
});

export const callToActionSlideSchema = z.object({
  title: z.string(),
  mainAction: z.string(),
  steps: z.array(z.string()),
  speakNote: z.string()
});

// Default/fallback values for each slide type
export const slideDefaults = {
  content: {
    title: "Content Slide",
    content: ['Content generation failed. Please try again.'],
    speakNote: ""
  },
  quote: {
    quote: "Content generation failed. Please try again.",
    author: "System",
    speakNote: ""
  },
  title: {
    mainTitle: "Presentation Title",
    subtitle: "Presentation Overview",
    speakNote: ""
  },
  index: {
    items: ["Main Points", "Key Concepts", "Analysis", "Conclusion"],
    speakNote: ""
  },
  thankYou: {
    message: "Thank you for your attention!",
    speakNote: ""
  },
  comparison: {
    title: "Comparison",
    leftHeader: "Option A",
    rightHeader: "Option B",
    leftPoints: ["Feature 1", "Feature 2", "Feature 3"],
    rightPoints: ["Feature 1", "Feature 2", "Feature 3"],
    speakNote: ""
  },
  statistics: {
    title: "Key Statistics",
    stats: [
      { value: "75%", description: "Example statistic" },
      { value: "2x", description: "Example growth metric" }
    ],
    speakNote: ""
  },
  timeline: {
    title: "Timeline",
    events: [
      { date: "2020", description: "Initial event" },
      { date: "2022", description: "Latest development" }
    ],
    speakNote: ""
  },
  definition: {
    term: "Term",
    definition: "Default definition text",
    examples: ["Example 1", "Example 2"],
    speakNote: ""
  },
  section: {
    sectionTitle: "New Section",
    description: "This section covers important aspects of the topic",
    speakNote: ""
  },
  callToAction: {
    title: "Call to Action",
    mainAction: "Take the next step",
    steps: ["Consider options", "Make a decision", "Implement"],
    speakNote: ""
  }
};

export function parseSlideContent(data: string, type: string){
  const jsonMatch = data.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract valid JSON from the response");
  }
  const parsedData = JSON.parse(jsonMatch[0]);
  switch(type.toLowerCase()) {
    case 'title':
      return titleSlideSchema.parse(parsedData);
    case 'index':
      return indexSlideSchema.parse(parsedData);
    case 'thankyou':
      return thankYouSlideSchema.parse(parsedData);
    case 'content':
      return contentSlideSchema.parse(parsedData);
    case 'quote':
      return quoteSlideSchema.parse(parsedData);
    case 'comparison':
      return comparisonSlideSchema.parse(parsedData);
    case 'statistics':
      return statisticsSlideSchema.parse(parsedData);
    case 'timeline':
      return timelineSlideSchema.parse(parsedData);
    case 'definition':
      return definitionSlideSchema.parse(parsedData);
    case 'section':
      return sectionSlideSchema.parse(parsedData);
    case 'calltoaction':
      return callToActionSlideSchema.parse(parsedData);
    default:
      throw new Error(`Unknown slide type: ${type}`);
  }
}

// Improved getDefaultSlideContent: takes type and title, handles overrides internally
export function getDefaultSlideContent(type: string, title: string, topic?: string) {
  switch(type.toLowerCase()) {
    case 'title':
      return titleSlideSchema.parse({
        ...slideDefaults.title,
        mainTitle: topic || title,
        subtitle: "Presentation Overview"
      });
    case 'index':
      return indexSlideSchema.parse({ ...slideDefaults.index });
    case 'thankyou':
      return thankYouSlideSchema.parse({ ...slideDefaults.thankYou });
    case 'content':
      return contentSlideSchema.parse({
        ...slideDefaults.content,
        title
      });
    case 'quote':
      return quoteSlideSchema.parse({ ...slideDefaults.quote });
    case 'comparison':
      return comparisonSlideSchema.parse({
        ...slideDefaults.comparison,
        title
      });
    case 'statistics':
      return statisticsSlideSchema.parse({
        ...slideDefaults.statistics,
        title
      });
    case 'timeline':
      return timelineSlideSchema.parse({
        ...slideDefaults.timeline,
        title
      });
    case 'definition':
      return definitionSlideSchema.parse({
        ...slideDefaults.definition,
        term: title
      });
    case 'section':
      return sectionSlideSchema.parse({
        ...slideDefaults.section,
        sectionTitle: title
      });
    case 'calltoaction':
      return callToActionSlideSchema.parse({
        ...slideDefaults.callToAction,
        title
      });
    default:
      // fallback for unknown types
      return contentSlideSchema.parse({
        title,
        content: ['Failed to generate content for unknown slide type.'],
        speakNote: ""
      });
  }
}

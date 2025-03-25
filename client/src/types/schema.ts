export interface SlideConfig {
  schema: {
    [key: string]: string;
  };
  'title-Prompt': string;
  'content-Prompt': string;
  'format-Prompt': string; // New field for format prompts
}

export interface SlideSchema {
  slides: {
    [key: string]: SlideConfig;
  };
}

// Content type definitions
export interface ContentSlideContent {
  title: string;
  content: string[];
}

export interface QuoteSlideContent {
  author: string;
  quote: string;
}

// Union type for slide content based on slide type
export type SlideContent = ContentSlideContent | QuoteSlideContent;

// Presentation slide structure
export interface PresentationSlide {
  SlideNumber: number;
  slideType: string;
  Title: string;
  Content: SlideContent;
}

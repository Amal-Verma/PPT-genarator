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

// New slide content types
export interface TitleSlideContent {
  mainTitle: string;
  subtitle: string;
}

export interface IndexSlideContent {
  items: string[];
}

export interface ThankYouSlideContent {
  message?: string; // Optional custom message
}

// Union type for slide content based on slide type
export type SlideContent = 
  | ContentSlideContent 
  | QuoteSlideContent
  | TitleSlideContent
  | IndexSlideContent
  | ThankYouSlideContent;

// Presentation slide structure
export interface PresentationSlide {
  SlideNumber: number;
  slideType: 'title' | 'content' | 'quote' | 'index' | 'thankYou';
  Title: string;
  Content: SlideContent;
}

// New interface for overall presentation structure
export interface Presentation {
  name: string; // Summary/name of the entire presentation
  slides: PresentationSlide[];
}

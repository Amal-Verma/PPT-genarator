export interface SlideConfig {
  schema: {
    [key: string]: string;
  };
  'title-Prompt': string;
  'content-Prompt': string;
  'format-Prompt': string; // New field for format prompts
}

export type PresentationTitle = {
  title: string, 
  type: string,
  webSearch: boolean
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

// New slide content types
export interface ComparisonSlideContent {
  title: string;
  leftHeader: string;
  rightHeader: string;
  leftPoints: string[];
  rightPoints: string[];
}

export interface StatisticsSlideContent {
  title: string;
  stats: Array<{
    value: string;
    description: string;
  }>;
}

export interface TimelineSlideContent {
  title: string;
  events: Array<{
    date: string;
    description: string;
  }>;
}

export interface DefinitionSlideContent {
  term: string;
  definition: string;
  examples: string[];
}

export interface SectionSlideContent {
  sectionTitle: string;
  description: string;
}

export interface CallToActionSlideContent {
  title: string;
  mainAction: string;
  steps: string[];
}

// Union type for slide content based on slide type
export type SlideContent = (
  ContentSlideContent 
  | QuoteSlideContent
  | TitleSlideContent
  | IndexSlideContent
  | ThankYouSlideContent
  | ComparisonSlideContent
  | StatisticsSlideContent
  | TimelineSlideContent
  | DefinitionSlideContent
  | SectionSlideContent
  | CallToActionSlideContent
) & {
  speakNote: string;
  // webSearch: boolean; // Optional field for web search
};

// Presentation slide structure
export interface PresentationSlide {
  SlideNumber: number;
  slideType: 'title' | 'content' | 'quote' | 'index' | 'thankYou' | 'comparison' | 'statistics' | 'timeline' | 'definition' | 'section' | 'callToAction';
  Title: string;
  Content: SlideContent;
  webSearch: boolean; // Optional field for web search
}

// New interface for overall presentation structure
export interface Presentation {
  name: string; // Summary/name of the entire presentation
  slides: PresentationSlide[];
}

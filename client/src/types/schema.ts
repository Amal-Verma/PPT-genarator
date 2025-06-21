export type SlideConfig = {
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

export type SlideSchema = {
  slides: {
    [key: string]: SlideConfig;
  };
}

export type commonSchema = {
  speakNote: string;
}

// Content type definitions
export type ContentSlideContent = {
  title: string;
  content: string[];
}
& commonSchema; // Common schema for all content types

export type QuoteSlideContent = {
  author: string;
  quote: string;
}
& commonSchema; // Common schema for all content types

// New slide content types
export type TitleSlideContent = {
  mainTitle: string;
  subtitle: string;
}
& commonSchema; // Common schema for all content types

export type IndexSlideContent = {
  items: string[];  
}
& commonSchema; // Common schema for all content types

export type ThankYouSlideContent = {
  message?: string; // Optional custom message
}
& commonSchema; // Common schema for all content types

// New slide content types
export type ComparisonSlideContent = {
  title: string;
  leftHeader: string;
  rightHeader: string;
  leftPoints: string[];
  rightPoints: string[];
}
& commonSchema; // Common schema for all content types

export type StatisticsSlideContent = {
  title: string;
  stats: Array<{
    value: string;
    description: string;
  }>
}
& commonSchema; // Common schema for all content types

export type TimelineSlideContent = {
  title: string;
  events: Array<{
    date: string;
    description: string;
  }>
}
& commonSchema; // Common schema for all content types

export type DefinitionSlideContent = {
  term: string;
  definition: string;
  examples: string[];
}
& commonSchema; // Common schema for all content types

export type SectionSlideContent = {
  sectionTitle: string;
  description: string;
}
& commonSchema; // Common schema for all content types

export type CallToActionSlideContent = {
  title: string;
  mainAction: string;
  steps: string[];
}
& commonSchema; // Common schema for all content types

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
)
// Presentation slide structure
export type PresentationSlide = {
  SlideNumber: number;
  slideType: 'title' | 'content' | 'quote' | 'index' | 'thankYou' | 'comparison' | 'statistics' | 'timeline' | 'definition' | 'section' | 'callToAction';
  Title: string;
  Content: SlideContent;
  webSearch: boolean; // Optional field for web search
}

// New type for overall presentation structure
export type Presentation = {
  name: string; // Summary/name of the entire presentation
  slides: PresentationSlide[];
}

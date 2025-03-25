export interface SlideConfig {
  schema: {
    [key: string]: string;
  };
  'title-Prompt': string;
  'content-Prompt': string;
}

export interface SlideSchema {
  slides: {
    [key: string]: SlideConfig;
  };
}

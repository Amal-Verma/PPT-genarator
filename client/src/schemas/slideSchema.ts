import { SlideSchema } from '@/types/schema';

const slideSchema: SlideSchema = {
  slides: {
    content: {
      schema: {
        title: 'string',
        content: 'string[]'
      },
      'title-Prompt': 'A standard slide with title and bullet points',
      'content-Prompt': 'Create professional bullet points for a slide titled "{title}" in a presentation about {topic}. Focus on key information that would be appropriate for a slide.',
      'format-Prompt': `FORMAT: Return a JSON object with:
{
  "title": "The slide title",
  "content": ["Point 1", "Point 2", ...]
}`
    },
    quote: {
      schema: {
        quote: 'string',
        author: 'string'
      },
      'title-Prompt': 'A slide featuring a relevant quote from an expert or notable figure',
      'content-Prompt': 'Find a relevant and powerful quote related to "{title}" for a presentation about {topic}. Include the author of the quote.',
      'format-Prompt': `FORMAT: Return a JSON object with:
{
  "quote": "The quotation text",
  "author": "Name of the person who said or wrote the quote"
}`
    }
    // Add more slide types as needed
  }
};

export default slideSchema;

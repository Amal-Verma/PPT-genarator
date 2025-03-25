import { SlideSchema } from '@/types/schema';

const slideSchema: SlideSchema = {
  slides: {
    title: {
      schema: {
        mainTitle: 'string',
        subtitle: 'string'
      },
      'title-Prompt': 'The first slide with main title and subtitle',
      'content-Prompt': 'Create a compelling title and subtitle for a presentation about {topic}. The title should be catchy and the subtitle should briefly explain the presentation\'s purpose.',
      'format-Prompt': `FORMAT: Return a JSON object with:
{
  "mainTitle": "The main presentation title",
  "subtitle": "A brief subtitle or tagline"
}`
    },
    index: {
      schema: {
        items: 'string[]'
      },
      'title-Prompt': 'A table of contents slide showing key topics covered',
      'content-Prompt': 'Create a concise table of contents for a presentation about {topic}. Include 4-5 main points that will be covered in the presentation.',
      'format-Prompt': `FORMAT: Return a JSON object with:
{
  "items": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}`
    },
    content: {
      schema: {
        title: 'string',
        content: 'string[]'
      },
      'title-Prompt': 'A standard slide with title and bullet points',
      'content-Prompt': 'Create professional bullet points for a slide titled "{title}" in a presentation about {topic}. Focus on key information that would be appropriate for a slide. Limit to 4-5 points.',
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
    },
    thankYou: {
      schema: {
        message: 'string'
      },
      'title-Prompt': 'The final slide thanking the audience',
      'content-Prompt': 'Create a simple thank you message to end a presentation about {topic}.',
      'format-Prompt': `FORMAT: Return a JSON object with:
{
  "message": "Thank you message (optional)"
}`
    }
  }
};

export default slideSchema;

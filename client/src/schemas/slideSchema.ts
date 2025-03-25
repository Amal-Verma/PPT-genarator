import { SlideSchema } from '@/types/schema';

const slideSchema: SlideSchema = {
  slides: {
    content: {
      schema: {
        title: 'string',
        content: 'Array<string>'
      },
      'title-Prompt': 'Content slides present information or explain concepts related to the presentation topic.',
      'content-Prompt': ''
    },
    quote: {
      schema: {
        author: 'string',
        quote: 'string'
      },
      'title-Prompt': 'Quote slides feature important quotations with their authors relevant to the presentation topic.',
      'content-Prompt': ''
    }
  }
};

export default slideSchema;

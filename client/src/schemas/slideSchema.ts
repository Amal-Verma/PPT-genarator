import { SlideSchema } from '@/types/schema';

const speakNotePrompt = 'Generate a concise speaker note that summarizes the key points of this slide. This note should be used to guide the speaker during the presentation.';

function formatPrompt(fields: Record<string, string>) {
  return `FORMAT: Return a JSON object with:\n{\n${Object.entries(fields)
    .map(([key, val]) => `  "${key}": ${val}`)
    .join(',\n')}\n}`;
}

const slideSchema: SlideSchema = {
  slides: {
    title: {
      schema: {
        mainTitle: 'string',
        subtitle: 'string'
      },
      'title-Prompt': 'The first slide with main title and subtitle',
      'content-Prompt': 'Create a compelling title and subtitle for a presentation named {presentationName} about "{topic}". The title should be catchy and the subtitle should briefly explain the presentation\'s purpose.',
      'format-Prompt': formatPrompt({
        mainTitle: '"The main presentation title"',
        subtitle: '"A brief subtitle or tagline"',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    index: {
      schema: {
        items: 'string[]'
      },
      'title-Prompt': 'A table of contents slide showing key topics covered',
      'content-Prompt': 'Create a concise table of contents using the following slide titles: \n"{slideTitlesString}". Include 4-5 main points that will be covered in the presentation.',
      'format-Prompt': formatPrompt({
        items: '["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    content: {
      schema: {
        title: 'string',
        content: 'string[]'
      },
      'title-Prompt': 'A standard slide with title and bullet points',
      'content-Prompt': 'Create professional bullet points for a slide titled "{title}" in a presentation about {topic}. Focus on key information that would be appropriate for a slide. Limit to 4-5 points.',
      'format-Prompt': formatPrompt({
        title: '"The slide title"',
        content: '["Point 1", "Point 2", ...]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    quote: {
      schema: {
        quote: 'string',
        author: 'string'
      },
      'title-Prompt': 'A slide featuring a relevant quote from an expert or notable figure',
      'content-Prompt': 'Find a relevant and powerful quote related to "{title}" for a presentation about {topic}. Include the author of the quote.',
      'format-Prompt': formatPrompt({
        quote: '"The quotation text"',
        author: '"Name of the person who said or wrote the quote"',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    thankYou: {
      schema: {
        message: 'string'
      },
      'title-Prompt': 'The final slide thanking the audience',
      'content-Prompt': 'Create a simple thank you message to end a presentation about {topic}.',
      'format-Prompt': formatPrompt({
        message: '"Thank you message (optional)"',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    comparison: {
      schema: {
        title: 'string',
        leftHeader: 'string',
        rightHeader: 'string',
        leftPoints: 'string[]',
        rightPoints: 'string[]'
      },
      'title-Prompt': 'A slide comparing two concepts side by side',
      'content-Prompt': 'Create a comparison slide for a presentation about {topic}. Compare two relevant aspects related to "{title}".',
      'format-Prompt': formatPrompt({
        title: '"Comparison title"',
        leftHeader: '"First concept name"',
        rightHeader: '"Second concept name"',
        leftPoints: '["Point 1", "Point 2", "Point 3"]',
        rightPoints: '["Point 1", "Point 2", "Point 3"]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    statistics: {
      schema: {
        title: 'string',
        stats: 'object[]'
      },
      'title-Prompt': 'A slide highlighting important statistics',
      'content-Prompt': 'Create a statistics slide for a presentation about {topic}. Include 3-4 key statistics related to "{title}" with brief descriptions.',
      'format-Prompt': formatPrompt({
        title: '"Statistics title"',
        stats: '[{ "value": "75%", "description": "Brief description of this statistic" }, { "value": "$2.5B", "description": "Brief description of this statistic" }]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    timeline: {
      schema: {
        title: 'string',
        events: 'object[]'
      },
      'title-Prompt': 'A slide showing a chronological timeline of events',
      'content-Prompt': 'Create a timeline slide for a presentation about {topic}. Include 4-5 key events or milestones related to "{title}" in chronological order.',
      'format-Prompt': formatPrompt({
        title: '"Timeline title"',
        events: '[{ "date": "Year or date", "description": "Description of what happened" }, { "date": "Year or date", "description": "Description of what happened" }]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    definition: {
      schema: {
        term: 'string',
        definition: 'string',
        examples: 'string[]'
      },
      'title-Prompt': 'A slide defining a key term or concept',
      'content-Prompt': 'Create a definition slide for a presentation about {topic}. Define an important term related to "{title}" and provide examples.',
      'format-Prompt': formatPrompt({
        term: '"Term to be defined"',
        definition: '"Clear and concise definition"',
        examples: '["Example 1", "Example 2"]',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    section: {
      schema: {
        sectionTitle: 'string',
        description: 'string'
      },
      'title-Prompt': 'A slide indicating a new section of the presentation',
      'content-Prompt': 'Create a section divider slide for a presentation about {topic}. This will introduce the section about "{title}".',
      'format-Prompt': formatPrompt({
        sectionTitle: '"Title of the new section"',
        description: '"Brief description of what this section will cover"',
        speakNote: `"${speakNotePrompt}"`
      })
    },
    callToAction: {
      schema: {
        title: 'string',
        mainAction: 'string',
        steps: 'string[]'
      },
      'title-Prompt': 'A slide prompting the audience to take specific actions',
      'content-Prompt': 'Create a call to action slide for a presentation about {topic}. Include a clear main action and steps related to "{title}".',
      'format-Prompt': formatPrompt({
        title: '"Call to Action title"',
        mainAction: '"The primary action you want the audience to take"',
        steps: '["Step 1", "Step 2", "Step 3"]',
        speakNote: `"${speakNotePrompt}"`
      })
    }
  }
};

export default slideSchema;

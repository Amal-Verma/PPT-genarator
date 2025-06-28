# AI Presentation Generator

[**Live Demo → https://ppt-genarator-phi.vercel.app/**](https://ppt-genarator-phi.vercel.app/)

A modern web app to instantly generate professional .pptx presentations from a single prompt using a structured, multi-stage LLM pipeline.

Built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Gemini 2.0 Flash Lite](https://ai.google.dev/gemini-api/docs/). Exports are powered by [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Google Search API is used for real-time research and factual accuracy.

---

## Main Feature

- **AI-powered PowerPoint generation**: Instantly generate complete .pptx presentations from a single prompt, with outline, content, and speaker notes.
- **Multi-stage LLM pipeline**: Uses Gemini 2.0 for slide planning, tone-controlled content, and speaker notes.
- **Diverse slide types**: Supports content, comparison, quote, statistics, timeline, and more.
- **Factual accuracy**: Optionally enriches slides with up-to-date facts and examples.
- **Topic hierarchy**: Supports depth-based topic expansion (main topic → subtopics → subpoints).
- **Customizable tones**: Choose from multiple presentation tones (professional, casual, etc).
- **Outline review**: Instantly review and edit the generated outline before creating slides.
- **Export to PowerPoint**: Download your presentation as a .pptx file, with professional design.

---

## Web Search Integration

- **Google Search API**: For slides marked as needing research, the app fetches and summarizes real-time information to ensure accuracy and relevance.
- **Hierarchical Topic Expansion**: The app can expand each node of a topic tree by a specified branch factor up to a given depth, then performs web search and summarization for each node in the tree. This enables deep, structured research and content generation for complex topics.

---

## Additional/Optional Features

- **Notes & topic tree**: Generate and download topic trees and notes as Markdown or PDF.
- **Gemini Chat**: Built-in chat for research and brainstorming.

---

## Getting Started

1. **Install dependencies:**

   ```bash
   cd client
   npm install
   # or
   yarn
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Usage

1. **Generate Presentation**
   - Go to `/generate`
   - Enter your topic, select number of slides and tone.
   - Review the outline, then generate the full presentation.

2. **Preview & Export**
   - Preview each slide, including presenter notes.
   - Download as a PowerPoint file with one click.

3. **Notes & Topic Tree**
   - Go to `/notes` to generate a topic tree or notes for any subject.
   - Download as Markdown or PDF.

4. **Gemini Chat**
   - Go to `/chat` for AI-powered research and brainstorming.

---

## Project Structure

```
src/
  app/                # Next.js app routes (pages: generate, notes, chat, websearch)
  components/         # React UI components (presentation, chat, forms, etc)
  lib/                # Core logic: AI calls, slide/presentation generation
  schemas/            # Zod schemas for slide types and validation
  types/              # TypeScript types for slides, presentations, etc
  utils/              # Utilities (pptx export, retry, etc)
    pptx/Template1/   # PowerPoint slide templates
  websearch/          # Web search and content extraction logic
public/               # Static assets (SVGs, favicon, etc)
```

---

## How It Works

1. **Outline Generation**: AI generates a presentation outline (slide titles/types) from your topic and tone.
2. **Slide Content**: For each slide, AI generates structured content (bullet points, quotes, statistics, etc) and presenter notes.
3. **Web Search (optional)**: For slides marked as needing research, the app fetches and summarizes web content to enrich the slide.
4. **Export**: All slides are rendered and exported to a PowerPoint file using `pptxgenjs`.

---

## Customization

- **Slide Types**: Supports title, content, quote, index, thank you, comparison, statistics, timeline, definition, section, and call-to-action slides.
- **Schemas**: All slide content is validated with Zod schemas for consistency.
- **Design**: PowerPoint export uses a modern, professional template.

---

## Dependencies

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [pptxgenjs](https://gitbrent.github.io/PptxGenJS/)
- [Zod](https://zod.dev/) (validation)
- [jsPDF](https://github.com/parallax/jsPDF) (PDF export for notes)
- [Gemini AI](https://ai.google.dev/gemini-api/docs/) (slide/content generation)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [pptxgenjs Docs](https://gitbrent.github.io/PptxGenJS/)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/)

---

## Deployment

The easiest way to deploy is on [Vercel](https://vercel.com/). See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## License

This project is licensed under the MIT License. See the [LICENSE](client/LICENSE) file for details.

---

## Contributing

Pull requests and feedback are welcome! See [GitHub](https://github.com/amalshaji/ppt-genarator).

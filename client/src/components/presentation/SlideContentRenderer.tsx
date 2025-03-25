import { PresentationSlide } from '@/types/schema';

interface SlideContentRendererProps {
  slide: PresentationSlide;
}

export default function SlideContentRenderer({ slide }: SlideContentRendererProps) {
  // Check if the slide is a quote slide
  if (slide.slideType === 'quote') {
    const quoteContent = slide.Content as { quote: string; author: string };
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <blockquote className="text-2xl italic font-serif mb-4">
          "{quoteContent.quote}"
        </blockquote>
        <cite className="text-gray-600 not-italic">— {quoteContent.author}</cite>
      </div>
    );
  }

  // Default content slide rendering
  const contentSlide = slide.Content as { title: string; content: string[] };
  return (
    <div className="h-full">
      {contentSlide.title && contentSlide.title !== slide.Title && (
        <h4 className="text-xl font-semibold mb-4">{contentSlide.title}</h4>
      )}
      <ul className="space-y-2">
        {contentSlide.content.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

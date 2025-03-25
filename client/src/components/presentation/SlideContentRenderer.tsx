import { PresentationSlide } from '@/types/schema';

interface SlideContentRendererProps {
  slide: PresentationSlide;
}

export default function SlideContentRenderer({ slide }: SlideContentRendererProps) {
  // Title slide type
  if (slide.slideType === 'title') {
    const titleContent = slide.Content as { mainTitle: string; subtitle: string };
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <h1 className="text-4xl font-bold mb-4">{titleContent.mainTitle}</h1>
        <h2 className="text-xl text-gray-600">{titleContent.subtitle}</h2>
      </div>
    );
  }
  
  // Index slide type
  if (slide.slideType === 'index') {
    const indexContent = slide.Content as { items: string[] };
    return (
      <div className="flex flex-col h-full justify-center px-8">
        <h3 className="text-2xl font-semibold mb-6 text-center">Table of Contents</h3>
        <ol className="list-decimal pl-8 space-y-3">
          {indexContent.items.map((item, index) => (
            <li key={index} className="text-lg">{item}</li>
          ))}
        </ol>
      </div>
    );
  }
  
  // Thank You slide type
  if (slide.slideType === 'thankYou') {
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <h1 className="text-4xl font-bold mb-4">Thank You</h1>
        {slide.Content && (slide.Content as {message?: string}).message && (
          <p className="text-xl text-gray-600">{(slide.Content as {message: string}).message}</p>
        )}
      </div>
    );
  }

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

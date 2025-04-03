import { 
  PresentationSlide, 
  ComparisonSlideContent, 
  StatisticsSlideContent,
  TimelineSlideContent,
  DefinitionSlideContent,
  SectionSlideContent,
  CallToActionSlideContent
} from '@/types/schema';

interface SlideContentRendererProps {
  slide: PresentationSlide;
}

export default function SlideContentRenderer({ slide }: SlideContentRendererProps) {
  // Title slide type
  if (slide.slideType === 'title') {
    const titleContent = slide.Content as { mainTitle: string; subtitle: string };
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{titleContent.mainTitle}</h1>
        <h2 className="text-xl text-gray-700">{titleContent.subtitle}</h2>
      </div>
    );
  }
  
  // Index slide type
  if (slide.slideType === 'index') {
    const indexContent = slide.Content as { items: string[] };
    return (
      <div className="flex flex-col h-full justify-center px-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">Table of Contents</h3>
        <ol className="list-decimal pl-8 space-y-3">
          {indexContent.items.map((item, index) => (
            <li key={index} className="text-lg text-gray-800">{item}</li>
          ))}
        </ol>
      </div>
    );
  }
  
  // Thank You slide type
  if (slide.slideType === 'thankYou') {
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Thank You</h1>
        {slide.Content && (slide.Content as {message?: string}).message && (
          <p className="text-xl text-gray-700">{(slide.Content as {message: string}).message}</p>
        )}
      </div>
    );
  }

  // Check if the slide is a quote slide
  if (slide.slideType === 'quote') {
    const quoteContent = slide.Content as { quote: string; author: string };
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8 bg-gray-50 rounded-lg p-6">
        <blockquote className="text-2xl italic font-serif mb-4 text-gray-800">
          &quot;{quoteContent.quote}&quot;
        </blockquote>
        <cite className="text-gray-700 not-italic">— {quoteContent.author}</cite>
      </div>
    );
  }

  // Comparison slide type
  if (slide.slideType === 'comparison') {
    const comparisonContent = slide.Content as ComparisonSlideContent;
    return (
      <div className="h-full">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">{comparisonContent.title}</h3>
        <div className="flex flex-row justify-between gap-6">
          <div className="flex-1 border-r pr-4">
            <h4 className="text-xl font-semibold mb-4 text-blue-700">{comparisonContent.leftHeader}</h4>
            <ul className="space-y-3">
              {comparisonContent.leftPoints.map((point, index) => (
                <li key={index} className="flex">
                  <span className="mr-2 text-blue-600">•</span>
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold mb-4 text-green-700">{comparisonContent.rightHeader}</h4>
            <ul className="space-y-3">
              {comparisonContent.rightPoints.map((point, index) => (
                <li key={index} className="flex">
                  <span className="mr-2 text-green-600">•</span>
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Statistics slide type
  if (slide.slideType === 'statistics') {
    const statsContent = slide.Content as StatisticsSlideContent;
    return (
      <div className="h-full">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">{statsContent.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {statsContent.stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-700">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Timeline slide type
  if (slide.slideType === 'timeline') {
    const timelineContent = slide.Content as TimelineSlideContent;
    return (
      <div className="h-full">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">{timelineContent.title}</h3>
        <div className="space-y-4">
          {timelineContent.events.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4 bg-blue-600 text-white px-3 py-1 rounded font-semibold min-w-20 text-center">
                {event.date}
              </div>
              <div className="flex-1 pt-1 border-l-2 border-blue-200 pl-4 pb-4">
                {event.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Definition slide type
  if (slide.slideType === 'definition') {
    const definitionContent = slide.Content as DefinitionSlideContent;
    return (
      <div className="h-full">
        <h3 className="text-2xl font-semibold mb-3 text-center text-blue-700">{definitionContent.term}</h3>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-gray-800 italic">
          {definitionContent.definition}
        </div>
        <h4 className="text-lg font-semibold mb-2 text-gray-900">Examples:</h4>
        <ul className="space-y-2">
          {definitionContent.examples.map((example, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-blue-600">•</span>
              <span className="text-gray-800">{example}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Section slide type
  if (slide.slideType === 'section') {
    const sectionContent = slide.Content as SectionSlideContent;
    return (
      <div className="flex flex-col h-full justify-center items-center text-center px-8">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">{sectionContent.sectionTitle}</h2>
        <p className="text-xl text-gray-700">{sectionContent.description}</p>
      </div>
    );
  }
  
  // Call to Action slide type
  if (slide.slideType === 'callToAction') {
    const ctaContent = slide.Content as CallToActionSlideContent;
    return (
      <div className="h-full">
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-900">{ctaContent.title}</h3>
        <div className="mb-6 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xl font-bold text-blue-700">{ctaContent.mainAction}</p>
        </div>
        <ol className="list-decimal pl-8 space-y-3">
          {ctaContent.steps.map((step, index) => (
            <li key={index} className="text-lg text-gray-800">{step}</li>
          ))}
        </ol>
      </div>
    );
  }

  // Default content slide rendering
  const contentSlide = slide.Content as { title: string; content: string[] };
  return (
    <div className="h-full">
      {contentSlide.title && contentSlide.title !== slide.Title && (
        <h4 className="text-xl font-semibold mb-4 text-gray-900">{contentSlide.title}</h4>
      )}
      <ul className="space-y-3">
        {contentSlide.content.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-2 text-blue-600">•</span>
            <span className="text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

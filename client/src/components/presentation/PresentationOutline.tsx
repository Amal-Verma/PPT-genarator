import React from 'react';

interface SlideTitle {
  title: string;
  type: string;
}

interface PresentationOutlineProps {
  presentationName: string;
  slides: SlideTitle[];
  onStartOver: () => void;
  onCreatePresentation: () => void;
  isGenerating: boolean;
}

export default function PresentationOutline({
  presentationName,
  slides,
  onStartOver,
  onCreatePresentation,
  isGenerating
}: PresentationOutlineProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Generated Presentation Outline</h2>
          {presentationName && (
            <p className="text-sm text-gray-600 mt-1">{presentationName}</p>
          )}
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
          {slides.length} slides generated
        </span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {slides.map((slide, index) => (
          <li key={index} className="p-4 border border-gray-200 hover:border-blue-200 rounded-md transition bg-white hover:bg-blue-50">
            <div className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-7 h-7 flex items-center justify-center mr-3 font-medium shrink-0">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-gray-900">{slide.title}</h3>
                <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-medium uppercase">
                  {slide.type}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="flex gap-4 justify-end">
        <button 
          onClick={onStartOver}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition"
        >
          Start Over
        </button>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition"
          onClick={onCreatePresentation}
          disabled={isGenerating}
        >
          Create Full Presentation
        </button>
      </div>
    </div>
  );
}

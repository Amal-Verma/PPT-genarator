import React, { useState } from 'react';
import { PresentationSlide } from '@/types/schema';
import DevJsonModal from '@/components/dev/DevJsonModal';

interface PresentationContentProps {
  slides: PresentationSlide[];
  onBackToOutline: () => void;
}

export default function PresentationContent({ slides, onBackToOutline }: PresentationContentProps) {
  // Dev-only state for JSON modal
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Generated Presentation</h2>
        <div className="flex items-center gap-2">
          {/* Development-only button */}
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded border border-gray-300 hover:bg-gray-300"
            title="Development tool: View raw JSON data"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
              </svg>
              JSON
            </span>
          </button>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {slides.length} slides created
          </span>
        </div>
      </div>
      
      <div className="space-y-8 mb-8">
        {slides.map((slide, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{slide.Title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Slide {slide.SlideNumber}</span>
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium uppercase">
                    {slide.slideType}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {slide.slideType === 'quote' && 'quote' in slide.Content && (
                <div className="flex flex-col items-center text-center p-4">
                  <p className="text-xl italic mb-2">"{slide.Content.quote}"</p>
                  {slide.Content.author && (
                    <p className="font-medium text-gray-700">— {slide.Content.author}</p>
                  )}
                </div>
              )}
              
              {slide.slideType === 'content' && 'content' in slide.Content && (
                <div className="space-y-3">
                  {slide.Content.content.map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700">{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 justify-end">
        <button 
          onClick={onBackToOutline}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition"
        >
          Back to Outline
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition"
          onClick={() => {
            // Placeholder for export functionality
            alert('Export functionality will be implemented soon.');
          }}
        >
          Export Presentation
        </button>
      </div>
      
      {/* Development-only modal for showing JSON data */}
      <DevJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        title="Presentation JSON Data (Development Only)"
        data={slides}
      />
    </div>
  );
}

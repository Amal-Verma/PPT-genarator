import React, { useState } from 'react';
import { PresentationSlide } from '@/types/schema';
import DevJsonModal from '@/components/dev/DevJsonModal';
import SlideContentRenderer from './SlideContentRenderer';

interface PresentationContentProps {
  presentationName: string;
  slides: PresentationSlide[];
  onBackToOutline: () => void;
  loadingSlides?: number[]; // Add the loadingSlides prop
}

export default function PresentationContent({ 
  presentationName,
  slides, 
  onBackToOutline,
  loadingSlides = [] // Default to empty array if not provided
}: PresentationContentProps) {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Helper function to check if slide is loading
  const isSlideLoading = (slideNumber: number) => {
    return loadingSlides.includes(slideNumber);
  };

  // Get current slide
  const currentSlide = slides[currentSlideIndex];
  
  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Presentation Preview</h2>
          {presentationName && (
            <p className="text-sm text-gray-600 mt-1">{presentationName}</p>
          )}
        </div>
        <button
          onClick={onBackToOutline}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
        >
          Back to Outline
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-4">
        {/* Current slide navigation */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePreviousSlide}
            disabled={currentSlideIndex === 0}
            className={`px-3 py-1 rounded ${currentSlideIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          <div className="text-sm text-gray-500">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
          <button 
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className={`px-3 py-1 rounded ${currentSlideIndex === slides.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>

        {/* Slide content */}
        <div className="aspect-video bg-white border shadow-sm rounded-md p-8 flex flex-col">
          {isSlideLoading(currentSlide?.SlideNumber) ? (
            // Loading state for current slide
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">Generating slide content...</p>
            </div>
          ) : (
            // Render slide content if it's loaded
            <>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 border-b pb-4">{currentSlide?.Title}</h3>
              <div className="flex-1 bg-white">
                {currentSlide && <SlideContentRenderer slide={currentSlide} />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Slide thumbnails/navigation */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {slides.map((slide, index) => (
          <div 
            key={slide.SlideNumber}
            onClick={() => setCurrentSlideIndex(index)}
            className={`cursor-pointer p-2 rounded border ${currentSlideIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
          >
            {isSlideLoading(slide.SlideNumber) ? (
              // Loading indicator for thumbnail
              <div className="h-16 flex items-center justify-center">
                <div className="animate-pulse h-2 w-12 bg-gray-300 rounded"></div>
              </div>
            ) : (
              // Simple thumbnail content
              <div className="text-xs truncate">
                <div className="font-semibold truncate text-gray-900">{slide.Title}</div>
                <div className="text-gray-600">Slide {slide.SlideNumber}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-end mt-8">
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

        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
        >
          View JSON Data
        </button>

      </div>
      
      {/* Development-only modal for showing JSON data */}
      <DevJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        title="Presentation JSON Data (Development Only)"
        data={{presentationName, slides}}
      />
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { PresentationSlide } from '@/types/schema';
import DevJsonModal from '@/components/dev/DevJsonModal';
import SlideContentRenderer from './SlideContentRenderer';
import { exportToPowerPoint } from '@/utils/pptx/exportPresentation';

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
  loadingSlides = []
}: PresentationContentProps) {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Helper function to check if slide is loading
  const isSlideLoading = (slideNumber: number) => {
    return loadingSlides.includes(slideNumber);
  };

  // Get current slide
  const currentSlide = slides[currentSlideIndex];

  // Memoized speakNote extraction for current slide
  const speakNote = useMemo(() => {
    if (!currentSlide || !currentSlide.Content) return '';
    // Try to find a speakNote property in the content
    if (typeof currentSlide.Content === 'object' && 'speakNote' in currentSlide.Content) {
      return (currentSlide.Content as {speakNote: string}).speakNote || '';
    }
    return '';
  }, [currentSlide]);

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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      
      console.log('Starting export process...');
      
      // Make sure we have valid data
      if (!slides || slides.length === 0) {
        throw new Error('No slides to export');
      }
      
      // Log the slide data to help with debugging
      console.log('Exporting presentation:', {
        name: presentationName,
        slideCount: slides.length,
        slides: slides.map(s => ({
          num: s.SlideNumber,
          type: s.slideType,
          title: s.Title
        }))
      });
      
      await exportToPowerPoint({
        presentationName: presentationName,
        slides: slides
      });
      
      console.log('Export completed successfully');
    } catch (error) {
      console.error("Export failed:", error);
      setExportError((error as Error).message || "Failed to export presentation");
      alert("Failed to export presentation. Please check console for details.");
    } finally {
      setIsExporting(false);
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
        {/* Speak Note display moved outside the aspect-video box */}
        {!isSlideLoading(currentSlide?.SlideNumber) && speakNote && (
          <div className="mt-6 flex items-center justify-center">
            <div className="bg-yellow-50 border border-yellow-300 rounded px-4 py-2 text-yellow-900 text-sm max-w-2xl w-full text-center shadow-sm">
              <span className="font-semibold mr-2">Presenter Note:</span>
              <span>{speakNote}</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide thumbnails/navigation */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {slides.map((slide, index) => (
          <div 
            key={slide.SlideNumber}
            onClick={() => setCurrentSlideIndex(index)}
            className={`cursor-pointer p-2 rounded border relative group 
              ${slide.webSearch ? 'border-yellow-400 bg-yellow-100' : currentSlideIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
            `}
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
            {/* Slide type tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                {slide.slideType}
              </div>
            </div>
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
          className={`px-4 py-2 ${isExporting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md shadow-sm transition flex items-center`}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isExporting ? 'Downloading...' : 'Download Presentation'}
        </button>

        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
        >
          View JSON Data
        </button>
      </div>
      
      {exportError && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          <p className="font-medium">Export Error:</p>
          <p className="text-sm">{exportError}</p>
        </div>
      )}
      
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

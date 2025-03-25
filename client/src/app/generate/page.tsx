'use client';

import { useState, FormEvent } from 'react';
import { generateSlideTitles } from '@/lib/slideGenerator';
import Link from 'next/link';

interface SlideTitle {
  title: string;
  type: string;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [numberOfSlides, setNumberOfSlides] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSlides, setGeneratedSlides] = useState<SlideTitle[] | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a presentation topic');
      return;
    }
    
    try {
      setError(null);
      setIsGenerating(true);
      setGeneratedSlides(null); // Clear previous results
      
      // Call the slide generator function directly from the client
      const slides = await generateSlideTitles({
        prompt,
        numberOfSlides
      });
      
      setGeneratedSlides(slides);
    } catch (err) {
      console.error('Error generating slides:', err);
      setError('Failed to generate slides. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presentation Generator</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>← Back to home</span>
          </Link>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Presentation Slides</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                What is your presentation about?
              </label>
              <textarea
                id="prompt"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic (e.g., Climate change and its effects on biodiversity, Artificial intelligence in healthcare, etc.)"
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <label htmlFor="slides" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Slides
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="slides"
                  type="range"
                  min="3"
                  max="15"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={numberOfSlides}
                  onChange={(e) => setNumberOfSlides(parseInt(e.target.value))}
                  disabled={isGenerating}
                />
                <span className="w-12 text-center text-gray-700 font-medium">{numberOfSlides}</span>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isGenerating}
                className={`px-5 py-3 rounded-md font-medium w-full transition ${
                  isGenerating 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </div>
                ) : 'Generate Slides'}
              </button>
            </div>
          </form>
        </div>
        
        {isGenerating && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Generating your presentation outline</h3>
              <p className="text-gray-600">This may take a few moments...</p>
            </div>
          </div>
        )}
        
        {generatedSlides && !isGenerating && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Generated Presentation Outline</h2>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                {generatedSlides.length} slides generated
              </span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {generatedSlides.map((slide, index) => (
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
                onClick={() => setGeneratedSlides(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition"
              >
                Start Over
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition"
                onClick={() => {
                  // This is a placeholder for future functionality
                  alert('This functionality will be implemented in the future: creating a full presentation from this outline.');
                }}
              >
                Create Presentation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

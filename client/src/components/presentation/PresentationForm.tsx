import React, { FormEvent } from 'react';

interface PresentationFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  numberOfSlides: number;
  setNumberOfSlides: (slides: number) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export default function PresentationForm({
  prompt,
  setPrompt,
  numberOfSlides,
  setNumberOfSlides,
  isLoading,
  onSubmit
}: PresentationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          disabled={isLoading}
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
            disabled={isLoading}
          />
          <span className="w-12 text-center text-gray-700 font-medium">{numberOfSlides}</span>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-5 py-3 rounded-md font-medium w-full transition ${
            isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {isLoading ? (
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
  );
}

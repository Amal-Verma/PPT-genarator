'use client';

import { useState, FormEvent } from 'react';
import { generateSlideTitles } from '@/lib/slideTitleGenerator';
import { generatePresentation } from '@/lib/presentationGenerator';
import { summarizeTopic } from '@/lib/topicSummarizer';
import Link from 'next/link';
import PresentationForm from '@/components/presentation/PresentationForm';
import GenerationLoader from '@/components/presentation/GenerationLoader';
import PresentationOutline from '@/components/presentation/PresentationOutline';
import PresentationContent from '@/components/presentation/PresentationContent';
import ErrorAlert from '@/components/common/ErrorAlert';
import { PresentationSlide } from '@/types/schema';
import { toneOptions } from '@/schemas/toneSchema';

import { PresentationTitle } from '@/types/schema';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [numberOfSlides, setNumberOfSlides] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presentationName, setPresentationName] = useState<string>('');
  const [generatedSlides, setGeneratedSlides] = useState<PresentationTitle[] | null>(null);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState<boolean>(false);
  const [presentation, setPresentation] = useState<PresentationSlide[] | null>(null);
  const [activeStep, setActiveStep] = useState<'outline' | 'presentation'>('outline');
  const [selectedTone, setSelectedTone] = useState<string>(toneOptions[0].key);
  // New state to track which slides are currently loading
  const [loadingSlides, setLoadingSlides] = useState<number[]>([]);

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
      setPresentationName(''); // Clear previous presentation name
      setPresentation(null); // Clear any previous presentation
      setActiveStep('outline');
      setLoadingSlides([]); // Reset loading state
      
      // Call the slide generator function directly from the client
      const result = await generateSlideTitles({
        prompt,
        numberOfSlides,
        tone: selectedTone
      });
      
      setPresentationName(result.name);
      setGeneratedSlides(result.slides);
    } catch (err) {
      console.error('Error generating slides:', err);
      setError('Failed to generate slides. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  // Function to handle presentation generation
  async function handleCreatePresentation() {
    if (!generatedSlides) return;
    
    try {
      setIsGeneratingPresentation(true);
      setActiveStep('presentation');
      setPresentation([]); // Initialize with empty array to show loader UI
      
      // Set all slides to loading state
      const slideNumbers = Array.from({ length: generatedSlides.length }, (_, i) => i + 1);
      setLoadingSlides(slideNumbers);
      
      // Use AI to summarize the topic
      const summarizedTopic = await summarizeTopic({
        topic: prompt,
        maxLength: 450
      });
      
      // Generate the full presentation with incremental updates
      await generatePresentation({
        presentationName: presentationName,
        slides: generatedSlides,
        topic: summarizedTopic,
        tone: selectedTone,
        onSlideGenerated: (newSlide) => {
          // Update presentation with the new slide
          setPresentation(prevSlides => {
            const updatedSlides = prevSlides ? [...prevSlides] : [];
            // Find and replace if slide number exists, otherwise add
            const existingIndex = updatedSlides.findIndex(s => s.SlideNumber === newSlide.SlideNumber);
            if (existingIndex >= 0) {
              updatedSlides[existingIndex] = newSlide;
            } else {
              updatedSlides.push(newSlide);
            }
            // Sort slides by slide number to ensure proper order
            return updatedSlides.sort((a, b) => a.SlideNumber - b.SlideNumber);
          });
          
          // Remove this slide from loading state
          setLoadingSlides(prev => prev.filter(num => num !== newSlide.SlideNumber));
        }
      });
      
    } catch (err) {
      console.error('Error generating presentation:', err);
      setError('Failed to generate presentation content. Please try again.');
      setLoadingSlides([]); // Clear loading state on error
    } finally {
      setIsGeneratingPresentation(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presentation Generator</h1>
          <Link 
            href="/"
            className="text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
          >
            <span>← Back to home</span>
          </Link>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Presentation Slides</h2>
          {/* Tone selector */}
          <div className="mb-4">
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
              Presentation Tone
            </label>
            <select
              id="tone"
              value={selectedTone}
              onChange={e => setSelectedTone(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {toneOptions.map(tone => (
                <option key={tone.key} value={tone.key}>{tone.label}</option>
              ))}
            </select>
          </div>
          <PresentationForm 
            prompt={prompt}
            setPrompt={setPrompt}
            numberOfSlides={numberOfSlides}
            setNumberOfSlides={setNumberOfSlides}
            isLoading={isGenerating || isGeneratingPresentation}
            onSubmit={handleSubmit}
          />
          
          {error && <ErrorAlert message={error} />}
        </div>
        
        {isGenerating && <GenerationLoader type="outline" />}
        
        {generatedSlides && !isGenerating && activeStep === 'outline' && !isGeneratingPresentation && (
          <PresentationOutline 
            presentationName={presentationName}
            slides={generatedSlides}
            onStartOver={() => setGeneratedSlides(null)}
            onCreatePresentation={handleCreatePresentation}
            isGenerating={isGeneratingPresentation}
          />
        )}

        {presentation && activeStep === 'presentation' && (
          <PresentationContent 
            presentationName={presentationName}
            slides={presentation}
            onBackToOutline={() => setActiveStep('outline')}
            loadingSlides={loadingSlides}
          />
        )}
      </div>
    </div>
  );
}

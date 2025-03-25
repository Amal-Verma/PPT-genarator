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
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState<boolean>(false);
  const [presentation, setPresentation] = useState<PresentationSlide[] | null>(null);
  const [activeStep, setActiveStep] = useState<'outline' | 'presentation'>('outline');

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
      setPresentation(null); // Clear any previous presentation
      setActiveStep('outline');
      
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

  // Function to handle presentation generation
  async function handleCreatePresentation() {
    if (!generatedSlides) return;
    
    try {
      setIsGeneratingPresentation(true);
      setActiveStep('presentation');
      
      // Use AI to summarize the topic
      const summarizedTopic = await summarizeTopic({
        topic: prompt,
        maxLength: 150
      });
      
      // Generate the full presentation
      const fullPresentation = await generatePresentation({
        slides: generatedSlides,
        topic: summarizedTopic
      });

      console.log('Generated presentation:', fullPresentation);
      
      setPresentation(fullPresentation);
    } catch (err) {
      console.error('Error generating presentation:', err);
      setError('Failed to generate presentation content. Please try again.');
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
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>← Back to home</span>
          </Link>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Presentation Slides</h2>
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
        {isGeneratingPresentation && <GenerationLoader type="presentation" />}
        
        {generatedSlides && !isGenerating && activeStep === 'outline' && !isGeneratingPresentation && (
          <PresentationOutline 
            slides={generatedSlides}
            onStartOver={() => setGeneratedSlides(null)}
            onCreatePresentation={handleCreatePresentation}
            isGenerating={isGeneratingPresentation}
          />
        )}

        {presentation && activeStep === 'presentation' && !isGeneratingPresentation && (
          <PresentationContent 
            slides={presentation}
            onBackToOutline={() => setActiveStep('outline')}
          />
        )}
      </div>
    </div>
  );
}

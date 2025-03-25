import React from 'react';

interface GenerationLoaderProps {
  type: 'outline' | 'presentation';
}

export default function GenerationLoader({ type }: GenerationLoaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 mb-4">
          {type === 'outline' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
              <circle cx="12" cy="10" r="3"></circle>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          )}
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          {type === 'outline' ? 'Generating your presentation outline' : 'Creating your full presentation'}
        </h3>
        <p className="text-gray-600">
          {type === 'outline' ? 'This may take a few moments...' : 'This might take a minute or two...'}
        </p>
      </div>
    </div>
  );
}

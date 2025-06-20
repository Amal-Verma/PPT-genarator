"use client";

import React, { useState } from 'react';
import { webSearch } from '@/websearch/webSearch';

import type { SearchResult } from '@/websearch/type';

export default function WebSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await webSearch(query, 5);
      setResults(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Search failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Web Search (Google CSE)</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded shadow-sm"
          placeholder="Enter search query..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {results && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Raw JSON Output</h2>
          <button
            className="mb-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-black"
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const res = await webSearch(query, 5);
                setResults(res);
              } catch (err: unknown) {
                if (err instanceof Error) {
                  setError(err.message);
                } else {
                  setError('Refresh failed');
                }
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !query}
          >
            {loading ? 'Refreshing...' : 'Refresh JSON'}
          </button>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto" style={{ color: 'black' }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

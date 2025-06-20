"use client";

import React, { useState } from 'react';
import { getTopicTreeStream } from '@/websearch/getTopicTree';
import { parseTest } from '@/websearch/parseTest';
import { TopicTreeNode } from '@/websearch/type';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

// Constants for input limits
const MIN_NUM_RESULTS = 1;
const MAX_NUM_RESULTS = 200;
const MIN_MAX_DEPTH = 1;
const MAX_MAX_DEPTH = 5;
const MIN_BREATH = 1;
const MAX_BREATH = 10;

export default function TopicTreePage() {
  const [query, setQuery] = useState('');
  const [numResults, setNumResults] = useState(7);
  const [maxDepth, setMaxDepth] = useState(2);
  const [breath, setBreath] = useState(2);
  const [streamingResult, setStreamingResult] = useState<TopicTreeNode | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  // Helper to deeply merge a node into the tree at the given path
  function mergeNodeAtPath(tree: TopicTreeNode, path: number[], node: TopicTreeNode) {
    if (path.length === 0) {
      tree.topic = node.topic;
      tree.description = node.description;
      tree.subTopics = node.subTopics;
      return;
    }
    let current = tree;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current.subTopics[path[i]]) {
        current.subTopics[path[i]] = { topic: '', description: '', content: '', subTopics: [], webSearch: false };
      }
      current = current.subTopics[path[i]];
    }
    current.subTopics[path[path.length - 1]] = {
      ...current.subTopics[path[path.length - 1]],
      ...node,
      subTopics: node.subTopics || [],
    };
  }

  const handleStreamingSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsStreaming(true);
    setError(null);
    setStreamingResult(null);
    try {
      let root: TopicTreeNode | null = null;
      for await (const { node, path } of getTopicTreeStream(query, query, numResults, maxDepth, breath)) {
        if (!root) {
          root = { ...node };
          setStreamingResult({ ...root });
        } else {
          // Deep merge node at path
          const newTree = JSON.parse(JSON.stringify(root));
          mergeNodeAtPath(newTree, path, node);
          root = newTree;
          setStreamingResult(newTree);
        }
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch topic tree');
    } finally {
      setIsStreaming(false);
    }
  };

  // Copy markdown to clipboard
  const handleCopyMarkdown = async () => {
    if (streamingResult) {
      await navigator.clipboard.writeText(parseTest([streamingResult], ""));
    }
  };

  // Download markdown as PDF using jsPDF only
  const handleDownloadPdf = async () => {
    if (streamingResult) {
      const markdown = parseTest([streamingResult], "");
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      // Render markdown as plain text (basic, but works for most cases)
      const lines = doc.splitTextToSize(markdown, 555);
      doc.text(lines, 20, 40);
      doc.save('topic-tree.pdf');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Get Topic Tree</h1>
      <form onSubmit={handleStreamingSearch} className="flex flex-col gap-4 mb-8 bg-white p-6 rounded-lg shadow">
        <label className="font-semibold text-gray-700">Main Topic
          <input
            type="text"
            className="border px-3 py-2 rounded shadow-sm w-full mt-1"
            placeholder="Enter main topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
        <div className="flex gap-4">
          <label className="font-semibold text-gray-700">Num Results
            <input
              type="number"
              min={MIN_NUM_RESULTS}
              max={MAX_NUM_RESULTS}
              className="border px-3 py-2 rounded shadow-sm w-full mt-1"
              value={numResults}
              onChange={e => setNumResults(Number(e.target.value))}
              placeholder="Num Results"
            />
          </label>
          <label className="font-semibold text-gray-700">Max Depth
            <input
              type="number"
              min={MIN_MAX_DEPTH}
              max={MAX_MAX_DEPTH}
              className="border px-3 py-2 rounded shadow-sm w-full mt-1"
              value={maxDepth}
              onChange={e => setMaxDepth(Number(e.target.value))}
              placeholder="Max Depth"
            />
          </label>
          <label className="font-semibold text-gray-700">Breath
            <input
              type="number"
              min={MIN_BREATH}
              max={MAX_BREATH}
              className="border px-3 py-2 rounded shadow-sm w-full mt-1"
              value={breath}
              onChange={e => setBreath(Number(e.target.value))}
              placeholder="Breath"
            />
          </label>
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition" disabled={isStreaming}>
          {isStreaming ? 'Loading...' : 'Get Topic Tree'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4 font-semibold">{error}</div>}
      {streamingResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-blue-700">Topic Tree Output</h2>
            <button
              className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 text-black"
              onClick={() => setShowJson((prev) => !prev)}
              type="button"
            >
              {showJson ? 'Show Markdown' : 'Show JSON'}
            </button>
            <button
              className="ml-2 px-2 py-1 text-xs bg-green-200 rounded hover:bg-green-300 text-black"
              onClick={handleCopyMarkdown}
              type="button"
            >
              Copy Markdown
            </button>
            <button
              className="ml-2 px-2 py-1 text-xs bg-purple-200 rounded hover:bg-purple-300 text-black"
              onClick={handleDownloadPdf}
              type="button"
            >
              Download PDF
            </button>
          </div>
          {showJson ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto text-gray-800 whitespace-pre-wrap border border-gray-200">
              {JSON.stringify(streamingResult, null, 2)}
            </pre>
          ) : (
            <div className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-gray-800 whitespace-pre-wrap border border-gray-200">
              <ReactMarkdown>{parseTest([streamingResult], "")}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

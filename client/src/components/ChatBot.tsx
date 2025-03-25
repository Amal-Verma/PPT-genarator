"use client";

import { useState } from "react";
import { getGeminiResponse } from "@/lib/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = input;
    setInput("");
    setIsLoading(true);
    
    try {
      // Get response from Gemini (each call is independent with no memory)
      const response = await getGeminiResponse(userInput);
      
      // Add assistant response to chat
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I couldn't process that request. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Start chatting with Gemini 1.5 Flash
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "user" 
                  ? "bg-blue-100 dark:bg-blue-900 ml-8" 
                  : "bg-gray-100 dark:bg-gray-800 mr-8"
              }`}
            >
              <p className="font-medium mb-2">
                {message.role === "user" ? "You" : "Gemini"}
              </p>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

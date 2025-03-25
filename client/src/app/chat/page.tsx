import ChatBot from "@/components/ChatBot";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Gemini Chat</h1>
      <p className="text-center mb-8 text-gray-600">
        Each prompt is processed independently - the model has no memory between messages
      </p>
      
      <ChatBot />
    </div>
  );
}

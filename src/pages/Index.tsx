import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import { ChatMessage, streamChatCompletion } from '@/lib/openai';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add user message to the chat
      const userMessage: ChatMessage = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      
      // Reset the partial response
      setPartialResponse("");
      
      // Track the full response as it accumulates
      let fullResponseText = "";
      
      // Start streaming the response
      await streamChatCompletion(
        newMessages,
        (chunk) => {
          // Update the running full response
          fullResponseText += chunk;
          // Update the partial response as chunks arrive
          setPartialResponse(fullResponseText);
        },
        () => {
          // When streaming is complete, add the full assistant message
          setMessages(prev => [
            ...prev, 
            { role: 'assistant', content: fullResponseText }
          ]);
          setPartialResponse("");
          setIsLoading(false);
        },
        (error) => {
          console.error("OpenAI API Error:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to get response from OpenAI",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} />
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'} pt-[60px] pb-4`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-3xl px-4 space-y-4">
              <div>
                <h1 className="mb-8 text-4xl font-semibold text-center">Hello! I'm Mental Health AI</h1>
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <>
              <MessageList 
                messages={messages}
                partialResponse={partialResponse}
                isLoading={isLoading}
              />
              <div className="w-full max-w-3xl mx-auto px-4 py-2">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
              <div className="text-xs text-center text-gray-500 py-2">
                ChatGPT can make mistakes. Check important info.
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
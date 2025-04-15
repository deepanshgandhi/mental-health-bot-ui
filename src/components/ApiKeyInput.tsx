
import { useState } from 'react';
import { initializeOpenAI } from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Initialize OpenAI with the provided API key
      initializeOpenAI(apiKey);
      
      toast({
        title: "Success",
        description: "API key set successfully",
      });
      
      onApiKeySet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4">Enter your OpenAI API Key</h2>
      <p className="text-gray-500 mb-4">
        Your API key is stored locally in your browser and is never sent to our servers.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full p-2 border border-gray-300 rounded bg-[#2F2F2F] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#10a37f] hover:bg-[#0d8a6c] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Setting..." : "Set API Key"}
        </button>
      </form>
    </div>
  );
};

export default ApiKeyInput;

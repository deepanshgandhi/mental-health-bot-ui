
import OpenAI from 'openai';

// We'll initialize OpenAI with the API key (which will be provided later)
let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: This should be replaced with a backend solution in production
  });
  
  // Store API key in localStorage for persistence
  localStorage.setItem('openai-api-key', apiKey);
  return openaiInstance;
};

export const getOpenAIInstance = (): OpenAI => {
  if (!openaiInstance) {
    const storedApiKey = localStorage.getItem('openai-api-key');
    if (storedApiKey) {
      return initializeOpenAI(storedApiKey);
    }
    throw new Error('OpenAI API not initialized. Please provide an API key.');
  }
  return openaiInstance;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const streamChatCompletion = async (
  messages: ChatMessage[],
  onChunkReceived: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    const openai = getOpenAIInstance();
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using one of the latest models
      messages,
      stream: true,
    });

    let fullResponse = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunkReceived(content);
      }
    }
    
    onComplete();
    return fullResponse;
  } catch (error) {
    onError(error as Error);
    throw error;
  }
};

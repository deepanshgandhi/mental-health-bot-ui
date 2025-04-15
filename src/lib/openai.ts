
import OpenAI from 'openai';

const openaiInstance = new OpenAI({
  apiKey: 'your-api-key-here', // Replace with your actual API key
  dangerouslyAllowBrowser: true // Note: This should be replaced with a backend solution in production
});

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
    const stream = await openaiInstance.chat.completions.create({
      model: 'gpt-4o-mini',
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

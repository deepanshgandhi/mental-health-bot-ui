import { OpenAI } from 'openai';

const openaiInstance = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  dangerouslyAllowBrowser: true,
});

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content:
    'You are a helpful mental health counselling assistant. Please answer the mental health questions based on the patient\'s description. The assistant gives helpful, comprehensive, and appropriate answers to the user\'s questions.',
};

export const streamChatCompletion = async (
  messages: ChatMessage[],
  onChunkReceived: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    const fullMessages: ChatMessage[] = [SYSTEM_PROMPT, ...messages];

    const stream = await openaiInstance.chat.completions.create({
      model: 'lora-gpt',
      messages: fullMessages,
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
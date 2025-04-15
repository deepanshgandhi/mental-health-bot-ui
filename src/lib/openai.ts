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
    'You are a helpful assistant. If the user\'s question is related to mental health, respond as a compassionate and knowledgeable mental health counselling assistant—providing thoughtful, supportive, and comprehensive answers based on the user\'s description. If the question is not related to mental health, respond normally as a general-purpose assistant, without taking on the role of a mental health counselor. In both cases, keep your responses short and focused. Avoid unnecessary elaboration, repetition, or excessive explanation. Limit your reply to 3-4 sentences max, and be clear, direct, and concise.',
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
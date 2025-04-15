
import Message from './Message';
import { ChatMessage } from '@/lib/openai';

type MessageListProps = {
  messages: ChatMessage[];
  partialResponse: string;
  isLoading: boolean;
};

const MessageList = ({ messages, partialResponse, isLoading }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-4">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
        
        {/* Show streaming response if there is one */}
        {partialResponse && isLoading && (
          <Message role="assistant" content={partialResponse} isStreaming={true} />
        )}
      </div>
    </div>
  );
};

export default MessageList;

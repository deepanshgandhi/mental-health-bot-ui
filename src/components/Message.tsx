
import React from 'react';
import ReactMarkdown from 'react-markdown';
import MessageAvatar from './MessageAvatar';
import MessageActions from './MessageActions';

type MessageProps = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
};

const Message = ({ role, content, isStreaming = false }: MessageProps) => {
  return (
    <div className="py-6">
      <div className={`flex gap-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
        <MessageAvatar isAssistant={role === 'assistant'} />
        <div className={`flex-1 space-y-2 ${role === 'user' ? 'flex justify-end' : ''}`}>
          <div className={`${role === 'user' ? 'bg-gray-700/50 rounded-[20px] px-4 py-2 inline-block' : 'prose prose-invert max-w-none'}`}>
            {role === 'assistant' ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content
            )}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-gray-300 animate-pulse"></span>
            )}
          </div>
          {role === 'assistant' && !isStreaming && <MessageActions />}
        </div>
      </div>
    </div>
  );
};

export default Message;

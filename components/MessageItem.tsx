import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { UserIcon, BotIcon } from './Icon';

interface MessageItemProps {
  message: Message;
  isTyping?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isTyping }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`group w-full text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${isUser ? 'bg-transparent' : 'bg-[#444654]'}`}>
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className={`relative h-8 w-8 rounded-sm flex items-center justify-center ${isUser ? 'bg-gray-500' : 'bg-brand-500'}`}>
            {isUser ? <UserIcon className="text-gray-100 p-1" /> : <BotIcon className="text-white p-1" />}
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="markdown-body text-sm md:text-base leading-7">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <pre className={className}>
                        <code {...props} className={className}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content + (isTyping ? ' ' : '')}
              </ReactMarkdown>
            )}
            {isTyping && <span className="typing-cursor inline-block w-2 h-4 align-middle bg-gray-400 ml-1"></span>}
          </div>
        </div>
      </div>
    </div>
  );
};
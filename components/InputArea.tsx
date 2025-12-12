import React, { useRef, useEffect } from 'react';
import { SendIcon } from './Icon';

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onSubmit, loading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-dark-gradient bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2 md:pl-2 md:w-[calc(100%-.5rem)]">
      <div className="mx-auto flex max-w-3xl flex-col p-2 md:py-4 md:pl-4 relative">
        <div className="relative flex w-full flex-grow flex-col rounded-xl border border-black/10 dark:border-gray-900/50 bg-white dark:bg-[#40414f] shadow-md">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-4 pr-10 py-4 max-h-[200px] overflow-y-auto focus:ring-0 focus-visible:ring-0 dark:bg-transparent text-black dark:text-white md:pl-4 md:pr-12 leading-6 outline-none"
            rows={1}
            disabled={loading}
            style={{ maxHeight: '200px' }}
          />
          <button
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className={`absolute right-2 bottom-3 p-2 rounded-md transition-colors duration-200 ${
              !value.trim() || loading ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
             {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SendIcon className="w-4 h-4" />}
          </button>
        </div>
        <div className="px-2 py-2 text-center text-xs text-gray-400 md:px-[60px]">
          <span>GHL Peak may produce inaccurate information.</span>
        </div>
      </div>
    </div>
  );
};
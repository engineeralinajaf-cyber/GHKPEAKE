import React from 'react';
import { PlusIcon, ChatIcon, TrashIcon, SettingsIcon, LogoIcon } from './Icon';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onOpenSettings
}) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-[260px] bg-gray-900 text-gray-100 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col
    `}>
      {/* Brand Header */}
      <div className="p-4 hidden md:flex items-center gap-2 text-brand-500 font-bold text-xl border-b border-white/10">
        <LogoIcon />
        <span>GHL Peak</span>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-md border border-white/20 px-3 py-3 text-sm text-white transition-colors hover:bg-gray-500/10 cursor-pointer"
        >
          <PlusIcon />
          New chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="flex flex-col gap-2">
          {sessions.length === 0 && (
            <div className="text-xs text-gray-500 text-center mt-4">No history yet.</div>
          )}
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectChat(session.id)}
              className={`
                group relative flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors cursor-pointer
                ${currentSessionId === session.id ? 'bg-[#343541] pr-10' : 'hover:bg-[#2A2B32]'}
              `}
            >
              <ChatIcon className="text-gray-400" />
              <div className="relative flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left">
                {session.title || 'New Chat'}
              </div>
              {/* Delete Button (visible on hover or active) */}
              {(currentSessionId === session.id) && (
                 <div className="absolute right-1 top-1 bottom-1 flex items-center bg-gradient-to-l from-[#343541] to-transparent pl-2">
                    <div 
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      onClick={(e) => onDeleteChat(session.id, e)}
                    >
                      <TrashIcon />
                    </div>
                 </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="border-t border-white/20 p-3">
        <button 
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-white transition-colors hover:bg-gray-500/10 cursor-pointer"
        >
          <SettingsIcon />
          Settings
        </button>
      </div>
    </div>
  );
};
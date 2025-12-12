import React from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Settings, 
  Trash2, 
  Menu, 
  X,
  User,
  Bot
} from 'lucide-react';

export const SendIcon = ({ className }: { className?: string }) => <Send className={className} size={16} />;
export const PlusIcon = ({ className }: { className?: string }) => <Plus className={className} size={16} />;
export const ChatIcon = ({ className }: { className?: string }) => <MessageSquare className={className} size={16} />;
export const SettingsIcon = ({ className }: { className?: string }) => <Settings className={className} size={16} />;
export const TrashIcon = ({ className }: { className?: string }) => <Trash2 className={className} size={16} />;
export const MenuIcon = ({ className }: { className?: string }) => <Menu className={className} size={20} />;
export const CloseIcon = ({ className }: { className?: string }) => <X className={className} size={20} />;
export const UserIcon = ({ className }: { className?: string }) => <User className={className} size={20} />;
export const BotIcon = ({ className }: { className?: string }) => <Bot className={className} size={20} />;

// Custom Logo based on GHL Peak brand identity
export const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Ring */}
    <circle 
      cx="50" 
      cy="50" 
      r="42" 
      stroke="currentColor" 
      strokeWidth="6" 
      className="text-gray-400 dark:text-gray-600 opacity-80" 
    />
    
    {/* Arrow 1: Gold - Left */}
    <path 
      d="M28 65 L48 45" 
      stroke="#EAB308" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    <path 
      d="M38 45 L48 45 L48 55" 
      stroke="#EAB308" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Arrow 2: Blue - Center (Prominent) */}
    <path 
      d="M40 75 L70 45" 
      stroke="#0EA5E9" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    <path 
      d="M60 45 L70 45 L70 55" 
      stroke="#0EA5E9" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Arrow 3: Green - Right */}
    <path 
      d="M58 85 L78 65" 
      stroke="#22C55E" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    <path 
      d="M68 65 L78 65 L78 75" 
      stroke="#22C55E" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
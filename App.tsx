import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession, AppSettings } from './types';
import { DEFAULT_MODEL, WELCOME_MESSAGES } from './constants';
import { createChatSession, streamResponse } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { InputArea } from './components/InputArea';
import { SettingsModal } from './components/SettingsModal';
import { MenuIcon, LogoIcon } from './components/Icon';

const App: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    modelName: DEFAULT_MODEL,
    temperature: 0.7
  });

  // Scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ghl_peak_sessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
  }, []);

  // Save sessions when changed
  useEffect(() => {
    localStorage.setItem('ghl_peak_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId, sessions, streamingContent]);

  // Current session derived state
  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  // Helpers
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    let activeSessionId = currentSessionId;
    let activeSession = currentSession;

    // Create session if none exists
    if (!activeSessionId || !activeSession) {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        updatedAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      activeSessionId = newSession.id;
      activeSession = newSession;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    // Optimistic update
    const updatedMessages = [...activeSession.messages, userMessage];
    
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, messages: updatedMessages, title: s.messages.length === 0 ? input.slice(0, 30) : s.title } 
        : s
    ));
    
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      // Initialize Gemini Chat with History
      // Note: We create a new Chat instance for each turn to ensure state is fresh from our stored history
      // Ideally we would cache the Chat object, but for simplicity and robustness against refreshes, we rebuild it.
      const chat = createChatSession(settings.modelName, activeSession.messages);

      // Stream response
      let fullResponse = '';
      await streamResponse(chat, userMessage.content, (chunk) => {
        setStreamingContent(prev => prev + chunk);
        fullResponse += chunk;
      });

      const botMessage: Message = {
        id: uuidv4(),
        role: 'model',
        content: fullResponse,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...updatedMessages, botMessage], updatedAt: Date.now() } 
          : s
      ));

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: "I'm sorry, I encountered an error connecting to GHL Peak services. Please check your connection or API configuration.",
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...updatedMessages, errorMessage] } 
          : s
      ));
    } finally {
      setLoading(false);
      setStreamingContent('');
    }
  };

  return (
    <div className="flex h-screen bg-[#343541] overflow-hidden text-gray-100 font-sans">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectChat={(id) => { setCurrentSessionId(id); setSidebarOpen(false); }}
        onDeleteChat={deleteSession}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full max-w-full align-top">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-[#343541] p-2 text-gray-200 md:hidden">
          <button 
            type="button" 
            className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon />
          </button>
          <div className="flex-1 text-center font-bold flex justify-center items-center gap-2">
            <LogoIcon className="w-5 h-5 text-brand-500" />
            GHL Peak
          </div>
          <button 
            type="button"
            className="h-10 w-10 flex items-center justify-center"
            onClick={createNewSession}
          >
            <span className="sr-only">New chat</span>
            <PlusIcon />
          </button>
        </div>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto w-full relative">
          {(!currentSession || currentSession.messages.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-gray-800 p-4 rounded-full mb-6">
                 <LogoIcon className="w-16 h-16 text-brand-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">GHL Peak</h2>
              <p className="text-gray-400 max-w-md mb-8">
                Your advanced AI assistant with memory capabilities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                {WELCOME_MESSAGES.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(msg); }}
                    className="p-3 bg-gray-500/10 hover:bg-gray-500/20 rounded-lg text-sm text-left border border-white/10 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col pb-32">
              {currentSession.messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
              {loading && streamingContent && (
                <MessageItem 
                  message={{ 
                    id: 'streaming', 
                    role: 'model', 
                    content: streamingContent, 
                    timestamp: Date.now() 
                  }}
                  isTyping={true} 
                />
              )}
               {/* Invisible element to scroll to */}
               <div ref={messagesEndRef} className="h-12 w-full" />
            </div>
          )}
        </main>

        {/* Input Area */}
        <InputArea 
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          loading={loading}
        />
      </div>

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
};

// Helper Icon for Mobile Header
const PlusIcon = ({ className }: { className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default App;
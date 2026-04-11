import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Copy, 
  Paperclip, 
  X, 
  User, 
  Bot, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  type: string;
  url: string;
  content?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

interface IntelligentAIProps {
  onBack: () => void;
}

export const IntelligentAI: React.FC<IntelligentAIProps> = ({ onBack }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI((import.meta as any).env.VITE_GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('maksud_ai_chats');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to load chats', e);
      }
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('maksud_ai_chats', JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    scrollToBottom();
  }, [chats, currentChatId, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  const startNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastUpdated: Date.now()
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    if (isMobile) setSidebarOpen(false);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newChats = chats.filter(c => c.id !== id);
    setChats(newChats);
    if (currentChatId === id) {
      setCurrentChatId(newChats.length > 0 ? newChats[0].id : null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files) as File[]) {
      const reader = new FileReader();
      reader.onload = async (ev: any) => {
        const url = ev.target?.result as string;
        let content = '';

        if (file.type === 'text/plain') {
          content = url.split(',')[1]; // This is base64, we need text
          content = atob(content);
        } else if (file.type === 'application/pdf') {
          content = '[PDF Content - Text extraction would happen here]';
        }

        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          url,
          content
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!currentChatId) {
      const newId = Date.now().toString();
      const newChat: Chat = {
        id: newId,
        title: input.trim().substring(0, 30) || 'New Chat',
        messages: [],
        lastUpdated: Date.now()
      };
      setChats([newChat, ...chats]);
      setCurrentChatId(newId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    const updatedChats = chats.map(c => {
      if (c.id === (currentChatId || userMessage.id)) {
        const newMessages = [...c.messages, userMessage];
        return {
          ...c,
          messages: newMessages,
          title: c.title === 'New Chat' ? input.trim().substring(0, 30) || 'New Chat' : c.title,
          lastUpdated: Date.now()
        };
      }
      return c;
    });

    setChats(updatedChats);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    try {
      // Prepare prompt with attachments
      let fullPrompt = input;
      const imageParts: any[] = [];

      for (const att of userMessage.attachments || []) {
        if (att.type.startsWith('image/')) {
          const base64Data = att.url.split(',')[1];
          imageParts.push({
            inlineData: {
              data: base64Data,
              mimeType: att.type
            }
          });
        } else if (att.content) {
          fullPrompt += `\n\nAttachment (${att.name}):\n${att.content}`;
        }
      }

      const result = await model.generateContent([fullPrompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: Date.now()
      };

      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage],
            lastUpdated: Date.now()
          };
        }
        return c;
      }));
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please check your API key or try again later.",
        timestamp: Date.now()
      };
      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return { ...c, messages: [...c.messages, errorMessage] };
        }
        return c;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0b0b0b] flex font-sans text-white overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "w-72 border-r border-white/10 bg-[#0f0f0f] flex flex-col z-50",
              isMobile && "fixed inset-y-0 left-0 shadow-2xl"
            )}
          >
            <div className="p-4 flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between">
                <button 
                  onClick={onBack}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={startNewChat}
                  className="flex-1 ml-2 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
                >
                  <Plus size={18} />
                  New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 mt-4 mb-2">Recent Chats</h3>
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full group flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                      currentChatId === chat.id ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    )}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="flex-1 text-xs font-bold truncate">{chat.title}</span>
                    <button 
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-500 rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs">
                    M
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Maksud User</p>
                    <p className="text-[10px] text-white/40">Free Plan</p>
                  </div>
                  <Settings size={16} className="text-white/40" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#0b0b0b]">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0b0b0b]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-white/60 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Maksud Intelligent AI</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Powered by Gemini 1.5 Flash</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              0.01 Coin / Msg
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Bot size={40} className="text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter">How can I help you today?</h1>
                <p className="text-white/40 text-sm font-medium">Maksud Intelligent AI is ready to assist with coding, writing, analysis, and more.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {[
                  "Explain quantum computing in simple terms",
                  "Write a Python script to scrape a website",
                  "How do I make a chocolate cake?",
                  "Write a professional email for a job application"
                ].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-left transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-8">
              {currentChat.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex gap-4 group",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-indigo-600" : "bg-white/10"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-1">
                        {msg.attachments.map((att, idx) => (
                          <div key={idx} className="relative group/att">
                            {att.type.startsWith('image/') ? (
                              <img src={att.url} alt={att.name} className="w-32 h-32 object-cover rounded-xl border border-white/10" />
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold">
                                <FileText size={14} className="text-indigo-400" />
                                {att.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-white/5 text-white/90"
                    )}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(msg.content)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                        title="Copy message"
                      >
                        <Copy size={14} />
                      </button>
                      <span className="text-[10px] text-white/20 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">AI is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            {attachments.length > 0 && (
              <div className="absolute bottom-full mb-4 flex flex-wrap gap-2">
                {attachments.map((att, idx) => (
                  <div key={idx} className="relative group/att">
                    {att.type.startsWith('image/') ? (
                      <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold">
                        <FileText size={14} />
                        {att.name}
                      </div>
                    )}
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-lg"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-[#1a1a1a] border border-white/10 focus-within:border-indigo-500/50 rounded-3xl p-2 flex items-end gap-2 transition-all shadow-2xl">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 hover:bg-white/5 text-white/40 hover:text-white rounded-2xl transition-all"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  multiple 
                  accept="image/*,text/plain,application/pdf"
                />
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message Maksud Intelligent AI..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-48 custom-scrollbar"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className={cn(
                    "p-3 rounded-2xl transition-all",
                    input.trim() || attachments.length > 0 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-white/5 text-white/20"
                  )}
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-white/20 mt-4 font-bold uppercase tracking-widest">
              Maksud Intelligent AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

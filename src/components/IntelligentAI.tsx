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
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
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
    <div className="fixed inset-0 z-[100] bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className={cn(
              "w-80 bg-white border-r border-slate-200 flex flex-col z-50 transition-all",
              isMobile && "fixed inset-y-0 left-0 shadow-2xl"
            )}
          >
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onBack}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div className="font-black text-lg tracking-tight">
                  Chat History
                </div>
              </div>

              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95"
              >
                <Plus size={20} />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-2 px-2">Recent Chats</h3>
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full group flex items-center gap-3 p-3 rounded-xl transition-all",
                      currentChatId === chat.id ? "bg-indigo-50 text-indigo-700" : "bg-transparent text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <MessageSquare size={18} className={cn("shrink-0", currentChatId === chat.id ? "text-indigo-600" : "text-slate-400")} />
                    <span className="flex-1 text-sm font-medium truncate text-left">{chat.title}</span>
                    <button 
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">Operator_01</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-slate-50/50">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            >
              <ChevronRight size={20} className={sidebarOpen ? "rotate-180" : ""} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900">Maksud AI</h2>
                <div className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">v1.5</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              0.01 Coins Per Session
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-8">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-12">
              <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                <Bot size={48} />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tight text-slate-900">How can I help you?</h1>
                <p className="text-slate-500 text-lg font-medium">I'm Maksud AI, your professional assistant. Ask me anything.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  "Explain quantum computing",
                  "Write a Python script",
                  "How to bake a cake?",
                  "Write a professional email"
                ].map((suggestion, i) => (
                  <button 
                    key={`ai-suggestion-${i}`}
                    onClick={() => setInput(suggestion)}
                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-left transition-all hover:bg-emerald-50 hover:border-emerald-100 hover:shadow-md group active:scale-[0.98]"
                  >
                    <p className="text-sm font-bold text-slate-900 mb-1">{suggestion}</p>
                    <p className="text-xs text-slate-400 group-hover:text-emerald-500">Click to use this prompt</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full space-y-10">
              {currentChat.messages.map((msg, mIdx) => (
                <div 
                  key={`msg-${msg.id}-${mIdx}`} 
                  className={cn(
                    "flex gap-4 md:gap-6",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-white text-indigo-600 border border-slate-100"
                  )}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={24} />}
                  </div>
                  <div className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                  )}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-2">
                        {msg.attachments.map((att, idx) => (
                          <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200">
                            {att.type.startsWith('image/') ? (
                              <img src={att.url} alt={att.name} className="w-48 h-48 object-cover" />
                            ) : (
                              <div className="flex items-center gap-3 p-4 bg-white">
                                <FileText size={20} className="text-indigo-600" />
                                <span className="text-xs font-bold truncate max-w-[120px]">{att.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={cn(
                      "p-5 rounded-2xl text-sm md:text-base font-medium shadow-sm leading-relaxed",
                      msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-white text-slate-800 border border-slate-100"
                    )}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(msg.content)}
                        className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <Copy size={14} />
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={24} className="text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto relative">
            {attachments.length > 0 && (
              <div className="absolute bottom-full mb-6 flex flex-wrap gap-3">
                {attachments.map((att, idx) => (
                  <div key={idx} className="relative group/att">
                    {att.type.startsWith('image/') ? (
                      <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-lg" />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-lg">
                        <FileText size={16} className="text-indigo-600" />
                        <span className="text-[10px] font-bold max-w-[80px] truncate">{att.name}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-all"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-3 flex items-end gap-2 focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:border-indigo-600 transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
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
                  placeholder="Ask Maksud AI anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium py-3 px-2 resize-none max-h-48 custom-scrollbar placeholder:text-slate-400"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95",
                    input.trim() || attachments.length > 0 
                      ? "bg-indigo-600 text-white shadow-indigo-200" 
                      : "bg-slate-100 text-slate-300 shadow-none"
                  )}
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
              Powered by Google Gemini 1.5 Flash
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

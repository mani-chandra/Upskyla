"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Minus,
  Maximize2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hi there! 👋 I'm your Upskyla assistant. How can I help you today? I can tell you about our AI/ML and Cyber Security courses, or help you with hostel bookings!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage: Message = {
        role: "bot",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I'm having a bit of trouble connecting right now. Please try again later!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Upskyla AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === "user" 
                      ? "bg-primary-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-primary-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3">
                Powered by Upskyla Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "group p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3",
          isOpen && !isMinimized 
            ? "bg-slate-900 text-white scale-0 opacity-0 pointer-events-none" 
            : "bg-primary-600 text-white hover:bg-primary-700"
        )}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-primary-600 rounded-full" />
        </div>
        <span className="font-black text-sm uppercase tracking-widest pr-2 hidden sm:block">
          Ask Upskyla AI
        </span>
      </motion.button>

      {/* Minimized Bubble */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="absolute bottom-0 right-0 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all group"
          >
            <Maximize2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

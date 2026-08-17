"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { useUser } from "@/components/UserProvider";
import ReactMarkdown from "react-markdown";

export default function GlobalAIAssistant() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: "user"|"model", content: string}[]>([
    { role: "model", content: "Hi! I'm UConnect AI. How can I help you with your career goals today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isMinimized]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, history: messages.slice(1) }) // skip initial greeting
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "model", content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "model", content: "Sorry, I ran into an error. Please try again." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: "Sorry, a network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all z-50 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed right-6 bottom-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
      isMinimized ? 'w-72 h-14 rounded-t-xl rounded-b-none' : 'w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] rounded-2xl'
    }`}>
      {/* Header */}
      <div className="bg-indigo-600 text-white p-3 flex justify-between items-center shrink-0 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="w-5 h-5" />
          <span>Ask UConnect AI</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-indigo-700 rounded transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-indigo-700 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-br-sm" 
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.role === "model" ? (
                    <div className="prose prose-sm dark:prose-invert prose-p:leading-snug prose-p:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about skills, projects, jobs..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="absolute right-1 p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

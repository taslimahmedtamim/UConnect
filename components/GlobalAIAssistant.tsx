"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2, Maximize2, GripHorizontal } from "lucide-react";
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

  // Dragging logic
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number, y: number, posX: number, posY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on left click
    if (e.button !== 0) return;
    
    // Prevent dragging if clicking an interactive element that shouldn't initiate drag
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.closest('.no-drag')) return;

    const target = e.currentTarget as HTMLElement;
    // Get the parent container's rect to know where we currently are
    const container = target.closest('.ai-draggable-container') || target;
    const rect = container.getBoundingClientRect();
    
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position ? position.x : rect.left,
      posY: position ? position.y : rect.top,
    };
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    if (!isDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      setIsDragging(true);
    }
    
    if (isDragging || Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      // Constrain to window bounds roughly
      const newX = Math.max(0, Math.min(window.innerWidth - 60, dragStart.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.posY + dy));
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart.current) {
      const target = e.currentTarget as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
      dragStart.current = null;
      // Use setTimeout to allow click events to fire and check if dragging happened
      setTimeout(() => setIsDragging(false), 50);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    setIsOpen(true);
  };

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

  // Determine positioning classes/styles
  const positionStyle = position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : {};
  const positionClasses = position ? '' : 'right-6 bottom-6';

  if (!isOpen) {
    return (
      <button 
        onClick={handleOpen}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`ai-draggable-container fixed p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all z-[60] flex items-center justify-center group cursor-grab active:cursor-grabbing ${positionClasses}`}
        style={{ ...positionStyle, transition: isDragging ? 'none' : undefined }}
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div 
      className={`ai-draggable-container fixed z-[60] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden ${positionClasses} ${
        isMinimized ? 'w-72 h-14 rounded-xl' : 'w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] rounded-2xl'
      }`}
      style={{ ...positionStyle, transition: isDragging ? 'none' : 'height 0.3s, width 0.3s' }}
    >
      {/* Header (Draggable) */}
      <div 
        className="bg-indigo-600 text-white p-3 flex justify-between items-center shrink-0 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="flex items-center gap-2 font-semibold" onClick={() => !isDragging && isMinimized && setIsMinimized(false)}>
          <GripHorizontal className="w-4 h-4 text-indigo-300 mr-1" />
          <Sparkles className="w-5 h-5" />
          <span>Ask UConnect AI</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); if(!isDragging) setIsMinimized(!isMinimized); }} className="no-drag p-1 hover:bg-indigo-700 rounded transition-colors z-10 cursor-pointer">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); if(!isDragging) setIsOpen(false); }} className="no-drag p-1 hover:bg-indigo-700 rounded transition-colors z-10 cursor-pointer">
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

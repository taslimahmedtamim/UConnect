"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";

interface TeamMessagesProps {
  teamId: string;
  currentUser: any;
}

export default function TeamMessages({ teamId, currentUser }: TeamMessagesProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Polling interval
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setError(null);
      } else {
        if (!messages.length) setError(data.message || "Failed to load messages");
      }
    } catch (err) {
      if (!messages.length) setError("Network error while loading messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const text = input.trim();
    setInput("");

    // Optimistic update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: text,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        role: currentUser.role
      }
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch(`/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }
      
      // Replace optimistic message with actual server message
      setMessages(prev => prev.map(m => m.id === tempMessage.id ? data.message : m));
    } catch (err: any) {
      console.error(err);
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert("Failed to send message: " + err.message);
      setInput(text); // restore input
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "UC";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-500">
        <AlertCircle className="w-10 h-10 mb-4" />
        <p className="font-semibold">{error}</p>
        <button onClick={fetchMessages} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] overflow-hidden">
      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <p className="font-medium text-lg">No messages yet</p>
            <p className="text-sm">Say hello to start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => {
              const isMine = msg.sender.id === currentUser?.id;
              const showAvatar = idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;
              
              return (
                <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'} ${!showAvatar ? 'mt-2' : ''}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-10 h-10 ${!showAvatar ? 'invisible' : ''}`}>
                    {msg.sender.profileImage ? (
                      <img src={msg.sender.profileImage} alt={msg.sender.fullName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {getInitials(msg.sender.fullName)}
                      </div>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-1 px-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {isMine ? 'You' : msg.sender.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div 
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                        isMine 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="flex items-center gap-2 relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to your team..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            disabled={sending}
          />
          <button 
            type="submit"
            disabled={!input.trim() || sending}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

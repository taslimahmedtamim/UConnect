"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Send, MessageSquare, Users, Phone, Video, MoreVertical, Loader2 } from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));

    fetchConversations();
    // Poll conversations list every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      // Poll active chat every 3 seconds
      const interval = setInterval(() => fetchMessages(activeChat.id), 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages", {
        });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/messages/${chatId}`, {
        });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;

    setSending(true);
    const payload = activeChat.type === 'team' 
      ? { teamId: activeChat.id, content: newMessage }
      : { receiverId: activeChat.id, content: newMessage };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        setMessages([...messages, data.message]);
        fetchConversations(); // Update side bar last message
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100dvh-64px)] md:h-screen bg-slate-50 dark:bg-[#0b1120]">
      
      {/* Sidebar: Conversations List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
        
        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No conversations yet. Team chats will appear here!
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`flex gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeChat?.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-b-slate-100 dark:border-b-slate-800'}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${conv.type === 'team' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-emerald-500'}`}>
                    {conv.type === 'team' ? <Users className="w-4 h-4" /> : getInitials(conv.name)}
                  </div>
                  {conv.type !== 'team' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate pr-2">{conv.name}</span>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0b1120]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${activeChat.type === 'team' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-emerald-500'}`}>
                  {activeChat.type === 'team' ? <Users className="w-4 h-4" /> : getInitials(activeChat.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{activeChat.name}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{activeChat.type === 'team' ? 'Team Channel' : 'Online'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
                  This is the beginning of your chat history
                </span>
              </div>

              {messages.map((msg, i) => {
                const isMe = msg.sender.id === currentUser.id;
                
                return (
                  <div key={msg.id || i} className={`flex gap-3 max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${isMe ? 'bg-blue-600' : 'bg-emerald-500'}`}>
                      {getInitials(msg.sender.fullName)}
                    </div>
                    <div>
                      {!isMe && activeChat.type === 'team' && (
                        <div className="text-xs font-semibold text-slate-500 mb-1 ml-1">{msg.sender.fullName}</div>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      <div className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={activeChat.type === 'team' ? "Message team channel..." : "Type a message..."}
                    className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center w-12 h-12 shrink-0"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300">Your Messages</h2>
            <p className="text-sm mt-2">Select a conversation or team channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

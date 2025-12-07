import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

interface AIMentorChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const quickActions = [
  { label: 'Show mess menu', icon: '🍽️' },
  { label: 'When is mid-sem?', icon: '📅' },
  { label: 'Find Python mentor', icon: '👨‍🏫' },
  { label: 'Suggest project ideas', icon: '💡' },
];

const initialMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hello! I\'m your UConnect AI Mentor. I can help you with campus information, academic guidance, project suggestions, and connecting with mentors. How can I assist you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function AIMentorChat({ isOpen, onClose, onOpen }: AIMentorChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiResponseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (aiResponseTimeoutRef.current) clearTimeout(aiResponseTimeoutRef.current);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    aiResponseTimeoutRef.current = setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('mess') || lowerQuery.includes('menu')) {
      return '🍽️ Today\'s Mess Menu:\n\nBreakfast: Poha, Tea/Coffee, Banana\nLunch: Dal Tadka, Jeera Rice, Mixed Veg, Roti, Curd\nSnacks: Samosa, Tea\nDinner: Paneer Butter Masala, Rice, Roti, Salad\n\nEnjoy your meal! 😊';
    }

    if (lowerQuery.includes('mid-sem') || lowerQuery.includes('exam')) {
      return '📅 Mid-semester examinations are scheduled for:\n\nWeek 1: Dec 10-12, 2024\nWeek 2: Dec 13-15, 2024\n\nMake sure to check your course-specific schedule on the portal. Need help with exam preparation strategies?';
    }

    if (lowerQuery.includes('mentor') || lowerQuery.includes('python')) {
      return '👨‍🏫 I found 12 Python mentors available on UConnect:\n\n1. Prof. Sharma (IIT Delhi) - ML & Data Science\n2. Priya R. (Senior, 4.8⭐) - Web Development\n3. Arjun K. (Alumni, Google) - System Design\n\nWould you like me to send connection requests to any of them?';
    }

    if (lowerQuery.includes('project') || lowerQuery.includes('idea')) {
      return '💡 Here are some trending project ideas based on your skills:\n\n1. Real-time Air Quality Monitor (IoT + ML)\n2. Campus Navigation AR App\n3. Automated Attendance System using Face Recognition\n4. Peer-to-Peer Study Material Sharing Platform\n\nWant detailed requirements for any of these?';
    }

    if (lowerQuery.includes('team') || lowerQuery.includes('collaborate')) {
      return '🤝 I can help you find the perfect teammates! Based on your profile:\n\n• 5 students match your skill set\n• 3 have similar project interests\n• Average team compatibility: 92%\n\nShall I show you the suggested team compositions?';
    }

    if (lowerQuery.includes('job') || lowerQuery.includes('internship')) {
      return '💼 Great question! Based on your U-Score (847) and skills:\n\n• You\'re eligible for 23 new internships\n• 8 companies viewed your profile this week\n• Top match: Google SWE Intern (94% match)\n\nWant me to help optimize your resume for applications?';
    }

    return 'I understand you\'re asking about: "' + query + '"\n\nI can help with:\n✓ Campus schedules & facilities\n✓ Finding mentors & teammates\n✓ Project ideas & guidance\n✓ Career opportunities\n✓ Academic support\n\nCould you provide more details so I can assist you better?';
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={onOpen}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col ${
          isFullScreen
            ? 'inset-4'
            : 'bottom-8 right-8 w-96 h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white">AI Mentor</h3>
              <p className="text-indigo-100">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              {isFullScreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="p-4 border-b border-slate-200">
            <p className="text-slate-600 mb-2">Quick actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-2xl rounded-bl-none'
                } px-4 py-3`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-slate-400 text-center mt-2">
            Powered by AI • Campus-specific knowledge
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

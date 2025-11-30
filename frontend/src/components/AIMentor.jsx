import { cn } from '../lib/utils'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function AIMentor({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Mentor. Ask me about campus events, mess menu, finding mentors, or anything else!',
    }
  ])
  const [input, setInput] = useState('')

  const quickActions = [
    'Show mess menu',
    'When is mid-sem?',
    'Find Python mentor',
    'Upcoming hackathons',
  ]

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm processing your query: "${input}". This is a demo response.`
      }])
    }, 1000)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50',
            'hover:scale-110',
            className
          )}
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className={cn(
          'fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-large shadow-hover border border-gray-200 flex flex-col z-50 animate-scale-in',
          className
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-primary text-white rounded-t-large">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Campus Mentor</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action)}
                  className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] px-4 py-2 rounded-2xl',
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

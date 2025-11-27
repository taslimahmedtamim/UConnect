import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { MessageSquare, Send, Search, Users } from 'lucide-react'
import { useState } from 'react'

const conversations = [
  {
    id: 1,
    name: 'E-Commerce Team',
    lastMessage: 'Let\'s schedule a meeting for tomorrow',
    time: '2h ago',
    unread: 2,
    type: 'group',
  },
  {
    id: 2,
    name: 'John Doe',
    lastMessage: 'Thanks for the help with the API!',
    time: '5h ago',
    unread: 0,
    type: 'direct',
  },
  {
    id: 3,
    name: 'AI Chatbot Project',
    lastMessage: 'The model is ready for testing',
    time: '1d ago',
    unread: 1,
    type: 'group',
  },
]

const messages = [
  { id: 1, sender: 'John Doe', text: 'Hey team, let\'s discuss the project timeline', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'You', text: 'Sounds good! I can work on the frontend components', time: '10:32 AM', isMe: true },
  { id: 3, sender: 'Jane Smith', text: 'I\'ll handle the backend API', time: '10:35 AM', isMe: false },
]

export function Chat() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState('')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Messages</CardTitle>
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedChat === conv.id
                      ? 'bg-brand/20 border border-brand/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {conv.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white truncate">{conv.name}</p>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-brand rounded-full flex items-center justify-center text-xs text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conv.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Window */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-semibold">
                E
              </div>
              <div>
                <CardTitle className="text-lg">E-Commerce Team</CardTitle>
                <p className="text-xs text-gray-400">4 members</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 space-y-4 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'}`}>
                    {!msg.isMe && (
                      <p className="text-xs text-gray-400 mb-1">{msg.sender}</p>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        msg.isMe
                          ? 'bg-brand/20 text-white'
                          : 'bg-white/5 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message) {
                    setMessage('')
                  }
                }}
              />
              <Button>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



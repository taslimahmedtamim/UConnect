import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { HelpCircle, Plus, Code, Bug, FileText, Search, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const posts = [
  {
    id: 1,
    title: 'Need help with React state management',
    description: 'Struggling with complex state in a large component. Looking for best practices.',
    author: 'John Doe',
    type: 'help',
    tags: ['React', 'JavaScript'],
    replies: 5,
    status: 'open',
  },
  {
    id: 2,
    title: 'Bug in authentication flow',
    description: 'Users are getting logged out unexpectedly. Need help debugging.',
    author: 'Jane Smith',
    type: 'bug',
    tags: ['Node.js', 'Auth'],
    replies: 3,
    status: 'open',
  },
  {
    id: 3,
    title: 'Documentation needed for API',
    description: 'Looking for someone to help write comprehensive API documentation.',
    author: 'Bob Johnson',
    type: 'docs',
    tags: ['Documentation', 'API'],
    replies: 2,
    status: 'resolved',
  },
]

export function HelpBoard() {
  const [search, setSearch] = useState('')

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug':
        return <Bug className="w-4 h-4" />
      case 'docs':
        return <FileText className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug':
        return 'bg-red-500/20 text-red-400'
      case 'docs':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-brand/20 text-brand'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Help Board</h1>
          <p className="text-gray-400">Get help, share knowledge, and collaborate</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help posts..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:border-brand/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(post.type)}`}>
                  {getTypeIcon(post.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-400">{post.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'open' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-gray-400">by {post.author}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



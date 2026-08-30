"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@/components/UserProvider';
import { MessageSquare, Heart, MessageCircle, Send, MoreHorizontal, HelpCircle, Code, Briefcase, ChevronDown, Search, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const renderContentWithLinks = (text: string) => {
  // Simple regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {part}
        </a>
      );
    }
    return part;
  });
};

interface Post {
  id: string;
  content: string;
  postType: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    role: string;
    profileImage: string | null;
  };
  likes: { userId: string }[];
  _count: {
    comments: number;
    likes: number;
  };
}

interface TrendingTag {
  tag: string;
  count: number;
}

export default function CommunityFeedPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const search = searchParams.get('q');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [trending, setTrending] = useState<TrendingTag[]>([]);
  const [searchInput, setSearchInput] = useState(search || '');
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('General');
  const [projectUrl, setProjectUrl] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  const fetchPosts = async () => {
    try {
      const urlParams = new URLSearchParams();
      if (filter) urlParams.append('filter', filter);
      if (search) urlParams.append('q', search);
      
      const url = `/api/feed?${urlParams.toString()}`;
      
      const [resPosts, resTrending] = await Promise.all([
        fetch(url),
        fetch('/api/feed/trending')
      ]);
      
      const dataPosts = await resPosts.json();
      const dataTrending = await resTrending.json();
      
      if (dataPosts.success) {
        setPosts(dataPosts.posts);
      }
      if (dataTrending.success) {
        setTrending(dataTrending.trending);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(search || '');
    fetchPosts();
  }, [filter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (filter) urlParams.append('filter', filter);
    if (searchInput.trim()) urlParams.append('q', searchInput.trim());
    
    router.push(`/feed?${urlParams.toString()}`);
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    
    let finalContent = newPostContent;
    if (newPostType === 'Project Showcase' && projectUrl.trim()) {
      finalContent += `\n\n🔗 ${projectUrl.trim()}`;
    }

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalContent, postType: newPostType })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPostContent('');
        setProjectUrl('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    
    // Optimistic update
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.some(l => l.userId === user.id);
        if (hasLiked) {
          return { ...p, likes: p.likes.filter(l => l.userId !== user.id), _count: { ...p._count, likes: p._count.likes - 1 } };
        } else {
          return { ...p, likes: [...p.likes, { userId: user.id }], _count: { ...p._count, likes: p._count.likes + 1 } };
        }
      }
      return p;
    }));

    try {
      await fetch(`/api/feed/${postId}/like`, { method: 'POST' });
    } catch (e) {
      console.error(e);
      // Fallback update on error
      fetchPosts();
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentContent.trim()) return;
    try {
      const res = await fetch(`/api/feed/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, _count: { ...p._count, comments: p._count.comments + 1 } };
          }
          return p;
        }));
        setCommentContent('');
        setActiveCommentPostId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {filter === 'help' ? 'Help Requests' : search ? `Search: ${search}` : 'Community Feed'}
          </h1>
          <p className="text-slate-500">
            {filter === 'help' 
              ? 'Connect with peers and mentors to overcome your blockers.' 
              : 'Share your thoughts, ask questions, and connect with peers.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-2">

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search posts or #hashtags..." 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {/* Create Post Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={newPostType === 'Project Showcase' ? "Describe your project, the tech stack used, and what you learned..." : "What's on your mind? Share your thoughts with the community..."}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
            />
            {newPostType === 'Project Showcase' && (
              <div className="mt-3 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="Link to GitHub repo or live project (optional)"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex justify-between items-center mt-3">
              <div className="relative">
                <button 
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {newPostType === 'Help Needed' && <HelpCircle className="w-4 h-4 text-amber-500" />}
                  {newPostType === 'Project Showcase' && <Code className="w-4 h-4 text-emerald-500" />}
                  {newPostType === 'General' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                  {newPostType}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10">
                    <button onClick={() => { setNewPostType('General'); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" /> General
                    </button>
                    <button onClick={() => { setNewPostType('Help Needed'); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-500" /> Help Needed
                    </button>
                    <button onClick={() => { setNewPostType('Project Showcase'); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-500" /> Project Showcase
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handlePostSubmit}
                disabled={submitting || !newPostContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No posts yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          posts.map(post => {
            const hasLiked = user ? post.likes.some(l => l.userId === user.id) : false;
            
            return (
              <div key={post.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md ${post.postType === 'Help Needed' ? 'border-amber-200 dark:border-amber-900/50 relative overflow-hidden' : 'border-slate-200 dark:border-slate-800'}`}>
                {post.postType === 'Help Needed' && (
                  <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl border-l border-b border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Help Needed
                  </div>
                )}
                {post.postType === 'Project Showcase' && (
                  <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl border-l border-b border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                    <Code className="w-3 h-3" /> Project Showcase
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                      {post.author.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-base">
                        {post.author.fullName}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>{post.author.role}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed mb-5 whitespace-pre-wrap">
                  {renderContentWithLinks(post.content)}
                </p>
                
                <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      hasLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{post._count.likes} Likes</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post._count.comments} Comments</span>
                  </button>
                </div>

                {/* Comment Section */}
                {activeCommentPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post.id)}
                        disabled={!commentContent.trim()}
                        className="bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Trending Topics</h2>
          <div className="space-y-4">
            {trending.length > 0 ? trending.map((item) => (
              <Link href={`/feed?q=${encodeURIComponent(item.tag)}`} key={item.tag} className="flex justify-between items-center cursor-pointer group">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{item.tag}</span>
                <span className="text-xs text-slate-400">{item.count} posts</span>
              </Link>
            )) : (
              <div className="text-sm text-slate-500 italic">No trending topics yet. Use #hashtags in your posts!</div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white mb-3">Community Guidelines</h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Be respectful and constructive.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Share knowledge and help others grow.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              No spam or self-promotion without context.
            </li>
          </ul>
        </div>
      </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MessageCircle, ChevronDown, Moon, Sun, CheckCheck, Briefcase, Users, Calendar, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  onOpenAIMentor: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function TopBar({ onOpenAIMentor, darkMode = false, onToggleDarkMode }: TopBarProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New team invitation for ML Project', time: '5m ago', unread: true, type: 'team', icon: Users },
    { id: 2, text: 'Your resume was viewed by Grameenphone', time: '1h ago', unread: true, type: 'opportunity', icon: Briefcase },
    { id: 3, text: 'Task deadline: Model training due tomorrow', time: '3h ago', unread: false, type: 'deadline', icon: Calendar },
    { id: 4, text: 'Nadia endorsed your Python skills', time: '5h ago', unread: true, type: 'endorsement', icon: CheckCheck },
    { id: 5, text: 'New event: Bangladesh Hackathon 2025', time: '1d ago', unread: false, type: 'event', icon: Calendar },
  ]);

  const searchSuggestions = [
    { type: 'project', text: 'AI Image Classifier', path: '/projects/1' },
    { type: 'user', text: 'Rafid Ahmed - BUET', path: '/profile/rafid' },
    { type: 'opportunity', text: 'Frontend Intern at bKash', path: '/opportunities' },
    { type: 'event', text: 'Google Cloud Study Jam', path: '/events' },
  ];

  const filteredSuggestions = searchQuery.length > 0 
    ? searchSuggestions.filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSignOut = () => {
    localStorage.removeItem('uconnect_auth');
    localStorage.removeItem('uconnect_onboarding');
    localStorage.removeItem('uconnect_role');
    window.location.href = '/';
  };

  const filteredNotifications = notificationFilter === 'unread' 
    ? notifications.filter(n => n.unread) 
    : notifications;

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search with Autocomplete */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            placeholder="Search projects, teammates, opportunities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          />
          
          <AnimatePresence>
            {showSearchResults && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(suggestion.path);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      suggestion.type === 'project' ? 'bg-indigo-100 text-indigo-700' :
                      suggestion.type === 'user' ? 'bg-emerald-100 text-emerald-700' :
                      suggestion.type === 'opportunity' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {suggestion.type}
                    </span>
                    <span className="text-slate-700">{suggestion.text}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        {onToggleDarkMode && (
          <motion.button
            onClick={onToggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </motion.button>
        )}

        {/* AI Mentor Button */}
        <button
          onClick={onOpenAIMentor}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>AI Mentor</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-slate-900 font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNotificationFilter('all')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        notificationFilter === 'all' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNotificationFilter('unread')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        notificationFilter === 'unread' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group ${
                          notification.unread ? 'bg-indigo-50/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'team' ? 'bg-blue-100 text-blue-600' :
                            notification.type === 'opportunity' ? 'bg-amber-100 text-amber-600' :
                            notification.type === 'deadline' ? 'bg-red-100 text-red-600' :
                            notification.type === 'endorsement' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            <notification.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-sm">{notification.text}</p>
                            <p className="text-slate-500 text-xs mt-1">{notification.time}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                        {notification.unread && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full" />
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t border-slate-200 bg-slate-50">
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
            <div className="text-left">
              <p className="text-slate-900">Aarav Sharma</p>
              <p className="text-slate-500">CS, IIT Delhi</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                    <div>
                      <p className="text-slate-900">Aarav Sharma</p>
                      <p className="text-slate-500">U-Score: 847</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    >
                      Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-700">
                      Help & Support
                    </button>
                    <hr className="my-2" />
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

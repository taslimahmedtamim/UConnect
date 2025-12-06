import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  onOpenAIMentor: () => void;
}

export default function TopBar({ onOpenAIMentor }: TopBarProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('uconnect_auth');
    localStorage.removeItem('uconnect_onboarding');
    localStorage.removeItem('uconnect_role');
    window.location.href = '/';
  };

  const notifications = [
    { id: 1, text: 'New team invitation for ML Project', time: '5m ago', unread: true },
    { id: 2, text: 'Your resume was viewed by Google', time: '1h ago', unread: true },
    { id: 3, text: 'Task deadline approaching', time: '3h ago', unread: false },
  ];

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, teammates, opportunities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <p className="text-slate-900 mb-1">{notification.text}</p>
                      <p className="text-slate-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center border-t border-slate-200">
                  <button className="text-indigo-600 hover:text-indigo-700">
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

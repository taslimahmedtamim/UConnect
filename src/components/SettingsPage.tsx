import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Bell, Lock, Palette, Globe, Shield, 
  Mail, Smartphone, Moon, Sun, Save, Check,
  Eye, EyeOff, ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from './Toast';

interface SettingsPageProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsPage({ onOpenAIMentor, darkMode, onToggleDarkMode }: SettingsPageProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    phone: '+880 1712-345678',
    university: 'BUET',
    department: 'Computer Science & Engineering',
    graduationYear: '2025',
    bio: 'Passionate about AI/ML and full-stack development.',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    teamInvites: true,
    projectUpdates: true,
    opportunityAlerts: true,
    weeklyDigest: false,
    mentorMessages: true,
    endorsements: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showProjects: true,
    showSkills: true,
    showAchievements: true,
    allowTeamInvites: true,
    allowRecruiterContact: true,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: darkMode ? 'dark' : 'light',
    accentColor: 'indigo',
    compactMode: false,
    animationsEnabled: true,
  });

  const handleSave = () => {
    setToastMessage('Settings saved successfully!');
    setShowToast(true);
    // In a real app, save to backend
    localStorage.setItem('uconnect_settings', JSON.stringify({
      profile: profileSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
      appearance: appearanceSettings,
    }));
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const accentColors = [
    { name: 'indigo', class: 'bg-indigo-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'emerald', class: 'bg-emerald-500' },
    { name: 'rose', class: 'bg-rose-500' },
    { name: 'amber', class: 'bg-amber-500' },
  ];

  const ToggleSwitch = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-slate-700">{label}</span>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          animate={{ left: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-indigo-50'} flex`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Settings</h1>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeSection === section.id
                          ? 'bg-indigo-600 text-white'
                          : darkMode 
                            ? 'text-slate-300 hover:bg-slate-700' 
                            : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
              >
                {/* Profile Settings */}
                {activeSection === 'profile' && (
                  <div>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                      Profile Settings
                    </h2>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400" />
                      <div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                          Change Photo
                        </button>
                        <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          JPG, PNG or GIF. Max 5MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileSettings.fullName}
                          onChange={(e) => setProfileSettings({ ...profileSettings, fullName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileSettings.email}
                          onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileSettings.phone}
                          onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          University
                        </label>
                        <input
                          type="text"
                          value={profileSettings.university}
                          onChange={(e) => setProfileSettings({ ...profileSettings, university: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Department
                        </label>
                        <input
                          type="text"
                          value={profileSettings.department}
                          onChange={(e) => setProfileSettings({ ...profileSettings, department: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        />
                      </div>

                      <div>
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Graduation Year
                        </label>
                        <select
                          value={profileSettings.graduationYear}
                          onChange={(e) => setProfileSettings({ ...profileSettings, graduationYear: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                        >
                          {[2024, 2025, 2026, 2027, 2028].map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Bio
                        </label>
                        <textarea
                          value={profileSettings.bio}
                          onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeSection === 'notifications' && (
                  <div>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          General
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <ToggleSwitch
                            enabled={notificationSettings.emailNotifications}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              emailNotifications: !notificationSettings.emailNotifications 
                            })}
                            label="Email Notifications"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.pushNotifications}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              pushNotifications: !notificationSettings.pushNotifications 
                            })}
                            label="Push Notifications"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.weeklyDigest}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              weeklyDigest: !notificationSettings.weeklyDigest 
                            })}
                            label="Weekly Digest Email"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Activity
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <ToggleSwitch
                            enabled={notificationSettings.teamInvites}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              teamInvites: !notificationSettings.teamInvites 
                            })}
                            label="Team Invitations"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.projectUpdates}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              projectUpdates: !notificationSettings.projectUpdates 
                            })}
                            label="Project Updates"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.opportunityAlerts}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              opportunityAlerts: !notificationSettings.opportunityAlerts 
                            })}
                            label="Opportunity Alerts"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.mentorMessages}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              mentorMessages: !notificationSettings.mentorMessages 
                            })}
                            label="Mentor Messages"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.endorsements}
                            onToggle={() => setNotificationSettings({ 
                              ...notificationSettings, 
                              endorsements: !notificationSettings.endorsements 
                            })}
                            label="Skill Endorsements"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === 'privacy' && (
                  <div>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                      Privacy & Security
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Profile Visibility
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <div className="flex flex-wrap gap-3">
                            {['public', 'connections', 'private'].map((option) => (
                              <button
                                key={option}
                                onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: option })}
                                className={`px-4 py-2 rounded-xl capitalize transition-colors ${
                                  privacySettings.profileVisibility === option
                                    ? 'bg-indigo-600 text-white'
                                    : darkMode 
                                      ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' 
                                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Information Visibility
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <ToggleSwitch
                            enabled={privacySettings.showEmail}
                            onToggle={() => setPrivacySettings({ ...privacySettings, showEmail: !privacySettings.showEmail })}
                            label="Show Email Address"
                          />
                          <ToggleSwitch
                            enabled={privacySettings.showPhone}
                            onToggle={() => setPrivacySettings({ ...privacySettings, showPhone: !privacySettings.showPhone })}
                            label="Show Phone Number"
                          />
                          <ToggleSwitch
                            enabled={privacySettings.showProjects}
                            onToggle={() => setPrivacySettings({ ...privacySettings, showProjects: !privacySettings.showProjects })}
                            label="Show Projects"
                          />
                          <ToggleSwitch
                            enabled={privacySettings.showSkills}
                            onToggle={() => setPrivacySettings({ ...privacySettings, showSkills: !privacySettings.showSkills })}
                            label="Show Skills"
                          />
                          <ToggleSwitch
                            enabled={privacySettings.showAchievements}
                            onToggle={() => setPrivacySettings({ ...privacySettings, showAchievements: !privacySettings.showAchievements })}
                            label="Show Achievements"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Contact Permissions
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <ToggleSwitch
                            enabled={privacySettings.allowTeamInvites}
                            onToggle={() => setPrivacySettings({ ...privacySettings, allowTeamInvites: !privacySettings.allowTeamInvites })}
                            label="Allow Team Invitations"
                          />
                          <ToggleSwitch
                            enabled={privacySettings.allowRecruiterContact}
                            onToggle={() => setPrivacySettings({ ...privacySettings, allowRecruiterContact: !privacySettings.allowRecruiterContact })}
                            label="Allow Recruiter Contact"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Security
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4 space-y-3`}>
                          <button className={`w-full flex items-center justify-between p-3 rounded-xl ${
                            darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-slate-100 border border-slate-200'
                          } transition-colors`}>
                            <div className="flex items-center gap-3">
                              <Lock className="w-5 h-5 text-slate-500" />
                              <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>Change Password</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </button>
                          <button className={`w-full flex items-center justify-between p-3 rounded-xl ${
                            darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-slate-100 border border-slate-200'
                          } transition-colors`}>
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-slate-500" />
                              <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>Two-Factor Authentication</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeSection === 'appearance' && (
                  <div>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                      Appearance
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Theme
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                if (darkMode) onToggleDarkMode();
                              }}
                              className={`flex-1 flex items-center gap-3 p-4 rounded-xl transition-colors ${
                                !darkMode
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <Sun className="w-6 h-6" />
                              <span>Light</span>
                            </button>
                            <button
                              onClick={() => {
                                if (!darkMode) onToggleDarkMode();
                              }}
                              className={`flex-1 flex items-center gap-3 p-4 rounded-xl transition-colors ${
                                darkMode
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-800 text-white hover:bg-slate-700'
                              }`}
                            >
                              <Moon className="w-6 h-6" />
                              <span>Dark</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Accent Color
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <div className="flex gap-3">
                            {accentColors.map((color) => (
                              <button
                                key={color.name}
                                onClick={() => setAppearanceSettings({ ...appearanceSettings, accentColor: color.name })}
                                className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-transform ${
                                  appearanceSettings.accentColor === color.name ? 'ring-4 ring-offset-2 ring-indigo-300 scale-110' : ''
                                }`}
                              >
                                {appearanceSettings.accentColor === color.name && (
                                  <Check className="w-5 h-5 text-white" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>
                          Display Options
                        </h3>
                        <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
                          <ToggleSwitch
                            enabled={appearanceSettings.compactMode}
                            onToggle={() => setAppearanceSettings({ ...appearanceSettings, compactMode: !appearanceSettings.compactMode })}
                            label="Compact Mode"
                          />
                          <ToggleSwitch
                            enabled={appearanceSettings.animationsEnabled}
                            onToggle={() => setAppearanceSettings({ ...appearanceSettings, animationsEnabled: !appearanceSettings.animationsEnabled })}
                            label="Enable Animations"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                  <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

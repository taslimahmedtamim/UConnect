import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage2';
import OnboardingFlow from './components/OnboardingFlow2';
import StudentDashboard from './components/StudentDashboard';
import ProfilePage from './components/ProfilePage';
import ResumeBuilder from './components/ResumeBuilder';
import ProjectCreation from './components/ProjectCreation';
import ProjectWorkspace from './components/ProjectWorkspace';
import OpportunityHub from './components/OpportunityHub';
import RecruiterDashboard from './components/RecruiterDashboard';
import AIMentorChat from './components/AIMentorChat';
import Leaderboard from './components/Leaderboard';
import AchievementsVault from './components/AchievementsVault';
import EventsCalendar from './components/EventsCalendar';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'recruiter' | null>(null);
  const [showAIMentor, setShowAIMentor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Auto-detect dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('uconnect_darkmode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('uconnect_darkmode', darkMode.toString());
  }, [darkMode]);

  // Check authentication status
  useEffect(() => {
    const auth = localStorage.getItem('uconnect_auth');
    const onboarding = localStorage.getItem('uconnect_onboarding');
    const role = localStorage.getItem('uconnect_role');
    
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    if (onboarding === 'complete') {
      setHasCompletedOnboarding(true);
    }
    if (role) {
      setUserRole(role as 'student' | 'teacher' | 'recruiter');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('uconnect_auth', 'true');
  };

  const handleBackToHome = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('uconnect_auth');
  };

  const handleOnboardingComplete = (role: 'student' | 'teacher' | 'recruiter') => {
    setHasCompletedOnboarding(true);
    setUserRole(role);
    localStorage.setItem('uconnect_onboarding', 'complete');
    localStorage.setItem('uconnect_role', role);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                hasCompletedOnboarding ? (
                  <Navigate to={userRole === 'recruiter' ? '/recruiter' : '/dashboard'} replace />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              ) : (
                <LandingPage onLogin={handleLogin} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              )
            } 
          />
          
          <Route 
            path="/onboarding" 
            element={
              isAuthenticated ? (
                hasCompletedOnboarding ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <OnboardingFlow onComplete={handleOnboardingComplete} onBackToHome={handleBackToHome} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
                )
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <StudentDashboard onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <ProfilePage onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/resume" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <ResumeBuilder onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/projects/new" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <ProjectCreation onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/projects/:id" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <ProjectWorkspace onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/opportunities" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <OpportunityHub onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/leaderboard" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <Leaderboard onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/achievements" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <AchievementsVault onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/events" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <EventsCalendar onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              isAuthenticated && hasCompletedOnboarding ? (
                <SettingsPage onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/recruiter" 
            element={
              isAuthenticated && hasCompletedOnboarding && userRole === 'recruiter' ? (
                <RecruiterDashboard onOpenAIMentor={() => setShowAIMentor(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>

        {/* Floating AI Mentor */}
        {isAuthenticated && hasCompletedOnboarding && (
          <AIMentorChat 
            isOpen={showAIMentor}
            onClose={() => setShowAIMentor(false)}
            onOpen={() => setShowAIMentor(true)}
          />
        )}
      </div>
    </Router>
  );
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { Teams } from './pages/Teams'
import { Resume } from './pages/Resume'
import { Jobs } from './pages/Jobs'
import { Roadmaps } from './pages/Roadmaps'
import { Showcase } from './pages/Showcase'
import { HelpBoard } from './pages/HelpBoard'
import { Chat } from './pages/Chat'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="teams" element={<Teams />} />
                <Route path="resume" element={<Resume />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="roadmaps" element={<Roadmaps />} />
                <Route path="showcase" element={<Showcase />} />
                <Route path="help" element={<HelpBoard />} />
                <Route path="chat" element={<Chat />} />
                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

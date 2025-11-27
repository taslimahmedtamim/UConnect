import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import { Github, Mail } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    login('mock_token', { name: formData.name, email: formData.email, role: formData.role })
    navigate('/app/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0c141f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8 text-xl font-bold">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-strong to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <span>UConnect</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Join UConnect to start building your career</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
                  placeholder="you@university.edu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-strong"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  I am a
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-strong"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0f1520] text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Google</span>
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



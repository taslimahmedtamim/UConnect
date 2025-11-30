import { useState } from 'react'
import { Button } from '../components/Button'
import { SkillTagInput } from '../components/SkillTag'
import { Badge } from '../components/Badge'
import { ArrowRight, CheckCircle2, Mail, Clock, Sparkles } from 'lucide-react'

const roles = [
  { id: 'student', label: 'Student', desc: 'Collaborate, build projects, grow skills' },
  { id: 'teacher', label: 'Teacher', desc: 'Approve projects, mentor teams' },
  { id: 'recruiter', label: 'Recruiter', desc: 'Discover verified student talent' },
]

const interestOptions = [
  'AI/ML', 'Web Dev', 'Cybersecurity', 'IoT', 'Data Science', 'Cloud', 'AR/VR', 'Blockchain'
]

const availabilityOptions = [
  '5-10 hrs/week', '10-15 hrs/week', '15-20 hrs/week', '20+ hrs/week'
]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [availability, setAvailability] = useState(null)

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const toggleInterest = (i) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const steps = [
    'Role', 'Verify Email', 'Skills', 'Interests', 'Availability', 'Welcome'
  ]

  const complete = step === steps.length - 1

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-card border border-gray-200 p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full opacity-30" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-gradient-to-tr from-emerald-200 to-primary-200 rounded-full opacity-30" />
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                i === step ? 'bg-gradient-primary text-white shadow-soft' : i < step ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 mr-4 text-sm ${i === step ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Choose your role</h1>
            <p className="text-gray-600 mb-6">Select how you'll use UConnect.</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-4 border rounded-xl text-left transition-all hover:shadow-soft ${
                    role === r.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <h3 className="font-semibold mb-1 capitalize">{r.label}</h3>
                  <p className="text-xs text-gray-600">{r.desc}</p>
                </button>
              ))}
            </div>
            <Button disabled={!role} onClick={next} size="lg">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Verify university email</h1>
            <p className="text-gray-600 mb-4">Enter your .edu / university email to continue.</p>
            <div className="flex gap-2 mb-4">
              <input type="email" placeholder="name@university.edu" className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <Button onClick={() => setEmailVerified(true)} variant="outline">Send Code</Button>
            </div>
            {emailVerified && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-sm text-emerald-700 mb-4">
                <CheckCircle2 className="w-4 h-4" /> Verification simulated ✓
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={prev}>Back</Button>
              <Button disabled={!emailVerified} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Add key skills</h1>
            <p className="text-gray-600 mb-4">Press Enter to add each skill.</p>
            <SkillTagInput skills={skills} onAdd={(s)=>setSkills([...skills,s])} onRemove={(i)=>setSkills(skills.filter((_,idx)=>idx!==i))} />
            <div className="flex gap-2 mt-6">
              <Button variant="ghost" onClick={prev}>Back</Button>
              <Button disabled={skills.length===0} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select interests</h1>
            <p className="text-gray-600 mb-4">Pick areas you want to explore.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {interestOptions.map(int => (
                <button
                  key={int}
                  onClick={()=>toggleInterest(int)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    interests.includes(int) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                  }`}
                >{int}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={prev}>Back</Button>
              <Button disabled={interests.length===0} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Availability</h1>
            <p className="text-gray-600 mb-4">Let teammates know your weekly commitment.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {availabilityOptions.map(opt => (
                <button
                  key={opt}
                  onClick={()=>setAvailability(opt)}
                  className={`p-4 border rounded-xl text-left text-sm transition-all ${
                    availability === opt ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >{opt}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={prev}>Back</Button>
              <Button disabled={!availability} onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">Welcome to UConnect!</h1>
            <p className="text-gray-600 max-w-md mx-auto mb-6">You're all set. Based on your profile we'll start recommending teams, projects, and opportunities tailored to your growth journey.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge variant="success">{role}</Badge>
              <Badge variant="primary">{skills.length} skills</Badge>
              <Badge variant="purple">{interests.length} interests</Badge>
              <Badge variant="emerald">{availability}</Badge>
            </div>
            <Button size="lg" onClick={()=>window.location.href='/app/dashboard'}>Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" /></Button>
          </div>
        )}
      </div>
    </div>
  )
}

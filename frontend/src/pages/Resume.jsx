import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { FileText, Download, Sparkles, Eye, RefreshCw } from 'lucide-react'

const templates = [
  { id: 1, name: 'Modern', preview: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
  { id: 2, name: 'Classic', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 3, name: 'Creative', preview: 'bg-gradient-to-br from-green-500 to-emerald-500' },
]

export function Resume() {
  const [selectedTemplate, setSelectedTemplate] = useState(1)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(false)
  }

  return (
    <div className="space-y-6 relative z-10">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">U-Resume</h1>
        <p className="text-gray-400">Generate your AI-powered resume from your profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resume Preview</CardTitle>
                  <CardDescription>Your generated resume</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-8 rounded-lg min-h-[600px]">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                  <p className="text-gray-600">Computer Science Student | University of Technology</p>
                  <p className="text-sm text-gray-500">john.doe@university.edu | +1 (555) 123-4567</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Experience</h2>
                  <div className="mb-4">
                    <h3 className="font-semibold">Full-Stack Developer Intern</h3>
                    <p className="text-sm text-gray-600">TechCorp | Summer 2024</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Developed and deployed 3+ web applications using React and Node.js</li>
                      <li>Improved API response time by 40% through optimization</li>
                      <li>Collaborated with cross-functional team of 5 developers</li>
                    </ul>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Projects</h2>
                  <div className="mb-4">
                    <h3 className="font-semibold">E-Commerce Platform</h3>
                    <p className="text-sm text-gray-600">React, Node.js, MongoDB</p>
                    <p className="text-sm mt-1">Built a full-stack e-commerce solution with payment integration and admin dashboard</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Skills</h2>
                  <p className="text-sm">React, Node.js, Python, Machine Learning, MongoDB, Git</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Generate */}
          <Card className="border-brand/30 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" />
                AI Generation
              </CardTitle>
              <CardDescription>Generate or regenerate your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Resume
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                AI will optimize your resume with impact-focused bullet points and metrics
              </p>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Choose a resume template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all ${
                      selectedTemplate === template.id
                        ? 'border-brand bg-brand/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-16 ${template.preview} rounded`} />
                      <span className="text-white font-medium">{template.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Download DOCX
              </Button>
              <Button variant="outline" className="w-full">
                Export to LinkedIn
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



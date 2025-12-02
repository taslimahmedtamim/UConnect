import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Sparkles, Wand2, Copy, Check } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ResumeBuilderProps {
  onOpenAIMentor: () => void;
}

const templates = [
  { id: 'modern', name: 'Modern', color: 'from-indigo-500 to-purple-500' },
  { id: 'classic', name: 'Classic', color: 'from-slate-600 to-gray-600' },
  { id: 'creative', name: 'Creative', color: 'from-pink-500 to-rose-500' },
];

export default function ResumeBuilder({ onOpenAIMentor }: ResumeBuilderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [generatingBullets, setGeneratingBullets] = useState(false);

  const handleGenerateBullets = () => {
    setGeneratingBullets(true);
    setTimeout(() => setGeneratingBullets(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-slate-900 mb-2">U-Resume Builder</h1>
              <p className="text-slate-600">AI-powered resume generation from your verified projects</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Profile Data & Controls */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Choose Template</h3>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${template.color} mb-2`} />
                      <p className="text-slate-900">{template.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Tools */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">AI Tools</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleGenerateBullets}
                    disabled={generatingBullets}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Wand2 className={`w-5 h-5 ${generatingBullets ? 'animate-spin' : ''}`} />
                    {generatingBullets ? 'Generating...' : 'Generate Bullet Points'}
                  </button>
                  <button className="w-full px-4 py-3 border border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Enhance Impact Metrics
                  </button>
                  <button className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    ATS Optimization Check
                  </button>
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Include Projects</h3>
                <div className="space-y-3">
                  {[
                    { name: 'AI-Powered Image Classifier', selected: true },
                    { name: 'Campus Event Management', selected: true },
                    { name: 'Smart Energy Monitor', selected: false },
                  ].map((project) => (
                    <label key={project.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={project.selected}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="text-slate-900">{project.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-slate-900 mb-4">Highlighted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'JavaScript', 'React', 'Machine Learning', 'Node.js', 'TensorFlow', 'MongoDB', 'AWS'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Resume Preview */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
              <div className="max-w-2xl mx-auto">
                {/* Resume Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-indigo-600 pb-4">
                    <h2 className="text-slate-900 mb-1">AARAV SHARMA</h2>
                    <p className="text-slate-600 mb-2">Full-Stack Developer | AI/ML Enthusiast</p>
                    <div className="flex items-center justify-center gap-4 text-slate-600">
                      <span>aarav.sharma@iitd.ac.in</span>
                      <span>•</span>
                      <span>+91 98765 43210</span>
                      <span>•</span>
                      <span>New Delhi, India</span>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-indigo-600 mb-3 pb-1 border-b border-slate-200">EDUCATION</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-slate-900">Indian Institute of Technology Delhi</p>
                          <p className="text-slate-600">Bachelor of Technology in Computer Science</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-900">2021 - 2025</p>
                          <p className="text-slate-600">GPA: 8.9/10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience / Projects */}
                  <div>
                    <h3 className="text-indigo-600 mb-3 pb-1 border-b border-slate-200">PROJECTS</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-slate-900">AI-Powered Image Classifier</p>
                          <p className="text-slate-600">Sep 2024 - Nov 2024</p>
                        </div>
                        <p className="text-slate-600 mb-2">Technologies: Python, TensorFlow, OpenCV, Flask</p>
                        <motion.ul 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="list-disc list-inside space-y-1 text-slate-700 text-sm"
                        >
                          <li>Developed a CNN-based image classification model achieving <strong>92% accuracy</strong> on multi-class datasets</li>
                          <li>Optimized model performance, reducing inference time by <strong>40%</strong> using TensorFlow Lite</li>
                          <li>Deployed production-ready API serving <strong>1000+ daily requests</strong> with Flask and Docker</li>
                          <li>Led a team of 4 students, coordinating development sprints and code reviews</li>
                        </motion.ul>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-slate-900">Campus Event Management System</p>
                          <p className="text-slate-600">Jun 2024 - Aug 2024</p>
                        </div>
                        <p className="text-slate-600 mb-2">Technologies: React, Node.js, MongoDB, Express</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                          <li>Built full-stack MERN application managing <strong>500+ active users</strong> across campus events</li>
                          <li>Implemented real-time notifications using WebSocket, improving user engagement by <strong>35%</strong></li>
                          <li>Designed responsive UI with React and Tailwind CSS, achieving <strong>95+ Lighthouse score</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-indigo-600 mb-3 pb-1 border-b border-slate-200">TECHNICAL SKILLS</h3>
                    <div className="space-y-2 text-slate-700">
                      <p><strong>Languages:</strong> Python, JavaScript, TypeScript, C++, Java</p>
                      <p><strong>Frameworks:</strong> React, Node.js, Express, TensorFlow, PyTorch, Flask</p>
                      <p><strong>Tools & Technologies:</strong> Git, Docker, AWS, MongoDB, PostgreSQL, Redis</p>
                      <p><strong>Specializations:</strong> Machine Learning, Deep Learning, Full-Stack Development, RESTful APIs</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-indigo-600 mb-3 pb-1 border-b border-slate-200">ACHIEVEMENTS & CERTIFICATIONS</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      <li>AWS Certified Developer - Associate (2024)</li>
                      <li>UConnect U-Score: 847 (Top 5% of platform users)</li>
                      <li>Winner, IIT Delhi Hackathon 2024 - AI/ML Category</li>
                      <li>45+ peer endorsements for technical skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-slate-900 mb-4">Export Options</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                PDF
              </button>
              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                DOCX
              </button>
              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                LinkedIn Format
              </button>
              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Plain Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

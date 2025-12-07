import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, MicOff, Video, VideoOff, Play, Pause, RotateCcw,
  MessageCircle, Brain, Target, Clock, CheckCircle, XCircle,
  ThumbsUp, AlertCircle, Sparkles, ChevronRight, BookOpen, Award
} from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface InterviewCoachProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type InterviewType = 'behavioral' | 'technical' | 'system-design' | 'hr';

const interviewTypes: { id: InterviewType; name: string; icon: typeof Brain; color: string; questions: number }[] = [
  { id: 'behavioral', name: 'Behavioral', icon: MessageCircle, color: 'from-blue-500 to-cyan-500', questions: 20 },
  { id: 'technical', name: 'Technical (DSA)', icon: Brain, color: 'from-purple-500 to-indigo-500', questions: 50 },
  { id: 'system-design', name: 'System Design', icon: Target, color: 'from-emerald-500 to-teal-500', questions: 15 },
  { id: 'hr', name: 'HR Round', icon: MessageCircle, color: 'from-pink-500 to-rose-500', questions: 15 },
];

const sampleQuestions: Record<InterviewType, { question: string; tips: string[]; sampleAnswer: string }[]> = {
  behavioral: [
    {
      question: 'Tell me about a time when you had to work with a difficult team member.',
      tips: ['Use STAR method', 'Focus on resolution', 'Show empathy'],
      sampleAnswer: 'In my previous project, I worked with a team member who had different communication styles...',
    },
    {
      question: 'Describe a situation where you failed and what you learned from it.',
      tips: ['Be honest', 'Focus on growth', 'Show self-awareness'],
      sampleAnswer: 'During my first hackathon, our team underestimated the scope of the project...',
    },
  ],
  technical: [
    {
      question: 'Explain the difference between BFS and DFS. When would you use each?',
      tips: ['Explain time/space complexity', 'Give real examples', 'Discuss trade-offs'],
      sampleAnswer: 'BFS uses a queue and explores level by level, while DFS uses a stack...',
    },
    {
      question: 'How would you implement a LRU Cache?',
      tips: ['Mention HashMap + Doubly Linked List', 'Discuss O(1) operations', 'Handle edge cases'],
      sampleAnswer: 'I would use a combination of a HashMap for O(1) lookup and a Doubly Linked List...',
    },
  ],
  'system-design': [
    {
      question: 'Design a URL shortening service like bit.ly',
      tips: ['Start with requirements', 'Discuss scale', 'Consider database choices'],
      sampleAnswer: 'First, let me clarify the requirements. We need to handle read-heavy traffic...',
    },
  ],
  hr: [
    {
      question: 'Where do you see yourself in 5 years?',
      tips: ['Show ambition', 'Align with company', 'Be realistic'],
      sampleAnswer: 'In 5 years, I see myself as a senior engineer leading impactful projects...',
    },
  ],
};

const practiceHistory = [
  { date: 'Today', type: 'Technical', score: 85, duration: '25 min' },
  { date: 'Yesterday', type: 'Behavioral', score: 78, duration: '20 min' },
  { date: '2 days ago', type: 'System Design', score: 72, duration: '35 min' },
];

const feedbackMetrics = [
  { name: 'Clarity', score: 82, color: 'from-blue-500 to-cyan-500' },
  { name: 'Technical Depth', score: 75, color: 'from-purple-500 to-indigo-500' },
  { name: 'Communication', score: 88, color: 'from-emerald-500 to-teal-500' },
  { name: 'Problem Solving', score: 79, color: 'from-amber-500 to-orange-500' },
];

export default function InterviewCoach({ onOpenAIMentor, darkMode, onToggleDarkMode }: InterviewCoachProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedType, setSelectedType] = useState<InterviewType>('behavioral');
  const [isRecording, setIsRecording] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPracticing && isRecording) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPracticing, isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPractice = () => {
    setIsPracticing(true);
    setCurrentQuestion(0);
    setTimer(0);
    setShowTips(false);
    setShowSampleAnswer(false);
  };

  const nextQuestion = () => {
    const questions = sampleQuestions[selectedType];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowTips(false);
      setShowSampleAnswer(false);
      setTimer(0);
    }
  };

  const questions = sampleQuestions[selectedType];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex relative`}>
      <AnimatedBackground darkMode={darkMode} />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} relative z-10`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
        
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Mic className="w-12 h-12 text-indigo-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Mic className="w-12 h-12 text-indigo-400 blur-md" />
                </motion.div>
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`}>
                  Interview Coach
                </h1>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  AI-powered mock interviews with real-time feedback
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interview Type Selection */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {interviewTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setIsPracticing(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : darkMode ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                  <type.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold`}>{type.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{type.questions} questions</p>
              </motion.button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Practice Area */}
            <div className="lg:col-span-2 space-y-6">
              {!isPracticing ? (
                <GlassCard className="p-8 text-center">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6`}>
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-2xl mb-4`}>
                    Ready to Practice?
                  </h2>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-6 max-w-md mx-auto`}>
                    Practice {interviewTypes.find(t => t.id === selectedType)?.name} interviews with AI-generated questions and get instant feedback on your responses.
                  </p>
                  <button
                    onClick={startPractice}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Start Practice Session
                  </button>
                </GlassCard>
              ) : (
                <>
                  {/* Question Card */}
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                        <span className={`font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formatTime(timer)}</span>
                      </div>
                    </div>

                    <h2 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-6`}>
                      {questions[currentQuestion].question}
                    </h2>

                    {/* Video/Audio Preview */}
                    <div className={`aspect-video rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center mb-6 relative overflow-hidden`}>
                      {videoEnabled ? (
                        <div className="text-center">
                          <Video className={`w-16 h-16 ${darkMode ? 'text-slate-600' : 'text-slate-400'} mx-auto mb-2`} />
                          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Camera preview would appear here</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <VideoOff className={`w-16 h-16 ${darkMode ? 'text-slate-600' : 'text-slate-400'} mx-auto mb-2`} />
                          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Camera is off</p>
                        </div>
                      )}
                      
                      {/* Recording indicator */}
                      {isRecording && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="absolute top-4 left-4 flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-red-500 text-sm font-medium">Recording</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`p-4 rounded-xl ${micEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                      >
                        {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setVideoEnabled(!videoEnabled)}
                        className={`p-4 rounded-xl ${videoEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                      >
                        {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 ${
                          isRecording
                            ? 'bg-red-500 text-white'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        }`}
                      >
                        {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </button>
                      <button
                        onClick={() => setTimer(0)}
                        className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                      >
                        <RotateCcw className="w-6 h-6" />
                      </button>
                    </div>
                  </GlassCard>

                  {/* Tips & Sample Answer */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                      <button
                        onClick={() => setShowTips(!showTips)}
                        className="w-full flex items-center justify-between"
                      >
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold flex items-center gap-2`}>
                          <Sparkles className="w-5 h-5 text-amber-500" />
                          Tips
                        </span>
                        <ChevronRight className={`w-5 h-5 transition-transform ${showTips ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showTips && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-2 overflow-hidden"
                          >
                            {questions[currentQuestion].tips.map((tip, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{tip}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>

                    <GlassCard className="p-4">
                      <button
                        onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                        className="w-full flex items-center justify-between"
                      >
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold flex items-center gap-2`}>
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          Sample Answer
                        </span>
                        <ChevronRight className={`w-5 h-5 transition-transform ${showSampleAnswer ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showSampleAnswer && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`mt-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm overflow-hidden`}
                          >
                            {questions[currentQuestion].sampleAnswer}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </div>

                  {/* Next Question */}
                  <div className="flex justify-end">
                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion >= questions.length - 1}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Feedback Metrics */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4 flex items-center gap-2`}>
                  <Award className="w-5 h-5 text-amber-500" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  {feedbackMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{metric.name}</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{metric.score}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Practice History */}
              <GlassCard className="p-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-lg mb-4`}>
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {practiceHistory.map((session, i) => (
                    <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>{session.type}</span>
                        <span className={`font-bold ${session.score >= 80 ? 'text-emerald-500' : session.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                          {session.score}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{session.date}</span>
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{session.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Stats */}
              <GlassCard className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <h3 className="font-black text-lg mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-black">23</p>
                    <p className="text-indigo-200">Sessions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">78%</p>
                    <p className="text-indigo-200">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">12h</p>
                    <p className="text-indigo-200">Practice Time</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">5</p>
                    <p className="text-indigo-200">Day Streak</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

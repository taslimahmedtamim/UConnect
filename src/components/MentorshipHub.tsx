import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AnimatedBackground from "./AnimatedBackground";
import {
  Users,
  Star,
  MessageCircle,
  Calendar,
  Search,
  Filter,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Send,
  ArrowRight,
  UserPlus,
  Globe,
} from "lucide-react";

interface MentorshipHubProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  university: string;
  expertise: string[];
  rating: number;
  totalMentees: number;
  availability: string;
  bio: string;
  yearsExperience: number;
  languages: string[];
  responseTime: string;
  isAvailable: boolean;
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  status: "pending" | "accepted" | "declined";
  message: string;
  createdAt: string;
}

interface Session {
  id: string;
  mentorName: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "video" | "chat";
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    avatar: "SC",
    title: "Senior Software Engineer",
    company: "Google",
    university: "Stanford University",
    expertise: ["Machine Learning", "Python", "System Design", "Career Growth"],
    rating: 4.9,
    totalMentees: 47,
    availability: "Weekends",
    bio: "10+ years in tech, passionate about helping students break into FAANG companies.",
    yearsExperience: 12,
    languages: ["English", "Mandarin"],
    responseTime: "< 24 hours",
    isAvailable: true,
  },
  {
    id: "2",
    name: "James Rodriguez",
    avatar: "JR",
    title: "Product Manager",
    company: "Microsoft",
    university: "MIT",
    expertise: ["Product Strategy", "UX Design", "Agile", "Leadership"],
    rating: 4.8,
    totalMentees: 32,
    availability: "Evenings",
    bio: "Former engineer turned PM, love helping technical folks transition to product roles.",
    yearsExperience: 8,
    languages: ["English", "Spanish"],
    responseTime: "< 12 hours",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Emily Watson",
    avatar: "EW",
    title: "Data Scientist",
    company: "Netflix",
    university: "Berkeley",
    expertise: ["Data Analysis", "Statistics", "A/B Testing", "SQL"],
    rating: 4.7,
    totalMentees: 28,
    availability: "Flexible",
    bio: "Helping aspiring data scientists land their dream jobs with practical guidance.",
    yearsExperience: 6,
    languages: ["English"],
    responseTime: "< 48 hours",
    isAvailable: false,
  },
  {
    id: "4",
    name: "Michael Park",
    avatar: "MP",
    title: "Startup Founder",
    company: "TechVentures",
    university: "Harvard Business",
    expertise: ["Entrepreneurship", "Fundraising", "Business Strategy", "Networking"],
    rating: 4.9,
    totalMentees: 56,
    availability: "Mornings",
    bio: "Founded 3 startups, raised $50M+. Ready to help the next generation of founders.",
    yearsExperience: 15,
    languages: ["English", "Korean"],
    responseTime: "< 24 hours",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "LT",
    title: "Frontend Architect",
    company: "Meta",
    university: "Carnegie Mellon",
    expertise: ["React", "TypeScript", "Web Performance", "Design Systems"],
    rating: 4.6,
    totalMentees: 41,
    availability: "Weekends",
    bio: "Building scalable UIs at Meta. Love teaching modern web development best practices.",
    yearsExperience: 9,
    languages: ["English", "French"],
    responseTime: "< 24 hours",
    isAvailable: true,
  },
];

const mockSessions: Session[] = [
  {
    id: "1",
    mentorName: "Dr. Sarah Chen",
    mentorAvatar: "SC",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "45 min",
    topic: "Career Path Discussion",
    status: "upcoming",
    type: "video",
  },
  {
    id: "2",
    mentorName: "James Rodriguez",
    mentorAvatar: "JR",
    date: "2024-02-10",
    time: "3:00 PM",
    duration: "30 min",
    topic: "Resume Review",
    status: "completed",
    type: "video",
  },
];

const expertiseAreas = [
  "All Areas",
  "Software Engineering",
  "Data Science",
  "Product Management",
  "Entrepreneurship",
  "Machine Learning",
  "Design",
  "Career Growth",
];

export default function MentorshipHub({ onOpenAIMentor, darkMode, onToggleDarkMode }: MentorshipHubProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "sessions" | "requests">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All Areas");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requests, setRequests] = useState<MentorshipRequest[]>([
    {
      id: "1",
      mentorId: "3",
      mentorName: "Emily Watson",
      status: "pending",
      message: "I'd love to learn about data science career paths.",
      createdAt: "2024-02-08",
    },
  ]);

  const filteredMentors = useMemo(() => {
    return mockMentors.filter((mentor) => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        mentor.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExpertise =
        selectedExpertise === "All Areas" ||
        mentor.expertise.some((e) =>
          e.toLowerCase().includes(selectedExpertise.toLowerCase())
        );

      const matchesAvailability = !showAvailableOnly || mentor.isAvailable;

      return matchesSearch && matchesExpertise && matchesAvailability;
    });
  }, [searchQuery, selectedExpertise, showAvailableOnly]);

  const handleSendRequest = () => {
    if (!selectedMentor || !requestMessage.trim()) return;

    const newRequest: MentorshipRequest = {
      id: Date.now().toString(),
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      status: "pending",
      message: requestMessage,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRequests([...requests, newRequest]);
    setRequestMessage("");
    setSelectedMentor(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }
          />
        ))}
        <span className="ml-1 text-sm text-white/70">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <AnimatedBackground darkMode={darkMode} />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Mentorship Hub
          </h1>
          <p className="text-white/60 mt-1">
            Connect with industry professionals and alumni mentors
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "browse", label: "Browse Mentors", icon: Search },
          { id: "sessions", label: "My Sessions", icon: Calendar },
          { id: "requests", label: "My Requests", icon: MessageCircle },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <GlassCard className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search mentors by name, expertise, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-white/50" />
                  <select
                    value={selectedExpertise}
                    onChange={(e) => setSelectedExpertise(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {expertiseAreas.map((area) => (
                      <option key={area} value={area} className="bg-gray-800">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                  />
                  <span className="text-white/70">Available Now</span>
                </label>
              </div>
            </GlassCard>

            {/* Mentor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-5 hover:border-purple-500/30 transition-all">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                          {mentor.avatar}
                        </div>
                        {mentor.isAvailable && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {mentor.name}
                            </h3>
                            <p className="text-sm text-white/60">
                              {mentor.title} at{" "}
                              <span className="text-purple-400">{mentor.company}</span>
                            </p>
                          </div>
                          {renderStars(mentor.rating)}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <GraduationCap size={14} />
                            {mentor.university}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />
                            {mentor.yearsExperience} years
                          </span>
                        </div>

                        <p className="text-sm text-white/70 mt-2 line-clamp-2">
                          {mentor.bio}
                        </p>

                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {mentor.expertise.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            >
                              {skill}
                            </span>
                          ))}
                          {mentor.expertise.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-white/10 text-white/50">
                              +{mentor.expertise.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {mentor.totalMentees} mentees
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {mentor.responseTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe size={14} />
                              {mentor.languages.join(", ")}
                            </span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMentor(mentor)}
                            disabled={!mentor.isAvailable}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                              mentor.isAvailable
                                ? "bg-purple-500 text-white hover:bg-purple-600"
                                : "bg-white/10 text-white/40 cursor-not-allowed"
                            }`}
                          >
                            <UserPlus size={16} />
                            Request
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <GlassCard className="p-12 text-center">
                <Users size={48} className="mx-auto text-white/30 mb-4" />
                <p className="text-white/60">No mentors found matching your criteria</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === "sessions" && (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
            {mockSessions
              .filter((s) => s.status === "upcoming")
              .map((session) => (
                <GlassCard key={session.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {session.mentorAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{session.mentorName}</h3>
                        <p className="text-sm text-white/60">{session.topic}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {session.time} ({session.duration})
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      <Video size={16} />
                      Join Call
                    </motion.button>
                  </div>
                </GlassCard>
              ))}

            <h2 className="text-xl font-semibold text-white mt-8">Past Sessions</h2>
            {mockSessions
              .filter((s) => s.status === "completed")
              .map((session) => (
                <GlassCard key={session.id} className="p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold">
                        {session.mentorAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{session.mentorName}</h3>
                        <p className="text-sm text-white/60">{session.topic}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-green-400" />
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                      Completed
                    </span>
                  </div>
                </GlassCard>
              ))}
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {requests.map((request) => (
              <GlassCard key={request.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{request.mentorName}</h3>
                    <p className="text-sm text-white/60 mt-1">"{request.message}"</p>
                    <p className="text-xs text-white/40 mt-2">Sent: {request.createdAt}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      request.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : request.status === "accepted"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </GlassCard>
            ))}

            {requests.length === 0 && (
              <GlassCard className="p-12 text-center">
                <MessageCircle size={48} className="mx-auto text-white/30 mb-4" />
                <p className="text-white/60">No mentorship requests yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg mx-auto"
                >
                  Browse Mentors
                  <ArrowRight size={16} />
                </motion.button>
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMentor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Request Mentorship from {selectedMentor.name}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedMentor.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedMentor.title}</p>
                    <p className="text-sm text-white/60">{selectedMentor.company}</p>
                  </div>
                </div>

                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Introduce yourself and explain what you'd like to learn from this mentor..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                />

                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 py-2 bg-white/10 text-white rounded-xl"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendRequest}
                    disabled={!requestMessage.trim()}
                    className="flex-1 py-2 bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    Send Request
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

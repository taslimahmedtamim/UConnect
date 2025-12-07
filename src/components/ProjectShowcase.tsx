import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AnimatedBackground from "./AnimatedBackground";
import {
  FolderKanban,
  ExternalLink,
  Github,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  Users,
  Calendar,
  Code,
  Award,
  Bookmark,
  BookmarkPlus,
  ChevronRight,
  Globe,
  Zap,
  TrendingUp,
  Play,
} from "lucide-react";

interface ProjectShowcaseProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
    university: string;
  };
  team: { name: string; avatar: string }[];
  tags: string[];
  category: string;
  demoUrl?: string;
  githubUrl?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    stars: number;
  };
  createdAt: string;
  featured: boolean;
  awards: string[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "EcoTrack - Carbon Footprint Monitor",
    description: "An AI-powered mobile app that helps users track and reduce their carbon footprint through daily activities, gamification, and personalized sustainability recommendations.",
    thumbnail: "🌱",
    author: { name: "Sarah Chen", avatar: "SC", university: "Stanford" },
    team: [
      { name: "Sarah Chen", avatar: "SC" },
      { name: "Mike Johnson", avatar: "MJ" },
      { name: "Emily Davis", avatar: "ED" },
    ],
    tags: ["React Native", "TensorFlow", "Node.js", "MongoDB"],
    category: "Sustainability",
    demoUrl: "https://ecotrack.demo.com",
    githubUrl: "https://github.com/ecotrack",
    stats: { views: 2340, likes: 187, comments: 34, stars: 156 },
    createdAt: "2024-01-15",
    featured: true,
    awards: ["Best Sustainability Project 2024", "People's Choice Award"],
  },
  {
    id: "2",
    title: "StudyBuddy AI",
    description: "An intelligent study companion that creates personalized study plans, generates practice questions, and provides instant explanations using GPT-4 integration.",
    thumbnail: "📚",
    author: { name: "Alex Kim", avatar: "AK", university: "MIT" },
    team: [
      { name: "Alex Kim", avatar: "AK" },
      { name: "Lisa Park", avatar: "LP" },
    ],
    tags: ["Python", "OpenAI API", "React", "PostgreSQL"],
    category: "Education",
    demoUrl: "https://studybuddy.ai",
    githubUrl: "https://github.com/studybuddy-ai",
    stats: { views: 4521, likes: 342, comments: 67, stars: 289 },
    createdAt: "2024-02-01",
    featured: true,
    awards: ["AI Innovation Award"],
  },
  {
    id: "3",
    title: "MediConnect",
    description: "A telemedicine platform connecting rural communities with healthcare specialists through video consultations and AI-powered symptom analysis.",
    thumbnail: "🏥",
    author: { name: "James Wilson", avatar: "JW", university: "Johns Hopkins" },
    team: [
      { name: "James Wilson", avatar: "JW" },
      { name: "Priya Sharma", avatar: "PS" },
      { name: "David Lee", avatar: "DL" },
      { name: "Maria Garcia", avatar: "MG" },
    ],
    tags: ["Next.js", "WebRTC", "Python", "TensorFlow"],
    category: "Healthcare",
    demoUrl: "https://mediconnect.health",
    stats: { views: 1890, likes: 156, comments: 28, stars: 134 },
    createdAt: "2023-12-20",
    featured: false,
    awards: [],
  },
  {
    id: "4",
    title: "CodeCollab",
    description: "Real-time collaborative coding environment with integrated AI assistance, code review suggestions, and seamless GitHub integration for student teams.",
    thumbnail: "💻",
    author: { name: "Emma Watson", avatar: "EW", university: "Berkeley" },
    team: [
      { name: "Emma Watson", avatar: "EW" },
      { name: "Tom Brown", avatar: "TB" },
    ],
    tags: ["TypeScript", "Socket.io", "Monaco Editor", "Docker"],
    category: "Developer Tools",
    githubUrl: "https://github.com/codecollab",
    stats: { views: 3210, likes: 278, comments: 45, stars: 312 },
    createdAt: "2024-01-28",
    featured: true,
    awards: ["Best Developer Tool"],
  },
  {
    id: "5",
    title: "ArtistryAI",
    description: "Generate stunning artwork from text descriptions using state-of-the-art diffusion models. Features style transfer, image editing, and collaborative galleries.",
    thumbnail: "🎨",
    author: { name: "Nina Rodriguez", avatar: "NR", university: "UCLA" },
    team: [{ name: "Nina Rodriguez", avatar: "NR" }],
    tags: ["Python", "Stable Diffusion", "FastAPI", "React"],
    category: "AI/ML",
    demoUrl: "https://artistryai.art",
    stats: { views: 5670, likes: 489, comments: 92, stars: 423 },
    createdAt: "2024-02-10",
    featured: false,
    awards: [],
  },
  {
    id: "6",
    title: "FinanceFlow",
    description: "Personal finance management app for students with expense tracking, budget planning, investment simulation, and financial literacy modules.",
    thumbnail: "💰",
    author: { name: "Chris Lee", avatar: "CL", university: "Wharton" },
    team: [
      { name: "Chris Lee", avatar: "CL" },
      { name: "Amy Chen", avatar: "AC" },
      { name: "Ryan Park", avatar: "RP" },
    ],
    tags: ["Flutter", "Firebase", "Plaid API", "Charts"],
    category: "Finance",
    demoUrl: "https://financeflow.app",
    stats: { views: 2100, likes: 167, comments: 31, stars: 145 },
    createdAt: "2024-01-05",
    featured: false,
    awards: [],
  },
];

const categories = [
  "All",
  "AI/ML",
  "Education",
  "Healthcare",
  "Sustainability",
  "Developer Tools",
  "Finance",
  "Social Impact",
];

const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-viewed", label: "Most Viewed" },
];

export default function ProjectShowcase({ onOpenAIMentor, darkMode, onToggleDarkMode }: ProjectShowcaseProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>(["1"]);
  const [likedProjects, setLikedProjects] = useState<string[]>(["2", "4"]);

  const filteredProjects = useMemo(() => {
    let filtered = mockProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const matchesFeatured = !showFeaturedOnly || project.featured;

      return matchesSearch && matchesCategory && matchesFeatured;
    });

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "most-liked":
        filtered = [...filtered].sort((a, b) => b.stats.likes - a.stats.likes);
        break;
      case "most-viewed":
        filtered = [...filtered].sort((a, b) => b.stats.views - a.stats.views);
        break;
      case "trending":
      default:
        // Trending: combination of recent activity and engagement
        filtered = [...filtered].sort(
          (a, b) =>
            b.stats.likes + b.stats.comments * 2 + b.stats.stars -
            (a.stats.likes + a.stats.comments * 2 + a.stats.stars)
        );
    }

    return filtered;
  }, [searchQuery, selectedCategory, showFeaturedOnly, sortBy]);

  const toggleSave = (projectId: string) => {
    setSavedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleLike = (projectId: string) => {
    setLikedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
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
            <FolderKanban className="w-8 h-8 text-purple-400" />
            Project Showcase
          </h1>
          <p className="text-white/60 mt-1">
            Discover amazing student projects from universities worldwide
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl"
        >
          <Zap size={18} />
          Submit Project
        </motion.button>
      </motion.div>

      {/* Featured Banner */}
      {mockProjects.filter((p) => p.featured)[0] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-purple-500/10">
            <div className="flex items-center gap-2 text-yellow-400 mb-3">
              <Award size={20} />
              <span className="font-semibold">Featured Project of the Week</span>
            </div>
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-5xl">
                {mockProjects.filter((p) => p.featured)[0].thumbnail}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  {mockProjects.filter((p) => p.featured)[0].title}
                </h2>
                <p className="text-white/70 mt-1 line-clamp-2">
                  {mockProjects.filter((p) => p.featured)[0].description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-white/50">
                    <Eye size={16} />
                    {formatNumber(mockProjects.filter((p) => p.featured)[0].stats.views)}
                  </span>
                  <span className="flex items-center gap-1 text-white/50">
                    <Heart size={16} />
                    {formatNumber(mockProjects.filter((p) => p.featured)[0].stats.likes)}
                  </span>
                  <span className="flex items-center gap-1 text-white/50">
                    <Star size={16} className="text-yellow-400" />
                    {formatNumber(mockProjects.filter((p) => p.featured)[0].stats.stars)}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProject(mockProjects.filter((p) => p.featured)[0])}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-xl self-center"
              >
                View Project
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/50" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-800">
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500"
            />
            <span className="text-white/70">Featured Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              className="overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl relative">
                {project.thumbnail}
                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg">
                    <Star size={12} />
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(project.id);
                    }}
                    className="p-2 bg-black/40 backdrop-blur-sm rounded-lg"
                  >
                    {savedProjects.includes(project.id) ? (
                      <Bookmark size={16} className="text-purple-400 fill-purple-400" />
                    ) : (
                      <BookmarkPlus size={16} className="text-white" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/50">{project.category}</p>
                  </div>
                </div>

                <p className="text-sm text-white/70 line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded bg-white/10 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-white/10 text-white/40">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                      {project.author.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-white">{project.author.name}</p>
                      <p className="text-xs text-white/40">{project.author.university}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {formatNumber(project.stats.views)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(project.id);
                      }}
                      className={`flex items-center gap-1 ${
                        likedProjects.includes(project.id) ? "text-red-400" : ""
                      }`}
                    >
                      <Heart
                        size={12}
                        className={likedProjects.includes(project.id) ? "fill-red-400" : ""}
                      />
                      {formatNumber(
                        project.stats.likes + (likedProjects.includes(project.id) ? 1 : 0)
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <GlassCard className="p-12 text-center">
          <FolderKanban size={48} className="mx-auto text-white/30 mb-4" />
          <p className="text-white/60">No projects found matching your criteria</p>
        </GlassCard>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-auto"
            >
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex gap-6 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-6xl shrink-0">
                    {selectedProject.thumbnail}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                      {selectedProject.featured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500 text-black text-xs font-semibold rounded-lg">
                          <Star size={12} />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-3">{selectedProject.category}</p>

                    {/* Awards */}
                    {selectedProject.awards.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedProject.awards.map((award) => (
                          <span
                            key={award}
                            className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg"
                          >
                            <Award size={12} />
                            {award}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {formatNumber(selectedProject.stats.views)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={16} />
                        {formatNumber(selectedProject.stats.likes)} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {selectedProject.stats.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400" />
                        {formatNumber(selectedProject.stats.stars)} stars
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-white/80">{selectedProject.description}</p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Team</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {selectedProject.team.map((member) => (
                        <div
                          key={member.name}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium border-2 border-gray-900"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                    </div>
                    <div className="text-white/70">
                      {selectedProject.team.map((m) => m.name).join(", ")}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-6">
                  {selectedProject.demoUrl && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl"
                    >
                      <Play size={16} />
                      Live Demo
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                  {selectedProject.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl"
                    >
                      <Github size={16} />
                      View Source
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl ml-auto"
                  >
                    <Share2 size={16} />
                    Share
                  </motion.button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleLike(selectedProject.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      likedProjects.includes(selectedProject.id)
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={likedProjects.includes(selectedProject.id) ? "fill-red-400" : ""}
                    />
                    {likedProjects.includes(selectedProject.id) ? "Liked" : "Like"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSave(selectedProject.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      savedProjects.includes(selectedProject.id)
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      className={
                        savedProjects.includes(selectedProject.id) ? "fill-purple-400" : ""
                      }
                    />
                    {savedProjects.includes(selectedProject.id) ? "Saved" : "Save"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 py-2 bg-white/10 text-white rounded-xl"
                  >
                    Close
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

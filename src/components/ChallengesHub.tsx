import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AnimatedBackground from "./AnimatedBackground";
import {
  Trophy,
  Clock,
  Users,
  Calendar,
  Target,
  Zap,
  Award,
  Globe,
  Code,
  Lightbulb,
  Rocket,
  Star,
  Medal,
  Filter,
  Search,
  ChevronRight,
  ExternalLink,
  UserPlus,
  CheckCircle,
  Timer,
  Flame,
} from "lucide-react";

interface ChallengesHubProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "hackathon" | "competition" | "project-sprint" | "coding-challenge";
  status: "upcoming" | "active" | "ended";
  organizer: string;
  universities: string[];
  startDate: string;
  endDate: string;
  prizes: string[];
  participants: number;
  maxTeamSize: number;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  isRegistered: boolean;
  registrationDeadline: string;
}

interface Team {
  id: string;
  name: string;
  challengeId: string;
  challengeName: string;
  members: { name: string; avatar: string; role: string }[];
  lookingForMembers: boolean;
  neededSkills: string[];
}

interface Achievement {
  id: string;
  title: string;
  challenge: string;
  position: number;
  date: string;
  prize: string;
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Global AI Innovation Hackathon 2024",
    description: "Build innovative AI solutions to solve real-world problems. 48-hour hackathon with mentorship from industry experts.",
    type: "hackathon",
    status: "upcoming",
    organizer: "TechGlobal Foundation",
    universities: ["Stanford", "MIT", "Berkeley", "Harvard", "CMU"],
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    prizes: ["$10,000 Grand Prize", "$5,000 Runner-up", "$2,500 Third Place"],
    participants: 847,
    maxTeamSize: 4,
    skills: ["Python", "Machine Learning", "Deep Learning", "NLP"],
    difficulty: "intermediate",
    isRegistered: false,
    registrationDeadline: "2024-03-10",
  },
  {
    id: "2",
    title: "Cross-University Web Dev Sprint",
    description: "Design and develop a web application that promotes sustainability. One-week intensive project sprint.",
    type: "project-sprint",
    status: "active",
    organizer: "EcoTech Alliance",
    universities: ["UCLA", "USC", "CalTech"],
    startDate: "2024-02-10",
    endDate: "2024-02-17",
    prizes: ["$3,000 Best Overall", "$1,500 Best Design", "$1,500 Best Impact"],
    participants: 234,
    maxTeamSize: 3,
    skills: ["React", "Node.js", "UI/UX", "TypeScript"],
    difficulty: "beginner",
    isRegistered: true,
    registrationDeadline: "2024-02-08",
  },
  {
    id: "3",
    title: "Competitive Programming Championship",
    description: "Test your algorithmic skills against the best programmers from universities worldwide. Individual competition.",
    type: "coding-challenge",
    status: "upcoming",
    organizer: "CodeMasters",
    universities: ["Global - Open to All"],
    startDate: "2024-02-25",
    endDate: "2024-02-25",
    prizes: ["$5,000 Champion", "$2,500 Silver", "$1,000 Bronze"],
    participants: 1563,
    maxTeamSize: 1,
    skills: ["Algorithms", "Data Structures", "Problem Solving"],
    difficulty: "advanced",
    isRegistered: false,
    registrationDeadline: "2024-02-24",
  },
  {
    id: "4",
    title: "HealthTech Innovation Challenge",
    description: "Create technology solutions that improve healthcare accessibility and patient outcomes.",
    type: "competition",
    status: "ended",
    organizer: "MedTech Institute",
    universities: ["Johns Hopkins", "Stanford Medical", "Harvard Medical"],
    startDate: "2024-01-15",
    endDate: "2024-02-01",
    prizes: ["$15,000 Grand Prize", "Incubator Access", "Mentorship Program"],
    participants: 412,
    maxTeamSize: 5,
    skills: ["Healthcare", "Mobile Dev", "Data Analytics", "UX Research"],
    difficulty: "intermediate",
    isRegistered: false,
    registrationDeadline: "2024-01-10",
  },
];

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Neural Ninjas",
    challengeId: "1",
    challengeName: "Global AI Innovation Hackathon 2024",
    members: [
      { name: "Alex Kim", avatar: "AK", role: "ML Engineer" },
      { name: "Sarah Chen", avatar: "SC", role: "Full Stack" },
      { name: "Mike Johnson", avatar: "MJ", role: "Data Scientist" },
    ],
    lookingForMembers: true,
    neededSkills: ["UI/UX Designer"],
  },
  {
    id: "2",
    name: "Code Crusaders",
    challengeId: "1",
    challengeName: "Global AI Innovation Hackathon 2024",
    members: [
      { name: "Emma Davis", avatar: "ED", role: "Backend Dev" },
      { name: "James Wilson", avatar: "JW", role: "Frontend Dev" },
    ],
    lookingForMembers: true,
    neededSkills: ["ML Engineer", "DevOps"],
  },
];

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Second Place",
    challenge: "Winter Hackathon 2024",
    position: 2,
    date: "2024-01-20",
    prize: "$2,500",
  },
  {
    id: "2",
    title: "Best Innovation Award",
    challenge: "StartupWeek Competition",
    position: 1,
    date: "2023-11-15",
    prize: "Incubator Access",
  },
];

const challengeTypes = ["All Types", "hackathon", "competition", "project-sprint", "coding-challenge"];
const difficulties = ["All Levels", "beginner", "intermediate", "advanced"];

export default function ChallengesHub({ onOpenAIMentor, darkMode, onToggleDarkMode }: ChallengesHubProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"challenges" | "teams" | "achievements">("challenges");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "active" | "ended">("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showTeamFinder, setShowTeamFinder] = useState(false);

  const filteredChallenges = useMemo(() => {
    return mockChallenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "All Types" || challenge.type === selectedType;
      const matchesDifficulty =
        selectedDifficulty === "All Levels" || challenge.difficulty === selectedDifficulty;
      const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;

      return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedDifficulty, statusFilter]);

  const getStatusColor = (status: Challenge["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "active":
        return "bg-green-500/20 text-green-400";
      case "ended":
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
    }
  };

  const getTypeIcon = (type: Challenge["type"]) => {
    switch (type) {
      case "hackathon":
        return Rocket;
      case "competition":
        return Trophy;
      case "project-sprint":
        return Zap;
      case "coding-challenge":
        return Code;
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-purple-400" />;
    }
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
            <Trophy className="w-8 h-8 text-yellow-400" />
            Challenges & Hackathons
          </h1>
          <p className="text-white/60 mt-1">
            Compete with students across universities and win prizes
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTeamFinder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl"
        >
          <UserPlus size={18} />
          Find Team
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Challenges", value: "12", icon: Flame, color: "from-orange-500 to-red-500" },
          { label: "Participants", value: "3,200+", icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Total Prizes", value: "$50K+", icon: Trophy, color: "from-yellow-500 to-amber-500" },
          { label: "Universities", value: "25+", icon: Globe, color: "from-purple-500 to-pink-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "challenges", label: "All Challenges", icon: Target },
          { id: "teams", label: "Find Teams", icon: Users },
          { id: "achievements", label: "My Achievements", icon: Award },
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
        {activeTab === "challenges" && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <GlassCard className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search challenges, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-white/50" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    {challengeTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-800">
                        {type === "All Types" ? type : type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff} className="bg-gray-800">
                        {diff === "All Levels" ? diff : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex rounded-xl overflow-hidden border border-white/10">
                  {["all", "upcoming", "active", "ended"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as typeof statusFilter)}
                      className={`px-3 py-2 text-sm transition-all ${
                        statusFilter === status
                          ? "bg-purple-500 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Challenge List */}
            <div className="space-y-4">
              {filteredChallenges.map((challenge, index) => {
                const TypeIcon = getTypeIcon(challenge.type);
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard
                      className={`p-5 hover:border-purple-500/30 transition-all cursor-pointer ${
                        challenge.isRegistered ? "border-green-500/30" : ""
                      }`}
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                          <TypeIcon className="w-8 h-8 text-purple-400" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {challenge.title}
                                </h3>
                                {challenge.isRegistered && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-lg text-xs">
                                    <CheckCircle size={12} />
                                    Registered
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-white/60 mt-1">
                                by {challenge.organizer}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(challenge.status)}`}>
                                {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                              </span>
                              <span className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-white/70 mt-2 line-clamp-2">
                            {challenge.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {challenge.skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-4 text-sm text-white/50">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {challenge.startDate} - {challenge.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {challenge.participants} participants
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy size={14} className="text-yellow-400" />
                                {challenge.prizes[0]}
                              </span>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                            >
                              View Details
                              <ChevronRight size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "teams" && (
          <motion.div
            key="teams"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <GlassCard className="p-4 border-purple-500/30">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <p className="text-white/80">
                  Looking to join a team? Browse teams that are actively recruiting members for upcoming challenges.
                </p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                        <p className="text-sm text-white/60">{team.challengeName}</p>
                      </div>
                      {team.lookingForMembers && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                          Recruiting
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-white/50 mb-2">Team Members ({team.members.length}/4)</p>
                        <div className="flex -space-x-2">
                          {team.members.map((member) => (
                            <div
                              key={member.name}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium border-2 border-gray-900"
                              title={`${member.name} - ${member.role}`}
                            >
                              {member.avatar}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-white/50 mb-2">Looking for:</p>
                        <div className="flex flex-wrap gap-2">
                          {team.neededSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-2 bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} />
                      Request to Join
                    </motion.button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-4 text-center">
                <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-sm text-white/60">Challenges Won</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <Target className="w-12 h-12 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-sm text-white/60">Challenges Participated</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <Star className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">$4,000</p>
                <p className="text-sm text-white/60">Total Prizes Won</p>
              </GlassCard>
            </div>

            <h2 className="text-xl font-semibold text-white">Achievement History</h2>
            <div className="space-y-3">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-4">
                      {getPositionIcon(achievement.position)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-sm text-white/60">{achievement.challenge}</p>
                        <p className="text-xs text-white/40 mt-1">{achievement.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">{achievement.prize}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-auto"
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
                    <p className="text-white/60">by {selectedChallenge.organizer}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(selectedChallenge.status)}`}>
                    {selectedChallenge.status.charAt(0).toUpperCase() + selectedChallenge.status.slice(1)}
                  </span>
                </div>

                <p className="text-white/80 mb-4">{selectedChallenge.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/50">Dates</p>
                    <p className="text-white font-medium">
                      {selectedChallenge.startDate} to {selectedChallenge.endDate}
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/50">Team Size</p>
                    <p className="text-white font-medium">Up to {selectedChallenge.maxTeamSize} members</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/50">Difficulty</p>
                    <p className={`font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                      {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/50">Registration Deadline</p>
                    <p className="text-white font-medium">{selectedChallenge.registrationDeadline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/50 mb-2">Prizes</p>
                  <div className="space-y-2">
                    {selectedChallenge.prizes.map((prize, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {i === 0 ? (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        ) : i === 1 ? (
                          <Medal className="w-5 h-5 text-gray-300" />
                        ) : (
                          <Medal className="w-5 h-5 text-amber-600" />
                        )}
                        <span className="text-white">{prize}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-white/50 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1 py-2 bg-white/10 text-white rounded-xl"
                  >
                    Close
                  </motion.button>
                  {selectedChallenge.status !== "ended" && !selectedChallenge.isRegistered && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      <Rocket size={16} />
                      Register Now
                    </motion.button>
                  )}
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

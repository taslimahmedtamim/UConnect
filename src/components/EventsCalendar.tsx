import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, MapPin, Clock, ExternalLink, Check, Plus, Filter } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GlassCard from './GlassCard';
import AnimatedBackground from './AnimatedBackground';

interface EventsCalendarProps {
  onOpenAIMentor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const events = [
  {
    id: 1,
    title: 'Google Cloud Study Jam 2025',
    type: 'Workshop',
    date: 'Dec 5, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'BUET Campus, Dhaka',
    organizer: 'Google Developer Student Club',
    attendees: 247,
    maxAttendees: 300,
    isOnline: false,
    rsvped: true,
    gradient: 'from-blue-400 to-cyan-500',
    tags: ['Cloud', 'GCP', 'Workshop'],
  },
  {
    id: 2,
    title: 'Microsoft Engage Mentorship Program',
    type: 'Mentorship',
    date: 'Dec 8-10, 2024',
    time: '9:00 AM onwards',
    location: 'Virtual',
    organizer: 'Microsoft',
    attendees: 1240,
    maxAttendees: 1500,
    isOnline: true,
    rsvped: true,
    gradient: 'from-indigo-500 to-purple-500',
    tags: ['Mentorship', 'Career', 'Microsoft'],
  },
  {
    id: 3,
    title: 'Bangladesh National Hackathon',
    type: 'Hackathon',
    date: 'Dec 15-17, 2024',
    time: '48 hours',
    location: 'NSU Campus, Dhaka',
    organizer: 'BASIS & TechHub Bangladesh',
    attendees: 842,
    maxAttendees: 1000,
    isOnline: false,
    rsvped: false,
    gradient: 'from-orange-400 to-red-500',
    tags: ['Hackathon', 'Competition', '₹10L Prize'],
  },
  {
    id: 4,
    title: 'Placement Strategy Masterclass',
    type: 'Guest Lecture',
    date: 'Dec 12, 2024',
    time: '5:00 PM - 7:00 PM',
    location: 'Virtual',
    organizer: 'AlgoExpert (Ex-Google)',
    attendees: 3540,
    maxAttendees: 5000,
    isOnline: true,
    rsvped: false,
    gradient: 'from-emerald-400 to-teal-500',
    tags: ['Placement', 'Interview', 'DSA'],
  },
  {
    id: 5,
    title: 'Women in Tech Summit Bangladesh',
    type: 'Conference',
    date: 'Dec 20, 2024',
    time: '10:00 AM - 6:00 PM',
    location: 'Dhaka University Campus',
    organizer: 'Women in Tech BD',
    attendees: 567,
    maxAttendees: 800,
    isOnline: false,
    rsvped: false,
    gradient: 'from-pink-400 to-rose-500',
    tags: ['Diversity', 'Networking', 'Career'],
  },
  {
    id: 6,
    title: 'AWS Community Day Bangladesh',
    type: 'Conference',
    date: 'Jan 10, 2025',
    time: 'Full Day',
    location: 'Hybrid',
    organizer: 'AWS User Group BD',
    attendees: 876,
    maxAttendees: 1000,
    isOnline: true,
    rsvped: true,
    gradient: 'from-amber-400 to-orange-500',
    tags: ['AWS', 'Cloud', 'DevOps'],
  },
];

export default function EventsCalendar({ onOpenAIMentor, darkMode, onToggleDarkMode }: EventsCalendarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'rsvped' | 'upcoming'>('all');
  const [rsvpedEvents, setRsvpedEvents] = useState(new Set(events.filter(e => e.rsvped).map(e => e.id)));

  const filteredEvents = events.filter(e => {
    if (filter === 'rsvped') return rsvpedEvents.has(e.id);
    if (filter === 'upcoming') return !rsvpedEvents.has(e.id);
    return true;
  });

  const toggleRSVP = (eventId: number) => {
    const newSet = new Set(rsvpedEvents);
    if (newSet.has(eventId)) {
      newSet.delete(eventId);
    } else {
      newSet.add(eventId);
    }
    setRsvpedEvents(newSet);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex relative`}>
      <AnimatedBackground darkMode={darkMode} />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} relative z-10`}>
        <TopBar onOpenAIMentor={onOpenAIMentor} />
        
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Calendar className="w-12 h-12 text-indigo-500" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0"
                  >
                    <Calendar className="w-12 h-12 text-indigo-400 blur-md" />
                  </motion.div>
                </div>
                <div>
                  <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-4xl`} style={{ letterSpacing: '-0.02em' }}>
                    Events Calendar
                  </h1>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Hackathons, workshops & placement drives • {rsvpedEvents.size} RSVPs
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-black flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </motion.button>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <GlassCard className="p-4">
              <div className="flex gap-3">
                {[
                  { key: 'all', label: 'All Events', count: events.length },
                  { key: 'rsvped', label: 'My RSVPs', count: rsvpedEvents.size },
                  { key: 'upcoming', label: 'Discover', count: events.length - rsvpedEvents.size },
                ].map((f) => (
                  <motion.button
                    key={f.key}
                    onClick={() => setFilter(f.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-black ${
                      filter === f.key
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                        : `${darkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200`
                    }`}
                  >
                    {f.label} ({f.count})
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 h-full" glowColor={event.gradient.split(' ')[1]}>
                  {/* Event Type Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${event.gradient} text-white font-black text-sm`}>
                      {event.type}
                    </div>
                    {event.isOnline && (
                      <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} text-emerald-600 font-black text-sm`}>
                        🌐 Online
                      </div>
                    )}
                  </div>

                  {/* Event Title */}
                  <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'} font-black text-xl mb-3`}>
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} font-black`}>
                        {event.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {event.attendees.toLocaleString()} / {event.maxAttendees.toLocaleString()} attending
                      </span>
                    </div>
                  </div>

                  {/* Attendees Progress */}
                  <div className="mb-4">
                    <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${event.gradient}`}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-lg text-xs font-black ${
                          darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Organizer */}
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                    Organized by <span className="font-black text-indigo-600">{event.organizer}</span>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleRSVP(event.id)}
                      className={`flex-1 px-4 py-3 rounded-xl font-black transition-all ${
                        rsvpedEvents.has(event.id)
                          ? `bg-gradient-to-r ${event.gradient} text-white shadow-lg`
                          : `${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`
                      }`}
                    >
                      {rsvpedEvents.has(event.id) ? (
                        <>
                          <Check className="w-4 h-4 inline mr-2" />
                          RSVP'd
                        </>
                      ) : (
                        'RSVP Now'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-3 rounded-xl ${
                        darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
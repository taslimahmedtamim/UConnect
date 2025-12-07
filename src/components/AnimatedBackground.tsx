import { useMemo } from 'react';
import { motion } from 'motion/react';

export default function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  // Memoize particle properties to prevent regeneration on every render
  const particles = useMemo(() => 
    [...Array(10)].map((_, i) => ({
      id: i,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      borderRadius: Math.random() > 0.5 ? '50%' : '20%',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      yOffset: Math.random() * 100 - 50,
      xOffset: Math.random() * 100 - 50,
      rotation: Math.random() * 360,
      scale: Math.random() + 0.5,
      duration: Math.random() * 20 + 10,
    }))
  , []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] animated-grain"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Floating geometric particles - reduced count and memoized */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${darkMode ? 'bg-indigo-400/5' : 'bg-indigo-600/5'} backdrop-blur-sm will-change-transform`}
          style={{
            width: particle.width,
            height: particle.height,
            borderRadius: particle.borderRadius,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, particle.yOffset],
            x: [0, particle.xOffset],
            rotate: [0, particle.rotation],
            scale: [1, particle.scale, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />
    </div>
  );
}

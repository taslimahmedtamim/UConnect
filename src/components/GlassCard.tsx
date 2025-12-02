import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover3D?: boolean;
}

export default function GlassCard({ children, className = '', glowColor = '#6366F1', hover3D = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover3D ? { 
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: { type: 'spring', stiffness: 300 }
      } : {}}
      className={`relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-xl ${className}`}
      style={{
        boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.18), 0 0 20px ${glowColor}15`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColor}20 0%, transparent 100%)`
        }}
      />
      {children}
    </motion.div>
  );
}

import { useEffect } from 'react';
import { motion } from 'motion/react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export default function Confetti({ active, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (active && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  const confettiPieces = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: [
      '#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
      '#EF4444', '#3B82F6', '#14B8A6', '#F97316', '#A855F7'
    ][Math.floor(Math.random() * 10)],
    rotation: Math.random() * 360,
    scale: 0.3 + Math.random() * 0.7,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${piece.left}%`,
            top: '-5%',
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [1, 1, 0],
            rotate: [piece.rotation, piece.rotation + 720],
            x: [0, Math.sin(piece.id) * 100],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { Confetti } from "./Confetti";
import { FireworksCanvas } from "./FireworksCanvas";

interface FinaleSceneProps {
  onComplete: () => void;
  confettiCount?: number;
  fireworksIntensity?: number;
}

/** Massive finale after all candles blown */
export function FinaleScene({
  onComplete,
  confettiCount = 150,
  fireworksIntensity = 1.5,
}: FinaleSceneProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FireworksCanvas active intensity={fireworksIntensity} />
      <Confetti active count={confettiCount} />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[55] flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        <motion.h1
          className="font-display text-glow text-center text-4xl text-moon sm:text-5xl md:text-6xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Happy Midnight Event! ✨
        </motion.h1>
      </motion.div>

      <motion.button
        type="button"
        onClick={onComplete}
        className="glass-card absolute bottom-[max(2rem,env(safe-area-inset-bottom,0px))] left-1/2 z-[56] min-h-11 -translate-x-1/2 rounded-full px-8 py-3 text-sm tracking-widest text-silver/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
      >
        keep going →
      </motion.button>
    </motion.div>
  );
}

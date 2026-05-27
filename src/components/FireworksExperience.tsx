import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FireworksCanvas } from "./FireworksCanvas";

const EMOTIONAL_LINES = [
  "Some events get a simple announcement.",
  "This one opens with a full digital fireworks sequence.",
  "Perfect for launches, milestones, and celebrations.",
  "Replace these lines to match your event tone.",
  "Then share your personalized midnight experience.",
];

interface FireworksExperienceProps {
  onCalmDown: () => void;
}

/** Main fireworks scene — fades in after sky pan (no second slide-up) */
export function FireworksExperience({ onCalmDown }: FireworksExperienceProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [intensity, setIntensity] = useState(0.15);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 200);
    const t2 = setTimeout(() => setIntensity(0.6), 800);
    const t3 = setTimeout(() => setIntensity(1), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (lineIndex >= EMOTIONAL_LINES.length) {
      const calm = setTimeout(() => {
        setIntensity(0.2);
        setTimeout(onCalmDown, 4500);
      }, 3500);
      return () => clearTimeout(calm);
    }

    const timer = setTimeout(() => {
      setLineIndex((i) => i + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [lineIndex, onCalmDown]);

  return (
    <motion.div
      className="fixed inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.3 }}
        className="absolute inset-0"
      >
        <FireworksCanvas active={ready} intensity={intensity} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[22%] z-30 flex justify-center px-6 sm:top-1/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        <AnimatePresence mode="wait">
          {lineIndex < EMOTIONAL_LINES.length && (
            <motion.p
              key={lineIndex}
              className="font-display max-w-md text-center text-xl text-moon/90 sm:text-2xl md:text-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {EMOTIONAL_LINES[lineIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

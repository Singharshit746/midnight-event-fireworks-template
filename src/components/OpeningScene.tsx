import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { Starfield } from "./Starfield";

const LINES = [
  {
    text: "Welcome to this midnight celebration experience.",
    pauseAfter: 2200,
  },
  {
    text: "Built with fireworks, ambience, and a cinematic night-sky vibe.",
    pauseAfter: 2800,
  },
  { text: "Everything here is customizable.", pauseAfter: 2400 },
  { text: "Tap continue to begin.", pauseAfter: 1200 },
];

interface OpeningSceneProps {
  onContinue: () => void;
  exiting?: boolean;
}

/** Dark opening — lines stack as they complete so nothing gets cut off */
export function OpeningScene({
  onContinue,
  exiting = false,
}: OpeningSceneProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [showContinue, setShowContinue] = useState(false);

  const currentLine = LINES[lineIndex];
  const isLastLine = lineIndex >= LINES.length - 1;
  const { displayed, done } = useTypingEffect(
    currentLine?.text ?? "",
    !exiting && lineIndex < LINES.length,
    32,
  );

  // Advance to next line after typing + pause
  useEffect(() => {
    if (!done || exiting || lineIndex >= LINES.length) return;

    const pause = currentLine.pauseAfter;
    const timer = setTimeout(() => {
      if (!isLastLine) {
        setCompletedLines((prev) => [...prev, currentLine.text]);
        setLineIndex((i) => i + 1);
      } else {
        // Last line stays in the active slot only — don't duplicate in completed stack
        setShowContinue(true);
      }
    }, pause);

    return () => clearTimeout(timer);
  }, [done, lineIndex, currentLine, isLastLine, exiting]);

  return (
    <motion.div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-5 sm:px-8 ${
        exiting ? "z-20 pointer-events-none bg-transparent" : "z-40 bg-midnight"
      }`}
      animate={
        exiting
          ? { opacity: 0, y: -80, filter: "blur(6px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Starfield density={100} />

      <motion.div
        className="relative z-10 flex w-full max-w-xl flex-col items-center justify-center"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Completed lines stay visible, softly faded */}
        <div className="mb-6 flex w-full flex-col items-center gap-4 text-center">
          <AnimatePresence>
            {completedLines.map((line, i) => (
              <motion.p
                key={`done-${i}-${line.slice(0, 12)}`}
                className="font-display w-full text-lg leading-relaxed text-moon/25 sm:text-xl md:text-2xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {line}
              </motion.p>
            ))}
          </AnimatePresence>

          {/* Current line being typed */}
          {lineIndex < LINES.length && (
            <motion.p
              key={`typing-${lineIndex}`}
              className="font-display w-full text-xl leading-relaxed text-moon sm:text-2xl md:text-3xl lg:text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {displayed}
              {!done && (
                <motion.span
                  className="ml-0.5 inline-block h-[0.9em] w-0.5 translate-y-px bg-soft-pink align-middle"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
              )}
            </motion.p>
          )}
        </div>

        <AnimatePresence>
          {showContinue && !exiting && (
            <motion.button
              type="button"
              onClick={onContinue}
              className="glow-button font-body mt-4 rounded-full px-10 py-4 text-sm font-medium tracking-widest text-midnight uppercase"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {!exiting && (
        <motion.p
          className="absolute bottom-8 text-center text-xs tracking-widest text-silver/30"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {showContinue ? "when ready, continue ✨" : ""}
        </motion.p>
      )}
    </motion.div>
  );
}

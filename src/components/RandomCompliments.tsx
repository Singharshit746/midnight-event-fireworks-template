import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COMPLIMENTS = [
  "your event energy is unmatched",
  "this night was crafted with care",
  "celebrations are better under the stars",
  "you made this moment unforgettable",
  "the sky feels brighter tonight",
  "more milestones are waiting ahead",
  "you deserve every firework",
];

/** Soft compliments appearing in corners */
export function RandomCompliments({ active }: { active: boolean }) {
  const [current, setCurrent] = useState<{
    text: string;
    corner: string;
  } | null>(null);

  useEffect(() => {
    if (!active) return;

    const show = () => {
      const text = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
      const corners = [
        "top-[max(5.5rem,env(safe-area-inset-top,0px))] left-[max(1rem,env(safe-area-inset-left,0px))]",
        "top-[max(5.5rem,env(safe-area-inset-top,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]",
        "bottom-[max(8rem,env(safe-area-inset-bottom,0px))] left-[max(1rem,env(safe-area-inset-left,0px))]",
        "bottom-[max(8rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]",
      ];
      const corner = corners[Math.floor(Math.random() * corners.length)];
      setCurrent({ text, corner });
      setTimeout(() => setCurrent(null), 4000);
    };

    const interval = setInterval(show, 12000);
    const first = setTimeout(show, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(first);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {current && (
        <motion.p
          key={current.text + current.corner}
          className={`font-display pointer-events-none fixed z-40 max-w-[min(11rem,42vw)] text-sm leading-snug italic text-moon/85 sm:text-base ${current.corner}`}
          style={{
            textShadow:
              "0 0 20px rgba(244, 165, 196, 0.55), 0 2px 12px rgba(0, 0, 0, 0.85)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {current.text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Brief rain-to-clear-sky transition before fireworks */
export function RainTransition({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"rain" | "clearing" | "done">("rain");
  const [rainDrops] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: (i / 40) * 100,
      duration: 0.6 + Math.random() * 0.4,
      delay: Math.random() * 2,
    })),
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("clearing"), 2000);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[35] pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "clearing" ? 0 : 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Rain streaks */}
      {rainDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px bg-silver/20"
          style={{
            left: `${drop.left}%`,
            height: "60px",
            top: "-60px",
          }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
}

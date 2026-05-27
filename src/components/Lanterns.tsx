import { motion } from "framer-motion";

const LANTERNS = [
  { left: "8%", delay: 0, duration: 18 },
  { left: "25%", delay: 3, duration: 22 },
  { left: "70%", delay: 1.5, duration: 20 },
  { left: "88%", delay: 5, duration: 24 },
];

/** Floating paper lanterns in the night sky */
export function Lanterns() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      {LANTERNS.map((l, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{ left: l.left }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 0.7, 0.7, 0],
            x: [0, 15, -10, 5, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="relative">
            <div
              className="h-8 w-6 rounded-sm sm:h-10 sm:w-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,165,196,0.9) 0%, rgba(192,132,252,0.7) 100%)",
                boxShadow: "0 0 20px rgba(244, 165, 196, 0.5)",
              }}
            />
            <motion.div
              className="absolute -bottom-1 left-1/2 h-3 w-px -translate-x-1/2 bg-amber-200/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

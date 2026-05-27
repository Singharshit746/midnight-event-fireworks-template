import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Real-time clock — highlights when it's midnight */
export function MidnightClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const isMidnight = hours === 0 || hours === 24;

  return (
    <motion.div
      className="fixed top-4 left-4 z-50 font-mono text-xs tracking-widest"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <span
        className={isMidnight ? "text-soft-pink text-glow" : "text-silver/40"}
      >
        {hours.toString().padStart(2, "0")}:{minutes}
      </span>
      {isMidnight && (
        <motion.span
          className="ml-2 text-soft-pink/80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          it's midnight ✨
        </motion.span>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Starfield } from "./Starfield";

interface SkyPanTransitionProps {
  onComplete: () => void;
}

/**
 * Cinematic upward pan from ground-level darkness into the night sky.
 * Runs after opening — replaces the abrupt rain + slide-in fireworks.
 */
export function SkyPanTransition({ onComplete }: SkyPanTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[38] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* Sky layers — move upward on pan */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: "35%" }}
        animate={{ y: "-8%" }}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #020208 0%, #0a0a1a 35%, #0f1729 65%, #1a1033 100%)",
          }}
        />
        <Starfield density={160} />
      </motion.div>

      {/* Horizon glow — rises into view */}
      <motion.div
        className="absolute left-0 right-0 h-[45vh]"
        style={{
          bottom: 0,
          background:
            "linear-gradient(0deg, rgba(10,10,26,1) 0%, rgba(26,16,51,0.5) 40%, transparent 100%)",
        }}
        initial={{ y: "20%" }}
        animate={{ y: "-15%" }}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Ground / house silhouette — falls away below frame */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 0 }}
        animate={{ y: "110%" }}
        transition={{ duration: 4.2, ease: [0.45, 0, 0.55, 1] }}
      >
        <div className="relative h-[42vh] w-full">
          {/* Street / ground */}
          <motion.div
            className="absolute bottom-0 h-24 w-full"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, #0a0a14 60%, #050508 100%)",
            }}
          />
          {/* Simple house silhouette */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.5, delay: 1.5 }}
          >
            <div className="relative">
              {/* Roof */}
              <motion.div
                className="mx-auto h-0 w-0"
                style={{
                  borderLeft: "70px solid transparent",
                  borderRight: "70px solid transparent",
                  borderBottom: "45px solid #1e1e2e",
                }}
              />
              {/* Body */}
              <div
                className="mx-auto h-20 w-36 rounded-sm"
                style={{
                  background:
                    "linear-gradient(180deg, #252538 0%, #14141f 100%)",
                  boxShadow: "0 0 40px rgba(244, 165, 196, 0.08)",
                }}
              >
                {/* Warm window */}
                <motion.div
                  className="absolute top-6 left-1/2 h-8 w-10 -translate-x-1/2 rounded-sm"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(251, 191, 36, 0.1) 100%)",
                    boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
                  }}
                  animate={{ opacity: [0.6, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Moon — drifts into view */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ top: "12%", right: "14%" }}
        initial={{ opacity: 0, y: 80, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 3.5, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="relative h-14 w-14 rounded-full sm:h-16 sm:w-16 md:h-20 md:w-20"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #f8fafc 0%, #e2e8f0 50%, #94a3b8 100%)",
            boxShadow: "0 0 50px rgba(232, 238, 248, 0.35)",
          }}
        />
      </motion.div>

      {/* Vignette clears as we rise */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,0.7) 0%, transparent 70%)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 3.5, delay: 1 }}
      />

      {/* Subtle "rising" copy */}
      <motion.p
        className="font-display pointer-events-none absolute inset-x-0 top-[28%] z-10 text-center text-lg text-moon/30 italic sm:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0.7, 0], y: [20, 0, -10] }}
        transition={{ duration: 3, delay: 2.2, ease: "easeInOut" }}
      >
        look up…
      </motion.p>

      {/* Final sky bloom before fireworks */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 4.2 }}
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 20%, rgba(26, 16, 51, 0.4) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

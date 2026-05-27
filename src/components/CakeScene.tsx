import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const CANDLE_COUNT = 5;

interface CakeSceneProps {
  onAllBlown: () => void;
}

/** Glowing celebration cake — tap candles to blow out */
export function CakeScene({ onAllBlown }: CakeSceneProps) {
  const [lit, setLit] = useState<boolean[]>(Array(CANDLE_COUNT).fill(true));
  const allOut = lit.every((c) => !c);

  const blowCandle = (index: number) => {
    if (!lit[index]) return;
    const next = [...lit];
    next[index] = false;
    setLit(next);
    if (navigator.vibrate) navigator.vibrate(12);

    if (next.every((c) => !c)) {
      setTimeout(onAllBlown, 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-end bg-gradient-to-t from-midnight via-navy/90 to-transparent pb-16 sm:pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="font-display mb-8 text-center text-lg text-silver/70 italic sm:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2 }}
      >
        make a wish... tap each candle to blow it out
      </motion.p>

      <motion.div
        className="relative"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute -inset-8 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(244,165,196,0.3) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div className="relative z-10 mb-2 flex justify-center gap-3 sm:gap-4">
          {lit.map((isLit, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => blowCandle(i)}
              className="flex flex-col items-center focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label={`Candle ${i + 1}${isLit ? ", lit" : ", blown out"}`}
            >
              <AnimatePresence>
                {isLit && (
                  <motion.div
                    className="relative mb-1"
                    exit={{ opacity: 0, scale: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="h-6 w-3 rounded-full sm:h-8 sm:w-4"
                      style={{
                        background:
                          "radial-gradient(ellipse at bottom, #fbbf24 0%, #fb923c 50%, transparent 100%)",
                        boxShadow: "0 0 12px rgba(251, 191, 36, 0.8)",
                      }}
                      animate={{
                        scaleY: [1, 1.15, 0.95, 1],
                        scaleX: [1, 0.9, 1.05, 1],
                      }}
                      transition={{
                        duration: 0.8 + i * 0.1,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                className="w-1.5 rounded-sm sm:w-2"
                style={{
                  height: isLit ? 28 : 32,
                  background: isLit
                    ? "linear-gradient(180deg, #fef3c7 0%, #f4a5c4 100%)"
                    : "linear-gradient(180deg, #94a3b8 0%, #f4a5c4 80%)",
                }}
                layout
                transition={{ duration: 0.35 }}
              />
            </motion.button>
          ))}
        </motion.div>

        <div className="relative">
          <div
            className="mx-auto h-6 w-36 rounded-t-lg sm:h-8 sm:w-44"
            style={{
              background:
                "linear-gradient(180deg, #fce7f3 0%, #f4a5c4 50%, #c084fc 100%)",
              boxShadow: "0 -4px 20px rgba(244, 165, 196, 0.4)",
            }}
          />
          <motion.div
            className="mx-auto h-10 w-44 rounded-lg sm:h-12 sm:w-52"
            style={{
              background:
                "linear-gradient(180deg, #fdf4ff 0%, #e9d5ff 40%, #c084fc 100%)",
              boxShadow:
                "0 8px 32px rgba(192, 132, 252, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            }}
            animate={allOut ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="mx-auto -mt-1 h-2 w-52 rounded-full sm:w-60"
            style={{
              background: "linear-gradient(90deg, #475569, #94a3b8, #475569)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

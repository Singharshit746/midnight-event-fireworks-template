import { motion, useScroll, useTransform } from "framer-motion";

/** Parallax moon with soft glow */
export function Moon({ visible = true }: { visible?: boolean }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 60]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.4]);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-10"
      style={{
        top: "8%",
        right: "12%",
        y,
        opacity,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,238,248,0.25) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Moon body */}
        <div
          className="relative h-16 w-16 rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #f8fafc 0%, #e2e8f0 40%, #94a3b8 100%)",
            boxShadow:
              "0 0 40px rgba(232, 238, 248, 0.4), inset -8px -4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Craters */}
          <motion.div className="absolute top-3 left-4 h-2 w-2 rounded-full bg-slate-300/40" />
          <motion.div className="absolute top-7 right-5 h-3 w-3 rounded-full bg-slate-400/30" />
          <motion.div className="absolute bottom-4 left-6 h-1.5 w-1.5 rounded-full bg-slate-300/35" />
        </div>
      </motion.div>
    </motion.div>
  );
}

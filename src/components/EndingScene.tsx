import { motion } from "framer-motion";

/** Final emotional message as experience closes */
export function EndingScene() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
      >
        <motion.p
          className="font-display mb-8 text-2xl text-moon/80 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.5 }}
        >
          Thanks for being part of this midnight celebration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 1.5 }}
        >
          <p className="font-display text-glow text-3xl text-soft-pink sm:text-4xl md:text-5xl">
            See you at the next event
          </p>
          <motion.p
            className="font-display mt-4 text-2xl text-moon sm:text-3xl"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Customize this ending message
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className="text-soft-pink/60"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              ✦
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

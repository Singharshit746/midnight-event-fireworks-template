import { motion } from "framer-motion";

const MOMENTS = [
  {
    emoji: "🌙",
    title: "Night launch moments",
    desc: "counting down together before reveal",
  },
  {
    emoji: "☕",
    title: "Team planning sessions",
    desc: "ideas, checklists, and one more coffee",
  },
  {
    emoji: "🌃",
    title: "City skyline reveals",
    desc: "watching the sky light up in sync",
  },
  {
    emoji: "😂",
    title: "Behind-the-scenes fun",
    desc: "the small moments that make it memorable",
  },
  {
    emoji: "🎧",
    title: "Curated soundtracks",
    desc: "the right music for every scene",
  },
  {
    emoji: "🎆",
    title: "Finale under fireworks",
    desc: "an ending worth replaying",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

/** Moments card grid section */
export function MomentsSection() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-xs tracking-[0.3em] text-soft-pink/60 uppercase">
          event highlights
        </p>
        <h2 className="font-display text-3xl text-moon sm:text-4xl md:text-5xl">
          Moments from This Midnight Event
        </h2>
      </motion.div>

      <motion.div
        className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {MOMENTS.map((m) => (
          <motion.article
            key={m.title}
            variants={item}
            className="glass-card group relative overflow-hidden rounded-2xl p-6 transition hover:border-soft-pink/30"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(244,165,196,0.1) 0%, transparent 60%)",
              }}
            />
            <span className="mb-4 block text-3xl">{m.emoji}</span>
            <h3 className="font-display mb-2 text-xl text-moon">{m.title}</h3>
            <p className="text-sm leading-relaxed text-silver/60">{m.desc}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

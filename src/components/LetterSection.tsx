import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const LETTER = `Welcome to the midnight-event-fireworks template.

Use this letter block for your event announcement, dedication, or keynote message.

Replace each paragraph with your own text to match your audience and occasion.

You can also edit typography, spacing, and animations in this component.`;

/** Glassmorphism letter with floating particles */
export function LetterSection() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const particles = Array.from({ length: 20 }, () => {
      const el = document.createElement("div");
      el.className = "absolute h-1 w-1 rounded-full bg-soft-pink/40";
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      container.appendChild(el);
      return { el, x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    });

    let raf: number;
    const animate = () => {
      for (const p of particles) {
        const left = parseFloat(p.el.style.left) + p.x * 0.05;
        const top = parseFloat(p.el.style.top) + p.y * 0.05;
        p.el.style.left = `${((left % 100) + 100) % 100}%`;
        p.el.style.top = `${((top % 100) + 100) % 100}%`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <motion.div
        className="relative mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2 }}
      >
        <div
          ref={particlesRef}
          className="pointer-events-none absolute -inset-8 overflow-hidden rounded-3xl"
          aria-hidden
        />

        <div className="glass-card relative rounded-3xl p-8 sm:p-12">
          <p className="mb-6 text-xs tracking-[0.3em] text-soft-pink/60 uppercase">
            template note
          </p>
          <div className="font-display space-y-5 text-lg leading-relaxed text-moon/90 sm:text-xl">
            {LETTER.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

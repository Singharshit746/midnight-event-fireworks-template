import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/** Hidden easter egg button */
export function SecretMessage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-card fixed bottom-4 left-4 z-50 rounded-full px-4 py-2 text-xs text-silver/60 transition hover:text-soft-pink"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
      >
        ✨ Secret Message
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="glass-card max-w-sm rounded-2xl p-8 text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display text-xl leading-relaxed text-moon italic">
                "Template tip: replace this secret note with a fun
                behind-the-scenes message for your audience."
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 text-sm text-soft-pink/80 hover:text-soft-pink"
              >
                close ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

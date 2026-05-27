import { motion } from "framer-motion";
import { useState } from "react";
import { audioManager } from "../lib/audioManager";

interface SoundToggleProps {
  onStartAudio: () => void;
}

/** Ambience + music toggle controls */
export function SoundToggle({ onStartAudio }: SoundToggleProps) {
  const [ambienceOn, setAmbienceOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  const toggleAmbience = () => {
    if (!ambienceOn) onStartAudio();
    const next = !ambienceOn;
    setAmbienceOn(next);
    audioManager.setAmbience(next);
  };

  const toggleMusic = () => {
    if (!musicOn) onStartAudio();
    const next = !musicOn;
    setMusicOn(next);
    audioManager.setMusic(next);
  };

  return (
    <motion.div
      className="safe-top-right fixed z-50 flex gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <button
        type="button"
        onClick={toggleAmbience}
        className="glass-card rounded-full px-3 py-2 text-xs text-silver/80 transition hover:text-soft-pink"
        aria-label="Toggle night ambience"
      >
        {ambienceOn ? "🌙 Sound on" : "🌙 Sound off"}
      </button>
      <button
        type="button"
        onClick={toggleMusic}
        className="glass-card rounded-full px-3 py-2 text-xs text-silver/80 transition hover:text-soft-pink"
        aria-label="Toggle music"
      >
        {musicOn ? "🎵 Music on" : "🎵 Music off"}
      </button>
    </motion.div>
  );
}

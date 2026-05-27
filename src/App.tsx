import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CakeScene } from "./components/CakeScene";
import { ConstellationTrail } from "./components/ConstellationTrail";
import { EndingScene } from "./components/EndingScene";
import { FinaleScene } from "./components/FinaleScene";
import { FireworksExperience } from "./components/FireworksExperience";
import { Lanterns } from "./components/Lanterns";
import { LetterSection } from "./components/LetterSection";
import { MidnightClock } from "./components/MidnightClock";
import { MomentsSection } from "./components/MomentsSection";
import { Moon } from "./components/Moon";
import { MouseStars } from "./components/MouseStars";
import { OpeningScene } from "./components/OpeningScene";
import { RandomCompliments } from "./components/RandomCompliments";
import { SecretMessage } from "./components/SecretMessage";
import { SkyPanTransition } from "./components/SkyPanTransition";
import { SoundToggle } from "./components/SoundToggle";
import { Starfield } from "./components/Starfield";
import { useDeviceProfile } from "./hooks/useDeviceProfile";
import { audioManager } from "./lib/audioManager";
import type { Scene } from "./types";

/**
 * Midnight Event Fireworks Template
 * Scene flow: opening → pan to sky → fireworks → cake → finale → epilogue
 */
export default function App() {
  const [scene, setScene] = useState<Scene>("opening");
  const [audioStarted, setAudioStarted] = useState(false);
  const device = useDeviceProfile();

  useEffect(() => {
    audioManager.prepare();
  }, []);

  const startAudio = useCallback(() => {
    audioManager.playFromUserGesture();
    setAudioStarted(true);
  }, []);

  const handleContinue = () => {
    startAudio();
    setScene("pan");
  };

  const handlePanComplete = () => setScene("fireworks");

  const handleFireworksCalm = () => setScene("cake");

  const handleAllCandlesBlown = () => setScene("finale");

  const handleFinaleComplete = () => {
    void audioManager.ensurePlayback();
    setScene("epilogue");
  };

  useEffect(() => {
    if (!audioStarted) return;
    if (
      scene === "cake" ||
      scene === "finale" ||
      scene === "epilogue" ||
      scene === "fireworks"
    ) {
      void audioManager.ensurePlayback();
    }
  }, [scene, audioStarted]);

  const isPanning = scene === "pan";
  const showOpening = scene === "opening" || isPanning;
  const showAmbient =
    scene === "pan" ||
    scene === "fireworks" ||
    scene === "cake" ||
    scene === "finale" ||
    scene === "epilogue";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-midnight">
      {/* Persistent starfield — hidden during pure opening, visible once pan starts */}
      <motion.div
        className="fixed inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: scene === "opening" ? 0 : 1,
        }}
        transition={{ duration: isPanning ? 3 : 1.5, ease: "easeInOut" }}
      >
        <Starfield density={device.starDensity} />
      </motion.div>

      {showAmbient && scene !== "pan" && (
        <>
          <Moon visible={scene !== "finale"} />
          <Lanterns />
          {device.enablePointerEffects && (
            <>
              <MouseStars />
              <ConstellationTrail />
            </>
          )}
        </>
      )}

      <MidnightClock />
      <SoundToggle onStartAudio={startAudio} />
      <SecretMessage />
      <RandomCompliments active={showAmbient && scene !== "pan"} />

      {/* Opening — stays mounted during pan so text can fade out smoothly */}
      <AnimatePresence>
        {showOpening && (
          <OpeningScene
            key="opening"
            onContinue={handleContinue}
            exiting={isPanning}
          />
        )}
      </AnimatePresence>

      {/* Cinematic pan into the night sky */}
      <AnimatePresence>
        {isPanning && (
          <SkyPanTransition key="pan" onComplete={handlePanComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene === "fireworks" && (
          <FireworksExperience
            key="fireworks"
            onCalmDown={handleFireworksCalm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene === "cake" && (
          <CakeScene key="cake" onAllBlown={handleAllCandlesBlown} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene === "finale" && (
          <FinaleScene
            key="finale"
            onComplete={handleFinaleComplete}
            confettiCount={device.confettiCount}
            fireworksIntensity={device.finaleFireworksIntensity}
          />
        )}
      </AnimatePresence>

      {scene === "epilogue" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <MomentsSection />
          <LetterSection />
          <EndingScene />
        </motion.div>
      )}
    </div>
  );
}

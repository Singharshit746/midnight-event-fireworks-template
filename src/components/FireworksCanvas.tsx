import { useEffect, useRef } from "react";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { audioManager } from "../lib/audioManager";
import { FireworksEngine } from "../lib/fireworksEngine";

interface FireworksCanvasProps {
  active: boolean;
  intensity?: number;
  onBeat?: () => void;
}

/** Full-screen canvas fireworks driven by the engine auto-launch loop */
export function FireworksCanvas({
  active,
  intensity = 1,
  onBeat,
}: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FireworksEngine | null>(null);
  const device = useDeviceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const engine = new FireworksEngine(canvas, {
      lowQuality: device.isMobile,
      onBeat: () => {
        onBeat?.();
        if (Math.random() > 0.5) engine.autoLaunch();
      },
    });
    engineRef.current = engine;
    engine.start();

    const unsub = audioManager.onBeat(() => {
      if (Math.random() > 0.6) engine.autoLaunch();
    });

    return () => {
      unsub();
      engine.destroy();
      engineRef.current = null;
    };
  }, [active, onBeat, device.isMobile]);

  useEffect(() => {
    engineRef.current?.setIntensity(intensity);
  }, [intensity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden
    />
  );
}

import { useEffect, useState } from "react";
import { getDeviceProfile, type DeviceProfile } from "../lib/device";

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() =>
    typeof window !== "undefined"
      ? getDeviceProfile()
      : {
          isMobile: false,
          isIOS: false,
          starDensity: 120,
          confettiCount: 150,
          finaleFireworksIntensity: 1.5,
          enablePointerEffects: true,
          prefersReducedMotion: false,
        },
  );

  useEffect(() => {
    const update = () => setProfile(getDeviceProfile());
    update();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layout = window.matchMedia("(max-width: 640px)");
    motion.addEventListener("change", update);
    layout.addEventListener("change", update);
    window.addEventListener("orientationchange", update);

    return () => {
      motion.removeEventListener("change", update);
      layout.removeEventListener("change", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return profile;
}

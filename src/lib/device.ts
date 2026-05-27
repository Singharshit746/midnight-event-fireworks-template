export interface DeviceProfile {
  isMobile: boolean;
  isIOS: boolean;
  starDensity: number;
  confettiCount: number;
  finaleFireworksIntensity: number;
  enablePointerEffects: boolean;
  prefersReducedMotion: boolean;
}

export function getDeviceProfile(): DeviceProfile {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isNarrow = window.matchMedia("(max-width: 640px)").matches;
  const isIOS =
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMobile = isCoarse || isNarrow || isIOS;

  return {
    isMobile,
    isIOS,
    starDensity: isMobile ? 55 : 120,
    confettiCount: isMobile ? 55 : 150,
    finaleFireworksIntensity: isMobile ? 1 : 1.5,
    enablePointerEffects: !isMobile && !prefersReducedMotion,
    prefersReducedMotion,
  };
}

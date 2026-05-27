import { useEffect, useRef, useState } from "react";

/** Typewriter effect — resets cleanly when text changes */
export function useTypingEffect(
  text: string,
  active: boolean,
  speed = 36,
  startDelay = 0,
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;

    if (!active || !text) {
      const reset = setTimeout(() => {
        setDisplayed("");
        setDone(false);
      }, 0);
      return () => clearTimeout(reset);
    }

    let i = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled || textRef.current !== text) return;

      if (i < text.length) {
        i++;
        setDisplayed(text.slice(0, i));
        timeout = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    const start = setTimeout(() => {
      setDisplayed("");
      setDone(false);
      tick();
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(start);
      if (timeout) clearTimeout(timeout);
    };
  }, [text, active, speed, startDelay]);

  return { displayed, done };
}

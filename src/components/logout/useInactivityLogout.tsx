import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

export const useInactivityLogout = (
  enabled: boolean,
  handleAutoLogout: () => void
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(handleAutoLogout, INACTIVITY_LIMIT); 
  };

  useEffect(() => {
    if (!enabled) return;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [enabled]);
};

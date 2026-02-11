import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for the cryptographic text decoding animation.
 */
export const useScramble = (text, delay = 60) => {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const frameId = useRef(null);

  const trigger = useCallback(() => {
    const startTime = Date.now();
    
    const update = () => {
      const elapsed = Date.now() - startTime;
      const iteration = elapsed / delay;

      setDisplay(
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration < text.length) {
        frameId.current = requestAnimationFrame(update);
      }
    };

    frameId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId.current);
  }, [text, delay]);

  useEffect(() => {
    const cleanup = trigger();
    return cleanup;
  }, [trigger]);

  return { display, trigger };
};
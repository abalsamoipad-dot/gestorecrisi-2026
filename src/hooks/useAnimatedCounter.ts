import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Custom hook for animated number counting with cubic ease-out.
 * Starts counting when the element enters the viewport.
 * @param target - The target number to count up to.
 * @param duration - The duration of the animation in seconds (default 2.5).
 * @returns An object containing the ref (to attach to the element) and the current count.
 */
export function useAnimatedCounter(
  target: number,
  duration: number = 2.5
): { ref: (node?: Element | null) => void; count: number } {
  const [count, setCount] = useState<number>(0);
  const hasStarted = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Cubic ease-out: 1 - (1 - t)^3
  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  }, []);

  useEffect(() => {
    if (!inView || hasStarted.current) return;

    hasStarted.current = true;
    const durationMs = duration * 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);

      const currentCount = Math.round(easedProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        // Ensure we land exactly on target
        setCount(target);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [inView, target, duration, easeOutCubic]);

  return { ref, count };
}

export default useAnimatedCounter;

import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks the window's vertical scroll position.
 * Uses requestAnimationFrame for performance-optimized debouncing.
 * @returns The current window.scrollY value.
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    // Set initial value
    setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return scrollY;
}

export default useScrollPosition;

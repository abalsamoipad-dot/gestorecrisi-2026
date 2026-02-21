import { useState, useEffect } from 'react';

/**
 * Custom hook that wraps window.matchMedia to reactively track a CSS media query.
 * Handles SSR safety by defaulting to false when window is unavailable.
 * @param query - A CSS media query string (e.g., '(max-width: 768px)').
 * @returns Whether the media query currently matches.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    // SSR safety: window may not exist during server-side rendering
    if (typeof window === 'undefined') return false;
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value in case it changed between render and effect
    setMatches(mediaQueryList.matches);

    // Modern API: addEventListener (supported in all modern browsers)
    // Fallback: addListener for older browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Deprecated but needed for Safari < 14
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;

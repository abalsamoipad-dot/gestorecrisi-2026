import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that uses IntersectionObserver to track which section
 * is currently most visible in the viewport.
 * @param sectionIds - Array of section element IDs to observe.
 * @returns The ID of the currently active (most visible) section.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '');
  const visibilityMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.current.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleId = activeSection;

        visibilityMap.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleId = id;
          }
        });

        if (maxRatio > 0) {
          setActiveSection(mostVisibleId);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '0px',
      }
    );

    const elements: Element[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
    // We intentionally only run on mount/unmount since sectionIds is expected to be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')]);

  return activeSection;
}

export default useActiveSection;

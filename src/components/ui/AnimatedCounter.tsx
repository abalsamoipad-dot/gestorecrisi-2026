import type { CSSProperties } from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animated counting number display.
 * Counts up from 0 to the target number when it scrolls into view.
 */
export function AnimatedCounter({
  target,
  suffix = '',
  duration = 2.5,
  className,
}: AnimatedCounterProps) {
  const { ref, count } = useAnimatedCounter(target, duration);

  const style: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontWeight: 700,
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <span ref={ref} style={style} className={className} aria-label={`${target}${suffix}`}>
      {count}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;

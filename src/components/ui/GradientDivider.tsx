import type { CSSProperties } from 'react';

interface GradientDividerProps {
  className?: string;
}

/**
 * Animated gradient line divider.
 * Uses the footer-gradient keyframe animation from animations.css.
 */
export function GradientDivider({ className }: GradientDividerProps) {
  const style: CSSProperties = {
    height: '3px',
    width: '100%',
    border: 'none',
    background:
      'linear-gradient(90deg, #005f73, #48cae4, #90e0ef, #48cae4, #005f73)',
    backgroundSize: '300% 100%',
    animation: 'footer-gradient 6s linear infinite',
    borderRadius: '2px',
  };

  return <div style={style} className={className} role="separator" aria-hidden="true" />;
}

export default GradientDivider;

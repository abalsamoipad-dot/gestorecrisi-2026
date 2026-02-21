import { createElement, type ReactNode, type CSSProperties } from 'react';

interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  animate?: boolean;
  as?: 'span' | 'h1' | 'h2' | 'h3';
  className?: string;
}

const animationKeyframes = `
@keyframes textGradientShift {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}
`;

// Inject keyframes once
let injected = false;
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = animationKeyframes;
  document.head.appendChild(style);
  injected = true;
}

/**
 * Text component with a CSS gradient fill.
 * Optionally animates the gradient position with a shifting effect.
 */
export function GradientText({
  children,
  from = '#48cae4',
  to = '#90e0ef',
  animate = false,
  as = 'span',
  className,
}: GradientTextProps) {
  if (animate) injectKeyframes();

  const style: CSSProperties = {
    background: `linear-gradient(135deg, ${from}, ${to})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline',
    ...(animate
      ? {
          backgroundSize: '200% auto',
          animation: 'textGradientShift 4s ease infinite',
        }
      : {}),
  };

  return createElement(
    as,
    { style, className },
    children
  );
}

export default GradientText;

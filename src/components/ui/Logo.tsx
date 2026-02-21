import type { CSSProperties } from 'react';

interface LogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

const sizeMap = {
  sm: {
    fontSize: '1.1rem',
    dotSize: 5,
  },
  md: {
    fontSize: '1.4rem',
    dotSize: 6,
  },
} as const;

/**
 * Brand wordmark logo: "gestoredella" (normal) + "crisi.it" (bold, primary) + cyan dot.
 */
export function Logo({ size = 'md', className }: LogoProps) {
  const config = sizeMap[size];

  const wrapperStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: config.fontSize,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    textDecoration: 'none',
    userSelect: 'none',
  };

  const normalStyle: CSSProperties = {
    fontWeight: 400,
    color: 'var(--text-primary, #111827)',
  };

  const boldStyle: CSSProperties = {
    fontWeight: 700,
    color: 'var(--primary-700, #005f73)',
  };

  const dotStyle: CSSProperties = {
    display: 'inline-block',
    width: `${config.dotSize}px`,
    height: `${config.dotSize}px`,
    borderRadius: '50%',
    backgroundColor: 'var(--accent-400, #48cae4)',
    marginLeft: '2px',
    flexShrink: 0,
  };

  return (
    <span style={wrapperStyle} className={className} aria-label="gestoredellacrisi.it">
      <span style={normalStyle}>gestoredella</span>
      <span style={boldStyle}>crisi.it</span>
      <span style={dotStyle} aria-hidden="true" />
    </span>
  );
}

export default Logo;

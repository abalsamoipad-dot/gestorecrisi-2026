import type { CSSProperties } from 'react';
import { RevealOnScroll } from './RevealOnScroll';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  alignment?: 'center' | 'left';
  dark?: boolean;
}

/**
 * Section header component with kicker line, title, and optional subtitle.
 * Wrapped in RevealOnScroll for scroll-triggered animations.
 */
export function SectionHeader({
  kicker,
  title,
  subtitle,
  alignment = 'center',
  dark = false,
}: SectionHeaderProps) {
  const isCenter = alignment === 'center';

  const wrapperStyle: CSSProperties = {
    textAlign: isCenter ? 'center' : 'left',
    marginBottom: '48px',
    maxWidth: isCenter ? '680px' : 'none',
    marginLeft: isCenter ? 'auto' : undefined,
    marginRight: isCenter ? 'auto' : undefined,
  };

  const kickerWrapperStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    justifyContent: isCenter ? 'center' : 'flex-start',
    width: '100%',
  };

  const kickerTextStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: dark
      ? 'var(--accent-400, #48cae4)'
      : 'var(--primary-700, #005f73)',
    lineHeight: 1.2,
  };

  const kickerLineStyle: CSSProperties = {
    display: 'inline-block',
    width: '40px',
    height: '2px',
    backgroundColor: dark
      ? 'var(--accent-400, #48cae4)'
      : 'var(--primary-700, #005f73)',
    borderRadius: '1px',
    flexShrink: 0,
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: 'clamp(2rem, 5vw, 2.6rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    color: dark
      ? 'var(--text-on-dark, #f9fafb)'
      : 'var(--text-primary, #111827)',
    marginBottom: subtitle ? '16px' : '0',
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1.1rem',
    fontWeight: 400,
    lineHeight: 1.7,
    color: dark
      ? 'var(--text-muted-dark, rgba(255, 255, 255, 0.6))'
      : 'var(--text-secondary, #6b7280)',
    maxWidth: isCenter ? '560px' : 'none',
    marginLeft: isCenter ? 'auto' : undefined,
    marginRight: isCenter ? 'auto' : undefined,
  };

  return (
    <RevealOnScroll direction="up" duration={0.7}>
      <header style={wrapperStyle}>
        <div style={kickerWrapperStyle}>
          <span style={kickerLineStyle} aria-hidden="true" />
          <span style={kickerTextStyle}>{kicker}</span>
        </div>
        <h2 style={titleStyle}>{title}</h2>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </header>
    </RevealOnScroll>
  );
}

export default SectionHeader;

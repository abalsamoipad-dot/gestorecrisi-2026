import { useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { STATS_DATA } from '@/constants';

/**
 * Stats section with animated counters on a dark background with glassmorphism cards.
 * Features hover effects with glow, scale and border highlight.
 */
export function Stats() {
  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    position: 'relative',
    overflow: 'hidden',
    background: [
      'radial-gradient(ellipse at 20% 50%, rgba(0,95,115,0.4) 0%, transparent 50%)',
      'radial-gradient(ellipse at 80% 20%, rgba(72,202,228,0.15) 0%, transparent 40%)',
      'radial-gradient(ellipse at 60% 80%, rgba(0,95,115,0.2) 0%, transparent 45%)',
      'var(--gradient-dark, linear-gradient(180deg, #0a0f14 0%, #003340 100%))',
    ].join(', '),
  };

  // Responsive grid styles
  const responsiveId = 'stats-grid-responsive';

  return (
    <section id="stats" style={sectionStyle}>
      <style>{`
        #${responsiveId} {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          #${responsiveId} {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <Container>
        <SectionHeader
          kicker="I Nostri Numeri"
          title="Esperienza e risultati concreti"
          dark
        />
        <div id={responsiveId}>
          {STATS_DATA.map((stat, i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <StatCard
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Stat Card with hover ────────────────────────────────────────────────────

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
}

function StatCard({ value, suffix, label }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: CSSProperties = {
    background: isHovered
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: isHovered
      ? '1px solid rgba(72,202,228,0.35)'
      : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px 32px',
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: isHovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
    boxShadow: isHovered
      ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(72,202,228,0.12)'
      : '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'default',
  };

  const numberStyle: CSSProperties = {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: 700,
    color: isHovered ? 'var(--accent-400, #48cae4)' : '#fff',
    lineHeight: 1.1,
    display: 'block',
    transition: 'color 0.3s ease',
  };

  const labelStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
    marginTop: '8px',
    display: 'block',
    transition: 'color 0.3s ease',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={numberStyle}>
        <AnimatedCounter
          target={value}
          suffix={suffix}
        />
      </span>
      <span style={labelStyle}>{label}</span>
    </div>
  );
}

export default Stats;

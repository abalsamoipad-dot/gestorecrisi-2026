import { useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Card3D } from '@/components/ui/Card3D';
import { EXPERTISE_DATA } from '@/constants';

/**
 * Expertise section with 3 service cards in a responsive grid.
 * Each card uses Card3D for 3D tilt effects and RevealOnScroll for entrance animation.
 * Icons are placed inside uniform containers for visual consistency.
 */
export function Expertise() {
  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    background: 'var(--neutral-50, #f9fafb)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  };

  return (
    <section id="expertise" style={sectionStyle}>
      <Container>
        <SectionHeader
          kicker="Expertise Professionale"
          title="Soluzioni integrate per il risanamento"
          subtitle="Dalla diagnosi precoce degli squilibri alla gestione negoziale con i creditori, supportiamo l'imprenditore in ogni fase critica."
        />
        <div style={gridStyle}>
          {EXPERTISE_DATA.map((card, i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <ExpertiseCard iconPath={card.iconPath} title={card.title} description={card.description} />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Individual Card ──────────────────────────────────────────────────────────

interface ExpertiseCardInternalProps {
  iconPath: string;
  title: string;
  description: string;
}

function ExpertiseCard({ iconPath, title, description }: ExpertiseCardInternalProps) {
  const [isHovered, setIsHovered] = useState(false);

  const iconContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: isHovered
      ? 'linear-gradient(135deg, var(--primary-700, #005f73), var(--accent-400, #48cae4))'
      : 'rgba(0, 95, 115, 0.07)',
    marginBottom: '24px',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: isHovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0deg)',
    boxShadow: isHovered
      ? '0 8px 24px rgba(0, 95, 115, 0.2)'
      : '0 2px 8px rgba(0, 95, 115, 0.04)',
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.3rem',
    fontWeight: 700,
    lineHeight: 1.3,
    color: 'var(--text-primary, #111827)',
    marginBottom: '15px',
    transition: 'color 0.3s ease',
  };

  const descStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'var(--text-secondary, #6b7280)',
  };

  return (
    <Card3D>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={iconContainerStyle}>
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isHovered ? '#ffffff' : 'var(--primary-700, #005f73)'}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ transition: 'stroke 0.3s ease' }}
          >
            <path d={iconPath} />
          </svg>
        </div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={descStyle}>{description}</p>
      </div>
    </Card3D>
  );
}

export default Expertise;

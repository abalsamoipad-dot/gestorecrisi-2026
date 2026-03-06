import { useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { EXPERTISE_DATA } from '@/constants';

export function Expertise() {
  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    background: 'var(--neutral-50, #f9fafb)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
  };

  /* Responsive: stack on mobile */
  const responsiveCss = `
    @media (max-width: 768px) {
      .expertise-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <section id="expertise" style={sectionStyle}>
      <style>{responsiveCss}</style>
      <Container>
        <SectionHeader
          kicker="Expertise Professionale"
          title="Soluzioni integrate per il risanamento"
          subtitle="Dalla diagnosi precoce degli squilibri alla gestione negoziale con i creditori, supportiamo l'imprenditore in ogni fase critica."
        />
        <div className="expertise-grid" style={gridStyle}>
          {EXPERTISE_DATA.map((card, i) => (
            <RevealOnScroll key={i} delay={i * 0.12}>
              <ExpertiseCard
                iconPath={card.iconPath}
                title={card.title}
                description={card.description}
              />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}

interface ExpertiseCardInternalProps {
  iconPath: string;
  title: string;
  description: string;
}

function ExpertiseCard({ iconPath, title, description }: ExpertiseCardInternalProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '24px',
    padding: '32px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid rgba(0,95,115,0.08)',
    boxShadow: isHovered
      ? '0 16px 48px rgba(0,95,115,0.12), 0 0 0 1px rgba(72,202,228,0.2)'
      : '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    cursor: 'default',
  };

  const iconContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    minWidth: '72px',
    borderRadius: '18px',
    background: isHovered
      ? 'linear-gradient(135deg, var(--primary-700, #005f73), var(--accent-400, #48cae4))'
      : 'rgba(0, 95, 115, 0.06)',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 8px 24px rgba(0, 95, 115, 0.2)' : 'none',
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.3,
    color: 'var(--text-primary, #111827)',
    marginBottom: '10px',
  };

  const descStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'var(--text-secondary, #6b7280)',
    margin: 0,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={iconContainerStyle}>
        <svg
          width={32}
          height={32}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? '#ffffff' : 'var(--primary-700, #005f73)'}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ transition: 'stroke 0.3s ease' }}
        >
          <path d={iconPath} />
        </svg>
      </div>
      <div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={descStyle}>{description}</p>
      </div>
    </div>
  );
}

export default Expertise;

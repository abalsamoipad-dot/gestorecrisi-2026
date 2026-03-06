import { useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { TEAM_MEMBERS } from '@/constants';

/**
 * Team section – dark background with 3-column horizontal layout.
 * Each member card features initials avatar with hover effects.
 */
export function Team() {
  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    position: 'relative',
    overflow: 'hidden',
    background: [
      'radial-gradient(ellipse at 30% 50%, rgba(0,95,115,0.3) 0%, transparent 50%)',
      'radial-gradient(ellipse at 80% 30%, rgba(72,202,228,0.1) 0%, transparent 40%)',
      'linear-gradient(180deg, #0a1218 0%, #0d1f26 50%, #0a1218 100%)',
    ].join(', '),
  };

  const responsiveCss = `
    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
    @media (max-width: 768px) {
      .team-grid {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
      }
    }
  `;

  return (
    <section id="team" style={sectionStyle}>
      <style>{responsiveCss}</style>
      <Container>
        <SectionHeader
          kicker="Il Nostro Team"
          title="Professionisti al servizio della continuità"
          dark
        />
        <div className="team-grid">
          {TEAM_MEMBERS.map((member, i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <TeamCard
                name={member.name}
                role={member.role}
                bio={member.bio}
              />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Individual Team Card ─────────────────────────────────────────────────────

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
}

function TeamCard({ name, role, bio }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const cardStyle: CSSProperties = {
    background: isHovered
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: isHovered
      ? '1px solid rgba(72,202,228,0.25)'
      : '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '36px 28px',
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(72,202,228,0.08)'
      : '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'default',
  };

  const avatarStyle: CSSProperties = {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isHovered
      ? 'linear-gradient(135deg, var(--accent-400, #48cae4), var(--primary-700, #005f73))'
      : 'linear-gradient(135deg, var(--primary-700, #005f73), var(--accent-400, #48cae4))',
    border: isHovered
      ? '2px solid rgba(72,202,228,0.4)'
      : '2px solid rgba(255,255,255,0.1)',
    boxShadow: isHovered
      ? '0 8px 24px rgba(72,202,228,0.2)'
      : '0 4px 16px rgba(0,0,0,0.2)',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#fff',
    fontFamily: "var(--font-serif, 'Lora', serif)",
    letterSpacing: '0.05em',
  };

  const nameStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '6px',
  };

  const roleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--accent-400, #48cae4)',
    marginBottom: '14px',
  };

  const bioStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.55)',
    maxWidth: '320px',
    margin: '0 auto',
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={avatarStyle} aria-hidden="true">{initials}</div>
      <h3 style={nameStyle}>{name}</h3>
      <p style={roleStyle}>{role}</p>
      <p style={bioStyle}>{bio}</p>
    </article>
  );
}

export default Team;

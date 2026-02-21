import { useState, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { TEAM_MEMBERS } from '@/constants';

/**
 * Team section displaying team members in a responsive grid.
 * Each member card features a floating animation, hover-enhanced photo effects,
 * and scroll-triggered reveal animations.
 */
export function Team() {
  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    background: 'var(--neutral-50, #f9fafb)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    textAlign: 'center',
  };

  return (
    <section id="team" style={sectionStyle}>
      {/* Responsive styles: disable float animation on mobile / reduced-motion */}
      <style>{`
        .team-member-float {
          animation: team-float 4s ease-in-out infinite;
        }
        .team-member-float:nth-child(2) {
          animation-delay: -1.3s;
        }
        .team-member-float:nth-child(3) {
          animation-delay: -2.6s;
        }
        @media (max-width: 640px) {
          .team-member-float {
            animation: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .team-member-float {
            animation: none;
          }
        }
      `}</style>

      <Container>
        <SectionHeader
          kicker="Il Nostro Team"
          title="Professionisti al servizio della continuità"
        />
        <div style={gridStyle}>
          {TEAM_MEMBERS.map((member, i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <TeamCard
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageSrc={member.imageSrc}
                imageAlt={member.imageAlt}
                index={i}
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
  imageSrc: string;
  imageAlt: string;
  index: number;
}

function TeamCard({ name, role, bio, imageSrc, imageAlt }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const articleStyle: CSSProperties = {
    padding: '20px 0',
  };

  const photoStyle: CSSProperties = {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 20px',
    border: isHovered ? '3px solid rgba(72,202,228,0.4)' : '3px solid transparent',
    boxShadow: isHovered
      ? '0 12px 40px rgba(0,95,115,0.25), 0 0 30px rgba(72,202,228,0.15)'
      : '0 8px 32px rgba(0,95,115,0.15)',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    transition: 'all 0.5s ease',
    display: 'block',
  };

  const nameStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--text-primary, #111827)',
    marginBottom: '5px',
  };

  const roleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--primary-700, #005f73)',
    marginBottom: '15px',
  };

  const bioStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--text-secondary, #6b7280)',
    maxWidth: '340px',
    margin: '0 auto',
  };

  return (
    <article
      className="team-member-float"
      style={articleStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={photoStyle}
        loading="lazy"
        width={160}
        height={160}
      />
      <h3 style={nameStyle}>{name}</h3>
      <p style={roleStyle}>{role}</p>
      <p style={bioStyle}>{bio}</p>
    </article>
  );
}

export default Team;

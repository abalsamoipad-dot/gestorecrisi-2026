import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { AccordionItem } from '@/components/ui/AccordionItem';
import { FAQ_DATA } from '@/constants';

/**
 * FAQ section with premium background, category icons,
 * rich hover effects and glassmorphism CTA.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #f8fafb 0%, #eef4f6 40%, #f0f7fa 100%)',
  };

  /* Subtle radial glow top-right */
  const glowTopStyle: CSSProperties = {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(72, 202, 228, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  };

  /* Subtle radial glow bottom-left */
  const glowBottomStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 95, 115, 0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  };

  /* Fine dot pattern overlay */
  const patternStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(0, 95, 115, 0.03) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    pointerEvents: 'none',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const faqContainerStyle: CSSProperties = {
    maxWidth: '850px',
    margin: '0 auto',
  };

  /* Glassmorphism CTA box */
  const ctaBoxStyle: CSSProperties = {
    marginTop: '48px',
    padding: '32px 40px',
    borderRadius: '16px',
    background: ctaHovered
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(0, 95, 115, 0.08)',
    boxShadow: ctaHovered
      ? '0 8px 32px rgba(0, 95, 115, 0.12), 0 0 0 1px rgba(72, 202, 228, 0.15)'
      : '0 4px 20px rgba(0, 95, 115, 0.06)',
    textAlign: 'center' as const,
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    cursor: 'pointer',
    transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const ctaLabelStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '0.85rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--accent-400, #48cae4)',
    marginBottom: '8px',
  };

  const ctaTitleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--primary-700, #005f73)',
    marginBottom: '8px',
    lineHeight: 1.3,
  };

  const ctaSubStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '0.95rem',
    color: 'var(--text-secondary, #6b7280)',
    lineHeight: 1.5,
  };

  const arrowStyle: CSSProperties = {
    display: 'inline-block',
    marginLeft: '8px',
    transition: 'transform 0.3s ease',
    transform: ctaHovered ? 'translateX(4px)' : 'translateX(0)',
  };

  return (
    <section id="faq" style={sectionStyle}>
      {/* Background decorations */}
      <div style={glowTopStyle} />
      <div style={glowBottomStyle} />
      <div style={patternStyle} />

      <div style={contentStyle}>
        <Container>
          <SectionHeader
            kicker="FAQ – Codice della Crisi"
            title="Tutto quello che devi sapere sugli strumenti CCII"
            subtitle="Risposte concrete alle domande più comuni per gli imprenditori che valutano un percorso di risanamento."
          />
          <div style={faqContainerStyle}>
            {FAQ_DATA.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.05}>
                <AccordionItem
                  question={item.question}
                  answer={item.answer}
                  iconPath={item.iconPath}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </RevealOnScroll>
            ))}

            <RevealOnScroll delay={0.3}>
              <motion.a
                href="#contact"
                style={{ textDecoration: 'none', display: 'block' }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  style={ctaBoxStyle}
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                >
                  <p style={ctaLabelStyle}>Consulenza dedicata</p>
                  <p style={ctaTitleStyle}>
                    Hai una situazione specifica da valutare?
                  </p>
                  <p style={ctaSubStyle}>
                    Richiedi un'analisi riservata con il nostro team di esperti
                    <span style={arrowStyle}>&rarr;</span>
                  </p>
                </div>
              </motion.a>
            </RevealOnScroll>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default FAQ;

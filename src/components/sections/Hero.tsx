import { type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { HERO_BENEFITS } from '@/constants';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TITLE_WORDS_LINE1 = 'Proteggiamo il valore della tua azienda.'.split(' ');
const TITLE_WORDS_LINE2_PREFIX = 'Soluzioni esperte per il'.split(' ');

const PARTICLES = [
  { size: 6, top: '15%', left: '10%', animation: 'particle-float-1', duration: '8s' },
  { size: 8, top: '70%', left: '85%', animation: 'particle-float-2', duration: '11s' },
  { size: 5, top: '40%', left: '90%', animation: 'particle-float-3', duration: '14s' },
  { size: 7, top: '80%', left: '20%', animation: 'particle-float-1', duration: '9s' },
];

export function Hero() {
  const sectionStyle: CSSProperties = {
    position: 'relative',
    minHeight: '70vh',
    color: '#fff',
    overflow: 'clip',
    WebkitTransform: 'translateZ(0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a1628 0%, #002832 30%, #005f73 60%, #0a1628 100%)',
    backgroundSize: '300% 300%',
    animation: 'hero-gradient-shift 15s ease infinite',
  };

  /* Subtle mesh overlay for depth */
  const meshStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    opacity: 0.4,
    background:
      'radial-gradient(ellipse at 20% 50%, rgba(72,202,228,0.15) 0%, transparent 50%), ' +
      'radial-gradient(ellipse at 80% 20%, rgba(0,95,115,0.2) 0%, transparent 50%), ' +
      'radial-gradient(ellipse at 60% 80%, rgba(144,224,239,0.1) 0%, transparent 50%)',
  };

  /* Subtle noise texture via SVG for premium feel */
  const noiseStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '128px 128px',
  };

  const contentWrapperStyle: CSSProperties = {
    position: 'relative',
    width: '90%',
    maxWidth: '950px',
    textAlign: 'center',
    zIndex: 10,
    padding: '80px 0 40px',
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    textShadow: '0 2px 30px rgba(0,0,0,0.5)',
    marginBottom: 'clamp(12px, 3vw, 24px)',
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
    maxWidth: '800px',
    margin: '0 auto clamp(20px, 4vw, 40px)',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.8)',
  };

  const benefitsRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(10px, 3vw, 30px)',
    flexWrap: 'wrap',
    marginBottom: 'clamp(20px, 4vw, 40px)',
  };

  const benefitStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  };

  const checkmarkStyle: CSSProperties = {
    color: 'var(--accent-400, #48cae4)',
    flexShrink: 0,
  };

  // Build word indices for stagger
  let wordIndex = 0;
  TITLE_WORDS_LINE1.forEach(() => wordIndex++);
  const line2StartIndex = wordIndex;
  TITLE_WORDS_LINE2_PREFIX.forEach(() => wordIndex++);
  const gradientWordIndex = wordIndex++;

  return (
    <section id="home" style={sectionStyle}>
      {/* Mesh radial overlays */}
      <div style={meshStyle} aria-hidden="true" />
      <div style={noiseStyle} aria-hidden="true" />

      {/* Floating Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'rgba(72,202,228,0.2)',
            animation: `${p.animation} ${p.duration} ease-in-out infinite`,
            zIndex: 3,
          }}
        />
      ))}

      {/* Hero Content */}
      <div style={contentWrapperStyle}>
        <h1 style={titleStyle}>
          <span style={{ display: 'block' }}>
            {TITLE_WORDS_LINE1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: EASE }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span style={{ display: 'block', marginTop: '4px' }}>
            {TITLE_WORDS_LINE2_PREFIX.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.3 + (line2StartIndex + i) * 0.08, ease: EASE }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.3 + gradientWordIndex * 0.08, ease: EASE }}
              style={{ display: 'inline' }}
            >
              <GradientText from="#48cae4" to="#90e0ef" animate>
                Risanamento e la Continuit&agrave; d&rsquo;Impresa.
              </GradientText>
            </motion.span>
          </span>
        </h1>

        <motion.p
          style={subtitleStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: EASE }}
        >
          Supportiamo imprenditori e management nella gestione strutturata della crisi,
          dalla diagnosi iniziale fino alla definizione di un percorso di risanamento
          concreto e personalizzato.
        </motion.p>

        <motion.div
          style={benefitsRowStyle}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } },
          }}
        >
          {HERO_BENEFITS.map((benefit, i) => (
            <motion.div
              key={i}
              style={benefitStyle}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
                strokeLinejoin="round" style={checkmarkStyle} aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0, ease: EASE }}
        >
          <Button variant="primary" size="lg" href="#contact">
            Richiedi Primo Contatto
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

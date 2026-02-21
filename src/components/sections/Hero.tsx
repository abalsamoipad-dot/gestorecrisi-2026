import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { HERO_BENEFITS } from '@/constants';
import posterImg from '@/assets/images/Videostatico.jpeg';

const VIDEO_URL = 'https://storage.googleapis.com/gestorecrisi/veo-video-crisi.mp4';

// Premium deceleration easing
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TITLE_WORDS_LINE1 = 'Proteggiamo il valore della tua azienda.'.split(' ');
const TITLE_WORDS_LINE2_PREFIX = 'Soluzioni esperte per il'.split(' ');

// Particle configuration
const PARTICLES = [
  { size: 6, top: '15%', left: '10%', animation: 'particle-float-1', duration: '8s' },
  { size: 8, top: '70%', left: '85%', animation: 'particle-float-2', duration: '11s' },
  { size: 5, top: '40%', left: '90%', animation: 'particle-float-3', duration: '14s' },
  { size: 7, top: '80%', left: '20%', animation: 'particle-float-1', duration: '9s' },
];

/**
 * Full-viewport hero section with video background, parallax scrolling,
 * animated gradient overlay, staggered word animations, and floating particles.
 * Uses absolute positioning for content centering to avoid container conflicts.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scrolling for video
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const sectionStyle: CSSProperties = {
    position: 'relative',
    height: '70vh',
    minHeight: '500px',
    background: '#000',
    color: '#fff',
    overflow: 'hidden',
    isolation: 'isolate',
  };

  const videoWrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: -2,
    overflow: 'hidden',
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    background:
      'linear-gradient(135deg, rgba(0,40,50,0.85) 0%, rgba(0,95,115,0.7) 40%, rgba(72,202,228,0.4) 70%, rgba(0,40,50,0.8) 100%)',
    backgroundSize: '400% 400%',
    animation: 'hero-gradient-shift 12s ease infinite',
  };

  /* Absolute centering: no dependency on Container or flex parent */
  const contentWrapperStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '950px',
    textAlign: 'center',
    zIndex: 10,
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    textShadow: '0 2px 20px rgba(0,0,0,0.8)',
    marginBottom: '24px',
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1.15rem',
    maxWidth: '800px',
    margin: '0 auto 40px',
    lineHeight: 1.6,
    textShadow: '0 1px 10px rgba(0,0,0,0.5)',
    color: 'rgba(255,255,255,0.85)',
  };

  const benefitsRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginBottom: '40px',
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

  // Build all title words with indices for stagger calculation
  const allWords: { text: string; index: number }[] = [];
  let wordIndex = 0;
  TITLE_WORDS_LINE1.forEach((word) => {
    allWords.push({ text: word, index: wordIndex++ });
  });
  const line2StartIndex = wordIndex;
  TITLE_WORDS_LINE2_PREFIX.forEach((word) => {
    allWords.push({ text: word, index: wordIndex++ });
  });
  const gradientWordIndex = wordIndex++;

  return (
    <section ref={sectionRef} id="home" style={sectionStyle}>
      {/* Video Background */}
      <div style={videoWrapperStyle}>
        <motion.div style={{ y: videoY, width: '100%', height: '120%' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            poster={posterImg}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div style={overlayStyle} aria-hidden="true" />

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
            background: 'rgba(72,202,228,0.15)',
            animation: `${p.animation} ${p.duration} ease-in-out infinite`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Hero Content — absolutely centered */}
      <div style={contentWrapperStyle}>
        {/* Animated Title */}
        <h1 style={titleStyle}>
          {/* Line 1 */}
          <span style={{ display: 'block' }}>
            {TITLE_WORDS_LINE1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.08,
                  ease: EASE,
                }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          {/* Line 2 */}
          <span style={{ display: 'block', marginTop: '4px' }}>
            {TITLE_WORDS_LINE2_PREFIX.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + (line2StartIndex + i) * 0.08,
                  ease: EASE,
                }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.6,
                delay: 0.3 + gradientWordIndex * 0.08,
                ease: EASE,
              }}
              style={{ display: 'inline' }}
            >
              <GradientText from="#48cae4" to="#90e0ef" animate>
                Risanamento e la Continuit&agrave; d&rsquo;Impresa.
              </GradientText>
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
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

        {/* Benefits Row */}
        <motion.div
          style={benefitsRowStyle}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 1.5,
              },
            },
          }}
        >
          {HERO_BENEFITS.map((benefit, i) => (
            <motion.div
              key={i}
              style={benefitStyle}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: EASE },
                },
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={checkmarkStyle}
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
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

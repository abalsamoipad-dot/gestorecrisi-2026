import type { CSSProperties } from 'react';
import Container from '@/components/ui/Container';
import Logo from '@/components/ui/Logo';

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const footerStyle: CSSProperties = {
  position: 'relative',
  padding: '64px 0 48px',
  backgroundColor: 'var(--neutral-50, #f9fafb)',
};

const gradientBorderStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '3px',
  background: 'linear-gradient(90deg, #005f73, #48cae4, #90e0ef, #48cae4, #005f73)',
  backgroundSize: '300% 100%',
  animation: 'footer-gradient 6s linear infinite',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};

const copyrightStyle: CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-secondary, #6b7280)',
  lineHeight: 1.6,
  margin: 0,
};

const disclaimerStyle: CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary, #6b7280)',
  lineHeight: 1.6,
  maxWidth: '600px',
  margin: '0 auto',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      {/* Animated gradient border */}
      <div className="footer-gradient-border" style={gradientBorderStyle} aria-hidden="true" />

      <Container>
        <div style={contentStyle}>
          {/* Logo */}
          <Logo size="md" />

          {/* Copyright */}
          <p style={copyrightStyle}>
            &copy; {year} gestoredellacrisi.it &mdash; Team di Professionisti per il Risanamento
            d&apos;Impresa.
          </p>

          {/* Disclaimer */}
          <p style={disclaimerStyle}>
            Le informazioni presenti su questo sito hanno carattere esclusivamente informativo e non
            costituiscono consulenza professionale. Per una valutazione specifica del caso concreto
            si prega di contattare direttamente lo Studio.
          </p>
        </div>
      </Container>
    </footer>
  );
}

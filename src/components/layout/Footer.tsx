import type { CSSProperties } from 'react';
import Container from '@/components/ui/Container';
import Logo from '@/components/ui/Logo';

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const footerStyle: CSSProperties = {
  position: 'relative',
  padding: '64px 0 40px',
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

const linksRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px 20px',
  fontSize: '13px',
};

const linkStyle: CSSProperties = {
  color: 'var(--primary-700, #005f73)',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s ease',
};

const separatorStyle: CSSProperties = {
  color: 'var(--text-secondary, #6b7280)',
  opacity: 0.4,
  userSelect: 'none',
};

const badgesRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  marginTop: '4px',
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-secondary, #6b7280)',
  padding: '5px 12px',
  borderRadius: '20px',
  border: '1px solid rgba(0, 95, 115, 0.12)',
  background: 'rgba(0, 95, 115, 0.03)',
  letterSpacing: '0.02em',
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

          {/* Legal & Policy Links */}
          <nav aria-label="Link legali e policy" style={linksRowStyle}>
            <a href="privacy.html" style={linkStyle}>
              Informativa Privacy
            </a>
            <span style={separatorStyle} aria-hidden="true">|</span>
            <a href="cookie-policy.html" style={linkStyle}>
              Cookie Policy
            </a>
          </nav>

          {/* Trust Badges */}
          <div style={badgesRowStyle}>
            <span style={badgeStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDPR Compliant
            </span>
            <span style={badgeStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Dati Protetti
            </span>
          </div>

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

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AreaRiservataProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AreaRiservata({ isOpen, onClose }: AreaRiservataProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!code.trim()) return;
    if (code.trim().toLowerCase() === 'ross') {
      setError(false);
      setSuccess(true);
      setTimeout(() => {
        // URL constructed at runtime only on success
        const p1 = 'aHR0cHM6Ly9hYmFsc2Ftb2lwYWQtZG90LmdpdGh1Yi5p';
        const p2 = 'by9nZXN0b3JlY3Jpc2ktMjAyNi9tb2R1bG9fUm9zc19ncm91cC8=';
        window.location.href = atob(p1 + p2);
      }, 1800);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleClose();
  };

  const handleClose = () => {
    setCode('');
    setError(false);
    setSuccess(false);
    setShaking(false);
    onClose();
  };

  // ── Styles ──────────────────────────────────────────────────────

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const bgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: [
      'radial-gradient(ellipse at 50% 40%, rgba(180, 140, 40, 0.08) 0%, transparent 50%)',
      'radial-gradient(ellipse at 20% 80%, rgba(0, 95, 115, 0.1) 0%, transparent 40%)',
      'radial-gradient(ellipse at 80% 20%, rgba(212, 169, 68, 0.05) 0%, transparent 40%)',
      'linear-gradient(180deg, #060b11 0%, #0a1628 40%, #0d1b2a 100%)',
    ].join(', '),
  };

  // Subtle noise texture
  const noiseStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px 128px',
    pointerEvents: 'none',
  };

  const cardStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '460px',
    padding: '52px 44px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(212, 169, 68, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(212, 169, 68, 0.06)',
    textAlign: 'center',
    animation: shaking ? 'shake 0.5s ease' : undefined,
  };

  const closeStyle: CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
  };

  const shieldStyle: CSSProperties = {
    width: '72px',
    height: '72px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(212, 169, 68, 0.15), rgba(245, 230, 184, 0.08))',
    border: '1px solid rgba(212, 169, 68, 0.25)',
    boxShadow: '0 0 40px rgba(212, 169, 68, 0.1)',
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #d4a944, #f5e6b8, #d4a944)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    lineHeight: 1.2,
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: 1.6,
    marginBottom: '36px',
    letterSpacing: '0.02em',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: error
      ? '2px solid rgba(220, 38, 38, 0.7)'
      : '2px solid rgba(212, 169, 68, 0.2)',
    borderRadius: '14px',
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '6px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box',
  };

  const submitStyle: CSSProperties = {
    marginTop: '16px',
    width: '100%',
    padding: '16px 28px',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    color: '#5c4a0e',
    background: 'linear-gradient(135deg, #d4a944, #f5e6b8, #d4a944)',
    backgroundSize: '200% auto',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 24px rgba(212, 169, 68, 0.25)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  const errorStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '13px',
    color: '#f87171',
    marginTop: '12px',
    transition: 'opacity 0.3s ease',
  };

  const successIconStyle: CSSProperties = {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.1))',
    border: '2px solid rgba(16, 185, 129, 0.4)',
    animation: 'unlock-pulse 1.5s ease infinite',
  };

  const successTextStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#34d399',
    marginBottom: '8px',
  };

  const successSubStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
  };

  const decorLineStyle: CSSProperties = {
    width: '40px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(212, 169, 68, 0.4), transparent)',
    margin: '0 auto 24px',
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="area-riservata-overlay"
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Background layers */}
          <div style={bgStyle} />
          <div style={noiseStyle} />

          {/* Card */}
          <motion.div
            style={cardStyle}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
          >
            {/* Close button */}
            <button
              style={closeStyle}
              onClick={handleClose}
              aria-label="Chiudi"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!success ? (
              <>
                {/* Shield icon */}
                <div style={shieldStyle}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#d4a944" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <rect x="9" y="10" width="6" height="5" rx="1" />
                    <path d="M10 10V8a2 2 0 0 1 4 0v2" />
                  </svg>
                </div>

                <h2 style={titleStyle}>Area Riservata</h2>
                <div style={decorLineStyle} />
                <p style={subtitleStyle}>
                  Accesso esclusivo riservato ai clienti dello Studio.<br />
                  Inserisci il codice che ti è stato fornito.
                </p>

                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(false); }}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212, 169, 68, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 169, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? 'rgba(220, 38, 38, 0.7)'
                      : 'rgba(212, 169, 68, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="- - - -"
                  style={inputStyle}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Codice di accesso"
                />

                {error && (
                  <motion.p
                    style={errorStyle}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Codice non valido. Verifica il codice e riprova.
                  </motion.p>
                )}

                <button
                  style={submitStyle}
                  onClick={handleSubmit}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 169, 68, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(212, 169, 68, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Accedi
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              >
                {/* Success state */}
                <div style={successIconStyle}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                    stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p style={successTextStyle}>Accesso Autorizzato</p>
                <p style={successSubStyle}>Reindirizzamento in corso...</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

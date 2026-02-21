import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import MobileMenu from '@/components/layout/MobileMenu';
import { NAV_ITEMS } from '@/constants';
import type { SectionId } from '@/types';

/* ------------------------------------------------------------------ */
/*  Section IDs to observe for active-link highlighting                */
/* ------------------------------------------------------------------ */
const SECTION_IDS: SectionId[] = ['home', 'expertise', 'stats', 'faq', 'team', 'news', 'contact'];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const headerBase: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 2000,
  transition: 'height 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease, box-shadow 0.3s ease',
};

const headerDefault: CSSProperties = {
  ...headerBase,
  height: 'var(--header-height, 80px)',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid transparent',
  boxShadow: 'none',
};

const headerScrolled: CSSProperties = {
  ...headerBase,
  height: 'var(--header-height-scrolled, 64px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(0, 95, 115, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
};

const innerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
};

const navStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
};

const navLinkWrapperStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const navLinkStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--text-primary, #111827)',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  padding: '4px 0',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  fontFamily: 'var(--font-sans, "Inter", sans-serif)',
};

const underlineStyle: CSSProperties = {
  position: 'absolute',
  bottom: '-2px',
  left: 0,
  right: 0,
  height: '2px',
  backgroundColor: 'var(--accent-400, #48cae4)',
  borderRadius: '1px',
};

const hamburgerStyle: CSSProperties = {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-primary, #111827)',
  padding: 0,
  borderRadius: '8px',
  transition: 'background-color 0.2s ease',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ----- scroll listener ----------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ----- IntersectionObserver for active section ------------------- */
  useEffect(() => {
    const visibilityMap = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with the greatest visible ratio
        let maxRatio = 0;
        let maxId = 'home';
        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = id;
          }
        });

        if (maxRatio > 0) {
          setActiveSection(maxId);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-80px 0px 0px 0px',
      },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observerRef.current!.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  /* ----- lock body scroll when mobile menu is open ---------------- */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  /* ----- derive items -------------------------------------------- */
  const regularItems = NAV_ITEMS.filter((item) => !item.isCta);
  const ctaItem = NAV_ITEMS.find((item) => item.isCta);

  return (
    <>
      <header style={isScrolled ? headerScrolled : headerDefault}>
        <Container style={{ height: '100%' }}>
          <div style={innerStyle}>
            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop nav */}
            <nav style={navStyle} aria-label="Navigazione principale">
              {regularItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id} style={navLinkWrapperStyle}>
                    <a
                      href={`#${item.id}`}
                      style={{
                        ...navLinkStyle,
                        color: isActive
                          ? 'var(--primary-700, #005f73)'
                          : 'var(--text-primary, #111827)',
                      }}
                    >
                      {item.label}
                    </a>
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        style={underlineStyle}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                );
              })}

              {/* CTA nav link */}
              {ctaItem && (
                <Button
                  href={`#${ctaItem.id}`}
                  variant="outline"
                  size="md"
                  style={{
                    fontSize: '13px',
                    padding: '8px 20px',
                    borderRadius: '50px',
                  }}
                >
                  {ctaItem.label}
                </Button>
              )}
            </nav>

            {/* Hamburger (mobile only -- visibility controlled via media query injected below) */}
            <button
              style={hamburgerStyle}
              className="header-hamburger"
              onClick={handleMobileToggle}
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobileOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileOpen} onClose={handleMobileClose} activeSection={activeSection} />

      {/* Responsive style — injected once for mobile/desktop toggling */}
      <style>{`
        @media (max-width: 768px) {
          .header-hamburger {
            display: flex !important;
          }
          nav[aria-label="Navigazione principale"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

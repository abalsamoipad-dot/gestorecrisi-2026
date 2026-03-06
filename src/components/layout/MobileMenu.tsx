import { type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '@/constants';
import Button from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onOpenVip: () => void;
}

const backdropStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9998,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

const panelStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '85vw',
  maxWidth: '360px',
  zIndex: 9999,
  backgroundColor: 'var(--white, #ffffff)',
  padding: '80px 32px 32px',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '8px',
  color: 'var(--text-primary, #111827)',
  transition: 'background-color 0.2s ease',
};

const navItemStyle: CSSProperties = {
  display: 'block',
  fontSize: '24px',
  fontFamily: 'var(--font-serif, "Lora", serif)',
  fontWeight: 500,
  padding: '16px 0',
  borderBottom: '1px solid var(--neutral-200, #e5e7eb)',
  textDecoration: 'none',
  color: 'var(--text-primary, #111827)',
  transition: 'color 0.2s ease',
};

const activeItemStyle: CSSProperties = {
  ...navItemStyle,
  color: 'var(--primary-700, #005f73)',
};

const ctaWrapperStyle: CSSProperties = {
  marginTop: 'auto',
  paddingTop: '32px',
};

export default function MobileMenu({ isOpen, onClose, activeSection, onOpenVip }: MobileMenuProps) {
  const regularItems = NAV_ITEMS.filter((item) => !item.isCta);
  const ctaItem = NAV_ITEMS.find((item) => item.isCta);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            style={backdropStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.nav
            key="mobile-panel"
            style={panelStyle}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione mobile"
          >
            {/* Close button */}
            <button
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Chiudi menu"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Nav items */}
            <div>
              {regularItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  style={activeSection === item.id ? activeItemStyle : navItemStyle}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA item */}
            {ctaItem && (
              <motion.div
                style={ctaWrapperStyle}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.1 + regularItems.length * 0.06,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              >
                <Button
                  href={`#${ctaItem.id}`}
                  variant="primary"
                  fullWidth
                  onClick={handleLinkClick}
                >
                  {ctaItem.label}
                </Button>
              </motion.div>
            )}

            {/* VIP Area Button */}
            <motion.div
              style={{ marginTop: '12px' }}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.1 + (regularItems.length + 1) * 0.06,
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              <button
                onClick={() => { onClose(); onOpenVip(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '16px 36px',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  color: 'rgba(255, 255, 255, 0.9)',
                  background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d45 100%)',
                  border: '1px solid rgba(212, 169, 68, 0.3)',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
                  lineHeight: 1.2,
                  letterSpacing: '0.03em',
                }}
                aria-label="Accedi all'Area Riservata"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(212, 169, 68, 0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Area Riservata
              </button>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

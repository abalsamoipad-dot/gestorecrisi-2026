import { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  question: string;
  answer: string;
  iconPath?: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Premium deceleration easing
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * FAQ accordion item with framer-motion height animation.
 * Features category icon, rotating plus/close icon, rich hover effects,
 * and smooth expand/collapse transitions.
 */
export function AccordionItem({ question, answer, iconPath, isOpen, onToggle }: AccordionItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle: CSSProperties = {
    borderBottom: '1px solid rgba(0, 95, 115, 0.08)',
    borderLeft: isOpen ? '3px solid var(--accent-400, #48cae4)' : '3px solid transparent',
    paddingLeft: '16px',
    borderRadius: '8px',
    marginBottom: '4px',
    background: isOpen
      ? 'rgba(0, 95, 115, 0.03)'
      : isHovered
        ? 'rgba(0, 95, 115, 0.015)'
        : 'transparent',
    boxShadow: isHovered && !isOpen
      ? '0 2px 12px rgba(0, 95, 115, 0.06)'
      : isOpen
        ? '0 4px 20px rgba(0, 95, 115, 0.08)'
        : 'none',
    transition: 'background 0.3s ease, box-shadow 0.3s ease, border-left-color 0.3s ease',
  };

  const questionRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 16px 20px 0',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    gap: '14px',
  };

  const iconContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    minWidth: '38px',
    borderRadius: '10px',
    background: isOpen
      ? 'linear-gradient(135deg, var(--primary-700, #005f73), var(--accent-400, #48cae4))'
      : isHovered
        ? 'rgba(0, 95, 115, 0.08)'
        : 'rgba(0, 95, 115, 0.05)',
    transition: 'background 0.3s ease, transform 0.3s ease',
    transform: isHovered && !isOpen ? 'scale(1.05)' : 'scale(1)',
  };

  const questionTextStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.1rem',
    fontWeight: 600,
    lineHeight: 1.4,
    color: isOpen
      ? 'var(--primary-700, #005f73)'
      : isHovered
        ? 'var(--primary-600, #0a7c8f)'
        : 'var(--text-primary, #111827)',
    transition: 'color 0.3s ease',
    flex: 1,
  };

  const toggleStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    flexShrink: 0,
    fontSize: '1.3rem',
    fontWeight: 300,
    color: isOpen
      ? 'var(--primary-700, #005f73)'
      : 'var(--text-secondary, #6b7280)',
    lineHeight: 1,
  };

  const answerTextStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.7,
    color: 'var(--text-secondary, #6b7280)',
    paddingBottom: '20px',
    paddingRight: '44px',
    paddingLeft: iconPath ? '52px' : '0',
  };

  return (
    <div
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        style={questionRowStyle}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        {iconPath && (
          <div style={iconContainerStyle}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isOpen ? '#ffffff' : 'var(--primary-700, #005f73)'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'stroke 0.3s ease' }}
            >
              <path d={iconPath} />
            </svg>
          </div>
        )}
        <span style={questionTextStyle}>{question}</span>
        <motion.span
          style={toggleStyle}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: EASE },
              opacity: { duration: 0.25, ease: 'easeInOut' },
            }}
            style={{ overflow: 'hidden' }}
          >
            <p style={answerTextStyle}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionItem;

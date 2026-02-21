import { useState, type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  md: {
    padding: '12px 28px',
    fontSize: '0.95rem',
  },
  lg: {
    padding: '16px 36px',
    fontSize: '1.05rem',
  },
};

const spinnerKeyframes = `
@keyframes btn-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

// Inject spinner keyframes once
let injected = false;
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
  injected = true;
}

/**
 * CTA button component with primary, outline, and ghost variants.
 * Renders as <a> when href is provided, otherwise <button>.
 * Supports loading state with a CSS spinner.
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  fullWidth = false,
  className,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Inject spinner animation
  if (loading) injectKeyframes();

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontWeight: 600,
    lineHeight: 1.2,
    borderRadius: '50px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    textDecoration: 'none',
    border: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
    pointerEvents: loading ? 'none' : 'auto',
    ...sizeStyles[size],
  };

  const variantStyles: Record<ButtonVariant, { normal: CSSProperties; hover: CSSProperties }> = {
    primary: {
      normal: {
        background: 'var(--primary-700, #005f73)',
        color: 'var(--white, #ffffff)',
        boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))',
      },
      hover: {
        background: 'linear-gradient(135deg, #005f73 0%, #0891b2 50%, #48cae4 100%)',
        color: 'var(--white, #ffffff)',
        transform: 'translateY(-2px)',
        boxShadow: '0 0 40px rgba(72, 202, 228, 0.15), 0 8px 24px rgba(0, 95, 115, 0.2)',
      },
    },
    outline: {
      normal: {
        background: 'transparent',
        color: 'var(--primary-700, #005f73)',
        border: '2px solid var(--primary-700, #005f73)',
      },
      hover: {
        background: 'var(--primary-700, #005f73)',
        color: 'var(--white, #ffffff)',
        border: '2px solid var(--primary-700, #005f73)',
        transform: 'translateY(-2px)',
      },
    },
    ghost: {
      normal: {
        background: 'transparent',
        color: 'var(--primary-700, #005f73)',
        border: 'none',
      },
      hover: {
        background: 'rgba(0, 95, 115, 0.05)',
        color: 'var(--primary-700, #005f73)',
        border: 'none',
      },
    },
  };

  const currentVariant = variantStyles[variant];
  const computedStyle: CSSProperties = {
    ...baseStyle,
    ...currentVariant.normal,
    ...(isHovered && !loading ? currentVariant.hover : {}),
  };

  const spinnerStyle: CSSProperties = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTopColor: variant === 'primary' ? '#ffffff' : 'var(--primary-700, #005f73)',
    borderRightColor: variant === 'primary' ? '#ffffff' : 'var(--primary-700, #005f73)',
    borderRadius: '50%',
    animation: 'btn-spin 0.6s linear infinite',
    flexShrink: 0,
  };

  const content = (
    <>
      {loading && <span style={spinnerStyle} aria-hidden="true" />}
      {children}
    </>
  );

  const eventHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (href) {
    return (
      <a
        href={href}
        style={computedStyle}
        className={className}
        {...eventHandlers}
        aria-busy={loading || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={computedStyle}
      className={className}
      disabled={loading}
      aria-busy={loading || undefined}
      {...eventHandlers}
    >
      {content}
    </button>
  );
}

export default Button;

import type { ReactNode, CSSProperties } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const baseStyle: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  width: '100%',
};

/**
 * Simple layout wrapper that constrains content to a max-width of 1200px
 * with centered alignment and horizontal padding.
 */
export function Container({ children, className, style }: ContainerProps) {
  return (
    <div style={style ? { ...baseStyle, ...style } : baseStyle} className={className}>
      {children}
    </div>
  );
}

export default Container;

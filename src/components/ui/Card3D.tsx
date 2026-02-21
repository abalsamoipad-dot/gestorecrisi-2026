import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  scale?: number;
}

/**
 * 3D perspective tilt card that tracks mouse position for a parallax-like tilt effect.
 * Automatically disables tilt on touch devices for a smooth experience.
 */
export function Card3D({
  children,
  className,
  glowColor = 'rgba(72, 202, 228, 0.15)',
  maxTilt = 8,
  scale = 1.02,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState('0.4s');

  const handleTouchStart = useCallback(() => {
    setIsTouchDevice(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalize to -1...1
      const normalizedX = (x - centerX) / centerX;
      const normalizedY = (y - centerY) / centerY;

      // Compute rotation (inverted for natural feel)
      const rotateX = -normalizedY * maxTilt;
      const rotateY = normalizedX * maxTilt;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
      setTransitionDuration('0.1s');
    },
    [isTouchDevice, maxTilt, scale]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice) {
      setIsHovered(true);
      setTransitionDuration('0.1s');
    }
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setTransitionDuration('0.4s');
  }, []);

  const cardStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: isHovered
      ? '1px solid rgba(72, 202, 228, 0.3)'
      : '1px solid rgba(0, 95, 115, 0.08)',
    borderRadius: '16px',
    padding: '48px 36px',
    transform,
    transition: `transform ${transitionDuration} ease-out, box-shadow 0.3s ease, border-color 0.3s ease`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    boxShadow: isHovered
      ? `0 20px 60px rgba(0, 95, 115, 0.12), 0 0 40px ${glowColor}`
      : 'var(--shadow-md, 0 8px 24px rgba(0, 95, 115, 0.08))',
  };

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
}

export default Card3D;

import { type ReactNode, type CSSProperties, Children } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { RevealDirection } from '@/types';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  stagger?: number;
  style?: CSSProperties;
}

function getInitialTransform(
  direction: RevealDirection,
  distance: number
): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    case 'fade':
    default:
      return { x: 0, y: 0 };
  }
}

// Premium deceleration easing
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Wrapper component that reveals its children with a scroll-triggered animation.
 * Uses framer-motion for animation and react-intersection-observer for viewport detection.
 * Supports directional reveals and staggered children.
 */
export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 40,
  once = true,
  className,
  stagger,
  style,
}: RevealOnScrollProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

  const { x: initialX, y: initialY } = getInitialTransform(direction, distance);

  // Stagger mode: wrap each child with staggered delay
  if (stagger !== undefined && stagger > 0) {
    const childArray = Children.toArray(children);

    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      },
    };

    const childVariants: Variants = {
      hidden: {
        opacity: 0,
        x: initialX,
        y: initialY,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease: EASE,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={className}
        style={style}
      >
        {childArray.map((child, index) => (
          <motion.div key={index} variants={childVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Standard single-element reveal
  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: initialX, y: initialY }
      }
      transition={{
        duration,
        delay,
        ease: EASE,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default RevealOnScroll;

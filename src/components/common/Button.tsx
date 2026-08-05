import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/30',
  secondary:
    'border border-white/15 bg-background/45 text-foreground backdrop-blur-md hover:border-primary/50 hover:bg-surface/80',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      type="button"
      whileHover={props.disabled ? undefined : { y: -1, scale: 1.01 }}
      whileTap={props.disabled ? undefined : { scale: 0.99 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

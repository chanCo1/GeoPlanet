import { type ButtonHTMLAttributes, type FC } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  // base
  [
    'inline-flex items-center justify-center gap-xs rounded-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info-ring',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary hover:bg-primary-active disabled:bg-primary-disabled disabled:text-muted',
        outline:
          'border border-primary text-body bg-transparent hover:bg-surface-elevated-dark disabled:text-muted disabled:border-hairline-on-dark',
        ghost:
          'text-body bg-transparent hover:bg-surface-elevated-dark disabled:text-muted',
        danger:
          'bg-trading-down text-on-dark hover:opacity-80 disabled:opacity-40',
      },
      size: {
        md: 'h-btn-primary px-md text-button',
        sm: 'h-btn-subscribe px-sm text-body-sm',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface IProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: FC<IProps> = ({
  variant,
  size,
  fullWidth,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
};

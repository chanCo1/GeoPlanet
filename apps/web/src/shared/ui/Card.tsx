import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const cardVariants = cva('rounded-xl border p-4', {
  variants: {
    variant: {
      default: 'bg-surface-card-dark border-hairline-on-dark',
      glass:   'bg-black/10 border-white/10 backdrop-blur-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ICardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

interface ICardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ICardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

interface ICardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card: FC<ICardProps> = ({ variant, className, children, ...props }) => (
  <div className={cn(cardVariants({ variant }), className)} {...props}>
    {children}
  </div>
);

export const CardHeader: FC<ICardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn('px-lg pt-lg pb-sm', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: FC<ICardTitleProps> = ({ className, children, ...props }) => (
  <h3 className={cn('text-title-sm font-medium text-on-dark', className)} {...props}>
    {children}
  </h3>
);

export const CardContent: FC<ICardContentProps> = ({ className, children, ...props }) => (
  <div className={cn('px-lg pb-lg', className)} {...props}>
    {children}
  </div>
);

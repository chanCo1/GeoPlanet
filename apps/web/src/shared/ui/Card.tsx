import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
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

export const Card: FC<ICardProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-xl bg-surface-card-dark border border-hairline-on-dark',
      className,
    )}
    {...props}
  >
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

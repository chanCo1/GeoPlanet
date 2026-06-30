import { type FC, type HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface ILogoProps extends HTMLAttributes<HTMLDivElement> {}

export const Logo: FC<ILogoProps> = ({ className, ...props }) => (
  <div className={cn(className)} {...props}>
    <span className="text-xl font-bold tracking-widest text-white/90">
      GEO<span className="text-primary">PLANET</span>
    </span>
  </div>
);

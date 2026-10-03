import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'interactive' | 'glow' | 'accent' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}, ref) => {
  const base = 'rounded-xl transition-all duration-200';

  const variants = {
    default: 'bg-[#282923] border border-[#4A4A42] text-[#F5EFE4] shadow-sm',
    surface: 'bg-[#242520] border border-[#3A3B34] text-[#F5EFE4]',
    interactive: 'bg-[#282923] border border-[#4A4A42] hover:border-[#8798B7]/60 hover:bg-[#30312C] text-[#F5EFE4] cursor-pointer shadow-sm transition-all',
    glow: 'bg-[#282923] border border-[#8798B7]/50 text-[#F5EFE4] shadow-md shadow-[#8798B7]/10',
    accent: 'bg-gradient-to-br from-[#2E302B] to-[#242520] border border-[#4A4A42] text-[#F5EFE4]',
    bordered: 'bg-transparent border border-[#4A4A42] text-[#F5EFE4]',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      className={cn(base, variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4 border-b border-[#373832]', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn('text-base font-semibold text-[#F5EFE4] leading-snug tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={cn('text-xs text-[#BDB5A7]', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('pt-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-[#373832]', className)} {...props}>
    {children}
  </div>
);

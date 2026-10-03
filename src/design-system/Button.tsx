import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'glow' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F17] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] font-bold shadow-md shadow-[#8798B7]/20 focus:ring-[#8798B7] border border-[#8798B7]/40',
    secondary: 'bg-[#30312C] hover:bg-[#373832] text-[#F5EFE4] border border-[#4A4A42] focus:ring-[#8798B7] shadow-sm',
    outline: 'bg-transparent hover:bg-[#30312C] text-[#F5EFE4] border border-[#4A4A42] hover:border-[#8798B7]/60 focus:ring-[#8798B7]',
    ghost: 'bg-transparent hover:bg-[#30312C] text-[#BDB5A7] hover:text-[#F5EFE4] focus:ring-[#8798B7]',
    danger: 'bg-[#C6927D] hover:bg-[#D4A08D] text-[#20211E] font-bold shadow-md shadow-[#C6927D]/20 focus:ring-[#C6927D] border border-[#C6927D]/40',
    success: 'bg-[#9BB59F] hover:bg-[#ABC4B0] text-[#20211E] font-bold shadow-md shadow-[#9BB59F]/20 focus:ring-[#9BB59F] border border-[#9BB59F]/40',
    glow: 'bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-md shadow-[#8798B7]/25 border border-[#8798B7]/40 focus:ring-[#8798B7] font-bold',
    accent: 'bg-[#A79BC4] hover:bg-[#B7ABD2] text-[#20211E] font-bold shadow-md shadow-[#A79BC4]/20 focus:ring-[#A79BC4] border border-[#A79BC4]/40',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 w-9 h-9',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

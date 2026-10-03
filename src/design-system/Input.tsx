import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#A39F94]">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A39F94]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-lg bg-[#282923] border border-[#4A4A42] text-[#F5EFE4] placeholder-[#A39F94] text-sm px-3.5 py-2.5 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#8798B7] focus:border-[#8798B7]',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-[#C6927D] focus:ring-[#C6927D] focus:border-[#C6927D]',
            props.disabled && 'opacity-50 cursor-not-allowed bg-[#1F201C]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#A39F94]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#E3A28E]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#A39F94]">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  helperText,
  error,
  id,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-[#A39F94]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'block w-full rounded-lg bg-[#282923] border border-[#4A4A42] text-[#F5EFE4] placeholder-[#A39F94] text-sm p-3 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#8798B7] focus:border-[#8798B7]',
          error && 'border-[#C6927D] focus:ring-[#C6927D] focus:border-[#C6927D]',
          props.disabled && 'opacity-50 cursor-not-allowed bg-[#1F201C]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#E3A28E]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#A39F94]">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  helperText,
  error,
  id,
  children,
  options,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-[#A39F94]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'block w-full rounded-lg bg-[#282923] border border-[#4A4A42] text-[#F5EFE4] text-sm px-3.5 py-2.5 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#8798B7] focus:border-[#8798B7]',
          error && 'border-[#C6927D] focus:ring-[#C6927D] focus:border-[#C6927D]',
          props.disabled && 'opacity-50 cursor-not-allowed bg-[#1F201C]',
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#282923] text-[#F5EFE4]">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-xs text-[#E3A28E]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#A39F94]">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';

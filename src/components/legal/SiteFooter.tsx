import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface SiteFooterProps {
  onNavigate?: (route: 'app' | 'privacy' | 'terms') => void;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  className = '',
  variant = 'auto',
}) => {
  const handleLinkClick = (e: React.MouseEvent, route: 'privacy' | 'terms') => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.history.pushState({}, '', `/${route}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer and Legal Links"
      className={`w-full border-t border-[#D8CCB9]/60 dark:border-[#3A3B34] py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono transition-colors ${
        variant === 'dark'
          ? 'bg-[#1F201C] text-[#A39F94]'
          : variant === 'light'
          ? 'bg-[#EFE6D6] text-[#5A5B53]'
          : 'bg-transparent text-[#64625A] dark:text-[#A39F94]'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-[#20211E] dark:bg-[#30312C] flex items-center justify-center text-[#F3EBDD]">
            <Compass className="w-3 h-3 text-[#8495B8]" />
          </div>
          <span className="font-bold tracking-tight text-[#20211E] dark:text-[#F4EDE1]">
            AVENZA
          </span>
          <span className="text-[#8A877E] dark:text-[#6E7065] text-[11px]">
            © {currentYear} All rights reserved.
          </span>
        </div>

        {/* Legal Links */}
        <nav aria-label="Legal navigation" className="flex items-center gap-5 sm:gap-6">
          <a
            href="/privacy"
            onClick={(e) => handleLinkClick(e, 'privacy')}
            className="text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1] hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#8495B8] focus-visible:outline-none rounded transition-colors text-[11px] font-semibold"
          >
            Privacy Policy
          </a>
          <span className="text-[#D8CCB9] dark:text-[#4A4D43] select-none" aria-hidden="true">
            •
          </span>
          <a
            href="/terms"
            onClick={(e) => handleLinkClick(e, 'terms')}
            className="text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1] hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#8495B8] focus-visible:outline-none rounded transition-colors text-[11px] font-semibold"
          >
            Terms & Conditions
          </a>
        </nav>
      </div>
    </footer>
  );
};

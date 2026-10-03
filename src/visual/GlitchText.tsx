import React, { useState, useEffect, useRef } from 'react';

interface GlitchTextProps {
  text: string;
  triggerKey?: string | number;
  className?: string;
  scrambleChars?: string;
  durationMs?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  triggerKey,
  className = '',
  scrambleChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789_#@<>[]*&',
  durationMs = 450,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    setIsGlitching(true);

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);

      if (progress < 0.35) {
        // Phase 1: Letter-doubling glitch phase (e.g. "HHAARRMMOONNIICC")
        const doubled = text
          .split('')
          .map((ch) => (ch === ' ' ? ' ' : ch + ch))
          .join('')
          .slice(0, text.length + 4);
        
        // Randomly replace some with scramble characters
        const scrambled = doubled
          .split('')
          .map((ch, i) => (Math.random() > 0.4 ? scrambleChars[Math.floor(Math.random() * scrambleChars.length)] : ch))
          .join('');

        setDisplayText(scrambled);
      } else if (progress < 1.0) {
        // Phase 2: Resolving letter by letter
        const resolvedCount = Math.floor(progress * text.length);
        const current = text
          .split('')
          .map((char, index) => {
            if (index < resolvedCount) return char;
            if (char === ' ') return ' ';
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('');

        setDisplayText(current);
      } else {
        // Phase 3: Final clean text
        setDisplayText(text);
        setIsGlitching(false);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [text, triggerKey, durationMs, scrambleChars]);

  return (
    <span
      className={`font-mono transition-colors ${
        isGlitching ? 'text-[#2F63B8] dark:text-[#7DB8FF] select-none' : ''
      } ${className}`}
    >
      {displayText}
    </span>
  );
};

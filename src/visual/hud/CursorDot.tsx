import React, { useEffect, useState, useRef } from 'react';

export const CursorDot: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('interactive-node'))
      ) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const updateCursor = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.22;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.22;

      if (dotRef.current) {
        const size = isHovering.current ? 34 : 10;
        const offset = size / 2;
        dotRef.current.style.transform = `translate3d(${currentPos.current.x - offset}px, ${
          currentPos.current.y - offset
        }px, 0)`;
        dotRef.current.style.width = `${size}px`;
        dotRef.current.style.height = `${size}px`;
        dotRef.current.style.backgroundColor = isHovering.current
          ? 'rgba(132, 149, 184, 0.20)'
          : 'rgba(132, 149, 184, 0.55)';
        dotRef.current.style.borderColor = isHovering.current
          ? 'rgba(79, 98, 136, 0.85)'
          : 'rgba(216, 204, 185, 0.90)';
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#D8CCB9] transition-[width,height,background-color] duration-150 backdrop-blur-[1px]"
      style={{ willChange: 'transform' }}
    />
  );
};

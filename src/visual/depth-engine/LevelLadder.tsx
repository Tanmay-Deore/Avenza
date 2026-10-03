import React, { useEffect, useState } from 'react';

interface LevelLadderProps {
  currentLevel: number;
  targetLevel: number;
  verifiedLevel?: number;
  maxLevel?: number;
  isHot: boolean; // Hovered or Focused
}

export const LevelLadder: React.FC<LevelLadderProps> = ({
  currentLevel = 0,
  targetLevel = 5,
  verifiedLevel = 0,
  maxLevel = 5,
  isHot,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isHot) {
      setHasAnimated(true);
    }
  }, [isHot]);

  if (!isHot && !hasAnimated) {
    return null;
  }

  const isVerified = verifiedLevel > 0;
  const activeLevel = isVerified ? verifiedLevel : currentLevel;
  const steps = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div
      className={`absolute bottom-3 right-3 pointer-events-none transition-all duration-500 transform-style-3d ${
        isHot ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        transform: 'translateZ(60px)',
      }}
      aria-hidden="true"
    >
      <div className="flex items-end gap-1.5 p-2 rounded-lg bg-[#1F201C]/90 border border-[#4A4A42] backdrop-blur-md shadow-xl">
        {steps.map((lvl, index) => {
          const isCompleted = lvl <= activeLevel;
          const isGap = lvl > activeLevel && lvl <= targetLevel;
          const isTarget = lvl === targetLevel;

          const stepHeight = 10 + index * 5; // 10px, 15px, 20px, 25px, 30px
          const delay = isHot ? index * 45 : 0;

          let bgStyle = 'bg-[#373832]';
          let borderStyle = 'border-[#4A4A42]';
          let textStyle = 'text-[#A39F94]';

          if (isCompleted) {
            bgStyle = isVerified ? 'bg-[#9BB59F]' : 'bg-[#8798B7]';
            borderStyle = isVerified ? 'border-[#B4CCB8]' : 'border-[#A9B7D0]';
            textStyle = 'text-[#1F201C] font-bold';
          } else if (isGap) {
            // Hatched clay gap
            bgStyle = 'bg-[#C6927D]/30 border-dashed';
            borderStyle = 'border-[#C6927D]';
            textStyle = 'text-[#E3A28E] font-semibold';
          }

          if (isTarget) {
            borderStyle = 'border-2 border-[#D1B46A] shadow-sm shadow-[#D1B46A]/20';
          }

          return (
            <div
              key={lvl}
              className="flex flex-col items-center gap-0.5"
              style={{
                transition: `transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, opacity 300ms ease ${delay}ms`,
                transform: isHot ? 'rotateX(0deg) scaleY(1)' : 'rotateX(-50deg) scaleY(0.4)',
                transformOrigin: 'bottom center',
                opacity: isHot ? 1 : 0,
              }}
            >
              <div
                className={`w-3.5 rounded-sm border ${bgStyle} ${borderStyle} flex items-center justify-center transition-colors`}
                style={{
                  height: `${stepHeight}px`,
                }}
              >
                {isTarget && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D1B46A] animate-pulse" />
                )}
              </div>
              <span className={`text-[8px] font-mono leading-none ${textStyle}`}>
                L{lvl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

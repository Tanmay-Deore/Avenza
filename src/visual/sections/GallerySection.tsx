import React from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { GlitchText } from '../GlitchText';
import { MODULE_PANELS } from '../GlassPanelGroup';
import {
  Layers,
  Map,
  Bot,
  Compass,
  Zap,
  Award,
  ArrowRight,
  RotateCw,
  Sparkles,
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { state, openModuleDrawer, triggerRerouteAnimation } = useVisual();
  const { passport, journey } = useAvenza();

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'skills':
        return <Layers className="w-5 h-5 text-[#4F6288] dark:text-[#9FB0D3]" />;
      case 'journey':
        return <Map className="w-5 h-5 text-[#4C6650] dark:text-[#B0BFA9]" />;
      case 'mentor':
        return <Bot className="w-5 h-5 text-[#5E5277] dark:text-[#D4CBE5]" />;
      case 'discover':
        return <Compass className="w-5 h-5 text-[#8A5440] dark:text-[#D3A18B]" />;
      case 'verification':
        return <Zap className="w-5 h-5 text-[#4C6650] dark:text-[#B0BFA9]" />;
      case 'passport':
        return <Award className="w-5 h-5 text-[#4F6288] dark:text-[#9FB0D3]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#4F6288] dark:text-[#9FB0D3]" />;
    }
  };

  return (
    <div className="relative z-20 space-y-48 py-24 pointer-events-none">
      {MODULE_PANELS.map((panel, idx) => {
        const isLeft = idx % 2 === 0;
        const isActive = state.activePanelIndex === idx;

        return (
          <section
            key={panel.id}
            id={`gallery-${panel.id}`}
            className={`min-h-[80vh] flex items-center ${
              isLeft ? 'justify-start pl-6 sm:pl-16' : 'justify-end pr-6 sm:pr-16'
            }`}
          >
            <div
              className={`max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#F8F4EC] dark:bg-[#242520] border border-[#D8CCB9] dark:border-[#3B3E36] shadow-xl space-y-5 pointer-events-auto transition-all duration-300 ${
                isActive
                  ? 'ring-2 ring-[#8495B8]/60 dark:ring-[#9FB0D3]/60 scale-100'
                  : 'opacity-90 hover:opacity-100 scale-98'
              }`}
            >
              {/* Badge & Module Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36]">
                    {getModuleIcon(panel.id)}
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-[#4F6288] dark:text-[#9FB0D3]">
                    {panel.number} // {panel.badge}
                  </span>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE3D2] dark:bg-[#2E302B] text-[#64625A] dark:text-[#BDB5A6] border border-[#D8CCB9] dark:border-[#3B3E36]">
                  INTERACTIVE
                </span>
              </div>

              {/* Title with letter-doubling & scramble */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#20211E] dark:text-[#F4EDE1] uppercase">
                  <GlitchText text={panel.title} triggerKey={state.activePanelIndex === idx ? idx : panel.id} />
                </h3>
                <p className="text-xs text-[#5A5B53] dark:text-[#D2C9BB] mt-1 font-medium">
                  {panel.subtitle}
                </p>
              </div>

              {/* Real Data Metrics & Highlights */}
              <div className="p-3.5 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] border border-[#D8CCB9] dark:border-[#3B3E36] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#64625A] dark:text-[#BDB5A6]">{panel.metricLabel}</span>
                  <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">
                    {panel.id === 'skills'
                      ? `${passport.verifiedSkillsCount} Verified`
                      : panel.id === 'journey'
                      ? `${journey.filter((s) => s.status === 'COMPLETED').length} / ${journey.length} Steps`
                      : panel.metricValue}
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#D8CCB9] dark:border-[#3B3E36]">
                  {panel.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-[#5A5B53] dark:text-[#D2C9BB]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: panel.rimColor }} />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                {/* Primary CTA: Background #20211E, Text #F8F4EC */}
                <button
                  onClick={() => openModuleDrawer(panel.id)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#20211E] hover:bg-[#32332E] text-[#F8F4EC] font-mono font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>LAUNCH {panel.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {panel.id === 'journey' && (
                  <button
                    onClick={triggerRerouteAnimation}
                    className="p-3 rounded-xl bg-[#EDE3D2] dark:bg-[#2E302B] hover:bg-[#E8DDCB] dark:hover:bg-[#383A35] border border-[#D8CCB9] dark:border-[#3B3E36] text-[#20211E] dark:text-[#F4EDE1] transition-colors"
                    title="Simulate Real-time Path Recalculation"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

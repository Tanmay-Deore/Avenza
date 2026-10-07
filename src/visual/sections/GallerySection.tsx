import React from 'react';
import { useVisual } from '../visualStateStore';
import { useAvenza } from '../../state/AppContext';
import { GlitchText } from '../GlitchText';
import { MODULE_PANELS } from '../GlassPanelGroup';
import { SkillMapCard3DLayer } from './SkillMapCard3DLayer';
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
            <SkillMapCard3DLayer
              panel={panel}
              idx={idx}
              isActive={isActive}
              getModuleIcon={getModuleIcon}
              openModuleDrawer={openModuleDrawer}
              verifiedSkillsCount={passport.verifiedSkillsCount}
              metricValue={
                panel.id === 'skills'
                  ? `${passport.verifiedSkillsCount} Verified`
                  : panel.id === 'journey'
                  ? `${journey.filter((s) => s.status === 'COMPLETED').length} / ${journey.length} Steps`
                  : panel.metricValue
              }
              triggerRerouteAnimation={panel.id === 'journey' ? triggerRerouteAnimation : undefined}
            />
          </section>
        );
      })}
    </div>
  );
};

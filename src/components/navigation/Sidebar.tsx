import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { NavigationTab } from '../../types';
import { cn } from '../../design-system/utils';
import {
  Home,
  Map,
  Layers,
  Compass,
  Zap,
  Bot,
  Award,
  User,
  AlertCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, skillGaps, journey } = useAvenza();

  const criticalGapsCount = skillGaps.filter((g) => g.gapSeverity === 'CRITICAL').length;
  const inProgressStepsCount = journey.filter((s) => s.status === 'IN_PROGRESS').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    description: string;
  }[] = [
    {
      id: 'home',
      label: 'Today',
      icon: <Home className="w-4 h-4" />,
      description: 'Daily action & focus',
    },
    {
      id: 'journey',
      label: 'Journey',
      icon: <Map className="w-4 h-4" />,
      badge: inProgressStepsCount > 0 ? 'Active' : undefined,
      badgeColor: 'bg-[#8798B7]/16 text-[#A9B7D0] border-[#8798B7]/50',
      description: 'Personalized path',
    },
    {
      id: 'skills',
      label: 'Skills & Gaps',
      icon: <Layers className="w-4 h-4" />,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} gaps` : undefined,
      badgeColor: 'bg-[#C6927D]/16 text-[#E3A28E] border-[#C6927D]/50',
      description: 'Diagnostic & matrix',
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: <Compass className="w-4 h-4" />,
      description: 'Explore directions',
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: <Zap className="w-4 h-4" />,
      description: 'Practical lab & code',
    },
    {
      id: 'mentor',
      label: 'AI Mentor',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI',
      badgeColor: 'bg-[#A79BC4]/16 text-[#BDB2D6] border-[#A79BC4]/50',
      description: 'Contextual tutor',
    },
    {
      id: 'passport',
      label: 'Skill Passport',
      icon: <Award className="w-4 h-4" />,
      description: 'Verified proof ledger',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      description: 'Goals & pace',
    },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:min-h-[calc(100vh-4rem)] p-4 bg-[#242520] lg:border-r border-[#3A3B34] flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A39F94]">
          Navigation System
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group text-left border-l-2',
                  isActive
                    ? 'bg-[#30312C] text-[#F5EFE4] border-l-[#8798B7] border-t border-r border-b border-[#4A4A42] shadow-sm'
                    : 'text-[#BDB5A7] hover:text-[#F5EFE4] hover:bg-[#30312C]/60 border-l-transparent border-t-transparent border-r-transparent border-b-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      isActive ? 'bg-[#373832] text-[#8798B7]' : 'bg-[#282923] text-[#A39F94] group-hover:text-[#F5EFE4]'
                    )}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className="text-[10px] font-normal text-[#A39F94] hidden sm:block">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border',
                      item.badgeColor || 'bg-[#30312C] text-[#BDB5A7] border-[#4A4A42]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mission Assistant Prompt */}
      <div className="hidden lg:block mt-6 p-3.5 rounded-xl bg-[#282923] border border-[#3A3B34] text-xs">
        <div className="flex items-center gap-2 text-[#A9B7D0] font-semibold mb-1">
          <Bot className="w-4 h-4 text-[#8798B7]" />
          <span>AI Navigator Ready</span>
        </div>
        <p className="text-[11px] text-[#A39F94] mb-2 leading-relaxed">
          Need guidance on your active mission or want to explore new directions?
        </p>
        <button
          onClick={() => setActiveTab('mentor')}
          className="w-full text-center py-1.5 px-2.5 rounded-lg bg-[#30312C] hover:bg-[#373832] text-[#A9B7D0] hover:text-[#F5EFE4] font-semibold text-[11px] border border-[#4A4A42] transition-colors"
        >
          Ask Mentor →
        </button>
      </div>
    </aside>
  );
};

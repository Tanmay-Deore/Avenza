import React from 'react';
import { cn } from './utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'boxed';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className,
}) => {
  if (variant === 'boxed') {
    return (
      <div className={cn('flex items-center p-1 bg-[#121826] border border-[#26354D] rounded-xl gap-1', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#182234]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-mono',
                    isActive ? 'bg-blue-700 text-white' : 'bg-[#26354D] text-gray-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={cn('flex space-x-6 border-b border-[#26354D]', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] bg-[#182234] text-gray-300 px-1.5 py-0.5 rounded-full border border-[#26354D]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default pills
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              isActive
                ? 'bg-[#1F2C42] border-blue-500/50 text-blue-400 shadow-sm'
                : 'bg-[#182234]/60 border-[#26354D] text-gray-400 hover:text-gray-200 hover:border-gray-600'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[10px] bg-[#121826] text-gray-300 px-1.5 py-0.2 rounded-full border border-[#26354D]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

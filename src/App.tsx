import React, { useState, useEffect } from 'react';
import { AppProvider, useAvenza } from './state/AppContext';
import { VisualProvider, useVisual } from './visual/visualStateStore';
import { CinematicView } from './visual/CinematicView';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { JourneyView } from './components/journey/JourneyView';
import { SkillsView } from './components/skills/SkillsView';
import { DiscoverView } from './components/discovery/DiscoverView';
import { MissionsView } from './components/missions/MissionsView';
import { MentorView } from './components/mentor/MentorView';
import { SkillPassportView } from './components/passport/SkillPassportView';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { VerificationModal } from './components/verification/VerificationModal';
import { PrivacyPolicyView } from './components/legal/PrivacyPolicyView';
import { TermsView } from './components/legal/TermsView';
import { SiteFooter } from './components/legal/SiteFooter';
import { updatePageMetadata } from './services/siteConfig';
import { Compass, Sparkles } from 'lucide-react';

export type AppRoute = 'app' | 'privacy' | 'terms';

export function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'app';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === '/privacy' || path.startsWith('/privacy/') || hash === '#privacy' || hash === '#/privacy') {
    return 'privacy';
  }
  if (path === '/terms' || path.startsWith('/terms/') || hash === '#terms' || hash === '#/terms') {
    return 'terms';
  }
  return 'app';
}

const WorkspaceLayout: React.FC<{ onNavigate: (route: AppRoute) => void }> = ({ onNavigate }) => {
  const { activeTab, isOnboardingOpen } = useAvenza();
  const { setViewMode, state } = useVisual();
  const [isManualOnboardingOpen, setIsManualOnboardingOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView />;
      case 'journey':
        return <JourneyView />;
      case 'skills':
        return <SkillsView />;
      case 'discover':
        return <DiscoverView />;
      case 'missions':
        return <MissionsView />;
      case 'mentor':
        return <MentorView />;
      case 'passport':
        return <SkillPassportView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  const isBright = state.theme === 'bright';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
        isBright
          ? 'bg-[#F3EBDD] text-[#20211E]'
          : 'bg-[#1B1C19] text-[#F4EDE1]'
      }`}
    >
      {/* Top Banner to toggle back to 3D Cinematic Navigator */}
      <div className="bg-[#20211E] dark:bg-[#242520] border-b border-[#57584E]/30 px-4 py-2 text-[#F8F4EC] dark:text-[#F4EDE1] text-xs font-mono font-bold flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4B56B]" />
          <span>FULL PRODUCT WORKSPACE ACTIVE</span>
        </div>
        <button
          onClick={() => setViewMode('cinematic')}
          className="px-3 py-1 rounded-full bg-[#32332E] hover:bg-[#3D4039] text-[#F8F4EC] font-mono text-xs transition-colors flex items-center gap-1.5 border border-[#57584E]/50"
        >
          <Compass className="w-3.5 h-3.5 text-[#8495B8]" />
          <span>Return to 3D Cinematic Navigator →</span>
        </button>
      </div>

      {/* Top Navigation */}
      <Navbar onOpenOnboarding={() => setIsManualOnboardingOpen(true)} />

      {/* Main Body with Sidebar + Content View */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Minimal Site Footer for Legal & Copyright */}
      <SiteFooter onNavigate={onNavigate} variant={isBright ? 'light' : 'dark'} />

      {/* Global Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen || isManualOnboardingOpen}
        onClose={() => setIsManualOnboardingOpen(false)}
      />

      <VerificationModal />
    </div>
  );
};

const RootAppContent: React.FC = () => {
  const { state } = useVisual();
  const { isOnboardingOpen } = useAvenza();
  const [isManualOnboardingOpen, setIsManualOnboardingOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    const targetPath = route === 'app' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentRoute === 'app') {
      updatePageMetadata({
        title: 'AVENZA — AI-Powered Navigation for Learning and Career Growth',
        description: 'Avenza helps you understand where you are, what you actually know, what skills you are missing, and dynamically navigates you to your goal.',
        path: '/',
      });
    }
  }, [currentRoute]);

  if (currentRoute === 'privacy') {
    return <PrivacyPolicyView onNavigate={navigateTo} />;
  }

  if (currentRoute === 'terms') {
    return <TermsView onNavigate={navigateTo} />;
  }

  if (state.viewMode === 'cinematic') {
    return (
      <>
        <CinematicView />
        <OnboardingModal
          isOpen={isOnboardingOpen || isManualOnboardingOpen}
          onClose={() => setIsManualOnboardingOpen(false)}
        />
        <VerificationModal />
      </>
    );
  }

  return <WorkspaceLayout onNavigate={navigateTo} />;
};

export function App() {
  return (
    <AppProvider>
      <VisualProvider>
        <RootAppContent />
      </VisualProvider>
    </AppProvider>
  );
}

export default App;

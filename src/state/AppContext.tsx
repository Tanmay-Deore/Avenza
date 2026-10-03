import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  Skill,
  Goal,
  JourneyStep,
  Mission,
  SkillPassport,
  MentorMessage,
  RerouteEvent,
  NavigationTab,
  SkillGap,
  VerificationResult,
} from '../types';
import {
  loadSavedState,
  saveAllState,
  resetApplicationState,
  getDefaultInitialState,
} from '../services/storageService';
import { calculateSkillGaps } from '../services/gapEngine';
import { generatePersonalizedPath, rerouteLearningPath } from '../services/pathEngine';
import { generateMentorResponse, MentorContext } from '../services/mentorEngine';
import { createEvidenceFromVerification } from '../services/verificationEngine';
import { createEvidenceFromMission } from '../services/missionEngine';

interface AppContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Data
  user: UserProfile;
  skills: Record<string, Skill>;
  journey: JourneyStep[];
  missions: Record<string, Mission>;
  passport: SkillPassport;
  mentorMessages: MentorMessage[];
  reroutes: RerouteEvent[];
  skillGaps: SkillGap[];

  // Active Focus
  activeStep: JourneyStep | null;
  activeMission: Mission | null;
  latestReroute: RerouteEvent | null;
  
  // Modals & Action Controls
  isVerificationModalOpen: boolean;
  verifyingSkillId: string | null;
  isMissionModalOpen: boolean;
  activeMissionId: string | null;
  isOnboardingOpen: boolean;
  isRerouteToastOpen: boolean;
  selectedJourneyStep: JourneyStep | null;
  
  // Actions
  openVerificationModal: (skillId: string) => void;
  closeVerificationModal: () => void;
  openMissionModal: (missionId: string) => void;
  closeMissionModal: () => void;
  openStepDetail: (step: JourneyStep) => void;
  closeStepDetail: () => void;
  dismissRerouteToast: () => void;
  
  // Business Logic
  setUserGoal: (goal: Goal) => void;
  updateUserDailyTime: (minutes: number) => void;
  completeOnboarding: (profile: Partial<UserProfile>, chosenGoal: Goal | null) => void;
  submitVerificationResult: (result: VerificationResult) => void;
  completeMissionTask: (missionId: string) => void;
  sendMentorQuery: (text: string) => void;
  triggerManualReroute: (trigger: RerouteEvent['trigger'], params?: any) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialData] = useState(() => loadSavedState());

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [user, setUser] = useState<UserProfile>(initialData.userProfile);
  const [skills, setSkills] = useState<Record<string, Skill>>(initialData.skills);
  const [journey, setJourney] = useState<JourneyStep[]>(initialData.journey);
  const [missions, setMissions] = useState<Record<string, Mission>>(initialData.missions);
  const [passport, setPassport] = useState<SkillPassport>(initialData.passport);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>(initialData.mentorMessages);
  const [reroutes, setReroutes] = useState<RerouteEvent[]>(initialData.reroutes);

  // Modals & ephemeral state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifyingSkillId, setVerifyingSkillId] = useState<string | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [selectedJourneyStep, setSelectedJourneyStep] = useState<JourneyStep | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!initialData.userProfile.onboardingCompleted);
  const [isRerouteToastOpen, setIsRerouteToastOpen] = useState(false);

  // Derived state
  const skillGaps = calculateSkillGaps(user.currentGoal, skills);
  const activeStep = journey.find((s) => s.status === 'IN_PROGRESS') || journey[0] || null;
  const activeMission = activeMissionId ? (missions[activeMissionId] || null) : null;
  const latestReroute = reroutes.length > 0 ? reroutes[0] : null;

  // Sync to localStorage
  useEffect(() => {
    saveAllState({
      userProfile: user,
      skills,
      journey,
      missions,
      passport,
      mentorMessages,
      reroutes,
    });
  }, [user, skills, journey, missions, passport, mentorMessages, reroutes]);

  // Modal Handlers
  const openVerificationModal = useCallback((skillId: string) => {
    setVerifyingSkillId(skillId);
    setIsVerificationModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsVerificationModalOpen(false);
    setVerifyingSkillId(null);
  }, []);

  const openMissionModal = useCallback((missionId: string) => {
    setActiveMissionId(missionId);
    setIsMissionModalOpen(true);
  }, []);

  const closeMissionModal = useCallback(() => {
    setIsMissionModalOpen(false);
    setActiveMissionId(null);
  }, []);

  const openStepDetail = useCallback((step: JourneyStep) => {
    setSelectedJourneyStep(step);
  }, []);

  const closeStepDetail = useCallback(() => {
    setSelectedJourneyStep(null);
  }, []);

  const dismissRerouteToast = useCallback(() => {
    setIsRerouteToastOpen(false);
  }, []);

  // Action: Set Goal
  const setUserGoal = useCallback((goal: Goal) => {
    setUser((prev) => ({ ...prev, currentGoal: goal }));
    const newJourney = generatePersonalizedPath(
      goal,
      skills,
      user.availableMinutesPerDay,
      user.level
    );
    setJourney(newJourney);

    const rerouteEvent: RerouteEvent = {
      id: `reroute-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trigger: 'GOAL_CHANGE',
      reason: `Switched destination to: ${goal.title}`,
      whatChanged: `Generated a fresh personalized path with ${newJourney.length} milestone steps targeting ${goal.targetRoleOrSkill}.`,
      whyItChanged: `Path automatically recalibrated to align with ${goal.title} requirements.`,
      nextActionRecommendation: `Begin with your first checkpoint in your Journey tab.`,
    };

    setReroutes((prev) => [rerouteEvent, ...prev]);
    setIsRerouteToastOpen(true);
  }, [skills, user.availableMinutesPerDay, user.level]);

  // Action: Update Daily Time
  const updateUserDailyTime = useCallback((minutes: number) => {
    setUser((prev) => ({ ...prev, availableMinutesPerDay: minutes }));
    const { updatedPath, rerouteEvent } = rerouteLearningPath(journey, 'TIME_CHANGE', {
      newMinutesPerDay: minutes,
    });
    setJourney(updatedPath);
    setReroutes((prev) => [rerouteEvent, ...prev]);
    setIsRerouteToastOpen(true);
  }, [journey]);

  // Action: Onboarding Complete
  const completeOnboarding = useCallback((profileData: Partial<UserProfile>, chosenGoal: Goal | null) => {
    const updatedUser: UserProfile = {
      ...user,
      ...profileData,
      currentGoal: chosenGoal || user.currentGoal,
      onboardingCompleted: true,
    };
    setUser(updatedUser);

    if (chosenGoal) {
      const newPath = generatePersonalizedPath(
        chosenGoal,
        skills,
        updatedUser.availableMinutesPerDay,
        updatedUser.level
      );
      setJourney(newPath);
    }
    setIsOnboardingOpen(false);
  }, [user, skills]);

  // Action: Complete Verification
  const submitVerificationResult = useCallback((result: VerificationResult) => {
    const skillId = result.skillId;
    const evidenceItem = createEvidenceFromVerification(result);

    // 1. Update Skill State
    setSkills((prev) => {
      const existing = prev[skillId];
      if (!existing) return prev;

      const newVerifiedLevel = Math.max(existing.verifiedLevel, result.awardedLevel);
      const newStatus = result.passed ? 'VERIFIED' : 'WEAK';

      return {
        ...prev,
        [skillId]: {
          ...existing,
          verifiedLevel: newVerifiedLevel,
          currentLevel: Math.max(existing.currentLevel, newVerifiedLevel),
          confidence: result.score,
          status: newStatus,
          lastVerification: result.timestamp,
          evidence: [evidenceItem, ...existing.evidence],
        },
      };
    });

    // 2. Update Passport
    setPassport((prev) => {
      const existingComp = prev.demonstratedCompetencies.filter((c) => c.skillName !== result.skillName);
      return {
        ...prev,
        lastUpdated: result.timestamp,
        verifiedSkillsCount: prev.verifiedSkillsCount + (result.passed ? 1 : 0),
        demonstratedCompetencies: [
          ...existingComp,
          {
            skillName: result.skillName,
            level: result.awardedLevel,
            evidenceCount: 1,
            verifiedDate: result.timestamp.split('T')[0],
          },
        ],
        evidenceLedger: [evidenceItem, ...prev.evidenceLedger],
      };
    });

    // 3. Adapt Path based on result
    if (result.passed && result.score >= 80) {
      const { updatedPath, rerouteEvent } = rerouteLearningPath(journey, 'FAST_IMPROVEMENT', {
        verifiedSkillId: skillId,
      });
      setJourney(updatedPath);
      setReroutes((prev) => [rerouteEvent, ...prev]);
      setIsRerouteToastOpen(true);
    } else if (!result.passed) {
      const { updatedPath, rerouteEvent } = rerouteLearningPath(journey, 'STRUGGLE', {
        struggledSkillId: skillId,
      });
      setJourney(updatedPath);
      setReroutes((prev) => [rerouteEvent, ...prev]);
      setIsRerouteToastOpen(true);
    }

    closeVerificationModal();
  }, [journey, closeVerificationModal]);

  // Action: Complete Mission
  const completeMissionTask = useCallback((missionId: string) => {
    const mission = missions[missionId];
    if (!mission) return;

    const evidence = createEvidenceFromMission(mission);

    // Update Mission state
    setMissions((prev) => ({
      ...prev,
      [missionId]: {
        ...mission,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        evidenceGenerated: evidence,
      },
    }));

    // Update Passport
    setPassport((prev) => ({
      ...prev,
      completedMissionsCount: prev.completedMissionsCount + 1,
      lastUpdated: new Date().toISOString(),
      evidenceLedger: [evidence, ...prev.evidenceLedger],
    }));

    // Advance Journey step associated with this mission
    setJourney((prev) => {
      let foundActive = false;
      return prev.map((step) => {
        if (step.missionId === missionId || (step.skills.some(s => mission.skills.includes(s)) && step.status === 'IN_PROGRESS')) {
          foundActive = true;
          return { ...step, status: 'COMPLETED' as const };
        }
        if (foundActive && step.status === 'UPCOMING') {
          foundActive = false;
          return { ...step, status: 'IN_PROGRESS' as const };
        }
        return step;
      });
    });

    closeMissionModal();
  }, [missions, closeMissionModal]);

  // Action: Mentor Message
  const sendMentorQuery = useCallback((userText: string) => {
    const userMsg: MentorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: userText,
      timestamp: new Date().toISOString(),
    };

    setMentorMessages((prev) => [...prev, userMsg]);

    // Generate Context-aware response
    setTimeout(() => {
      const mentorCtx: MentorContext = {
        user,
        goal: user.currentGoal,
        activeStep,
        gaps: skillGaps,
        skills,
      };
      const reply = generateMentorResponse(userText, mentorCtx);
      setMentorMessages((prev) => [...prev, reply]);
    }, 450);
  }, [user, activeStep, skillGaps, skills]);

  // Action: Trigger Manual Reroute Simulation
  const triggerManualReroute = useCallback((trigger: RerouteEvent['trigger'], params?: any) => {
    const { updatedPath, rerouteEvent } = rerouteLearningPath(journey, trigger, {
      ...params,
      userSkills: skills,
    });
    setJourney(updatedPath);
    setReroutes((prev) => [rerouteEvent, ...prev]);
    setIsRerouteToastOpen(true);
  }, [journey, skills]);

  // Action: Reset
  const resetAllData = useCallback(() => {
    const fresh = resetApplicationState();
    setUser(fresh.userProfile);
    setSkills(fresh.skills);
    setJourney(fresh.journey);
    setMissions(fresh.missions);
    setPassport(fresh.passport);
    setMentorMessages(fresh.mentorMessages);
    setReroutes(fresh.reroutes);
    setActiveTab('home');
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        skills,
        journey,
        missions,
        passport,
        mentorMessages,
        reroutes,
        skillGaps,
        activeStep,
        activeMission,
        latestReroute,
        isVerificationModalOpen,
        verifyingSkillId,
        isMissionModalOpen,
        activeMissionId,
        isOnboardingOpen,
        isRerouteToastOpen,
        selectedJourneyStep,
        openVerificationModal,
        closeVerificationModal,
        openMissionModal,
        closeMissionModal,
        openStepDetail,
        closeStepDetail,
        dismissRerouteToast,
        setUserGoal,
        updateUserDailyTime,
        completeOnboarding,
        submitVerificationResult,
        completeMissionTask,
        sendMentorQuery,
        triggerManualReroute,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAvenza = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAvenza must be used within an AppProvider');
  }
  return context;
};

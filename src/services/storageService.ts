import {
  UserProfile,
  Skill,
  Goal,
  JourneyStep,
  Mission,
  SkillPassport,
  MentorMessage,
  RerouteEvent,
  EvidenceItem,
} from '../types';
import { SKILL_TAXONOMY, STANDARD_GOALS } from './skillTaxonomy';
import { generatePersonalizedPath } from './pathEngine';
import { MISSIONS_REGISTRY } from './missionEngine';
import { generateContextualWelcome } from './mentorEngine';
import { calculateSkillGaps } from './gapEngine';

const STORAGE_KEYS = {
  USER_PROFILE: 'avenza_user_profile_v1',
  SKILLS: 'avenza_skills_v1',
  JOURNEY: 'avenza_journey_v1',
  MISSIONS: 'avenza_missions_v1',
  PASSPORT: 'avenza_passport_v1',
  MENTOR_CHAT: 'avenza_mentor_chat_v1',
  REROUTES: 'avenza_reroutes_v1',
};

export function getDefaultInitialState() {
  const defaultGoal = STANDARD_GOALS[0]; // AI / ML Engineer

  const userProfile: UserProfile = {
    id: 'user-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    level: 'SOME_BASICS',
    interests: ['Artificial Intelligence', 'Data Science', 'Automation'],
    existingSkills: [
      { name: 'Python Fundamentals', level: 2 },
      { name: 'Git & Version Control', level: 2 },
      { name: 'Statistics & Probability', level: 1 },
    ],
    availableMinutesPerDay: 30,
    currentGoal: defaultGoal,
    streakDays: 4,
    totalMinutesSpent: 240,
    onboardingCompleted: true,
  };

  const initialSkills: Record<string, Skill> = {};

  // Initialize all skills from taxonomy
  Object.values(SKILL_TAXONOMY).forEach((def) => {
    let currentLevel = 0;
    let verifiedLevel = 0;
    let status: Skill['status'] = 'NOT_YET_STARTED';
    const evidence: EvidenceItem[] = [];

    if (def.id === 'python-core') {
      currentLevel = 2;
      verifiedLevel = 2;
      status = 'VERIFIED';
      evidence.push({
        id: 'ev-init-py',
        title: 'Python Core Assessment & Diagnostic',
        type: 'ASSESSMENT',
        skillId: 'python-core',
        skillName: 'Python Fundamentals',
        levelEarned: 2,
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        proofSummary: 'Verified functions, dictionary manipulation, and list comprehensions with 85% accuracy score.',
        verifiedBy: 'Avenza Diagnostic Verification Suite',
      });
    } else if (def.id === 'git-workflow') {
      currentLevel = 2;
      verifiedLevel = 2;
      status = 'VERIFIED';
      evidence.push({
        id: 'ev-init-git',
        title: 'Git Practical Workflow Assessment',
        type: 'PRACTICAL_TASK',
        skillId: 'git-workflow',
        skillName: 'Git & Version Control',
        levelEarned: 2,
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        proofSummary: 'Verified branch management, commit histories, and pull request workflow.',
        verifiedBy: 'Avenza Task Runner',
      });
    } else if (def.id === 'statistics-prob') {
      currentLevel = 1;
      verifiedLevel = 0;
      status = 'WEAK';
    } else if (def.id === 'numpy-pandas') {
      currentLevel = 1;
      verifiedLevel = 0;
      status = 'LEARNING';
    } else if (def.id === 'machine-learning-core') {
      currentLevel = 0;
      verifiedLevel = 0;
      status = 'RECOMMENDED';
    }

    initialSkills[def.id] = {
      id: def.id,
      name: def.name,
      category: def.category,
      currentLevel,
      verifiedLevel,
      confidence: verifiedLevel > 0 ? 85 : currentLevel > 0 ? 40 : 0,
      requiredLevel: defaultGoal.requiredSkills.find(r => r.skillId === def.id)?.requiredLevel || 3,
      status,
      lastVerification: evidence[0]?.timestamp,
      relatedSkills: def.relatedSkills,
      prerequisites: def.prerequisites,
      evidence,
      completedProjects: [],
      relatedMissions: [def.id],
      description: def.description,
      whyItMatters: def.whyItMatters,
    };
  });

  // Generate dynamic path
  const journey = generatePersonalizedPath(
    defaultGoal,
    initialSkills,
    userProfile.availableMinutesPerDay,
    userProfile.level
  );

  // Seed passport
  const passport: SkillPassport = {
    userId: userProfile.id,
    userName: userProfile.name,
    targetRole: defaultGoal.targetRoleOrSkill,
    passportId: `AVZ-2026-98214`,
    issuedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastUpdated: new Date().toISOString(),
    verifiedSkillsCount: 2,
    totalSkillsTracked: Object.keys(initialSkills).length,
    demonstratedCompetencies: [
      {
        skillName: 'Python Fundamentals',
        level: 2,
        evidenceCount: 1,
        verifiedDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      },
      {
        skillName: 'Git & Version Control',
        level: 2,
        evidenceCount: 1,
        verifiedDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      },
    ],
    evidenceLedger: [
      initialSkills['python-core'].evidence[0],
      initialSkills['git-workflow'].evidence[0],
    ],
    badges: [
      {
        id: 'badge-navigator',
        name: 'First Compass Set',
        description: 'Selected primary career destination and established baseline diagnostic.',
        icon: 'Compass',
        earnedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        category: 'Core CS',
      },
      {
        id: 'badge-py-verified',
        name: 'Python Verified (Level 2)',
        description: 'Demonstrated solid functional Python syntax and data structure operations.',
        icon: 'CheckCircle2',
        earnedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        category: 'Programming',
      },
    ],
    completedProjectsCount: 0,
    completedMissionsCount: 1,
  };

  const gaps = calculateSkillGaps(defaultGoal, initialSkills);
  const activeStep = journey.find(s => s.status === 'IN_PROGRESS') || journey[0];
  const welcomeMsg = generateContextualWelcome({
    user: userProfile,
    goal: defaultGoal,
    activeStep,
    gaps,
    skills: initialSkills,
  });

  const rerouteHistory: RerouteEvent[] = [
    {
      id: 'reroute-init',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      trigger: 'FAST_IMPROVEMENT',
      reason: 'Python Fundamentals verified at Level 2 during initial onboarding assessment.',
      whatChanged: 'Automatically skipped 3 elementary beginner Python lessons.',
      whyItChanged: 'Your assessment demonstrated verified proficiency in functions and list comprehensions.',
      nextActionRecommendation: 'Jump straight into Data Manipulation with NumPy & Pandas.',
    },
  ];

  return {
    userProfile,
    skills: initialSkills,
    journey,
    missions: MISSIONS_REGISTRY,
    passport,
    mentorMessages: [welcomeMsg],
    reroutes: rerouteHistory,
  };
}

export function loadSavedState() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!savedUser) {
      const initial = getDefaultInitialState();
      saveAllState(initial);
      return initial;
    }

    return {
      userProfile: JSON.parse(savedUser) as UserProfile,
      skills: JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '{}') as Record<string, Skill>,
      journey: JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY) || '[]') as JourneyStep[],
      missions: JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS) || '{}') as Record<string, Mission>,
      passport: JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSPORT) || '{}') as SkillPassport,
      mentorMessages: JSON.parse(localStorage.getItem(STORAGE_KEYS.MENTOR_CHAT) || '[]') as MentorMessage[],
      reroutes: JSON.parse(localStorage.getItem(STORAGE_KEYS.REROUTES) || '[]') as RerouteEvent[],
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return getDefaultInitialState();
  }
}

export function saveAllState(state: {
  userProfile: UserProfile;
  skills: Record<string, Skill>;
  journey: JourneyStep[];
  missions: Record<string, Mission>;
  passport: SkillPassport;
  mentorMessages: MentorMessage[];
  reroutes: RerouteEvent[];
}) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(state.userProfile));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(state.skills));
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(state.journey));
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(state.missions));
    localStorage.setItem(STORAGE_KEYS.PASSPORT, JSON.stringify(state.passport));
    localStorage.setItem(STORAGE_KEYS.MENTOR_CHAT, JSON.stringify(state.mentorMessages));
    localStorage.setItem(STORAGE_KEYS.REROUTES, JSON.stringify(state.reroutes));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}

export function resetApplicationState() {
  localStorage.clear();
  const fresh = getDefaultInitialState();
  saveAllState(fresh);
  return fresh;
}

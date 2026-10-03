export type SkillStatus = 
  | 'KNOWN' 
  | 'LEARNING' 
  | 'WEAK' 
  | 'UNVERIFIED' 
  | 'VERIFIED' 
  | 'RECOMMENDED' 
  | 'NOT_YET_STARTED';

export type SkillCategory = 
  | 'Programming' 
  | 'AI & ML' 
  | 'Data' 
  | 'Frontend' 
  | 'Backend' 
  | 'Cybersecurity' 
  | 'DevOps & Tools' 
  | 'Core CS' 
  | 'Soft Skills';

export type GoalType = 'CAREER' | 'SKILL' | 'PROJECT' | 'LEARNING';

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetRoleOrSkill: string;
  targetLevel: number; // 1 - 5
  description: string;
  estimatedWeeks: number;
  requiredSkills: { skillId: string; skillName: string; requiredLevel: number }[];
  icon: string;
  tags: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'ASSESSMENT' | 'PROJECT' | 'MISSION' | 'PRACTICAL_TASK';
  skillId: string;
  skillName: string;
  levelEarned: number;
  timestamp: string;
  proofSummary: string;
  artifactUrl?: string;
  verifiedBy: string; // e.g. "Avenza Verification Engine"
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  currentLevel: number; // 0 - 5 (0 = none, 1 = beginner, 2 = elementary, 3 = intermediate, 4 = advanced, 5 = mastery)
  verifiedLevel: number; // 0 - 5
  confidence: number; // 0 - 100%
  requiredLevel: number; // For active goal
  status: SkillStatus;
  lastVerification?: string;
  relatedSkills: string[];
  prerequisites: string[];
  evidence: EvidenceItem[];
  completedProjects: string[];
  relatedMissions: string[];
  description: string;
  whyItMatters: string;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  currentLevel: number;
  targetLevel: number;
  status: SkillStatus;
  gapSeverity: 'CRITICAL' | 'MODERATE' | 'MINOR' | 'SATISFIED';
  whatIsMissing: string;
  whyItMatters: string;
  whatLevelNeeded: string;
  whatShouldBeDoneNext: string;
  canSkip: boolean;
}

export type JourneyStepType = 
  | 'TOPIC' 
  | 'ACTION' 
  | 'MISSION' 
  | 'PROJECT' 
  | 'CHECKPOINT' 
  | 'VERIFICATION';

export type JourneyStepStatus = 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'LOCKED';

export interface JourneyStep {
  id: string;
  title: string;
  type: JourneyStepType;
  status: JourneyStepStatus;
  description: string;
  skills: string[]; // skill IDs or names
  estimatedMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  prerequisites: string[];
  actionInstruction: string;
  resources?: { title: string; url: string; type: 'doc' | 'interactive' | 'exercise' }[];
  missionId?: string;
  verificationId?: string;
  isRerouted?: boolean;
  rerouteReason?: string;
  order: number;
}

export interface MissionStep {
  id: string;
  instruction: string;
  hint?: string;
  testCheck: string;
  completed?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  scenario: string;
  whatYouNeed: string[];
  steps: MissionStep[];
  starterCode?: string;
  solutionSnippet?: string;
  successCondition: string;
  estimatedMinutes: number;
  skills: string[];
  category: SkillCategory;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
  evidenceGenerated?: EvidenceItem;
}

export interface VerificationQuestion {
  id: string;
  type: 'MCQ' | 'CODE_FIX' | 'EXPLAIN' | 'OUTPUT_PREDICTION';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswerIndex?: number;
  expectedKeywords?: string[];
  explanation: string;
  difficulty: number; // 1 to 5
  skillAspect: string;
}

export interface VerificationAssessment {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  type: 'MIXED' | 'CONCEPTUAL' | 'PRACTICAL_CODE' | 'PROJECT_EVAL';
  description: string;
  estimatedMinutes: number;
  questions: VerificationQuestion[];
  passingScore: number; // e.g. 70
}

export interface VerificationResult {
  id: string;
  skillId: string;
  skillName: string;
  timestamp: string;
  score: number;
  passed: boolean;
  awardedLevel: number;
  strongAreas: string[];
  areasToImprove: string[];
  areasRequiringEvidence: string[];
  feedback: string;
}

export interface PassportBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: SkillCategory;
}

export interface SkillPassport {
  userId: string;
  userName: string;
  targetRole: string;
  passportId: string;
  issuedDate: string;
  lastUpdated: string;
  verifiedSkillsCount: number;
  totalSkillsTracked: number;
  demonstratedCompetencies: {
    skillName: string;
    level: number;
    evidenceCount: number;
    verifiedDate: string;
  }[];
  evidenceLedger: EvidenceItem[];
  badges: PassportBadge[];
  completedProjectsCount: number;
  completedMissionsCount: number;
}

export interface DiscoveryDirection {
  id: string;
  title: string;
  tagline: string;
  category: SkillCategory;
  difficulty: 'BEGINNER_FRIENDLY' | 'MODERATE' | 'ADVANCED';
  description: string;
  commonSkills: string[];
  exampleProjects: { title: string; desc: string; icon: string }[];
  prerequisites: string[];
  learningDifficultyText: string;
  suggestedStartingPoint: string;
  starterChallenge: {
    title: string;
    scenario: string;
    sampleTask: string;
  };
  matchedInterests: string[];
  matchedStrengths: string[];
  suitabilityScore: number; // 0 - 100 calculated by questionnaire
  tags: string[];
}

export interface MentorAction {
  label: string;
  actionType: 'NAVIGATE' | 'START_MISSION' | 'START_VERIFICATION' | 'REROUTE' | 'EXPLAIN_GAP';
  payload?: any;
}

export interface MentorMessage {
  id: string;
  sender: 'USER' | 'MENTOR' | 'SYSTEM';
  text: string;
  timestamp: string;
  suggestedActions?: MentorAction[];
  contextSnapshot?: {
    goalTitle?: string;
    currentStepTitle?: string;
    activeSkill?: string;
  };
}

export type ExperienceLevel = 'ABSOLUTE_BEGINNER' | 'SOME_BASICS' | 'INTERMEDIATE' | 'ADVANCED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: ExperienceLevel;
  interests: string[];
  existingSkills: { name: string; level: number }[];
  availableMinutesPerDay: number;
  currentGoal: Goal | null;
  streakDays: number;
  totalMinutesSpent: number;
  onboardingCompleted: boolean;
  activeDirectionId?: string;
  uncertainExplorationAnswers?: {
    interests: string[];
    strengths: string[];
    curiosity: string[];
    workStyle: string;
    enjoyedActivities: string[];
  };
}

export interface RerouteEvent {
  id: string;
  timestamp: string;
  trigger: 'STRUGGLE' | 'FAST_IMPROVEMENT' | 'TIME_CHANGE' | 'GOAL_CHANGE' | 'VERIFICATION_CHANGE';
  reason: string;
  whatChanged: string;
  whyItChanged: string;
  nextActionRecommendation: string;
}

export type NavigationTab = 
  | 'home' 
  | 'journey' 
  | 'skills' 
  | 'discover' 
  | 'missions' 
  | 'mentor' 
  | 'passport' 
  | 'profile';

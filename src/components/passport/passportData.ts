import { Skill, SkillPassport, UserProfile, JourneyStep, Mission } from '../../types';
import { SKILL_TAXONOMY } from '../../services/skillTaxonomy';

export interface CompoundCapability {
  id: string;
  name: string;
  description: string;
  requiredSkillIds: string[];
  category: string;
  level: number;
  whatYouCanBuild: string[];
  deliverableExample: {
    title: string;
    description: string;
    tags: string[];
  };
}

export interface SkillTreeNode {
  id: string;
  name: string;
  category: string;
  level: number;
  isVerified: boolean;
  status: string;
  children: SkillTreeNode[];
}

export interface PassportMilestone {
  id: string;
  date: string;
  title: string;
  type: 'DIAGNOSTIC' | 'MISSION' | 'VERIFICATION' | 'GOAL_SET' | 'PASSPORT_ISSUED';
  description: string;
  skillName?: string;
  level?: number;
  proofBadge?: string;
}

// Concrete capability combinations based on Avenza's skill taxonomy
export const COMPOUND_CAPABILITIES: CompoundCapability[] = [
  {
    id: 'cap-scripting-collab',
    name: 'Collaborative Scripting & Automation',
    description: 'Write robust Python automation tools with structured Git version control, branching workflows, and clean code hygiene.',
    requiredSkillIds: ['python-core', 'git-workflow'],
    category: 'Engineering Foundations',
    level: 2,
    whatYouCanBuild: [
      'Automated data ingestion CLI scripts with error logging',
      'Git pre-commit validation workflows & repository hooks',
      'Batch file transformation utilities'
    ],
    deliverableExample: {
      title: 'Repository Automation & Diagnostics CLI',
      description: 'A modular command-line tool written in Python with complete Git branch lifecycle tests and error handling.',
      tags: ['Python 3', 'Git', 'CLI', 'Automation']
    }
  },
  {
    id: 'cap-data-pipelines',
    name: 'Data Pipeline & Exploratory Analysis',
    description: 'Transform raw structured datasets, calculate statistical aggregates, and build reproducible feature pipelines.',
    requiredSkillIds: ['python-core', 'numpy-pandas'],
    category: 'Data Engineering',
    level: 2,
    whatYouCanBuild: [
      'Pandas data cleaning & ETL scripts',
      'Statistical correlation & anomaly detection engines',
      'Automated CSV/JSON dataset validation pipelines'
    ],
    deliverableExample: {
      title: 'Automated CSV Anomaly & Profile Generator',
      description: 'Reads telemetry datasets, detects missing features, and outputs statistical summaries using NumPy & Pandas.',
      tags: ['NumPy', 'Pandas', 'ETL', 'Data Processing']
    }
  },
  {
    id: 'cap-ml-modeling',
    name: 'Classical Machine Learning & Evaluation',
    description: 'Engineer tabular features, train supervised predictive models, cross-validate performance, and detect data drift.',
    requiredSkillIds: ['python-core', 'numpy-pandas', 'statistics-prob', 'machine-learning-core'],
    category: 'Machine Learning',
    level: 3,
    whatYouCanBuild: [
      'Predictive classification & regression models with Scikit-Learn',
      'Cross-validation pipelines with hyperparameter tuning',
      'Feature importance & model interpretability reports'
    ],
    deliverableExample: {
      title: 'Customer Churn Predictor & Feature Pipeline',
      description: 'End-to-end Random Forest & Logistic Regression pipeline with cross-validation and ROC-AUC evaluation.',
      tags: ['Scikit-Learn', 'Feature Engineering', 'Modeling']
    }
  },
  {
    id: 'cap-llm-rag',
    name: 'Intelligent RAG & Knowledge Retrieval',
    description: 'Connect vector search databases with large language models to construct context-aware question answering systems.',
    requiredSkillIds: ['python-core', 'llm-rag'],
    category: 'AI Application Dev',
    level: 3,
    whatYouCanBuild: [
      'Semantic document search over technical documentation',
      'RAG pipeline with chunking and source attribution',
      'Prompt-engineered interactive assistant bots'
    ],
    deliverableExample: {
      title: 'Contextual Codebase Knowledge Assistant',
      description: 'Embeds code definitions into ChromaDB and generates grounded explanations using structured prompt templates.',
      tags: ['LLM', 'RAG', 'Embeddings', 'ChromaDB']
    }
  }
];

// Helper to determine capability completion from user's verified skills
export function calculateCapabilityStatus(
  capability: CompoundCapability,
  skills: Record<string, Skill>
): {
  isFullyUnlocked: boolean;
  verifiedCount: number;
  totalCount: number;
  percentage: number;
  missingSkills: string[];
} {
  let verifiedCount = 0;
  const missingSkills: string[] = [];

  capability.requiredSkillIds.forEach((id) => {
    const skill = skills[id];
    if (skill && skill.verifiedLevel >= 1) {
      verifiedCount++;
    } else {
      missingSkills.push(SKILL_TAXONOMY[id]?.name || id);
    }
  });

  const totalCount = capability.requiredSkillIds.length;
  const percentage = Math.round((verifiedCount / totalCount) * 100);
  const isFullyUnlocked = verifiedCount === totalCount;

  return { isFullyUnlocked, verifiedCount, totalCount, percentage, missingSkills };
}

// Generate real milestones from passport and user history
export function generatePassportStory(
  passport: SkillPassport,
  user: UserProfile,
  skills: Record<string, Skill>,
  missions: Record<string, Mission>
): PassportMilestone[] {
  const milestones: PassportMilestone[] = [];

  // Milestone 1: Passport Issued
  milestones.push({
    id: 'm-issued',
    date: passport.issuedDate ? new Date(passport.issuedDate).toLocaleDateString() : '23/9/2026',
    title: 'Skill Passport Issued',
    type: 'PASSPORT_ISSUED',
    description: `Official digital capability record initialized under Passport ID ${passport.passportId}. Target specialization set to ${user.currentGoal?.targetRoleOrSkill || 'AI Engineer'}.`,
    proofBadge: 'Permanent Ledger'
  });

  // Milestone 2: Evidence items recorded in passport
  passport.evidenceLedger.forEach((ev, idx) => {
    milestones.push({
      id: `m-ev-${ev.id || idx}`,
      date: new Date(ev.timestamp).toLocaleDateString(),
      title: ev.title,
      type: ev.type === 'MISSION' ? 'MISSION' : 'VERIFICATION',
      description: `${ev.proofSummary} Verified by ${ev.verifiedBy}.`,
      skillName: ev.skillName,
      level: ev.levelEarned,
      proofBadge: `Level ${ev.levelEarned} Proof`
    });
  });

  // Milestone 3: Current verified competencies
  passport.demonstratedCompetencies.forEach((comp, idx) => {
    const exists = milestones.some((m) => m.skillName === comp.skillName);
    if (!exists) {
      milestones.push({
        id: `m-comp-${idx}`,
        date: comp.verifiedDate || new Date().toLocaleDateString(),
        title: `${comp.skillName} Formally Verified`,
        type: 'VERIFICATION',
        description: `Attained verified Level ${comp.level} with ${comp.evidenceCount} verifiable test artifact recorded.`,
        skillName: comp.skillName,
        level: comp.level,
        proofBadge: `Verified Level ${comp.level}`
      });
    }
  });

  // Sort by chronological date (or index if equal)
  return milestones;
}

// Calculate evidence freshness info based on real timestamps
export function calculateFreshness(timestampStr: string): {
  status: 'FRESH' | 'CURRENT' | 'REFRESH_RECOMMENDED';
  daysAgo: number;
  label: string;
  percent: number;
} {
  const ts = new Date(timestampStr).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - ts);
  const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysAgo <= 14) {
    return {
      status: 'FRESH',
      daysAgo,
      label: daysAgo === 0 ? 'Verified Today' : `${daysAgo}d ago (Fresh)`,
      percent: Math.max(20, 100 - daysAgo * 2)
    };
  } else if (daysAgo <= 60) {
    return {
      status: 'CURRENT',
      daysAgo,
      label: `${daysAgo}d ago (Active)`,
      percent: Math.max(20, 100 - daysAgo * 1.2)
    };
  } else {
    return {
      status: 'REFRESH_RECOMMENDED',
      daysAgo,
      label: `${daysAgo}d ago (Refresh Recommended)`,
      percent: 30
    };
  }
}

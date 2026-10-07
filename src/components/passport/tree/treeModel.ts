import { Skill, SkillPassport, UserProfile, EvidenceItem } from '../../../types';
import { SKILL_TAXONOMY, SkillDefinition } from '../../../services/skillTaxonomy';

export type NodeStatus = 'VERIFIED' | 'IN_PROGRESS' | 'AVAILABLE' | 'LOCKED' | 'NEXT_UNLOCK';

export interface TreeSkillNode {
  id: string;
  name: string;
  familyId: string;
  category: string;
  level: number;
  maxLevel: number;
  verified: boolean;
  status: NodeStatus;
  evidenceCount: number;
  evidenceItems: EvidenceItem[];
  prerequisites: string[];
  prerequisitesMet: boolean;
  enablesSkills: { id: string; name: string }[];
  relatedSkills: string[];
  whyItMatters: string;
  description: string;
  verifiedDate?: string;
  nextUnlockSkillId?: string;
}

export interface TreeFamily {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: TreeSkillNode[];
  verifiedCount: number;
  totalCount: number;
  accentColor: string;
}

export interface SkillTreeData {
  destinationTitle: string;
  destinationSubtitle: string;
  families: TreeFamily[];
  nextUnlockNode: TreeSkillNode | null;
  totalSkillsCount: number;
  totalVerifiedCount: number;
  overallProgressPercent: number;
}

export function buildSkillTreeData(
  user: UserProfile,
  passport: SkillPassport,
  skills: Record<string, Skill>
): SkillTreeData {
  const destinationTitle = user.currentGoal?.targetRoleOrSkill || 'AI Engineer';
  const destinationSubtitle = 'Target Specialization Architecture';

  // Map known categories into tree families
  const familyDefinitions: { id: string; title: string; category: string; description: string; skillIds: string[]; color: string }[] = [
    {
      id: 'fam-prog',
      title: 'PROGRAMMING FOUNDATIONS',
      category: 'Programming',
      description: 'Core syntax, execution control flow, and version-controlled team workflows',
      skillIds: ['python-core', 'git-workflow', 'data-structures'],
      color: '#9BB59F', // Sage
    },
    {
      id: 'fam-data',
      title: 'DATA MECHANICS & ANALYTICS',
      category: 'Data',
      description: 'Vectorized arrays, dataframe transformations, and statistical inference',
      skillIds: ['numpy-pandas', 'statistics-prob'],
      color: '#8798B7', // Blue
    },
    {
      id: 'fam-ai',
      title: 'AI & MACHINE LEARNING',
      category: 'AI & ML',
      description: 'Supervised predictive models, deep neural networks, and contextual RAG pipelines',
      skillIds: ['machine-learning-core', 'deep-learning', 'llm-rag'],
      color: '#D1B46A', // Gold
    },
  ];

  // Helper to test if prerequisites are met
  const arePrereqsMet = (prereqs: string[]): boolean => {
    if (!prereqs || prereqs.length === 0) return true;
    return prereqs.every((pId) => {
      const s = skills[pId];
      return s && (s.verifiedLevel > 0 || s.currentLevel >= 1);
    });
  };

  // Pre-calculate what skills each skill enables
  const enablesMap: Record<string, { id: string; name: string }[]> = {};
  Object.entries(SKILL_TAXONOMY).forEach(([sId, def]) => {
    if (def.prerequisites) {
      def.prerequisites.forEach((pId) => {
        if (!enablesMap[pId]) enablesMap[pId] = [];
        enablesMap[pId].push({ id: sId, name: def.name });
      });
    }
  });

  let candidateNextUnlock: TreeSkillNode | null = null;
  let totalSkills = 0;
  let totalVerified = 0;

  const families: TreeFamily[] = familyDefinitions.map((famDef) => {
    const familySkills: TreeSkillNode[] = famDef.skillIds.map((skillId) => {
      const liveSkill = skills[skillId];
      const taxonomyDef: SkillDefinition | undefined = SKILL_TAXONOMY[skillId];

      const name = liveSkill?.name || taxonomyDef?.name || skillId;
      const level = liveSkill?.verifiedLevel || liveSkill?.currentLevel || 0;
      const maxLevel = taxonomyDef?.maxLevel || 5;
      const isVerified = (liveSkill?.verifiedLevel || 0) > 0;

      // Match attached evidence from passport
      const evidenceItems = passport.evidenceLedger.filter(
        (ev) => ev.skillId === skillId || ev.skillName.toLowerCase() === name.toLowerCase()
      );
      const evidenceCount = evidenceItems.length;

      // Find verified date
      const compRecord = passport.demonstratedCompetencies.find(
        (c) => c.skillName.toLowerCase() === name.toLowerCase()
      );
      const verifiedDate = compRecord?.verifiedDate || liveSkill?.lastVerification;

      const prerequisites = taxonomyDef?.prerequisites || liveSkill?.prerequisites || [];
      const prereqsMet = arePrereqsMet(prerequisites);

      // Determine accurate node status
      let status: NodeStatus = 'AVAILABLE';
      if (isVerified) {
        status = 'VERIFIED';
        totalVerified++;
      } else if (!prereqsMet) {
        status = 'LOCKED';
      } else if (level > 0) {
        status = 'IN_PROGRESS';
      } else {
        status = 'AVAILABLE';
      }

      totalSkills++;

      const treeNode: TreeSkillNode = {
        id: skillId,
        name,
        familyId: famDef.id,
        category: famDef.category,
        level,
        maxLevel,
        verified: isVerified,
        status,
        evidenceCount,
        evidenceItems,
        prerequisites,
        prerequisitesMet: prereqsMet,
        enablesSkills: enablesMap[skillId] || [],
        relatedSkills: taxonomyDef?.relatedSkills || liveSkill?.relatedSkills || [],
        whyItMatters: taxonomyDef?.whyItMatters || liveSkill?.whyItMatters || 'Essential core capability',
        description: taxonomyDef?.description || liveSkill?.description || '',
        verifiedDate,
      };

      // Select first unverified node with prerequisites met as Next Unlock candidate
      if (!isVerified && prereqsMet && !candidateNextUnlock) {
        candidateNextUnlock = treeNode;
        treeNode.status = 'NEXT_UNLOCK';
      }

      return treeNode;
    });

    const verifiedInFamily = familySkills.filter((s) => s.verified).length;

    return {
      id: famDef.id,
      title: famDef.title,
      category: famDef.category,
      description: famDef.description,
      skills: familySkills,
      verifiedCount: verifiedInFamily,
      totalCount: familySkills.length,
      accentColor: famDef.color,
    };
  });

  const overallProgressPercent = totalSkills > 0 ? Math.round((totalVerified / totalSkills) * 100) : 0;

  return {
    destinationTitle,
    destinationSubtitle,
    families,
    nextUnlockNode: candidateNextUnlock,
    totalSkillsCount: totalSkills,
    totalVerifiedCount: totalVerified,
    overallProgressPercent,
  };
}

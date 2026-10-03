import { Goal, Skill, SkillGap, SkillStatus } from '../types';
import { SKILL_TAXONOMY } from './skillTaxonomy';

export function calculateSkillGaps(goal: Goal | null, userSkills: Record<string, Skill>): SkillGap[] {
  if (!goal) return [];

  const gaps: SkillGap[] = [];

  for (const req of goal.requiredSkills) {
    const userSkill = userSkills[req.skillId];
    const skillDef = SKILL_TAXONOMY[req.skillId];
    const category = skillDef ? skillDef.category : 'Programming';

    const currentLevel = userSkill ? userSkill.currentLevel : 0;
    const verifiedLevel = userSkill ? userSkill.verifiedLevel : 0;
    const status: SkillStatus = userSkill ? userSkill.status : 'NOT_YET_STARTED';

    // Effective level considered for gap analysis: verified has strongest weight
    const effectiveLevel = verifiedLevel > 0 ? verifiedLevel : currentLevel;
    const targetLevel = req.requiredLevel;
    const levelDiff = targetLevel - effectiveLevel;

    let gapSeverity: SkillGap['gapSeverity'] = 'SATISFIED';
    let canSkip = false;

    if (effectiveLevel >= targetLevel && (userSkill?.status === 'VERIFIED' || verifiedLevel >= targetLevel)) {
      gapSeverity = 'SATISFIED';
      canSkip = true;
    } else if (effectiveLevel === 0 || status === 'NOT_YET_STARTED') {
      gapSeverity = 'CRITICAL';
      canSkip = false;
    } else if (status === 'WEAK' || levelDiff >= 2) {
      gapSeverity = 'CRITICAL';
      canSkip = false;
    } else if (status === 'UNVERIFIED' && currentLevel >= targetLevel) {
      gapSeverity = 'MODERATE'; // User claims they know it, but needs verification!
      canSkip = false;
    } else if (levelDiff === 1) {
      gapSeverity = 'MODERATE';
      canSkip = false;
    } else {
      gapSeverity = 'MINOR';
      canSkip = false;
    }

    // Explanations for beginners
    const targetDesc = skillDef?.levelDescriptions[targetLevel] || `Level ${targetLevel}`;
    const currentDesc = effectiveLevel > 0 ? (skillDef?.levelDescriptions[effectiveLevel] || `Level ${effectiveLevel}`) : 'No prior experience recorded';

    let whatIsMissing = '';
    let whyItMatters = skillDef?.whyItMatters || 'Essential requirement for your target destination.';
    let whatLevelNeeded = `Level ${targetLevel}/5: ${targetDesc}`;
    let whatShouldBeDoneNext = '';

    if (gapSeverity === 'SATISFIED') {
      whatIsMissing = `None. You have demonstrated Level ${verifiedLevel} proficiency.`;
      whatShouldBeDoneNext = 'Keep this skill active by applying it in milestone projects or assisting in advanced missions.';
    } else if (status === 'UNVERIFIED' && currentLevel >= targetLevel) {
      whatIsMissing = `You indicated knowledge up to Level ${currentLevel}, but you haven't completed verification.`;
      whyItMatters = `Without verified proof, you cannot establish your Skill Passport or be certain you are ready for advanced topics that rely on this.`;
      whatShouldBeDoneNext = `Take the 8-minute Skill Assessment to verify Level ${targetLevel} proficiency and skip basic lessons.`;
    } else if (effectiveLevel === 0) {
      whatIsMissing = `Complete beginner gap. You need to build foundational understanding from scratch.`;
      whatShouldBeDoneNext = `Start the introductory micro-action (15-20 min) and complete the starter mission.`;
    } else {
      whatIsMissing = `You are at Level ${effectiveLevel} (${currentDesc}). You need to advance to Level ${targetLevel}.`;
      whatShouldBeDoneNext = `Complete the next structured practice mission focused on ${skillDef?.name || 'this skill'}.`;
    }

    gaps.push({
      skillId: req.skillId,
      skillName: req.skillName,
      category,
      currentLevel: effectiveLevel,
      targetLevel,
      status,
      gapSeverity,
      whatIsMissing,
      whyItMatters,
      whatLevelNeeded,
      whatShouldBeDoneNext,
      canSkip,
    });
  }

  // Sort by severity (CRITICAL -> MODERATE -> MINOR -> SATISFIED)
  const order = { CRITICAL: 0, MODERATE: 1, MINOR: 2, SATISFIED: 3 };
  return gaps.sort((a, b) => order[a.gapSeverity] - order[b.gapSeverity]);
}

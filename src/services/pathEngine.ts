import { Goal, JourneyStep, Skill, UserProfile, RerouteEvent } from '../types';
import { SKILL_TAXONOMY } from './skillTaxonomy';

export function generatePersonalizedPath(
  goal: Goal | null,
  userSkills: Record<string, Skill>,
  availableMinutesPerDay: number,
  experienceLevel: string
): JourneyStep[] {
  if (!goal) return [];

  const steps: JourneyStep[] = [];
  let order = 1;

  // Pace factor based on available daily time: e.g. 30 min = micro tasks (15-25 min)
  const isMicroPace = availableMinutesPerDay <= 30;

  for (const req of goal.requiredSkills) {
    const userSkill = userSkills[req.skillId];
    const skillDef = SKILL_TAXONOMY[req.skillId];
    const verifiedLevel = userSkill?.verifiedLevel || 0;
    const currentLevel = userSkill?.currentLevel || 0;
    const isVerifiedAtTarget = verifiedLevel >= req.requiredLevel;

    // IF already verified at or above target level:
    if (isVerifiedAtTarget) {
      // Create a completed checkpoint acknowledging prior mastery
      steps.push({
        id: `step-verified-${req.skillId}`,
        title: `${req.skillName} (Verified Mastered)`,
        type: 'CHECKPOINT',
        status: 'COMPLETED',
        description: `You have demonstrated verified Level ${verifiedLevel} proficiency. Beginner modules skipped automatically.`,
        skills: [req.skillId],
        estimatedMinutes: 0,
        difficulty: 'BEGINNER',
        prerequisites: [],
        actionInstruction: 'Prior mastery verified by assessment. Proceeding directly to advanced integration.',
        order: order++,
      });
      continue;
    }

    // IF unverified but user claimed knowledge:
    if (verifiedLevel === 0 && currentLevel >= req.requiredLevel) {
      steps.push({
        id: `step-verify-claim-${req.skillId}`,
        title: `Verify ${req.skillName} (Fast-Track Opportunity)`,
        type: 'VERIFICATION',
        status: order === 1 ? 'IN_PROGRESS' : 'UPCOMING',
        description: `You indicated familiarity with ${req.skillName}. Complete this 8-minute assessment to verify your level and fast-track past beginner exercises.`,
        skills: [req.skillId],
        estimatedMinutes: 8,
        difficulty: 'INTERMEDIATE',
        prerequisites: [],
        actionInstruction: `Take the ${req.skillName} verification assessment. Passing with 70%+ skips foundational drills.`,
        verificationId: `verify-${req.skillId}`,
        order: order++,
      });
    }

    // Determine how many level increments the user needs:
    const startLevel = Math.max(verifiedLevel, currentLevel > 0 ? 1 : 0);
    const targetLevel = req.requiredLevel;

    // Foundation action (if beginner)
    if (startLevel < 2) {
      steps.push({
        id: `step-foundations-${req.skillId}`,
        title: `${req.skillName}: Core Principles & Mental Model`,
        type: 'TOPIC',
        status: order === 1 ? 'IN_PROGRESS' : (steps.some(s => s.status === 'IN_PROGRESS') ? 'UPCOMING' : 'UPCOMING'),
        description: `Understand the key concepts, syntax, and patterns of ${req.skillName} tailored for ${goal.targetRoleOrSkill}.`,
        skills: [req.skillId],
        estimatedMinutes: isMicroPace ? 20 : 35,
        difficulty: 'BEGINNER',
        prerequisites: skillDef?.prerequisites || [],
        actionInstruction: `Review ${req.skillName} core mechanics and run the interactive playground drills.`,
        resources: [
          { title: `${req.skillName} Quickstart Guide`, url: '#', type: 'doc' },
          { title: 'Interactive Syntax Practice', url: '#', type: 'interactive' },
        ],
        order: order++,
      });

      steps.push({
        id: `step-practice-${req.skillId}`,
        title: `Hands-On Practice: ${req.skillName} Drills`,
        type: 'ACTION',
        status: 'UPCOMING',
        description: `Solve 3 targeted practical exercises focusing on real-world use cases.`,
        skills: [req.skillId],
        estimatedMinutes: isMicroPace ? 25 : 40,
        difficulty: 'BEGINNER',
        prerequisites: [`step-foundations-${req.skillId}`],
        actionInstruction: `Write and test solutions for the automated practice problem set.`,
        order: order++,
      });
    }

    // Practical Mission Step
    steps.push({
      id: `step-mission-${req.skillId}`,
      title: `Mission: Build with ${req.skillName}`,
      type: 'MISSION',
      status: 'UPCOMING',
      description: `Complete an end-to-end practical mini-project using ${req.skillName} to produce verifiable evidence.`,
      skills: [req.skillId],
      estimatedMinutes: isMicroPace ? 30 : 50,
      difficulty: 'INTERMEDIATE',
      prerequisites: [req.skillId],
      actionInstruction: `Launch the Mission Sandbox and complete all validation test cases.`,
      missionId: `mission-${req.skillId}`,
      order: order++,
    });

    // Verification Checkpoint Step
    steps.push({
      id: `step-checkpoint-${req.skillId}`,
      title: `Skill Verification: ${req.skillName}`,
      type: 'VERIFICATION',
      status: 'UPCOMING',
      description: `Formal adaptive assessment to award verified badge (Level ${targetLevel}) and record proof in your Skill Passport.`,
      skills: [req.skillId],
      estimatedMinutes: 10,
      difficulty: 'INTERMEDIATE',
      prerequisites: [`step-mission-${req.skillId}`],
      actionInstruction: `Pass the verification assessment to lock in your credential.`,
      verificationId: `verify-${req.skillId}`,
      order: order++,
    });
  }

  // Final Capstone Project for the Goal
  steps.push({
    id: `step-capstone-${goal.id}`,
    title: `Capstone Milestone: ${goal.title}`,
    type: 'PROJECT',
    status: 'UPCOMING',
    description: `Synthesize all verified competencies into a portfolio-ready project showcasing ${goal.targetRoleOrSkill} abilities.`,
    skills: goal.requiredSkills.map(r => r.skillId),
    estimatedMinutes: isMicroPace ? 90 : 180,
    difficulty: 'ADVANCED',
    prerequisites: steps.filter(s => s.type === 'VERIFICATION').map(s => s.id),
    actionInstruction: `Build, document, and deploy your capstone project to earn the Master Badge in your Skill Passport.`,
    order: order++,
  });

  // Ensure first non-completed step is marked IN_PROGRESS
  let hasInProgress = steps.some(s => s.status === 'IN_PROGRESS');
  if (!hasInProgress) {
    const firstUpcoming = steps.find(s => s.status === 'UPCOMING');
    if (firstUpcoming) firstUpcoming.status = 'IN_PROGRESS';
  }

  return steps;
}

export function rerouteLearningPath(
  currentPath: JourneyStep[],
  trigger: RerouteEvent['trigger'],
  context: {
    struggledSkillId?: string;
    verifiedSkillId?: string;
    newMinutesPerDay?: number;
    newGoal?: Goal;
    userSkills?: Record<string, Skill>;
  }
): { updatedPath: JourneyStep[]; rerouteEvent: RerouteEvent } {
  let updated = [...currentPath];
  let reason = '';
  let whatChanged = '';
  let whyItChanged = '';
  let nextActionRecommendation = '';

  if (trigger === 'STRUGGLE' && context.struggledSkillId) {
    const skillDef = SKILL_TAXONOMY[context.struggledSkillId];
    const skillName = skillDef?.name || context.struggledSkillId;
    
    // Find where the skill is located in current path
    const targetIndex = updated.findIndex(s => s.skills.includes(context.struggledSkillId!));
    if (targetIndex !== -1) {
      const remediationStep: JourneyStep = {
        id: `step-remediation-${context.struggledSkillId}-${Date.now()}`,
        title: `${skillName}: Foundation Reinforcement & Visual Breakdown`,
        type: 'ACTION',
        status: 'IN_PROGRESS',
        description: `Targeted revision addressing edge cases and underlying mechanics before continuing.`,
        skills: [context.struggledSkillId],
        estimatedMinutes: 20,
        difficulty: 'BEGINNER',
        prerequisites: [],
        actionInstruction: `Work through step-by-step guided examples with real-time mentor hints.`,
        isRerouted: true,
        rerouteReason: 'Added reinforcement step based on assessment diagnostic feedback.',
        order: updated[targetIndex].order,
      };

      // Mark the current active as upcoming or replaced
      updated[targetIndex].status = 'UPCOMING';
      updated.splice(targetIndex, 0, remediationStep);
      // Re-index orders
      updated = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    }

    reason = `Diagnostic indicated difficulty with ${skillName}.`;
    whatChanged = `Inserted a 20-minute targeted reinforcement drill specifically for ${skillName}.`;
    whyItChanged = `Strengthening core foundations now prevents confusion in downstream advanced missions.`;
    nextActionRecommendation = `Complete the newly added Foundation Reinforcement module.`;
  } else if (trigger === 'FAST_IMPROVEMENT' && context.verifiedSkillId) {
    const skillName = SKILL_TAXONOMY[context.verifiedSkillId]?.name || context.verifiedSkillId;
    
    // Mark beginner modules for this skill as COMPLETED/SKIPPED
    updated = updated.map((step) => {
      if (step.skills.includes(context.verifiedSkillId!) && step.difficulty === 'BEGINNER' && step.status !== 'COMPLETED') {
        return {
          ...step,
          status: 'COMPLETED' as const,
          description: `Skipped: High verification score demonstrated prior mastery.`,
          isRerouted: true,
          rerouteReason: `Fast-tracked past beginner drills due to verified score.`,
        };
      }
      return step;
    });

    // Ensure next uncompleted step is in progress
    const nextStep = updated.find(s => s.status === 'UPCOMING');
    if (nextStep) nextStep.status = 'IN_PROGRESS';

    reason = `Demonstrated high proficiency in ${skillName}.`;
    whatChanged = `Bypassed beginner practice exercises for ${skillName} and unlocked direct project missions.`;
    whyItChanged = `Your verified score proves you already know this material. We save you time.`;
    nextActionRecommendation = `Jump straight into the intermediate practical mission.`;
  } else if (trigger === 'TIME_CHANGE' && context.newMinutesPerDay) {
    const minutes = context.newMinutesPerDay;
    const isShort = minutes <= 30;

    updated = updated.map((step) => {
      if (step.status !== 'COMPLETED') {
        return {
          ...step,
          estimatedMinutes: isShort ? Math.min(25, Math.max(15, Math.round(step.estimatedMinutes * 0.6))) : Math.round(step.estimatedMinutes * 1.2),
          isRerouted: true,
          rerouteReason: `Recalibrated task size for ${minutes} min/day schedule.`,
        };
      }
      return step;
    });

    reason = `Daily learning schedule adjusted to ${minutes} minutes/day.`;
    whatChanged = `Re-segmented upcoming learning actions into focused ${isShort ? '15-25 min micro-actions' : 'comprehensive deep-dive blocks'}.`;
    whyItChanged = `Ensures you make meaningful progress every day without cognitive overload.`;
    nextActionRecommendation = `Start today's recalibrated micro-action.`;
  }

  const rerouteEvent: RerouteEvent = {
    id: `reroute-${Date.now()}`,
    timestamp: new Date().toISOString(),
    trigger,
    reason,
    whatChanged,
    whyItChanged,
    nextActionRecommendation,
  };

  return { updatedPath: updated, rerouteEvent };
}

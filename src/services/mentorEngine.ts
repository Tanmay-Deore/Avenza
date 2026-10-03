import { MentorMessage, UserProfile, Goal, JourneyStep, SkillGap, Skill } from '../types';

export interface MentorContext {
  user: UserProfile;
  goal: Goal | null;
  activeStep: JourneyStep | null;
  gaps: SkillGap[];
  skills: Record<string, Skill>;
}

export function generateContextualWelcome(context: MentorContext): MentorMessage {
  const goalTitle = context.goal?.title || 'your chosen direction';
  const activeStepTitle = context.activeStep?.title || 'your first learning module';
  const criticalGapsCount = context.gaps.filter(g => g.gapSeverity === 'CRITICAL').length;

  let text = `👋 Hello ${context.user.name}! I am your **Avenza AI Navigator & Mentor**.\n\n`;
  text += `I have full context on your goal: **${goalTitle}**.\n`;

  if (context.activeStep) {
    text += `Currently, your next milestone is: **${activeStepTitle}** (${context.activeStep.estimatedMinutes} min effort).\n`;
  }

  if (criticalGapsCount > 0) {
    text += `We have identified **${criticalGapsCount} critical skill ${criticalGapsCount === 1 ? 'gap' : 'gaps'}** we will bridge systematically through hands-on missions.\n\n`;
  }

  text += `Ask me anything about why specific skills matter for your path, request hints on your active mission, or ask for an analogy if a concept feels confusing!`;

  return {
    id: `msg-welcome-${Date.now()}`,
    sender: 'MENTOR',
    text,
    timestamp: new Date().toISOString(),
    suggestedActions: [
      { label: "Why do I need this current topic for my goal?", actionType: 'EXPLAIN_GAP' },
      { label: "Give me a practical hint for today's mission", actionType: 'START_MISSION' },
      { label: "I only have 15 minutes today — what should I do?", actionType: 'REROUTE' },
    ],
    contextSnapshot: {
      goalTitle: context.goal?.title,
      currentStepTitle: context.activeStep?.title,
    },
  };
}

export function generateMentorResponse(
  userQuery: string,
  context: MentorContext
): MentorMessage {
  const query = userQuery.toLowerCase().trim();
  const goal = context.goal;
  const activeStep = context.activeStep;
  const gaps = context.gaps;

  let responseText = '';
  let actions = undefined;

  // Pattern 1: Why do I need [skill / topic]
  if (query.includes('why') && (query.includes('learn') || query.includes('need') || query.includes('topic') || query.includes('data structure') || query.includes('python') || query.includes('statistics'))) {
    if (query.includes('data structure') || (activeStep && activeStep.title.toLowerCase().includes('data structure'))) {
      responseText = `Great question! You are pursuing **${goal?.title || 'Software & AI Development'}**.\n\n` +
        `Data structures (like Hash Maps, Trees, and Arrays) are not abstract theory—they dictate how efficiently your code accesses memory and processes data.\n\n` +
        `💡 **Why it matters specifically for ${goal?.targetRoleOrSkill || 'your goal'}:**\n` +
        `When you build scalable APIs or machine learning data pipelines, using the wrong structure (e.g., searching a list of 1M items in O(N) time instead of a Hash Map in O(1)) can turn a 5-millisecond query into a 30-second stall.\n\n` +
        `In your current path step **"${activeStep?.title || 'Data Structures'}"**, we focus on practical intuition rather than dry math.`;
    } else if (query.includes('statistics') || query.includes('math')) {
      responseText = `Mathematics and Statistics are the underlying compass for **${goal?.title || 'AI & Data'}**.\n\n` +
        `You don't need a pure math degree to succeed. In Avenza, we focus on **applied intuition**:\n` +
        `• **Distributions:** Understand why real-world data is skewed.\n` +
        `• **Loss Functions & Gradients:** Know how models tweak weights to correct mistakes.\n` +
        `• **Evaluation Metrics:** Prevent catastrophic errors by knowing when Accuracy is a deceptive metric compared to Precision/Recall.\n\n` +
        `Your next practice mission will apply this directly to a customer dataset!`;
    } else {
      responseText = `In the context of your goal (**${goal?.title}**), every step in your personalized path was generated to eliminate a specific gap.\n\n` +
        `Your current checkpoint **"${activeStep?.title}"** directly feeds into the upcoming verification milestone. Mastering this now unlocks the practical capstone project without frustrating roadblocks.`;
    }
  }
  // Pattern 2: Hint / Mission assistance
  else if (query.includes('hint') || query.includes('mission') || query.includes('help') || query.includes('stuck')) {
    responseText = `Here is a targeted breakdown for your active task **"${activeStep?.title || 'Active Mission'}"**:\n\n` +
      `🎯 **Core Objective:** Focus on isolating the problem into small, verifiable chunks.\n` +
      `💡 **Mentor Tip:** Before writing complex code, print intermediate outputs. If you are parsing strings or dictionaries, check types with \`type(variable)\`.\n` +
      `🛠️ **Next Immediate Step:** Open the Mission Playground, test step 1 independently, and observe the test assertion output!`;

    actions = [
      { label: '🚀 Open Mission Workspace', actionType: 'START_MISSION' as const },
      { label: '🔍 Check Skill Gap Analysis', actionType: 'EXPLAIN_GAP' as const },
    ];
  }
  // Pattern 3: Time constraints / Schedule adapt
  else if (query.includes('time') || query.includes('minutes') || query.includes('busy') || query.includes('schedule') || query.includes('15 min') || query.includes('30 min')) {
    responseText = `Life happens, and consistency beats binge-learning! Avenza's adaptive engine can dynamically recalibrate your path into **bite-sized 15-minute micro-actions**.\n\n` +
      `With 15-20 minutes today, you can:\n` +
      `1. Run 3 quick interactive concept checks (7 min)\n` +
      `2. Fix one isolated function test case (8 min)\n\n` +
      `Would you like me to adjust your daily pace in your Profile?`;

    actions = [
      { label: '⏱️ Adapt Path for 20m/day', actionType: 'REROUTE' as const, payload: { minutes: 20 } },
      { label: '⚡ Continue Current Pace', actionType: 'NAVIGATE' as const, payload: 'journey' },
    ];
  }
  // Pattern 4: Skill Gaps inquiry
  else if (query.includes('gap') || query.includes('missing') || query.includes('what should i do')) {
    const topGap = gaps.find(g => g.gapSeverity === 'CRITICAL') || gaps[0];
    responseText = `Based on your diagnostic profile for **${goal?.title}**, here is your priority roadmap:\n\n` +
      `📌 **Highest Priority Gap:** **${topGap ? topGap.skillName : 'Foundations'}**\n` +
      `• **Current Level:** ${topGap ? topGap.currentLevel : 0} / Target: ${topGap ? topGap.targetLevel : 3}\n` +
      `• **Action Needed:** ${topGap ? topGap.whatShouldBeDoneNext : 'Complete your initial verification.'}\n\n` +
      `Everything in your Journey view is ordered so you tackle dependencies in the most efficient sequence.`;

    actions = [
      { label: '🗺️ View Personalized Journey', actionType: 'NAVIGATE' as const, payload: 'journey' },
      { label: '🧪 Verify a Skill Now', actionType: 'START_VERIFICATION' as const, payload: topGap?.skillId },
    ];
  }
  // Generic Context-Aware Assistant
  else {
    responseText = `I'm tracking your progress toward **${goal?.title || 'your learning goal'}**.\n\n` +
      `Regarding **"${userQuery}"**:\n` +
      `In software and AI engineering, the key to mastering this is combining conceptual understanding with immediate practical experimentation. That's why each Avenza step is tied to a testable output that earns proof for your Skill Passport.\n\n` +
      `Would you like to explore this concept with a quick interactive example, or review how it fits into your next checkpoint **"${activeStep?.title || 'Foundations'}"**?`;

    actions = [
      { label: 'Explain with an Analogy', actionType: 'EXPLAIN_GAP' as const },
      { label: 'Go to Current Checkpoint', actionType: 'NAVIGATE' as const, payload: 'journey' },
    ];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'MENTOR',
    text: responseText,
    timestamp: new Date().toISOString(),
    suggestedActions: actions,
    contextSnapshot: {
      goalTitle: goal?.title,
      currentStepTitle: activeStep?.title,
    },
  };
}

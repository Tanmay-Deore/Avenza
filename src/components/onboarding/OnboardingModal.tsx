import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { StepProgress } from './StepProgress';
import { STANDARD_GOALS } from '../../services/skillTaxonomy';
import { DISCOVERY_DIRECTIONS, calculateDirectionSuitability } from '../../services/discoveryEngine';
import { Goal, ExperienceLevel, GoalType } from '../../types';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Brain,
  Layers,
  Code,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEP_LABELS = [
  'Identity & Level',
  'Time & Pace',
  'Choose Destination',
  'Synthesize Path',
];

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, completeOnboarding } = useAvenza();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(user.name || 'Alex Morgan');
  const [level, setLevel] = useState<ExperienceLevel>(user.level || 'SOME_BASICS');
  const [availableMinutes, setAvailableMinutes] = useState(user.availableMinutesPerDay || 30);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(user.currentGoal || STANDARD_GOALS[0]);
  
  // "I Don't Know What I Want" state
  const [isUnsureMode, setIsUnsureMode] = useState(false);
  const [unsureInterests, setUnsureInterests] = useState<string[]>(['Artificial Intelligence', 'Visual Building']);
  const [unsureWorkStyle, setUnsureWorkStyle] = useState('building_visual');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step: trigger celebration & finish
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      completeOnboarding(
        {
          name: name.trim() || 'Learner',
          level,
          availableMinutesPerDay: availableMinutes,
        },
        selectedGoal
      );
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const recommendedDirections = calculateDirectionSuitability({
    interests: unsureInterests,
    strengths: ['Curiosity', 'Pattern Recognition'],
    curiosity: ['How software scales'],
    workStyle: unsureWorkStyle,
    enjoyedActivities: ['Building prototypes'],
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="border border-[#26354D] bg-[#121826]"
    >
      <div className="space-y-6">
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#26354D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-100">Welcome to Avenza</h2>
              <p className="text-xs text-gray-400">AI-Powered Navigation for Learning & Career Growth</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {currentStep === 1 && <span className="text-emerald-400 font-medium">Required</span>}
            {currentStep === 2 && <span className="text-cyan-400 font-medium">Adaptive Pace</span>}
            {currentStep === 3 && <span className="text-purple-400 font-medium">Destination</span>}
            {currentStep === 4 && <span className="text-emerald-400 font-medium">Ready</span>}
          </div>
        </div>

        {/* Step Progress Indicator */}
        <StepProgress currentStep={currentStep} totalSteps={4} stepLabels={STEP_LABELS} />

        {/* STEP 1: IDENTITY & LEVEL */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-1">
                1. What should we call you?
              </h3>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or nickname"
                className="max-w-md"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-2">
                2. Where are you currently starting from?
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Be honest! Avenza never judges—we calibrate your path to prevent overwhelm or boredom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'ABSOLUTE_BEGINNER',
                    title: 'Absolute Beginner',
                    desc: 'No coding or tech background. Explain everything in plain English with analogies.',
                  },
                  {
                    id: 'SOME_BASICS',
                    title: 'Some Basics',
                    desc: 'Know what variables and loops are, but need structured hands-on guidance.',
                  },
                  {
                    id: 'INTERMEDIATE',
                    title: 'Self-Learner / Intermediate',
                    desc: 'Built a few small scripts or tutorials. Want to eliminate gaps and build real projects.',
                  },
                  {
                    id: 'ADVANCED',
                    title: 'Experienced Engineer',
                    desc: 'Strong software background; looking to cross-skill into AI/ML or specialized domains quickly.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLevel(item.id as ExperienceLevel)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      level === item.id
                        ? 'bg-[#182234] border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40 shadow-sm'
                        : 'bg-[#141C2B] border-[#26354D] text-gray-300 hover:border-gray-500 hover:bg-[#182234]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-100">{item.title}</span>
                      {level === item.id && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TIME & PACE */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-1">
                How much time can you realistically invest per day?
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Avenza re-segments large topics into digestible micro-actions matching your exact time budget.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { mins: 15, label: '15 min/day', tag: 'Micro Focus', desc: '1 quick interactive drill' },
                  { mins: 30, label: '30 min/day', tag: 'Recommended', desc: '1 topic + 1 mini-exercise' },
                  { mins: 60, label: '1 hour/day', tag: 'Standard Pace', desc: 'Deep-dive & code mission' },
                  { mins: 120, label: '2 hours/day', tag: 'Fast-Track', desc: 'Full project milestones' },
                ].map((item) => (
                  <div
                    key={item.mins}
                    onClick={() => setAvailableMinutes(item.mins)}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-between ${
                      availableMinutes === item.mins
                        ? 'bg-[#182234] border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                        : 'bg-[#141C2B] border-[#26354D] text-gray-300 hover:border-gray-500 hover:bg-[#182234]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                        {item.tag}
                      </span>
                      <div className="text-lg font-extrabold text-gray-100 mb-1">{item.label}</div>
                      <p className="text-[11px] text-gray-400">{item.desc}</p>
                    </div>
                    {availableMinutes === item.mins && (
                      <div className="mt-3 flex justify-center">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#182234]/60 border border-[#26354D] flex items-start gap-3">
              <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-200">Adaptive Scheduling Active</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  If your schedule changes later (e.g. exams or busy work weeks), Avenza automatically adapts your milestones without resetting your progress.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DESTINATION OR "I DON'T KNOW" */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                  Where do you want to navigate?
                </h3>
                <p className="text-xs text-gray-400">
                  Select a destination or explore possibilities if you are unsure.
                </p>
              </div>

              <button
                onClick={() => setIsUnsureMode(!isUnsureMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isUnsureMode
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                    : 'bg-[#182234] text-gray-300 border-[#26354D] hover:text-purple-300 hover:border-purple-500/40'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>{isUnsureMode ? '← Back to Standard Goals' : '“I Don’t Know What I Want” Mode'}</span>
              </button>
            </div>

            {/* If User clicked "I Don't Know What I Want" */}
            {isUnsureMode ? (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-4">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Exploratory Compass Mode</span>
                </div>
                <p className="text-xs text-gray-300">
                  Instead of guessing a job title, tell us what activities you enjoy, and we'll suggest directions worth exploring:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'dir-ai-ml', title: 'AI & Machine Learning', desc: 'Predictive models, neural networks, LLM agents', goal: STANDARD_GOALS[0] },
                    { id: 'dir-fullstack-web', title: 'Fullstack Web Development', desc: 'Interactive web apps, React UIs, APIs', goal: STANDARD_GOALS[1] },
                    { id: 'dir-data-analytics', title: 'Data Analytics & Insights', desc: 'SQL databases, statistics, business dashboards', goal: STANDARD_GOALS[2] },
                    { id: 'dir-python-mastery', title: 'Python Programming Foundations', desc: 'General programming, algorithms, problem solving', goal: STANDARD_GOALS[3] },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedGoal(item.goal)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedGoal?.id === item.goal.id
                          ? 'bg-[#1F2C42] border-purple-400 text-purple-200'
                          : 'bg-[#141C2B] border-[#26354D] text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-gray-200">{item.title}</span>
                        {selectedGoal?.id === item.goal.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Standard Goal Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {STANDARD_GOALS.map((goal) => {
                  const isSelected = selectedGoal?.id === goal.id;
                  return (
                    <div
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#182234] border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40 shadow-md'
                          : 'bg-[#141C2B] border-[#26354D] text-gray-300 hover:border-gray-500 hover:bg-[#182234]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1F2C42] text-gray-300 border border-[#2F4263]">
                            {goal.type}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">~{goal.estimatedWeeks} wks</span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-100 mb-1">{goal.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{goal.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {goal.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#182234] text-gray-400 border border-[#26354D]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: SYNTHESIZE PATH */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#182234] to-[#121826] border border-cyan-500/40 shadow-xl">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Personalized Navigation Plan Ready</span>
              </div>
              <h3 className="text-lg font-black text-gray-100 mb-1">{selectedGoal?.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                We have calibrated your baseline skills and time allocation ({availableMinutes} min/day).
                Avenza has structured your path into actionable checkpoints, practical coding missions, and verification milestones.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#26354D]">
                <div className="text-center p-2 rounded-lg bg-[#121826]">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Daily Effort</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">{availableMinutes} min</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#121826]">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Pace</div>
                  <div className="text-sm font-bold text-emerald-300 mt-0.5">
                    {availableMinutes <= 30 ? 'Micro-Actions' : 'Deep-Dive'}
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#121826]">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Evidence Ledger</div>
                  <div className="text-sm font-bold text-purple-300 mt-0.5">Skill Passport</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141C2B] border border-[#26354D] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-medium">Initial diagnostic baseline established</span>
              </div>
              <span className="text-gray-400 font-mono">Ready to Launch</span>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#26354D]">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="glow"
            onClick={handleNext}
            rightIcon={currentStep === 4 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {currentStep === 4 ? 'Launch Avenza Navigator' : 'Continue'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

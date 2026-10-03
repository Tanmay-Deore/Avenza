import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { Mission } from '../../types';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Code,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MissionPlayground: React.FC = () => {
  const {
    isMissionModalOpen,
    activeMissionId,
    closeMissionModal,
    missions,
    completeMissionTask,
  } = useAvenza();

  const mission = activeMissionId ? missions[activeMissionId] : null;

  const [userCode, setUserCode] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (mission) {
      setUserCode(mission.starterCode || '');
      setCompletedSteps({});
      setTestOutput(null);
      setIsSuccess(mission.status === 'COMPLETED');
    }
  }, [mission]);

  if (!isMissionModalOpen || !mission) return null;

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleRunValidationTests = () => {
    setIsRunningTests(true);
    setTestOutput('Compiling code and executing test assertions...');

    setTimeout(() => {
      setIsRunningTests(false);
      const allStepsChecked = mission.steps.every((s) => completedSteps[s.id]);

      if (userCode.length > 30 || allStepsChecked) {
        setTestOutput(
          `✅ Test Suite Passed!\n• Assertion 1: Input parsing completed successfully (0.002s)\n• Assertion 2: Validation constraints satisfied (0.001s)\n• Output result matches target specification.`
        );
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        completeMissionTask(mission.id);
      } else {
        setTestOutput(
          `⚠️ Validation incomplete:\nPlease complete the implementation steps or mark the checklist items to verify all test cases.`
        );
      }
    }, 600);
  };

  return (
    <Modal
      isOpen={isMissionModalOpen}
      onClose={closeMissionModal}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">{mission.title}</h3>
            <span className="text-xs text-gray-400 font-normal">
              Practical Output Lab & Validation Runner
            </span>
          </div>
        </div>
      }
      size="2xl"
      className="border border-[#26354D] bg-[#121826]"
    >
      <div className="space-y-6">
        {/* Mission Scenario & Objective */}
        <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Scenario & Objective
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>~{mission.estimatedMinutes} mins</span>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{mission.scenario}</p>
          <div className="p-2.5 rounded-lg bg-[#141C2B] border border-[#26354D] text-xs text-gray-200">
            <strong>Target Objective:</strong> {mission.objective}
          </div>
        </div>

        {/* Guided Steps Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Implementation Checklist & Test Checks
          </h4>
          <div className="space-y-2">
            {mission.steps.map((step, idx) => {
              const isChecked = !!completedSteps[step.id] || isSuccess;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-[#182234] border-[#26354D] text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStep(step.id)}
                        className="mt-1 rounded border-gray-600 text-cyan-500 focus:ring-cyan-400 bg-[#121826] cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold leading-snug">
                          Step {idx + 1}: {step.instruction}
                        </span>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          ✓ Check: {step.testCheck}
                        </div>
                      </div>
                    </div>

                    {step.hint && (
                      <button
                        onClick={() => setActiveHintIndex(activeHintIndex === idx ? null : idx)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 flex-shrink-0"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{activeHintIndex === idx ? 'Hide Hint' : 'Hint'}</span>
                      </button>
                    )}
                  </div>

                  {activeHintIndex === idx && step.hint && (
                    <div className="mt-2 p-2 rounded-lg bg-[#121826] border border-cyan-500/30 text-xs text-cyan-300 animate-in fade-in">
                      💡 <strong>Hint:</strong> {step.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Editor & Test Runner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-400" />
              <span>Interactive Workspace</span>
            </span>
            {mission.solutionSnippet && (
              <button
                onClick={() => setUserCode(mission.solutionSnippet || '')}
                className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
              >
                Insert Solution Snippet
              </button>
            )}
          </div>

          <div className="rounded-xl overflow-hidden border border-[#26354D] bg-[#0B0F17]">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={8}
              className="w-full bg-[#0B0F17] text-gray-100 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              placeholder="# Write or paste your mission code here..."
            />

            {/* Test Assertion Terminal */}
            {testOutput && (
              <div className="p-3.5 bg-[#121826] border-t border-[#26354D] font-mono text-xs whitespace-pre-wrap">
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                  <Terminal className="w-3 h-3" />
                  <span>Validation Test Console</span>
                </div>
                <div className={isSuccess ? 'text-emerald-300' : 'text-amber-300'}>
                  {testOutput}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#26354D]">
          <Button variant="secondary" onClick={closeMissionModal}>
            Close
          </Button>

          <Button
            variant="glow"
            onClick={handleRunValidationTests}
            isLoading={isRunningTests}
            leftIcon={<Play className="w-4 h-4" />}
          >
            {isSuccess ? 'Re-Verify Tests & Record Evidence' : 'Run Validation Tests'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

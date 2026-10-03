import React, { useState } from 'react';
import { useAvenza } from '../../state/AppContext';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { ProgressBar } from '../../design-system/Progress';
import { VERIFICATION_REGISTRY, evaluateAssessment } from '../../services/verificationEngine';
import { VerificationResultView } from './VerificationResultView';
import { VerificationResult } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const {
    isVerificationModalOpen,
    verifyingSkillId,
    closeVerificationModal,
    submitVerificationResult,
  } = useAvenza();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<VerificationResult | null>(null);

  if (!isVerificationModalOpen || !verifyingSkillId) return null;

  const assessment = VERIFICATION_REGISTRY[verifyingSkillId] || VERIFICATION_REGISTRY['python-core'];
  const questions = assessment.questions;
  const currentQuestion = questions[currentQIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentQIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (index: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Evaluate assessment
      const res = evaluateAssessment(assessment, userAnswers);
      setResult(res);
      submitVerificationResult(res);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setResult(null);
    setCurrentQIndex(0);
    setUserAnswers({});
    closeVerificationModal();
  };

  const isOptionSelected = userAnswers[currentQuestion.id] !== undefined;

  return (
    <Modal
      isOpen={isVerificationModalOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-100">{assessment.title}</span>
            <div className="text-[11px] text-gray-400">Adaptive Skill Verification</div>
          </div>
        </div>
      }
      size="xl"
      className="border border-[#26354D] bg-[#121826]"
    >
      {result ? (
        <VerificationResultView result={result} onClose={handleClose} />
      ) : (
        <div className="space-y-6">
          {/* Progress Bar & Question Counter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold text-purple-400 uppercase tracking-wider">
                Question {currentQIndex + 1} of {totalQuestions}
              </span>
              <span className="font-mono text-gray-300">{assessment.skillName}</span>
            </div>
            <ProgressBar value={progressPercent} size="xs" variant="gradient" />
          </div>

          {/* Question Card */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#182234] border border-[#26354D] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span>{currentQuestion.skillAspect}</span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed">
                {currentQuestion.question}
              </p>

              {/* Code Snippet if present */}
              {currentQuestion.codeSnippet && (
                <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-[#26354D] font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options?.map((opt, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'bg-[#182234]/70 border-[#26354D] text-gray-300 hover:border-gray-500 hover:bg-[#182234]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-cyan-500 text-[#0B0F17]'
                            : 'bg-[#121826] text-gray-400 border border-[#26354D]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#26354D]">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQIndex === 0}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant="glow"
              onClick={handleNext}
              disabled={!isOptionSelected}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentQIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Next Question'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useAvenza } from '../../state/AppContext';
import { ContextInspector } from './ContextInspector';
import { Button } from '../../design-system/Button';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const MentorView: React.FC = () => {
  const {
    mentorMessages,
    sendMentorQuery,
    openMissionModal,
    openVerificationModal,
    setActiveTab,
    triggerManualReroute,
    activeStep,
  } = useAvenza();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    sendMentorQuery(inputQuery.trim());
    setInputQuery('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMentorQuery(prompt);
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'START_MISSION' && activeStep?.missionId) {
      openMissionModal(activeStep.missionId);
    } else if (action.actionType === 'START_VERIFICATION') {
      openVerificationModal(action.payload || 'python-core');
    } else if (action.actionType === 'NAVIGATE') {
      setActiveTab(action.payload || 'journey');
    } else if (action.actionType === 'REROUTE') {
      triggerManualReroute('TIME_CHANGE', { newMinutesPerDay: 20 });
    } else if (action.actionType === 'EXPLAIN_GAP') {
      sendMentorQuery(`Can you explain why "${activeStep?.title || 'this checkpoint'}" is critical for my target role using a clear analogy?`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#242520] to-[#2E302B] border border-[#3A3B34] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#30312C] border border-[#4A4A42] flex items-center justify-center text-[#F7F0E5] shadow-sm">
            <Bot className="w-6 h-6 text-[#8798B7]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F5EFE4]">Avenza Contextual AI Mentor</h2>
            <p className="text-xs text-[#BDB5A7]">
              Not a generic chatbot — grounded directly in your active checkpoint, gaps, and daily schedule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#8798B7]/16 text-[#A9B7D0] border border-[#8798B7]/50 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#8798B7]" />
            Path Aware
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Chat Workspace */}
        <div className="lg:col-span-3 flex flex-col h-[640px] rounded-2xl bg-[#282923] border border-[#4A4A42] overflow-hidden shadow-sm">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {mentorMessages.map((msg) => {
              const isMentor = msg.sender === 'MENTOR';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMentor ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isMentor
                        ? 'bg-[#30312C] text-[#A9B7D0] border border-[#4A4A42]'
                        : 'bg-[#8798B7] text-[#20211E]'
                    }`}
                  >
                    {isMentor ? <Bot className="w-4 h-4" /> : 'You'}
                  </div>

                  <div className={`space-y-2 max-w-xl ${isMentor ? '' : 'text-right'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isMentor
                          ? 'bg-[#242520] border border-[#3A3B34] text-[#F5EFE4]'
                          : 'bg-[#8798B7] text-[#20211E] font-medium text-left'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Action chips suggested by mentor */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-[#30312C] hover:bg-[#373832] text-[#A9B7D0] border border-[#4A4A42] hover:border-[#8798B7]/60 transition-all font-medium flex items-center gap-1 shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 text-[#8798B7]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="px-4 py-2 bg-[#242520] border-t border-[#3A3B34] flex flex-wrap gap-1.5">
            {[
              "Why do I need my current topic?",
              "Give me a hint for today's mission",
              "I only have 15 minutes today",
              "What skill gap should I bridge next?",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#30312C] hover:bg-[#373832] text-[#BDB5A7] hover:text-[#F5EFE4] border border-[#4A4A42] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 bg-[#242520] border-t border-[#3A3B34] flex gap-2">
            <input
              type="text"
              placeholder="Ask why a skill matters, request mission hints, or ask for analogies..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-[#282923] border border-[#4A4A42] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F5EFE4] placeholder-[#A39F94] focus:outline-none focus:ring-2 focus:ring-[#8798B7] focus:border-[#8798B7]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#8798B7] hover:bg-[#9AA9C4] text-[#20211E] shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4 text-[#20211E]" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Transparent Context Inspector */}
        <div className="space-y-4">
          <ContextInspector />

          <div className="p-4 rounded-xl bg-[#282923] border border-[#4A4A42] space-y-2 text-xs">
            <h4 className="font-bold text-[#F5EFE4]">How Avenza Mentors</h4>
            <p className="text-[#BDB5A7] leading-relaxed">
              Unlike generic LLMs, the Avenza Mentor receives your exact diagnostic levels, verified test scores, active milestone, and time budget on every turn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useAvenza } from '../../state/AppContext';
import { Button } from '../../design-system/Button';
import {
  FolderGit2,
  ExternalLink,
  Sparkles,
  Award,
  CheckCircle2,
  Code,
} from 'lucide-react';

export const ProjectShowcase: React.FC = () => {
  const { user, passport } = useAvenza();

  const portfolioProjects = [
    {
      id: 'proj-1',
      title: 'Local Knowledge Base & RAG Search Engine',
      category: 'AI & ML',
      description: 'End-to-end Python & vector search pipeline that indexes documents into ChromaDB and responds to natural language queries with verified citations.',
      skills: ['Python', 'LLMs', 'Vector Databases', 'Cosine Similarity'],
      status: 'AVAILABLE_FOR_CAPSTONE',
      estimatedHours: 4,
    },
    {
      id: 'proj-2',
      title: 'Real-Time Collaborative Agile Dashboard',
      category: 'Frontend & Fullstack',
      description: 'Interactive Kanban board with drag-and-drop mechanics, local persistence, responsive design system, and state management.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'State Machines'],
      status: 'AVAILABLE_FOR_CAPSTONE',
      estimatedHours: 3,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26354D] pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span>Capstone Portfolio Projects</span>
          </h3>
          <p className="text-xs text-gray-400">
            Synthesize all verified skills into real-world projects that produce permanent proof items for your Skill Passport.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl bg-[#182234] border border-[#26354D] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {proj.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  ~{proj.estimatedHours}h effort
                </span>
              </div>

              <h4 className="font-bold text-sm text-gray-100">{proj.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#26354D]">
              <div className="flex flex-wrap gap-1">
                {proj.skills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#141C2B] text-gray-300 border border-[#26354D]"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Inspect Capstone Blueprint
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

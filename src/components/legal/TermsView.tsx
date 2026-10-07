import React, { useEffect } from 'react';
import { LegalHeader } from './LegalHeader';
import { SiteFooter } from './SiteFooter';
import { updatePageMetadata } from '../../services/siteConfig';
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Award, Bot, Info } from 'lucide-react';

interface TermsViewProps {
  onNavigate: (route: 'app' | 'privacy' | 'terms') => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageMetadata({
      title: 'Terms & Conditions | AVENZA',
      description: 'Terms and Conditions of Service for AVENZA — Rules, guidelines, and terms governing the use of the AI Learning Navigator.',
      path: '/terms',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    { id: 'acceptance-of-terms', title: '1. Acceptance of Terms' },
    { id: 'eligibility', title: '2. Eligibility & Account Use' },
    { id: 'avenza-services', title: '3. Description of Avenza Services' },
    { id: 'user-accounts', title: '4. User Accounts & Profiles' },
    { id: 'user-responsibilities', title: '5. User Responsibilities & Acceptable Use' },
    { id: 'learning-content', title: '6. Learning Content & Curated Paths' },
    { id: 'ai-guidance', title: '7. AI-Generated Guidance Disclaimer' },
    { id: 'skill-verification', title: '8. Skill Verification Nature & Scope' },
    { id: 'skill-passport', title: '9. Skill Passport & Verifiable Ledger' },
    { id: 'user-content', title: '10. User Submissions & Code Proofs' },
    { id: 'intellectual-property', title: '11. Intellectual Property Rights' },
    { id: 'third-party-services', title: '12. Third-Party Services & Links' },
    { id: 'availability-changes', title: '13. Service Availability & Changes' },
    { id: 'disclaimers', title: '14. Warranty Disclaimers' },
    { id: 'limitation-of-liability', title: '15. Limitation of Liability' },
    { id: 'suspension-termination', title: '16. Suspension & Account Termination' },
    { id: 'changes-to-terms', title: '17. Changes to These Terms' },
    { id: 'governing-law', title: '18. Governing Law & Dispute Resolution' },
    { id: 'contact', title: '19. Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] dark:bg-[#1B1C19] text-[#20211E] dark:text-[#F4EDE1] transition-colors font-sans">
      <LegalHeader currentRoute="terms" onNavigate={onNavigate} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Document Header */}
        <div className="mb-12 border-b border-[#D8CCB9] dark:border-[#3A3B34] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE3D2] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] text-xs font-mono font-bold text-[#8A7050] dark:text-[#E0C77F] mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>TERMS OF SERVICE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-[#20211E] dark:text-[#F4EDE1] uppercase">
            Terms & Conditions
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-[#64625A] dark:text-[#A39F94]">
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Effective Date:</span>{' '}
              <span className="px-2 py-0.5 rounded bg-[#E8DDCB] dark:bg-[#2C2D27] text-[#4F6288] dark:text-[#9FB0D3]">
                [LAST UPDATED DATE]
              </span>
            </div>
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Entity:</span>{' '}
              <span>[LEGAL ENTITY NAME]</span>
            </div>
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Jurisdiction:</span>{' '}
              <span>[GOVERNING JURISDICTION]</span>
            </div>
          </div>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#5A5B53] dark:text-[#BDB5A6] max-w-3xl">
            Please read these Terms & Conditions carefully before accessing or using the AVENZA platform. These terms define the legally binding agreement between you and [LEGAL ENTITY NAME] regarding your use of our software, navigation systems, and educational diagnostic features.
          </p>
        </div>

        {/* Content Layout with Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of Contents Column */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 p-5 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34] shadow-sm">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64625A] dark:text-[#A39F94] mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#8495B8]" />
                <span>Table of Contents</span>
              </h2>
              <nav aria-label="Terms of service section index" className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="w-full text-left py-1.5 px-2 rounded-lg text-xs font-mono text-[#5A5B53] dark:text-[#BDB5A6] hover:text-[#20211E] dark:hover:text-[#F4EDE1] hover:bg-[#EFE6D6] dark:hover:bg-[#2C2D27] transition-colors truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8495B8]"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-[#D8CCB9]/60 dark:border-[#3A3B34] text-[11px] font-mono text-[#64625A] dark:text-[#A39F94]">
                <div className="flex items-center gap-1.5 text-[#8A7050] dark:text-[#E0C77F] font-semibold mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Key Educational Distinction</span>
                </div>
                AVENZA provides self-guided diagnostic and career planning tools, not accredited degrees or employment guarantees.
              </div>
            </div>
          </aside>

          {/* Detailed Document Body */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-10 text-sm sm:text-base leading-relaxed text-[#383933] dark:text-[#D5CEC2]">
            {/* 1. Acceptance of Terms */}
            <section id="acceptance-of-terms" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By visiting, accessing, or using AVENZA, you agree to comply with and be bound by these Terms & Conditions (“Terms”) and our Privacy Policy. If you do not accept all of these terms without reservation, you are not authorized to use the platform.
              </p>
              <p>
                If you are using AVENZA on behalf of an enterprise, educational institution, or other organization, you represent and warrant that you possess the authority to bind that entity to these Terms.
              </p>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                2. Eligibility & Account Use
              </h2>
              <p className="mb-4">
                You must be at least 13 years of age (or the minimum legal age for digital service consent in your jurisdiction) to use AVENZA. By using the platform, you confirm that you meet this requirement and are legally capable of entering into binding contracts.
              </p>
            </section>

            {/* 3. Avenza Services */}
            <section id="avenza-services" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                3. Description of Avenza Services
              </h2>
              <p className="mb-4">
                AVENZA provides digital educational navigation, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Dynamic Career GPS: Sequence of recommended study milestones toward target technical roles.</li>
                <li>Skill Gap Radar: Diagnostic visualization comparing your verified proficiencies against industry profiles.</li>
                <li>Practical Missions: Hands-on code challenges, system design exercises, and micro-assessments.</li>
                <li>AI Mentor: Contextual conversational tutor providing targeted learning explanations.</li>
                <li>Skill Passport: Tamper-evident record of completed assessments and evidence artifacts.</li>
              </ul>
            </section>

            {/* 4. User Accounts */}
            <section id="user-accounts" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                4. User Accounts & Profiles
              </h2>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of any account credentials or localized browser state associated with your profile. You agree to notify us immediately if you suspect unauthorized access or compromise of your account data.
              </p>
            </section>

            {/* 5. User Responsibilities */}
            <section id="user-responsibilities" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                5. User Responsibilities & Acceptable Use
              </h2>
              <p className="mb-4">
                When using AVENZA, you agree that you will NOT:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Forge, artificially manipulate, or falsify test outputs or skill verification ledger records.</li>
                <li>Reverse-engineer, decompile, or disassemble our proprietary 3D kinematics, navigational shaders, or core rating algorithms.</li>
                <li>Deploy automated scrapers, bots, or unauthorized extraction scripts against platform APIs.</li>
                <li>Submit unlawful, defamatory, or harmful content to the AI Mentor or mission submission forms.</li>
                <li>Interfere with or compromise the security, infrastructure, or operational uptime of the Service.</li>
              </ul>
            </section>

            {/* 6. Learning Content */}
            <section id="learning-content" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                6. Learning Content & Curated Paths
              </h2>
              <p className="mb-4">
                The learning pathways, curriculum sequences, and reference materials provided on AVENZA are for general educational and informational purposes. While we continually update skill frameworks to match current engineering practices, technologies evolve rapidly, and curriculum content is provided on an “as is” basis.
              </p>
            </section>

            {/* 7. AI-Generated Guidance */}
            <section id="ai-guidance" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#8495B8]" />
                <span>7. AI-Generated Guidance Disclaimer</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#ECE7F4] dark:bg-[#2E2838] border border-[#DDD5EA] dark:border-[#4B425A] text-xs font-mono text-[#5E5277] dark:text-[#D4CBE5] mb-4">
                <strong>IMPORTANT NOTICE:</strong> Avenza's AI-generated guidance is intended to support learning and exploration. Users should independently evaluate recommendations and verify important information.
              </div>
              <p className="mb-4">
                AVENZA incorporates artificial intelligence models to synthesize personalized advice, explain technical concepts, and suggest next steps. Because machine-learning models generate probabilistic answers, outputs may occasionally contain inaccuracies, omissions, or outdated syntax.
              </p>
              <p>
                AI Mentor responses do not constitute professional career counseling, binding legal advice, or guaranteed code security audits. You must exercise professional judgment before applying AI-generated advice in production environments.
              </p>
            </section>

            {/* 8. Skill Verification */}
            <section id="skill-verification" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4C6650] dark:text-[#9BB59F]" />
                <span>8. Skill Verification Nature & Scope</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#E6EDF5] dark:bg-[#232733] border border-[#D5E0EC] dark:border-[#3B4459] text-xs font-mono text-[#46597A] dark:text-[#9FB0D3] mb-4">
                <strong>VERIFICATION SCOPE:</strong> Skill verification on AVENZA reflects demonstrated skills, evidence artifacts, and learning progress observed within our platform tests. It does not constitute government accreditation, licensed certification, or an employment guarantee.
              </div>
              <p className="mb-4">
                When you complete an assessment or verification test within AVENZA:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Verification confirms that a specific test or challenge was executed successfully under the platform’s scoring criteria at that point in time.</li>
                <li>Verification does not guarantee employment, salary levels, promotion, or hiring outcomes with third-party employers.</li>
                <li>AVENZA is not an accredited university or licensed vocational institution unless expressly established by formal agreement.</li>
              </ul>
            </section>

            {/* 9. Skill Passport */}
            <section id="skill-passport" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8A7050] dark:text-[#E0C77F]" />
                <span>9. Skill Passport & Verifiable Ledger</span>
              </h2>
              <p className="mb-4">
                The Skill Passport represents a structured ledger of competencies recorded by AVENZA based on available evidence, test logs, and self-reported progression.
              </p>
              <p>
                While the Passport is designed to help you organize proof of mastery for portfolio sharing, AVENZA makes no representation regarding third-party acceptance or legal recognition of passport badges by any external employer or regulatory body.
              </p>
            </section>

            {/* 10. User Content */}
            <section id="user-content" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                10. User Submissions & Code Proofs
              </h2>
              <p className="mb-4">
                You retain ownership of any original code, project documentation, or written answers you submit to AVENZA. By submitting content through the Service, you grant AVENZA a non-exclusive, worldwide, royalty-free license to use, display, and analyze that content solely to provide, evaluate, and improve your learning experience.
              </p>
            </section>

            {/* 11. Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                11. Intellectual Property Rights
              </h2>
              <p className="mb-4">
                The AVENZA software, including its brand identity, logos, 3D cinematic navigation engine, glass panel shader systems, interactive HUD elements, taxonomy schemas, and visual assets, is the exclusive intellectual property of [LEGAL ENTITY NAME] and its licensors.
              </p>
              <p>
                No right, title, or interest in our intellectual property is transferred to you except for the limited, revocable license to access and use the platform for personal, non-commercial educational growth.
              </p>
            </section>

            {/* 12. Third-Party Services */}
            <section id="third-party-services" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                12. Third-Party Services & Links
              </h2>
              <p>
                AVENZA may reference third-party tools, code libraries, educational platforms, or documentation. We do not endorse or assume liability for third-party websites or services. Your interaction with third parties is subject to their independent terms and privacy guidelines.
              </p>
            </section>

            {/* 13. Availability & Changes */}
            <section id="availability-changes" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                13. Service Availability & Changes
              </h2>
              <p>
                We strive to maintain continuous service availability, but we do not guarantee uninterrupted or error-free operation. We reserve the right to modify, suspend, update, or discontinue any feature, diagnostic, or module at any time with or without notice.
              </p>
            </section>

            {/* 14. Disclaimers */}
            <section id="disclaimers" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                14. Warranty Disclaimers
              </h2>
              <p className="mb-4 font-mono text-xs uppercase text-[#8A5440] dark:text-[#E3A28E]">
                EXPRESS DISCLAIMER OF WARRANTIES
              </p>
              <p className="mb-4">
                THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p>
                AVENZA DOES NOT WARRANT THAT THE ADAPTIVE CURRICULUM WILL MEET YOUR CAREER REQUIREMENTS, ACHIEVE HIRING SUCCESS, OR OPERATE SECURELY WITHOUT OCCASIONAL SYSTEM INTERRUPTIONS.
              </p>
            </section>

            {/* 15. Limitation of Liability */}
            <section id="limitation-of-liability" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                15. Limitation of Liability
              </h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL [LEGAL ENTITY NAME], ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF CAREER OPPORTUNITIES, OR LOSS OF DATA) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>
              <p>
                OUR TOTAL AGGREGATE LIABILITY ARISING FROM ALL CLAIMS RELATING TO THE SERVICE SHALL BE LIMITED TO THE AMOUNT PAID BY YOU TO AVENZA IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR FIFTY US DOLLARS ($50.00), WHICHEVER IS GREATER.
              </p>
            </section>

            {/* 16. Suspension & Termination */}
            <section id="suspension-termination" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                16. Suspension & Account Termination
              </h2>
              <p>
                We may suspend or terminate your access to AVENZA immediately, without prior notice or liability, if you breach any provision of these Terms or engage in conduct that jeopardizes other users, our infrastructure, or the integrity of our verification system.
              </p>
            </section>

            {/* 17. Changes to Terms */}
            <section id="changes-to-terms" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                17. Changes to These Terms
              </h2>
              <p>
                We reserve the right to revise or replace these Terms at our discretion. We will indicate the revision date at the top of this page. Your continued use of the platform after the revised terms become effective constitutes your binding agreement to the modifications.
              </p>
            </section>

            {/* 18. Governing Law */}
            <section id="governing-law" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                18. Governing Law & Dispute Resolution
              </h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the substantive laws of [GOVERNING JURISDICTION], without regard to conflict of law principles.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall be resolved through good-faith negotiations before initiating formal legal proceedings in the competent courts of [GOVERNING JURISDICTION].
              </p>
            </section>

            {/* 19. Contact */}
            <section id="contact" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                19. Contact Information
              </h2>
              <p className="mb-4">
                If you have questions regarding these Terms & Conditions or need legal assistance, please contact:
              </p>
              <div className="p-4 rounded-xl bg-[#EFE6D6] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] space-y-1 text-xs font-mono">
                <div><strong>Entity:</strong> [LEGAL ENTITY NAME]</div>
                <div><strong>Legal Inquiries:</strong> <span className="text-[#4F6288] dark:text-[#9FB0D3]">[CONTACT EMAIL]</span></div>
                <div><strong>Physical Address:</strong> [BUSINESS ADDRESS]</div>
                <div><strong>Jurisdiction:</strong> [GOVERNING JURISDICTION]</div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
};

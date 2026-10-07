import React, { useEffect } from 'react';
import { LegalHeader } from './LegalHeader';
import { SiteFooter } from './SiteFooter';
import { updatePageMetadata } from '../../services/siteConfig';
import { Shield, Lock, FileText, CheckCircle2, AlertCircle, Eye, Database, Cpu } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onNavigate: (route: 'app' | 'privacy' | 'terms') => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageMetadata({
      title: 'Privacy Policy | AVENZA',
      description: 'Privacy Policy for AVENZA — Learn how your learning data, skill diagnostics, and personal information are handled.',
      path: '/privacy',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-we-collect', title: '2. Information We Collect' },
    { id: 'information-you-provide', title: '3. Information You Provide Directly' },
    { id: 'learning-skill-data', title: '4. Learning & Skill Diagnostics Data' },
    { id: 'how-we-use-information', title: '5. How We Use Your Information' },
    { id: 'ai-features', title: '6. AI Features & Machine Processing' },
    { id: 'data-storage', title: '7. Data Storage & Architecture' },
    { id: 'data-sharing', title: '8. Data Sharing & Disclosure' },
    { id: 'service-providers', title: '9. Third-Party Service Providers' },
    { id: 'security', title: '10. Security Safeguards' },
    { id: 'data-retention', title: '11. Data Retention' },
    { id: 'user-rights', title: '12. Your Rights & Data Controls' },
    { id: 'children-privacy', title: '13. Children’s Privacy' },
    { id: 'cookies-local-storage', title: '14. Cookies & Client Local Storage' },
    { id: 'third-party-links', title: '15. Third-Party Links & Services' },
    { id: 'changes-to-policy', title: '16. Changes to This Policy' },
    { id: 'contact-information', title: '17. Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] dark:bg-[#1B1C19] text-[#20211E] dark:text-[#F4EDE1] transition-colors font-sans">
      <LegalHeader currentRoute="privacy" onNavigate={onNavigate} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Document Header */}
        <div className="mb-12 border-b border-[#D8CCB9] dark:border-[#3A3B34] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6EDF5] dark:bg-[#252833] border border-[#D5E0EC] dark:border-[#3A4254] text-xs font-mono font-bold text-[#46597A] dark:text-[#9FB0D3] mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>DATA GOVERNANCE & PRIVACY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-[#20211E] dark:text-[#F4EDE1] uppercase">
            Privacy Policy
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-[#64625A] dark:text-[#A39F94]">
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Last Updated:</span>{' '}
              <span className="px-2 py-0.5 rounded bg-[#E8DDCB] dark:bg-[#2C2D27] text-[#4F6288] dark:text-[#9FB0D3]">
                [LAST UPDATED DATE]
              </span>
            </div>
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Entity:</span>{' '}
              <span>[LEGAL ENTITY NAME]</span>
            </div>
            <div>
              <span className="font-bold text-[#20211E] dark:text-[#F4EDE1]">Platform:</span>{' '}
              <span>AVENZA AI Learning Navigator</span>
            </div>
          </div>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#5A5B53] dark:text-[#BDB5A6] max-w-3xl">
            This Privacy Policy describes how [LEGAL ENTITY NAME] (“AVENZA”, “we”, “our”, or “us”) collects, uses, stores, and protects information when you access or use the AVENZA application, website, learning navigation systems, skill matrix diagnostics, and related digital services (collectively, the “Service”).
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
              <nav aria-label="Privacy policy section index" className="space-y-1">
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
                <div className="flex items-center gap-1.5 text-[#4C6650] dark:text-[#9BB59F] font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Privacy-First Principle</span>
                </div>
                Your skill telemetry and mission inputs are used solely to drive your personalized curriculum.
              </div>
            </div>
          </aside>

          {/* Detailed Document Body */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-10 text-sm sm:text-base leading-relaxed text-[#383933] dark:text-[#D5CEC2]">
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                1. Introduction
              </h2>
              <p className="mb-4">
                At AVENZA, we believe that career growth and technical skill acquisition require transparency, user agency, and clear data protection. We provide an intelligent, dynamic learning navigator designed to help individuals evaluate knowledge baselines, close skill gaps, complete practical technical challenges, and record verified proof of competence.
              </p>
              <p>
                By accessing or using AVENZA, you acknowledge that you have read and understood the terms of this Privacy Policy. If you do not agree with the practices described herein, please refrain from using our services.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information to deliver responsive, personalized learning journeys and to maintain the integrity of our adaptive curriculum engine. We classify data into the following categories:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li><strong>Account & Profile Details:</strong> User display name, selected target roles, experience tier, and daily learning budget preferences.</li>
                <li><strong>Curriculum Telemetry:</strong> Milestone completions, daily streak records, step statuses (planned, in progress, completed), and diagnostic scorecards.</li>
                <li><strong>Technical Diagnostics:</strong> Browser type, viewport dimensions, client device characteristics, and performance telemetry necessary for running 3D canvas and interactive web views.</li>
              </ul>
            </section>

            {/* 3. Information You Provide */}
            <section id="information-you-provide" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                3. Information You Provide Directly
              </h2>
              <p className="mb-4">
                When interacting with the platform, you may provide inputs directly through our user interface:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Self-assessment confidence ratings across various skill nodes (e.g., Python, System Architecture, Retrieval-Augmented Generation).</li>
                <li>Responses to interactive quizzes, diagnostic prompts, and self-checks.</li>
                <li>Queries submitted to the AI Mentor interface for clarification or advice.</li>
                <li>Code submissions, mock architecture schemas, or text answers submitted during practical Missions.</li>
              </ul>
            </section>

            {/* 4. Learning & Skill Diagnostics Data */}
            <section id="learning-skill-data" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                4. Learning & Skill Diagnostics Data
              </h2>
              <p className="mb-4">
                A core feature of AVENZA is our real-time Skill Gap Engine and Skill Passport ledger. This data includes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Skill proficiency levels (from Level 0 foundational to Level 5 mastery).</li>
                <li>Recorded evidence artifacts (test verification timestamps, code validation outputs, challenge completions).</li>
                <li>Identified critical, moderate, and minimal skill gaps between your current baseline and your selected destination role.</li>
              </ul>
              <div className="mt-4 p-4 rounded-xl bg-[#EFE6D6] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] text-xs font-mono">
                <span className="font-bold text-[#4F6288] dark:text-[#9FB0D3]">Data Ownership Notice:</span> Your skill matrix records and passport evidence are maintained to document your personal professional development. You retain control over your demo and saved profile state through the in-app reset and export tools.
              </div>
            </section>

            {/* 5. How We Use Information */}
            <section id="how-we-use-information" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                5. How We Use Your Information
              </h2>
              <p className="mb-4">
                We process your information exclusively for legitimate educational and operational purposes, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Dynamically computing and sequencing your daily learning roadmap.</li>
                <li>Personalizing contextual hints, study recommendations, and mission difficulty tiers.</li>
                <li>Maintaining session persistence, theme preferences (Bright/Dark), and UI preferences.</li>
                <li>Diagnosing technical glitches, canvas rendering bottlenecks, and usability issues.</li>
                <li>Preventing abuse, maintaining service reliability, and validating system integrity.</li>
              </ul>
            </section>

            {/* 6. AI Features */}
            <section id="ai-features" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#8495B8]" />
                <span>6. AI Features & Machine Processing</span>
              </h2>
              <p className="mb-4">
                AVENZA incorporates artificial intelligence systems, including the AI Mentor, dynamic route synthesizer, and diagnostic classifiers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6] mb-4">
                <li><strong>Prompt Processing:</strong> Text submitted to the AI Mentor or mission evaluator is processed in real time to generate contextual tutoring responses.</li>
                <li><strong>No Unauthorized Third-Party Training:</strong> We do not sell your personal prompts or confidential inputs to third parties for general public model training without explicit consent.</li>
                <li><strong>Automated Assistance:</strong> AI-driven outputs are informational and designed to support self-directed study. They should be reviewed critically by the learner.</li>
              </ul>
              <div className="p-4 rounded-xl bg-[#ECE7F4] dark:bg-[#2E2838] border border-[#DDD5EA] dark:border-[#4B425A] text-xs font-mono text-[#5E5277] dark:text-[#D4CBE5]">
                <strong>AI Guidance Disclaimer:</strong> AI-generated guidance, roadmaps, and code evaluations are provided for educational exploration. AVENZA does not guarantee error-free suggestions or definitive hiring suitability from AI suggestions alone.
              </div>
            </section>

            {/* 7. Data Storage */}
            <section id="data-storage" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#8495B8]" />
                <span>7. Data Storage & Architecture</span>
              </h2>
              <p className="mb-4">
                In the current client release of AVENZA:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li>Primary user profile, progress markers, and skill verification statuses are saved locally within your web browser via HTML5 <code>localStorage</code>.</li>
                <li>For connected production deployments requiring cloud persistence, data is transmitted over encrypted protocols (HTTPS/TLS) to cloud hosting environments provided by [HOSTING PROVIDER / CLOUD INFRASTRUCTURE].</li>
                <li>We do not make blanket claims of unverified end-to-end encryption; standard industry-standard transport security and secure client storage safeguards apply.</li>
              </ul>
            </section>

            {/* 8. Data Sharing */}
            <section id="data-sharing" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                8. Data Sharing & Disclosure
              </h2>
              <p className="mb-4">
                We do not sell, rent, or trade your personal information to third-party data brokers or advertisers. We only share information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li><strong>With Your Consent:</strong> When you elect to share or export your Skill Passport link or proof records to prospective employers or peers.</li>
                <li><strong>Legal Compliance:</strong> If required by valid court order, applicable statute, or regulatory requirement in [GOVERNING JURISDICTION].</li>
                <li><strong>Service Reliability:</strong> With vetted infrastructure partners providing essential hosting, delivery network, or telemetry under appropriate confidentiality safeguards.</li>
              </ul>
            </section>

            {/* 9. Service Providers */}
            <section id="service-providers" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                9. Third-Party Service Providers
              </h2>
              <p className="mb-4">
                To provide high-availability web delivery, font rendering, and AI inference, we may utilize third-party vendors:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li><strong>Hosting & Edge Delivery:</strong> [HOSTING PROVIDER PLACEHOLDER] for serving static bundles and web assets.</li>
                <li><strong>Typography:</strong> Google Fonts (Inter, Manrope, IBM Plex Mono, JetBrains Mono) loaded via secure content distribution.</li>
                <li><strong>AI Inference APIs:</strong> AI inference endpoints utilized solely for generating real-time mentorship guidance.</li>
              </ul>
            </section>

            {/* 10. Security */}
            <section id="security" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#8495B8]" />
                <span>10. Security Safeguards</span>
              </h2>
              <p className="mb-4">
                We implement administrative, technical, and physical safeguards designed to protect personal and learning diagnostic data. All client-server communications occur over modern TLS/HTTPS encryption. While we strive to maintain robust safeguards, no Internet transmission or electronic storage mechanism is completely impervious to risk.
              </p>
            </section>

            {/* 11. Data Retention */}
            <section id="data-retention" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                11. Data Retention
              </h2>
              <p className="mb-4">
                We retain user learning records only for as long as necessary to fulfill the educational purposes outlined in this policy or until you request deletion. You may clear your client-side progress at any time directly through the application's “Reset All Data” feature in the workspace header or navigation portal.
              </p>
            </section>

            {/* 12. User Rights */}
            <section id="user-rights" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                12. Your Rights & Data Controls
              </h2>
              <p className="mb-4">
                Depending on your jurisdiction, you may have specific privacy rights regarding your data:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li><strong>Access & Review:</strong> Inspect the active goals, skill scores, and passport badges stored in your profile.</li>
                <li><strong>Rectification:</strong> Re-test or update your skill levels and personal goal definitions at any time.</li>
                <li><strong>Erasure & Reset:</strong> Delete all stored learning progress and diagnostic logs by using the in-app Reset function or contacting us at [CONTACT EMAIL].</li>
                <li><strong>Portability:</strong> Export your verified skill ledger records from your Skill Passport.</li>
              </ul>
            </section>

            {/* 13. Children's Privacy */}
            <section id="children-privacy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                13. Children’s Privacy
              </h2>
              <p>
                AVENZA is intended for students, professional developers, and adult career learners. It is not directed at children under the age of 13 (or under 16 in relevant jurisdictions). We do not knowingly collect personal data from minors. If you believe a child has provided us with personal information, please contact us at [CONTACT EMAIL] so we can remove it promptly.
              </p>
            </section>

            {/* 14. Cookies & Local Storage */}
            <section id="cookies-local-storage" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                14. Cookies & Client Local Storage
              </h2>
              <p className="mb-4">
                AVENZA uses standard browser storage mechanisms:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5A5B53] dark:text-[#BDB5A6]">
                <li><code>localStorage</code>: Used to store your active learning journey, completed missions, radar diagnostic parameters, and visual theme selection across browser visits.</li>
                <li><code>sessionStorage</code>: Used for temporary interactive states, modal flags, and drawer views.</li>
              </ul>
              <p className="mt-3">
                We do not employ invasive cross-site advertising tracking cookies.
              </p>
            </section>

            {/* 15. Third-Party Services */}
            <section id="third-party-links" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                15. Third-Party Links & Services
              </h2>
              <p>
                Our learning roadmaps and discovery modules may cite external documentation, open-source repositories, or academic resources. We are not responsible for the privacy policies or content of external third-party websites. We encourage you to review their terms upon visiting.
              </p>
            </section>

            {/* 16. Changes to This Policy */}
            <section id="changes-to-policy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                16. Changes to This Policy
              </h2>
              <p>
                We may revise this Privacy Policy periodically to reflect technical enhancements, architectural changes, or evolving regulatory requirements. The updated date will always be indicated at the top of this page as [LAST UPDATED DATE]. Continued use of the platform following updates represents acceptance of the revised terms.
              </p>
            </section>

            {/* 17. Contact Information */}
            <section id="contact-information" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] dark:bg-[#232420] border border-[#D8CCB9] dark:border-[#3A3B34]">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#20211E] dark:text-[#F4EDE1] mb-4">
                17. Contact Information
              </h2>
              <p className="mb-4">
                If you have questions, feedback, or data privacy requests concerning this Privacy Policy, please contact our privacy compliance team:
              </p>
              <div className="p-4 rounded-xl bg-[#EFE6D6] dark:bg-[#2C2D27] border border-[#D8CCB9] dark:border-[#3D3F37] space-y-1 text-xs font-mono">
                <div><strong>Entity:</strong> [LEGAL ENTITY NAME]</div>
                <div><strong>Privacy Email:</strong> <span className="text-[#4F6288] dark:text-[#9FB0D3]">[CONTACT EMAIL]</span></div>
                <div><strong>Mailing Address:</strong> [BUSINESS ADDRESS]</div>
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

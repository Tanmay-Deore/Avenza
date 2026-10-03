import { DiscoveryDirection } from '../types';

export const DISCOVERY_DIRECTIONS: DiscoveryDirection[] = [
  {
    id: 'dir-ai-ml',
    title: 'AI & Machine Learning Engineering',
    tagline: 'Teach computers to reason, predict, and generate with real-world data and LLMs.',
    category: 'AI & ML',
    difficulty: 'MODERATE',
    description: 'Build intelligent systems ranging from predictive statistical models to cutting-edge Generative AI agents, RAG search pipelines, and neural networks.',
    commonSkills: ['Python', 'Data Manipulation (Pandas)', 'Statistics', 'Machine Learning', 'Deep Learning', 'LLM Prompting & RAG'],
    exampleProjects: [
      { title: 'Smart PDF Q&A Knowledge Assistant', desc: 'A local RAG search system that answers questions from uploaded documents with citations.', icon: 'FileText' },
      { title: 'Customer Churn Predictor', desc: 'Train and evaluate a Random Forest classifier predicting user renewal probability.', icon: 'TrendingUp' },
      { title: 'Vision Defect Classifier', desc: 'A PyTorch Convolutional Neural Network that flags anomalies in manufacturing images.', icon: 'Eye' },
    ],
    prerequisites: ['Basic math intuition', 'Willingness to experiment with data'],
    learningDifficultyText: 'Moderate — Starts easy with Python, deepens into math and neural architectures.',
    suggestedStartingPoint: 'Python Fundamentals → Data Wrangling with Pandas → First Predictor Model.',
    starterChallenge: {
      title: 'AI Exploration: Predict House Prices with 3 Lines',
      scenario: 'Imagine you have 1,000 house listings with square footage and price. How does an AI find the trend line?',
      sampleTask: 'Look at the data curve and pick the best mathematical fit: Linear, Exponential, or Random.',
    },
    matchedInterests: ['Artificial Intelligence', 'Mathematics & Logic', 'Automating Complex Tasks', 'Future Tech'],
    matchedStrengths: ['Analytical Thinking', 'Pattern Recognition', 'Curiosity about Brains/Algorithms'],
    suitabilityScore: 85,
    tags: ['High Growth', 'Cutting Edge', 'Research & Engineering', 'Python'],
  },
  {
    id: 'dir-fullstack-web',
    title: 'Fullstack Web Development',
    tagline: 'Create interactive websites, mobile-friendly UIs, and robust cloud APIs from scratch.',
    category: 'Frontend',
    difficulty: 'BEGINNER_FRIENDLY',
    description: 'Bring ideas to life on the web. Craft responsive user interfaces with React and connect them to secure backend databases and APIs.',
    commonSkills: ['HTML5 & CSS3', 'JavaScript & TypeScript', 'React', 'Node.js / FastAPI', 'PostgreSQL / SQL', 'Git'],
    exampleProjects: [
      { title: 'Real-time Team Collaboration Board', desc: 'Kanban board with live updates, drag-and-drop tasks, and user authentication.', icon: 'Layout' },
      { title: 'E-Commerce Marketplace & Checkout', desc: 'Product catalog with cart state, Stripe payments, and admin order dashboard.', icon: 'ShoppingBag' },
      { title: 'Interactive Habit Tracker App', desc: 'Daily streak visualizer with responsive dark mode and cloud sync.', icon: 'CheckSquare' },
    ],
    prerequisites: ['No prior programming needed'],
    learningDifficultyText: 'Beginner-Friendly — Highly visual, instant feedback in your browser.',
    suggestedStartingPoint: 'HTML/CSS/JS Basics → Interactive React Components → Fullstack REST API.',
    starterChallenge: {
      title: 'Web Exploration: Fix the Broken Button',
      scenario: 'A user clicks "Submit" but nothing happens. Find the missing click event listener.',
      sampleTask: 'Inspect the JavaScript event handler and add the missing action.',
    },
    matchedInterests: ['Building Products People See', 'Design & UX', 'Entrepreneurship / Startups', 'Visual Feedback'],
    matchedStrengths: ['Creativity', 'Attention to Detail', 'Pragmatic Problem Solving'],
    suitabilityScore: 80,
    tags: ['Most In-Demand', 'Fast Visual Results', 'Freelance & Jobs', 'JavaScript'],
  },
  {
    id: 'dir-data-analytics',
    title: 'Data Analytics & Business Intelligence',
    tagline: 'Turn confusing numbers and databases into clear stories, trends, and decisions.',
    category: 'Data',
    difficulty: 'BEGINNER_FRIENDLY',
    description: 'Extract raw tables from SQL databases, clean them with Python, and build executive dashboards that guide business strategy.',
    commonSkills: ['SQL & Relational Databases', 'Python (Pandas)', 'Data Visualization', 'Statistics', 'Business Storytelling'],
    exampleProjects: [
      { title: 'Global Sales & Revenue Dashboard', desc: 'Interactive visual report showing regional trends, customer segments, and revenue growth.', icon: 'BarChart2' },
      { title: 'User Retention & Cohort Analysis', desc: 'Track week-by-week user engagement drop-offs to diagnose product bottlenecks.', icon: 'Users' },
    ],
    prerequisites: ['Curiosity about facts and business trends'],
    learningDifficultyText: 'Beginner-Friendly — Fast to learn with SQL and intuitive visualization tools.',
    suggestedStartingPoint: 'SQL Fundamentals → Pandas Cleaning → Interactive Charts.',
    starterChallenge: {
      title: 'Data Exploration: Spot the Anomaly in Sales',
      scenario: 'Look at monthly revenue data. A sudden 40% dip happened in August. Was it marketing or server downtime?',
      sampleTask: 'Filter the query by date range to isolate the exact week of the drop.',
    },
    matchedInterests: ['Analyzing Trends', 'Business Strategy', 'Solving Mysteries with Facts', 'Charts & Visuals'],
    matchedStrengths: ['Logical Deduction', 'Curiosity', 'Clear Communication'],
    suitabilityScore: 75,
    tags: ['High Business Impact', 'Non-Coding Friendly Start', 'SQL', 'Analytics'],
  },
  {
    id: 'dir-cybersecurity',
    title: 'Cybersecurity & Defensive Security',
    tagline: 'Defend systems, audit vulnerabilities, and safeguard sensitive data from attackers.',
    category: 'Cybersecurity',
    difficulty: 'MODERATE',
    description: 'Learn how hackers find flaws in networks, APIs, and web apps, and how to engineer bulletproof defenses, encryption, and secure architectures.',
    commonSkills: ['Web Security (OWASP)', 'Network Protocols', 'Linux Systems', 'Cryptography', 'Python Scripting'],
    exampleProjects: [
      { title: 'Automated Web Vulnerability Scanner', desc: 'Python script that probes web forms for SQL Injection and Cross-Site Scripting flaws.', icon: 'ShieldAlert' },
      { title: 'Secure Authentication & 2FA Gateway', desc: 'Implement multi-factor authentication with encrypted sessions and brute-force protection.', icon: 'Lock' },
    ],
    prerequisites: ['Basic computing concepts'],
    learningDifficultyText: 'Moderate — Requires understanding networking, operating systems, and web architecture.',
    suggestedStartingPoint: 'Networking & Web Basics → OWASP Top 10 → Secure Coding Practices.',
    starterChallenge: {
      title: 'Security Exploration: Prevent a SQL Injection',
      scenario: 'An input field allows `\' OR 1=1 --`. How do you protect the database?',
      sampleTask: 'Convert raw string concatenation into a parameterized prepared statement.',
    },
    matchedInterests: ['Puzzles & Reverse Engineering', 'Privacy & Ethics', 'Investigating How Things Break', 'Defense'],
    matchedStrengths: ['Skeptical Thinking', 'Persistence', 'Systematic Investigation'],
    suitabilityScore: 70,
    tags: ['Critical Industry Need', 'High Security', 'Problem Solving'],
  },
];

export function calculateDirectionSuitability(answers: {
  interests: string[];
  strengths: string[];
  curiosity: string[];
  workStyle: string;
  enjoyedActivities: string[];
}): DiscoveryDirection[] {
  return DISCOVERY_DIRECTIONS.map((dir) => {
    let score = 50; // baseline

    // Interest matches
    const interestMatches = dir.matchedInterests.filter((i) =>
      answers.interests.some((ai) => ai.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(ai.toLowerCase()))
    );
    score += interestMatches.length * 12;

    // Strength matches
    const strengthMatches = dir.matchedStrengths.filter((s) =>
      answers.strengths.some((as) => as.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(as.toLowerCase()))
    );
    score += strengthMatches.length * 10;

    // Work style matches
    if (answers.workStyle === 'building_visual' && dir.id === 'dir-fullstack-web') score += 15;
    if (answers.workStyle === 'deep_analytical' && (dir.id === 'dir-ai-ml' || dir.id === 'dir-data-analytics')) score += 15;
    if (answers.workStyle === 'puzzles_security' && dir.id === 'dir-cybersecurity') score += 18;

    // Cap between 40 and 98
    const finalScore = Math.min(98, Math.max(40, score));

    return {
      ...dir,
      suitabilityScore: finalScore,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

import { VerificationAssessment, VerificationResult, EvidenceItem, VerificationQuestion } from '../types';

export const VERIFICATION_REGISTRY: Record<string, VerificationAssessment> = {
  'python-core': {
    id: 'verify-python-core',
    skillId: 'python-core',
    skillName: 'Python Fundamentals',
    title: 'Python Core Proficiency & Logic Assessment',
    type: 'MIXED',
    description: 'Evaluate your understanding of Python functions, list comprehensions, dictionary operations, error handling, and debugging.',
    estimatedMinutes: 8,
    passingScore: 70,
    questions: [
      {
        id: 'py-q1',
        type: 'MCQ',
        question: 'What is the output of the following Python list comprehension?',
        codeSnippet: `numbers = [1, 2, 3, 4, 5, 6]\nresult = [x * 2 for x in numbers if x % 2 == 0]\nprint(result)`,
        options: [
          '[2, 4, 6, 8, 10, 12]',
          '[4, 8, 12]',
          '[2, 6, 10]',
          '[4, 16, 36]',
        ],
        correctAnswerIndex: 1,
        explanation: 'Only even numbers [2, 4, 6] pass the filter (x % 2 == 0). Multiplying each by 2 yields [4, 8, 12].',
        difficulty: 2,
        skillAspect: 'List Comprehensions & Filtering',
      },
      {
        id: 'py-q2',
        type: 'CODE_FIX',
        question: 'Identify the bug in this function that should safely retrieve a user age or default to 0:',
        codeSnippet: `def get_user_age(user_data):\n    # Buggy: crashes if 'age' key is missing\n    return user_data['age']`,
        options: [
          `return user_data.get('age', 0)`,
          `return user_data['age'] if 'age' == 0 else None`,
          `return user_data.find('age', 0)`,
          `return user_data.pop('age')`,
        ],
        correctAnswerIndex: 0,
        explanation: `Using the .get(key, default) method avoids KeyError when the key does not exist in the dictionary.`,
        difficulty: 2,
        skillAspect: 'Safe Dictionary Access & Error Prevention',
      },
      {
        id: 'py-q3',
        type: 'OUTPUT_PREDICTION',
        question: 'What happens when this Python code executes?',
        codeSnippet: `def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))`,
        options: [
          '[1] then [2]',
          '[1] then [1, 2]',
          '[1, 2] then [1, 2]',
          'Throws a TypeError',
        ],
        correctAnswerIndex: 1,
        explanation: 'Default mutable arguments (like lists) are evaluated once at function definition time, so state persists across subsequent calls.',
        difficulty: 3,
        skillAspect: 'Mutable Default Arguments & Memory Model',
      },
      {
        id: 'py-q4',
        type: 'MCQ',
        question: 'Which block in a try-except structure is ALWAYS executed, regardless of whether an exception occurred?',
        options: [
          'else',
          'finally',
          'catch',
          'always',
        ],
        correctAnswerIndex: 1,
        explanation: 'The `finally` block always executes whether an error occurred, was caught, or was not caught, making it ideal for cleanup actions.',
        difficulty: 2,
        skillAspect: 'Exception Handling Architecture',
      },
      {
        id: 'py-q5',
        type: 'MCQ',
        question: 'What is the primary difference between a list and a set in Python?',
        options: [
          'Lists are immutable; sets are mutable',
          'Sets preserve exact insertion order, lists do not',
          'Sets contain unique elements with O(1) average lookup time; lists allow duplicates with O(n) search',
          'Lists only hold integers; sets hold any object',
        ],
        correctAnswerIndex: 2,
        explanation: 'Sets are implemented as hash tables, ensuring all elements are unique and membership checks (`x in my_set`) run in O(1) average time.',
        difficulty: 3,
        skillAspect: 'Data Structure Complexity & Lookup Optimization',
      },
    ],
  },
  'numpy-pandas': {
    id: 'verify-numpy-pandas',
    skillId: 'numpy-pandas',
    skillName: 'Data Manipulation (NumPy & Pandas)',
    title: 'Data Wrangling & Vectorization Assessment',
    type: 'MIXED',
    description: 'Verify your capability in filtering dataframes, aggregating group statistics, handling missing data, and vectorized operations.',
    estimatedMinutes: 8,
    passingScore: 70,
    questions: [
      {
        id: 'pd-q1',
        type: 'MCQ',
        question: 'Which Pandas operation calculates the average revenue for each department?',
        options: [
          `df.aggregate('department').mean('revenue')`,
          `df.groupby('department')['revenue'].mean()`,
          `df.filter(department=True)['revenue'].avg()`,
          `df['revenue'].groupby('department').sum()`,
        ],
        correctAnswerIndex: 1,
        explanation: '`df.groupby("department")["revenue"].mean()` groups the dataframe by the categorical column and computes the arithmetic mean of the numeric column.',
        difficulty: 2,
        skillAspect: 'Groupby Aggregations',
      },
      {
        id: 'pd-q2',
        type: 'CODE_FIX',
        question: 'How do you correctly filter a dataframe for customers where `age >= 18` AND `country == "US"`?',
        options: [
          `df[(df['age'] >= 18) and (df['country'] == 'US')]`,
          `df[(df['age'] >= 18) & (df['country'] == 'US')]`,
          `df.filter(age >= 18, country == 'US')`,
          `df.where(age >= 18 && country == 'US')`,
        ],
        correctAnswerIndex: 1,
        explanation: 'In Pandas, bitwise operators `&` and `|` with parentheses around each condition must be used for element-wise boolean indexing.',
        difficulty: 2,
        skillAspect: 'Boolean Masking & Filtering',
      },
      {
        id: 'pd-q3',
        type: 'MCQ',
        question: 'What does `df.isna().sum()` compute on a Pandas DataFrame?',
        options: [
          'The sum of all numeric values excluding nulls',
          'The count of missing (NaN/Null) values in each column',
          'The total number of rows with valid entries',
          'Replaces all null values with zeroes',
        ],
        correctAnswerIndex: 1,
        explanation: '`isna()` returns a boolean dataframe (True where null) and `.sum()` tallies the True values per column.',
        difficulty: 1,
        skillAspect: 'Data Cleaning & Missing Value Auditing',
      },
    ],
  },
  'html-css-js': {
    id: 'verify-html-css-js',
    skillId: 'html-css-js',
    skillName: 'Modern Web Foundations',
    title: 'Frontend Web Fundamentals Assessment',
    type: 'MIXED',
    description: 'Test your understanding of DOM manipulation, CSS layouts (Flexbox/Grid), asynchronous JavaScript, and semantic HTML.',
    estimatedMinutes: 8,
    passingScore: 70,
    questions: [
      {
        id: 'web-q1',
        type: 'MCQ',
        question: 'Which CSS property centers a flex item along the main axis?',
        options: ['align-items: center', 'justify-content: center', 'text-align: center', 'place-self: center'],
        correctAnswerIndex: 1,
        explanation: '`justify-content` aligns items along the main axis (default horizontal in row direction), while `align-items` aligns along the cross axis.',
        difficulty: 1,
        skillAspect: 'CSS Flexbox Layouts',
      },
      {
        id: 'web-q2',
        type: 'MCQ',
        question: 'What is the purpose of `event.preventDefault()` in a form submission event listener?',
        options: [
          'To stop the event from bubbling up the DOM tree',
          'To prevent the default browser page reload on submit',
          'To clear all user input fields in the form',
          'To disable all buttons inside the form',
        ],
        correctAnswerIndex: 1,
        explanation: 'Browser forms reload the page upon submit by default. Calling `preventDefault()` allows Single Page Apps to handle submission with JavaScript.',
        difficulty: 2,
        skillAspect: 'DOM Events & SPA Behavior',
      },
      {
        id: 'web-q3',
        type: 'CODE_FIX',
        question: 'How do you safely wait for an asynchronous fetch request in JavaScript?',
        codeSnippet: `// How should this function be structured?\nasync function loadData() {\n    const res = ??? fetch('/api/user');\n    const data = ??? res.json();\n    return data;\n}`,
        options: [
          'await and await',
          'then and then',
          'sync and resolve',
          'yield and yield',
        ],
        correctAnswerIndex: 0,
        explanation: '`await` pauses execution until the Promise resolves, both for the network response `fetch()` and parsing the JSON body `res.json()`.',
        difficulty: 2,
        skillAspect: 'Async / Await Architecture',
      },
    ],
  },
  'machine-learning-core': {
    id: 'verify-machine-learning-core',
    skillId: 'machine-learning-core',
    skillName: 'Classical Machine Learning',
    title: 'Machine Learning Model & Evaluation Assessment',
    type: 'MIXED',
    description: 'Assess understanding of training vs testing data splits, overfitting/underfitting, cross-validation, and metrics like precision and recall.',
    estimatedMinutes: 8,
    passingScore: 70,
    questions: [
      {
        id: 'ml-q1',
        type: 'MCQ',
        question: 'If a classifier has high training accuracy (99%) but low validation accuracy (62%), what problem is occurring?',
        options: ['Underfitting (High Bias)', 'Overfitting (High Variance)', 'Data Leakage', 'Optimal Convergence'],
        correctAnswerIndex: 1,
        explanation: 'Overfitting occurs when a model memorizes the training data including noise, failing to generalize to unseen validation data.',
        difficulty: 2,
        skillAspect: 'Model Generalization & Variance Diagnosis',
      },
      {
        id: 'ml-q2',
        type: 'MCQ',
        question: 'In a medical cancer detection model where missing a positive case is catastrophic, which metric should you maximize?',
        options: ['Precision', 'Recall (Sensitivity)', 'Specificity', 'Mean Squared Error'],
        correctAnswerIndex: 1,
        explanation: 'Recall measures the proportion of actual positives that were correctly identified. High recall minimizes False Negatives.',
        difficulty: 3,
        skillAspect: 'Evaluation Metric Selection',
      },
    ],
  },
};

export function evaluateAssessment(
  assessment: VerificationAssessment,
  userAnswers: Record<string, number>
): VerificationResult {
  let correctCount = 0;
  const strongAreas: string[] = [];
  const areasToImprove: string[] = [];
  const totalQuestions = assessment.questions.length;

  assessment.questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (selected === q.correctAnswerIndex) {
      correctCount++;
      strongAreas.push(q.skillAspect);
    } else {
      areasToImprove.push(q.skillAspect);
    }
  });

  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= assessment.passingScore;

  // Award level based on score & difficulty
  let awardedLevel = 0;
  if (score >= 90) awardedLevel = 4;
  else if (score >= 70) awardedLevel = 3;
  else if (score >= 50) awardedLevel = 2;
  else awardedLevel = 1;

  const areasRequiringEvidence: string[] = [];
  if (awardedLevel < 4) {
    areasRequiringEvidence.push('Practical Project Implementation (e.g. GitHub Repository or Live Demo)');
  }
  if (areasToImprove.length > 0) {
    areasRequiringEvidence.push(`Targeted practice in: ${areasToImprove.slice(0, 2).join(', ')}`);
  }

  let feedback = '';
  if (passed) {
    feedback = `Outstanding performance! You scored ${score}%, demonstrating solid conceptual and practical proficiency in ${assessment.skillName}. Verified Level ${awardedLevel} has been officially recorded in your Skill Passport.`;
  } else {
    feedback = `You scored ${score}%. While you showed strength in ${strongAreas.length > 0 ? strongAreas[0] : 'basic syntax'}, targeted revision in ${areasToImprove.slice(0, 2).join(' and ')} will solidify your skills before advancing.`;
  }

  return {
    id: `result-${Date.now()}`,
    skillId: assessment.skillId,
    skillName: assessment.skillName,
    timestamp: new Date().toISOString(),
    score,
    passed,
    awardedLevel,
    strongAreas,
    areasToImprove,
    areasRequiringEvidence,
    feedback,
  };
}

export function createEvidenceFromVerification(result: VerificationResult): EvidenceItem {
  return {
    id: `ev-verif-${Date.now()}`,
    title: `${result.skillName} — Adaptive Assessment`,
    type: 'ASSESSMENT',
    skillId: result.skillId,
    skillName: result.skillName,
    levelEarned: result.awardedLevel,
    timestamp: result.timestamp,
    proofSummary: `Scored ${result.score}% on verified assessment. Demonstrated strengths in: ${result.strongAreas.join(', ')}.`,
    verifiedBy: 'Avenza Automated Skill Verification Engine',
  };
}

import { Course, LearningResource, Quiz, StudentAccount } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cs101',
    code: 'CS101',
    title: 'Computer Science Fundamentals',
    description: 'Core concepts in algorithms, data structures, computational logic, and web foundations.',
    icon: 'Terminal',
    color: 'indigo',
    instructor: 'Dr. Evelyn Reed',
    topics: [
      {
        id: 'topic-cs-1',
        courseId: 'course-cs101',
        title: 'Data Structures & Arrays',
        description: 'Linear data structures, memory allocation, and array traversal algorithms.',
        order: 1,
      },
      {
        id: 'topic-cs-2',
        courseId: 'course-cs101',
        title: 'Algorithm Complexity & Big-O',
        description: 'Time and space complexity analysis, asymptotic notation, and performance optimization.',
        order: 2,
      },
      {
        id: 'topic-cs-3',
        courseId: 'course-cs101',
        title: 'Object-Oriented Programming',
        description: 'Encapsulation, inheritance, polymorphism, and abstraction design patterns.',
        order: 3,
      },
    ],
  },
  {
    id: 'course-bio202',
    code: 'BIO202',
    title: 'Cellular Biology & Genetics',
    description: 'Exploration of molecular biology, cellular metabolism, DNA synthesis, and inheritance laws.',
    icon: 'Dna',
    color: 'emerald',
    instructor: 'Prof. Marcus Vance',
    topics: [
      {
        id: 'topic-bio-1',
        courseId: 'course-bio202',
        title: 'Cell Structure & Organelles',
        description: 'Mitochondria, ribosomes, endoplasmic reticulum, and nuclear membrane mechanics.',
        order: 1,
      },
      {
        id: 'topic-bio-2',
        courseId: 'course-bio202',
        title: 'DNA Replication & Transcription',
        description: 'Helicase, polymerase enzyme pathways, messenger RNA synthesis, and codons.',
        order: 2,
      },
      {
        id: 'topic-bio-3',
        courseId: 'course-bio202',
        title: 'Mendelian Genetics & Punnett Squares',
        description: 'Dominant vs recessive alleles, phenotypic ratios, and genetic cross problems.',
        order: 3,
      },
    ],
  },
  {
    id: 'course-math105',
    code: 'MATH105',
    title: 'Calculus & Applied Mathematics',
    description: 'Differential calculus, integrals, limits, vector spaces, and real-world modeling.',
    icon: 'Calculator',
    color: 'amber',
    instructor: 'Dr. Aris Thorne',
    topics: [
      {
        id: 'topic-math-1',
        courseId: 'course-math105',
        title: 'Limits & Continuity',
        description: 'Epsilon-delta definitions, one-sided limits, squeeze theorem, and asymptotes.',
        order: 1,
      },
      {
        id: 'topic-math-2',
        courseId: 'course-math105',
        title: 'Derivatives & Chain Rule',
        description: 'Rate of change, power rule, product rule, quotient rule, and implicit differentiation.',
        order: 2,
      },
      {
        id: 'topic-math-3',
        courseId: 'course-math105',
        title: 'Definite & Indefinite Integrals',
        description: 'Riemann sums, Fundamental Theorem of Calculus, and substitution techniques.',
        order: 3,
      },
    ],
  },
];

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    courseId: 'course-cs101',
    subject: 'Computer Science',
    topicId: 'topic-cs-1',
    title: 'Array Memory Layout & Pointer Arithmetic Guide',
    description: 'Comprehensive study guide examining contiguous memory allocation, indexing formulas, and cache locality.',
    type: 'pdf',
    fileSize: '2.4 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# Array Memory Layout & Pointer Arithmetic

### Key Concepts
1. **Contiguous Allocation:** Arrays occupy sequential physical memory addresses.
2. **Direct Indexing:** Address calculation formula: \`Address(A[i]) = Base_Address + (i * element_size)\`.
3. **Time Complexity:** Constant time O(1) random access by index.
4. **Cache Friendliness:** Sequential reads maximize CPU L1/L2 cache line hits.

### Common Pitfalls
* Off-by-one errors when iterating from index 0 to length - 1.
* Buffer overflows when writing past allocated bounds in unmanaged languages.`,
    uploadedAt: '2026-08-20T10:00:00Z',
    assignedCourses: ['course-cs101'],
  },
  {
    id: 'res-2',
    courseId: 'course-cs101',
    subject: 'Computer Science',
    topicId: 'topic-cs-1',
    title: 'Visualizing Linked Lists vs Dynamic Arrays',
    description: 'Interactive slide deck contrasting memory overhead, insertion overhead, and spatial locality.',
    type: 'presentation',
    fileSize: '5.1 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# Comparison: Linked Lists vs Dynamic Arrays

* **Dynamic Array:** Amortized O(1) append, O(1) random access, reallocations require doubling capacity.
* **Singly Linked List:** O(1) head insertion, O(n) traversal, extra pointer storage per node.
* **Modern CPU Considerations:** Dynamic arrays almost always outperform linked lists due to spatial locality and prefetching.`,
    uploadedAt: '2026-08-22T14:30:00Z',
    assignedCourses: ['course-cs101'],
  },
  {
    id: 'res-3',
    courseId: 'course-cs101',
    subject: 'Computer Science',
    topicId: 'topic-cs-2',
    title: 'Mastering Big-O Analysis: Lecture Masterclass',
    description: 'Full video walkthrough deriving recurrence relations and master theorem for divide-and-conquer algorithms.',
    type: 'video',
    duration: '28 mins',
    url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    contentNotes: `# Big-O Notation Summary

- **O(1)**: Constant time (Hash table lookup average case)
- **O(log n)**: Logarithmic time (Binary search)
- **O(n)**: Linear time (Single pass array scan)
- **O(n log n)**: Linearithmic (Merge sort, quicksort average)
- **O(n^2)**: Quadratic (Nested loops, bubble sort)
- **O(2^n)**: Exponential (Naive Fibonacci recursion)`,
    uploadedAt: '2026-08-25T09:15:00Z',
    assignedCourses: ['course-cs101'],
  },
  {
    id: 'res-4',
    courseId: 'course-cs101',
    subject: 'Computer Science',
    topicId: 'topic-cs-3',
    title: 'OOP Design Principles & SOLID Cheatsheet',
    description: 'Practical summary document covering Single Responsibility, Open/Closed, Liskov, Interface Segregation, and Dependency Inversion.',
    type: 'document',
    fileSize: '1.2 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# The SOLID Principles in Action

1. **S**ingle Responsibility: A class should have one, and only one, reason to change.
2. **O**pen/Closed: Software entities should be open for extension, but closed for modification.
3. **L**iskov Substitution: Subtypes must be substitutable for their base types.
4. **I**nterface Segregation: Clients should not be forced to depend on methods they do not use.
5. **D**ependency Inversion: High-level modules should depend on abstractions, not concretions.`,
    uploadedAt: '2026-08-28T11:00:00Z',
    assignedCourses: ['course-cs101'],
  },
  {
    id: 'res-5',
    courseId: 'course-bio202',
    subject: 'Cellular Biology',
    topicId: 'topic-bio-1',
    title: 'Mitochondrial Membrane & ATP Synthase Diagrams',
    description: 'High-resolution diagram pack and study notes explaining the electron transport chain and chemiosmosis.',
    type: 'pdf',
    fileSize: '4.8 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# Cellular Respiration & ATP Synthase

- **Glycolysis**: Occurs in cytoplasm, produces 2 pyruvate, 2 net ATP, 2 NADH.
- **Citric Acid Cycle**: Matrix of mitochondria, yields CO2, ATP, NADH, FADH2.
- **Oxidative Phosphorylation**: Inner mitochondrial membrane uses proton gradient to power rotary motor of ATP synthase.
- **Yield**: Approximately 30-32 ATP molecules per glucose molecule.`,
    uploadedAt: '2026-08-26T16:20:00Z',
    assignedCourses: ['course-bio202'],
  },
  {
    id: 'res-6',
    courseId: 'course-bio202',
    subject: 'Cellular Biology',
    topicId: 'topic-bio-2',
    title: 'DNA Replication Fork Machinery Video',
    description: '3D animation walkthrough of leading vs lagging strands, Okazaki fragments, and DNA ligase.',
    type: 'video',
    duration: '18 mins',
    url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    contentNotes: `# DNA Replication Machinery

- **Helicase**: Unzips double helix breaking hydrogen bonds.
- **Single-Stranded Binding Proteins (SSBs)**: Stabilize unwound strands.
- **Primase**: Synthesizes RNA primer for polymerases.
- **DNA Polymerase III**: Extends strand 5' to 3'.
- **DNA Polymerase I**: Replaces RNA primers with DNA nucleotides.
- **DNA Ligase**: Joins Okazaki fragments on lagging strand.`,
    uploadedAt: '2026-08-29T10:00:00Z',
    assignedCourses: ['course-bio202'],
  },
  {
    id: 'res-7',
    courseId: 'course-math105',
    subject: 'Calculus',
    topicId: 'topic-math-1',
    title: 'Limits & Continuity Theorem Reference Manual',
    description: 'Step-by-step proofs for L\'Hopital\'s rule, Squeeze Theorem, and Intermediate Value Theorem.',
    type: 'pdf',
    fileSize: '3.1 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# Calculus: Limits & Continuity Essentials

- **Continuity Test at x=c**:
  1. f(c) is defined.
  2. lim_{x->c} f(x) exists.
  3. lim_{x->c} f(x) = f(c).
- **Intermediate Value Theorem**: If f is continuous on [a,b], it takes on every value between f(a) and f(b).
- **L'Hopital's Rule**: Applicable strictly to indeterminate forms 0/0 or inf/inf.`,
    uploadedAt: '2026-08-30T13:40:00Z',
    assignedCourses: ['course-math105'],
  },
  {
    id: 'res-8',
    courseId: 'course-math105',
    subject: 'Calculus',
    topicId: 'topic-math-2',
    title: 'Derivatives Formula Sheet & Practice Problem Set',
    description: 'Curated cheat sheet with trigonometric derivatives, exponential rules, and 20 worked examples.',
    type: 'material',
    fileSize: '1.9 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    contentNotes: `# Differentiation Rules Cheatsheet

- **Power Rule**: d/dx [x^n] = n * x^(n-1)
- **Product Rule**: d/dx [u * v] = u'v + uv'
- **Quotient Rule**: d/dx [u / v] = (u'v - uv') / v^2
- **Chain Rule**: d/dx [f(g(x))] = f'(g(x)) * g'(x)
- **Trig**: d/dx [sin x] = cos x; d/dx [cos x] = -sin x; d/dx [tan x] = sec^2 x`,
    uploadedAt: '2026-08-31T08:30:00Z',
    assignedCourses: ['course-math105'],
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-cs-1',
    courseId: 'course-cs101',
    topicId: 'topic-cs-1',
    title: 'Data Structures: Arrays & Memory Quiz',
    description: 'Test your understanding of array indexing, contiguous memory blocks, and pointer calculations.',
    durationMinutes: 10,
    passPercentage: 70,
    createdAt: '2026-08-21T00:00:00Z',
    questions: [
      {
        id: 'q-cs-1-1',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-1',
        quizId: 'quiz-cs-1',
        question: 'What is the time complexity of accessing an element in an array by its index?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'O(1) Constant Time' },
          { key: 'B', text: 'O(log n) Logarithmic Time' },
          { key: 'C', text: 'O(n) Linear Time' },
          { key: 'D', text: 'O(n^2) Quadratic Time' },
        ],
        correctAnswer: 'A',
        explanation: 'Arrays store elements in contiguous memory locations, allowing direct memory offset computation in O(1) time using the base address.',
        marks: 2,
      },
      {
        id: 'q-cs-1-2',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-1',
        quizId: 'quiz-cs-1',
        question: 'In 0-indexed arrays, if base address is 1000 and each integer occupies 4 bytes, what is the address of array[4]?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: '1004' },
          { key: 'B', text: '1012' },
          { key: 'C', text: '1016' },
          { key: 'D', text: '1020' },
        ],
        correctAnswer: 'C',
        explanation: 'Address = Base + (Index * Size) = 1000 + (4 * 4) = 1000 + 16 = 1016.',
        marks: 2,
      },
      {
        id: 'q-cs-1-3',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-1',
        quizId: 'quiz-cs-1',
        question: 'True or False: Inserting an element at the beginning of a static array requires shifting all subsequent elements.',
        questionType: 'true_false',
        options: [
          { key: 'A', text: 'True' },
          { key: 'B', text: 'False' },
          { key: 'C', text: 'N/A' },
          { key: 'D', text: 'N/A' },
        ],
        correctAnswer: 'A',
        explanation: 'Because array elements are stored contiguously, prepending an element requires shifting all existing n elements right by one position, an O(n) operation.',
        marks: 1,
      },
      {
        id: 'q-cs-1-4',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-1',
        quizId: 'quiz-cs-1',
        question: 'What happens when a dynamic array exceeds its allocated capacity during an append operation?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'A runtime segmentation fault occurs immediately.' },
          { key: 'B', text: 'A larger memory block is allocated, elements are copied over, and the old block is freed.' },
          { key: 'C', text: 'The array permanently converts itself into a binary search tree.' },
          { key: 'D', text: 'The oldest element is automatically overwritten.' },
        ],
        correctAnswer: 'B',
        explanation: 'Dynamic arrays allocate a new larger block (typically 2x capacity), copy existing elements, and free the prior memory chunk, yielding amortized O(1) append time.',
        marks: 2,
      },
    ],
  },
  {
    id: 'quiz-cs-2',
    courseId: 'course-cs101',
    topicId: 'topic-cs-2',
    title: 'Algorithm Complexity & Big-O Evaluation',
    description: 'Assess your skills in analyzing loop nesting, recursive depth, and asymptotic notations.',
    durationMinutes: 15,
    passPercentage: 70,
    createdAt: '2026-08-23T00:00:00Z',
    questions: [
      {
        id: 'q-cs-2-1',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-2',
        quizId: 'quiz-cs-2',
        question: 'Which algorithm has a worst-case time complexity of O(n log n)?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'Bubble Sort' },
          { key: 'B', text: 'Merge Sort' },
          { key: 'C', text: 'Selection Sort' },
          { key: 'D', text: 'Quick Sort (naive pivot)' },
        ],
        correctAnswer: 'B',
        explanation: 'Merge Sort consistently divides the array into halves (log n levels) and performs linear merging at each level (n work), guaranteeing O(n log n) even in the worst case.',
        marks: 2,
      },
      {
        id: 'q-cs-2-2',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-2',
        quizId: 'quiz-cs-2',
        question: 'What is the tight upper bound Big-O of binary search on a sorted array of size n?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'O(1)' },
          { key: 'B', text: 'O(log n)' },
          { key: 'C', text: 'O(n)' },
          { key: 'D', text: 'O(n log n)' },
        ],
        correctAnswer: 'B',
        explanation: 'Binary search halves the search space with every comparison, leading to a maximum of log2(n) iterations.',
        marks: 2,
      },
      {
        id: 'q-cs-2-3',
        courseId: 'course-cs101',
        subject: 'Computer Science',
        topicId: 'topic-cs-2',
        quizId: 'quiz-cs-2',
        question: 'True or False: Space complexity measures auxiliary memory used, excluding the original input size.',
        questionType: 'true_false',
        options: [
          { key: 'A', text: 'True' },
          { key: 'B', text: 'False' },
          { key: 'C', text: 'N/A' },
          { key: 'D', text: 'N/A' },
        ],
        correctAnswer: 'A',
        explanation: 'Auxiliary space refers specifically to temporary or extra space used by the algorithm beyond the input data representation.',
        marks: 1,
      },
    ],
  },
  {
    id: 'quiz-bio-1',
    courseId: 'course-bio202',
    topicId: 'topic-bio-1',
    title: 'Cell Organelles & Membrane Physiology',
    description: 'Comprehensive assessment on cellular organelles, active transport, and energy production.',
    durationMinutes: 12,
    passPercentage: 75,
    createdAt: '2026-08-27T00:00:00Z',
    questions: [
      {
        id: 'q-bio-1-1',
        courseId: 'course-bio202',
        subject: 'Cellular Biology',
        topicId: 'topic-bio-1',
        quizId: 'quiz-bio-1',
        question: 'Which organelle is responsible for post-translational modification and sorting of proteins?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'Lysosome' },
          { key: 'B', text: 'Golgi Apparatus' },
          { key: 'C', text: 'Peroxisome' },
          { key: 'D', text: 'Smooth Endoplasmic Reticulum' },
        ],
        correctAnswer: 'B',
        explanation: 'The Golgi apparatus modifies proteins received from the rough ER (e.g. glycosylation) and packages them into secretory vesicles.',
        marks: 2,
      },
      {
        id: 'q-bio-1-2',
        courseId: 'course-bio202',
        subject: 'Cellular Biology',
        topicId: 'topic-bio-1',
        quizId: 'quiz-bio-1',
        question: 'Where within eukaryotic cells does the Citric Acid (Krebs) cycle take place?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: 'Cytoplasm' },
          { key: 'B', text: 'Mitochondrial Matrix' },
          { key: 'C', text: 'Intermembrane space' },
          { key: 'D', text: 'Nucleolus' },
        ],
        correctAnswer: 'B',
        explanation: 'The Krebs cycle takes place in the fluid mitochondrial matrix, where pyruvate dehydrogenase and other Krebs enzymes reside.',
        marks: 2,
      },
      {
        id: 'q-bio-1-3',
        courseId: 'course-bio202',
        subject: 'Cellular Biology',
        topicId: 'topic-bio-1',
        quizId: 'quiz-bio-1',
        question: 'True or False: The cell membrane consists primarily of an amphipathic phospholipid bilayer with embedded integral proteins.',
        questionType: 'true_false',
        options: [
          { key: 'A', text: 'True' },
          { key: 'B', text: 'False' },
          { key: 'C', text: 'N/A' },
          { key: 'D', text: 'N/A' },
        ],
        correctAnswer: 'A',
        explanation: 'The fluid mosaic model explains that the plasma membrane is composed of hydrophilic phosphate heads facing water and hydrophobic fatty acid tails facing inward.',
        marks: 1,
      },
    ],
  },
  {
    id: 'quiz-math-1',
    courseId: 'course-math105',
    topicId: 'topic-math-1',
    title: 'Limits & Continuity Mastery Quiz',
    description: 'Evaluate fundamental limit theorems, indeterminate forms, and continuity definitions.',
    durationMinutes: 10,
    passPercentage: 70,
    createdAt: '2026-08-30T00:00:00Z',
    questions: [
      {
        id: 'q-math-1-1',
        courseId: 'course-math105',
        subject: 'Calculus',
        topicId: 'topic-math-1',
        quizId: 'quiz-math-1',
        question: 'What is the limit of (sin x) / x as x approaches 0?',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: '1' },
          { key: 'C', text: 'Infinity' },
          { key: 'D', text: 'Does Not Exist' },
        ],
        correctAnswer: 'B',
        explanation: 'By the geometric squeeze theorem or L\'Hopital\'s rule, lim_{x->0} (sin x)/x = lim_{x->0} (cos x)/1 = 1.',
        marks: 2,
      },
      {
        id: 'q-math-1-2',
        courseId: 'course-math105',
        subject: 'Calculus',
        topicId: 'topic-math-1',
        quizId: 'quiz-math-1',
        question: 'Evaluate the derivative of f(x) = 3x^4 - 5x^2 + 7 at x = 2.',
        questionType: 'multiple_choice',
        options: [
          { key: 'A', text: '76' },
          { key: 'B', text: '54' },
          { key: 'C', text: '42' },
          { key: 'D', text: '88' },
        ],
        correctAnswer: 'A',
        explanation: 'f\'(x) = 12x^3 - 10x. Evaluated at x=2: 12(8) - 10(2) = 96 - 20 = 76.',
        marks: 2,
      },
    ],
  },
];

export const INITIAL_STUDENTS: StudentAccount[] = [
  {
    id: 'stud-1',
    username: 'alex.student',
    password: 'student123',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.apexacademy.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    assignedCourses: ['course-cs101', 'course-bio202', 'course-math105'],
    createdAt: '2026-08-15T09:00:00Z',
    lastLogin: '2026-09-04T08:15:00Z',
  },
  {
    id: 'stud-2',
    username: 'sarah.m',
    password: 'student123',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@student.apexacademy.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    assignedCourses: ['course-cs101', 'course-math105'],
    createdAt: '2026-08-16T11:20:00Z',
    lastLogin: '2026-09-03T14:40:00Z',
  },
  {
    id: 'stud-3',
    username: 'david.k',
    password: 'student123',
    name: 'David Kim',
    email: 'david.kim@student.apexacademy.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'inactive',
    assignedCourses: ['course-bio202'],
    createdAt: '2026-08-18T15:10:00Z',
    lastLogin: '2026-08-25T10:05:00Z',
  },
];

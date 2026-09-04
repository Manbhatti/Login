export type UserRole = 'student' | 'admin';

export interface StudentAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  assignedCourses: string[]; // array of Course IDs
  createdAt: string;
  lastLogin?: string;
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
}

export type CourseTopic = Topic;

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  instructor: string;
  department?: string;
  topics: Topic[];
}

export type ResourceType = 'pdf' | 'document' | 'presentation' | 'video' | 'material';

export interface LearningResource {
  id: string;
  courseId: string;
  subject: string;
  topicId: string;
  title: string;
  description: string;
  type: ResourceType;
  fileSize?: string;
  duration?: string;
  url: string;
  contentNotes?: string;
  uploadedAt: string;
  assignedCourses?: string[];
}

export type QuestionType = 'multiple_choice' | 'true_false';

export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export type QuestionItem = QuizQuestion;

export interface QuizQuestion {
  id: string;
  courseId: string;
  subject: string;
  topicId: string;
  quizId?: string;
  question: string;
  questionType: QuestionType;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  marks: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  topicId: string;
  title: string;
  description: string;
  durationMinutes: number;
  passPercentage: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttemptResult {
  id: string;
  studentId: string;
  studentUsername: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  courseName: string;
  topicTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  submittedAt: string;
}

export interface BulkUploadRow {
  course: string;
  subject: string;
  topic: string;
  question: string;
  questionType: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  marks: number;
  isValid: boolean;
  errors: string[];
}

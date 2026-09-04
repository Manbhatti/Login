import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Course,
  LearningResource,
  Quiz,
  StudentAccount,
  QuizAttemptResult,
  BulkUploadRow,
  QuizQuestion,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_RESOURCES,
  INITIAL_QUIZZES,
  INITIAL_STUDENTS,
} from '../data/mockData';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

interface DataContextType {
  courses: Course[];
  resources: LearningResource[];
  quizzes: Quiz[];
  students: StudentAccount[];
  quizResults: QuizAttemptResult[];
  isLoading: boolean;
  // Student operations
  addStudent: (data: Omit<StudentAccount, 'id' | 'createdAt'>) => StudentAccount;
  updateStudent: (id: string, data: Partial<StudentAccount>) => void;
  deleteStudent: (id: string) => void;
  toggleStudentStatus: (id: string) => void;
  resetStudentPassword: (id: string, newPassword: string) => void;
  // Resource operations
  addResource: (data: Omit<LearningResource, 'id' | 'uploadedAt'>) => LearningResource;
  updateResource: (id: string, data: Partial<LearningResource>) => void;
  deleteResource: (id: string) => void;
  // Quiz operations
  addQuiz: (data: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  updateQuiz: (id: string, data: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  bulkImportQuestions: (
    rows: BulkUploadRow[],
    courseId: string,
    topicId: string,
    quizTitle?: string
  ) => { importedCount: number; quizTitle: string };
  submitQuizAttempt: (
    data: Omit<QuizAttemptResult, 'id' | 'submittedAt'>
  ) => QuizAttemptResult;
  // Course operations
  addCourse: (data: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  // Helper
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LS_COURSES = 'aura_edu_courses';
const LS_RESOURCES = 'aura_edu_resources';
const LS_QUIZZES = 'aura_edu_quizzes';
const LS_STUDENTS = 'aura_edu_students';
const LS_RESULTS = 'aura_edu_quiz_results';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(LS_COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [resources, setResources] = useState<LearningResource[]>(() => {
    try {
      const saved = localStorage.getItem(LS_RESOURCES);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(LS_QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [students, setStudents] = useState<StudentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LS_STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [quizResults, setQuizResults] = useState<QuizAttemptResult[]>(() => {
    try {
      const saved = localStorage.getItem(LS_RESULTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LS_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(LS_RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(LS_QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(LS_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(LS_RESULTS, JSON.stringify(quizResults));
  }, [quizResults]);

  // Firestore background initial hydration & seeding
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function hydrateFromFirestore() {
      try {
        if (!db) return;
        // Check courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        if (!coursesSnap.empty) {
          const loadedCourses = coursesSnap.docs.map((d) => d.data() as Course);
          if (isMounted) setCourses(loadedCourses);
        } else {
          // Seed initial courses to Firestore
          for (const c of INITIAL_COURSES) {
            await setDoc(doc(db, 'courses', c.id), c);
          }
        }

        // Check students
        const studentsSnap = await getDocs(collection(db, 'students'));
        if (!studentsSnap.empty) {
          const loadedStudents = studentsSnap.docs.map((d) => d.data() as StudentAccount);
          if (isMounted) setStudents(loadedStudents);
        } else {
          for (const s of INITIAL_STUDENTS) {
            await setDoc(doc(db, 'students', s.id), s);
          }
        }

        // Check resources
        const resSnap = await getDocs(collection(db, 'resources'));
        if (!resSnap.empty) {
          const loadedRes = resSnap.docs.map((d) => d.data() as LearningResource);
          if (isMounted) setResources(loadedRes);
        } else {
          for (const r of INITIAL_RESOURCES) {
            await setDoc(doc(db, 'resources', r.id), r);
          }
        }

        // Check quizzes
        const quizzesSnap = await getDocs(collection(db, 'quizzes'));
        if (!quizzesSnap.empty) {
          const loadedQuizzes = quizzesSnap.docs.map((d) => d.data() as Quiz);
          if (isMounted) setQuizzes(loadedQuizzes);
        } else {
          for (const q of INITIAL_QUIZZES) {
            await setDoc(doc(db, 'quizzes', q.id), q);
          }
        }

        // Check results
        const resultsSnap = await getDocs(collection(db, 'quiz_results'));
        if (!resultsSnap.empty) {
          const loadedResults = resultsSnap.docs.map((d) => d.data() as QuizAttemptResult);
          if (isMounted) setQuizResults(loadedResults);
        }
      } catch (err) {
        console.warn('Firestore hydration notice (using reliable cached data):', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    hydrateFromFirestore();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper: background write to Firestore
  const syncToFirestore = useCallback(async (collName: string, id: string, data: any) => {
    if (!db) return;
    try {
      await setDoc(doc(db, collName, id), data);
    } catch (e) {
      console.warn(`Error writing to ${collName}/${id}:`, e);
    }
  }, []);

  const deleteFromFirestore = useCallback(async (collName: string, id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, collName, id));
    } catch (e) {
      console.warn(`Error deleting from ${collName}/${id}:`, e);
    }
  }, []);

  // Student Operations
  const addStudent = (data: Omit<StudentAccount, 'id' | 'createdAt'>): StudentAccount => {
    const newStudent: StudentAccount = {
      ...data,
      id: `stud-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    syncToFirestore('students', newStudent.id, newStudent);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<StudentAccount>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...data };
          syncToFirestore('students', id, updated);
          return updated;
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    deleteFromFirestore('students', id);
  };

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated: StudentAccount = {
            ...s,
            status: s.status === 'active' ? 'inactive' : 'active',
          };
          syncToFirestore('students', id, updated);
          return updated;
        }
        return s;
      })
    );
  };

  const resetStudentPassword = (id: string, newPassword: string) => {
    updateStudent(id, { password: newPassword });
  };

  // Resource Operations
  const addResource = (data: Omit<LearningResource, 'id' | 'uploadedAt'>): LearningResource => {
    const newResource: LearningResource = {
      ...data,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setResources((prev) => [newResource, ...prev]);
    syncToFirestore('resources', newResource.id, newResource);
    return newResource;
  };

  const updateResource = (id: string, data: Partial<LearningResource>) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...data };
          syncToFirestore('resources', id, updated);
          return updated;
        }
        return r;
      })
    );
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    deleteFromFirestore('resources', id);
  };

  // Quiz Operations
  const addQuiz = (data: Omit<Quiz, 'id' | 'createdAt'>): Quiz => {
    const newQuiz: Quiz = {
      ...data,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    syncToFirestore('quizzes', newQuiz.id, newQuiz);
    return newQuiz;
  };

  const updateQuiz = (id: string, data: Partial<Quiz>) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, ...data };
          syncToFirestore('quizzes', id, updated);
          return updated;
        }
        return q;
      })
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    deleteFromFirestore('quizzes', id);
  };

  const bulkImportQuestions = (
    rows: BulkUploadRow[],
    courseId: string,
    topicId: string,
    customQuizTitle?: string
  ): { importedCount: number; quizTitle: string } => {
    const validRows = rows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      return { importedCount: 0, quizTitle: '' };
    }

    const course = courses.find((c) => c.id === courseId);
    const topic = course?.topics.find((t) => t.id === topicId);
    const generatedTitle =
      customQuizTitle?.trim() ||
      `${topic?.title || 'Topic'} Quiz (${new Date().toLocaleDateString()})`;

    const quizQuestions: QuizQuestion[] = validRows.map((r, index) => {
      const qType: 'multiple_choice' | 'true_false' =
        r.questionType.toLowerCase().includes('true') ||
        r.questionType.toLowerCase().includes('boolean')
          ? 'true_false'
          : 'multiple_choice';

      return {
        id: `q-imported-${Date.now()}-${index}`,
        courseId,
        subject: r.subject || course?.title || 'Course Subject',
        topicId,
        question: r.question,
        questionType: qType,
        options: [
          { key: 'A', text: r.optionA || 'Option A' },
          { key: 'B', text: r.optionB || 'Option B' },
          ...(r.optionC ? [{ key: 'C' as const, text: r.optionC }] : []),
          ...(r.optionD ? [{ key: 'D' as const, text: r.optionD }] : []),
        ],
        correctAnswer: (r.correctAnswer.toUpperCase() as 'A' | 'B' | 'C' | 'D') || 'A',
        explanation: r.explanation || 'Answer verified based on topic curriculum.',
        marks: Number(r.marks) || 1,
      };
    });

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      courseId,
      topicId,
      title: generatedTitle,
      description: `Comprehensive assessment with ${quizQuestions.length} curated questions.`,
      durationMinutes: Math.max(5, Math.ceil(quizQuestions.length * 2)),
      passPercentage: 70,
      questions: quizQuestions,
      createdAt: new Date().toISOString(),
    };

    setQuizzes((prev) => [newQuiz, ...prev]);
    syncToFirestore('quizzes', newQuiz.id, newQuiz);

    return { importedCount: quizQuestions.length, quizTitle: generatedTitle };
  };

  const submitQuizAttempt = (
    data: Omit<QuizAttemptResult, 'id' | 'submittedAt'>
  ): QuizAttemptResult => {
    const newResult: QuizAttemptResult = {
      ...data,
      id: `res-attempt-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setQuizResults((prev) => [newResult, ...prev]);
    syncToFirestore('quiz_results', newResult.id, newResult);
    return newResult;
  };

  // Course Operations
  const addCourse = (data: Omit<Course, 'id'>): Course => {
    const newCourse: Course = {
      ...data,
      id: `course-${Date.now()}`,
    };
    setCourses((prev) => [...prev, newCourse]);
    syncToFirestore('courses', newCourse.id, newCourse);
    return newCourse;
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...data };
          syncToFirestore('courses', id, updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    deleteFromFirestore('courses', id);
  };

  const resetToDefaults = () => {
    setCourses(INITIAL_COURSES);
    setResources(INITIAL_RESOURCES);
    setQuizzes(INITIAL_QUIZZES);
    setStudents(INITIAL_STUDENTS);
    setQuizResults([]);
    localStorage.removeItem(LS_COURSES);
    localStorage.removeItem(LS_RESOURCES);
    localStorage.removeItem(LS_QUIZZES);
    localStorage.removeItem(LS_STUDENTS);
    localStorage.removeItem(LS_RESULTS);
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        resources,
        quizzes,
        students,
        quizResults,
        isLoading,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        resetStudentPassword,
        addResource,
        updateResource,
        deleteResource,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        bulkImportQuestions,
        submitQuizAttempt,
        addCourse,
        updateCourse,
        deleteCourse,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

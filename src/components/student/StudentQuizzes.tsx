import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Quiz } from '../../types';
import { QuizPlayer } from './QuizPlayer';
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface StudentQuizzesProps {
  onBackToDashboard: () => void;
  onViewAllResults: () => void;
}

export const StudentQuizzes: React.FC<StudentQuizzesProps> = ({
  onBackToDashboard,
  onViewAllResults,
}) => {
  const { currentStudent } = useAuth();
  const { courses, quizzes, quizResults } = useData();

  // Filter courses assigned to this student
  const studentCourses = useMemo(() => {
    if (!currentStudent) return [];
    return courses.filter((c) => currentStudent.assignedCourses?.includes(c.id));
  }, [courses, currentStudent]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    studentCourses[0]?.id || ''
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const currentCourse = studentCourses.find((c) => c.id === selectedCourseId);

  // Available quizzes for this course & topic
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      if (q.courseId !== selectedCourseId) return false;
      if (selectedTopicId !== 'all' && q.topicId !== selectedTopicId) return false;
      return true;
    });
  }, [quizzes, selectedCourseId, selectedTopicId]);

  // If student is actively taking a quiz, render the QuizPlayer
  if (activeQuiz && currentCourse) {
    const topic = currentCourse.topics.find((t) => t.id === activeQuiz.topicId);
    return (
      <QuizPlayer
        quiz={activeQuiz}
        courseTitle={currentCourse.title}
        topicTitle={topic?.title || 'Course Topic'}
        onExit={() => setActiveQuiz(null)}
        onViewAllResults={() => {
          setActiveQuiz(null);
          onViewAllResults();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={onBackToDashboard}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800">Quizzes</span>
            {currentCourse && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-600 font-semibold">{currentCourse.code}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Topic-Based Quizzes & Self-Assessments
          </h1>
          <p className="text-sm text-slate-500">
            Select your enrolled course and topic to test your knowledge with auto-graded questions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onViewAllResults}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            My Past Results
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Course Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Select Enrolled Course:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {studentCourses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            const courseQuizCount = quizzes.filter((q) => q.courseId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setSelectedTopicId('all');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{courseQuizCount} quizzes</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Filter Pills */}
      {currentCourse && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Select Topic:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopicId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedTopicId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Topics ({quizzes.filter((q) => q.courseId === currentCourse.id).length})
            </button>
            {currentCourse.topics.map((t) => {
              const count = quizzes.filter(
                (q) => q.courseId === currentCourse.id && q.topicId === t.id
              ).length;
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{t.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz Cards */}
      <div>
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No quizzes currently available</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              There are no quizzes published for this specific topic yet. Try selecting another topic or check back later.
            </p>
            <button
              onClick={() => setSelectedTopicId('all')}
              className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
            >
              View All Quizzes in {currentCourse?.code}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredQuizzes.map((q) => {
              const topic = currentCourse?.topics.find((t) => t.id === q.topicId);
              const pastAttempts = quizResults.filter(
                (r) => r.quizId === q.id && r.studentId === currentStudent?.id
              );
              const latestAttempt = pastAttempts[pastAttempts.length - 1];

              const totalMarks = q.questions.reduce((acc, curr) => acc + curr.marks, 0);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            {topic?.title || 'General Topic'}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {q.questions.length} Questions • {totalMarks} Marks
                          </span>
                        </div>
                      </div>

                      {latestAttempt && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            latestAttempt.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          Best: {latestAttempt.percentage}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {q.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Est. {q.durationMinutes} Mins
                      </span>
                      <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Pass Mark: {q.passPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {pastAttempts.length > 0
                        ? `Attempted ${pastAttempts.length} time${pastAttempts.length > 1 ? 's' : ''}`
                        : 'Not yet attempted'}
                    </span>
                    <button
                      onClick={() => setActiveQuiz(q)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{pastAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

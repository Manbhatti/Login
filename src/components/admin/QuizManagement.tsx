import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Quiz, QuestionItem } from '../../types';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Upload,
  BookOpen,
  Eye,
} from 'lucide-react';

interface QuizManagementProps {
  initialTab?: 'quizzes' | 'question-bank';
  onNavigateToUpload: () => void;
}

export const QuizManagement: React.FC<QuizManagementProps> = ({
  initialTab = 'quizzes',
  onNavigateToUpload,
}) => {
  const { courses, quizzes, deleteQuiz } = useData();

  const [activeTab, setActiveTab] = useState<'quizzes' | 'question-bank'>(initialTab);
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);

  // Flattened question bank for Question Bank tab
  const allBankQuestions = useMemo(() => {
    const list: { question: QuestionItem; quizTitle: string; courseCode: string }[] = [];
    quizzes.forEach((q) => {
      const course = courses.find((c) => c.id === q.courseId);
      q.questions.forEach((question) => {
        list.push({
          question,
          quizTitle: q.title,
          courseCode: course?.code || 'Course',
        });
      });
    });
    return list;
  }, [quizzes, courses]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      if (courseFilter !== 'all' && q.courseId !== courseFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [quizzes, courseFilter, searchQuery]);

  const filteredQuestions = useMemo(() => {
    return allBankQuestions.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.question.question.toLowerCase().includes(query) ||
          item.quizTitle.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allBankQuestions, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            {activeTab === 'quizzes' ? 'Quiz & Assessment Management' : 'Central Question Bank'}
          </h1>
          <p className="text-sm text-slate-500">
            {activeTab === 'quizzes'
              ? 'Organize topic-based tests, set passing thresholds, and manage assessments.'
              : 'Browse and search through all active questions and auto-graded answer keys.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload Questions</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'quizzes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Quizzes ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('question-bank')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'question-bank'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Question Bank ({allBankQuestions.length} Questions)
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, topic, question..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {activeTab === 'quizzes' && (
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Enrolled Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TAB 1: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
              No quizzes found. Use the Bulk Upload tool to add quizzes from a spreadsheet.
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const course = courses.find((c) => c.id === quiz.courseId);
              const topic = course?.topics.find((t) => t.id === quiz.topicId);
              const isExpanded = expandedQuizId === quiz.id;
              const totalMarks = quiz.questions.reduce((a, b) => a + b.marks, 0);

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          {course?.code || 'Course'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {topic?.title || 'Topic'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{quiz.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span>{quiz.questions.length} Questions</span>
                        <span>•</span>
                        <span>{totalMarks} Total Marks</span>
                        <span>•</span>
                        <span>Pass Mark: {quiz.passPercentage}%</span>
                        <span>•</span>
                        <span>Est. {quiz.durationMinutes} mins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isExpanded ? 'Hide Questions' : 'Inspect Questions'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete quiz "${quiz.title}"?`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-400 transition-colors"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Questions Details */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 p-5 border-t border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Included Questions ({quiz.questions.length})
                      </h4>

                      <div className="space-y-3">
                        {quiz.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">
                                Question {idx + 1} ({q.marks} {q.marks === 1 ? 'mark' : 'marks'})
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
                                Correct Answer: Option {q.correctAnswer}
                              </span>
                            </div>

                            <p className="text-slate-900 font-medium">{q.question}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600">
                              {q.options.map((opt) => (
                                <div
                                  key={opt.key}
                                  className={`p-1.5 rounded border ${
                                    opt.key === q.correctAnswer
                                      ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                      : 'bg-slate-50 border-slate-100'
                                  }`}
                                >
                                  {opt.key}: {opt.text}
                                </div>
                              ))}
                            </div>

                            {q.explanation && (
                              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeTab === 'question-bank' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 text-xs">
            <span className="font-bold text-slate-700">
              Institutional Item Bank ({filteredQuestions.length} items)
            </span>
            <span className="text-slate-400">Auto-graded across all published quizzes</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredQuestions.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50/60 transition-colors space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {item.courseCode}
                    </span>
                    <span className="text-slate-500 font-medium">{item.quizTitle}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Answer: {item.question.correctAnswer} ({item.question.marks} marks)
                  </span>
                </div>

                <p className="font-bold text-slate-900">{item.question.question}</p>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  {item.question.options.map((opt) => (
                    <span
                      key={opt.key}
                      className={`px-2 py-0.5 rounded border ${
                        opt.key === item.question.correctAnswer
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {opt.key}: {opt.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

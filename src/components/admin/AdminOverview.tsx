import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  UserCheck,
  BookOpen,
  FolderOpen,
  Award,
  HelpCircle,
  UserPlus,
  Upload,
  FilePlus,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigate: (section: string) => void;
  onOpenAddStudent: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigate,
  onOpenAddStudent,
}) => {
  const { students, courses, resources, quizzes, quizResults } = useData();

  // Summary Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const totalCourses = courses.length;
  const totalResources = resources.length;
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentResults = [...quizResults]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
            Platform Overview & Institutional Metrics
          </h1>
          <p className="mt-1 text-slate-300 text-sm max-w-xl leading-relaxed">
            Monitor student engagement, manage enrolled curricula, deploy learning materials, and ingest quiz question banks.
          </p>
        </div>

        {/* Quick-Action Buttons (Section 8) */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="admin-btn-add-student"
            onClick={onOpenAddStudent}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
          <button
            id="admin-btn-upload-questions"
            onClick={() => onNavigate('upload-questions')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Questions</span>
          </button>
          <button
            id="admin-btn-upload-resources"
            onClick={() => onNavigate('resources')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            <span>Upload Resources</span>
          </button>
          <button
            id="admin-btn-manage-courses"
            onClick={() => onNavigate('courses')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Courses</span>
          </button>
        </div>
      </div>

      {/* Summary Cards (Section 8) */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Platform Summary Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Students */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Students</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
          </div>

          {/* Card 2: Active Students */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Active Students</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeStudents}</p>
          </div>

          {/* Card 3: Total Courses */}
          <div
            onClick={() => onNavigate('courses')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Courses</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCourses}</p>
          </div>

          {/* Card 4: Total Resources */}
          <div
            onClick={() => onNavigate('resources')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Resources</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalResources}</p>
          </div>

          {/* Card 5: Total Quizzes */}
          <div
            onClick={() => onNavigate('quizzes')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Quizzes</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalQuizzes}</p>
          </div>

          {/* Card 6: Total Questions */}
          <div
            onClick={() => onNavigate('question-bank')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Questions</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Registered Students & Recent Quiz Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Students</h3>
              <p className="text-xs text-slate-500">Recently provisioned student credentials</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All ({students.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                    <span className="text-[11px] font-mono text-slate-500">@{s.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {s.assignedCourses.length} courses
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {s.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessment Attempts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Quiz Attempts</h3>
              <p className="text-xs text-slate-500">Live submission grading feed</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {quizResults.length} Submissions
            </span>
          </div>

          {recentResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No quiz attempts logged yet. As students take quizzes, their scores will stream here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentResults.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{r.studentName}</h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{r.quizTitle}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-bold ${
                        r.passed ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {r.percentage}% ({r.score}/{r.totalMarks})
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

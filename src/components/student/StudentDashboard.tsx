import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  FileText,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface StudentDashboardProps {
  onSelectAction: (action: 'resources' | 'quizzes' | 'results') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSelectAction }) => {
  const { currentStudent } = useAuth();
  const { courses, resources, quizzes, quizResults } = useData();

  if (!currentStudent) return null;

  // Filter courses assigned to this student
  const studentCourses = courses.filter((c) =>
    currentStudent.assignedCourses?.includes(c.id)
  );

  // Available resources for student's courses
  const studentResources = resources.filter((r) =>
    currentStudent.assignedCourses?.includes(r.courseId)
  );

  // Available quizzes for student's courses
  const studentQuizzes = quizzes.filter((q) =>
    currentStudent.assignedCourses?.includes(q.courseId)
  );

  // Student's completed results
  const myResults = quizResults.filter((r) => r.studentId === currentStudent.id);
  const totalCompleted = myResults.length;
  const averageScore =
    totalCompleted > 0
      ? Math.round(
          myResults.reduce((acc, curr) => acc + curr.percentage, 0) / totalCompleted
        )
      : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Semester Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
            Welcome back, {currentStudent.name}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Access your course learning materials, review interactive study guides, and test your comprehension through topic-based quizzes.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-200">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <Layers className="w-4 h-4 text-indigo-400" />
              {studentCourses.length} Enrolled Courses
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <FileText className="w-4 h-4 text-emerald-400" />
              {studentResources.length} Study Resources
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              {studentQuizzes.length} Topic Quizzes
            </span>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Two Prominent Cards as requested in section 2 */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Choose Your Learning Path</h2>
          <p className="text-xs text-slate-500">Select an area below to continue your studies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Student Resources */}
          <div
            id="card-student-resources"
            onClick={() => onSelectAction('resources')}
            className="group relative bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Student Resources
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                  {studentResources.length} files
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                Browse course materials organized by subject and topic. Access lecture PDFs, presentation slide decks, video walkthroughs, and curated notes.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{studentCourses.length}</span> courses available
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>Access Resources</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Student Quizzes */}
          <div
            id="card-student-quizzes"
            onClick={() => onSelectAction('quizzes')}
            className="group relative bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Award className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Quizzes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                  {studentQuizzes.length} available
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                Challenge your knowledge with topic-based quizzes. Get instant automated scoring, complete answers review, and comprehensive explanations.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{totalCompleted}</span> quizzes completed
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Start Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview stats & Quick enrolled courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Enrolled Courses</h3>
              <p className="text-xs text-slate-500">Curriculum assigned by institutional administrator</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {studentCourses.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {studentCourses.map((c) => {
              const courseResourcesCount = resources.filter((r) => r.courseId === c.id).length;
              const courseQuizzesCount = quizzes.filter((q) => q.courseId === c.id).length;

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-indigo-700 border border-slate-200">
                        {c.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Instructor: {c.instructor} • {c.topics.length} Topics</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectAction('resources')}
                      className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{courseResourcesCount} Resources</span>
                    </button>
                    <button
                      onClick={() => onSelectAction('quizzes')}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{courseQuizzesCount} Quizzes</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Performance Snapshot */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Academic Standing</h3>
            <p className="text-xs text-slate-500 mb-4">Real-time assessment metrics</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-indigo-700">Average Quiz Score</span>
                  <p className="text-2xl font-bold text-indigo-950 mt-0.5">
                    {totalCompleted > 0 ? `${averageScore}%` : 'No data yet'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-emerald-700">Completed Assessments</span>
                  <p className="text-2xl font-bold text-emerald-950 mt-0.5">
                    {totalCompleted} <span className="text-xs text-slate-500 font-normal">quizzes</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onSelectAction('results')}
              className="w-full py-2 px-3 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              View Full History in My Results →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

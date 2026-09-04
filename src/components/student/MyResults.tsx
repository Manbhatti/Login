import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  FileCheck,
  ChevronDown,
} from 'lucide-react';

interface MyResultsProps {
  onBackToDashboard: () => void;
  onGoToQuizzes: () => void;
}

export const MyResults: React.FC<MyResultsProps> = ({
  onBackToDashboard,
  onGoToQuizzes,
}) => {
  const { currentStudent } = useAuth();
  const { quizResults } = useData();

  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);

  if (!currentStudent) return null;

  const myResults = quizResults
    .filter((r) => r.studentId === currentStudent.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const totalTaken = myResults.length;
  const passedCount = myResults.filter((r) => r.passed).length;
  const averagePercentage =
    totalTaken > 0
      ? Math.round(
          myResults.reduce((acc, curr) => acc + curr.percentage, 0) / totalTaken
        )
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
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
            <span className="font-semibold text-slate-800">My Results</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Quiz History & Performance Records
          </h1>
          <p className="text-sm text-slate-500">
            Review all previous quiz submissions, grades, and passing achievements.
          </p>
        </div>

        <button
          onClick={onGoToQuizzes}
          className="self-start sm:self-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Take a Quiz
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Assessments Taken</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalTaken}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Pass Rate</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalTaken > 0 ? `${Math.round((passedCount / totalTaken) * 100)}%` : '0%'}
            </p>
            <span className="text-[11px] text-slate-400">
              {passedCount} of {totalTaken} passed
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Average Score</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{averagePercentage}%</p>
            <span className="text-[11px] text-slate-400">Across all completed attempts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Submission Log</h2>
            <p className="text-xs text-slate-500">Recorded chronologically with verification timestamps</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {myResults.length} Submissions
          </span>
        </div>

        {myResults.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No quiz attempts yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once you complete any topic quiz from the Quizzes section, your marks and answer breakdown will appear here.
            </p>
            <button
              onClick={onGoToQuizzes}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Browse Quizzes Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myResults.map((result) => {
              const isExpanded = expandedResultId === result.id;
              const formattedDate = new Date(result.submittedAt).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
              );

              return (
                <div key={result.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          {result.courseName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">• {result.topicTitle}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{result.quizTitle}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        <span>
                          Points: {result.score} / {result.totalMarks}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            result.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {result.passed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Needs Review
                            </>
                          )}
                        </span>
                        <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                          {result.percentage}%
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedResultId(isExpanded ? null : result.id)
                        }
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Toggle breakdown"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Answer Choices */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Recorded Responses ({Object.keys(result.answers || {}).length} questions answered):
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(result.answers || {}).map(([qId, ansKey], index) => (
                          <div
                            key={qId}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                          >
                            <span className="text-slate-500 font-medium">Q{index + 1}:</span>
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              Option {ansKey}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

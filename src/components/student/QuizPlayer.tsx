import React, { useState, useMemo } from 'react';
import { Quiz, QuizAttemptResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ListOrdered,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  courseTitle: string;
  topicTitle: string;
  onExit: () => void;
  onViewAllResults: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  courseTitle,
  topicTitle,
  onExit,
  onViewAllResults,
}) => {
  const { currentStudent } = useAuth();
  const { submitQuizAttempt } = useData();

  // State: selected answers { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'stepper' | 'all'>('stepper');
  const [submissionResult, setSubmissionResult] = useState<QuizAttemptResult | null>(null);

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Track how many answered
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (questionId: string, key: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: key,
    }));
  };

  const handleSubmit = () => {
    if (!currentStudent) return;

    // Calculate score
    let totalScore = 0;
    let maxMarks = 0;

    questions.forEach((q) => {
      maxMarks += q.marks;
      if (selectedAnswers[q.id] === q.correctAnswer) {
        totalScore += q.marks;
      }
    });

    const percentage = maxMarks > 0 ? Math.round((totalScore / maxMarks) * 100) : 0;
    const passed = percentage >= quiz.passPercentage;

    const result = submitQuizAttempt({
      studentId: currentStudent.id,
      studentUsername: currentStudent.username,
      studentName: currentStudent.name,
      quizId: quiz.id,
      quizTitle: quiz.title,
      courseId: quiz.courseId,
      courseName: courseTitle,
      topicTitle,
      score: totalScore,
      totalMarks: maxMarks,
      percentage,
      passed,
      answers: selectedAnswers,
    });

    setSubmissionResult(result);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setSubmissionResult(null);
  };

  // ---------------- RESULT VIEW ----------------
  if (isSubmitted && submissionResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-sm text-center ${
            submissionResult.passed
              ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
              : 'bg-gradient-to-b from-rose-50 to-white border-rose-200'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
              submissionResult.passed
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-rose-600 text-white shadow-md shadow-rose-200'
            }`}
          >
            {submissionResult.passed ? (
              <Award className="w-9 h-9" />
            ) : (
              <XCircle className="w-9 h-9" />
            )}
          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              submissionResult.passed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {submissionResult.passed ? 'Assessment Passed' : 'Needs Review'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            You scored {submissionResult.score} out of {submissionResult.totalMarks} points
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {submissionResult.percentage}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Passing requirement: {quiz.passPercentage}%
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Back to Topic Quizzes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewAllResults}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>View All Past Results</span>
            </button>
          </div>
        </div>

        {/* Question Review Breakdown with Explanations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Detailed Answer Review</h3>
            <p className="text-xs text-slate-500">
              Inspect your chosen answer against the answer key and understand the reasoning.
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const studentAnswer = selectedAnswers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct (+{q.marks})
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect (0/{q.marks})
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 mb-3">{q.question}</p>

                  {/* Options List */}
                  <div className="space-y-2 mb-3">
                    {q.options.map((opt) => {
                      const isOptionStudentChosen = studentAnswer === opt.key;
                      const isOptionCorrect = q.correctAnswer === opt.key;

                      let optStyle = 'bg-white border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        optStyle = 'bg-emerald-100/70 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (isOptionStudentChosen && !isCorrect) {
                        optStyle = 'bg-rose-100/70 border-rose-300 text-rose-900 font-semibold';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-white/80 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center">
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isOptionCorrect && (
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isOptionStudentChosen && !isCorrect && (
                            <span className="text-xs text-rose-700 font-bold">Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE QUIZ PLAYER ----------------
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{courseTitle}</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">{topicTitle}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode((m) => (m === 'stepper' ? 'all' : 'stepper'))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
            <span>{viewMode === 'stepper' ? 'View All Questions' : 'One at a Time'}</span>
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar & Quick Stepper Pills */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-indigo-600">
            {answeredCount} of {totalQuestions} Answered ({Math.round((answeredCount / totalQuestions) * 100)}%)
          </span>
        </div>

        {/* Progress Fill */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Stepper question jump pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setViewMode('stepper');
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold'
                    : isAnswered
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card: STEPPER VIEW */}
      {viewMode === 'stepper' && currentQuestion && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider">
              {currentQuestion.questionType === 'true_false' ? 'True / False Question' : 'Multiple Choice Question'}
            </span>
            <span className="font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
              {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 text-indigo-950 font-semibold shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Quiz Answers</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Card: FULL LIST VIEW */}
      {viewMode === 'all' && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-700">Question {idx + 1}</span>
                <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{q.question}</h3>

              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 text-indigo-950 font-semibold'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-xs sm:text-sm">{opt.text}</span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs text-slate-600">
              {answeredCount} of {totalQuestions} answered
            </span>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit All Answers</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

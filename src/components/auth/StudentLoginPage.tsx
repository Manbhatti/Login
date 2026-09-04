import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface StudentLoginPageProps {
  onSwitchToAdmin: () => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ onSwitchToAdmin }) => {
  const { loginAsStudent } = useAuth();
  const { students } = useData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Derive email suggestion or matching student email
  const matchedStudent = students.find(
    (s) =>
      s.username.toLowerCase() === username.trim().toLowerCase() ||
      s.email.toLowerCase() === username.trim().toLowerCase()
  );

  const initialRecoveryEmail = matchedStudent
    ? matchedStudent.email
    : username.includes('@')
    ? username.trim()
    : '';

  const studentEmailSuggestions = students.map((s) => ({
    label: `${s.name.split(' ')[0]} (${s.email.split('@')[0]})`,
    email: s.email,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both your assigned username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginAsStudent(username, password, students);
      if (!result.success) {
        setError(result.message || 'Login failed. Please verify your credentials.');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleQuickLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background subtle design */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Platform/College Logo Area */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 font-serif">
            APEX ACADEMY
          </h1>
          <p className="text-sm text-slate-500 font-medium">Educational Learning & Assessment Hub</p>
        </div>

        {/* Welcome Message */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            Welcome to Your Learning Portal
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in with your assigned student credentials to access course resources and topic quizzes.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="student-username"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Assigned Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex.student"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="student-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="student-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              id="student-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Login to Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Prompt Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Note:</strong> Username and password can be requested by email from the administrator.
            </p>
          </div>

          {/* Quick Demo Test Accounts for rapid testing */}
          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Quick Test Credentials:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.student', 'student123')}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs text-slate-700 hover:text-indigo-700 transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>Alex (CS, Bio, Math)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.m', 'student123')}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs text-slate-700 hover:text-indigo-700 transition-colors font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>Sarah (CS, Math)</span>
              </button>
            </div>
          </div>

          {/* Switch to Admin Area */}
          <div className="mt-5 text-center">
            <button
              id="switch-to-admin-btn"
              type="button"
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Are you an administrator? Sign in here</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        portalType="student"
        initialEmail={initialRecoveryEmail}
        defaultUsername={username}
        suggestedEmails={studentEmailSuggestions}
      />
    </div>
  );
};

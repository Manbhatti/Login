import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AdminLoginPageProps {
  onSwitchToStudent: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSwitchToStudent }) => {
  const { loginAsAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide administrative username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginAsAdmin(username, password);
      if (!result.success) {
        setError(result.message || 'Invalid administrator credentials.');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleQuickAdminLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white font-serif">
            APEX ACADEMY
          </h1>
          <p className="text-sm text-slate-400 font-medium">Administrator Control Center</p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-white">
            Administrative Portal Sign In
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Secure management console for students, courses, quizzes, and learning materials.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 py-8 px-6 shadow-xl border border-slate-700/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-700/50 flex items-start gap-3 text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Admin Password
                </label>
                <button
                  type="button"
                  id="admin-forgot-password-link"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Admin Login */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Admin Access</span>
              </div>
              <p className="text-[11px] text-slate-400">Username: admin / Password: admin123</p>
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-medium transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <button
              id="return-to-student-btn"
              type="button"
              onClick={onSwitchToStudent}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Student Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal for Admin */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        portalType="admin"
        initialEmail={username.includes('@') ? username.trim() : 'admin@apexacademy.edu'}
        defaultUsername={username}
        suggestedEmails={[
          { label: 'Admin (admin@apexacademy.edu)', email: 'admin@apexacademy.edu' },
        ]}
      />
    </div>
  );
};

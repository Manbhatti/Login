import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, X, ArrowLeft, Send, KeyRound, Shield, GraduationCap } from 'lucide-react';
import { sendAccountPasswordResetEmail } from '../../services/firebase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalType: 'student' | 'admin';
  initialEmail?: string;
  defaultUsername?: string;
  suggestedEmails?: { label: string; email: string }[];
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  portalType,
  initialEmail = '',
  defaultUsername = '',
  suggestedEmails = [],
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sentToEmail, setSentToEmail] = useState('');

  // Update email if initialEmail or defaultUsername changes
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setFeedbackMessage('');
      if (initialEmail) {
        setEmail(initialEmail);
      } else if (defaultUsername) {
        // If the username looks like an email, use it
        if (defaultUsername.includes('@')) {
          setEmail(defaultUsername);
        } else if (portalType === 'admin') {
          setEmail('admin@apexacademy.edu');
        } else if (suggestedEmails.length > 0) {
          setEmail(suggestedEmails[0].email);
        }
      } else if (portalType === 'admin') {
        setEmail('admin@apexacademy.edu');
      }
    }
  }, [isOpen, initialEmail, defaultUsername, portalType, suggestedEmails]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setFeedbackMessage('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setFeedbackMessage('');

    try {
      const result = await sendAccountPasswordResetEmail(email.trim());
      if (result.success) {
        setStatus('success');
        setSentToEmail(email.trim());
        setFeedbackMessage(result.message);
      } else {
        setStatus('error');
        setFeedbackMessage(result.message);
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMessage(err?.message || 'An unexpected error occurred while contacting Firebase Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnother = () => {
    setStatus('idle');
    setFeedbackMessage('');
  };

  const isStudent = portalType === 'student';

  return (
    <div
      id="forgot-password-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        id="forgot-password-modal-card"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Header decoration bar */}
        <div className={`h-1.5 w-full ${isStudent ? 'bg-indigo-600' : 'bg-amber-500'}`} />

        {/* Close Button */}
        <button
          type="button"
          id="close-forgot-password-modal"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header icon and title */}
          <div className="flex items-start gap-3.5 mb-5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isStudent ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {isStudent ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 id="forgot-password-title" className="text-lg font-bold text-slate-900">
                {isStudent ? 'Reset Student Password' : 'Reset Administrator Password'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Firebase Authentication Account Recovery
              </p>
            </div>
          </div>

          {status === 'success' ? (
            /* Success State */
            <div id="forgot-password-success-view" className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900">
                      Recovery Email Dispatched!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      We've requested Firebase Auth to send a password reset link to:
                    </p>
                    <p className="text-xs font-mono font-semibold text-emerald-900 mt-1 break-all bg-emerald-100/70 px-2 py-1 rounded">
                      {sentToEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-700">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Check your inbox and spam folders for the reset email.</li>
                  <li>Click the secure recovery link provided in the message.</li>
                  <li>Create a new password and log back into your portal.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  id="reset-another-email-btn"
                  onClick={handleResetAnother}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                >
                  Send to Another Email
                </button>
                <button
                  type="button"
                  id="back-to-login-btn"
                  onClick={onClose}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer text-center ${
                    isStudent
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500'
                  }`}
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered account email below. Firebase Auth will dispatch a secure link allowing you to specify a new password.
              </p>

              {status === 'error' && feedbackMessage && (
                <div
                  id="forgot-password-error-banner"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs leading-relaxed"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="reset-email-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Account Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reset-email-input"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@student.apexacademy.edu"
                    disabled={isLoading}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Quick suggestion pills if available */}
              {suggestedEmails.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                    Quick test account emails:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedEmails.map((item) => (
                      <button
                        key={item.email}
                        type="button"
                        onClick={() => setEmail(item.email)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                          email === item.email
                            ? isStudent
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  id="cancel-reset-password-btn"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="send-reset-email-btn"
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-60 ${
                    isStudent
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Recovery Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

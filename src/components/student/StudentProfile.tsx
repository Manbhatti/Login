import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface StudentProfileProps {
  onBackToDashboard: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ onBackToDashboard }) => {
  const { currentStudent, updateCurrentStudent } = useAuth();
  const { courses, updateStudent } = useData();

  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentStudent) return null;

  const assignedCourseList = courses.filter((c) =>
    currentStudent.assignedCourses?.includes(c.id)
  );

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (currentPassInput !== currentStudent.password) {
      setMessage({ type: 'error', text: 'Current password does not match records.' });
      return;
    }

    if (newPassInput.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    updateCurrentStudent({ password: newPassInput });
    updateStudent(currentStudent.id, { password: newPassInput });

    setMessage({ type: 'success', text: 'Password successfully updated!' });
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            <span className="font-semibold text-slate-800">Student Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Account Details & Preferences
          </h1>
          <p className="text-sm text-slate-500">
            View your institutional identification and course enrollments.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center">
            {currentStudent.avatar ? (
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-xs mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl mb-3">
                {currentStudent.name.charAt(0)}
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900">{currentStudent.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">@{currentStudent.username}</p>

            <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Active Enrolled Student
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Institutional Email</span>
              <span className="font-semibold text-slate-800">{currentStudent.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Account Created</span>
              <span className="font-semibold text-slate-800">
                {new Date(currentStudent.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Assigned Courses</span>
              <span className="font-semibold text-slate-800">
                {assignedCourseList.length} Courses Authorized
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Password & Assigned Courses */}
        <div className="md:col-span-2 space-y-6">
          {/* Assigned Courses list */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Authorized Course Enrolments
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your curriculum access is assigned and managed by institution administrators.
            </p>

            <div className="space-y-3">
              {assignedCourseList.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-white text-indigo-700 border border-slate-200">
                      {c.code}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-500">Instructor: {c.instructor}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Security Credentials</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Update your password to keep your student account secure.
            </p>

            {message && (
              <div
                className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

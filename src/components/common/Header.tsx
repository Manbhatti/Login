import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogOut, Shield, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { role, currentStudent, adminUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Branding */}
          <div
            id="portal-brand-header"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight font-serif">
                  APEX ACADEMY
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Educational Learning & Assessment Hub</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {role === 'student' && currentStudent && (
              <div className="flex items-center gap-3">
                <button
                  id="header-profile-btn"
                  onClick={() => onNavigate && onNavigate('profile')}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'profile'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {currentStudent.avatar ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {currentStudent.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline font-semibold">{currentStudent.name}</span>
                </button>
              </div>
            )}

            {role === 'admin' && adminUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Signed in as Administrator</span>
              </div>
            )}

            <button
              id="header-logout-btn"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

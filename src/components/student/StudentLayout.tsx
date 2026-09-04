import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { StudentResources } from './StudentResources';
import { StudentQuizzes } from './StudentQuizzes';
import { MyResults } from './MyResults';
import { StudentProfile } from './StudentProfile';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  FileCheck,
  User,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { currentStudent, logout } = useAuth();

  // Navigation: 'dashboard' | 'resources' | 'quizzes' | 'results' | 'profile'
  const [currentView, setCurrentView] = useState<'dashboard' | 'resources' | 'quizzes' | 'results' | 'profile'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
    { id: 'results', label: 'My Results', icon: FileCheck },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const handleNav = (viewId: typeof currentView) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Student Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 font-serif block leading-tight">
                  Apex Academy
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Student Learning Portal
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Section 9) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`student-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User profile avatar & Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('profile')}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              {currentStudent?.avatar ? (
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  {currentStudent?.name.charAt(0)}
                </div>
              )}
              <div className="hidden lg:block text-xs">
                <span className="font-bold text-slate-900 block leading-tight">
                  {currentStudent?.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  @{currentStudent?.username}
                </span>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' && (
          <StudentDashboard
            onSelectAction={(act) => {
              if (act === 'resources') setCurrentView('resources');
              if (act === 'quizzes') setCurrentView('quizzes');
              if (act === 'results') setCurrentView('results');
            }}
          />
        )}

        {currentView === 'resources' && (
          <StudentResources
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'quizzes' && (
          <StudentQuizzes
            onBackToDashboard={() => setCurrentView('dashboard')}
            onViewAllResults={() => setCurrentView('results')}
          />
        )}

        {currentView === 'results' && (
          <MyResults
            onBackToDashboard={() => setCurrentView('dashboard')}
            onGoToQuizzes={() => setCurrentView('quizzes')}
          />
        )}

        {currentView === 'profile' && (
          <StudentProfile
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

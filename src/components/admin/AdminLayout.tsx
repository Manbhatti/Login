import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminOverview } from './AdminOverview';
import { StudentManagement } from './StudentManagement';
import { CourseManagement } from './CourseManagement';
import { ResourceManagement } from './ResourceManagement';
import { QuizManagement } from './QuizManagement';
import { BulkQuizUpload } from './BulkQuizUpload';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  Award,
  HelpCircle,
  Upload,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminUser: currentAdmin, logout } = useAuth();

  // Navigation tabs: 'dashboard' | 'students' | 'courses' | 'resources' | 'quizzes' | 'question-bank' | 'upload-questions' | 'settings'
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddStudentModalTriggered, setIsAddStudentModalTriggered] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses / Subjects', icon: BookOpen },
    { id: 'resources', label: 'Learning Resources', icon: FolderOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
    { id: 'question-bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'upload-questions', label: 'Upload Questions', icon: Upload, badge: 'Bulk' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header on Mobile & Desktop */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 font-serif block leading-tight">
                Apex Academy
              </span>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                Admin Management Portal
              </span>
            </div>
          </div>
        </div>

        {/* Admin info & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900">{currentAdmin?.name || 'Administrator'}</span>
            <span className="text-[10px] text-slate-500 font-mono">System Admin</span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION (Desktop + Mobile Drawer) */}
        {/* Backdrop on mobile */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Administration
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Admin User Summary */}
          <div className="p-4 border-t border-slate-200">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {currentAdmin?.name.charAt(0) || 'A'}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[100px]">
                    {currentAdmin?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[100px]">
                    {currentAdmin?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentSection === 'dashboard' && (
            <AdminOverview
              onNavigate={setCurrentSection}
              onOpenAddStudent={() => {
                setCurrentSection('students');
                setIsAddStudentModalTriggered(true);
              }}
            />
          )}

          {currentSection === 'students' && (
            <StudentManagement
              isAddModalOpenInitially={isAddStudentModalTriggered}
              onCloseAddModal={() => setIsAddStudentModalTriggered(false)}
            />
          )}

          {currentSection === 'courses' && <CourseManagement />}

          {currentSection === 'resources' && <ResourceManagement />}

          {currentSection === 'quizzes' && (
            <QuizManagement
              initialTab="quizzes"
              onNavigateToUpload={() => setCurrentSection('upload-questions')}
            />
          )}

          {currentSection === 'question-bank' && (
            <QuizManagement
              initialTab="question-bank"
              onNavigateToUpload={() => setCurrentSection('upload-questions')}
            />
          )}

          {currentSection === 'upload-questions' && (
            <BulkQuizUpload onImportComplete={() => setCurrentSection('quizzes')} />
          )}

          {currentSection === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

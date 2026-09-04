import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Settings,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Mail,
  School,
  Database,
  Info,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { resetToDefaultSeed } = useData();

  const [platformName, setPlatformName] = useState('Apex Academy Online Learning Portal');
  const [adminEmail, setAdminEmail] = useState('admin@apexacademy.edu');
  const [supportPhone, setSupportPhone] = useState('+1 (555) 019-2834');
  const [academicYear, setAcademicYear] = useState('2025 - 2026 Academic Year');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all students, courses, resources, and quizzes back to the default sample dataset?'
      )
    ) {
      resetToDefaultSeed();
      alert('Data reset to default institutional seed successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Platform Settings</h1>
        <p className="text-sm text-slate-500">
          Configure administrative support contact, academic year settings, and data retention.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully saved!</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
          <School className="w-5 h-5 text-indigo-600" />
          <span>Institutional Information</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Portal / College Display Name
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Administrator Support Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Shown to students when requesting account credentials.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Seed Reset Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-amber-600" />
          <span>Demo Data Management</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reset all mock students, courses, topics, learning resources, and quiz assessments back to their clean initial state. Useful for presentations or clearing testing records.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Initial Demonstration Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

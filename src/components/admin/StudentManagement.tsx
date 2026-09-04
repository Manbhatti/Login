import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StudentAccount } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  Shield,
  Sparkles,
  BookOpen,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface StudentManagementProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const {
    students,
    courses,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    resetStudentPassword,
  } = useData();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(isAddModalOpenInitially);
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);
  const [passwordResetStudent, setPasswordResetStudent] = useState<StudentAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<StudentAccount | null>(null);

  // Form state for creating / editing student
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    assignedCourses: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      // Course filter
      if (courseFilter !== 'all' && !s.assignedCourses.includes(courseFilter)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(query);
        const matchUser = s.username.toLowerCase().includes(query);
        const matchEmail = s.email.toLowerCase().includes(query);
        return matchName || matchUser || matchEmail;
      }

      return true;
    });
  }, [students, statusFilter, courseFilter, searchQuery]);

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: 'student' + Math.floor(100 + Math.random() * 900),
      assignedCourses: courses.map((c) => c.id), // default to all
      status: 'active',
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (student: StudentAccount) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      username: student.username,
      email: student.email,
      password: student.password,
      assignedCourses: [...student.assignedCourses],
      status: student.status,
    });
  };

  // Auto-generate username helper based on full name
  const handleGenerateUsername = () => {
    if (!formData.name.trim()) return;
    const parts = formData.name.trim().toLowerCase().split(/\s+/);
    let base = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1][0]}` : parts[0];
    base = base.replace(/[^a-z0-9.]/g, '');
    const randomNum = Math.floor(10 + Math.random() * 89);
    setFormData((prev) => ({
      ...prev,
      username: `${base}${randomNum}`,
      email: prev.email || `${base}${randomNum}@student.apexacademy.edu`,
    }));
  };

  const handleToggleCourseAssignment = (courseId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedCourses.includes(courseId);
      const next = exists
        ? prev.assignedCourses.filter((id) => id !== courseId)
        : [...prev.assignedCourses, courseId];
      return { ...prev, assignedCourses: next };
    });
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim(),
        password: formData.password,
        assignedCourses: formData.assignedCourses,
        status: formData.status,
      });
      setEditingStudent(null);
    } else {
      addStudent({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim() || `${formData.username}@student.apexacademy.edu`,
        password: formData.password,
        assignedCourses: formData.assignedCourses,
        status: formData.status,
      });
      setIsAddModalOpen(false);
      if (onCloseAddModal) onCloseAddModal();
    }
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordResetStudent && newPasswordInput.trim()) {
      resetStudentPassword(passwordResetStudent.id, newPasswordInput.trim());
      setPasswordResetStudent(null);
      setNewPasswordInput('');
    }
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirmStudent) {
      deleteStudent(deleteConfirmStudent.id);
      setDeleteConfirmStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Student Management & Access Control
          </h1>
          <p className="text-sm text-slate-500">
            Provision student credentials, assign authorized course curricula, and manage activation states.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create Student Account</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['all', 'active', 'inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Course filter dropdown */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Enrolled Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registered Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Registered Students ({filteredStudents.length})
          </span>
          <span className="text-xs text-slate-400">
            Students only have access using assigned usernames & passwords
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Courses</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No student records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const enrolledCourseObjects = courses.filter((c) =>
                    s.assignedCourses.includes(c.id)
                  );

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[11px] text-slate-400">{s.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        @{s.username}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleStudentStatus(s.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle active / inactive status"
                        >
                          {s.status === 'active' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {enrolledCourseObjects.map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                            >
                              {c.code}
                            </span>
                          ))}
                          {enrolledCourseObjects.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">No courses</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setPasswordResetStudent(s);
                              setNewPasswordInput('student' + Math.floor(100 + Math.random() * 900));
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-slate-600 transition-colors"
                            title="Reset Student Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details & Courses */}
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 transition-colors"
                            title="Edit Student Details & Courses"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => setDeleteConfirmStudent(s)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT STUDENT MODAL */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStudent ? 'Edit Student Account' : 'Provision New Student Account'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Username + Auto-Generate helper */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Assigned Username
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateUsername}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-generate from name</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. jordan.m"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan.m@student.apexacademy.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="student123"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Assign this credential to the student. They will use this to sign in.
                </span>
              </div>

              {/* Status indicator toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="text-indigo-600"
                    />
                    <span className="font-semibold text-emerald-700">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({ ...formData, status: 'inactive' })}
                      className="text-indigo-600"
                    />
                    <span className="font-semibold text-rose-700">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Control Course Access */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Course Access
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Student will only have access to resources and quizzes within selected courses.
                </p>
                <div className="space-y-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {courses.map((c) => {
                    const isAssigned = formData.assignedCourses.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => handleToggleCourseAssignment(c.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-bold text-slate-800">{c.code}</span>
                          <span className="text-slate-600 truncate max-w-xs">{c.title}</span>
                        </div>
                        {isAssigned && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {passwordResetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-amber-600 mb-2">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Reset Student Password</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Set a new password for <strong className="text-slate-900">@{passwordResetStudent.username}</strong> ({passwordResetStudent.name}).
            </p>

            <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordResetStudent(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Delete Student Account?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deleteConfirmStudent.name}</strong> (@{deleteConfirmStudent.username})? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

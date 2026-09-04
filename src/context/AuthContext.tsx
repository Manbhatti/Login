import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentAccount, UserRole } from '../types';
import { sendAccountPasswordResetEmail, PasswordResetResponse } from '../services/firebase';

interface AuthContextType {
  role: UserRole | null;
  currentStudent: StudentAccount | null;
  adminUser: { username: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  loginAsStudent: (username: string, password: string, studentAccounts: StudentAccount[]) => { success: boolean; message?: string };
  loginAsAdmin: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateCurrentStudent: (updated: Partial<StudentAccount>) => void;
  sendPasswordReset: (email: string) => Promise<PasswordResetResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  name: 'Platform Administrator',
  email: 'admin@apexacademy.edu',
};

const STORAGE_KEY_AUTH = 'aura_learning_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentAccount | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string; name: string; email: string } | null>(null);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin') {
          setRole('admin');
          setAdminUser(ADMIN_CREDENTIALS);
        } else if (parsed.role === 'student' && parsed.student) {
          setRole('student');
          setCurrentStudent(parsed.student);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, []);

  const loginAsStudent = (username: string, password: string, studentAccounts: StudentAccount[]) => {
    const trimmedUser = username.trim().toLowerCase();
    const student = studentAccounts.find(
      (s) => s.username.toLowerCase() === trimmedUser
    );

    if (!student) {
      return { success: false, message: 'Invalid username or password. Please verify your credentials or contact the administrator.' };
    }

    if (student.password !== password) {
      return { success: false, message: 'Invalid password. Please check your assigned password.' };
    }

    if (student.status === 'inactive') {
      return {
        success: false,
        message: 'Your student account is currently deactivated. Please email administrator at admin@apexacademy.edu to restore access.',
      };
    }

    const updatedStudent: StudentAccount = {
      ...student,
      lastLogin: new Date().toISOString(),
    };

    setRole('student');
    setCurrentStudent(updatedStudent);
    setAdminUser(null);
    localStorage.setItem(
      STORAGE_KEY_AUTH,
      JSON.stringify({ role: 'student', student: updatedStudent })
    );

    return { success: true };
  };

  const loginAsAdmin = (username: string, password: string) => {
    const trimmedUser = username.trim();
    if (
      trimmedUser === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setRole('admin');
      setAdminUser(ADMIN_CREDENTIALS);
      setCurrentStudent(null);
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({ role: 'admin' })
      );
      return { success: true };
    }
    return { success: false, message: 'Invalid administrator username or password.' };
  };

  const logout = () => {
    setRole(null);
    setCurrentStudent(null);
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateCurrentStudent = (updated: Partial<StudentAccount>) => {
    if (currentStudent) {
      const next = { ...currentStudent, ...updated };
      setCurrentStudent(next);
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({ role: 'student', student: next })
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentStudent,
        adminUser,
        isAuthenticated: !!role,
        loginAsStudent,
        loginAsAdmin,
        logout,
        updateCurrentStudent,
        sendPasswordReset: sendAccountPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

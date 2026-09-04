import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { StudentLayout } from './components/student/StudentLayout';
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'student' | 'admin'>('student');

  if (isAuthenticated) {
    if (role === 'admin') {
      return <AdminLayout />;
    }
    if (role === 'student') {
      return <StudentLayout />;
    }
  }

  // Not authenticated: render login
  if (authView === 'admin') {
    return <AdminLoginPage onSwitchToStudent={() => setAuthView('student')} />;
  }

  return <StudentLoginPage onSwitchToAdmin={() => setAuthView('admin')} />;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

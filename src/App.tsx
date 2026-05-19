/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import AcademicRoadmap from './pages/AcademicRoadmap';
import CareerRoadmap from './pages/CareerRoadmap';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import AIChatAssistant from './pages/AIChatAssistant';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/roadmap/academic" element={<AcademicRoadmap />} />
              <Route path="/roadmap/career" element={<CareerRoadmap />} />
              <Route path="/skills" element={<SkillGapAnalysis />} />
              <Route path="/assistant" element={<AIChatAssistant />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VerificationProvider } from './contexts/VerificationContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { SecurityProvider } from './contexts/SecurityContext';
import LoginPage from './pages/LoginPage';
import OnboardPage from './pages/OnboardPage';
import UploadPage from './pages/UploadPage';
import VerificationPage from './pages/VerificationPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import InsurerDashboardPage from './pages/InsurerDashboardPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import CertificatePage from './pages/CertificatePage';

function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <DocumentProvider>
          <VerificationProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboard" element={<OnboardPage />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } />
              <Route path="/verification" element={
                <ProtectedRoute>
                  <VerificationPage />
                </ProtectedRoute>
              } />
              <Route path="/result" element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/insurer-dashboard" element={
                <ProtectedRoute>
                  <InsurerDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/certificates/:certId" element={<CertificatePage />} />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <DocumentManagementPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </VerificationProvider>
        </DocumentProvider>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;
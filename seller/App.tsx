
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CreateLinkPage from './pages/CreateLinkPage';
import PayPage from './pages/PayPage';
import SuccessPage from './pages/PaymentSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './hooks/useAuth';
import CheckoutPage from './pages/CheckoutPage';
import SettingsPage from './pages/SettingsPage';
import BalancePage from './pages/BalancePage';
import { LocalizationProvider } from './hooks/useLocalization';

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <div className="min-h-screen font-sans">
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/qeydiyyat" element={<RegistrationPage />} />
            <Route path="/pay/:linkId" element={<PayPage />} />
            <Route path="/checkout/:linkId" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <ProtectedRoute>
                  <BalancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-link"
              element={
                <ProtectedRoute>
                  <CreateLinkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={checkAuth() ? "/dashboard" : "/login"} />} />
          </Routes>
        </HashRouter>
      </div>
    </LocalizationProvider>
  );
};

export default App;

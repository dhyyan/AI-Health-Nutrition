import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastNotificationContainer } from './components/common/ToastNotificationContainer';
import { Navbar } from './components/layout/Navbar';
import { AdminLayout } from './components/layout/AdminLayout';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyOtpPage } from './pages/auth/VerifyOtpPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { NutritionPage } from './pages/nutrition/NutritionPage';
import { RecommendationsPage } from './pages/recommendations/RecommendationsPage';
import { MealPlannerPage } from './pages/meals/MealPlannerPage';
import { WaterTrackerPage } from './pages/water/WaterTrackerPage';
import { SmartNotificationsPage } from './pages/notifications/SmartNotificationsPage';
import { HealthReportsPage } from './pages/reports/HealthReportsPage';
import { FoodScannerPage } from './pages/scanner/FoodScannerPage';
import { HealthProfilePageLayout } from './pages/profile/HealthProfilePageLayout';
import { PersonalTab } from './pages/profile/tabs/PersonalTab';
import { BMITab } from './pages/profile/tabs/BMITab';
import { MedicalTab } from './pages/profile/tabs/MedicalTab';
import { LifestyleTab } from './pages/profile/tabs/LifestyleTab';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminMealsPage } from './pages/admin/AdminMealsPage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { HealthEducationPage } from './pages/education/HealthEducationPage';

const MainAppLayout: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ToastNotificationContainer />
          <Routes>
            {/* Admin Login (Standalone) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes with Sidebar & Outlet */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/meals" element={<AdminMealsPage />} />
                <Route path="/admin/education" element={<AdminEducationPage />} />
                <Route path="/admin/dashboard" element={<AdminOverviewPage />} />
              </Route>
            </Route>

            {/* Main Site Routes with Standard Top Navbar */}
            <Route element={<MainAppLayout />}>
              <Route path="/" element={<LandingPage />} />

              {/* Guest Only Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Authenticated User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scan" element={<FoodScannerPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/meals" element={<MealPlannerPage />} />
                <Route path="/education" element={<HealthEducationPage />} />
                <Route path="/water" element={<WaterTrackerPage />} />
                <Route path="/reminders" element={<SmartNotificationsPage />} />
                <Route path="/reports" element={<HealthReportsPage />} />
                <Route path="/profile" element={<HealthProfilePageLayout />}>
                  <Route index element={<Navigate to="/profile/personal" replace />} />
                  <Route path="personal" element={<PersonalTab />} />
                  <Route path="bmi" element={<BMITab />} />
                  <Route path="medical" element={<MedicalTab />} />
                  <Route path="lifestyle" element={<LifestyleTab />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

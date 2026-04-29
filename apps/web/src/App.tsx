import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth pages (eager — needed immediately)
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import OAuthCallbackPage from "@/pages/auth/callback";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("@/pages/dashboard/index"));
const MFAPage = lazy(() => import("@/pages/auth/mfa"));
const UnauthorizedPage = lazy(() => import("@/pages/errors/unauthorized"));
const NotFoundPage = lazy(() => import("@/pages/errors/not-found"));

function PageLoader() {
  return (
    <div
      className="min-h-screen bg-surface flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Chargement…"
    >
      <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public auth routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <ProtectedRoute>
                    <MFAPage />
                  </ProtectedRoute>
                }
              />

              {/* Error pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

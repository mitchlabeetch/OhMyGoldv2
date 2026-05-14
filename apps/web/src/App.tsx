import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout";

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

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminLocations = lazy(() => import("@/pages/admin/locations/index"));
const AdminLocationNew = lazy(() => import("@/pages/admin/locations/new"));
const AdminLocationDetail = lazy(() => import("@/pages/admin/locations/detail"));
const AdminUsers = lazy(() => import("@/pages/admin/users/index"));
const AdminUserDetail = lazy(() => import("@/pages/admin/users/detail"));
const AdminSettings = lazy(() => import("@/pages/admin/settings/index"));
const AdminAuditLog = lazy(() => import("@/pages/admin/audit-log/index"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics/index"));

// Manager pages
const ManagerDashboard = lazy(() => import("@/pages/manager/dashboard"));
const ManagerMembers = lazy(() => import("@/pages/manager/members/index"));
const ManagerMemberDetail = lazy(() => import("@/pages/manager/members/detail"));
const ManagerMemberEnroll = lazy(() => import("@/pages/manager/members/enroll"));
const ManagerClasses = lazy(() => import("@/pages/manager/classes/index"));
const ManagerBilling = lazy(() => import("@/pages/manager/billing/index"));

// Employee pages
const EmployeeCheckIn = lazy(() => import("@/pages/employee/check-in"));
const EmployeeBookings = lazy(() => import("@/pages/employee/bookings"));
const EmployeePOS = lazy(() => import("@/pages/employee/pos"));

// Teacher pages
const TeacherDashboard = lazy(() => import("@/pages/teacher/dashboard"));
const TeacherClasses = lazy(() => import("@/pages/teacher/classes/index"));
const TeacherClassDetail = lazy(() => import("@/pages/teacher/classes/detail"));
const TeacherRoster = lazy(() => import("@/pages/teacher/roster"));

// Client pages
const ClientDashboard = lazy(() => import("@/pages/client/dashboard"));
const ClientBooking = lazy(() => import("@/pages/client/booking/index"));
const ClientMyBookings = lazy(() => import("@/pages/client/booking/my-bookings"));
const ClientSubscription = lazy(() => import("@/pages/client/subscription/index"));
const ClientProfile = lazy(() => import("@/pages/client/profile/index"));
const ClientCard = lazy(() => import("@/pages/client/card/index"));

// Visitor pages (public)
const VisitorHome = lazy(() => import("@/pages/visitor/index"));
const VisitorPricing = lazy(() => import("@/pages/visitor/pricing"));
const VisitorLocations = lazy(() => import("@/pages/visitor/locations"));

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public auth routes — no AppShell */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />

            {/* Protected routes wrapped in AppShell */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/security"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <MFAPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            {[
              { path: "/admin/dashboard", Component: AdminDashboard, roles: ["admin", "super_admin"] as const },
              { path: "/admin/locations", Component: AdminLocations, roles: ["admin", "super_admin"] as const },
              { path: "/admin/locations/new", Component: AdminLocationNew, roles: ["admin", "super_admin"] as const },
              { path: "/admin/locations/:id", Component: AdminLocationDetail, roles: ["admin", "super_admin"] as const },
              { path: "/admin/users", Component: AdminUsers, roles: ["admin", "super_admin"] as const },
              { path: "/admin/users/:id", Component: AdminUserDetail, roles: ["admin", "super_admin"] as const },
              { path: "/admin/settings", Component: AdminSettings, roles: ["admin", "super_admin"] as const },
              { path: "/admin/audit-log", Component: AdminAuditLog, roles: ["admin", "super_admin"] as const },
              { path: "/admin/analytics", Component: AdminAnalytics, roles: ["admin", "super_admin"] as const },
            ].map(({ path, Component, roles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute roles={roles}>
                    <AppShell>
                      <Component />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Manager routes */}
            {[
              { path: "/manager/dashboard", Component: ManagerDashboard, roles: ["admin", "manager"] as const },
              { path: "/manager/members", Component: ManagerMembers, roles: ["admin", "manager"] as const },
              { path: "/manager/members/enroll", Component: ManagerMemberEnroll, roles: ["admin", "manager"] as const },
              { path: "/manager/members/:id", Component: ManagerMemberDetail, roles: ["admin", "manager"] as const },
              { path: "/manager/classes", Component: ManagerClasses, roles: ["admin", "manager"] as const },
              { path: "/manager/billing", Component: ManagerBilling, roles: ["admin", "manager"] as const },
            ].map(({ path, Component, roles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute roles={roles}>
                    <AppShell>
                      <Component />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Employee routes */}
            {[
              { path: "/employee/check-in", Component: EmployeeCheckIn },
              { path: "/employee/bookings", Component: EmployeeBookings },
              { path: "/employee/pos", Component: EmployeePOS },
            ].map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute roles={["admin", "manager", "employee"]}>
                    <AppShell>
                      <Component />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Teacher routes */}
            {[
              { path: "/teacher/dashboard", Component: TeacherDashboard },
              { path: "/teacher/classes", Component: TeacherClasses },
              { path: "/teacher/classes/:id", Component: TeacherClassDetail },
              { path: "/teacher/roster", Component: TeacherRoster },
            ].map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute roles={["admin", "manager", "teacher"]}>
                    <AppShell>
                      <Component />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Client routes */}
            {[
              { path: "/client/dashboard", Component: ClientDashboard },
              { path: "/client/booking", Component: ClientBooking },
              { path: "/client/booking/my-bookings", Component: ClientMyBookings },
              { path: "/client/subscription", Component: ClientSubscription },
              { path: "/client/profile", Component: ClientProfile },
              { path: "/client/card", Component: ClientCard },
            ].map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute roles={["admin", "manager", "employee", "teacher", "client"]}>
                    <AppShell>
                      <Component />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Public visitor routes */}
            <Route path="/visitor" element={<VisitorHome />} />
            <Route path="/visitor/pricing" element={<VisitorPricing />} />
            <Route path="/visitor/locations" element={<VisitorLocations />} />

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Root route: public visitor landing page */}
            <Route path="/" element={<VisitorHome />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

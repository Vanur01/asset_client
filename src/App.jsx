// App.jsx - Complete Updated Version
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContexts";
import { NotificationProvider } from "./context/NotificationContext";
import { AuditProvider } from "./context/AuditContext";
import { AssetProvider } from "./context/AssetContext";
import { ClientProvider } from "./context/ClientContext";
import { TeamProvider } from "./context/TeamContext";
import { DashboardProvider } from "./context/DashboardContext";
import { ReportProvider } from "./context/ReportContext";
import { ChecklistBuilderProvider } from "./context/ChecklistBuilderContext";
import { RequestChecklistProvider } from "./context/RequestChecklistContext";
import { AssignmentProvider } from "./context/AssignmentContext";
import { AssetRequestProvider } from "./context/AssetRequestContext";
import TeamAssignmentProvider from "./context/TeamAssignmentcontext";
import { ContactInquiryProvider } from "./context/InquiryContext";

// Import pages
import Login from "./components/Login";
import TeamProfile from "./pages/TeamProfile";
import Dashboard from "./pages/Dashboard";
import ClientManagement from "./pages/ClientManagement";
import ClientDetails from "./pages/ClientDetails";
import DashboardLayout from "./layout/Layout";
import TeamManagement from "./pages/TeamManagement";
import TeamDetails from "./pages/TeamDetails";
import ReportsPage from "./pages/Reports";
import ChecklistPage from "./pages/ChecklistBuilder";
import CustomChecklist from "./pages/CustomChecklist";
import GlobalChecklist from "./pages/GlobalChecklist";
import ImportChecklist from "./pages/ImportChecklist";
import CloneChecklist from "./pages/CloneChecklist";
import AssignedChecklist from "./pages/AssignedChecklist";
import Checklistanalytics from "./pages/Checklistanalytics";
import AssignedChecklistDetails from "./pages/AssignedCheckListDetails";
import SubmissionDetails from "./pages/Submissiondetails";
import AssetManagement from "./pages/AssetManagement";
import AddNewAsset from "./pages/AddAssetForm";
import AssetView from "./pages/AssetView";
import EditAsset from "./pages/EditAsset";
import CloneAssets from "./pages/CloneAssetList";
import MyTasks from "./pages/MyTask";
import InspectionHistory from "./pages/Inspectionhistory";
import MyRequests from "./pages/Myrequests";
import AssetRequests from "./pages/AssetRequest";
import CreateAssetRequest from "./pages/CreateAssetRequest";
import AssetRequestDetails from "./pages/AssetRequestDetails";
import ContactInquiries from "./pages/ContactInquiries";
import AuditLogs from "./pages/AuditLogs";
import Main from "./pages/landing/Main";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// ==================== NEW IMPORTS FOR ROLE, DEPARTMENT, LOCATION PAGES ====================
import RolesManagement from "./pages/RolesManagement";
import DepartmentsManagement from "./pages/DepartmentsManagement";
import LocationsManagement from "./pages/LocationsManagement";

const AppProviders = ({ children }) => (
  <AuthProvider>
    <NotificationProvider>
      <AuditProvider>
        <ClientProvider>
          <TeamProvider>
            <AssetProvider>
              <ReportProvider>
                <AssignmentProvider>
                  <DashboardProvider>
                    <ChecklistBuilderProvider>
                      <RequestChecklistProvider>
                        <AssetRequestProvider>
                          <TeamAssignmentProvider>
                            <ContactInquiryProvider>
                              {children}
                            </ContactInquiryProvider>
                          </TeamAssignmentProvider>
                        </AssetRequestProvider>
                      </RequestChecklistProvider>
                    </ChecklistBuilderProvider>
                  </DashboardProvider>
                </AssignmentProvider>
              </ReportProvider>
            </AssetProvider>
          </TeamProvider>
        </ClientProvider>
      </AuditProvider>
    </NotificationProvider>
  </AuthProvider>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #e2e8f0",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <p style={{ color: "#64748b" }}>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Role-based fallback redirects
    if (user.role === "super_admin")
      return <Navigate to="/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    if (user.role === "team") return <Navigate to="/team" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard Routes - Admin & Super Admin only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Reports Route - All authenticated users */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <ReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Reports Route */}
          <Route
            path="/team/reports"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <ReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Contact Inquiry Management Route - Admin & Super Admin only */}
          <Route
            path="/admin/contact-inquiries"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ContactInquiries />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== AUDIT LOGS ROUTE - ALL ROLES ==================== */}
          {/* SUPER_ADMIN: Sees all system logs */}
          {/* ADMIN: Sees own + team members' logs */}
          {/* TEAM: Sees only their own logs */}
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin", "team"]}>
                <DashboardLayout>
                  <AuditLogs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== CHECKLIST ROUTES ==================== */}
          <Route
            path="/admin/checklists"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/checklists/clone"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CloneChecklist />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-checklist/global"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <GlobalChecklist />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-checklist/custom"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CustomChecklist />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/import-checklist/excel"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ImportChecklist />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assigned-checklists"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <AssignedChecklist />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/checklist-analytics/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <Checklistanalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assignment-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <AssignedChecklistDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assignment-submit-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <SubmissionDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== CLIENT MANAGEMENT ROUTES ==================== */}
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <DashboardLayout>
                  <ClientManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/clients-details/:id"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <DashboardLayout>
                  <ClientDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== TEAM MANAGEMENT ROUTES ==================== */}
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <TeamManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/team-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <TeamDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== ROLE, DEPARTMENT, LOCATION MANAGEMENT ROUTES ==================== */}
          {/* Roles Management - Admin & Super Admin only */}
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <RolesManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Departments Management - Admin & Super Admin only */}
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <DepartmentsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Locations Management - Admin & Super Admin only */}
          <Route
            path="/admin/locations"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <LocationsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== ASSET MANAGEMENT ROUTES ==================== */}
          <Route
            path="/admin/assets"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <AssetManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <AddNewAsset />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/view/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <AssetView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/clone"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <CloneAssets />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <EditAsset />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== ASSET REQUEST ROUTES ==================== */}
          <Route
            path="/admin/asset-requests"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <AssetRequests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/asset-requests/create"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <CreateAssetRequest />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/asset-requests/create"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <CreateAssetRequest />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/my-requests"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <MyRequests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/asset-requests/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "team"]}>
                <DashboardLayout>
                  <AssetRequestDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== TEAM MEMBER ROUTES ==================== */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <MyTasks />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/profile"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TeamProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/history"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <InspectionHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

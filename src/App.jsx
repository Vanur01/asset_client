// App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContexts";
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

// Auth Pages
import Login from "./components/Login";

// Team Pages
import TeamProfile from "./pages/TeamProfile";
import Dashboard from "./pages/Dashboard";
import ClientManagement from "./pages/ClientManagement";
import ClientDetails from "./pages/ClientDetails";
import DashboardLayout from "./layout/Layout";
import TeamManagement from "./pages/TeamManagement";
import TeamDetails from "./pages/TeamDetails";
import ReportsPage from "./pages/Reports";

// Checklist Pages
import ChecklistPage from "./pages/ChecklistBuilder";
import CustomChecklist from "./pages/CustomChecklist";
import GlobalChecklist from "./pages/GlobalChecklist";
import ImportChecklist from "./pages/ImportChecklist";
import CloneChecklist from "./pages/CloneChecklist";
import AssignedChecklist from "./pages/AssignedChecklist";
import Checklistanalytics from "./pages/Checklistanalytics";
import AssignedChecklistDetails from "./pages/AssignedCheckListDetails";
import SubmissionDetails from "./pages/Submissiondetails";

// Asset Pages
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
import TaskDetail from "./pages/TaskDetail";

// Contact Inquiry Page
import ContactInquiries from "./pages/ContactInquiries";

// Landing Pages
import Main from "./pages/landing/Main";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// ==================== PROVIDER WRAPPERS ====================

// Main App Providers - Wrap everything that needs ClientProvider
const AppProviders = ({ children }) => (
  <AuthProvider>
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
  </AuthProvider>
);

// ==================== PROTECTED ROUTE ====================

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
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "super_admin" || user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "team") {
      return <Navigate to="/team" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==================== MAIN APP ====================

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

          {/* Admin Dashboard Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Reports Route */}
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

          {/* Contact Inquiry Management Route */}
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
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ClientManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/clients-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
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
              <ProtectedRoute allowedRoles={["admin", "team"]}>
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
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetRequests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/asset-requests/create"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
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

          {/* ==================== TEAM ROUTES ==================== */}
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
            path="/team/task-details/:id"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TaskDetail />
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

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

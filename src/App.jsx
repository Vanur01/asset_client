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
import ChecklistBuilder from "./pages/ChecklistBuilder";
import CustomChecklist from "./pages/CustomChecklist";
import GlobalChecklist from "./pages/GlobalChecklist";
import ImportChecklist from "./pages/ImportChecklist";
import CloneChecklist from "./pages/CloneChecklist";
import RequestChecklist from "./pages/RequestChecklist";
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
import TaskDetail from "./pages/TaskDetail";

// Landing Pages
import Main from "./pages/landing/Main";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// ==================== PROVIDER WRAPPERS ====================

// Combined Provider for Admin routes
const CombinedProviderWrapper = ({ children }) => (
  <ClientProvider>
    <TeamProvider>
      <AssetProvider>
        <ReportProvider>
          <AssignmentProvider>{children}</AssignmentProvider>
        </ReportProvider>
      </AssetProvider>
    </TeamProvider>
  </ClientProvider>
);

// Asset Provider Wrapper
const AssetProviderWrapper = ({ children }) => (
  <AssetProvider>{children}</AssetProvider>
);

// Asset Request Provider Wrapper
const AssetRequestProviderWrapper = ({ children }) => (
  <AssetRequestProvider>
    <AssetProvider>{children}</AssetProvider>
  </AssetRequestProvider>
);

// Team Provider Wrapper (for Team Profile and Team routes)
const TeamProviderWrapper = ({ children }) => (
  <TeamProvider>{children}</TeamProvider>
);

// Team Assignment Provider Wrapper (for Task routes that need assignment context)
const TeamAssignmentProviderWrapper = ({ children }) => (
  <TeamAssignmentProvider>{children}</TeamAssignmentProvider>
);

// Dashboard wrapper (includes DashboardProvider)
const DashboardProviderWrapper = ({ children }) => (
  <CombinedProviderWrapper>
    <DashboardProvider>{children}</DashboardProvider>
  </CombinedProviderWrapper>
);

// Checklist Builder Provider Wrapper
const ChecklistBuilderWrapper = ({ children }) => (
  <ChecklistBuilderProvider>
    <CombinedProviderWrapper>{children}</CombinedProviderWrapper>
  </ChecklistBuilderProvider>
);

// Request Checklist Provider Wrapper
const RequestChecklistWrapper = ({ children }) => (
  <RequestChecklistProvider>
    <CombinedProviderWrapper>{children}</CombinedProviderWrapper>
  </RequestChecklistProvider>
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
    <AuthProvider>
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
                  <DashboardProviderWrapper>
                    <Dashboard />
                  </DashboardProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Checklists Routes */}
          <Route
            path="/admin/checklists"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistBuilderWrapper>
                    <ChecklistBuilder />
                  </ChecklistBuilderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/checklists/clone"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistBuilderWrapper>
                    <CloneChecklist />
                  </ChecklistBuilderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/request-checklist"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <RequestChecklistWrapper>
                    <RequestChecklist />
                  </RequestChecklistWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-checklist/global"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistBuilderWrapper>
                    <GlobalChecklist />
                  </ChecklistBuilderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-checklist/custom"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistBuilderWrapper>
                    <CustomChecklist />
                  </ChecklistBuilderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/import-checklist/excel"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <ChecklistBuilderWrapper>
                    <ImportChecklist />
                  </ChecklistBuilderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assigned-checklists"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CombinedProviderWrapper>
                    <AssignedChecklist />
                  </CombinedProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/checklist-analytics/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CombinedProviderWrapper>
                    <Checklistanalytics />
                  </CombinedProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assignment-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CombinedProviderWrapper>
                    <AssignedChecklistDetails />
                  </CombinedProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assignment-submit-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <CombinedProviderWrapper>
                    <SubmissionDetails />
                  </CombinedProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Client Management Routes (Super Admin Only) */}
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <DashboardLayout>
                  <ClientProvider>
                    <ClientManagement />
                  </ClientProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/clients-details/:id"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <DashboardLayout>
                  <ClientProvider>
                    <ClientDetails />
                  </ClientProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Management Routes */}
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <TeamProvider>
                    <TeamManagement />
                  </TeamProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/team-details/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <DashboardLayout>
                  <TeamProvider>
                    <TeamDetails />
                  </TeamProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Asset Management Routes */}
          <Route
            path="/admin/assets"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <AssetManagement />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/add"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <AddNewAsset />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/view/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <AssetView />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/clone"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <CloneAssets />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assets/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <EditAsset />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <CombinedProviderWrapper>
                    <ReportsPage />
                  </CombinedProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Asset Request Routes */}
          <Route
            path="/admin/asset-requests"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetRequestProviderWrapper>
                    <AssetRequests />
                  </AssetRequestProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/asset-requests/create"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetRequestProviderWrapper>
                    <CreateAssetRequest />
                  </AssetRequestProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/my-requests"
            element={
              <ProtectedRoute allowedRoles={["admin", "team"]}>
                <DashboardLayout>
                  <AssetRequestProviderWrapper>
                    <MyRequests />
                  </AssetRequestProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== TEAM ROUTES ==================== */}

          {/* Team My Tasks Route - Team only with AssignmentProvider */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TeamAssignmentProviderWrapper>
                    <MyTasks />
                  </TeamAssignmentProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Task Details Route - Team only */}
          <Route
            path="/task-details/:id"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TeamAssignmentProviderWrapper>
                    <TaskDetail />
                  </TeamAssignmentProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team My Asset Requests Route */}
          <Route
            path="/team/asset-requests"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <AssetRequestProviderWrapper>
                    <MyRequests />
                  </AssetRequestProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Create Asset Request Route */}
          <Route
            path="/team/asset-requests/create"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <AssetRequestProviderWrapper>
                    <CreateAssetRequest />
                  </AssetRequestProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Profile Route */}
          <Route
            path="/team/profile"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TeamProviderWrapper>
                    <TeamProfile />
                  </TeamProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Inspection History Route */}
          <Route
            path="/team/history"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <TeamProviderWrapper>
                    <InspectionHistory />
                  </TeamProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Assets Route */}
          <Route
            path="/team/assets"
            element={
              <ProtectedRoute allowedRoles={["team"]}>
                <DashboardLayout>
                  <AssetProviderWrapper>
                    <AssetManagement />
                  </AssetProviderWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
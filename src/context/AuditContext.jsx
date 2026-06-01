// context/AuditContext.jsx - Complete with role-based access for super_admin, admin, and team
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContexts";

const AuditContext = createContext();

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
};

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

export const AuditProvider = ({ children }) => {
  const { token, user } = useAuth();

  // State for Super Admin - All logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // State for Admin - Organization activity (own + team members)
  const [organizationActivity, setOrganizationActivity] = useState([]);
  const [orgActivityLoading, setOrgActivityLoading] = useState(false);
  const [orgActivityPagination, setOrgActivityPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // State for Team - My own activity
  const [myActivity, setMyActivity] = useState([]);
  const [myActivityLoading, setMyActivityLoading] = useState(false);
  const [myActivityPagination, setMyActivityPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Common state
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    resource: "",
    actorRole: "",
    startDate: null,
    endDate: null,
    search: "",
  });

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    const currentToken =
      token ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    };
  }, [token]);

  // Role-based access checks
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin";
  const isTeam = user?.role === "team";

  // ==================== SUPER ADMIN METHODS ====================

  /**
   * Fetch all audit logs (Super Admin only)
   * Sees EVERYTHING across the entire system
   */
  const fetchAuditLogs = useCallback(
    async (page = 1, limit = 20, appliedFilters = filters) => {
      if (!isSuperAdmin) {
        setError("Access denied. Only Super Admins can view all audit logs.");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (appliedFilters.action)
          params.append("action", appliedFilters.action);
        if (appliedFilters.resource)
          params.append("resource", appliedFilters.resource);
        if (appliedFilters.actorRole)
          params.append("actorRole", appliedFilters.actorRole);
        if (appliedFilters.startDate)
          params.append("startDate", appliedFilters.startDate.toISOString());
        if (appliedFilters.endDate)
          params.append("endDate", appliedFilters.endDate.toISOString());
        if (appliedFilters.search)
          params.append("search", appliedFilters.search);

        const response = await axios.get(
          `${API_BASE_URL}/audit-logs?${params.toString()}`,
          getAuthHeaders(),
        );

        if (response.data.success) {
          setAuditLogs(response.data.auditLogs);
          setPagination(response.data.pagination);
          return response.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch audit logs",
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch audit logs";
        setError(errorMessage);
        console.error("Error fetching audit logs:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isSuperAdmin, getAuthHeaders, filters],
  );

  /**
   * Fetch audit statistics (Super Admin only)
   * Shows system-wide statistics
   */
  const fetchAuditStats = useCallback(async () => {
    if (!isSuperAdmin) return null;

    setStatsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/audit-logs/statistics`,
        getAuthHeaders(),
      );

      if (response.data.success) {
        setStats(response.data.stats);
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch statistics");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch statistics";
      setError(errorMessage);
      console.error("Error fetching audit stats:", err);
      return null;
    } finally {
      setStatsLoading(false);
    }
  }, [isSuperAdmin, getAuthHeaders]);

  /**
   * Export audit logs (Super Admin only)
   */
  const exportAuditLogs = useCallback(
    async (format = "csv") => {
      if (!isSuperAdmin) {
        setError("Access denied. Only Super Admins can export audit logs.");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          format,
          ...(filters.action && { action: filters.action }),
          ...(filters.resource && { resource: filters.resource }),
          ...(filters.actorRole && { actorRole: filters.actorRole }),
          ...(filters.startDate && {
            startDate: filters.startDate.toISOString(),
          }),
          ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
        });

        const response = await axios.get(
          `${API_BASE_URL}/audit-logs/export?${params.toString()}`,
          {
            ...getAuthHeaders(),
            responseType: "blob",
          },
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const extension = format === "csv" ? "csv" : "json";
        link.setAttribute(
          "download",
          `audit-logs-${new Date().toISOString().split("T")[0]}.${extension}`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to export audit logs";
        setError(errorMessage);
        console.error("Error exporting audit logs:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isSuperAdmin, getAuthHeaders, filters],
  );

  // ==================== ADMIN METHODS ====================

  /**
   * Get organization activity (Admin only)
   * Sees their OWN logs + TEAM MEMBERS' logs under their organization
   */
  const fetchOrganizationActivity = useCallback(
    async (page = 1, limit = 20) => {
      if (!isAdmin && !isSuperAdmin) {
        setError(
          "Access denied. Only Admins and Super Admins can view organization activity.",
        );
        return null;
      }

      setOrgActivityLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/audit-logs/organization?page=${page}&limit=${limit}`,
          getAuthHeaders(),
        );

        if (response.data.success) {
          setOrganizationActivity(response.data.auditLogs);
          setOrgActivityPagination(response.data.pagination);
          return response.data;
        }
        return null;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch organization activity";
        setError(errorMessage);
        console.error("Error fetching organization activity:", err);
        return null;
      } finally {
        setOrgActivityLoading(false);
      }
    },
    [isAdmin, isSuperAdmin, getAuthHeaders],
  );

  // ==================== TEAM METHODS (Also available to all) ====================

  /**
   * Get my own activity (All authenticated users)
   * Team members see ONLY their own logs
   * Admins can also see their own logs here
   * Super Admins can also see their own logs here
   */
  const fetchMyActivity = useCallback(
    async (page = 1, limit = 20) => {
      setMyActivityLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/audit-logs/my-activity?page=${page}&limit=${limit}`,
          getAuthHeaders(),
        );

        if (response.data.success) {
          setMyActivity(response.data.auditLogs);
          setMyActivityPagination(response.data.pagination);
          return response.data;
        }
        return null;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch your activity";
        setError(errorMessage);
        console.error("Error fetching my activity:", err);
        return null;
      } finally {
        setMyActivityLoading(false);
      }
    },
    [getAuthHeaders],
  );

  /**
   * Get resource audit trail (All authenticated users)
   * Returns audit trail for a specific resource
   * Backend should verify user has access to the resource
   */
  const getResourceAuditTrail = useCallback(
    async (resourceId, resource, limit = 50) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/audit-logs/resource/${resource}/${resourceId}?limit=${limit}`,
          getAuthHeaders(),
        );

        if (response.data.success) {
          return response.data.auditLogs;
        }
        return null;
      } catch (err) {
        console.error("Error fetching resource audit trail:", err);
        return null;
      }
    },
    [getAuthHeaders],
  );

  // ==================== FILTER MANAGEMENT ====================

  /**
   * Update filters (only used by Super Admin)
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      action: "",
      resource: "",
      actorRole: "",
      startDate: null,
      endDate: null,
      search: "",
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get appropriate logs based on role (for dashboard display)
   */
  const getRoleAppropriateLogs = useCallback(
    async (page = 1, limit = 20) => {
      if (isSuperAdmin) {
        return await fetchAuditLogs(page, limit);
      } else if (isAdmin) {
        return await fetchOrganizationActivity(page, limit);
      } else {
        return await fetchMyActivity(page, limit);
      }
    },
    [
      isSuperAdmin,
      isAdmin,
      fetchAuditLogs,
      fetchOrganizationActivity,
      fetchMyActivity,
    ],
  );

  /**
   * Get the current logs based on user role (for UI display)
   */
  const getCurrentLogs = useMemo(() => {
    if (isSuperAdmin) return auditLogs;
    if (isAdmin) return organizationActivity;
    return myActivity;
  }, [isSuperAdmin, isAdmin, auditLogs, organizationActivity, myActivity]);

  /**
   * Get current loading state based on role
   */
  const getCurrentLoading = useMemo(() => {
    if (isSuperAdmin) return loading;
    if (isAdmin) return orgActivityLoading;
    return myActivityLoading;
  }, [isSuperAdmin, isAdmin, loading, orgActivityLoading, myActivityLoading]);

  /**
   * Get current pagination based on role
   */
  const getCurrentPagination = useMemo(() => {
    if (isSuperAdmin) return pagination;
    if (isAdmin) return orgActivityPagination;
    return myActivityPagination;
  }, [
    isSuperAdmin,
    isAdmin,
    pagination,
    orgActivityPagination,
    myActivityPagination,
  ]);

  /**
   * Get page title based on role
   */
  const getPageTitle = useCallback(() => {
    if (isSuperAdmin) return "System Audit Logs";
    if (isAdmin) return "Organization Activity";
    return "My Activity";
  }, [isSuperAdmin, isAdmin]);

  /**
   * Get page description based on role
   */
  const getPageDescription = useCallback(() => {
    if (isSuperAdmin) {
      return "Complete audit trail of all activities across the entire system";
    }
    if (isAdmin) {
      return "Monitor activity within your organization (your actions + team members)";
    }
    return "Track your own personal activity and actions within the system";
  }, [isSuperAdmin, isAdmin]);

  /**
   * Check if user can export logs
   */
  const canExport = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  /**
   * Check if user can see statistics
   */
  const canSeeStats = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  /**
   * Check if user can see advanced filters
   */
  const canSeeAdvancedFilters = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  const value = useMemo(
    () => ({
      // Data states
      auditLogs,
      myActivity,
      organizationActivity,
      loading: getCurrentLoading,
      error,
      stats,
      statsLoading,
      myActivityLoading,
      orgActivityLoading,
      pagination: getCurrentPagination,
      myActivityPagination,
      orgActivityPagination,
      filters,
      currentLogs: getCurrentLogs,

      // Role checks
      isSuperAdmin,
      isAdmin,
      isTeam,

      // Role-based permissions
      canExport,
      canSeeStats,
      canSeeAdvancedFilters,

      // Super Admin methods
      fetchAuditLogs,
      fetchAuditStats,
      exportAuditLogs,

      // Admin methods
      fetchOrganizationActivity,

      // All user methods
      fetchMyActivity,
      getResourceAuditTrail,
      getRoleAppropriateLogs,

      // Filter management
      updateFilters,
      resetFilters,
      clearError,

      // Role-based UI helpers
      getPageTitle,
      getPageDescription,
      getCurrentLogs: () => getCurrentLogs,
      getCurrentLoading: () => getCurrentLoading,
      getCurrentPagination: () => getCurrentPagination,
    }),
    [
      auditLogs,
      myActivity,
      organizationActivity,
      getCurrentLoading,
      error,
      stats,
      statsLoading,
      myActivityLoading,
      orgActivityLoading,
      getCurrentPagination,
      myActivityPagination,
      orgActivityPagination,
      filters,
      getCurrentLogs,
      isSuperAdmin,
      isAdmin,
      isTeam,
      canExport,
      canSeeStats,
      canSeeAdvancedFilters,
      fetchAuditLogs,
      fetchAuditStats,
      exportAuditLogs,
      fetchOrganizationActivity,
      fetchMyActivity,
      getResourceAuditTrail,
      getRoleAppropriateLogs,
      updateFilters,
      resetFilters,
      clearError,
      getPageTitle,
      getPageDescription,
    ],
  );

  return (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
  );
};

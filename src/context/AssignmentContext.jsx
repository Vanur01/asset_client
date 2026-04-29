// context/AssignmentContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContexts";

const AssignmentContext = createContext();

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignment must be used within AssignmentProvider");
  }
  return context;
};

export const AssignmentProvider = ({ children }) => {
  const { authRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get all assignments (Super Admin sees all, Admin sees their assignments)
  const getAssignments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let url = "/assignments";
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.priority) queryParams.append("priority", filters.priority);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.customerId) queryParams.append("customerId", filters.customerId);
      if (filters.checklistId) queryParams.append("checklistId", filters.checklistId);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await authRequest("GET", url);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignments";
      console.error("Get assignments error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignment statistics
  const getAssignmentStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", "/assignments/statistics");
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignment statistics";
      console.error("Get assignment stats error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get single assignment by ID
  const getAssignmentById = useCallback(async (assignmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/${assignmentId}`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignment details";
      console.error("Get assignment by ID error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignment details with full data
  const getAssignmentDetails = useCallback(async (assignmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/${assignmentId}/details`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignment details";
      console.error("Get assignment details error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Assign checklist to admin (Super Admin only)
  const assignToAdmin = useCallback(async (assignmentData) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Assigning to admin with data:", assignmentData);
      const response = await authRequest("POST", "/assignments/assign-to-admin", assignmentData);
      console.log("Assignment response:", response);
      if (response.success) {
        setSuccess("Checklist assigned to admin successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message || "Assignment failed" };
    } catch (err) {
      const errorMsg = err.message || "Failed to assign checklist to admin";
      console.error("Assign to admin error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Assign checklist to team member (Admin only)
  const assignToTeam = useCallback(async (assignmentData) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Assigning to team with data:", assignmentData);
      const response = await authRequest("POST", "/assignments/assign-to-team", assignmentData);
      console.log("Assignment response:", response);
      if (response.success) {
        setSuccess("Checklist assigned to team member successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message || "Assignment failed" };
    } catch (err) {
      const errorMsg = err.message || "Failed to assign checklist to team";
      console.error("Assign to team error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignments by checklist
  const getAssignmentsByChecklist = useCallback(async (checklistId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/checklist/${checklistId}`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignments";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get submissions by checklist
  const getSubmissionsByChecklist = useCallback(async (checklistId, page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/checklist/${checklistId}/submissions?page=${page}&limit=${limit}`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch submissions";
      console.error("Get submissions error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignees by checklist
  const getAssigneesByChecklist = useCallback(async (checklistId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/checklist/${checklistId}/assignees`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignees";
      console.error("Get assignees error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get checklist analytics
  const getChecklistAnalytics = useCallback(async (checklistId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/checklist/${checklistId}/analytics`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch checklist analytics";
      console.error("Get checklist analytics error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignments by admin
  const getAssignmentsByAdmin = useCallback(async (adminId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/admin/${adminId}`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignments";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get assignments by team member
  const getAssignmentsByTeamMember = useCallback(async (memberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/team/${memberId}`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch assignments";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Update assignment status
  const updateAssignmentStatus = useCallback(async (assignmentId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("PUT", `/assignments/${assignmentId}/status`, { status });
      if (response.success) {
        setSuccess("Assignment status updated successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const errorMsg = err.message || "Failed to update assignment status";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Update assignment priority
  const updateAssignmentPriority = useCallback(async (assignmentId, priority) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("PUT", `/assignments/${assignmentId}/priority`, { priority });
      if (response.success) {
        setSuccess("Assignment priority updated successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const errorMsg = err.message || "Failed to update assignment priority";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Update assignment (PATCH) - for editing due date, priority, admin notes
  const updateAssignment = useCallback(async (assignmentId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("PATCH", `/assignments/${assignmentId}`, updateData);
      if (response.success) {
        setSuccess("Assignment updated successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message || "Update failed" };
    } catch (err) {
      const errorMsg = err.message || "Failed to update assignment";
      console.error("Update assignment error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Get submission by ID
  const getSubmissionById = useCallback(async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", `/assignments/${submissionId}/details`);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch submission details";
      console.error("Get submission by ID error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Submit assignment response (for team members)
  const submitAssignmentResponse = useCallback(async (assignmentId, responseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("POST", `/assignments/${assignmentId}/submit`, responseData);
      if (response.success) {
        setSuccess("Assignment submitted successfully!");
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const errorMsg = err.message || "Failed to submit assignment";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    loading,
    error,
    success,
    getAssignments,
    getAssignmentStats,
    getAssignmentById,
    getAssignmentDetails,
    assignToAdmin,
    assignToTeam,
    getAssignmentsByChecklist,
    getSubmissionsByChecklist,
    getAssigneesByChecklist,
    getChecklistAnalytics,
    getAssignmentsByAdmin,
    getAssignmentsByTeamMember,
    updateAssignmentStatus,
    updateAssignmentPriority,
    updateAssignment,
    getSubmissionById,
    submitAssignmentResponse,
    clearMessages,
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};
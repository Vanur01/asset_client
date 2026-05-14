// context/RequestChecklistContext.jsx - Updated Version
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContexts";

const RequestChecklistContext = createContext();

export const useRequestChecklist = () => {
  const context = useContext(RequestChecklistContext);
  if (!context) {
    throw new Error(
      "useRequestChecklist must be used within RequestChecklistProvider",
    );
  }
  return context;
};

export const RequestChecklistProvider = ({ children }) => {
  const { authRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Submit new request
  const submitRequest = useCallback(
    async (requestData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authRequest(
          "POST",
          "/checklist/requests",
          requestData,
        );
        if (response.success) {
          setSuccess("Checklist request submitted successfully!");
          return { success: true, data: response };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to submit request";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [authRequest],
  );

  // Get all requests
  const getAllRequests = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        let url = "/checklist/requests/list";
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.page) queryParams.append("page", filters.page);
        if (filters.limit) queryParams.append("limit", filters.limit);

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const response = await authRequest("GET", url);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch requests";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [authRequest],
  );

  // Get request by ID
  const getRequestById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authRequest("GET", `/checklist/requests/${id}`);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch request";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [authRequest],
  );

  // Get request stats
  const getRequestStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest("GET", "/checklist/requests/stats");
      return { success: true, data: response };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch stats";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  // Review request (Approve/Reject/Under Review) - Simplified version
  const reviewRequest = useCallback(
    async (id, action, rejectionReason = null) => {
      setLoading(true);
      setError(null);
      try {
        const body = { action };

        // Only add rejectionReason if action is "rejected"
        if (action === "rejected" && rejectionReason) {
          body.rejectionReason = rejectionReason;
        }

        const response = await authRequest(
          "PATCH",
          `/checklist/requests/${id}/review`,
          body,
        );

        if (response.success) {
          setSuccess(`Request ${action} successfully!`);
          return { success: true, data: response };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to review request";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [authRequest],
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    loading,
    error,
    success,
    submitRequest,
    getAllRequests,
    getRequestById,
    getRequestStats,
    reviewRequest,
    clearMessages,
  };

  return (
    <RequestChecklistContext.Provider value={value}>
      {children}
    </RequestChecklistContext.Provider>
  );
};

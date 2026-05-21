// contexts/AssetRequestContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContexts";
import axios from "axios";

const AssetRequestContext = createContext();

export const useAssetRequest = () => {
  const context = useContext(AssetRequestContext);
  if (!context)
    throw new Error("useAssetRequest must be used within AssetRequestProvider");
  return context;
};

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

export const AssetRequestProvider = ({ children }) => {
  const { token, user, isAdmin, isTeam } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getAuthHeaders = useCallback(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  // GET /asset/:id — fetch a single asset/request by ID
  const getRequestById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/asset/${id}`,
          getAuthHeaders(),
        );
        if (response.data.success) return response.data.data;
        return null;
      } catch (error) {
        console.error("Error fetching request:", error);
        if (error.response?.status === 404) return null;
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  // POST /asset/request — team submits a new asset request
  const createRequest = useCallback(
    async (requestData) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/asset/request`,
          requestData,
          getAuthHeaders(),
        );
        if (response.data.success) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error creating request:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  // GET /asset/requests/parent — admin: all parent requests | team: own
  const getParentRequests = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "" && value !== null)
            params.append(key, value);
        });
        const url = `${API_BASE_URL}/asset/requests/parent${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await axios.get(url, getAuthHeaders());
        if (response.data.success) {
          setRequests(response.data.requests || []);
          setPagination(
            response.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
          );
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching parent requests:", error);
        if (error.response?.status === 403) {
          setRequests([]);
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
          return { requests: [], pagination: { total: 0 } };
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  // GET /asset/requests/child — admin: all child requests | team: own
  const getChildRequests = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "" && value !== null)
            params.append(key, value);
        });
        const url = `${API_BASE_URL}/asset/requests/child${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await axios.get(url, getAuthHeaders());
        if (response.data.success) {
          setRequests(response.data.requests || []);
          setPagination(
            response.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
          );
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching child requests:", error);
        if (error.response?.status === 403) {
          setRequests([]);
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
          return { requests: [], pagination: { total: 0 } };
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  // GET /asset/requests/my — team only: their own requests
  const getMyRequests = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "" && value !== null)
            params.append(key, value);
        });
        const url = `${API_BASE_URL}/asset/requests/my${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await axios.get(url, getAuthHeaders());
        if (response.data.success) {
          setRequests(response.data.requests || []);
          setPagination(
            response.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
          );
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching my requests:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setRequests([]);
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
          return { requests: [], pagination: { total: 0 } };
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  // POST /asset/requests/:id/process — admin approves or rejects
  const reviewRequest = useCallback(
    async (id, action, rejectionReason = null) => {
      setLoading(true);
      try {
        const body = { action };
        if (rejectionReason) body.rejectionReason = rejectionReason;
        const response = await axios.post(
          `${API_BASE_URL}/asset/requests/${id}/process`,
          body,
          getAuthHeaders(),
        );
        if (response.data.success) return response.data;
        return null;
      } catch (error) {
        console.error("Error reviewing request:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders],
  );

  const value = {
    requests,
    loading,
    pagination,
    getParentRequests,
    getChildRequests,
    getMyRequests,
    getRequestById,
    createRequest,
    reviewRequest,
    isAdmin: isAdmin?.(),
    isTeam: isTeam?.(),
  };

  return (
    <AssetRequestContext.Provider value={value}>
      {children}
    </AssetRequestContext.Provider>
  );
};

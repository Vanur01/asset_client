// context/ClientContext.jsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import axios from "axios";

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

// Initial state
const initialState = {
  clients: [],
  totalClients: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  initialLoading: true,
  error: null,
  selectedClient: null,
  subscriptionReport: null,
  stats: {
    total: 0,
    active: 0,
    expiringSoon: 0,
    byPlan: {
      free: 0,
      standard: 0,
      premium: 0,
      enterprise: 0,
    },
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    search: "",
    status: "all",
    membershipPlan: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 12,
  },
  actionLoading: false,
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",
  SET_INITIAL_LOADING: "SET_INITIAL_LOADING",
  SET_ACTION_LOADING: "SET_ACTION_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CLIENTS: "SET_CLIENTS",
  SET_SELECTED_CLIENT: "SET_SELECTED_CLIENT",
  SET_SUBSCRIPTION_REPORT: "SET_SUBSCRIPTION_REPORT",
  UPDATE_FILTERS: "UPDATE_FILTERS",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_STATS: "SET_STATS",
  SET_PAGINATION: "SET_PAGINATION",
};

// Reducer function
const clientReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTION_TYPES.SET_INITIAL_LOADING:
      return { ...state, initialLoading: action.payload };
    case ACTION_TYPES.SET_ACTION_LOADING:
      return { ...state, actionLoading: action.payload };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false, initialLoading: false };
    case ACTION_TYPES.SET_CLIENTS:
      return {
        ...state,
        clients: action.payload.clients,
        totalClients: action.payload.total,
        currentPage: action.payload.page,
        loading: false,
        initialLoading: false,
        error: null,
        pagination: {
          ...state.pagination,
          page: action.payload.page,
          total: action.payload.total,
          pages: action.payload.pages,
          limit: action.payload.limit || state.pagination.limit,
        },
      };
    case ACTION_TYPES.SET_SELECTED_CLIENT:
      return { ...state, selectedClient: action.payload, loading: false };
    case ACTION_TYPES.SET_SUBSCRIPTION_REPORT:
      return { ...state, subscriptionReport: action.payload, loading: false };
    case ACTION_TYPES.UPDATE_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTION_TYPES.SET_STATS:
      return { ...state, stats: action.payload };
    case ACTION_TYPES.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    default:
      return state;
  }
};

// Helper function for auth headers
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Helper to get token from localStorage - FIXED: Check both 'accessToken' and 'token'
const getToken = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return null;
  }
  if (token === "undefined" || token === "null") {
    console.warn("Invalid token found in localStorage");
    return null;
  }
  return token;
};

// Create Context
const ClientContext = createContext(null);

// Provider component
export const ClientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  // Ref to track active getAllClients request
  const activeGetAllControllerRef = useRef(null);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  // Calculate stats from clients data
  const calculateStats = useCallback((clientsData) => {
    const total = clientsData.length;
    const active = clientsData.filter(c => c.status === "active").length;
    const expiringSoon = clientsData.filter(c => c.daysRemaining > 0 && c.daysRemaining <= 7).length;
    
    const byPlan = {
      free: clientsData.filter(c => c.membershipPlan?.toLowerCase() === "free").length,
      standard: clientsData.filter(c => c.membershipPlan?.toLowerCase() === "standard").length,
      premium: clientsData.filter(c => c.membershipPlan?.toLowerCase() === "premium").length,
      enterprise: clientsData.filter(c => c.membershipPlan?.toLowerCase() === "enterprise").length,
    };
    
    return { total, active, expiringSoon, byPlan };
  }, []);

  // Get all clients with pagination and filters
  const getAllClients = useCallback(
    async (token = null, params = {}) => {
      // Get token if not provided
      const authToken = token || getToken();
      
      if (!authToken) {
        console.error("No authentication token available for getAllClients");
        dispatch({ 
          type: ACTION_TYPES.SET_ERROR, 
          payload: "Authentication required. Please login again." 
        });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
        return null;
      }

      // Cancel any in-flight request for this endpoint
      if (activeGetAllControllerRef.current) {
        activeGetAllControllerRef.current.abort();
      }
      activeGetAllControllerRef.current = new AbortController();

      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      try {
        const {
          page = state.currentPage,
          limit = params.limit || state.filters.limit,
          search = params.search !== undefined ? params.search : state.filters.search,
          status = params.status !== undefined ? params.status : state.filters.status,
          membershipPlan = params.membershipPlan !== undefined ? params.membershipPlan : state.filters.membershipPlan,
          sortBy = params.sortBy || state.filters.sortBy,
          sortOrder = params.sortOrder || state.filters.sortOrder,
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("limit", limit);
        queryParams.append("sortBy", sortBy);
        queryParams.append("sortOrder", sortOrder);

        if (search && search !== "all" && search.trim()) {
          queryParams.append("search", search.trim());
        }
        if (status && status !== "all") queryParams.append("status", status);
        if (membershipPlan && membershipPlan !== "all")
          queryParams.append("membershipPlan", membershipPlan);

        const url = `${API_BASE_URL}/user/clients?${queryParams.toString()}`;

        console.log("Fetching clients from:", url);

        const response = await axios.get(url, {
          headers: getAuthHeaders(authToken),
          signal: activeGetAllControllerRef.current.signal,
        });

        const clientsData = response.data.clients || response.data.data || [];
        const total = response.data.total || 0;
        const pages = response.data.pages || 0;
        
        // Calculate stats from clients data
        const stats = calculateStats(clientsData);
        
        dispatch({
          type: ACTION_TYPES.SET_CLIENTS,
          payload: {
            clients: clientsData,
            total: total,
            pages: pages,
            page: parseInt(page),
            limit: parseInt(limit),
          },
        });
        
        dispatch({
          type: ACTION_TYPES.SET_STATS,
          payload: stats,
        });

        return response.data;
      } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") {
          // Silently swallow cancellations
          return null;
        }
        console.error("Get all clients error:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to fetch clients";
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
        throw error.response?.data || error;
      } finally {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        activeGetAllControllerRef.current = null;
      }
    },
    [state.currentPage, state.filters, calculateStats],
  );

  // Fetch clients with current filters
  const fetchClients = useCallback(async (params = {}) => {
    const token = getToken();
    if (!token) {
      console.error("No token found, cannot fetch clients");
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: "Authentication required. Please login again." 
      });
      dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
      return null;
    }
    return await getAllClients(token, params);
  }, [getAllClients]);

  // Get client by ID
  const getClientById = useCallback(async (clientId) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required");
    }
    
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/clients/${clientId}`,
        { headers: getAuthHeaders(token) },
      );

      dispatch({
        type: ACTION_TYPES.SET_SELECTED_CLIENT,
        payload: response.data.client || response.data.data,
      });

      return response.data;
    } catch (error) {
      console.error("Get client by ID error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch client";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      throw error.response?.data || error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, []);

  // Create client
  const addClient = useCallback(async (clientData) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/clients`,
        clientData,
        { headers: getAuthHeaders(token) },
      );

      // Refresh the client list after adding
      await fetchClients();
      
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      return response.data;
    } catch (error) {
      console.error("Create client error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create client";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      throw error.response?.data || error;
    }
  }, [fetchClients]);

  // Update client
  const editClient = useCallback(async (clientId, updateData) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/clients/${clientId}`,
        updateData,
        { headers: getAuthHeaders(token) },
      );

      // If the updated client is currently selected, update it
      if (
        state.selectedClient?.id === clientId ||
        state.selectedClient?._id === clientId
      ) {
        dispatch({
          type: ACTION_TYPES.SET_SELECTED_CLIENT,
          payload: response.data.client || response.data.data,
        });
      }

      // Refresh the client list
      await fetchClients();
      
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      return response.data;
    } catch (error) {
      console.error("Update client error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update client";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      throw error.response?.data || error;
    }
  }, [state.selectedClient, fetchClients]);

  // Update client status (activate/deactivate)
  const changeClientStatus = useCallback(async (clientId, status) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/clients/${clientId}/status`,
        { status },
        { headers: getAuthHeaders(token) },
      );
      
      // Refresh the client list
      await fetchClients();
      
      return response.data;
    } catch (error) {
      console.error("Update client status error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update status";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      throw error.response?.data || error;
    }
  }, [fetchClients]);

  // Delete client
  const deleteClient = useCallback(async (clientId, permanent = false) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

    try {
      const url = permanent
        ? `${API_BASE_URL}/user/clients/${clientId}?permanent=true`
        : `${API_BASE_URL}/user/clients/${clientId}`;

      const response = await axios.delete(url, {
        headers: getAuthHeaders(token),
      });

      // Refresh the client list
      await fetchClients();
      
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      return response.data;
    } catch (error) {
      console.error("Delete client error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete client";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      throw error.response?.data || error;
    }
  }, [fetchClients]);

  // Renew client membership
  const renewClientMembership = useCallback(async (clientId, extendDays) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/clients/${clientId}/renew`,
        { extendDays },
        { headers: getAuthHeaders(token) },
      );

      // Refresh the client list
      await fetchClients();
      
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      return response.data;
    } catch (error) {
      console.error("Renew membership error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to renew membership";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      throw error.response?.data || error;
    }
  }, [fetchClients]);

  // Update auto-renewal
  const updateAutoRenewal = useCallback(async (clientId, enabled) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/clients/${clientId}/auto-renewal`,
        { enabled },
        { headers: getAuthHeaders(token) },
      );
      return response.data;
    } catch (error) {
      console.error("Update auto-renewal error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update auto-renewal";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      throw error.response?.data || error;
    }
  }, []);

  // Get subscription report
  const getSubscriptionReport = useCallback(async (params = {}) => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      throw new Error("Authentication required. Please login again.");
    }
    
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

    try {
      const queryParams = new URLSearchParams(params);
      const response = await axios.get(
        `${API_BASE_URL}/user/clients/subscription-report?${queryParams}`,
        { headers: getAuthHeaders(token) },
      );

      dispatch({
        type: ACTION_TYPES.SET_SUBSCRIPTION_REPORT,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("Get subscription report error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch report";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      throw error.response?.data || error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((filters) => {
    dispatch({ type: ACTION_TYPES.UPDATE_FILTERS, payload: filters });
  }, []);

  // Change page
  const changePage = useCallback((page) => {
    dispatch({ 
      type: ACTION_TYPES.SET_PAGINATION, 
      payload: { page } 
    });
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch({ 
      type: ACTION_TYPES.UPDATE_FILTERS, 
      payload: {
        search: "",
        status: "all",
        membershipPlan: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: 12,
      }
    });
  }, []);

  // Initial load - wait a bit for auth to initialize
  useEffect(() => {
    // Small delay to ensure auth has initialized
    const timer = setTimeout(() => {
      const token = getToken();
      if (token) {
        console.log("Initial load: Token found, fetching clients");
        fetchClients();
      } else {
        console.log("Initial load: No token found, waiting for auth");
        dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const value = {
    // State
    ...state,
    // Actions
    getAllClients,
    fetchClients,
    getClientById,
    addClient,
    editClient,
    changeClientStatus,
    deleteClient,
    renewClientMembership,
    updateAutoRenewal,
    getSubscriptionReport,
    updateFilters,
    changePage,
    resetFilters,
    clearError,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

// Custom hook to use the client context
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export default ClientContext;
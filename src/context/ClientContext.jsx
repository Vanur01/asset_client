// context/ClientContext.jsx - Complete Fixed Version

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
      return {
        ...state,
        error: action.payload,
        loading: false,
        initialLoading: false,
      };
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
    case ACTION_TYPES.UPDATE_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTION_TYPES.SET_STATS:
      return { ...state, stats: action.payload };
    case ACTION_TYPES.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    default:
      return state;
  }
};

// Helper functions
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getToken = () => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null" ? token : null;
};

// Create Context
const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);
  const activeControllerRef = useRef(null);
  const initialLoadDone = useRef(false);
  const isFetchingRef = useRef(false);

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  // Get all clients
  const getAllClients = useCallback(
    async (params = {}) => {
      const token = getToken();
      if (!token) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: "Authentication required. Please login again.",
        });
        dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
        return null;
      }

      // Prevent multiple simultaneous requests
      if (isFetchingRef.current) {
        return null;
      }

      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
      activeControllerRef.current = new AbortController();
      isFetchingRef.current = true;

      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      try {
        const page = params.page || state.pagination.page;
        const limit = params.limit || state.pagination.limit;
        const search =
          params.search !== undefined ? params.search : state.filters.search;
        const status =
          params.status !== undefined ? params.status : state.filters.status;
        const membershipPlan =
          params.membershipPlan !== undefined
            ? params.membershipPlan
            : state.filters.membershipPlan;
        const sortBy = params.sortBy || state.filters.sortBy;
        const sortOrder = params.sortOrder || state.filters.sortOrder;

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

        const url = `${API_BASE_URL}/clients?${queryParams.toString()}`;
        const headers = getAuthHeaders();

        const response = await axios.get(url, {
          headers,
          signal: activeControllerRef.current.signal,
        });

        const clientsData = response.data.clients || [];
        const paginationData = response.data.pagination || {};
        const summaryData = response.data.summary || {};

        // Update stats
        dispatch({
          type: ACTION_TYPES.SET_STATS,
          payload: {
            total: summaryData.totalCustomers || 0,
            active: summaryData.activeCustomers || 0,
            expiringSoon: summaryData.expiringSoon || 0,
            byPlan: summaryData.byPlan || {
              free: 0,
              standard: 0,
              premium: 0,
              enterprise: 0,
            },
          },
        });

        dispatch({
          type: ACTION_TYPES.SET_CLIENTS,
          payload: {
            clients: clientsData,
            total: paginationData.total || clientsData.length,
            pages: paginationData.pages || 1,
            page: paginationData.page || parseInt(page),
            limit: paginationData.limit || parseInt(limit),
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isCancel(error) || error.name === "CanceledError") {
          return null;
        }
        console.error("Get all clients error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch clients";
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        activeControllerRef.current = null;
        isFetchingRef.current = false;
      }
    },
    [
      state.pagination.page,
      state.pagination.limit,
      state.filters.search,
      state.filters.status,
      state.filters.membershipPlan,
      state.filters.sortBy,
      state.filters.sortOrder,
    ],
  );

  // Fetch clients with current filters
  const fetchClients = useCallback(
    async (params = {}) => {
      const token = getToken();
      if (!token) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: "Authentication required. Please login again.",
        });
        dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
        return null;
      }
      return await getAllClients(params);
    },
    [getAllClients],
  );

  // Get client by ID
  const getClientById = useCallback(async (clientId) => {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${clientId}`, {
        headers: getAuthHeaders(),
      });

      const clientData = response.data.client;
      dispatch({
        type: ACTION_TYPES.SET_SELECTED_CLIENT,
        payload: clientData,
      });

      return response.data;
    } catch (error) {
      console.error("Get client by ID error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch client";
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, []);

  // Create client
  const addClient = useCallback(
    async (clientData) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

      try {
        const response = await axios.post(
          `${API_BASE_URL}/clients`,
          clientData,
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchClients({ page: 1 });
        return response.data;
      } catch (error) {
        console.error("Create client error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create client";
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      }
    },
    [fetchClients],
  );

  // Update client
  const editClient = useCallback(
    async (clientId, updateData) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

      try {
        const response = await axios.put(
          `${API_BASE_URL}/clients/${clientId}`,
          updateData,
          {
            headers: getAuthHeaders(),
          },
        );

        if (
          state.selectedClient?._id === clientId ||
          state.selectedClient?.id === clientId
        ) {
          const updatedClient = response.data.client;
          dispatch({
            type: ACTION_TYPES.SET_SELECTED_CLIENT,
            payload: updatedClient,
          });
        }

        await fetchClients();
        return response.data;
      } catch (error) {
        console.error("Update client error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update client";
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      }
    },
    [state.selectedClient, fetchClients],
  );

  // Update client status
  const changeClientStatus = useCallback(
    async (clientId, status) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

      try {
        const response = await axios.patch(
          `${API_BASE_URL}/clients/${clientId}/status`,
          { status },
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchClients();

        if (
          state.selectedClient?._id === clientId ||
          state.selectedClient?.id === clientId
        ) {
          await getClientById(clientId);
        }

        return response.data;
      } catch (error) {
        console.error("Update client status error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update status";
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      }
    },
    [fetchClients, getClientById, state.selectedClient],
  );

  // Soft delete client
  const deleteClient = useCallback(
    async (clientId) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

      try {
        const response = await axios.delete(
          `${API_BASE_URL}/clients/${clientId}`,
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchClients();

        if (
          state.selectedClient?._id === clientId ||
          state.selectedClient?.id === clientId
        ) {
          dispatch({ type: ACTION_TYPES.SET_SELECTED_CLIENT, payload: null });
        }

        return response.data;
      } catch (error) {
        console.error("Delete client error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete client";
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      }
    },
    [fetchClients, state.selectedClient],
  );

  // Renew client membership
  const renewClientMembership = useCallback(
    async (clientId, extendDays) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: true });

      try {
        const response = await axios.put(
          `${API_BASE_URL}/clients/${clientId}`,
          { extendDays },
          {
            headers: getAuthHeaders(),
          },
        );

        await fetchClients();

        if (
          state.selectedClient?._id === clientId ||
          state.selectedClient?.id === clientId
        ) {
          await getClientById(clientId);
        }

        return response.data;
      } catch (error) {
        console.error("Renew membership error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to renew membership";
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: ACTION_TYPES.SET_ACTION_LOADING, payload: false });
      }
    },
    [fetchClients, getClientById, state.selectedClient],
  );

  // Update auto-renewal
  const updateAutoRenewal = useCallback(async (clientId, enabled) => {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/clients/${clientId}/auto-renewal`,
        { enabled },
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      console.error("Update auto-renewal error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update auto-renewal";
      throw new Error(errorMessage);
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
      payload: { page },
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
      },
    });
  }, []);

  // Initial load - only runs once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      const token = getToken();
      if (token) {
        fetchClients({ page: 1 });
      } else {
        dispatch({ type: ACTION_TYPES.SET_INITIAL_LOADING, payload: false });
      }
    }
  }, [fetchClients]);

  const value = {
    ...state,
    getAllClients,
    fetchClients,
    getClientById,
    addClient,
    editClient,
    changeClientStatus,
    deleteClient,
    renewClientMembership,
    updateAutoRenewal,
    updateFilters,
    changePage,
    resetFilters,
    clearError,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export default ClientContext;

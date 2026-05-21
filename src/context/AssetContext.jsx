import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AssetContext = createContext();

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) throw new Error("useAsset must be used within AssetProvider");
  return context;
};

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    );
  };

  const getUserRole = useCallback(() => {
    try {
      const token = getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || payload.userRole;
    } catch (error) {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user?.role;
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  }, []);

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Get all assets
  const getAllAssets = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== undefined &&
          filters[key] !== "" &&
          filters[key] !== null
        ) {
          params.append(key, filters[key]);
        }
      });

      const url = `${API_BASE_URL}/asset${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await axios.get(url, getAuthHeaders());

      if (response.data && response.data.success) {
        setAssets(response.data.assets || []);
        setPagination(
          response.data.pagination || {
            page: filters.page || 1,
            limit: filters.limit || 10,
            total: (response.data.assets || []).length,
            totalPages: 1,
          },
        );
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single asset
  const getAssetById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/asset/${id}`,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create asset (Admin only)
  const createAsset = useCallback(async (assetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/asset/add`,
        assetData,
        getAuthHeaders(),
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error creating asset:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create asset request (Team only)
  const createAssetRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/asset/request`,
        requestData,
        getAuthHeaders(),
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error creating asset request:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update asset
  const updateAsset = useCallback(async (id, assetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/asset/${id}`,
        assetData,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete asset
  const deleteAsset = useCallback(async (id, permanent = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/asset/${id}?permanent=${permanent}`,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clone asset - Fixed version
  // Clone asset - Fixed version with better error handling
  const cloneAsset = useCallback(async (id, cloneData = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Only send necessary data, avoid sending extra fields
      const payload = {
        cloneNote:
          cloneData.cloneNote ||
          `Cloned from asset on ${new Date().toLocaleDateString()}`,
      };

      const response = await axios.post(
        `${API_BASE_URL}/asset/${id}/clone`,
        payload,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      console.error("Error cloning asset:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to clone asset";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get asset clones
  const getAssetClones = useCallback(async (id, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/asset/${id}/clones?page=${page}&limit=${limit}`,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Link child assets
  const linkChildAssets = useCallback(async (id, childAssetIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/asset/${id}/link`,
        { childAssetIds },
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update asset status
  const updateAssetStatus = useCallback(async (id, status, reason = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/asset/${id}/status`,
        { status, reason },
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload asset images
  const uploadAssetImages = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/asset/${id}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete asset image
  const deleteAssetImage = useCallback(async (id, imageName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/asset/${id}/images/${imageName}`,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set primary image
  const setPrimaryImage = useCallback(async (id, imageName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/asset/${id}/images/${imageName}/primary`,
        {},
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    assets,
    loading,
    pagination,
    error,
    getAllAssets,
    getAssetById,
    createAsset,
    createAssetRequest,
    updateAsset,
    deleteAsset,
    cloneAsset,
    getAssetClones,
    linkChildAssets,
    updateAssetStatus,
    uploadAssetImages,
    deleteAssetImage,
    setPrimaryImage,
    userRole: getUserRole(),
  };

  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
};

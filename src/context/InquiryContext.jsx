// context/ContactInquiryContext.jsx
import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContexts";

const ContactInquiryContext = createContext();

export const useContactInquiry = () => {
  const context = useContext(ContactInquiryContext);
  if (!context) {
    throw new Error("useContactInquiry must be used within a ContactInquiryProvider");
  }
  return context;
};

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

export const ContactInquiryProvider = ({ children }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [error, setError] = useState(null);

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    const currentToken = token || localStorage.getItem("accessToken");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    };
  }, [token]);

  // Fetch all contact inquiries
  const fetchInquiries = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/getAllContact?page=${page}&limit=${limit}`,
        getAuthHeaders()
      );

      if (response.data.success) {
        setInquiries(response.data.pagination.contacts || []);
        setPagination({
          total: response.data.pagination.total || 0,
          page: response.data.pagination.page || 1,
          limit: response.data.pagination.limit || 10,
          totalPages: response.data.pagination.totalPages || 1,
        });
        return { success: true, data: response.data };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError(err.response?.data?.message || "Failed to fetch inquiries");
      return { success: false, error: err.response?.data?.message || "Failed to fetch inquiries" };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch single inquiry by ID
  const fetchInquiryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/getContactById/${id}`,
        getAuthHeaders()
      );

      if (response.data.success) {
        setSelectedInquiry(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      console.error("Error fetching inquiry:", err);
      setError(err.response?.data?.message || "Failed to fetch inquiry details");
      return { success: false, error: err.response?.data?.message || "Failed to fetch inquiry details" };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Delete inquiry by ID
  const deleteInquiry = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user/deleteContact/${id}`,
        getAuthHeaders()
      );

      if (response.data.success) {
        // Remove from local state
        setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      setError(err.response?.data?.message || "Failed to delete inquiry");
      return { success: false, error: err.response?.data?.message || "Failed to delete inquiry" };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Clear selected inquiry
  const clearSelectedInquiry = useCallback(() => {
    setSelectedInquiry(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ContactInquiryContext.Provider
      value={{
        inquiries,
        selectedInquiry,
        pagination,
        loading,
        error,
        fetchInquiries,
        fetchInquiryById,
        deleteInquiry,
        clearSelectedInquiry,
        clearError,
      }}
    >
      {children}
    </ContactInquiryContext.Provider>
  );
};
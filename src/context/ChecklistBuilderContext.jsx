// context/ChecklistBuilderContext.jsx - Fixed Version
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContexts";

const ChecklistBuilderContext = createContext();

export const useChecklistBuilder = () => {
  const context = useContext(ChecklistBuilderContext);
  if (!context) {
    throw new Error(
      "useChecklistBuilder must be used within ChecklistBuilderProvider",
    );
  }
  return context;
};

// Field type mapping for API
const FIELD_TYPE_MAP = {
  text_input: "text_input",
  textarea: "text_area",
  text: "text_input",
  email: "text_input",
  tel: "text_input",
  number: "text_input",
  dropdown: "dropdown",
  checkbox: "checkbox",
  rating: "rating",
  image: "image_upload",
  image_upload: "image_upload",
  signature: "signature",
  date_picker: "date_picker",
};

// Reverse mapping for display
const DISPLAY_FIELD_TYPE_MAP = {
  text_input: "text",
  text_area: "textarea",
  dropdown: "dropdown",
  checkbox: "checkbox",
  rating: "rating",
  image_upload: "image",
  signature: "signature",
  date_picker: "date_picker",
};

export const ChecklistBuilderProvider = ({ children }) => {
  const { get, post, put, del } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ─── Create Checklist ────────────────────────────────────────────────
  const createChecklist = useCallback(
    async (checklistData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post("/checklist", checklistData);
        if (response.success) {
          setSuccess("Checklist created successfully!");
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Get All Checklists ──────────────────────────────────────────────
  const getAllChecklists = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        let url = "/checklist";
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append("type", filters.type);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.page) queryParams.append("page", filters.page);
        if (filters.limit) queryParams.append("limit", filters.limit);
        if (queryParams.toString()) url += `?${queryParams.toString()}`;

        const response = await get(url);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch checklists";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [get],
  );

  // ─── Get Checklist by ID ─────────────────────────────────────────────
  const getChecklistById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await get(`/checklist/${id}`);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [get],
  );

  // ─── Update Checklist ────────────────────────────────────────────────
  const updateChecklist = useCallback(
    async (id, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await put(`/checklist/${id}`, updateData);
        if (response.success) {
          setSuccess("Checklist updated successfully!");
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [put],
  );

  // ─── Delete Checklist ────────────────────────────────────────────────
  const deleteChecklist = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await del(`/checklist/${id}`);
        if (response.success) {
          setSuccess("Checklist deleted successfully!");
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [del],
  );

  // ─── Clone Checklist ─────────────────────────────────────────────────
  const cloneChecklist = useCallback(
    async (id, newName) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post(`/checklist/clone/${id}`, { newName });
        if (response.success) {
          setSuccess("Checklist cloned successfully!");
          return { success: true, data: response };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to clone checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Import Checklist from Excel ─────────────────────────────────────
  // FIX: Removed hardcoded production URL and direct axios call with manual
  // token retrieval. Now uses the `post()` method from useAuth which:
  //   1. Always uses the correct API_BASE_URL
  //   2. Automatically injects the Authorization header
  //   3. Handles FormData correctly (removes Content-Type so browser sets boundary)
  //   4. Handles 401 → logout automatically via authRequest
  const importFromExcel = useCallback(
    async (file, checklistName = null) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("excelFile", file);
        if (checklistName) formData.append("name", checklistName);

        const response = await post("/checklist/import-excel", formData);

        if (response.success) {
          setSuccess("Checklist imported successfully!");
          return {
            success: true,
            data: response._doc || response.data || response,
          };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to import checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Get Global Checklists ───────────────────────────────────────────
  const getGlobalChecklists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get("/checklist/global");
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch global checklists";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [get]);

  // ─── Submit for Global Approval ──────────────────────────────────────
  const submitForGlobalApproval = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post(`/checklist/${id}/submit-for-approval`);
        if (response.success) {
          setSuccess("Checklist submitted for approval!");
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to submit for approval";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Approve Global Checklist (Super Admin only) ─────────────────────
  const approveGlobalChecklist = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post(`/checklist/${id}/approve`);
        if (response.success) {
          setSuccess("Checklist approved successfully!");
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to approve checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Reject Global Checklist (Super Admin only) ──────────────────────
  const rejectGlobalChecklist = useCallback(
    async (id, reason) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post(`/checklist/${id}/reject`, { reason });
        if (response.success) {
          setSuccess("Checklist rejected!");
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to reject checklist";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Assign Checklist to Admin (Super Admin only) ────────────────────
  const assignChecklistToAdmin = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post("/assignments/assign-to-admin", data);
        if (response.success) {
          setSuccess("Checklist assigned to admin successfully!");
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to assign checklist to admin";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Assign Checklist to Team Members (Admin only) ───────────────────
  const assignChecklistToTeam = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await post("/assignments/assign-to-team", data);
        if (response.success) {
          setSuccess("Checklist assigned to team members successfully!");
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to assign checklist to team";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // ─── Get Assignments ─────────────────────────────────────────────────
  const getAssignments = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        let url = "/assignments";
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.checklistId)
          queryParams.append("checklistId", filters.checklistId);
        if (filters.assignedTo)
          queryParams.append("assignedTo", filters.assignedTo);
        if (filters.page) queryParams.append("page", filters.page);
        if (filters.limit) queryParams.append("limit", filters.limit);
        if (queryParams.toString()) url += `?${queryParams.toString()}`;

        const response = await get(url);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch assignments";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [get],
  );

  // ─── Get Assignment by ID ────────────────────────────────────────────
  const getAssignmentById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await get(`/assignments/${id}`);
        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch assignment";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [get],
  );

  // ─── Update Assignment Status ────────────────────────────────────────
  const updateAssignmentStatus = useCallback(
    async (id, status, responseData = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await put(`/assignments/${id}/status`, {
          status,
          responseData,
        });
        if (response.success) {
          setSuccess("Assignment status updated!");
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update assignment status";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [put],
  );

  // ─── Field / Section converters ──────────────────────────────────────
  const convertUIToAPIField = useCallback(
    (uiField) => ({
      label: uiField.label,
      fieldType: FIELD_TYPE_MAP[uiField.type] || "text_input",
      isRequired: uiField.required || false,
      placeholder: uiField.placeholder || "",
      options: uiField.options || [],
      ratingMax: uiField.ratingMax || 5,
      checkboxItems: uiField.checkboxItems || [],
      order: uiField.order || 0,
      validationRules: {
        minLength: uiField.minLength || null,
        maxLength: uiField.maxLength || null,
        pattern: uiField.pattern || null,
      },
    }),
    [],
  );

  const convertAPIToUIField = useCallback(
    (apiField) => ({
      id: apiField._id || `field_${Date.now()}`,
      label: apiField.label,
      type: DISPLAY_FIELD_TYPE_MAP[apiField.fieldType] || "text",
      required: apiField.isRequired,
      placeholder: apiField.placeholder,
      options: apiField.options || [],
      ratingMax: apiField.ratingMax,
      checkboxItems: apiField.checkboxItems,
      order: apiField.order,
      minLength: apiField.validationRules?.minLength,
      maxLength: apiField.validationRules?.maxLength,
      pattern: apiField.validationRules?.pattern,
    }),
    [],
  );

  const convertUIToAPISection = useCallback(
    (section, order) => ({
      sectionTitle: section.sectionTitle,
      sectionDescription: section.sectionDescription || "",
      fields: section.fields.map((field, idx) =>
        convertUIToAPIField({ ...field, order: idx }),
      ),
      order,
    }),
    [convertUIToAPIField],
  );

  const convertAPIToUISection = useCallback(
    (apiSection) => ({
      id: apiSection._id,
      sectionTitle: apiSection.sectionTitle,
      sectionDescription: apiSection.sectionDescription || "",
      fields: apiSection.fields.map((field, idx) =>
        convertAPIToUIField({ ...field, order: idx }),
      ),
    }),
    [convertAPIToUIField],
  );

  const prepareChecklistData = useCallback(
    (name, description, type, category, sections, status = "draft") => ({
      name,
      description,
      type,
      category,
      status,
      sections: sections.map((section, idx) =>
        convertUIToAPISection(section, idx),
      ),
    }),
    [convertUIToAPISection],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    // State
    loading,
    error,
    success,

    // Checklist CRUD
    createChecklist,
    getAllChecklists,
    getChecklistById,
    updateChecklist,
    deleteChecklist,
    cloneChecklist,
    importFromExcel,

    // Global checklist workflow
    getGlobalChecklists,
    submitForGlobalApproval,
    approveGlobalChecklist,
    rejectGlobalChecklist,

    // Assignment APIs
    assignChecklistToAdmin,
    assignChecklistToTeam,
    getAssignments,
    getAssignmentById,
    updateAssignmentStatus,

    // Field / Section converters
    convertUIToAPIField,
    convertAPIToUIField,
    convertUIToAPISection,
    convertAPIToUISection,
    prepareChecklistData,
    clearMessages,
    FIELD_TYPE_MAP,
    DISPLAY_FIELD_TYPE_MAP,
  };

  return (
    <ChecklistBuilderContext.Provider value={value}>
      {children}
    </ChecklistBuilderContext.Provider>
  );
};

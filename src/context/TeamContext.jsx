// context/TeamContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContexts";
import axios from "axios";

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context;
};

const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

const getApiClient = (token) =>
  axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

export const TeamProvider = ({ children }) => {
  const { token, isAuthenticated, user } = useAuth();

  // Team state
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const [profile, setProfile] = useState(null);

  // Role state
  const [roles, setRoles] = useState([]);
  const [rolesPagination, setRolesPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Department state
  const [departments, setDepartments] = useState([]);
  const [departmentsPagination, setDepartmentsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Location state
  const [locations, setLocations] = useState([]);
  const [locationsPagination, setLocationsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Loading states
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);

  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    searchName: "",
    searchEmail: "",
    status: "all",
    role: "all",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Refs — never trigger re-renders
  const cacheRef = useRef({
    members: {},
    roles: null,
    departments: null,
    locations: null,
  });
  const initializedRef = useRef(false);
  const abortControllerRef = useRef(null);
  // Keep latest token/auth in a ref so callbacks don't go stale
  const authRef = useRef({ token, isAuthenticated });
  // KEY FIX: keep latest filters in a ref to avoid stale closures in fetchTeamMembers
  const filtersRef = useRef(filters);

  useEffect(() => {
    authRef.current = { token, isAuthenticated };
  }, [token, isAuthenticated]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ─── Utilities ────────────────────────────────────────────────────────────

  const getInitials = useCallback((firstName, lastName, email) => {
    if (firstName && lastName)
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "?";
  }, []);

  const transformMember = useCallback(
    (member) => {
      // Ensure we capture firstName and lastName correctly
      const firstName = member.firstName || "";
      const lastName = member.lastName || "";
      const email = member.email || "";

      // Create full name from firstName and lastName
      const fullName =
        firstName && lastName
          ? `${firstName} ${lastName}`.trim()
          : firstName || lastName || email?.split("@")[0] || "Unknown";

      return {
        id: member.id || member._id,
        _id: member._id || member.id,
        initials: getInitials(firstName, lastName, email),
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role:
          member.teamRoleDisplay || member.teamRole || member.role || "team",
        roleDisplay: member.roleDisplay || member.teamRoleDisplay,
        roleId: member.roleId || member.teamRoleId?._id,
        department: member.department || "",
        departmentId: member.departmentId?._id || member.departmentId,
        location: member.location || "",
        locationId: member.locationId?._id || member.locationId,
        phone: member.phone || "",
        assignedCount: member.assignedCount || member.assigned || 0,
        completedCount: member.completedCount || member.completed || 0,
        performanceScore:
          member.performanceScore || member.stats?.performanceScore || 0,
        performancePercentage:
          member.performance || member.performancePercentage || "0%",
        status: member.status || "inactive",
        joinDate: member.joinDate,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        certifications: member.certifications || [],
        monthlyPerformance: member.monthlyPerformance || [],
        stats: member.stats,
        organization: member.organization,
        adminId: member.adminId,
        address: member.address,
        bio: member.bio || "",
        lastLoginDate: member.lastLoginDate,
        lastActiveAt: member.lastActiveAt,
        teamRole: member.teamRole,
        customRole: member.customRole,
      };
    },
    [getInitials],
  );

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatJoinDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const diffDays = Math.ceil(
      Math.abs(new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const m = Math.floor(diffDays / 30);
      return `${m} month${m > 1 ? "s" : ""} ago`;
    }
    const y = Math.floor(diffDays / 365);
    return `${y} year${y > 1 ? "s" : ""} ago`;
  }, []);

  const getProfileInitials = useCallback(() => {
    if (profile?.firstName && profile?.lastName)
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    return profile?.email?.charAt(0).toUpperCase() || "?";
  }, [profile]);

  const getFullName = useCallback(() => {
    if (profile?.firstName && profile?.lastName)
      return `${profile.firstName} ${profile.lastName}`;
    return profile?.email?.split("@")[0] || "Team Member";
  }, [profile]);

  // ─── Profile ──────────────────────────────────────────────────────────────

  const fetchTeamProfile = useCallback(async () => {
    const { token: t, isAuthenticated: auth } = authRef.current;
    if (!auth || !t) return null;
    setLoading(true);
    try {
      const response = await getApiClient(t).get("/team/me/profile");
      if (response.data.success) {
        setProfile(response.data.profile);
        return response.data.profile;
      }
      return null;
    } catch (err) {
      console.error("Fetch team profile error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeamProfile = useCallback(async (profileData) => {
    const { token: t, isAuthenticated: auth } = authRef.current;
    if (!auth || !t) return { success: false, error: "Not authenticated" };
    setActionLoading(true);
    try {
      const response = await getApiClient(t).patch("/team/me/profile", {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        department: profileData.department,
      });
      if (response.data.success) {
        setProfile(response.data.profile);
        return {
          success: true,
          message: response.data.message || "Profile updated successfully",
        };
      }
      return {
        success: false,
        error: response.data.message || "Failed to update profile",
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update profile",
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (currentPassword, newPassword, confirmPassword) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      if (newPassword !== confirmPassword)
        return { success: false, error: "New passwords do not match" };
      if (newPassword.length < 6)
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).post(
          "/team/me/change-password",
          { currentPassword, newPassword },
        );
        if (response.data.success)
          return {
            success: true,
            message: response.data.message || "Password changed successfully",
          };
        return {
          success: false,
          error: response.data.message || "Failed to change password",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to change password",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  // ─── Roles ────────────────────────────────────────────────────────────────

  const fetchRoles = useCallback(async (params = {}, forceRefresh = false) => {
    const { token: t, isAuthenticated: auth } = authRef.current;
    if (!auth || !t) return;
    if (!forceRefresh && cacheRef.current.roles) {
      setRoles(cacheRef.current.roles.data);
      setRolesPagination(cacheRef.current.roles.pagination);
      return;
    }
    setRolesLoading(true);
    try {
      const query = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 100,
        ...(params.search && { search: params.search }),
      });
      const response = await getApiClient(t).get(`/role?${query}`);
      if (response.data.success) {
        const pagination = response.data.pagination || {
          page: 1,
          limit: 100,
          total: response.data.roles.length,
          pages: 1,
        };
        setRoles(response.data.roles);
        setRolesPagination(pagination);
        cacheRef.current.roles = { data: response.data.roles, pagination };
      }
    } catch (err) {
      console.error("Fetch roles error:", err);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const createRole = useCallback(
    async (roleData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).post("/role", {
          name: roleData.name,
          description: roleData.description,
          isActive: roleData.isActive !== false,
        });
        if (response.data.success) {
          cacheRef.current.roles = null;
          await fetchRoles({}, true);
          return {
            success: true,
            message: response.data.message || "Role created successfully",
            role: response.data.role,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to create role",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to create role",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchRoles],
  );

  const updateRole = useCallback(
    async (roleId, roleData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).put(`/role/${roleId}`, roleData);
        if (response.data.success) {
          cacheRef.current.roles = null;
          await fetchRoles({}, true);
          return {
            success: true,
            message: response.data.message || "Role updated successfully",
            role: response.data.role,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to update role",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to update role",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchRoles],
  );

  const deleteRole = useCallback(
    async (roleId) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).delete(`/role/${roleId}`);
        if (response.data.success) {
          cacheRef.current.roles = null;
          await fetchRoles({}, true);
          return {
            success: true,
            message: response.data.message || "Role deleted successfully",
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to delete role",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to delete role",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchRoles],
  );

  // ─── Departments ──────────────────────────────────────────────────────────

  const fetchDepartments = useCallback(
    async (params = {}, forceRefresh = false) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return;
      if (!forceRefresh && cacheRef.current.departments) {
        setDepartments(cacheRef.current.departments.data);
        setDepartmentsPagination(cacheRef.current.departments.pagination);
        return;
      }
      setDepartmentsLoading(true);
      try {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.search && { search: params.search }),
        });
        const response = await getApiClient(t).get(`/department?${query}`);
        if (response.data.success) {
          const pagination = response.data.pagination || {
            page: 1,
            limit: 100,
            total: response.data.departments.length,
            pages: 1,
          };
          setDepartments(response.data.departments);
          setDepartmentsPagination(pagination);
          cacheRef.current.departments = {
            data: response.data.departments,
            pagination,
          };
        }
      } catch (err) {
        console.error("Fetch departments error:", err);
      } finally {
        setDepartmentsLoading(false);
      }
    },
    [],
  );

  const createDepartment = useCallback(
    async (deptData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).post("/department", {
          name: deptData.name,
          description: deptData.description,
          isActive: deptData.isActive !== false,
        });
        if (response.data.success) {
          cacheRef.current.departments = null;
          await fetchDepartments({}, true);
          return {
            success: true,
            message: response.data.message || "Department created successfully",
            department: response.data.department,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to create department",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to create department",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDepartments],
  );

  const updateDepartment = useCallback(
    async (deptId, deptData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).put(
          `/department/${deptId}`,
          deptData,
        );
        if (response.data.success) {
          cacheRef.current.departments = null;
          await fetchDepartments({}, true);
          return {
            success: true,
            message: response.data.message || "Department updated successfully",
            department: response.data.department,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to update department",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to update department",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDepartments],
  );

  const deleteDepartment = useCallback(
    async (deptId) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).delete(`/department/${deptId}`);
        if (response.data.success) {
          cacheRef.current.departments = null;
          await fetchDepartments({}, true);
          return {
            success: true,
            message: response.data.message || "Department deleted successfully",
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to delete department",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to delete department",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDepartments],
  );

  // ─── Locations ────────────────────────────────────────────────────────────

  const fetchLocations = useCallback(
    async (params = {}, forceRefresh = false) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return;
      if (!forceRefresh && cacheRef.current.locations) {
        setLocations(cacheRef.current.locations.data);
        setLocationsPagination(cacheRef.current.locations.pagination);
        return;
      }
      setLocationsLoading(true);
      try {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.search && { search: params.search }),
        });
        const response = await getApiClient(t).get(`/location?${query}`);
        if (response.data.success) {
          const pagination = response.data.pagination || {
            page: 1,
            limit: 100,
            total: response.data.locations.length,
            pages: 1,
          };
          setLocations(response.data.locations);
          setLocationsPagination(pagination);
          cacheRef.current.locations = {
            data: response.data.locations,
            pagination,
          };
        }
      } catch (err) {
        console.error("Fetch locations error:", err);
      } finally {
        setLocationsLoading(false);
      }
    },
    [],
  );

  const createLocation = useCallback(
    async (locData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).post("/location", {
          name: locData.name,
          description: locData.description,
          isActive: locData.isActive !== false,
        });
        if (response.data.success) {
          cacheRef.current.locations = null;
          await fetchLocations({}, true);
          return {
            success: true,
            message: response.data.message || "Location created successfully",
            location: response.data.location,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to create location",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to create location",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchLocations],
  );

  const updateLocation = useCallback(
    async (locId, locData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).put(
          `/location/${locId}`,
          locData,
        );
        if (response.data.success) {
          cacheRef.current.locations = null;
          await fetchLocations({}, true);
          return {
            success: true,
            message: response.data.message || "Location updated successfully",
            location: response.data.location,
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to update location",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to update location",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchLocations],
  );

  const deleteLocation = useCallback(
    async (locId) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).delete(`/location/${locId}`);
        if (response.data.success) {
          cacheRef.current.locations = null;
          await fetchLocations({}, true);
          return {
            success: true,
            message: response.data.message || "Location deleted successfully",
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to delete location",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to delete location",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchLocations],
  );

  // ─── Team Members ─────────────────────────────────────────────────────────

  const fetchTeamMembers = useCallback(
    async (overrides = {}, forceRefresh = false) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return;

      // Cancel any in-flight request
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      // Always merge overrides with the LATEST filters from ref (never stale)
      const activeFilters = { ...filtersRef.current, ...overrides };
      const cacheKey = JSON.stringify(activeFilters);

      if (!forceRefresh && cacheRef.current.members[cacheKey]) {
        const cached = cacheRef.current.members[cacheKey];
        setTeamMembers(cached.members);
        setPagination(cached.pagination);
        setInitialLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(activeFilters.page || 1),
          limit: String(activeFilters.limit || 10),
        });

        // Support both unified search and individual field searches
        if (activeFilters.search) params.append("search", activeFilters.search);
        if (activeFilters.searchName)
          params.append("name", activeFilters.searchName);
        if (activeFilters.searchEmail)
          params.append("email", activeFilters.searchEmail);
        if (activeFilters.status && activeFilters.status !== "all")
          params.append("status", activeFilters.status);
        if (activeFilters.role && activeFilters.role !== "all")
          params.append("role", activeFilters.role);

        const response = await getApiClient(t).get(`/team?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        if (response.data.success) {
          const transformedMembers = (response.data.members || []).map(
            transformMember,
          );
          const pag = {
            page: response.data.pagination?.page || 1,
            limit: response.data.pagination?.limit || 10,
            total: response.data.pagination?.total || 0,
            pages: response.data.pagination?.pages || 1,
          };

          cacheRef.current.members[cacheKey] = {
            members: transformedMembers,
            pagination: pag,
          };
          setTeamMembers(transformedMembers);
          setPagination(pag);
          // Sync filters state with what was actually fetched
          setFilters((prev) => ({ ...prev, ...activeFilters, page: pag.page }));
          setError(null);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          console.error("Fetch team members error:", err);
          setError(
            err.response?.data?.message || "Failed to fetch team members",
          );
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [transformMember],
  );

  const fetchTeamMemberById = useCallback(
    async (memberId) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return null;
      setLoading(true);
      try {
        const response = await getApiClient(t).get(`/team/${memberId}`);
        if (response.data.success) {
          const m = transformMember(response.data.member);
          setSelectedMember(m);
          return m;
        }
        return null;
      } catch (err) {
        console.error("Fetch member by ID error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch member details",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [transformMember],
  );

  const fetchTeamMemberDetails = useCallback(async (memberId) => {
    const { token: t, isAuthenticated: auth } = authRef.current;
    if (!auth || !t) return null;
    setLoading(true);
    try {
      const response = await getApiClient(t).get(`/team/${memberId}/details`);
      if (response.data.success) {
        setSelectedMemberDetails(response.data.member);
        return response.data.member;
      }
      return null;
    } catch (err) {
      console.error("Fetch member details error:", err);
      setError(err.response?.data?.message || "Failed to fetch member details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTeamMembers = useCallback(
    async (searchTerm) => {
      await fetchTeamMembers({ search: searchTerm, page: 1 }, true);
    },
    [fetchTeamMembers],
  );

  const addTeamMember = useCallback(
    async (memberData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };

      setActionLoading(true);
      setError(null);

      try {
        console.log("Adding team member with data:", memberData);

        const response = await getApiClient(t).post("/team", {
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          email: memberData.email,
          password: memberData.password,
          phone: memberData.phone || "",
          roleId: memberData.roleId,
          departmentId: memberData.departmentId,
          locationId: memberData.locationId,
          teamRole: memberData.teamRole || "inspector",
          bio: memberData.bio || "",
        });

        console.log("API Response:", response.data);

        if (response.data.success) {
          // Clear cache and refresh team members
          cacheRef.current.members = {};
          await fetchTeamMembers({ page: 1 }, true);

          return {
            success: true,
            message: response.data.message || "Team member added successfully",
            member: response.data.member,
          };
        }

        return {
          success: false,
          error: response.data.message || "Failed to add team member",
        };
      } catch (err) {
        console.error("Add team member error:", err);
        console.error("Error response:", err.response?.data);

        return {
          success: false,
          error:
            err.response?.data?.message ||
            err.message ||
            "Failed to add team member",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTeamMembers],
  );

  const updateTeamMember = useCallback(
    async (memberId, updateData) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).put(
          `/team/${memberId}`,
          updateData,
        );
        if (response.data.success) {
          cacheRef.current.members = {};
          await fetchTeamMembers({}, true);
          setSelectedMemberDetails((prev) => {
            if (prev && (prev._id === memberId || prev.id === memberId))
              return { ...prev, ...updateData };
            return prev;
          });
          return {
            success: true,
            message:
              response.data.message || "Team member updated successfully",
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to update team member",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to update team member",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTeamMembers],
  );

  const updateMemberStatus = useCallback(
    async (memberId, status) => {
      return await updateTeamMember(memberId, { status });
    },
    [updateTeamMember],
  );

  const deleteTeamMember = useCallback(
    async (memberId, permanent = true) => {
      const { token: t, isAuthenticated: auth } = authRef.current;
      if (!auth || !t) return { success: false, error: "Not authenticated" };
      setActionLoading(true);
      try {
        const response = await getApiClient(t).delete(
          `/team/${memberId}?permanent=${permanent}`,
        );
        if (response.data.success) {
          cacheRef.current.members = {};
          await fetchTeamMembers({ page: 1 }, true);
          setSelectedMemberDetails((prev) => {
            if (prev && (prev._id === memberId || prev.id === memberId))
              return null;
            return prev;
          });
          return {
            success: true,
            message:
              response.data.message || "Team member deleted successfully",
          };
        }
        return {
          success: false,
          error: response.data.message || "Failed to delete team member",
        };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Failed to delete team member",
        };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTeamMembers],
  );

  const updateFilters = useCallback(
    async (newFilters) => {
      // Merge new filters on top of current ref value, reset to page 1
      const updatedFilters = { ...filtersRef.current, ...newFilters, page: 1 };
      // Update ref immediately so fetchTeamMembers sees the latest values
      filtersRef.current = updatedFilters;
      setFilters(updatedFilters);
      await fetchTeamMembers(updatedFilters, true);
    },
    [fetchTeamMembers],
  );

  const changePage = useCallback(
    async (newPage) => {
      await fetchTeamMembers({ page: newPage }, true);
    },
    [fetchTeamMembers],
  );

  const clearError = useCallback(() => setError(null), []);

  const clearCache = useCallback(() => {
    cacheRef.current = {
      members: {},
      roles: null,
      departments: null,
      locations: null,
    };
  }, []);

  // ─── Initial data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;
    initializedRef.current = true;

    const isTeamMember = user?.role === "team";

    // Fire all fetches immediately
    fetchTeamMembers({ page: 1 }, true);
    fetchRoles({}, true);
    fetchDepartments({}, true);
    fetchLocations({}, true);
    if (isTeamMember) fetchTeamProfile();
  }, [isAuthenticated, token]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const value = {
    // State
    teamMembers,
    selectedMember,
    selectedMemberDetails,
    profile,
    loading,
    initialLoading,
    actionLoading,
    error,
    filters,
    pagination,
    // Role state
    roles,
    rolesPagination,
    rolesLoading,
    // Department state
    departments,
    departmentsPagination,
    departmentsLoading,
    // Location state
    locations,
    locationsPagination,
    locationsLoading,
    // Profile functions
    fetchTeamProfile,
    updateTeamProfile,
    changePassword,
    // Profile utilities
    formatDate,
    formatJoinDate,
    formatDateTime,
    getFullName,
    getInitials: getProfileInitials,
    // Role functions
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    // Department functions
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    // Location functions
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    // Team functions
    fetchTeamMembers,
    fetchTeamMemberById,
    fetchTeamMemberDetails,
    searchTeamMembers,
    addTeamMember,
    updateTeamMember,
    updateMemberStatus,
    deleteTeamMember,
    updateFilters,
    changePage,
    setSelectedMember,
    clearError,
    clearCache,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

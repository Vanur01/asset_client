// context/AuthContexts.jsx - Fixed Version

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API base URL
const API_BASE_URL = "https://assset-management-backend-4.onrender.com/api/v1";

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userType");
  localStorage.removeItem("rememberMe");
  localStorage.removeItem("rememberedEmail");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      console.log("Initializing authentication...");
      const storedUser = localStorage.getItem("user");
      const storedToken =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const storedUserType = localStorage.getItem("userType");

      const isValidUser =
        storedUser && storedUser !== "undefined" && storedUser !== "null";
      const isValidToken =
        storedToken && storedToken !== "undefined" && storedToken !== "null";

      if (isValidUser && isValidToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Found stored user:", parsedUser.email);
          setUser(parsedUser);
          setToken(storedToken);
          setUserType(storedUserType || parsedUser.role);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          clearAuthData();
        }
      } else {
        console.log("No stored auth found");
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    console.log("Attempting login for:", email);
    try {
      const tempApi = axios.create({
        baseURL: API_BASE_URL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const response = await tempApi.post("/user/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (
        response.data.success &&
        response.data.user &&
        response.data.accessToken
      ) {
        const userData = response.data.user;
        const accessToken = response.data.accessToken;

        // Transform user data based on role
        let transformedUser = {};
        let userRoleType = "";
        let redirectPath = "/admin";

        if (userData.role === "super_admin") {
          transformedUser = {
            id: userData.id,
            _id: userData.id,
            email: userData.email,
            role: "super_admin",
            backendRole: userData.role,
            name: userData.name,
            permissions: userData.permissions || [],
          };
          userRoleType = "super_admin";
          redirectPath = "/admin";
        } else if (userData.role === "admin") {
          transformedUser = {
            id: userData.id,
            _id: userData.id,
            email: userData.email,
            role: "admin",
            backendRole: userData.role,
            name: userData.customerName || userData.name,
            customerName: userData.customerName,
            membershipPlan: userData.membershipPlan,
            daysRemaining: userData.daysRemaining,
            usagePercentage: userData.usagePercentage,
            licenseLimit: userData.licenseLimit,
            usersUsed: userData.usersUsed,
            phone: userData.phone,
            website: userData.website,
            address: userData.address,
            settings: userData.settings,
          };
          userRoleType = "admin";
          redirectPath = "/admin";
        } else if (userData.role === "team") {
          transformedUser = {
            id: userData.id,
            _id: userData.id,
            email: userData.email,
            role: "team",
            backendRole: userData.role,
            name:
              userData.fullName || `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: userData.fullName,
            initials: userData.initials,
            department: userData.department,
            location: userData.location,
            adminId: userData.adminId,
            teamRole: userData.teamRole,
            roleDisplay: userData.roleDisplay,
            stats: userData.stats,
            permissions: userData.permissions || [],
          };
          userRoleType = "team";
          redirectPath = "/team";
        }

        // Store in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(transformedUser));
        localStorage.setItem("userType", userRoleType);

        // Set state
        setToken(accessToken);
        setUser(transformedUser);
        setUserType(userRoleType);

        console.log("Login successful, redirecting to:", redirectPath);

        return {
          success: true,
          role: userRoleType,
          userType: userRoleType,
          user: transformedUser,
          token: accessToken,
          redirectPath,
          message: response.data.message || "Login successful",
        };
      }

      return {
        success: false,
        error: response.data.message || "Invalid response from server",
      };
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        return {
          success: false,
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Invalid credentials",
        };
      } else if (error.request) {
        return {
          success: false,
          error:
            "Unable to connect to server. Please check if the backend is running.",
        };
      } else {
        return {
          success: false,
          error: "An error occurred during login. Please try again.",
        };
      }
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    console.log("Logging out...");
    try {
      const currentToken =
        token ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");
      if (
        currentToken &&
        currentToken !== "undefined" &&
        currentToken !== "null"
      ) {
        await axios.post(
          `${API_BASE_URL}/user/auth/logout`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentToken}`,
            },
            withCredentials: true,
          },
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setToken(null);
      setUser(null);
      setUserType(null);
      console.log("Logout complete");
    }
  }, [token]);

  // Helper functions
  const getUserRole = () => user?.role || null;
  const getUserType = () => userType;
  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);
  const isSuperAdmin = () => user?.role === "super_admin";
  const isAdmin = () => user?.role === "admin";
  const isTeam = () => user?.role === "team";

  // ─── FIX 1: authRequest now uses axios() directly ────────────────────
  // Previously stored `api` (an axios instance) was being called as
  // `requestApi(config)` which throws "requestApi is not a function".
  // Axios instances must be called via `.request(config)` or you can
  // call the top-level `axios(config)` directly — we do the latter here
  // to also eliminate the stale-token closure problem in the interceptor.
  const authRequest = useCallback(
    async (method, url, data = null, customConfig = {}) => {
      const currentToken =
        token ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!currentToken) {
        throw new Error("No authentication token available");
      }

      // Clean up URL to avoid double slashes
      const cleanUrl = url.startsWith("/") ? url : `/${url}`;
      console.log(`Making ${method} request to: ${cleanUrl}`);

      try {
        // ─── FIX 2: Build headers carefully so Authorization is never lost ──
        const headers = {
          "Content-Type": "application/json",
          ...customConfig.headers, // caller overrides come first
          Authorization: `Bearer ${currentToken}`, // token always wins
        };

        // ─── FIX 3: FormData — remove Content-Type so browser sets boundary ─
        if (data instanceof FormData) {
          delete headers["Content-Type"];
        }

        // ─── FIX 4: Only attach `data` for mutating methods or FormData ──────
        const isMutating = ["post", "put", "patch"].includes(
          method.toLowerCase(),
        );
        const shouldAttachData =
          data !== null && (isMutating || data instanceof FormData);

        const config = {
          method: method.toLowerCase(),
          url: `${API_BASE_URL}${cleanUrl}`,
          headers,
          withCredentials: true,
          // Spread remaining customConfig keys (e.g. params, timeout)
          // but exclude `headers` since we already merged them above
          ...Object.fromEntries(
            Object.entries(customConfig).filter(([k]) => k !== "headers"),
          ),
          ...(shouldAttachData && { data }),
        };

        // ✅ Use top-level axios() — works correctly as a function
        const response = await axios(config);
        console.log(`Response from ${cleanUrl}:`, response.status);
        return response.data;
      } catch (error) {
        console.error(`Auth request error (${method} ${url}):`, error);

        if (error.response?.status === 401) {
          console.log("Token expired or invalid, logging out...");
          logout();
        }

        throw error;
      }
    },
    [token, logout], // ─── FIX 5: removed `api` dependency (no longer used) ──
  );

  // Convenience methods for common HTTP methods
  const get = useCallback(
    async (url, config = {}) => authRequest("GET", url, null, config),
    [authRequest],
  );

  const post = useCallback(
    async (url, data = null, config = {}) =>
      authRequest("POST", url, data, config),
    [authRequest],
  );

  const put = useCallback(
    async (url, data = null, config = {}) =>
      authRequest("PUT", url, data, config),
    [authRequest],
  );

  const patch = useCallback(
    async (url, data = null, config = {}) =>
      authRequest("PATCH", url, data, config),
    [authRequest],
  );

  const del = useCallback(
    async (url, config = {}) => authRequest("DELETE", url, null, config),
    [authRequest],
  );

  // Check if backend is reachable
  const checkBackendStatus = useCallback(async () => {
    try {
      const response = await axios.options(`${API_BASE_URL}/user/auth/login`, {
        timeout: 5000,
        validateStatus: (status) =>
          status === 200 || status === 404 || status === 405,
      });
      return { reachable: true, status: response.status };
    } catch (error) {
      console.warn("Backend not reachable:", error.message);
      return { reachable: false, error: error.message };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      token,
      loading,
      userType,
      isAuthenticated:
        !!user && !!token && token !== "undefined" && token !== "null",
      getUserRole,
      getUserType,
      hasRole,
      hasAnyRole,
      isSuperAdmin,
      isAdmin,
      isTeam,
      authRequest,
      get,
      post,
      put,
      patch,
      delete: del,
      checkBackendStatus,
    }),
    [
      user,
      token,
      loading,
      userType,
      authRequest,
      get,
      post,
      put,
      patch,
      del,
      logout,
      checkBackendStatus,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

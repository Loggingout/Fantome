import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../../utils/api";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  role: string | null;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(() => {
    // If we already have a cached user AND a token, render immediately from cache.
    // The background /auth/me call will still verify and log out if the token is invalid.
    const hasCachedUser = !!localStorage.getItem("user");
    const hasToken = !!localStorage.getItem("token");
    return !(hasCachedUser && hasToken);
  });

  // Load user if token exists
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");

        // Backend returns: { success, employee }
        const employee = res.data.employee;

        setUser(employee);
        localStorage.setItem("user", JSON.stringify(employee));
      } catch {
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGIN FUNCTION (fixed)
  const login = async (email: string, password: string) => {
    try {
      // Backend expects: { email, password }
      const res = await api.post("/auth/login", { email, password });

      const { token, employee } = res.data;

      // Save token
      setAuthToken(token);

      // Save user
      setUser(employee);
      localStorage.setItem("user", JSON.stringify(employee));

      return { success: true, user: employee };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // LOGOUT
  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (err: any) {
      console.warn("Logout error:", err.message);
    }

    clearAuthData();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext) as UserContextType;

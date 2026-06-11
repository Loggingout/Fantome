import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../../utils/api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // Load user on refresh if token exists
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGIN
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });

      const { token, user } = res.data;

      setAuthToken(token);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
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

export const useUser = () => useContext(UserContext);

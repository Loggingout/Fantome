import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken, clearAuthData, getAuthToken } from "../../utils/api";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (username: string, password: string) => Promise<any>;
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

  const [loading, setLoading] = useState(true);

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
      } catch {
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, user } = res.data;

      setAuthToken(token);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

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

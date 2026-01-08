import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
interface User {
  id: string;
  email: string;
  name: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // restore login from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("resikplus_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post("/auth/login/", { email, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      const userData: User = res.data.user;
      setUser(userData);
      localStorage.setItem("resikplus_user", JSON.stringify(userData));
      return { success: true };
    }
    catch (error: any) {
      return { success: false, error: error.response?.data?.detail || "Email atau password salah" };
    }
  };

  const logout = () => {
    setUser(null);
    const navigate = useNavigate();
    localStorage.removeItem("resikplus_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");  
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

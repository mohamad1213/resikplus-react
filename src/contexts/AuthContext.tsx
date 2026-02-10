import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  is_staff?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users removed


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("resikplus_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.post("/accounts/auth/login/", { email, password });

      const { access, refresh, user } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("resikplus_user", JSON.stringify(user));

      setUser(user);
      api.defaults.headers.Authorization = `Bearer ${access}`;

      return { success: true };
    } catch (error: any) {
      console.error("Login Failed:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Email atau password salah"
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("resikplus_user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    api.defaults.headers.Authorization = "";
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

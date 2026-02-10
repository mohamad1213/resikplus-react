import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  id: number;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
};

type LoginResult = {
  success: boolean;
  user?: User;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithGoogle: (token: string) => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveAuth = (access: string, refresh: string, user: User) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setUser(user);
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await api.post("/auth/login/", { email, password });

      const { access, refresh, user } = res.data;

      saveAuth(access, refresh, user);

      return { success: true, user };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.detail || "Login gagal",
      };
    }
  };

  const loginWithGoogle = async (token: string): Promise<LoginResult> => {
    try {
      const res = await api.post("/auth/google/", { token });

      const { access, refresh, user } = res.data;

      saveAuth(access, refresh, user);

      return { success: true, user };
    } catch {
      return { success: false, error: "Login Google gagal" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    // ⛔ jangan decode token
    // ⛔ jangan set user dari JWT
    // ✅ user diambil dari backend (profile API)
    if (access && refresh) {
      api
        .get("/auth/me/")
        .then((res) => setUser(res.data))
        .catch(logout)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

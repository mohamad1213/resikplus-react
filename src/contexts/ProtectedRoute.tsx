import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "customer";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/unauthorized" />;

  return <>{children}</>; // Fragment biar JSX valid
};

export default ProtectedRoute;

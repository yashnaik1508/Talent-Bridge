// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { authToken, role } = useAuth();

  // Not logged in → Login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided → check access
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    // Redirect unauthorized users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

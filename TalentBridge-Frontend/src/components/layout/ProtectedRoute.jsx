import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { authToken, role } = useAuth();

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

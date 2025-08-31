import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: ("Admin" | "User")[]; // allow multiple roles
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/products" replace />; // redirect to safe page
  }

  return children;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function RoleGuard({ children, allowedRoles }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

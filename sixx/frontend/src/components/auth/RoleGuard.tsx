import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const userContext = useUser();

  if (!userContext) {
    return <p>Loading...</p>;
  }

  const { user } = userContext;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

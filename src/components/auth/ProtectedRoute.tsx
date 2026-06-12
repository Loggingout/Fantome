import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userContext = useUser();

  // If context is not ready yet
  if (!userContext) {
    return <p>Loading...</p>;
  }

  const { user } = userContext;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { ReactNode, ReactElement } from "react";

interface Props {
  children: ReactNode;
}

const CompleteProfileRoute = ({ children }: Props): ReactElement => {
  const { isAuthenticated, requiresProfileCompletion, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!requiresProfileCompletion) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default CompleteProfileRoute;

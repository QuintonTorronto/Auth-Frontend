import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { ReactNode } from "react";

interface Props {
  children: JSX.Element;
}

export default function CompleteProfileRoute({ children }: Props): JSX.Element {
  const { isAuthenticated, requiresProfileCompletion, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!requiresProfileCompletion) return <Navigate to="/dashboard" replace />;

  return children;
}

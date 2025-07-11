import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./auth/useAuth";
import api from "./api/axios";
import Hero from "./pages/Hero";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";
import CompleteProfileRoute from "./routes/CompleteProfileRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AxiosError } from "axios";

export default function App() {
  const setAuthenticated = useAuth((state) => state.setAuthenticated);
  const setRequiresProfileCompletion = useAuth(
    (state) => state.setRequiresProfileCompletion
  );
  const setLoading = useAuth((state) => state.setLoading);

  useEffect(() => {
    const checkAuth = async () => {
      const timeout = setTimeout(() => {
        console.warn("Auth check timeout fallback triggered");
        setLoading(false);
      }, 10000);

      try {
        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken, requiresProfileCompletion } = res.data ?? {};
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          setAuthenticated(true);
          setRequiresProfileCompletion(!!requiresProfileCompletion);
        } else {
          setAuthenticated(false);
          setRequiresProfileCompletion(false);
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(
          "Refresh error:",
          error.response?.data?.message || error.message
        );
        setAuthenticated(false);
        setRequiresProfileCompletion(false);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuthenticated, setRequiresProfileCompletion, setLoading]);

  return (
    <>
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/complete-profile"
          element={
            <CompleteProfileRoute>
              <CompleteProfile />
            </CompleteProfileRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

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
        const { accessToken } = res.data;

        localStorage.setItem("accessToken", accessToken);

        setAuthenticated(true);

        setRequiresProfileCompletion(
          res.data.requiresProfileCompletion ?? false
        );
      } catch (err) {
        console.error("Refresh error:", err.response?.data || err.message);
        setAuthenticated(false);
        setRequiresProfileCompletion(false); // fallback if unauthenticated
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

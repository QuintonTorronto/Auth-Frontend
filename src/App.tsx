import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Hero from "./pages/Hero";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./auth/useAuth";
import api from "./api/axios";

export default function App() {
  const setAuthenticated = useAuth((state) => state.setAuthenticated);
  const setLoading = useAuth((state) => state.setLoading);
  useEffect(() => {
    const checkAuth = async () => {
      const timeout = setTimeout(() => {
        console.warn("Auth check timeout fallback triggered");
        setLoading(false);
      }, 10000);

      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        setAuthenticated(true);
      } catch (err) {
        console.error("Refresh error:", err.response?.data || err.message);
        setAuthenticated(false);
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
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
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

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import api from "../../../api/axios";

export default function Header() {
  const navigate = useNavigate();
  const setAuthenticated = useAuth((state) => state.setAuthenticated);
  const setRequiresProfileCompletion = useAuth(
    (state) => state.setRequiresProfileCompletion
  );

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      setAuthenticated(false);
      setRequiresProfileCompletion(false);
      navigate("/login");
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 mb-6 bg-white">
      <img src="/Onlylogo.svg" alt="Logo" className="h-6 w-6 mr-2" />
      <button
        onClick={() => navigate("/dashboard")}
        className="text-xl font-semibold text-gray-800"
      >
        Dashboard
      </button>
      <nav className="space-x-4">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}

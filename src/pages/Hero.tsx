import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight">
        Welcome, <span className="text-blue-600">Recruitment</span> Team
      </h1>
      <p className="text-lg text-center text-gray-600 max-w-2xl mb-10">
        Explore a production-ready, full-stack application built with secure
        authentication, modern UI/UX, reusable components, protected routes, and
        seamless user flow.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow"
        >
          Sign In
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold mb-3">GitHub Repository</h3>
          <div className="flex flex-col space-y-2">
            <a
              href="https://github.com/QuintonTorronto/Auth-Frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <FaGithub /> Frontend Repository
            </a>
            <a
              href="https://github.com/QuintonTorronto/Auth-Backend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <FaGithub /> Backend Repository
            </a>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold mb-3">Tech Stack</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Frontend: React + TypeScript + Tailwind CSS</li>
            <li>Backend: Node.js + NestJS + MongoDB</li>
            <li>Auth: Google OAuth, JWT, OTP</li>
            <li>State: Zustand, React Hook Form, Zod</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold mb-3">Authentication Flows</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Google OAuth login</li>
            <li>OTP-based login (OAuth users can also sign in via OTP)</li>
            <li>Password login</li>
            <li>Forgot Password (OTP verification + password reset)</li>
            <li>Secure cookies, token refresh & guards</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Form validation with Zod + React Hook Form</li>
            <li>Reusable UI components (Input, Button, etc.)</li>
            <li>Protected routes with conditional redirection</li>
            <li>Clean, modular code structure</li>
            <li>Profile completion flow post-auth</li>
          </ul>
        </div>
      </div>

      <footer className="mt-16 text-center">
        <p className="text-normal text-gray-500">Developer: Aakarsh Saxena</p>
        <p className="text-normal text-gray-500">
          📧 aakarsh.s1@outlook.com | 📞 +91 8882871850
        </p>
      </footer>
    </div>
  );
}

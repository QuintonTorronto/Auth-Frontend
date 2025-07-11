import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormValues {
  otp: string;
  newPassword: string;
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Access denied. Please start from Forgot Password.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const onSubmit = async (data: FormValues) => {
    if (!email) return;

    setLoading(true);
    try {
      const payload = { email, ...data };
      await api.post("/auth/reset-password", payload);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Reset Password
        </h1>
        <p className="text-sm text-center text-gray-600">
          Enter the OTP sent to your email and your new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            value={email}
            readOnly
            className="bg-gray-100 cursor-not-allowed text-gray-700"
          />

          <Input
            label="OTP"
            type="text"
            placeholder="Enter OTP"
            {...register("otp", { required: "OTP is required" })}
            error={errors.otp?.message}
          />

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              error={errors.newPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <Button type="submit" full {...(loading ? { loading } : {})}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

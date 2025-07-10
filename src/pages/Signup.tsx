import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Zod Schema for Signup
const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

// Zod Schema for OTP
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OtpData = z.infer<typeof otpSchema>;

export default function Signup() {
  const [showOtp, setShowOtp] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
  });

  const navigate = useNavigate();

  const onGetOtp = async (data: SignupData) => {
    try {
      await api.post("/auth/signup", data);
      toast.success("OTP sent to your email!");
      setShowOtp(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const onOtpSubmit = async (otpData: OtpData) => {
    try {
      await api.post("/auth/verify-otp", {
        email: getValues("email"),
        otp: otpData.otp,
      });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error("Invalid or expired OTP");
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email: getValues("email") });
      toast.info("OTP resent to your email.");
    } catch (err: any) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleCombinedSubmit = async () => {
    if (!showOtp) {
      handleSubmit(onGetOtp)();
    } else {
      handleSubmitOtp(onOtpSubmit)();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <Input
            label="Name"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          {showOtp && (
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-400 focus:outline-none focus:ring-2"
                {...registerOtp("otp")}
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm">{otpErrors.otp.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to {getValues("email")}
              </p>
              <button
                type="button"
                className="text-sm text-blue-600 mt-2 hover:underline"
                onClick={resendOtp}
              >
                Resend OTP
              </button>
            </div>
          )}

          <Button type="submit" full onClick={handleCombinedSubmit}>
            {showOtp ? "Sign Up" : "Get OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}

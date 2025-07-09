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
  const [step, setStep] = useState<"form" | "otp">("form");

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

  // Submit Signup Form
  const onSubmit = async (data: SignupData) => {
    try {
      await api.post("/auth/signup", data);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  // Submit OTP
  const onOtpSubmit = async (data: OtpData) => {
    try {
      await api.post("/auth/verify-otp", {
        email: getValues("email"),
        otp: data.otp,
      });
      toast.success("OTP verified successfully!");
      // TODO: Redirect to dashboard
    } catch (err: any) {
      toast.error("Invalid or expired OTP");
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email: getValues("email") });
      toast.info("OTP resent to your email.");
    } catch (err: any) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Button type="submit" full>
                  Sign Up
                </Button>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-medium mb-4">Verify OTP</h2>
              <p className="text-gray-500 text-sm mb-4">
                We’ve sent a 6-digit OTP to your email.
              </p>
              <form
                onSubmit={handleSubmitOtp(onOtpSubmit)}
                className="space-y-4"
              >
                <Input
                  label="Enter OTP"
                  {...registerOtp("otp")}
                  error={otpErrors.otp?.message}
                />
                <Button type="submit" full>
                  Verify
                </Button>
              </form>
              <button
                type="button"
                onClick={resendOtp}
                className="text-blue-600 text-sm hover:underline mt-4"
              >
                Resend OTP
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

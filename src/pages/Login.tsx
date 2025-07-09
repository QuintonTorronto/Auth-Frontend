// src/pages/Login.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  keepSignedIn: z.boolean().optional(),
});

type LoginData = z.infer<typeof loginSchema>;

const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpData = z.infer<typeof otpSchema>;

export default function Login() {
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [showOtpField, setShowOtpField] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { keepSignedIn: true },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
  });

  const navigate = useNavigate();
  const setAuthenticated = useAuth((state) => state.setAuthenticated);

  const onLoginSubmit = async (data: LoginData) => {
    try {
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });
      if (res.status === 200 || res.status === 204) {
        toast.success("Login successful!");
        setAuthenticated(true);
        setTimeout(() => navigate("/dashboard"), 100);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onOtpRequest = async () => {
    const email = watch("email");
    if (!email) return toast.error("Enter your email first");

    try {
      await api.post("/auth/send-otp-login", { email });
      setShowOtpField(true);
      toast.success("OTP sent to email");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const onOtpSubmit = async (data: OtpData) => {
    try {
      const res = await api.post("/auth/verify-otp-login", data);
      toast.success("OTP login successful");
      localStorage.setItem("token", res.data.accessToken);
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6">Sign In</h1>

        {method === "password" ? (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
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
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("keepSignedIn")} />
              <label className="text-sm">Keep me signed in</label>
            </div>
            <Button type="submit" full>
              Sign In
            </Button>
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
              onClick={() => setMethod("otp")}
            >
              Or sign in with OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...registerOtp("email")}
              error={otpErrors.email?.message}
            />
            {showOtpField && (
              <Input
                label="OTP"
                {...registerOtp("otp")}
                error={otpErrors.otp?.message}
              />
            )}
            {!showOtpField ? (
              <Button type="button" onClick={onOtpRequest} full>
                Send OTP
              </Button>
            ) : (
              <Button type="submit" full>
                Verify OTP
              </Button>
            )}
            <button
              type="button"
              className="text-sm text-gray-500 hover:underline"
              onClick={() => setMethod("password")}
            >
              Back to password login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

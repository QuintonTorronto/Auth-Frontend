import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// Schemas
const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

export default function Login() {
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [showOtpField, setShowOtpField] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    watch: watchOtp,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: emailValue },
  });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    setValue: setPwdValue,
    formState: { errors: pwdErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: emailValue },
  });

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const navigate = useNavigate();
  const setAuthenticated = useAuth((state) => state.setAuthenticated);

  // --- OTP FLOW ---
  const onOtpRequest = async () => {
    const email = watchOtp("email");
    if (!email) return toast.error("Enter your email first");

    try {
      await api.post("/auth/send-otp-login", { email });
      setShowOtpField(true);
      setResendCooldown(30);
      setEmailValue(email);
      setOtpValue("email", email);
      setPwdValue("email", email);
      toast.success("OTP sent to email");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const onResendOtp = async () => {
    if (resendCooldown > 0) return;
    const email = watchOtp("email");
    try {
      await api.post("/auth/send-otp-login", { email });
      toast.info("OTP resent to email");
      setResendCooldown(30); // reset cooldown
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };

  const onOtpSubmit = async (data: any) => {
    try {
      const res = await api.post("/auth/verify-otp-login", data, {
        withCredentials: true,
      });
      toast.success("Login successful!");
      setAuthenticated(true);
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP login failed");
    }
  };

  // --- PASSWORD FLOW ---
  const onPwdSubmit = async (data: any) => {
    try {
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });
      toast.success("Login successful!");
      setAuthenticated(true);
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // --- Toggle ---
  const switchToPassword = () => {
    const currentEmail = watchOtp("email") || emailValue;
    setEmailValue(currentEmail);
    setPwdValue("email", currentEmail);
    setMethod("password");
    setShowOtpField(false);
  };

  const switchToOtp = () => {
    setOtpValue("email", emailValue);
    setMethod("otp");
    setShowOtpField(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6">Sign In</h1>

        {method === "otp" && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...registerOtp("email")}
              error={otpErrors.email?.message}
              onChange={(e) => {
                setOtpValue("email", e.target.value);
                setEmailValue(e.target.value);
              }}
            />

            {showOtpField && (
              <>
                <Input
                  label="OTP"
                  type="text"
                  {...registerOtp("otp")}
                  error={otpErrors.otp?.message}
                />
                <button
                  type="button"
                  onClick={onResendOtp}
                  className={`text-sm ${
                    resendCooldown > 0
                      ? "text-gray-400"
                      : "text-blue-500 hover:underline"
                  }`}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </>
            )}

            {!showOtpField ? (
              <Button type="button" onClick={onOtpRequest} full>
                Get OTP
              </Button>
            ) : (
              <Button type="submit" full>
                Sign In
              </Button>
            )}

            <button
              type="button"
              className="text-blue-600 text-sm hover:underline mt-2"
              onClick={switchToPassword}
            >
              Sign in with Password
            </button>
          </form>
        )}

        {method === "password" && (
          <form onSubmit={handlePwdSubmit(onPwdSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...registerPwd("email")}
              error={pwdErrors.email?.message}
              onChange={(e) => {
                setPwdValue("email", e.target.value);
                setEmailValue(e.target.value);
              }}
            />
            <Input
              label="Password"
              type="password"
              {...registerPwd("password")}
              error={pwdErrors.password?.message}
            />

            <Button type="submit" full>
              Sign In
            </Button>

            <button
              type="button"
              className="text-sm text-gray-500 hover:underline mt-2"
              onClick={switchToOtp}
            >
              Use OTP to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

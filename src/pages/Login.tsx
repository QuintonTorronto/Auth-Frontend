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
import banner from "../assets/Banner.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: { theme: string; size: string; width: string }
          ) => void;
        };
      };
    };
  }
}

const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Login() {
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [showOtpField, setShowOtpField] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuthenticated = useAuth((s) => s.setAuthenticated);
  const setRequiresProfileCompletion = useAuth(
    (s) => s.setRequiresProfileCompletion
  );

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    watch: watchOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: emailValue },
  });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    setValue: setPwdValue,
    formState: { errors: pwdErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: emailValue },
  });

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    }
  };

  const onResendOtp = async () => {
    const email = watchOtp("email");
    if (resendCooldown > 0 || !email) return;

    try {
      await api.post("/auth/send-otp-login", { email });
      toast.info("OTP resent to email");
      setResendCooldown(30);
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Resend failed";
      toast.error(message);
    }
  };

  const onOtpSubmit = async (data: OtpForm) => {
    try {
      const res = await api.post("/auth/verify-otp-login", data, {
        withCredentials: true,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      setAuthenticated(true);
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "OTP login failed";
      toast.error(message);
    }
  };

  const onPwdSubmit = async (data: PasswordForm) => {
    try {
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      setAuthenticated(true);
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

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

  const handleGoogleCredential = async (credential: string) => {
    try {
      const res = await api.post(
        "/auth/google/token",
        { credential },
        { withCredentials: true }
      );

      const { accessToken, requiresProfileCompletion } = res.data;
      localStorage.setItem("accessToken", accessToken);
      setAuthenticated(true);
      setRequiresProfileCompletion(requiresProfileCompletion);

      navigate(requiresProfileCompletion ? "/complete-profile" : "/dashboard");
      toast.success("Google sign-in successful");
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Google login failed";
      toast.error(message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const googleId = window.google?.accounts?.id;
      if (googleId) {
        googleId.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
          callback: (res: { credential: string }) =>
            handleGoogleCredential(res.credential),
        });

        const el = document.getElementById("google-signin-button");
        if (el) {
          googleId.renderButton(el, {
            theme: "outline",
            size: "large",
            width: "300",
          });
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex justify-center md:justify-start px-4 pt-6 md:px-10 md:pt-4">
        <img src="/logo-HD.svg" alt="Logo" className="h-10 w-auto" />
      </div>
      <div className="flex flex-col bg-gray-50 md:flex-row mt-5 overflow-hidden">
        {/* Login Form (*/}
        <div className="w-full md:w-1/2 overflow-y-auto px-4 py-10 bg-gray-50 flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-semibold mb-2 text-gray-800">
              Sign In
            </h1>
            <h2 className="text-sm font-normal mb-6 text-gray-600">
              Please login to continue to your account.
            </h2>

            {method === "otp" && (
              <form
                onSubmit={handleOtpSubmit(onOtpSubmit)}
                className="space-y-4"
              >
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
                  className="text-gray-500 text-sm hover:underline hover:text-blue-600 mt-2"
                  onClick={switchToPassword}
                >
                  Sign in with Password
                </button>
              </form>
            )}

            {/* Password Login Section */}
            {method === "password" && (
              <form
                onSubmit={handlePwdSubmit(onPwdSubmit)}
                className="space-y-4"
              >
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
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...registerPwd("password")}
                    error={pwdErrors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                <Button type="submit" full>
                  Sign In
                </Button>
                <div className="flex justify-between items-center text-sm mt-2 px-1">
                  <button
                    type="button"
                    onClick={switchToOtp}
                    className="text-gray-500 hover:underline hover:text-blue-600"
                  >
                    Use OTP to sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            )}

            {/* Google Sign In Button */}
            <div className="my-4 px-4 py-2">
              <div className="w-full flex justify-center">
                <div id="google-signin-button" />
              </div>
            </div>

            <p className="text-center text-sm mt-4">
              Need an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Create one
              </span>
            </p>
          </div>
        </div>

        {/* Banner for Desktop */}
        <div className="hidden md:block md:w-1/2 fixed right-0 top-0 h-screen z-0">
          <img
            src={banner}
            alt="Login Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

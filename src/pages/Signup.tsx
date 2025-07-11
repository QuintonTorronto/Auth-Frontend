import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import banner from "../assets/Banner.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Schema: Signup
const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  dob: z.date({ required_error: "Date of birth is required" }),
});

type SignupData = z.infer<typeof signupSchema>;

// Schema: OTP
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpData = z.infer<typeof otpSchema>;

export default function Signup() {
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { dob: undefined },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
  });

  const dob = watch("dob");

  const onGetOtp = async (data: SignupData) => {
    try {
      await api.post("/auth/signup", {
        ...data,
        dob: data.dob.toISOString().split("T")[0],
      });
      toast.success("OTP sent to your email!");
      setShowOtp(true);
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Signup failed";
      toast.error(message);
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
    } catch (err: unknown) {
      toast.error(
        (err as any)?.response?.data?.message || "Invalid or expired OTP"
      );
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email: getValues("email") });
      toast.info("OTP resent to your email.");
    } catch (err: unknown) {
      toast.error(
        (err as any)?.response?.data?.message || "Failed to resend OTP"
      );
    }
  };

  const handleCombinedSubmit = () => {
    if (!showOtp) {
      handleSubmit(onGetOtp)();
    } else {
      handleSubmitOtp(onOtpSubmit)();
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex justify-center md:justify-start px-4 pt-6 md:px-10 md:pt-4">
        <img src="/logo-HD.svg" alt="Logo" className="h-10 w-auto" />
      </div>

      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Signup Form */}
        <div className="w-full md:w-1/2 overflow-y-auto p-6 flex justify-center items-center bg-gray-50">
          <div className="w-full max-w-md md:max-w-sm bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-semibold mb-2 text-gray-800">
              Sign up
            </h1>
            <h2 className="text-xs font-normal mb-6 text-gray-600">
              Sign up to enjoy the feature of HD
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <Input
                label="Name"
                {...register("name")}
                error={errors.name?.message}
              />

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <DatePicker
                  selected={dob}
                  onChange={(date: Date | null) => {
                    if (date) setValue("dob", date);
                  }}
                  dateFormat="dd MMMM yyyy"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-400 focus:outline-none focus:ring-2"
                  placeholderText="Select DOB"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob.message}</p>
                )}
              </div>

              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={errors.password?.message}
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

              {/* OTP Section */}
              {showOtp && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-400 focus:outline-none focus:ring-2"
                    {...registerOtp("otp")}
                  />
                  {otpErrors.otp && (
                    <p className="text-red-500 text-sm">
                      {otpErrors.otp.message}
                    </p>
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

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Banner */}
        <div className="hidden md:block md:w-1/2 fixed right-0 top-0 h-screen z-0">
          <img
            src={banner}
            alt="Signup Banner"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

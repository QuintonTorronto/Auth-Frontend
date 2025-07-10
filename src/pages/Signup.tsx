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

// Zod Schema for Signup
const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  dob: z.date({ required_error: "Date of birth is required" }),
});

type SignupData = z.infer<typeof signupSchema>;

// Zod Schema for OTP
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OtpData = z.infer<typeof otpSchema>;

export default function Signup() {
  const [showOtp, setShowOtp] = useState(false);
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
    defaultValues: {
      dob: undefined,
    },
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
        dob: data.dob.toISOString().split("T")[0], // format YYYY-MM-DD
      });
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

          {/* Date of Birth Picker */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <DatePicker
              selected={dob}
              onChange={(date: Date | null) => setValue("dob", date as Date)}
              dateFormat="dd MMMM yyyy"
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-400 focus:outline-none focus:ring-2"
              placeholderText="select DOB"
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
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          {/* OTP Section */}
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
  );
}

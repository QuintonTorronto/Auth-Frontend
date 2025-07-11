import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      toast.success("OTP sent to your email");
      setTimeout(() => {
        navigate("/reset-password", { state: { email: data.email } });
      }, 100);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-sm text-center text-gray-600">
          Enter your registered email to receive an OTP for resetting password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Button type="submit" full loading={loading}>
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.date({ required_error: "Date of birth is required" }),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
  const [dob, setDob] = useState<Date | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setValue("name", res.data.name || "");
        if (res.data.dob) {
          const parsedDate = new Date(res.data.dob);
          if (!isNaN(parsedDate.getTime())) setDob(parsedDate);
        }
      })
      .catch(() => toast.error("Failed to fetch profile"));
  }, [setValue]);

  const onSubmit = async (data: ProfileData) => {
    try {
      if (!dob) throw new Error("DOB missing");
      await api.post("/auth/complete-profile", {
        name: data.name,
        dob,
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6">Complete Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                setDob(date);
                setValue("dob", date ?? new Date());
              }}
              maxDate={new Date()}
              placeholderText="Select your date of birth"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-400 focus:outline-none focus:ring-2"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>
          <Button type="submit" full>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
}

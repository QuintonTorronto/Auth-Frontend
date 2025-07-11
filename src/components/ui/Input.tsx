import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        ref={ref}
        {...props}
        className={`border px-3 py-2 rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
);

Input.displayName = "Input";
export default Input;

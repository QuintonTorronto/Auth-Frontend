import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean;
  loading?: boolean;
}

export default function Button({
  full,
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
        full ? "w-full" : ""
      } ${props.disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={props.disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

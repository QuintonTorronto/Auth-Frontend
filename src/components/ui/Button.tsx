// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean;
}

export default function Button({ full, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
        full ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

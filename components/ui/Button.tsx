import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#7A1443]/30";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#4A0C2B] via-[#5A0C32] to-[#7A1443] hover:from-[#5A0C32] hover:to-[#8A184E] text-white shadow-sm shadow-[#4A0C2B]/20 active:scale-[0.98] border border-[#7A1443]/40",
    secondary:
      "bg-[#FDF2F5] hover:bg-[#FCE7ED] text-[#5A0C32] border border-[#F2D1DC] active:scale-[0.98] font-semibold",
    outline:
      "bg-white hover:bg-[#FDF2F5] text-[#5A0C32] hover:text-[#3B0721] border border-[#E8D1D8] active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-[#FDF2F5] text-[#5A0C32] hover:text-[#3B0721]",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 active:scale-[0.98]",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

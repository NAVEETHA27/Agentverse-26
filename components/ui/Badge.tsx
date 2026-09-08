import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "wine" | "rose" | "indigo" | "emerald" | "amber" | "sky" | "purple" | "slate";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium",
    md: "text-xs px-3 py-1 font-medium",
  };

  const variantStyles = {
    default: "bg-[#F7EFF2] text-[#4A3E45] border-[#E8DCE1]",
    slate: "bg-[#F4EFF2] text-[#5A4E54] border-[#E5DBE0]",
    wine: "bg-[#5A0C32] text-white border-[#7A1443]",
    rose: "bg-[#FDF2F5] text-[#7A1443] border-[#F4CEDB]",
    indigo: "bg-[#F5EFF7] text-[#5A0C32] border-[#E8D9EC]",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    sky: "bg-sky-50 text-sky-800 border-sky-200",
    purple: "bg-[#FAF0F7] text-[#6E113E] border-[#F0D5EA]",
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-full border", sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

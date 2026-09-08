import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "indigo" | "emerald" | "amber" | "sky" | "rose" | "purple" | "slate";
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
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border border-slate-700/60",
    slate: "bg-slate-800 text-slate-300 border border-slate-700/60",
    indigo: "bg-indigo-950/80 text-indigo-300 border border-indigo-700/50",
    emerald: "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50",
    amber: "bg-amber-950/80 text-amber-300 border border-amber-700/50",
    sky: "bg-sky-950/80 text-sky-300 border border-sky-700/50",
    rose: "bg-rose-950/80 text-rose-300 border border-rose-700/50",
    purple: "bg-purple-950/80 text-purple-300 border border-purple-700/50",
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

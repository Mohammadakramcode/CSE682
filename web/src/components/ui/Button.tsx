import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export default function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  const base = "rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "border border-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-gray-100 dark:hover:bg-zinc-800",
  };
  const v = variants[variant] || variants.primary;
  return <button className={`${base} ${sizes} ${v} ${className}`} {...props} />;
}




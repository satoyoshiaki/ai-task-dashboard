import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/formatters";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/20",
      className
    )}
    {...props}
  />
);

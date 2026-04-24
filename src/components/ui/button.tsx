import { clsx } from "clsx";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-brand text-white shadow-sm hover:bg-blue-900",
  secondary: "border border-line bg-white text-ink shadow-sm hover:bg-slate-50",
  ghost: "text-ink hover:bg-slate-100"
};

export type ButtonVariant = keyof typeof variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
};

export function ButtonLink({ className, variant = "primary", href, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

"use client";

import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground/80">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "min-h-[90px] resize-y", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputBase, "appearance-none", props.className)} />;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
} & InputHTMLAttributes<HTMLButtonElement> & { type?: "button" | "submit" }) {
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50",
    ghost: "border border-border bg-surface text-foreground/80 hover:bg-surface-muted",
    danger: "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all disabled:cursor-not-allowed",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-card-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

/** Aviso de resultado (ok / error). */
export function Toast({ msg }: { msg: { kind: "ok" | "err"; text: string } | null }) {
  if (!msg) return null;
  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg",
        msg.kind === "ok" ? "bg-green-600 text-white" : "bg-red-600 text-white",
      )}
      role="status"
    >
      {msg.text}
    </div>
  );
}

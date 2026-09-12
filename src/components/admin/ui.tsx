"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

type Option = { label: string; value: string };

/** Dropdown elegante (reemplaza al <select> nativo). */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Elegí…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next && ref.current) {
        const r = ref.current.getBoundingClientRect();
        // Si abajo hay poco espacio, desplegar hacia arriba.
        setUp(window.innerHeight - r.bottom < 260);
      }
      return next;
    });
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Cierra solo el dropdown (evita que el modal también se cierre).
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(inputBase, "flex items-center justify-between gap-2 text-left")}
      >
        <span className={current ? "" : "text-muted-foreground/60"}>{current?.label ?? placeholder}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute left-0 right-0 z-40 max-h-60 overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl",
            up ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  o.value === value
                    ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                    : "hover:bg-surface-muted",
                )}
              >
                {o.label}
                {o.value === value ? <Check className="h-4 w-4" /> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Paleta de colores visual (círculos). */
export function ColorSwatches({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const sel = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.label}
            aria-label={o.label}
            aria-pressed={sel}
            onClick={() => onChange(o.value)}
            className="relative h-9 w-9 rounded-full transition-transform hover:scale-110"
            style={{
              background: o.value,
              boxShadow: sel ? `0 0 0 2px var(--card), 0 0 0 4px ${o.value}` : undefined,
            }}
          >
            {sel ? <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Modal centrado con overlay, cierre por ESC / click afuera y bloqueo de scroll. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="my-6 w-full max-w-lg rounded-3xl border border-card-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-black">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xl text-foreground/50 transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

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

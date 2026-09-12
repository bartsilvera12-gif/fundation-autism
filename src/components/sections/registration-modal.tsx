"use client";

import { useEffect, useState } from "react";
import { submitRegistration } from "@/lib/data";

type ActivityLite = { id?: string; title: string };

const inputCls =
  "w-full rounded-xl border border-card-border bg-surface px-3.5 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30";

/** Modal público para inscribirse a una actividad. */
export function RegistrationModal({
  activity,
  onClose,
}: {
  activity: ActivityLite | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ full_name: "", cedula: "", phone: "", email: "", city: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const open = activity !== null;

  useEffect(() => {
    if (!open) return;
    // reset al abrir
    setForm({ full_name: "", cedula: "", phone: "", email: "", city: "" });
    setDone(false);
    setErr(null);
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

  if (!open || !activity) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await submitRegistration({
      activity_id: activity!.id ?? null,
      activity_title: activity!.title,
      ...form,
    });
    setBusy(false);
    if (!res.ok) {
      setErr("No se pudo enviar. Probá de nuevo en un momento.");
      return;
    }
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="my-6 w-full max-w-md rounded-3xl border border-card-border bg-card p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Inscripción</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-xl text-foreground/50 transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <p className="text-5xl" aria-hidden="true">🎉</p>
            <p className="mt-4 text-xl font-black">¡Inscripción enviada!</p>
            <p className="mt-2 text-pretty text-muted-foreground">
              Gracias por sumarte a <strong className="text-foreground">{activity.title}</strong>. Nos pondremos en
              contacto con vos.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
            >
              Listo
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl font-black leading-tight">{activity.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Completá tus datos para inscribirte.</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
              <input
                className={inputCls}
                placeholder="Nombre y apellido"
                autoComplete="name"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputCls}
                  placeholder="Cédula"
                  inputMode="numeric"
                  required
                  value={form.cedula}
                  onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Teléfono"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <input
                className={inputCls}
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Ciudad"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              {err ? <p className="text-sm font-semibold text-red-600">{err}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="mt-1 w-full rounded-full bg-brand-500 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-600 disabled:opacity-60"
              >
                {busy ? "Enviando…" : "Enviar inscripción"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Tus datos se envían de forma privada a la fundación.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

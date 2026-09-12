"use client";

import { useState } from "react";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { useSession } from "@/lib/admin";
import { Button, Card, Field, Input } from "./ui";
import { ActivitiesManager } from "./ActivitiesManager";
import { BoardManager } from "./BoardManager";
import { KidsManager } from "./KidsManager";
import { GalleryManager } from "./GalleryManager";
import { BrandMark } from "@/components/ui/brand-mark";

const TABS = [
  { id: "actividades", label: "Actividades" },
  { id: "comision", label: "Comisión" },
  { id: "divertite", label: "DIVERtite" },
  { id: "galeria", label: "Galería" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminApp() {
  const { session, loading } = useSession();
  const [tab, setTab] = useState<TabId>("actividades");

  if (!supabaseEnabled) {
    return (
      <Centered>
        <Card className="max-w-md text-center">
          <p className="text-lg font-bold">Supabase no está configurado</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Faltan las variables <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en el build.
          </p>
        </Card>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <p className="text-muted-foreground">Cargando…</p>
      </Centered>
    );
  }

  if (!session) return <Login />;

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark />
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            Panel
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{session.user.email}</span>
          <Button variant="ghost" onClick={() => supabase?.auth.signOut()}>
            Salir
          </Button>
        </div>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              tab === t.id
                ? "bg-brand-500 text-white"
                : "border border-border bg-surface text-foreground/70 hover:bg-surface-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "actividades" && <ActivitiesManager />}
      {tab === "comision" && <BoardManager />}
      {tab === "divertite" && <KidsManager />}
      {tab === "galeria" && <GalleryManager />}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center px-4">{children}</div>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = (await supabase?.auth.signInWithPassword({ email, password })) ?? {
      error: { message: "Sin conexión" },
    };
    setBusy(false);
    if (error) setErr("Email o contraseña incorrectos.");
  }

  return (
    <Centered>
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <BrandMark />
          <p className="text-lg font-black">Panel de administración</p>
          <p className="text-sm text-muted-foreground">Ingresá con tu cuenta.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Contraseña">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {err ? <p className="text-sm font-semibold text-red-600">{err}</p> : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>
      </Card>
    </Centered>
  );
}

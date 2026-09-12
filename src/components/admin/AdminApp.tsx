"use client";

import { useState, type ReactNode } from "react";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { useSession } from "@/lib/admin";
import { Button, Card, Field, Input } from "./ui";
import { ActivitiesManager } from "./ActivitiesManager";
import { BoardManager } from "./BoardManager";
import { KidsManager } from "./KidsManager";
import { GalleryManager } from "./GalleryManager";
import { EventsManager } from "./EventsManager";
import { ProjectManager } from "./ProjectManager";
import { RegistrationsManager } from "./RegistrationsManager";
import { BrandMark } from "@/components/ui/brand-mark";

const TABS = [
  { id: "actividades", label: "Actividades" },
  { id: "inscripciones", label: "Inscripciones" },
  { id: "comision", label: "Comisión" },
  { id: "eventos", label: "Eventos" },
  { id: "proyecto", label: "Proyecto" },
  { id: "divertite", label: "DIVERtite" },
  { id: "galeria", label: "Galería" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminApp() {
  const { session, loading } = useSession();
  const [tab, setTab] = useState<TabId>("actividades");

  let content: ReactNode;

  if (!supabaseEnabled) {
    content = (
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
  } else if (loading) {
    content = (
      <Centered>
        <p className="text-muted-foreground">Cargando…</p>
      </Centered>
    );
  } else if (!session) {
    content = <Login />;
  } else {
    content = (
      <div className="min-h-screen">
        {/* Header + pestañas fijas */}
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="hidden rounded-full bg-surface-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600 sm:inline">
                Panel
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-muted-foreground md:inline">{session.user.email}</span>
              <Button variant="ghost" onClick={() => supabase?.auth.signOut()}>
                Salir
              </Button>
            </div>
          </div>
          <nav className="mx-auto max-w-6xl px-2">
            <div className="flex gap-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    tab === t.id
                      ? "bg-brand-500 text-white"
                      : "text-foreground/60 hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          {tab === "actividades" && <ActivitiesManager />}
          {tab === "inscripciones" && <RegistrationsManager />}
          {tab === "comision" && <BoardManager />}
          {tab === "eventos" && <EventsManager />}
          {tab === "proyecto" && <ProjectManager />}
          {tab === "divertite" && <KidsManager />}
          {tab === "galeria" && <GalleryManager />}
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Fondo degradado animado con los colores del logo */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 mesh-animated" />
      {content}
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
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
            <Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

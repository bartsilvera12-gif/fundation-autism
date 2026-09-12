"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, Dropdown, Toast } from "./ui";

type Row = {
  id: string;
  activity_title: string | null;
  full_name: string;
  cedula: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  created_at: string;
};

export function RegistrationsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("__all__");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 2600);
  };

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("id,activity_title,full_name,cedula,phone,email,city,created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const activityOptions = useMemo(() => {
    const titles = Array.from(new Set(rows.map((r) => r.activity_title).filter(Boolean))) as string[];
    return [{ label: "Todas las actividades", value: "__all__" }, ...titles.map((t) => ({ label: t, value: t }))];
  }, [rows]);

  const filtered = filter === "__all__" ? rows : rows.filter((r) => r.activity_title === filter);

  async function remove(r: Row) {
    if (!supabase) return;
    if (!confirm(`¿Eliminar la inscripción de ${r.full_name}?`)) return;
    const { error } = await supabase.from("registrations").delete().eq("id", r.id);
    if (error) return flash("err", "No se pudo eliminar.");
    flash("ok", "Inscripción eliminada.");
    load();
  }

  function exportCsv() {
    const head = ["Nombre y apellido", "Cédula", "Teléfono", "Email", "Ciudad", "Actividad", "Fecha"];
    const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [r.full_name, r.cedula, r.phone, r.email, r.city, r.activity_title, new Date(r.created_at).toLocaleString("es-PY")]
        .map(esc)
        .join(","),
    );
    const csv = [head.join(","), ...lines].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscripciones-${filter === "__all__" ? "todas" : filter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">
          Inscripciones <span className="text-muted-foreground">({filtered.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-56">
            <Dropdown value={filter} onChange={setFilter} options={activityOptions} />
          </div>
          <Button variant="ghost" onClick={exportCsv} disabled={filtered.length === 0}>
            Exportar CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center text-muted-foreground">
          Todavía no hay inscripciones{filter !== "__all__" ? " para esta actividad" : ""}.
        </Card>
      ) : (
        <>
          {/* Tabla en desktop */}
          <div className="hidden overflow-x-auto rounded-2xl border border-card-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th>Nombre</Th>
                  <Th>Cédula</Th>
                  <Th>Teléfono</Th>
                  <Th>Email</Th>
                  <Th>Ciudad</Th>
                  <Th>Actividad</Th>
                  <Th>Fecha</Th>
                  <Th> </Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-card-border">
                    <Td className="font-semibold">{r.full_name}</Td>
                    <Td>{r.cedula}</Td>
                    <Td>{r.phone}</Td>
                    <Td>{r.email}</Td>
                    <Td>{r.city}</Td>
                    <Td>{r.activity_title}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("es-PY")}
                    </Td>
                    <Td>
                      <button onClick={() => remove(r)} className="text-xs font-bold text-red-600 hover:underline">
                        Borrar
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas en mobile */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((r) => (
              <li key={r.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold">{r.full_name}</p>
                    <button onClick={() => remove(r)} className="text-xs font-bold text-red-600">
                      Borrar
                    </button>
                  </div>
                  <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <Line k="Cédula" v={r.cedula} />
                    <Line k="Teléfono" v={r.phone} />
                    <Line k="Email" v={r.email} />
                    <Line k="Ciudad" v={r.city} />
                    <Line k="Actividad" v={r.activity_title} />
                    <Line k="Fecha" v={new Date(r.created_at).toLocaleDateString("es-PY")} />
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <Toast msg={msg} />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
function Line({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="font-semibold text-foreground/70">{k}:</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}

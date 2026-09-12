"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, Field, Input, Select, Textarea, Toast } from "./ui";

type Row = {
  id: string;
  title: string;
  description: string | null;
  accent: string | null;
  sort_order: number;
};

const ACCENTS = [
  { label: "Azul", value: "var(--color-spectrum-blue)" },
  { label: "Celeste", value: "var(--color-spectrum-teal)" },
  { label: "Verde", value: "var(--color-spectrum-green)" },
  { label: "Naranja", value: "var(--color-spectrum-orange)" },
  { label: "Violeta", value: "var(--color-spectrum-purple)" },
  { label: "Rojo", value: "var(--color-spectrum-red)" },
];

export function EventsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 2600);
  };

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("sort_order");
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!supabase) return;
    const { error } = await supabase
      .from("events")
      .insert({ title: "Nuevo evento", description: "", accent: ACCENTS[0].value, sort_order: rows.length });
    if (error) return flash("err", "No se pudo agregar.");
    load();
  }
  async function move(i: number, dir: -1 | 1) {
    if (!supabase) return;
    const a = rows[i];
    const b = rows[i + dir];
    if (!a || !b) return;
    await supabase.from("events").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("events").update({ sort_order: a.sort_order }).eq("id", b.id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Eventos y programas</h2>
        <Button onClick={add}>+ Agregar</Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <EventCard
              key={r.id}
              row={r}
              first={i === 0}
              last={i === rows.length - 1}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              onChange={load}
              flash={flash}
            />
          ))}
        </ul>
      )}
      <Toast msg={msg} />
    </div>
  );
}

function EventCard({
  row,
  first,
  last,
  onUp,
  onDown,
  onChange,
  flash,
}: {
  row: Row;
  first: boolean;
  last: boolean;
  onUp: () => void;
  onDown: () => void;
  onChange: () => void;
  flash: (k: "ok" | "err", t: string) => void;
}) {
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description ?? "");
  const [accent, setAccent] = useState(row.accent ?? ACCENTS[0].value);
  const [busy, setBusy] = useState(false);
  const dirty = title !== row.title || description !== (row.description ?? "") || accent !== (row.accent ?? "");

  async function save() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase
      .from("events")
      .update({ title, description: description || null, accent })
      .eq("id", row.id);
    setBusy(false);
    if (error) return flash("err", "No se pudo guardar: " + error.message);
    flash("ok", "Guardado.");
    onChange();
  }
  async function remove() {
    if (!supabase) return;
    if (!confirm(`¿Eliminar "${row.title}"?`)) return;
    const { error } = await supabase.from("events").delete().eq("id", row.id);
    if (error) return flash("err", "No se pudo eliminar.");
    onChange();
  }

  return (
    <li>
      <Card className="flex gap-4">
        <span aria-hidden className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
        <div className="min-w-0 flex-1 space-y-2">
          <Field label="Título">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Descripción">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="max-w-[200px]">
            <Field label="Color">
              <Select value={accent} onChange={(e) => setAccent(e.target.value)}>
                {ACCENTS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={save} disabled={busy || !dirty}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onUp} disabled={first}>
              ↑
            </Button>
            <Button variant="ghost" onClick={onDown} disabled={last}>
              ↓
            </Button>
            <Button variant="danger" onClick={remove}>
              Borrar
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}

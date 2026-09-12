"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, Field, Input, Modal, Select, Textarea, Toast } from "./ui";

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

type FormState = { title: string; description: string; accent: string };
const EMPTY: FormState = { title: "", description: "", accent: ACCENTS[0].value };

export function EventsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
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

  function startNew() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function startEdit(r: Row) {
    setEditing(r);
    setForm({ title: r.title, description: r.description ?? "", accent: r.accent ?? ACCENTS[0].value });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const payload = { title: form.title, description: form.description || null, accent: form.accent };
    const res = editing
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert({ ...payload, sort_order: rows.length });
    setBusy(false);
    if (res.error) return flash("err", "No se pudo guardar: " + res.error.message);
    flash("ok", editing ? "Evento actualizado." : "Evento agregado.");
    setOpen(false);
    load();
  }

  async function remove(r: Row) {
    if (!supabase) return;
    if (!confirm(`¿Eliminar "${r.title}"?`)) return;
    const { error } = await supabase.from("events").delete().eq("id", r.id);
    if (error) return flash("err", "No se pudo eliminar.");
    flash("ok", "Evento eliminado.");
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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Eventos y programas</h2>
        <Button onClick={startNew}>+ Agregar</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : rows.length === 0 ? (
        <Card className="text-center">
          <p className="text-muted-foreground">Todavía no hay eventos.</p>
          <Button className="mt-4" onClick={startNew}>
            + Crear el primero
          </Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.id}>
              <Card className="flex items-start gap-4">
                <span aria-hidden className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ background: r.accent ?? ACCENTS[0].value }} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{r.title}</p>
                  {r.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p> : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <div className="flex gap-1">
                    <IconBtn label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>↑</IconBtn>
                    <IconBtn label="Bajar" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>↓</IconBtn>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => startEdit(r)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => remove(r)}>
                      Borrar
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar evento" : "Nuevo evento"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Título">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required autoFocus />
          </Field>
          <Field label="Descripción">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="max-w-[220px]">
            <Field label="Color">
              <Select value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })}>
                {ACCENTS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={busy} className="flex-1">
              {busy ? "Guardando…" : editing ? "Guardar cambios" : "Agregar evento"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Toast msg={msg} />
    </div>
  );
}

function IconBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm text-foreground/70 hover:bg-surface-muted disabled:opacity-30"
    >
      {children}
    </button>
  );
}

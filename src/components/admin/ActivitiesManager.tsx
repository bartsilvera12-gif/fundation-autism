"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, ColorSwatches, Dropdown, Field, Input, Modal, Textarea, Toast } from "./ui";

/** Fila en la base (solo columnas reales). */
type Row = {
  id: string;
  title: string;
  description: string | null;
  date_label: string | null;
  time_label: string | null;
  modality: string | null;
  location: string | null;
  seats: string | null;
  accent: string | null;
  status: string | null;
  sort_order: number;
  is_published: boolean;
};

/** Estado del formulario: campos de la base + helpers de UI (fecha/hora estructuradas). */
type FormState = Omit<Row, "id"> & { date_iso: string; time_start: string; time_end: string };

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2025-10-04" -> "Sábado 4 de octubre de 2025" */
function formatDateEs(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  const s = d.toLocaleDateString("es-PY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const clean = s.replace(",", "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
function formatTime(start: string, end: string): string {
  if (start && end) return `${start} a ${end}`;
  return start || end || "";
}
/** "Sábado 4 de octubre de 2025" -> "2025-10-04" (para precargar el calendario al editar) */
function parseDateEs(label: string | null): string {
  if (!label) return "";
  const m = label.toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+(?:de\s+)?(\d{4})/);
  if (!m) return "";
  const mi = MONTHS.indexOf(m[2]);
  if (mi < 0) return "";
  return `${m[3]}-${String(mi + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}
/** "09:00 a 11:00" -> ["09:00","11:00"] */
function parseTimeRange(label: string | null): [string, string] {
  if (!label) return ["", ""];
  const t = (s: string) => {
    const mm = s.match(/(\d{1,2}):(\d{2})/);
    return mm ? `${mm[1].padStart(2, "0")}:${mm[2]}` : "";
  };
  const parts = label.split(/\s+a\s+/);
  return [t(parts[0] ?? ""), t(parts[1] ?? "")];
}

const ACCENTS = [
  { label: "Celeste", value: "var(--color-spectrum-teal)" },
  { label: "Violeta", value: "var(--color-spectrum-purple)" },
  { label: "Naranja", value: "var(--color-spectrum-orange)" },
  { label: "Verde", value: "var(--color-spectrum-green)" },
  { label: "Rojo", value: "var(--color-spectrum-red)" },
  { label: "Azul", value: "var(--color-spectrum-blue)" },
];

const EMPTY: FormState = {
  title: "",
  description: "",
  date_label: "",
  time_label: "",
  date_iso: "",
  time_start: "",
  time_end: "",
  modality: "Presencial",
  location: "",
  seats: "",
  accent: "var(--color-spectrum-teal)",
  status: "open",
  sort_order: 0,
  is_published: true,
};

export function ActivitiesManager() {
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
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: rows.length });
    setOpen(true);
  }
  function startEdit(r: Row) {
    setEditing(r);
    const { id: _id, ...rest } = r;
    void _id;
    const [ts, te] = parseTimeRange(r.time_label);
    setForm({ ...rest, date_iso: parseDateEs(r.date_label), time_start: ts, time_end: te });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    // Separa los helpers de UI (no son columnas) y deriva el texto que muestra el sitio.
    const { date_iso, time_start, time_end, ...dbFields } = form;
    const payload = {
      ...dbFields,
      description: dbFields.description || null,
      date_label: formatDateEs(date_iso) || null,
      time_label: formatTime(time_start, time_end) || null,
    };
    const res = editing
      ? await supabase.from("activities").update(payload).eq("id", editing.id)
      : await supabase.from("activities").insert(payload);
    setBusy(false);
    if (res.error) return flash("err", "No se pudo guardar: " + res.error.message);
    flash("ok", editing ? "Actividad actualizada." : "Actividad creada.");
    setOpen(false);
    load();
  }

  async function remove(r: Row) {
    if (!supabase) return;
    if (!confirm(`¿Eliminar "${r.title}"?`)) return;
    const { error } = await supabase.from("activities").delete().eq("id", r.id);
    if (error) return flash("err", "No se pudo eliminar.");
    flash("ok", "Actividad eliminada.");
    load();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Actividades</h2>
        <Button onClick={startNew}>+ Nueva actividad</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : rows.length === 0 ? (
        <Card className="text-center">
          <p className="text-muted-foreground">Todavía no hay actividades.</p>
          <Button className="mt-4" onClick={startNew}>
            + Crear la primera
          </Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                  style={{ background: r.accent ?? "var(--color-spectrum-teal)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{r.title}</p>
                    <StatusPill status={r.status} published={r.is_published} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[r.date_label, r.time_label, r.modality].filter(Boolean).join(" · ") || "Sin fecha"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => startEdit(r)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => remove(r)}>
                    Borrar
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar actividad" : "Nueva actividad"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Título">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required autoFocus />
          </Field>
          <Field label="Descripción">
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Fecha">
            <Input
              type="date"
              value={form.date_iso ?? ""}
              onChange={(e) => setForm({ ...form, date_iso: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Desde">
              <Input
                type="time"
                value={form.time_start ?? ""}
                onChange={(e) => setForm({ ...form, time_start: e.target.value })}
              />
            </Field>
            <Field label="Hasta">
              <Input
                type="time"
                value={form.time_end ?? ""}
                onChange={(e) => setForm({ ...form, time_end: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Modalidad">
              <Dropdown
                value={form.modality ?? "Presencial"}
                onChange={(v) => setForm({ ...form, modality: v })}
                options={[
                  { label: "Presencial", value: "Presencial" },
                  { label: "Virtual", value: "Virtual" },
                  { label: "Híbrida", value: "Híbrida" },
                ]}
              />
            </Field>
            <Field label="Cupos (opcional)">
              <Input placeholder="30 cupos" value={form.seats ?? ""} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
            </Field>
          </div>
          <Field label="Lugar">
            <Input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="Color">
            <ColorSwatches value={form.accent ?? ""} onChange={(v) => setForm({ ...form, accent: v })} options={ACCENTS} />
          </Field>
          <Field label="Estado">
            <Dropdown
              value={form.status ?? "open"}
              onChange={(v) => setForm({ ...form, status: v })}
              options={[
                { label: "Inscripción abierta", value: "open" },
                { label: "Próximamente", value: "soon" },
                { label: "Cupos llenos", value: "full" },
              ]}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="h-4 w-4"
            />
            Publicada (visible en el sitio)
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={busy} className="flex-1">
              {busy ? "Guardando…" : editing ? "Guardar cambios" : "Crear actividad"}
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

function StatusPill({ status, published }: { status: string | null; published: boolean }) {
  if (!published)
    return <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">Borrador</span>;
  const map: Record<string, string> = { open: "Abierta", soon: "Próximamente", full: "Cupos llenos" };
  return (
    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
      {map[status ?? "open"] ?? status}
    </span>
  );
}

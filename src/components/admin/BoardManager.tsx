"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/admin";
import { Button, Card, Dropdown, Field, Input, Modal, Toast } from "./ui";

type Row = {
  id: string;
  name: string;
  role: string;
  img_url: string | null;
  kind: "president" | "vice" | "member";
  accent: string | null;
  sort_order: number;
};

type FormState = { name: string; role: string; kind: Row["kind"]; img_url: string };
const EMPTY: FormState = { name: "", role: "", kind: "member", img_url: "" };

const KIND_LABEL: Record<Row["kind"], string> = {
  president: "Presidente",
  vice: "Vicepresidente",
  member: "Miembro",
};

export function BoardManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 2600);
  };

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("board_members").select("*").order("sort_order");
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
    setForm({ name: r.name, role: r.role, kind: r.kind, img_url: r.img_url ?? "" });
    setOpen(true);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file, "comision");
      setForm((f) => ({ ...f, img_url: url }));
      flash("ok", "Foto subida.");
    } catch (err) {
      flash("err", "No se pudo subir: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const payload = { name: form.name, role: form.role, kind: form.kind, img_url: form.img_url || null };
    const res = editing
      ? await supabase.from("board_members").update(payload).eq("id", editing.id)
      : await supabase.from("board_members").insert({ ...payload, sort_order: rows.length });
    setBusy(false);
    if (res.error) return flash("err", "No se pudo guardar: " + res.error.message);
    flash("ok", editing ? "Miembro actualizado." : "Miembro agregado.");
    setOpen(false);
    load();
  }

  async function remove(r: Row) {
    if (!supabase) return;
    if (!confirm(`¿Eliminar a ${r.name}?`)) return;
    const { error } = await supabase.from("board_members").delete().eq("id", r.id);
    if (error) return flash("err", "No se pudo eliminar.");
    flash("ok", "Miembro eliminado.");
    load();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Comisión Directiva</h2>
        <Button onClick={startNew}>+ Agregar</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
                  {r.img_url ? (
                    <Image src={r.img_url} alt="" fill sizes="80px" className="object-cover object-top" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Sin foto
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate font-bold">{r.name}</p>
                  <p className="text-sm text-brand-600">{r.role}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{KIND_LABEL[r.kind]}</p>
                  <div className="mt-auto flex gap-2 pt-3">
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar miembro" : "Nuevo miembro"}>
        <form onSubmit={save} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
              {form.img_url ? (
                <Image src={form.img_url} alt="" fill sizes="96px" className="object-cover object-top" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-muted-foreground">Sin foto</span>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              <Button type="button" variant="ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
                {busy ? "Subiendo…" : form.img_url ? "Cambiar foto" : "Subir foto"}
              </Button>
            </div>
          </div>
          <Field label="Nombre">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          </Field>
          <Field label="Cargo">
            <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          </Field>
          <Field label="Rol en el organigrama">
            <Dropdown
              value={form.kind}
              onChange={(v) => setForm({ ...form, kind: v as Row["kind"] })}
              options={[
                { label: "Presidente (destacado)", value: "president" },
                { label: "Vicepresidente (destacado)", value: "vice" },
                { label: "Miembro", value: "member" },
              ]}
            />
          </Field>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={busy} className="flex-1">
              {busy ? "Guardando…" : editing ? "Guardar cambios" : "Agregar miembro"}
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/admin";
import { Button, Card, Field, Input, Select, Toast } from "./ui";

type Row = {
  id: string;
  name: string;
  role: string;
  img_url: string | null;
  kind: "president" | "vice" | "member";
  accent: string | null;
  sort_order: number;
};

export function BoardManager() {
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
    const { data, error } = await supabase.from("board_members").select("*").order("sort_order");
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function addMember() {
    if (!supabase) return;
    const { error } = await supabase
      .from("board_members")
      .insert({ name: "Nuevo miembro", role: "Cargo", kind: "member", sort_order: rows.length });
    if (error) return flash("err", "No se pudo agregar.");
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Comisión Directiva</h2>
        <Button onClick={addMember}>+ Agregar</Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <MemberCard key={r.id} row={r} onChange={load} flash={flash} />
          ))}
        </ul>
      )}
      <Toast msg={msg} />
    </div>
  );
}

function MemberCard({
  row,
  onChange,
  flash,
}: {
  row: Row;
  onChange: () => void;
  flash: (k: "ok" | "err", t: string) => void;
}) {
  const [name, setName] = useState(row.name);
  const [role, setRole] = useState(row.role);
  const [kind, setKind] = useState(row.kind);
  const [img, setImg] = useState(row.img_url ?? "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = name !== row.name || role !== row.role || kind !== row.kind || img !== (row.img_url ?? "");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file, "comision");
      setImg(url);
      flash("ok", "Foto subida. No olvides Guardar.");
    } catch (err) {
      flash("err", "No se pudo subir la foto: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase
      .from("board_members")
      .update({ name, role, kind, img_url: img || null })
      .eq("id", row.id);
    setBusy(false);
    if (error) return flash("err", "No se pudo guardar: " + error.message);
    flash("ok", "Guardado.");
    onChange();
  }

  async function remove() {
    if (!supabase) return;
    if (!confirm(`¿Eliminar a ${row.name}?`)) return;
    const { error } = await supabase.from("board_members").delete().eq("id", row.id);
    if (error) return flash("err", "No se pudo eliminar.");
    onChange();
  }

  return (
    <li>
      <Card className="flex gap-4">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
          {img ? (
            <Image src={img} alt="" fill sizes="80px" className="object-cover object-top" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-muted-foreground">Sin foto</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Field label="Nombre">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Cargo">
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
          <Field label="Rol en el organigrama">
            <Select value={kind} onChange={(e) => setKind(e.target.value as Row["kind"])}>
              <option value="president">Presidente (destacado)</option>
              <option value="vice">Vicepresidente (destacado)</option>
              <option value="member">Miembro</option>
            </Select>
          </Field>
          <div className="flex flex-wrap gap-2 pt-1">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <Button variant="ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? "…" : "Cambiar foto"}
            </Button>
            <Button onClick={save} disabled={busy || !dirty}>
              Guardar
            </Button>
            <Button variant="danger" onClick={remove} disabled={busy}>
              Borrar
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}

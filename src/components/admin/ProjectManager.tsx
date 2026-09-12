"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/admin";
import { Button, Card, Field, Input, Toast } from "./ui";

type Row = {
  id: string;
  kind: "render" | "plan";
  img_url: string;
  label: string | null;
  alt: string | null;
  sort_order: number;
};

export function ProjectManager() {
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
    const { data, error } = await supabase.from("project_media").select("*").order("sort_order");
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-muted-foreground">Cargando…</p>;

  return (
    <div className="space-y-10">
      <Group kind="render" title="Renders del centro" rows={rows.filter((r) => r.kind === "render")} allRows={rows} onChange={load} flash={flash} />
      <Group kind="plan" title="Planos" rows={rows.filter((r) => r.kind === "plan")} allRows={rows} onChange={load} flash={flash} />
      <Toast msg={msg} />
    </div>
  );
}

function Group({
  kind,
  title,
  rows,
  allRows,
  onChange,
  flash,
}: {
  kind: "render" | "plan";
  title: string;
  rows: Row[];
  allRows: Row[];
  onChange: () => void;
  flash: (k: "ok" | "err", t: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !supabase) return;
    setBusy(true);
    try {
      let order = allRows.length;
      for (const f of files) {
        const url = await uploadImage(f, "proyecto");
        const { error } = await supabase
          .from("project_media")
          .insert({ kind, img_url: url, label: "", alt: "", sort_order: order++ });
        if (error) throw error;
      }
      flash("ok", `${files.length} imagen(es) agregada(s).`);
      onChange();
    } catch (err) {
      flash("err", "Error: " + (err as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addFiles} />
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? "Subiendo…" : "+ Agregar"}
          </Button>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted-foreground">Sin imágenes.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <ItemCard key={r.id} row={r} onChange={onChange} flash={flash} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemCard({
  row,
  onChange,
  flash,
}: {
  row: Row;
  onChange: () => void;
  flash: (k: "ok" | "err", t: string) => void;
}) {
  const [label, setLabel] = useState(row.label ?? "");
  const [img, setImg] = useState(row.img_url);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = label !== (row.label ?? "") || img !== row.img_url;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      setImg(await uploadImage(f, "proyecto"));
      flash("ok", "Foto subida. Guardá para aplicar.");
    } catch (err) {
      flash("err", "Error: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.from("project_media").update({ label, img_url: img }).eq("id", row.id);
    setBusy(false);
    if (error) return flash("err", "No se pudo guardar.");
    flash("ok", "Guardado.");
    onChange();
  }
  async function remove() {
    if (!supabase) return;
    if (!confirm("¿Eliminar esta imagen?")) return;
    const { error } = await supabase.from("project_media").delete().eq("id", row.id);
    if (error) return flash("err", "No se pudo eliminar.");
    onChange();
  }

  return (
    <li>
      <Card className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-muted">
          <Image src={img} alt="" fill sizes="240px" className="object-cover" />
        </div>
        <Field label="Etiqueta">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Sala de terapia" />
        </Field>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <Button variant="ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
            Cambiar
          </Button>
          <Button onClick={save} disabled={busy || !dirty}>
            Guardar
          </Button>
          <Button variant="danger" onClick={remove} disabled={busy}>
            Borrar
          </Button>
        </div>
      </Card>
    </li>
  );
}

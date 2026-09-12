"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/admin";
import { Button, Toast } from "./ui";

type Row = { id: string; img_url: string; sort_order: number };

export function KidsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 2600);
  };

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("divertite_kids").select("id,img_url,sort_order").order("sort_order");
    setLoading(false);
    if (error) return flash("err", "No se pudo cargar.");
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !supabase) return;
    setBusy(true);
    try {
      let order = rows.length;
      for (const f of files) {
        const url = await uploadImage(f, "divertite");
        const { error } = await supabase.from("divertite_kids").insert({ img_url: url, sort_order: order++ });
        if (error) throw error;
      }
      flash("ok", `${files.length} foto(s) agregada(s).`);
      load();
    } catch (err) {
      flash("err", "Error al subir: " + (err as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <ImageGrid
      title="DIVERtite picoTEAndo — protagonistas"
      rows={rows}
      loading={loading}
      busy={busy}
      fileRef={fileRef}
      onFiles={handleFiles}
      onChange={load}
      table="divertite_kids"
      flash={flash}
      aspect="aspect-[3/4]"
      objectClass="object-contain"
    />
  );
}

/** Grilla reutilizable de imágenes con subir / borrar / reordenar. */
export function ImageGrid({
  title,
  rows,
  loading,
  busy,
  fileRef,
  onFiles,
  onChange,
  table,
  flash,
  aspect,
  objectClass,
}: {
  title: string;
  rows: { id: string; img_url: string; sort_order: number }[];
  loading: boolean;
  busy: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: () => void;
  table: string;
  flash: (k: "ok" | "err", t: string) => void;
  aspect: string;
  objectClass: string;
}) {
  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("¿Eliminar esta imagen?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return flash("err", "No se pudo eliminar.");
    onChange();
  }
  async function move(idx: number, dir: -1 | 1) {
    if (!supabase) return;
    const a = rows[idx];
    const b = rows[idx + dir];
    if (!a || !b) return;
    await supabase.from(table).update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from(table).update({ sort_order: a.sort_order }).eq("id", b.id);
    onChange();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">{title}</h2>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? "Subiendo…" : "+ Agregar fotos"}
          </Button>
        </div>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">No hay imágenes. Agregá la primera →</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {rows.map((r, i) => (
            <li
              key={r.id}
              className="group relative"
              style={{ contentVisibility: "auto", containIntrinsicSize: "220px 300px" }}
            >
              <div className={`relative ${aspect} overflow-hidden rounded-xl border border-border bg-surface-muted`}>
                <Image src={r.img_url} alt="" fill sizes="200px" loading="lazy" className={objectClass} />
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <IconBtn label="Mover izquierda" disabled={i === 0} onClick={() => move(i, -1)}>←</IconBtn>
                  <IconBtn label="Mover derecha" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>→</IconBtn>
                </div>
                <button
                  onClick={() => remove(r.id)}
                  className="rounded-full px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        {rows.length} imágenes · el orden se refleja en el sitio.
      </p>
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
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-sm text-foreground/70 disabled:opacity-30 hover:bg-surface-muted"
    >
      {children}
    </button>
  );
}

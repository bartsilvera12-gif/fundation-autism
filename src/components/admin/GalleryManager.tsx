"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/admin";
import { ImageGrid } from "./KidsManager";
import { Toast } from "./ui";

type Row = {
  id: string;
  img_url: string;
  sort_order: number;
  group_year: string | null;
  group_label: string | null;
};

export function GalleryManager() {
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
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id,img_url,sort_order,group_year,group_label")
      .order("sort_order");
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
    const year = rows[0]?.group_year ?? "2025";
    const label = rows[0]?.group_label ?? "Eventos";
    try {
      let order = rows.length;
      for (const f of files) {
        const url = await uploadImage(f, "galeria");
        const { error } = await supabase.from("gallery_photos").insert({
          img_url: url,
          alt: "Momento de un evento de la Fundación ATYPICAL Py",
          group_year: year,
          group_label: label,
          sort_order: order++,
        });
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
    <>
      <ImageGrid
        title="Galería de eventos"
        rows={rows}
        loading={loading}
        busy={busy}
        fileRef={fileRef}
        onFiles={handleFiles}
        onChange={load}
        table="gallery_photos"
        flash={flash}
        aspect="aspect-[4/3]"
        objectClass="object-cover"
      />
      <Toast msg={msg} />
    </>
  );
}

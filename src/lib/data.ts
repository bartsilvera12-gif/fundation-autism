/**
 * Capa de datos: lee de Supabase (schema `fundation`) y mapea a los tipos del
 * sitio. Si Supabase no está configurado o falla, devuelve null para que el
 * componente use el contenido estático de fallback (el sitio nunca se rompe).
 */
import { supabase } from "@/lib/supabase";
import type { Activity, BoardMember } from "@/content/site";
import type { KidPhoto } from "@/content/divertite";
import type { GalleryGroup, GalleryPhoto } from "@/content/gallery";

/* ------------------------------- Actividades ------------------------------ */

type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  date_label: string | null;
  time_label: string | null;
  modality: string | null;
  location: string | null;
  seats: string | null;
  accent: string | null;
  status: "open" | "soon" | "full" | null;
  form_href: string | null;
  sort_order: number;
  is_published: boolean;
};

/** Actividad tal como la usa el sitio, más el id de la fila. */
export type ActivityRecord = Activity & { id: string };

function mapActivity(r: ActivityRow): ActivityRecord {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    date: r.date_label ?? "",
    time: r.time_label ?? "",
    modality: (r.modality as Activity["modality"]) ?? "Presencial",
    location: r.location ?? "",
    seats: r.seats ?? undefined,
    accent: r.accent ?? "var(--color-spectrum-teal)",
    status: r.status ?? "open",
    formHref: r.form_href ?? undefined,
  };
}

export async function fetchActivities(): Promise<ActivityRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return null;
  return (data as ActivityRow[]).map(mapActivity);
}

/* --------------------------------- Comisión -------------------------------- */

type BoardRow = {
  id: string;
  name: string;
  role: string;
  img_url: string | null;
  kind: "president" | "vice" | "member";
  accent: string | null;
  sort_order: number;
};

export type BoardData = {
  president: BoardMember;
  vice: BoardMember;
  members: BoardMember[];
};

export async function fetchBoard(): Promise<BoardData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("board_members")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return null;
  const rows = data as BoardRow[];
  const toMember = (r: BoardRow): BoardMember => ({
    name: r.name,
    role: r.role,
    img: r.img_url ?? "",
  });
  const president = rows.find((r) => r.kind === "president");
  const vice = rows.find((r) => r.kind === "vice");
  const members = rows.filter((r) => r.kind === "member").map(toMember);
  if (!president || !vice) return null;
  return { president: toMember(president), vice: toMember(vice), members };
}

/* --------------------------------- DIVERtite ------------------------------- */

type KidRow = {
  id: string;
  img_url: string;
  width: number | null;
  height: number | null;
  blur_data_url: string | null;
  sort_order: number;
};

export async function fetchDivertiteKids(): Promise<KidPhoto[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("divertite_kids")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return null;
  return (data as KidRow[]).map((r) => ({
    src: r.img_url,
    width: r.width ?? 640,
    height: r.height ?? 800,
    blurDataURL: r.blur_data_url ?? "",
  }));
}

/* --------------------------------- Galería --------------------------------- */

type GalleryRow = {
  id: string;
  group_year: string | null;
  group_label: string | null;
  img_url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  blur_data_url: string | null;
  sort_order: number;
};

export async function fetchGalleryGroups(): Promise<GalleryGroup[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return null;
  const rows = data as GalleryRow[];
  const byGroup = new Map<string, GalleryGroup>();
  for (const r of rows) {
    const year = r.group_year ?? "";
    const key = year;
    if (!byGroup.has(key)) {
      byGroup.set(key, { year, label: r.group_label ?? "", photos: [] });
    }
    const photo: GalleryPhoto = {
      src: r.img_url,
      width: r.width ?? 1600,
      height: r.height ?? 1200,
      alt: r.alt ?? "",
      blurDataURL: r.blur_data_url ?? "",
    };
    byGroup.get(key)!.photos.push(photo);
  }
  const groups = [...byGroup.values()].filter((g) => g.photos.length > 0);
  return groups.length ? groups : null;
}

/* --------------------------------- Proyecto -------------------------------- */

type ProjectRow = {
  id: string;
  kind: "render" | "plan";
  img_url: string;
  alt: string | null;
  label: string | null;
  sort_order: number;
};

export type ProjectMedia = { src: string; alt: string; label: string };

export async function fetchProjectMedia(): Promise<{ renders: ProjectMedia[]; plans: ProjectMedia[] } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("project_media").select("*").order("sort_order");
  if (error || !data) return null;
  const rows = data as ProjectRow[];
  const map = (r: ProjectRow): ProjectMedia => ({ src: r.img_url, alt: r.alt ?? "", label: r.label ?? "" });
  const renders = rows.filter((r) => r.kind === "render").map(map);
  const plans = rows.filter((r) => r.kind === "plan").map(map);
  if (!renders.length && !plans.length) return null;
  return { renders, plans };
}

/* --------------------------------- Eventos --------------------------------- */

export type EventRecord = { id: string; title: string; description: string; accent: string };

export async function fetchEvents(): Promise<EventRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return null;
  return (data as { id: string; title: string; description: string | null; accent: string | null }[]).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    accent: r.accent ?? "var(--color-spectrum-blue)",
  }));
}

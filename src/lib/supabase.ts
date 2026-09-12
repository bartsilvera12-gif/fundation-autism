import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el navegador (sitio estático + /admin).
 * Usa la anon key (pública, protegida por RLS) y el schema `fundation`.
 * La escritura solo funciona con una sesión iniciada (política auth_write).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA ?? "fundation";

/** true si hay credenciales configuradas (si no, el sitio usa el contenido estático de fallback). */
export const supabaseEnabled = Boolean(url && anon);

export const supabase =
  supabaseEnabled
    ? createClient(url as string, anon as string, {
        db: { schema },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

/** Bucket de Storage donde viven las imágenes subidas desde el admin. */
export const STORAGE_BUCKET = "fundation";

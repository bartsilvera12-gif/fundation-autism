/**
 * Crea el schema `fundation` en Supabase, todas las tablas (con RLS + Storage)
 * y carga los datos actuales del sitio.
 *
 * Uso (la credencial NUNCA se guarda en el repo, se pasa por env):
 *   PGCONN='postgresql://...' npx tsx scripts/db/setup.ts
 */
import pg from "pg";
import { board, project, events } from "../../src/content/site";
import { divertiteKids } from "../../src/content/divertite";
import { galleryGroups } from "../../src/content/gallery";

const MEMBER_ACCENTS = ["#e00e1e", "#05acec", "#f7941d", "#6ba428", "#8b5cf6"];

/** Escapa un valor a literal SQL seguro (sin usar parámetros, compatible con pgbouncer). */
function lit(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

const TABLES = [
  "activities",
  "board_members",
  "divertite_kids",
  "gallery_photos",
  "project_media",
  "events",
];

const DDL = `
create schema if not exists fundation;

create table if not exists fundation.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date_label text,
  time_label text,
  modality text,
  location text,
  seats text,
  accent text,
  status text not null default 'open' check (status in ('open','soon','full')),
  form_href text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fundation.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  img_url text,
  kind text not null default 'member' check (kind in ('president','vice','member')),
  accent text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fundation.divertite_kids (
  id uuid primary key default gen_random_uuid(),
  name text,
  img_url text not null,
  width int,
  height int,
  blur_data_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists fundation.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  group_year text,
  group_label text,
  img_url text not null,
  alt text,
  width int,
  height int,
  blur_data_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists fundation.project_media (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'render' check (kind in ('render','plan')),
  img_url text not null,
  alt text,
  label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists fundation.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  accent text,
  img_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para mantener updated_at
create or replace function fundation.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['activities','board_members','events'] loop
    execute format('drop trigger if exists set_updated_at on fundation.%I', t);
    execute format('create trigger set_updated_at before update on fundation.%I for each row execute function fundation.set_updated_at()', t);
  end loop;
end $$;
`;

const GRANTS_RLS = `
grant usage on schema fundation to anon, authenticated, service_role;
grant select on all tables in schema fundation to anon, authenticated;
grant all on all tables in schema fundation to authenticated, service_role;
alter default privileges in schema fundation grant select on tables to anon, authenticated;
alter default privileges in schema fundation grant all on tables to authenticated, service_role;

do $$
declare t text;
begin
  foreach t in array array['activities','board_members','divertite_kids','gallery_photos','project_media','events'] loop
    execute format('alter table fundation.%I enable row level security', t);
    execute format('drop policy if exists "public_read" on fundation.%I', t);
    execute format('create policy "public_read" on fundation.%I for select using (true)', t);
    execute format('drop policy if exists "auth_write" on fundation.%I', t);
    execute format('create policy "auth_write" on fundation.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
`;

const STORAGE = `
insert into storage.buckets (id, name, public)
values ('fundation', 'fundation', true)
on conflict (id) do update set public = true;

drop policy if exists "fundation_read" on storage.objects;
create policy "fundation_read" on storage.objects for select using (bucket_id = 'fundation');
drop policy if exists "fundation_write" on storage.objects;
create policy "fundation_write" on storage.objects for all to authenticated using (bucket_id = 'fundation') with check (bucket_id = 'fundation');
`;

// Exponer el schema en PostgREST (best-effort; puede requerir confirmarlo en el dashboard)
const EXPOSE = `
alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, fundation';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
`;

function seedSQL(): string {
  const stmts: string[] = [];
  // limpiar (respeta orden, sin FKs entre ellas)
  for (const t of TABLES) stmts.push(`truncate table fundation.${t} restart identity cascade;`);

  // board_members
  const bm: string[] = [];
  bm.push(`(${lit(board.president.name)}, ${lit(board.president.role)}, ${lit(board.president.img)}, 'president', ${lit("#1f8fd6")}, 0)`);
  bm.push(`(${lit(board.vice.name)}, ${lit(board.vice.role)}, ${lit(board.vice.img)}, 'vice', ${lit("#8b5cf6")}, 1)`);
  board.members.forEach((m, i) => {
    bm.push(`(${lit(m.name)}, ${lit(m.role)}, ${lit(m.img)}, 'member', ${lit(MEMBER_ACCENTS[i % MEMBER_ACCENTS.length])}, ${i + 2})`);
  });
  stmts.push(`insert into fundation.board_members (name, role, img_url, kind, accent, sort_order) values\n${bm.join(",\n")};`);

  // divertite_kids
  const dk = divertiteKids.map((k, i) =>
    `(${lit(k.src)}, ${lit(k.width)}, ${lit(k.height)}, ${lit(k.blurDataURL)}, ${i})`,
  );
  stmts.push(`insert into fundation.divertite_kids (img_url, width, height, blur_data_url, sort_order) values\n${dk.join(",\n")};`);

  // gallery_photos
  const gp: string[] = [];
  galleryGroups.forEach((g) => {
    g.photos.forEach((p, i) => {
      gp.push(`(${lit(g.year)}, ${lit(g.label)}, ${lit(p.src)}, ${lit(p.alt)}, ${lit(p.width)}, ${lit(p.height)}, ${lit(p.blurDataURL)}, ${i})`);
    });
  });
  stmts.push(`insert into fundation.gallery_photos (group_year, group_label, img_url, alt, width, height, blur_data_url, sort_order) values\n${gp.join(",\n")};`);

  // project_media
  const pm: string[] = [];
  project.renders.forEach((r, i) => pm.push(`('render', ${lit(r.src)}, ${lit(r.alt)}, ${lit(r.label)}, ${i})`));
  project.plans.forEach((r, i) => pm.push(`('plan', ${lit(r.src)}, ${lit(r.alt)}, ${lit(r.label)}, ${project.renders.length + i})`));
  stmts.push(`insert into fundation.project_media (kind, img_url, alt, label, sort_order) values\n${pm.join(",\n")};`);

  // events
  const ev = events.items.map((e, i) => `(${lit(e.title)}, ${lit(e.description)}, ${lit(e.accent)}, ${i})`);
  stmts.push(`insert into fundation.events (title, description, accent, sort_order) values\n${ev.join(",\n")};`);

  // activities queda vacía (los datos mock ya fueron removidos)
  return stmts.join("\n");
}

async function run() {
  const conn = process.env.PGCONN;
  if (!conn) throw new Error("Falta PGCONN");
  const client = new pg.Client({ connectionString: conn, ssl: false, statement_timeout: 60000 });
  await client.connect();
  const step = async (name: string, sql: string, fatal = true) => {
    try {
      await client.query(sql);
      console.log(`✓ ${name}`);
    } catch (e) {
      console.error(`${fatal ? "✗" : "⚠"} ${name}: ${(e as Error).message}`);
      if (fatal) throw e;
    }
  };
  try {
    await step("schema + tablas + triggers", DDL);
    await step("grants + RLS + policies", GRANTS_RLS);
    await step("storage bucket + policies", STORAGE, false);
    await step("exponer schema en PostgREST", EXPOSE, false);
    await step("seed de datos actuales", seedSQL());

    const counts = await client.query(
      `select 'activities' t, count(*) c from fundation.activities
       union all select 'board_members', count(*) from fundation.board_members
       union all select 'divertite_kids', count(*) from fundation.divertite_kids
       union all select 'gallery_photos', count(*) from fundation.gallery_photos
       union all select 'project_media', count(*) from fundation.project_media
       union all select 'events', count(*) from fundation.events
       order by t`,
    );
    console.log("\nConteos:");
    counts.rows.forEach((r) => console.log(`  ${r.t}: ${r.c}`));
  } finally {
    await client.end().catch(() => {});
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

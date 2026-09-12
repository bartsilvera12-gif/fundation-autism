/**
 * Restringe la escritura de `fundation` SOLO a los admins de una allowlist
 * (importante porque el Auth es multi-tenant y "authenticated" incluye
 * usuarios de otras apps). Uso:
 *   PGCONN='postgresql://...' ADMIN_UID='<uuid>' npx tsx scripts/db/harden.ts
 */
import pg from "pg";

const DATA_TABLES = [
  "activities",
  "board_members",
  "divertite_kids",
  "gallery_photos",
  "project_media",
  "events",
];

async function run() {
  const conn = process.env.PGCONN;
  const uid = process.env.ADMIN_UID;
  if (!conn || !uid) throw new Error("Faltan PGCONN y/o ADMIN_UID");
  const c = new pg.Client({ connectionString: conn, ssl: false, statement_timeout: 60000 });
  await c.connect();
  try {
    // ¿existe el usuario en auth.users?
    const u = await c.query("select id, email, email_confirmed_at from auth.users where id = $1", [uid]);
    if (u.rowCount === 0) {
      console.log(`⚠ El UUID ${uid} NO existe en auth.users. Igual lo agrego a la allowlist; el login no va a funcionar hasta que ese usuario exista.`);
    } else {
      console.log(`✓ Usuario admin: ${u.rows[0].email ?? "(sin email)"} · confirmado: ${u.rows[0].email_confirmed_at ? "sí" : "NO"}`);
    }

    // allowlist de admins
    await c.query(`
      create table if not exists fundation.admins (
        user_id uuid primary key,
        email text,
        created_at timestamptz not null default now()
      );
      grant select on fundation.admins to anon, authenticated;
      grant all on fundation.admins to authenticated, service_role;
      alter table fundation.admins enable row level security;
      drop policy if exists "admins_read" on fundation.admins;
      create policy "admins_read" on fundation.admins for select using (true);
    `);
    await c.query(
      `insert into fundation.admins (user_id, email)
       values ($1, (select email from auth.users where id = $1))
       on conflict (user_id) do update set email = excluded.email`,
      [uid],
    );

    // políticas de escritura: solo admins de la allowlist
    for (const t of DATA_TABLES) {
      await c.query(`
        drop policy if exists "auth_write" on fundation.${t};
        drop policy if exists "admin_write" on fundation.${t};
        create policy "admin_write" on fundation.${t}
          for all to authenticated
          using (exists (select 1 from fundation.admins a where a.user_id = auth.uid()))
          with check (exists (select 1 from fundation.admins a where a.user_id = auth.uid()));
      `);
    }

    // storage: subir/editar/borrar en el bucket solo admins
    await c.query(`
      drop policy if exists "fundation_write" on storage.objects;
      create policy "fundation_write" on storage.objects
        for all to authenticated
        using (bucket_id = 'fundation' and exists (select 1 from fundation.admins a where a.user_id = auth.uid()))
        with check (bucket_id = 'fundation' and exists (select 1 from fundation.admins a where a.user_id = auth.uid()));
    `);

    const admins = await c.query("select user_id, email from fundation.admins");
    console.log("\nAdmins en allowlist:");
    admins.rows.forEach((r) => console.log(`  ${r.user_id} · ${r.email ?? "(sin email)"}`));
    console.log("\n✓ Escritura restringida a admins (tablas + storage). Lectura sigue pública.");
  } finally {
    await c.end().catch(() => {});
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

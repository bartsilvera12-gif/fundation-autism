/**
 * Sincroniza la BD con las fotos de las 3 ediciones + portadas de programas.
 * - Mueve las fotos viejas (carpeta 2025) a edicion-1 y renombra el grupo.
 * - Borra SOLO las 2 fotos retiradas (IMG_3284 / IMG_3286).
 * - Inserta las fotos nuevas y actualiza etiquetas/orden.
 * - Carga las portadas de los 4 programas y renombra "DIVERtite picoTEAndo".
 * Es idempotente. Correr DESPUÉS de `npm run manifest`:
 *
 *   PGCONN='postgresql://...' npx tsx scripts/db/sync-ediciones.mts
 */
import pg from "pg";
import { galleryGroups } from "../../src/content/gallery";

const lit = (v: unknown) =>
  v == null ? "NULL" : typeof v === "number" ? String(v) : "'" + String(v).replace(/'/g, "''") + "'";

const c = new pg.Client({ connectionString: process.env.PGCONN });
await c.connect();
try {
  await c.query("begin");
  await c.query(
    `update fundation.gallery_photos set img_url = replace(img_url,'/images/eventos/2025/','/images/eventos/edicion-1/') where img_url like '/images/eventos/2025/%'`,
  );
  const del = await c.query(
    `delete from fundation.gallery_photos where img_url in ('/images/eventos/edicion-1/20230903105645_IMG_3284.webp','/images/eventos/edicion-1/20230903105657_IMG_3286.webp')`,
  );
  console.log("fotos retiradas:", del.rowCount);

  const have = new Set((await c.query("select img_url from fundation.gallery_photos")).rows.map((r) => r.img_url));
  let order = 0;
  const ins: string[] = [];
  for (const g of galleryGroups)
    for (const p of g.photos) {
      if (have.has(p.src)) {
        await c.query(
          `update fundation.gallery_photos set group_year=$1, group_label=$2, alt=$3, sort_order=$4 where img_url=$5`,
          [g.year, g.label, p.alt, order, p.src],
        );
      } else {
        ins.push(`(${lit(g.year)},${lit(g.label)},${lit(p.src)},${lit(p.alt)},${p.width},${p.height},${lit(p.blurDataURL)},${order})`);
      }
      order++;
    }
  if (ins.length)
    await c.query(
      `insert into fundation.gallery_photos (group_year,group_label,img_url,alt,width,height,blur_data_url,sort_order) values ${ins.join(",")}`,
    );

  const covers: Record<string, string> = {
    "Programa Neurodiversidad en Acción": "neurodiversidad-en-accion",
    "Red de Apoyo": "red-de-apoyo",
    "La Tiendita de Atypical": "la-tiendita",
    "DiverTITE PicoTEAndo": "divertite-picoteando",
  };
  for (const [t, f] of Object.entries(covers)) {
    const r = await c.query(`update fundation.events set img_url=$1 where title=$2`, [`/images/programas/${f}.webp`, t]);
    if (r.rowCount !== 1) throw new Error("evento no encontrado: " + t);
  }
  await c.query(`update fundation.events set title='DIVERtite picoTEAndo' where title='DiverTITE PicoTEAndo'`);
  await c.query("commit");
} catch (e) {
  await c.query("rollback");
  throw e;
}
console.log((await c.query("select group_year,count(*) from fundation.gallery_photos group by 1 order by 1")).rows);
console.log((await c.query("select title,img_url from fundation.events order by sort_order")).rows);
await c.end();

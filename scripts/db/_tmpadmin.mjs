import pg from "pg";
const BASE="https://api.neura.com.py", SERVICE=process.env.SERVICE, PGCONN=process.env.PGCONN;
const email=process.argv[2], password=process.argv[3], del=process.argv[4]==='del';
const c=new pg.Client({connectionString:PGCONN,ssl:false}); await c.connect();
if(del){const u=await c.query("select user_id from fundation.admins where email=$1",[email]);for(const row of u.rows){await fetch(`${BASE}/auth/v1/admin/users/${row.user_id}`,{method:'DELETE',headers:{apikey:SERVICE,Authorization:`Bearer ${SERVICE}`}});}await c.query("delete from fundation.admins where email=$1",[email]);console.log("borrado");}
else{const r=await fetch(`${BASE}/auth/v1/admin/users`,{method:'POST',headers:{apikey:SERVICE,Authorization:`Bearer ${SERVICE}`,'Content-Type':'application/json'},body:JSON.stringify({email,password,email_confirm:true})});const id=JSON.parse(await r.text()).id;await c.query("insert into fundation.admins(user_id,email) values($1,$2) on conflict do nothing",[id,email]);console.log("creado",id);}
await c.end();

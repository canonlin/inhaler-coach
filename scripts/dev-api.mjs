// Minimal local API server for rendering the admin against real data.
import { createServer } from "node:http";
import { createPool } from "../api/db.mjs";
import { makeRoutes } from "../api/routes.mjs";
const pool = createPool(process.env.DATABASE_URL);
const api = makeRoutes({ query: (t,p)=>pool.query(t,p), salt: "demo-salt" });
const map = {
  "/api/health":"health", "/api/reference":"reference", "/api/followups":"followups",
  "/api/metrics/summary":"summary", "/api/cases":"listCases",
};
createServer(async (req,res)=>{
  const url=new URL(req.url,"http://x"); const name=map[url.pathname];
  res.setHeader("Content-Type","application/json");
  if(!name){res.statusCode=404;return res.end('{"ok":false,"error":"no route"}');}
  try{ const out=await api[name](Object.fromEntries(url.searchParams));
       res.end(JSON.stringify(out)); }catch(e){ res.statusCode=500; res.end(JSON.stringify({ok:false,error:e.message})); }
}).listen(4183,()=>console.log("api on 4183"));

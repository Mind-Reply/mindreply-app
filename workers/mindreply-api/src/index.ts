export interface Env {
  DB?: D1Database;
  N8N_INTAKE_WEBHOOK?: string;
  SALESFORCE_CLIENT_ID?: string;
  SALESFORCE_CLIENT_SECRET?: string;
}

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});

export default {async fetch(request:Request,env:Env):Promise<Response>{
  const url=new URL(request.url);
  if(request.method==="GET"&&url.pathname==="/api/health") return json({ok:true,service:"mindreply-api",storage:env.DB?"configured":"demo"});
  if(request.method==="POST"&&url.pathname==="/api/intake"){
    const body=await request.json().catch(()=>null);
    if(!body||typeof body!=="object") return json({ok:false,error:"invalid payload"},400);
    // Integration is deliberately disabled until owner connects n8n. Never auto-send.
    if(env.DB){await env.DB.prepare("INSERT INTO audit_intake (payload_json, created_at) VALUES (?, datetime('now'))").bind(JSON.stringify(body)).run();}
    return json({ok:true,status:"queued",storage:env.DB?"d1":"demo",external_action:"none"},202);
  }
  return json({ok:false,error:"not_found"},404);
}};

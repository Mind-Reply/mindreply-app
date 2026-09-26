import { NextResponse } from "next/server";
const routes=["/","/pricing","/contact","/checkout","/agent","/dashboard"];
export async function GET(){return NextResponse.json({mode:"DEMO",checkedAt:new Date().toISOString(),routes:routes.map(path=>({path,status:"UNVERIFIED"}))});}
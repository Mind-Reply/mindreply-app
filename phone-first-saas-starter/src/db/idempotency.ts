import { prisma } from "@/lib/prisma";
export async function claimIdempotency(key:string){try{return {claimed:!!(await prisma.idempotencyRecord.create({data:{key}}))};}catch(error){if((error as {code?:string}).code==="P2002")return {claimed:false};throw error;}}
export async function saveIdempotencyResult(key:string,result:unknown){return prisma.idempotencyRecord.update({where:{key},data:{result:result as object}});}

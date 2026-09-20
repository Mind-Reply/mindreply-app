import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export async function requireRole(clerkId:string, role:Role){const user=await prisma.user.findUnique({where:{clerkId}});if(!user||user.role!==role)throw new Error("FORBIDDEN");return user;}
export async function requireAdmin(clerkId:string){return requireRole(clerkId,Role.ADMIN);}

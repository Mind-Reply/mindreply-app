"use server";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "../middleware/validation";
export async function createProject(input:unknown){const clerkId=await requireAuth();const parsed=projectSchema.safeParse(input);if(!parsed.success)return {ok:false,error:parsed.error.flatten()};const user=await prisma.user.upsert({where:{clerkId},update:{},create:{clerkId}});if(!user.organizationId)return {ok:false,error:"Create or join an organization first"};const project=await prisma.project.create({data:{...parsed.data,organizationId:user.organizationId,ownerId:user.id}});return {ok:true,project};}
export async function ensureCurrentUser(){await syncCurrentUser();return {ok:true};}

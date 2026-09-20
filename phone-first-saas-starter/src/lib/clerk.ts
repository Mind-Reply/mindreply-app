import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
export async function requireAuth(){const {userId}=await auth();if(!userId)throw new Error("UNAUTHORIZED");return userId;}
export async function syncCurrentUser(){const user=await currentUser();if(!user)throw new Error("UNAUTHORIZED");const email=user.emailAddresses[0]?.emailAddress;const existing=await prisma.user.findUnique({where:{clerkId:user.id}});if(existing)return prisma.user.update({where:{id:existing.id},data:{email}});const organization=await prisma.organization.create({data:{name:`${user.firstName??"My"} Workspace`}});return prisma.user.create({data:{clerkId:user.id,email,organizationId:organization.id}});}

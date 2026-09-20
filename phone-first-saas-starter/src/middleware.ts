import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtected=createRouteMatcher(["/dashboard(.*)","/settings(.*)","/api/webhooks/stripe(.*)"]);
export default clerkMiddleware(async(auth,req)=>{if(isProtected(req)&&req.nextUrl.pathname.startsWith("/api/webhooks/stripe"))return; if(isProtected(req))await auth.protect();});
export const config={matcher:["/(?!_next|.*\\..*).*"]};

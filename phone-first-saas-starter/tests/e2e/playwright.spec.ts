import { test,expect } from "@playwright/test";
test("phone-first landing loads",async({page})=>{await page.goto("/");await expect(page.getByText("Phone-first SaaS starter")).toBeVisible();});
test.describe("authenticated flow",()=>{test.skip("sign up, create project, and Stripe test checkout",async()=>{ /* Configure Clerk test credentials/session. Use Stripe CLI forwarding and Stripe test price. */ });});

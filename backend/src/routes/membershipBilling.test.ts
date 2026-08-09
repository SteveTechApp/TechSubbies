import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import request from "supertest";

process.env.DB_FILE=path.join(process.cwd(),"data",`test-membership-${randomUUID()}.db`);
process.env.JWT_SECRET="membership-test-secret-at-least-32-characters";
const {createApp}=await import("../app.js");
const app=createApp();
const {hasOpenMembershipInvoice}=await import("../domain/membershipInvoice.js");

async function register(role:"Engineer"|"Company",email:string){const response=await request(app).post("/api/auth/register").send({email,password:"correct-horse-battery-staple",role,name:"Membership Test"});return response.body.token as string;}

describe("membership billing boundary",()=>{
  it("does not allow company accounts to buy engineer memberships",async()=>{const token=await register("Company","membership-company@example.com");const response=await request(app).post("/api/membership/checkout").set("Authorization",`Bearer ${token}`).send({plan:"skills"});expect(response.status).toBe(403);});
  it("rejects unsupported membership plans",async()=>{const token=await register("Engineer","membership-engineer@example.com");const response=await request(app).post("/api/membership/checkout").set("Authorization",`Bearer ${token}`).send({plan:"job-payment"});expect(response.status).toBe(400);});
  it("rejects unsigned payment webhooks",async()=>{const response=await request(app).post("/api/membership/webhook").set("Content-Type","application/json").send(JSON.stringify({type:"checkout.session.completed"}));expect(response.status).toBe(400);expect(response.body.error).toMatch(/signature/i);});
  it("detects only matching open invoices from persisted provider data",()=>{expect(hasOpenMembershipInvoice([{plan:"skills",status:"open"},null,{plan:"professional",status:"paid"}],"skills")).toBe(true);expect(hasOpenMembershipInvoice([{plan:"skills",status:"paid"},"invalid"],"skills")).toBe(false);expect(hasOpenMembershipInvoice({invoices:[]},"skills")).toBe(false);});
});

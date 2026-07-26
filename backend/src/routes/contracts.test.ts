import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-contracts.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { createUser } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const app = createApp();

async function registerAs(role: string, email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role,
    name,
    profileData: {},
  });
  return { token: res.body.token as string, id: res.body.user.id as string };
}

const registerCompany = (email: string, name: string) => registerAs("Company", email, name);
const registerEngineer = (email: string, name: string) => registerAs("Engineer", email, name);
const registerAdmin = async (email: string, name: string) => {
  // Admins are provisioned internally; public registration deliberately
  // rejects this role.
  const user = createUser({
    email,
    password: "not-used-by-this-test",
    role: "Admin",
    name,
    profile: JSON.stringify({ name, contact: { email } }),
  });
  return { token: signToken(user.id), id: user.id };
};

function sampleContractBody(engineerId: string) {
  return {
    jobId: "job-1",
    engineerId,
    jobTitle: "AV Install Engineer",
    type: "Statement of Work",
    description: "Boilerplate terms...",
    amount: 750,
    currency: "£",
    milestones: [
      { id: "ms-1", description: "Initial rack build", amount: 250 },
      { id: "ms-2", description: "Commissioning", amount: 500 },
    ],
  };
}

describe("contracts: creation", () => {
  it("lets a company create a contract, starting Pending Signature with milestones Awaiting Funding", async () => {
    const company = await registerCompany("contracts-co-a@example.com", "Contract Co A");
    const engineer = await registerEngineer("contracts-eng-a@example.com", "Contract Eng A");

    const res = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("Pending Signature");
    expect(res.body.companyId).toBe(company.id);
    expect(res.body.engineerId).toBe(engineer.id);
    expect(res.body.milestones).toHaveLength(2);
    expect(res.body.milestones.every((m: any) => m.status === "Awaiting Funding")).toBe(true);
    expect(res.body.engineerSignature).toBeNull();
    expect(res.body.companySignature).toBeNull();
  });

  it("rejects contract creation from an engineer account", async () => {
    const engineer = await registerEngineer("contracts-eng-b@example.com", "Contract Eng B");
    const otherEngineer = await registerEngineer("contracts-eng-c@example.com", "Contract Eng C");

    const res = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send(sampleContractBody(otherEngineer.id));

    expect(res.status).toBe(403);
  });
});

describe("contracts: signing", () => {
  it("only lets the engineer sign first, then the company countersign to activate", async () => {
    const company = await registerCompany("contracts-co-b@example.com", "Contract Co B");
    const engineer = await registerEngineer("contracts-eng-d@example.com", "Contract Eng D");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));
    const contractId = created.body.id;

    // Company can't countersign before the engineer has signed.
    const earlyCompanySign = await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ signatureName: "Company Rep" });
    expect(earlyCompanySign.status).toBe(409);

    const engineerSign = await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ signatureName: "Contract Eng D" });
    expect(engineerSign.status).toBe(200);
    expect(engineerSign.body.status).toBe("Signed by Engineer");
    expect(engineerSign.body.engineerSignature.name).toBe("Contract Eng D");

    // Engineer can't sign again.
    const dupeEngineerSign = await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ signatureName: "Contract Eng D" });
    expect(dupeEngineerSign.status).toBe(409);

    const companySign = await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ signatureName: "Company Rep" });
    expect(companySign.status).toBe(200);
    expect(companySign.body.status).toBe("Active");
    expect(companySign.body.companySignature.name).toBe("Company Rep");
  });

  it("lets an admin countersign on the company's behalf", async () => {
    const company = await registerCompany("contracts-co-c@example.com", "Contract Co C");
    const engineer = await registerEngineer("contracts-eng-e@example.com", "Contract Eng E");
    const admin = await registerAdmin("contracts-admin-a@example.com", "Contract Admin A");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));
    const contractId = created.body.id;

    await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ signatureName: "Contract Eng E" });

    const adminSign = await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ signatureName: "Platform Admin" });
    expect(adminSign.status).toBe(200);
    expect(adminSign.body.status).toBe("Active");
  });

  it("rejects a signature attempt from someone who isn't a party to the contract", async () => {
    const company = await registerCompany("contracts-co-d@example.com", "Contract Co D");
    const engineer = await registerEngineer("contracts-eng-f@example.com", "Contract Eng F");
    const stranger = await registerEngineer("contracts-eng-g@example.com", "Contract Eng G");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));

    const res = await request(app)
      .patch(`/api/contracts/${created.body.id}/sign`)
      .set("Authorization", `Bearer ${stranger.token}`)
      .send({ signatureName: "Stranger" });
    expect(res.status).toBe(403);
  });
});

describe("contracts: milestones", () => {
  async function setUpActiveContract() {
    const company = await registerCompany(`contracts-co-ms-${Date.now()}@example.com`, "Contract Co MS");
    const engineer = await registerEngineer(`contracts-eng-ms-${Date.now()}@example.com`, "Contract Eng MS");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));
    const contractId = created.body.id;
    const milestoneId = created.body.milestones[0].id;

    await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ signatureName: "Eng" });
    await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ signatureName: "Co" });

    return { company, engineer, contractId, milestoneId };
  }

  it("walks a milestone through fund -> submit -> approve, gated by role", async () => {
    const { company, engineer, contractId, milestoneId } = await setUpActiveContract();

    const wrongFunder = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(wrongFunder.status).toBe(403);

    const fund = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(fund.status).toBe(200);
    expect(fund.body.milestones.find((m: any) => m.id === milestoneId).status).toBe("In Progress");

    const wrongSubmitter = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(wrongSubmitter.status).toBe(403);

    const submit = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(submit.status).toBe(200);
    expect(submit.body.milestones.find((m: any) => m.id === milestoneId).status).toBe("Submitted for Approval");

    const approve = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/approve`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(approve.status).toBe(200);
    expect(approve.body.milestones.find((m: any) => m.id === milestoneId).status).toBe("Approved - Pending Invoice");
  });

  it("rejects funding a milestone that isn't awaiting funding", async () => {
    const { company, contractId, milestoneId } = await setUpActiveContract();

    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`)
      .set("Authorization", `Bearer ${company.token}`);

    const secondFund = await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(secondFund.status).toBe(409);
  });
});

describe("contracts: timesheets and invoicing", () => {
  async function setUpActiveContract() {
    const company = await registerCompany(`contracts-co-ts-${Date.now()}@example.com`, "Contract Co TS");
    const engineer = await registerEngineer(`contracts-eng-ts-${Date.now()}@example.com`, "Contract Eng TS");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));
    const contractId = created.body.id;

    await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ signatureName: "Eng" });
    await request(app)
      .patch(`/api/contracts/${contractId}/sign`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ signatureName: "Co" });

    return { company, engineer, contractId };
  }

  it("lets the engineer submit a timesheet and the company approve & pay it", async () => {
    const { company, engineer, contractId } = await setUpActiveContract();

    const wrongSubmitter = await request(app)
      .post(`/api/contracts/${contractId}/timesheets`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ period: "Week 1", days: 5 });
    expect(wrongSubmitter.status).toBe(403);

    const submit = await request(app)
      .post(`/api/contracts/${contractId}/timesheets`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ period: "Week 1", days: 5 });
    expect(submit.status).toBe(201);
    const timesheetId = submit.body.timesheets[0].id;
    expect(submit.body.timesheets[0].status).toBe("submitted");

    const wrongApprover = await request(app)
      .patch(`/api/contracts/${contractId}/timesheets/${timesheetId}/approve`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(wrongApprover.status).toBe(403);

    const approve = await request(app)
      .patch(`/api/contracts/${contractId}/timesheets/${timesheetId}/approve`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(approve.status).toBe(200);
    expect(approve.body.timesheets[0].status).toBe("paid");
  });

  it("lets the engineer invoice approved milestones and blocks it when none are approved", async () => {
    const { company, engineer, contractId } = await setUpActiveContract();

    const noMilestones = await request(app)
      .post(`/api/contracts/${contractId}/invoices`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ paymentTerms: "Net 14 Days" });
    expect(noMilestones.status).toBe(409);

    const contract = await request(app)
      .get(`/api/contracts/${contractId}`)
      .set("Authorization", `Bearer ${company.token}`);
    const milestoneId = contract.body.milestones[0].id;

    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`)
      .set("Authorization", `Bearer ${company.token}`);
    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`)
      .set("Authorization", `Bearer ${engineer.token}`);
    await request(app)
      .patch(`/api/contracts/${contractId}/milestones/${milestoneId}/approve`)
      .set("Authorization", `Bearer ${company.token}`);

    const wrongInvoicer = await request(app)
      .post(`/api/contracts/${contractId}/invoices`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ paymentTerms: "Net 14 Days" });
    expect(wrongInvoicer.status).toBe(403);

    const invoice = await request(app)
      .post(`/api/contracts/${contractId}/invoices`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ paymentTerms: "Net 14 Days" });
    expect(invoice.status).toBe(201);
    expect(invoice.body.total).toBe(250);
    expect(invoice.body.items).toHaveLength(1);

    const updatedContract = await request(app)
      .get(`/api/contracts/${contractId}`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(updatedContract.body.milestones.find((m: any) => m.id === milestoneId).status).toBe("Completed & Paid");

    const myInvoices = await request(app)
      .get("/api/invoices/me")
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(myInvoices.status).toBe(200);
    expect(myInvoices.body).toHaveLength(1);
  });
});

describe("contracts: listing and access control", () => {
  it("lists a contract under /me for both the company and the engineer, and blocks everyone else", async () => {
    const company = await registerCompany("contracts-co-list@example.com", "Contract Co List");
    const engineer = await registerEngineer("contracts-eng-list@example.com", "Contract Eng List");
    const stranger = await registerEngineer("contracts-eng-list-stranger@example.com", "Stranger");

    const created = await request(app)
      .post("/api/contracts")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleContractBody(engineer.id));

    const companyList = await request(app).get("/api/contracts/me").set("Authorization", `Bearer ${company.token}`);
    expect(companyList.body.some((c: any) => c.id === created.body.id)).toBe(true);

    const engineerList = await request(app).get("/api/contracts/me").set("Authorization", `Bearer ${engineer.token}`);
    expect(engineerList.body.some((c: any) => c.id === created.body.id)).toBe(true);

    const strangerView = await request(app)
      .get(`/api/contracts/${created.body.id}`)
      .set("Authorization", `Bearer ${stranger.token}`);
    expect(strangerView.status).toBe(403);
  });
});

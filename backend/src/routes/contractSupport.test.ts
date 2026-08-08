import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-contract-support.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const { createApp } = await import("../app.js");
const { createUser, markEmailVerified } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const app = createApp();

async function registerAs(role: string, email: string, name: string) {
  const response = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role,
    name,
    profileData: {},
  });
  markEmailVerified(response.body.user.id);
  return { id: response.body.user.id as string, token: response.body.token as string };
}

async function registerAdmin() {
  const user = createUser({
    email: "contract-support-admin@example.com",
    password: "not-used",
    role: "Admin",
    name: "Support Admin",
    profile: JSON.stringify({ name: "Support Admin" }),
  });
  markEmailVerified(user.id);
  return { id: user.id, token: signToken(user.id) };
}

const sampleJob = {
  title: "AV Commissioning Engineer",
  description: "Commission meeting rooms and validate final system performance.",
  location: "London",
  dayRate: "350",
  duration: "2 days",
  currency: "£",
  startDate: null,
  jobType: "Contract",
  experienceLevel: "Senior",
  jobRole: "AV Engineer",
  skillRequirements: [],
};

async function createContract(company: { token: string }, engineer: { token: string; id: string }) {
  const job = await request(app)
    .post("/api/jobs")
    .set("Authorization", `Bearer ${company.token}`)
    .send(sampleJob);
  const application = await request(app)
    .post(`/api/jobs/${job.body.id}/apply`)
    .set("Authorization", `Bearer ${engineer.token}`);
  await request(app)
    .patch(`/api/applications/${application.body.id}`)
    .set("Authorization", `Bearer ${company.token}`)
    .send({ status: "Offered" });
  return request(app)
    .post("/api/contracts")
    .set("Authorization", `Bearer ${company.token}`)
    .send({
      jobId: job.body.id,
      engineerId: engineer.id,
      type: "Day Rate",
      description: "Direct contract between company and engineer.",
      amount: 700,
      currency: "£",
      milestones: [],
    });
}

describe("contract support workflows", () => {
  it("requires both parties to agree before a cancellation changes the contract", async () => {
    const company = await registerAs("Company", "support-company-a@example.com", "Support Company A");
    const engineer = await registerAs("Engineer", "support-engineer-a@example.com", "Support Engineer A");
    const contract = await createContract(company, engineer);
    expect(contract.status).toBe(201);

    const cancellation = await request(app)
      .post("/api/contract-support")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        contractId: contract.body.id,
        caseType: "cancellation",
        summary: "Unable to attend agreed dates",
        details: "I can no longer attend the agreed project dates and need to request cancellation.",
      });
    expect(cancellation.status).toBe(201);
    expect(cancellation.body.case.status).toBe("awaiting_other_party");

    const declined = await request(app)
      .post(`/api/contract-support/${cancellation.body.case.id}/respond`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ decision: "decline", note: "We need TechSubbies support to review the cancellation impact." });
    expect(declined.status).toBe(200);
    expect(declined.body.case.status).toBe("under_review");

    const unchanged = await request(app)
      .get(`/api/contracts/${contract.body.id}`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(unchanged.body.status).toBe("Pending Signature");
  });

  it("records an agreed cancellation and marks the contract Cancelled", async () => {
    const company = await registerAs("Company", "support-company-b@example.com", "Support Company B");
    const engineer = await registerAs("Engineer", "support-engineer-b@example.com", "Support Engineer B");
    const contract = await createContract(company, engineer);

    const cancellation = await request(app)
      .post("/api/contract-support")
      .set("Authorization", `Bearer ${company.token}`)
      .send({
        contractId: contract.body.id,
        caseType: "cancellation",
        summary: "Project date has been withdrawn",
        details: "The end client has withdrawn the agreed project date and both parties need to cancel.",
      });

    const accepted = await request(app)
      .post(`/api/contract-support/${cancellation.body.case.id}/respond`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ decision: "accept", note: "Agreed. Please record the contract as cancelled." });
    expect(accepted.status).toBe(200);
    expect(accepted.body.case.status).toBe("resolved");
    expect(accepted.body.case.resolution).toMatch(/financial settlement remains between the parties/i);

    const cancelledContract = await request(app)
      .get(`/api/contracts/${contract.body.id}`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(cancelledContract.body.status).toBe("Cancelled");
  });

  it("routes no-shows and disputes into an Admin support queue", async () => {
    const company = await registerAs("Company", "support-company-c@example.com", "Support Company C");
    const engineer = await registerAs("Engineer", "support-engineer-c@example.com", "Support Engineer C");
    const admin = await registerAdmin();
    const contract = await createContract(company, engineer);

    const noShow = await request(app)
      .post("/api/contract-support")
      .set("Authorization", `Bearer ${company.token}`)
      .send({
        contractId: contract.body.id,
        caseType: "no_show",
        summary: "Engineer did not arrive on site",
        details: "The engineer did not arrive at the agreed site by the confirmed start time and could not be reached.",
      });
    expect(noShow.status).toBe(201);
    expect(noShow.body.case.status).toBe("under_review");

    const queue = await request(app)
      .get("/api/admin/contract-support")
      .set("Authorization", `Bearer ${admin.token}`);
    expect(queue.status).toBe(200);
    expect(queue.body.cases).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: noShow.body.case.id, caseType: "no_show", openedByName: "Support Company C" }),
    ]));

    const resolved = await request(app)
      .post(`/api/admin/contract-support/${noShow.body.case.id}/resolve`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ resolution: "Support contacted both parties and recorded the agreed next steps. No financial outcome was determined by TechSubbies." });
    expect(resolved.status).toBe(200);
    expect(resolved.body.case.status).toBe("resolved");
  });
});

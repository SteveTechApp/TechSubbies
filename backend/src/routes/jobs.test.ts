import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-jobs.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { markEmailVerified } = await import("../lib/db.js");
const { developmentEmailOutbox } = await import("../lib/email.js");
const app = createApp();

async function registerCompany(email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role: "Company",
    name,
    profileData: {},
  });
  markEmailVerified(res.body.user.id);
  return { token: res.body.token as string, id: res.body.user.id as string };
}

async function registerEngineer(email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role: "Engineer",
    name,
    profileData: {},
  });
  markEmailVerified(res.body.user.id);
  return { token: res.body.token as string, id: res.body.user.id as string };
}

const sampleJob = {
  title: "AV Install Engineer",
  description: "Boardroom AV install, 3 days.",
  location: "London, UK",
  dayRate: "250",
  duration: "3 days",
  currency: "£",
  startDate: null,
  jobType: "Contract",
  experienceLevel: "Senior",
  jobRole: "senior-av-installer",
  skillRequirements: [{ name: "Crestron", importance: "must-have" }],
};

describe("marketplace email verification", () => {
  it("blocks an unverified account from creating marketplace state", async () => {
    const registered = await request(app).post("/api/auth/register").send({
      email: "unverified-company@example.com",
      password: "correcthorsebattery",
      role: "Company",
      name: "Unverified Company",
      profileData: {},
    });

    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${registered.body.token}`)
      .send(sampleJob);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "Verify your email address before performing marketplace actions.",
      code: "EMAIL_VERIFICATION_REQUIRED",
    });
  });

  it("keeps public marketplace reads available without verification", async () => {
    const response = await request(app).get("/api/jobs");

    expect(response.status).toBe(200);
  });
});

describe("jobs", () => {
  it("rejects malformed skill requirements at the API boundary", async () => {
    const company = await registerCompany("jobs-invalid-skills@example.com", "Invalid Skills Co");
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send({ ...sampleJob, skillRequirements: [{ name: "Crestron", importance: "critical", requiredLevel: 120 }] });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/invalid enum value|less than or equal to 100/i);
  });

  it("lets a company post a job and lists it publicly", async () => {
    const company = await registerCompany("jobs-co-a@example.com", "Job Co A");

    const postRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    expect(postRes.status).toBe(201);
    expect(postRes.body.companyId).toBe(company.id);
    expect(postRes.body.status).toBe("active");
    expect(postRes.body.canonicalRoleId).toBe("av-lead-engineer-site-manager");

    const listRes = await request(app).get("/api/jobs");
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((j: any) => j.id === postRes.body.id)).toBe(true);
  });

  it("rejects an invalid canonical role supplied by a client", async () => {
    const company = await registerCompany("jobs-co-invalid-role@example.com", "Invalid Role Co");
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send({ ...sampleJob, canonicalRoleId: "made-up-role" });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/recognized canonical role/i);
  });

  it("persists the supervision self-declaration fields for junior/support roles", async () => {
    const company = await registerCompany("jobs-co-supervision@example.com", "Job Co Supervision");

    const postRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send({
        ...sampleJob,
        experienceLevel: "Junior",
        supervisionArrangement: "lead_engineer_present",
        supervisionDisclaimerAccepted: true,
      });

    expect(postRes.status).toBe(201);
    expect(postRes.body.supervisionArrangement).toBe("lead_engineer_present");
    expect(postRes.body.supervisionDisclaimerAccepted).toBe(true);
  });

  it("rejects job postings from non-company accounts", async () => {
    const engineer = await registerEngineer("jobs-eng-reject@example.com", "Eng Reject");

    const postRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send(sampleJob);

    expect(postRes.status).toBe(403);
  });

  it("rejects an incomplete job posting", async () => {
    const company = await registerCompany("jobs-co-incomplete@example.com", "Job Co Incomplete");

    const postRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send({ title: "Missing fields" });

    expect(postRes.status).toBe(400);
  });

  it("only lets the posting company update its own job", async () => {
    const company = await registerCompany("jobs-co-b@example.com", "Job Co B");
    const otherCompany = await registerCompany("jobs-co-c@example.com", "Job Co C");

    const postRes = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    const wrongUpdate = await request(app)
      .patch(`/api/jobs/${postRes.body.id}`)
      .set("Authorization", `Bearer ${otherCompany.token}`)
      .send({ status: "closed" });
    expect(wrongUpdate.status).toBe(403);

    const rightUpdate = await request(app)
      .patch(`/api/jobs/${postRes.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "closed" });
    expect(rightUpdate.status).toBe(200);
    expect(rightUpdate.body.status).toBe("closed");

    const hiddenDirectly = await request(app).get(`/api/jobs/${postRes.body.id}`);
    expect(hiddenDirectly.status).toBe(404);

    const ownedJobs = await request(app)
      .get("/api/jobs/mine")
      .set("Authorization", `Bearer ${company.token}`);
    expect(ownedJobs.status).toBe(200);
    expect(ownedJobs.body.some((job: { id: string; status: string }) =>
      job.id === postRes.body.id && job.status === "closed"
    )).toBe(true);

    const otherOwnedJobs = await request(app)
      .get("/api/jobs/mine")
      .set("Authorization", `Bearer ${otherCompany.token}`);
    expect(otherOwnedJobs.body.some((job: { id: string }) => job.id === postRes.body.id)).toBe(false);
  });
});

describe("company application feed", () => {
  it("returns persisted applicants only for jobs owned by the signed-in company", async () => {
    const company = await registerCompany("application-feed-company@example.com", "Application Feed Company");
    const otherCompany = await registerCompany("application-feed-other@example.com", "Other Feed Company");
    const engineer = await registerEngineer("application-feed-engineer@example.com", "Application Feed Engineer");

    const posted = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);
    await request(app)
      .post(`/api/jobs/${posted.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    const owned = await request(app)
      .get("/api/applications/company")
      .set("Authorization", `Bearer ${company.token}`);
    expect(owned.status).toBe(200);
    expect(owned.body).toEqual([
      expect.objectContaining({ jobId: posted.body.id, engineerId: engineer.id }),
    ]);

    const other = await request(app)
      .get("/api/applications/company")
      .set("Authorization", `Bearer ${otherCompany.token}`);
    expect(other.status).toBe(200);
    expect(other.body).toEqual([]);

    expect((await request(app)
      .get("/api/applications/company")
      .set("Authorization", `Bearer ${engineer.token}`)).status).toBe(403);
  });

  it("lets only the posting company progress an application through valid statuses", async () => {
    const company = await registerCompany("application-status-company@example.com", "Application Status Company");
    const otherCompany = await registerCompany("application-status-other@example.com", "Other Status Company");
    const engineer = await registerEngineer("application-status-engineer@example.com", "Application Status Engineer");

    const posted = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);
    const applied = await request(app)
      .post(`/api/jobs/${posted.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    const forbidden = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${otherCompany.token}`)
      .send({ status: "Viewed" });
    expect(forbidden.status).toBe(403);

    const viewed = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Viewed" });
    expect(viewed.status).toBe(200);
    expect(viewed.body).toEqual(expect.objectContaining({
      id: applied.body.id,
      status: "Viewed",
      reviewed: true,
      notificationSent: false,
    }));

    const offered = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Offered" });
    expect(offered.status).toBe(200);
    expect(offered.body.status).toBe("Offered");
    expect(offered.body.notificationSent).toBe(true);
    expect(developmentEmailOutbox.some((email: { to: string; subject: string; text: string }) =>
      email.to === "application-status-engineer@example.com"
      && email.subject.includes("offer for AV Install Engineer")
      && email.text.includes("Sign in to review")
    )).toBe(true);

    const hired = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Hired" });
    expect(hired.status).toBe(200);
    expect(hired.body.status).toBe("Hired");

    const reversed = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Rejected" });
    expect(reversed.status).toBe(409);

    const ownFeed = await request(app)
      .get("/api/applications/me")
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(ownFeed.body).toEqual([
      expect.objectContaining({
        id: applied.body.id,
        status: "Hired",
        reviewed: true,
        jobTitle: "AV Install Engineer",
        jobLocation: "London, UK",
        companyName: "Application Status Company",
      }),
    ]);
  });

  it("validates application status updates and blocks engineer updates", async () => {
    const company = await registerCompany("application-validation-company@example.com", "Validation Company");
    const engineer = await registerEngineer("application-validation-engineer@example.com", "Validation Engineer");
    const posted = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);
    const applied = await request(app)
      .post(`/api/jobs/${posted.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    expect((await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Completed" })).status).toBe(400);

    expect((await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ status: "Viewed" })).status).toBe(403);
  });

  it("persists rejection decisions and notifies the engineer", async () => {
    const company = await registerCompany("application-rejection-company@example.com", "Rejection Company");
    const engineer = await registerEngineer("application-rejection-engineer@example.com", "Rejection Engineer");
    const posted = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);
    const applied = await request(app)
      .post(`/api/jobs/${posted.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    const rejected = await request(app)
      .patch(`/api/applications/${applied.body.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ status: "Rejected" });

    expect(rejected.status).toBe(200);
    expect(rejected.body).toEqual(expect.objectContaining({
      status: "Rejected",
      reviewed: true,
      notificationSent: true,
    }));
    expect(developmentEmailOutbox.some((email: { to: string; subject: string }) =>
      email.to === "application-rejection-engineer@example.com"
      && email.subject.includes("Update on your application")
    )).toBe(true);
  });
});

describe("applications", () => {
  it("lets an engineer apply once, and blocks a duplicate application", async () => {
    const company = await registerCompany("jobs-co-d@example.com", "Job Co D");
    const engineer = await registerEngineer("jobs-eng-a@example.com", "Eng A");

    const job = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    const applyRes = await request(app)
      .post(`/api/jobs/${job.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(applyRes.status).toBe(201);
    expect(applyRes.body.status).toBe("Applied");

    const dupeRes = await request(app)
      .post(`/api/jobs/${job.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(dupeRes.status).toBe(409);
  });

  it("rejects applications from non-engineer accounts", async () => {
    const company = await registerCompany("jobs-co-e@example.com", "Job Co E");
    const otherCompany = await registerCompany("jobs-co-f@example.com", "Job Co F");

    const job = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    const applyRes = await request(app)
      .post(`/api/jobs/${job.body.id}/apply`)
      .set("Authorization", `Bearer ${otherCompany.token}`);
    expect(applyRes.status).toBe(403);
  });

  it("only lets the posting company see its job's applicants", async () => {
    const company = await registerCompany("jobs-co-g@example.com", "Job Co G");
    const otherCompany = await registerCompany("jobs-co-h@example.com", "Job Co H");
    const engineer = await registerEngineer("jobs-eng-b@example.com", "Eng B");

    const job = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    await request(app)
      .post(`/api/jobs/${job.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    const wrongView = await request(app)
      .get(`/api/jobs/${job.body.id}/applications`)
      .set("Authorization", `Bearer ${otherCompany.token}`);
    expect(wrongView.status).toBe(403);

    const rightView = await request(app)
      .get(`/api/jobs/${job.body.id}/applications`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(rightView.status).toBe(200);
    expect(rightView.body).toHaveLength(1);
    expect(rightView.body[0].engineerId).toBe(engineer.id);
  });

  it("lets an engineer list their own applications", async () => {
    const company = await registerCompany("jobs-co-i@example.com", "Job Co I");
    const engineer = await registerEngineer("jobs-eng-c@example.com", "Eng C");

    const job = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${company.token}`)
      .send(sampleJob);

    await request(app)
      .post(`/api/jobs/${job.body.id}/apply`)
      .set("Authorization", `Bearer ${engineer.token}`);

    const mineRes = await request(app)
      .get("/api/applications/me")
      .set("Authorization", `Bearer ${engineer.token}`);

    expect(mineRes.status).toBe(200);
    expect(mineRes.body).toHaveLength(1);
    expect(mineRes.body[0].jobId).toBe(job.body.id);
  });
});

import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-taxonomy.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const { createApp } = await import("../app.js");
const { createUser, markEmailVerified } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const app = createApp();

let adminToken: string;

beforeAll(async () => {
  const password = await bcrypt.hash("correcthorsebattery", 10);
  const admin = createUser({
    email: "taxonomy-admin@example.com",
    password,
    role: "Admin",
    name: "Taxonomy Admin",
    profile: "{}",
  });
  adminToken = signToken(admin.id);
});

async function register(role: "Engineer" | "Company", email: string, name: string, verify = true) {
  const response = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role,
    name,
    profileData: {},
  });
  if (verify) markEmailVerified(response.body.user.id);
  return { id: response.body.user.id as string, token: response.body.token as string };
}

const snapshot = {
  id: "av-test-role",
  market: "av",
  family: "installation",
  title: "AV Test Engineer",
  shortTitle: "Test Engineer",
  level: "skilled",
  summary: "Installs and validates representative AV systems for controlled taxonomy testing.",
  suitableFor: ["Meeting rooms"],
  typicalProjects: ["Corporate AV installation"],
  recommendedTags: ["HDMI"],
  evidenceTypes: ["Project evidence"],
  skillGroups: [{
    id: "av-test-role:group-1",
    title: "Installation",
    description: "Core installation capability.",
    skills: [{
      id: "av-test-role:termination",
      label: "Cable termination",
      description: "Terminates and validates AV cabling.",
      requiredForGoodMatch: true,
      evidenceRecommended: true,
      suggestedTags: ["termination"],
    }],
  }],
};

describe("taxonomy governance", () => {
  it("requires practitioner approval before an Admin can publish a role version", async () => {
    const engineer = await register("Engineer", "taxonomy-engineer@example.com", "Taxonomy Engineer");

    const created = await request(app)
      .post("/api/admin/taxonomy/versions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        roleId: snapshot.id,
        snapshot,
        changeNote: "Create a controlled test role for practitioner review.",
      });
    expect(created.status).toBe(201);
    expect(created.body.version.version).toBe(1);
    expect(created.body.version.status).toBe("draft");

    const submitted = await request(app)
      .post(`/api/admin/taxonomy/versions/${created.body.version.id}/submit`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(submitted.status).toBe(200);
    expect(submitted.body.version.status).toBe("in_review");

    const blockedPublish = await request(app)
      .post(`/api/admin/taxonomy/versions/${created.body.version.id}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(blockedPublish.status).toBe(409);

    const pending = await request(app)
      .get("/api/taxonomy/reviews/pending")
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(pending.status).toBe(200);
    expect(pending.body.versions).toContainEqual(expect.objectContaining({
      id: created.body.version.id,
      roleId: snapshot.id,
      status: "in_review",
    }));

    const approved = await request(app)
      .post(`/api/taxonomy/reviews/${created.body.version.id}`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        decision: "approved",
        note: "The responsibilities and expected installation capability are representative.",
      });
    expect(approved.status).toBe(200);
    expect(approved.body.version.status).toBe("approved");
    expect(approved.body.version.reviews[0].decision).toBe("approved");

    const published = await request(app)
      .post(`/api/admin/taxonomy/versions/${created.body.version.id}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(published.status).toBe(200);
    expect(published.body.version.status).toBe("published");

    const publicList = await request(app)
      .get("/api/taxonomy/published")
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(publicList.status).toBe(200);
    expect(publicList.body.versions).toContainEqual(expect.objectContaining({
      roleId: snapshot.id,
      version: 1,
      status: "published",
      snapshot: expect.objectContaining({ title: "AV Test Engineer" }),
    }));
  });

  it("keeps Admin editing separate from practitioner review and increments later versions", async () => {
    const engineer = await register("Engineer", "taxonomy-engineer-two@example.com", "Taxonomy Engineer Two");
    const company = await register("Company", "taxonomy-company@example.com", "Taxonomy Company");

    expect((await request(app)
      .post("/api/admin/taxonomy/versions")
      .set("Authorization", `Bearer ${company.token}`)
      .send({ roleId: snapshot.id, snapshot, changeNote: "Company must not edit taxonomy versions." })).status).toBe(403);

    const secondSnapshot = { ...snapshot, summary: `${snapshot.summary} Updated after the first published version.` };
    const second = await request(app)
      .post("/api/admin/taxonomy/versions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ roleId: snapshot.id, snapshot: secondSnapshot, changeNote: "Refine the role summary after practitioner feedback." });
    expect(second.status).toBe(201);
    expect(second.body.version.version).toBe(2);

    await request(app)
      .post(`/api/admin/taxonomy/versions/${second.body.version.id}/submit`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect((await request(app)
      .post(`/api/taxonomy/reviews/${second.body.version.id}`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ decision: "approved", note: "A company account must not approve practitioner definitions." })).status).toBe(403);

    const rejected = await request(app)
      .post(`/api/taxonomy/reviews/${second.body.version.id}`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ decision: "rejected", note: "The revised summary is too broad and needs clearer installation boundaries." });
    expect(rejected.status).toBe(200);
    expect(rejected.body.version.status).toBe("rejected");

    expect((await request(app)
      .post(`/api/admin/taxonomy/versions/${second.body.version.id}/publish`)
      .set("Authorization", `Bearer ${adminToken}`)).status).toBe(409);
  });

  it("requires a verified Engineer account for practitioner review mutations", async () => {
    const engineer = await register("Engineer", "taxonomy-unverified@example.com", "Unverified Reviewer", false);
    const role = { ...snapshot, id: "av-unverified-review-role" };
    role.skillGroups = snapshot.skillGroups.map(group => ({ ...group, id: `${role.id}:group-1`, skills: group.skills.map(skill => ({ ...skill, id: `${role.id}:termination` })) }));

    const created = await request(app)
      .post("/api/admin/taxonomy/versions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ roleId: role.id, snapshot: role, changeNote: "Test verified practitioner enforcement on review submissions." });
    await request(app)
      .post(`/api/admin/taxonomy/versions/${created.body.version.id}/submit`)
      .set("Authorization", `Bearer ${adminToken}`);

    const review = await request(app)
      .post(`/api/taxonomy/reviews/${created.body.version.id}`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ decision: "approved", note: "This should be blocked until the engineer verifies their email." });
    expect(review.status).toBe(403);
  });
});

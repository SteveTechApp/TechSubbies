import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-conversations.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { markEmailVerified } = await import("../lib/db.js");
const app = createApp();

async function registerAs(role: string, email: string, name: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "correcthorsebattery",
    role,
    name,
    profileData: {},
  });
  markEmailVerified(res.body.user.id);
  return { token: res.body.token as string, id: res.body.user.id as string };
}

const registerEngineer = (email: string, name: string) => registerAs("Engineer", email, name);
const registerCompany = (email: string, name: string) => registerAs("Company", email, name);

describe("conversations: starting", () => {
  it("creates a conversation between two users, with both as participants", async () => {
    const engineer = await registerEngineer("convo-eng-a@example.com", "Convo Eng A");
    const company = await registerCompany("convo-co-a@example.com", "Convo Co A");

    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });

    expect(res.status).toBe(201);
    expect(res.body.participantIds.sort()).toEqual([company.id, engineer.id].sort());
  });

  it("returns the same conversation on a second request instead of duplicating it", async () => {
    const engineer = await registerEngineer("convo-eng-b@example.com", "Convo Eng B");
    const company = await registerCompany("convo-co-b@example.com", "Convo Co B");

    const first = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });

    // Started from the other side this time - should still find the same conversation.
    const second = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${company.token}`)
      .send({ otherUserId: engineer.id });

    expect(second.status).toBe(200);
    expect(second.body.id).toBe(first.body.id);
  });

  it("rejects starting a conversation with yourself", async () => {
    const engineer = await registerEngineer("convo-eng-c@example.com", "Convo Eng C");

    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: engineer.id });

    expect(res.status).toBe(400);
  });

  it("rejects starting a conversation with a user that doesn't exist", async () => {
    const engineer = await registerEngineer("convo-eng-d@example.com", "Convo Eng D");

    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: "no-such-user" });

    expect(res.status).toBe(404);
  });
});

describe("conversations: messaging", () => {
  it("lets participants send and read messages, and updates the conversation preview", async () => {
    const engineer = await registerEngineer("convo-eng-e@example.com", "Convo Eng E");
    const company = await registerCompany("convo-co-e@example.com", "Convo Co E");

    const convo = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });
    const conversationId = convo.body.id;

    const sendRes = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ text: "Hi, are you available next week?" });
    expect(sendRes.status).toBe(201);
    expect(sendRes.body.senderId).toBe(engineer.id);
    expect(sendRes.body.text).toBe("Hi, are you available next week?");

    const replyRes = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${company.token}`)
      .send({ text: "Yes, Tuesday works." });
    expect(replyRes.status).toBe(201);

    const historyRes = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body).toHaveLength(2);
    expect(historyRes.body[0].text).toBe("Hi, are you available next week?");
    expect(historyRes.body[1].text).toBe("Yes, Tuesday works.");

    const listRes = await request(app)
      .get("/api/conversations/me")
      .set("Authorization", `Bearer ${company.token}`);
    const listed = listRes.body.find((c: any) => c.id === conversationId);
    expect(listed.lastMessageText).toBe("Yes, Tuesday works.");
  });

  it("rejects sending or reading messages for someone who isn't a participant", async () => {
    const engineer = await registerEngineer("convo-eng-f@example.com", "Convo Eng F");
    const company = await registerCompany("convo-co-f@example.com", "Convo Co F");
    const stranger = await registerEngineer("convo-eng-g@example.com", "Convo Eng G");

    const convo = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });
    const conversationId = convo.body.id;

    const sendRes = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${stranger.token}`)
      .send({ text: "Can I jump in?" });
    expect(sendRes.status).toBe(403);

    const readRes = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${stranger.token}`);
    expect(readRes.status).toBe(403);
  });
});

describe("conversations: listing", () => {
  it("lists conversations for a user ordered by most recent activity", async () => {
    const engineer = await registerEngineer("convo-eng-h@example.com", "Convo Eng H");
    const companyOld = await registerCompany("convo-co-h1@example.com", "Convo Co Old");
    const companyNew = await registerCompany("convo-co-h2@example.com", "Convo Co New");

    const convoOld = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: companyOld.id });

    const convoNew = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: companyNew.id });

    // Send a message on the older conversation so its lastMessageTimestamp
    // becomes more recent than the newer (but silent) one.
    await request(app)
      .post(`/api/conversations/${convoOld.body.id}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ text: "Bumping this one" });

    const listRes = await request(app)
      .get("/api/conversations/me")
      .set("Authorization", `Bearer ${engineer.token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body[0].id).toBe(convoOld.body.id);
    expect(listRes.body.map((c: any) => c.id)).toContain(convoNew.body.id);
  });
});

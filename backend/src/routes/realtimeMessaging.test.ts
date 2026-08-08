import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-realtime-messaging.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../app.js");
const { markEmailVerified } = await import("../lib/db.js");
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
  return { token: response.body.token as string, id: response.body.user.id as string };
}

describe("realtime messaging durable state", () => {
  it("tracks unread messages, persists a notification and clears unread state when opened", async () => {
    const engineer = await registerAs("Engineer", "realtime-eng@example.com", "Realtime Engineer");
    const company = await registerAs("Company", "realtime-co@example.com", "Realtime Company");

    const conversation = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });
    expect(conversation.status).toBe(201);

    const sent = await request(app)
      .post(`/api/conversations/${conversation.body.id}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ text: "Can you confirm tomorrow's site time?" });
    expect(sent.status).toBe(201);
    expect(sent.body.isRead).toBe(false);

    const companyConversations = await request(app)
      .get("/api/conversations/me")
      .set("Authorization", `Bearer ${company.token}`);
    expect(companyConversations.status).toBe(200);
    expect(companyConversations.body[0]).toEqual(expect.objectContaining({
      id: conversation.body.id,
      unreadCount: 1,
    }));

    const notifications = await request(app)
      .get("/api/notifications/me")
      .set("Authorization", `Bearer ${company.token}`);
    expect(notifications.status).toBe(200);
    expect(notifications.body).toEqual([
      expect.objectContaining({
        userId: company.id,
        type: "message",
        text: "Realtime Engineer sent you a message",
        link: "Messages",
        isRead: false,
      }),
    ]);

    const read = await request(app)
      .post(`/api/conversations/${conversation.body.id}/read`)
      .set("Authorization", `Bearer ${company.token}`);
    expect(read.status).toBe(200);
    expect(read.body.unreadCount).toBe(0);
    expect(read.body.messageIds).toEqual([sent.body.id]);

    const history = await request(app)
      .get(`/api/conversations/${conversation.body.id}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(history.body[0]).toEqual(expect.objectContaining({ id: sent.body.id, isRead: true }));

    const afterRead = await request(app)
      .get("/api/conversations/me")
      .set("Authorization", `Bearer ${company.token}`);
    expect(afterRead.body[0].unreadCount).toBe(0);
  });

  it("persists notification read-all state", async () => {
    const engineer = await registerAs("Engineer", "notify-eng@example.com", "Notify Engineer");
    const company = await registerAs("Company", "notify-co@example.com", "Notify Company");
    const conversation = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ otherUserId: company.id });

    await request(app)
      .post(`/api/conversations/${conversation.body.id}/messages`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ text: "One new notification" });

    const readAll = await request(app)
      .post("/api/notifications/read-all")
      .set("Authorization", `Bearer ${company.token}`);
    expect(readAll.status).toBe(200);
    expect(readAll.body.changed).toBe(1);

    const notifications = await request(app)
      .get("/api/notifications/me")
      .set("Authorization", `Bearer ${company.token}`);
    expect(notifications.body[0].isRead).toBe(true);
  });
});

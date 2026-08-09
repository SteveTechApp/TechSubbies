import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { countUnreadMessagesForUser } from "../lib/messagingRepository.js";
import { countUnreadNotifications } from "../lib/notificationRepository.js";
import { subscribeRealtime } from "../lib/realtimeHub.js";

export const realtimeRouter = Router();

realtimeRouter.get("/events", requireAuth, (req: AuthedRequest, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const writeEvent = (type: string, data: unknown, id?: string) => {
    if (id) res.write(`id: ${id}\n`);
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  writeEvent("realtime.connected", {
    unreadMessages: countUnreadMessagesForUser(req.userId!),
    unreadNotifications: countUnreadNotifications(req.userId!),
    connectedAt: new Date().toISOString(),
  });

  const unsubscribe = subscribeRealtime(req.userId!, (event) => {
    writeEvent(event.type, event.payload, event.id);
  });
  const heartbeat = setInterval(() => res.write(": keepalive\n\n"), 25_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  });
});

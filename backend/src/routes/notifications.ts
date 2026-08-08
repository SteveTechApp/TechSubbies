import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
  toPublicNotification,
} from "../lib/notificationRepository.js";
import { publishRealtime } from "../lib/realtimeHub.js";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get("/me", (req: AuthedRequest, res) => {
  return res.json(listNotificationsForUser(req.userId!).map(toPublicNotification));
});

notificationsRouter.patch("/:notificationId/read", (req: AuthedRequest, res) => {
  const notification = markNotificationRead(req.params.notificationId, req.userId!);
  if (!notification) return res.status(404).json({ error: "Notification not found." });
  const publicNotification = toPublicNotification(notification);
  publishRealtime(req.userId!, "notification.read", { notification: publicNotification });
  return res.json(publicNotification);
});

notificationsRouter.post("/read-all", (req: AuthedRequest, res) => {
  const changed = markAllNotificationsRead(req.userId!);
  publishRealtime(req.userId!, "notification.read", { all: true, changed });
  return res.json({ changed });
});

import { describe, expect, it, vi } from "vitest";
import { activeRealtimeConnections, publishRealtime, subscribeRealtime } from "./realtimeHub.js";

describe("realtimeHub", () => {
  it("delivers events only to the intended user and unsubscribes cleanly", () => {
    const userA = vi.fn();
    const userB = vi.fn();
    const unsubscribeA = subscribeRealtime("user-a", userA);
    const unsubscribeB = subscribeRealtime("user-b", userB);

    expect(activeRealtimeConnections()).toBe(2);
    publishRealtime("user-a", "notification.created", { notificationId: "n-1" });

    expect(userA).toHaveBeenCalledTimes(1);
    expect(userA.mock.calls[0][0]).toEqual(expect.objectContaining({
      type: "notification.created",
      userId: "user-a",
      payload: { notificationId: "n-1" },
    }));
    expect(userB).not.toHaveBeenCalled();

    unsubscribeA();
    expect(activeRealtimeConnections("user-a")).toBe(0);
    publishRealtime("user-a", "notification.created", { notificationId: "n-2" });
    expect(userA).toHaveBeenCalledTimes(1);

    unsubscribeB();
    expect(activeRealtimeConnections()).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const regularUser: AuthenticatedUser = {
  id: 2,
  openId: "regular-user",
  email: "user@example.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("content admin procedures", () => {
  it("rejects content creation for non-admin users", async () => {
    const caller = appRouter.createCaller(makeContext(regularUser));
    await expect(caller.content.create({ type: "faculty", title: "Blocked" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects content deletion for non-admin users", async () => {
    const caller = appRouter.createCaller(makeContext(regularUser));
    await expect(caller.content.remove({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes the public content collection query", async () => {
    const caller = appRouter.createCaller(makeContext(null));
    const items = await caller.content.list();
    expect(Array.isArray(items)).toBe(true);
  });
});

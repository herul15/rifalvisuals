import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { signSessionToken } from "@/lib/auth";
import { proxy } from "@/proxy";

const mocks = vi.hoisted(() => ({ cookie: undefined as string | undefined, findUser: vi.fn(), read: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => mocks.cookie ? { value: mocks.cookie } : undefined }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { adminUser: { findUnique: mocks.findUser }, portfolio: { findMany: mocks.read }, testimonial: { findMany: mocks.read }, siteSetting: { findUnique: mocks.read } } }));
import { GET as portfolio } from "@/app/api/admin/portfolio/route";
import { GET as testimonials } from "@/app/api/admin/testimonials/route";
import { GET as settings } from "@/app/api/admin/settings/route";

beforeEach(() => { vi.clearAllMocks(); mocks.cookie = undefined; mocks.read.mockResolvedValue([]); });

describe("Admin access", () => {
  it("redirects a structurally plausible unsigned cookie", () => {
    const response = proxy(new NextRequest("http://localhost/admin/dashboard", { headers: { cookie: "rifal_admin_session=abcdefghijklmnop.invalid" } }));
    expect(response.headers.get("location")).toContain("/admin/login");
  });
  for (const [name, get] of [["portfolio", portfolio], ["testimonials", testimonials], ["settings", settings]] as const) {
    it(`rejects unauthenticated ${name} reads before touching data`, async () => {
      expect((await get()).status).toBe(401);
      expect(mocks.read).not.toHaveBeenCalled();
    });
  }
  it("rejects inactive users and users whose current role no longer grants access", async () => {
    mocks.cookie = signSessionToken({ userId: "admin1", username: "admin", role: "SUPER_ADMIN" });
    mocks.findUser.mockResolvedValue({ id: "admin1", username: "admin", role: "ADMIN", isActive: false });
    expect((await portfolio()).status).toBe(401);
    mocks.findUser.mockResolvedValue({ id: "admin1", username: "admin", role: "VIEWER", isActive: true });
    expect((await portfolio()).status).toBe(403);
    expect(mocks.read).not.toHaveBeenCalled();
  });
});

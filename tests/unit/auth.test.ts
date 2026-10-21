import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth";

describe("Auth Utilities", () => {
  it("hashes and verifies password correctly", async () => {
    const password = "AdminRifal2026!";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword", hash);
    expect(isInvalid).toBe(false);
  });

  it("signs and verifies session tokens", () => {
    const payload = {
      userId: "user_123",
      username: "admin",
      role: "ADMIN",
    };

    const token = signSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.username).toBe("admin");
    expect(decoded?.userId).toBe("user_123");
  });

  it("rejects tampered tokens", () => {
    const payload = {
      userId: "user_123",
      username: "admin",
      role: "ADMIN",
    };

    const token = signSessionToken(payload);
    const tampered = token.slice(0, -4) + "abcd";
    expect(verifySessionToken(tampered)).toBeNull();
  });
});

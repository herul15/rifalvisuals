import { describe, it, expect, vi, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth";

describe("Auth Utilities", () => {
  afterEach(() => vi.unstubAllEnvs());

  function rawToken(payload: unknown) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${encoded}.${createHmac("sha256", process.env.JWT_SECRET!).update(encoded).digest("base64url")}`;
  }

  it("requires an explicit strong secret and rejects the old secret", () => {
    for (const secret of ["", "short", "rifalvisuals_secret_jwt_key_umroh_2026_production"]) {
      vi.stubEnv("JWT_SECRET", secret);
      expect(() => signSessionToken({ userId: "1", username: "admin", role: "ADMIN" })).toThrow(/JWT_SECRET/);
    }
  });

  it("rejects missing identity, missing expiry, nonnumeric expiry, and expiry at the current second", () => {
    const now = Math.floor(Date.now() / 1000);
    for (const payload of [
      { username: "admin", role: "ADMIN", exp: now + 60 },
      { userId: "1", username: "admin", role: "ADMIN" },
      { userId: "1", username: "admin", role: "ADMIN", exp: "tomorrow" },
      { userId: "1", username: "admin", role: "ADMIN", exp: now },
      null,
    ]) expect(verifySessionToken(rawToken(payload))).toBeNull();
  });

  it("rejects expired tokens and extra segments", () => {
    const token = signSessionToken({ userId: "1", username: "admin", role: "ADMIN" });
    expect(verifySessionToken(token + ".extra")).toBeNull();
    expect(verifySessionToken(signSessionToken({ userId: "1", username: "admin", role: "ADMIN" }, -1))).toBeNull();
  });
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

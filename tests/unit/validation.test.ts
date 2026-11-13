import { describe, it, expect } from "vitest";
import { packageUpdateSchema, settingsSchema, portfolioCreateSchema, testimonialCreateSchema } from "@/lib/validation";
import { testDatabaseUrl } from "../../scripts/test-environment.mjs";

describe("Trust boundaries", () => {
  it("rejects negative, fractional and oversized prices and invalid DP or ratings", () => {
    for (const price of [-1, 1.5, 2147483648]) expect(packageUpdateSchema.safeParse({ variantUpdates: [{ variantId: "v1", price }] }).success).toBe(false);
    for (const dpPercentage of [-1, 101, 1.5]) expect(settingsSchema.safeParse({ dpPercentage }).success).toBe(false);
    expect(testimonialCreateSchema.safeParse({ clientName: "A", packageTaken: "P", comment: "C", rating: 1.5 }).success).toBe(false);
  });
  it("requires explicit consent for new content and rejects duplicate variants", () => {
    expect(portfolioCreateSchema.parse({ title: "T", location: "MAKKAH", mediaUrl: "/images/hero/hero-makkah.jpeg" }).clientConsent).toBe(false);
    expect(testimonialCreateSchema.parse({ clientName: "A", packageTaken: "P", comment: "C" }).consentGiven).toBe(false);
    expect(packageUpdateSchema.safeParse({ variantUpdates: [{ variantId: "v1", price: 1 }, { variantId: "v1", price: 2 }] }).success).toBe(false);
  });
  it("never falls back to the application database or resets it through a schema alias", () => {
    expect(() => testDatabaseUrl({ DATABASE_URL: "postgresql://u:p@localhost/app" })).toThrow(/TEST_DATABASE_URL/);
    expect(() => testDatabaseUrl({ TEST_DATABASE_URL: "postgresql://u:p@localhost/app" })).toThrow(/_test/);
    expect(() => testDatabaseUrl({ DATABASE_URL: "postgresql://u:p@localhost/same_test?schema=public", TEST_DATABASE_URL: "postgresql://u:p@localhost:5432/same_test?schema=other" })).toThrow(/differ/);
    expect(testDatabaseUrl({ DATABASE_URL: "postgresql://u:p@localhost/app", TEST_DATABASE_URL: "postgresql://u:p@localhost/app_test" })).toContain("app_test");
  });
});

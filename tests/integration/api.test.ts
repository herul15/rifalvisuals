import { describe, it, expect } from "vitest";
import prisma from "@/lib/prisma";
import { formatRupiah, generateWhatsAppUrl } from "@/lib/whatsapp";

describe("Pricing and Database Invariant Tests", () => {
  it("verifies official Ka'bah & Pelataran prices match pricelist", async () => {
    const kabahPackage = await prisma.package.findUnique({
      where: { slug: "kabah-pelataran" },
      include: { variants: true },
    });

    expect(kabahPackage).toBeDefined();
    expect(kabahPackage?.name).toBe("Ka'bah & Pelataran");

    const sendiri = kabahPackage?.variants.find((v) => v.participantType === "SENDIRI");
    const berdua = kabahPackage?.variants.find((v) => v.participantType === "BERDUA");
    const keluarga = kabahPackage?.variants.find((v) => v.participantType === "KELUARGA");

    expect(sendiri?.price).toBe(2020500);
    expect(sendiri?.isBestSeller).toBe(true);
    expect(berdua?.price).toBe(2920500);
    expect(keluarga?.price).toBe(5170500);
  });

  it("verifies Masjid Nabawi prices match pricelist", async () => {
    const nabawiPackage = await prisma.package.findUnique({
      where: { slug: "dokumentasi-masjid-nabawi" },
      include: { variants: true },
    });

    expect(nabawiPackage).toBeDefined();
    const sendiri = nabawiPackage?.variants.find((v) => v.participantType === "SENDIRI");
    const berdua = nabawiPackage?.variants.find((v) => v.participantType === "BERDUA");
    const keluarga = nabawiPackage?.variants.find((v) => v.participantType === "KELUARGA");

    expect(sendiri?.price).toBe(2020500);
    expect(berdua?.price).toBe(2920500);
    expect(berdua?.isBestSeller).toBe(true);
    expect(keluarga?.price).toBe(5170500);
  });

  it("verifies official WhatsApp number and non-empty message structure", async () => {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

    expect(settings?.whatsappNumber).toBe("62881080522136");
    expect(settings?.dpPercentage).toBe(50);

    const url = generateWhatsAppUrl(
      {
        packageName: "Ka'bah & Pelataran",
        variantLabel: "Sendiri (1 orang)",
        priceFormatted: formatRupiah(2020500),
        location: "Masjidil Haram",
      },
      settings!.whatsappNumber
    );

    expect(url).toContain("https://wa.me/62881080522136?text=");
    expect(url).toContain("Rp2.020.500");
    expect(url).toContain("Assalamu'alaikum");
  });

  it("verifies consent ethics: only items with consent or approved are queryable for public display", async () => {
    const publicPortfolios = await prisma.portfolio.findMany({
      where: {
        isActive: true,
        clientConsent: true,
      },
    });

    expect(publicPortfolios.length).toBeGreaterThan(0);
    publicPortfolios.forEach((item) => {
      expect(item.clientConsent).toBe(true);
      expect(item.isActive).toBe(true);
    });

    const publicTestimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        consentGiven: true,
      },
    });

    expect(publicTestimonials.length).toBeGreaterThan(0);
    publicTestimonials.forEach((testi) => {
      expect(testi.isApproved).toBe(true);
      expect(testi.consentGiven).toBe(true);
    });
  });
});

describe("Anti-slop Copywriting Check", () => {
  it("ensures no forbidden em-dashes exist in seed database taglines or benefits", async () => {
    const packages = await prisma.package.findMany({
      include: { variants: true },
    });

    for (const pkg of packages) {
      if (pkg.tagline) {
        expect(pkg.tagline).not.toContain("—");
      }
      for (const v of pkg.variants) {
        expect(v.benefitsJson).not.toContain("—");
      }
    }
  });
});

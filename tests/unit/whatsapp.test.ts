import { describe, it, expect } from "vitest";
import { formatRupiah, generateWhatsAppUrl } from "@/lib/whatsapp";

describe("WhatsApp Utilities", () => {
  it("formats Rupiah correctly according to id-ID locale", () => {
    expect(formatRupiah(1350000)).toBe("Rp1.350.000");
    expect(formatRupiah(2920500)).toBe("Rp2.920.500");
    expect(formatRupiah(5170500)).toBe("Rp5.170.500");
  });

  it("generates correct WhatsApp URL with package details", () => {
    const url = generateWhatsAppUrl(
      {
        packageName: "Ka'bah & Pelataran",
        location: "Masjidil Haram (Makkah)",
        variantLabel: "Berdua (Pasangan)",
        priceFormatted: "Rp2.920.500",
        preferredDate: "20 November 2026",
      },
      "0881080522136"
    );

    expect(url).toContain("https://wa.me/62881080522136?text=");
    expect(url).toContain(encodeURIComponent("Ka'bah & Pelataran"));
    expect(url).toContain(encodeURIComponent("Rp2.920.500"));
    expect(url).toContain(encodeURIComponent("Berdua (Pasangan)"));
    expect(url).not.toContain("—"); // Anti-slop: zero em dashes!
  });
});

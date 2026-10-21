export interface BookingInquiryPayload {
  packageName: string;
  variantLabel: string;
  priceFormatted: string;
  location: string;
  customerName?: string;
  preferredDate?: string;
  selectedAddOns?: string[];
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, "");
}

export function generateWhatsAppUrl(
  payload: BookingInquiryPayload,
  whatsappNumber: string = "62881080522136"
): string {
  // Strip non-numeric characters and ensure country code format
  let cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }

  let message =
    "Assalamu'alaikum Admin Rifalvisuals,\n\n" +
    "Saya tertarik untuk konsultasi dan booking dokumentasi ibadah dengan rincian berikut:\n" +
    `• Paket: ${payload.packageName}\n` +
    `• Lokasi: ${payload.location}\n` +
    `• Varian Peserta: ${payload.variantLabel}\n` +
    `• Estimasi Biaya: ${payload.priceFormatted}\n`;

  if (payload.preferredDate) {
    message += `• Rencana Tanggal: ${payload.preferredDate}\n`;
  }

  if (payload.selectedAddOns && payload.selectedAddOns.length > 0) {
    message += `• Layanan Tambahan: ${payload.selectedAddOns.join(", ")}\n`;
  }

  message += "\nMohon info ketersediaan slot fotografer pada jadwal tersebut. Terima kasih.";

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralInquiryUrl(
  whatsappNumber: string = "62881080522136"
): string {
  let cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }

  const message =
    "Assalamu'alaikum Admin Rifalvisuals, saya ingin berkonsultasi mengenai jasa dokumentasi Umroh dan Haji di Tanah Suci.";

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

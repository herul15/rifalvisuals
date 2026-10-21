import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with official Rifalvisuals data...");

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.packageAddOn.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.packageVariant.deleteMany();
  await prisma.package.deleteMany();
  await prisma.packageCategory.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  // 2. Site Setting
  await prisma.siteSetting.create({
    data: {
      id: "default",
      companyName: "Rifalvisuals Indonesia",
      tagline: "Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.",
      whatsappNumber: "62881080522136",
      emailAddress: "Rifalvisuals2024@gmail.com",
      instagramHandle: "rifalvisuals",
      tiktokHandle: "rifaal_dii",
      address: "Mekkah, Madinah, Thaif, Al Ula, Arab Saudi & Indonesia",
      meetingPointNabawi: "Pintu 333 / 310 Masjid Nabawi",
      meetingPointHaram: "WC 3 Pelataran Masjidil Haram",
      meetingPointJabal: "Lobby Hotel Al Shohada",
      dpPercentage: 50,
      heroImageUrl: "/images/portfolio/IMG_0116.jpeg",
      aboutImageUrl: "/images/portfolio/IMG_6567.jpeg",
      announcementText:
        "Musim Umroh 1448 H / 2026: Booking jadwal dokumentasi Anda lebih awal untuk mengamankan slot fotografer resmi di Tanah Suci.",
    },
  });

  // 3. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("AdminRifal2026!", salt);
  await prisma.adminUser.create({
    data: {
      username: "admin",
      email: "admin@rifalvisuals.id",
      passwordHash,
      name: "Rifaldi Setiawan (CEO)",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  // 4. Categories
  const catHaram = await prisma.packageCategory.create({
    data: {
      slug: "makkah-haram",
      name: "Masjidil Haram (Makkah)",
      location: "MAKKAH_HARAM",
      description:
        "Dokumentasi sakral di area Ka'bah dan pelataran Masjidil Haram tanpa mengganggu kekhusyukan ibadah.",
      sortOrder: 1,
    },
  });

  const catJabal = await prisma.packageCategory.create({
    data: {
      slug: "makkah-jabal",
      name: "Jabal Series (Makkah)",
      location: "MAKKAH_JABAL",
      description:
        "Spot panorama eksklusif Jabal Kudai dan Jabal Khandamah menghadap Masjidil Haram dari ketinggian.",
      sortOrder: 2,
    },
  });

  const catNabawi = await prisma.packageCategory.create({
    data: {
      slug: "madinah-nabawi",
      name: "Masjid Nabawi (Madinah)",
      location: "MADINAH_NABAWI",
      description:
        "Mengabadikan ketenangan dan keindahan arsitektur Masjid Nabawi bersama fotografer profesional berpengalaman.",
      sortOrder: 3,
    },
  });

  // 5. Packages & Variants for Makkah Haram
  // 5.1 Ka'bah Only
  await prisma.package.create({
    data: {
      categoryId: catHaram.id,
      slug: "kabah-only",
      name: "Ka'bah Only",
      imageUrl: "/images/portfolio/IMG_0086.jpeg",
      tagline: "Fokus dokumentasi khusyuk di area thawaf dan sekitar Ka'bah",
      description:
        "Paket dokumentasi foto dan video eksklusif di area Ka'bah dengan pendampingan fotografer berpengalaman.",
      sortOrder: 1,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 1350000,
            durationMinutes: 60,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Tajam & Estetik",
              "1 Video Reels Instagram (30-40 Detik)",
              "Durasi Sesi 1 Jam Hunting",
              "Pengiriman via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 1800000,
            durationMinutes: 60,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Tajam & Estetik",
              "1 Video Reels Instagram (30-40 Detik)",
              "Durasi Sesi 1 Jam Hunting",
              "Pengiriman via Google Drive (3 Hari)",
            ]),
          },
        ],
      },
    },
  });

  // 5.2 Pelataran Only
  await prisma.package.create({
    data: {
      categoryId: catHaram.id,
      slug: "pelataran-only",
      name: "Pelataran Only",
      imageUrl: "/images/portfolio/IMG_6567.jpeg",
      tagline: "Sudut luas dan arsitektur megah pelataran luar Masjidil Haram",
      description:
        "Abadikan momen kebersamaan di pelataran luas Masjidil Haram dengan latar belakang menara jam dan pintu gerbang agung.",
      sortOrder: 2,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 1440000,
            durationMinutes: 60,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Estetik",
              "1 Video Reels Instagram (30-40 Detik)",
              "Durasi Sesi 1 Jam Hunting",
              "Pengiriman File via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 1890000,
            durationMinutes: 60,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Estetik",
              "1 Video Reels Instagram (30-40 Detik)",
              "Durasi Sesi 1 Jam Hunting",
              "Pengiriman File via Google Drive (3 Hari)",
            ]),
          },
        ],
      },
    },
  });

  // 5.3 Ka'bah & Pelataran (Best Seller)
  await prisma.package.create({
    data: {
      categoryId: catHaram.id,
      slug: "kabah-pelataran",
      name: "Ka'bah & Pelataran",
      imageUrl: "/images/portfolio/IMG_0116.jpeg",
      tagline: "Paket komprehensif terlengkap di Masjidil Haram",
      description:
        "Kombinasi sempurna dokumentasi khidmat di hadapan Ka'bah dan sudut sinematik pelataran megah Masjidil Haram.",
      isBestSeller: true,
      sortOrder: 3,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 2020500,
            durationMinutes: 90,
            editedPhotosCount: 20,
            reelsDurationSec: 60,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "20 Foto Pilihan Diedit Khusus",
              "1 Video Reels Sinematik (40-60 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Titik Temu Resmi: WC 3 Pelataran",
              "Pengiriman File via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 2920500,
            durationMinutes: 120,
            editedPhotosCount: 30,
            reelsDurationSec: 60,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "30 Foto Pilihan Diedit Khusus",
              "1 Video Reels Sinematik (40-60 Detik)",
              "Durasi Sesi 2 Jam Hunting Nyaman",
              "Titik Temu Resmi: WC 3 Pelataran",
              "Pengiriman File via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "KELUARGA",
            label: "Keluarga (Hingga 7 orang)",
            price: 5170500,
            durationMinutes: 120,
            editedPhotosCount: 50,
            reelsDurationSec: 60,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah (Maksimal 7 Orang)",
              "50 Foto Pilihan Diedit Lengkap",
              "1 Video Reels Sinematik (60 Detik Penuh)",
              "Durasi Sesi 2 Jam Hunting Khusus Keluarga",
              "Titik Temu Resmi: WC 3 Pelataran",
              "Pengiriman File via Google Drive (3 Hari)",
            ]),
          },
        ],
      },
    },
  });

  // 6. Packages & Variants for Makkah Jabal Series
  // 6.1 Kudai Only
  await prisma.package.create({
    data: {
      categoryId: catJabal.id,
      slug: "kudai-only",
      name: "Kudai Only",
      imageUrl: "/images/portfolio/IMG_3562.jpeg",
      tagline: "Spot perbukitan Kudai dengan latar belakang panorama kota suci",
      description:
        "Sesi dokumentasi santai di bukit Kudai dengan sudut pandang unik dan pencahayaan alami yang menawan.",
      sortOrder: 1,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 2020500,
            durationMinutes: 90,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Estetik",
              "1 Video Reels (30-40 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 2250000,
            durationMinutes: 90,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Estetik",
              "1 Video Reels (30-40 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
        ],
      },
    },
  });

  // 6.2 Khandamah Only (Best Seller)
  await prisma.package.create({
    data: {
      categoryId: catJabal.id,
      slug: "khandamah-only",
      name: "Khandamah Only",
      imageUrl: "/images/portfolio/IMG_9650.jpeg",
      tagline: "Pemandangan magis Masjidil Haram dan Jam Makkah dari puncak bukit",
      description:
        "Spot paling dicari jamaah: puncak Jabal Khandamah yang memperlihatkan keagungan Masjidil Haram dari kejauhan.",
      isBestSeller: true,
      sortOrder: 2,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 2250000,
            durationMinutes: 90,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Penuh Jiwa",
              "1 Video Reels (30-40 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Pemandangan Jam Makkah Spektakuler",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 2500500,
            durationMinutes: 90,
            editedPhotosCount: 15,
            reelsDurationSec: 40,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Penuh Jiwa",
              "1 Video Reels (30-40 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Pemandangan Jam Makkah Spektakuler",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
        ],
      },
    },
  });

  // 6.3 Kudai & Khandamah (Best Seller)
  await prisma.package.create({
    data: {
      categoryId: catJabal.id,
      slug: "kudai-khandamah",
      name: "Kudai & Khandamah",
      imageUrl: "/images/portfolio/IMG_3562.jpeg",
      tagline: "Eksplorasi dua puncak panorama terbaik kota Mekkah",
      description:
        "Gabungan dua lokasi terbaik dalam satu sesi untuk variasi sudut foto pemandangan Tanah Suci yang tak terlupakan.",
      isBestSeller: true,
      sortOrder: 3,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 2500500,
            durationMinutes: 90,
            editedPhotosCount: 30,
            reelsDurationSec: 60,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "30 Foto Pilihan Diedit",
              "1 Video Reels Sinematik (40-60 Detik)",
              "Durasi Sesi 1,5 Jam di 2 Lokasi",
              "Spot Kudai & Khandamah Lengkap",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 2920500,
            durationMinutes: 90,
            editedPhotosCount: 30,
            reelsDurationSec: 60,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "30 Foto Pilihan Diedit",
              "1 Video Reels Sinematik (40-60 Detik)",
              "Durasi Sesi 1,5 Jam di 2 Lokasi",
              "Spot Kudai & Khandamah Lengkap",
              "Titik Temu: Lobby Hotel Al Shohada",
            ]),
          },
        ],
      },
    },
  });

  // 6.4 Jabal VIP Service
  await prisma.package.create({
    data: {
      categoryId: catJabal.id,
      slug: "jabal-vip-service",
      name: "Jabal VIP Service",
      imageUrl: "/images/portfolio/IMG_9650.jpeg",
      tagline: "Layanan premium eksklusif keluarga dengan fasilitas terpadu",
      description:
        "Pengalaman VIP lengkap dengan penjemputan hotel, lighting profesional, properti piknik hangat, dan transportasi antar jemput.",
      sortOrder: 4,
      variants: {
        create: [
          {
            participantType: "KELUARGA",
            label: "Keluarga (Hingga 7 orang)",
            price: 5170500,
            durationMinutes: 120,
            editedPhotosCount: 50,
            reelsDurationSec: 60,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah (Maks 7 Orang)",
              "50 Foto Pilihan Diedit Sempurna",
              "1 Video Reels Sinematik (60 Detik)",
              "Durasi Sesi 2 Jam Hunting Nyaman",
              "Penjemputan Langsung di Hotel Jamaah",
              "Lighting Video Profesional",
              "Properti Piknik Karpet & Teh Hangat",
              "Transportasi PP Khusus Keluarga",
            ]),
          },
        ],
      },
    },
  });

  // 7. Packages & Variants for Masjid Nabawi Madinah
  await prisma.package.create({
    data: {
      categoryId: catNabawi.id,
      slug: "dokumentasi-masjid-nabawi",
      name: "Dokumentasi Masjid Nabawi",
      imageUrl: "/images/portfolio/IMG_1951.jpeg",
      tagline: "Menemukan ketenangan abadi di kota Rasulullah SAW",
      description:
        "Sesi foto dan video di pelataran payung raksasa Masjid Nabawi, gerbang agung, dan sudut arsitektur Madinah yang menenteramkan.",
      sortOrder: 1,
      variants: {
        create: [
          {
            participantType: "SENDIRI",
            label: "Sendiri (1 orang)",
            price: 2020500,
            durationMinutes: 90,
            editedPhotosCount: 15,
            reelsDurationSec: 60,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "15 Foto Pilihan Diedit Berwarna Sejuk",
              "1 Video Reels Instagram (40-60 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Titik Temu: Pintu 333 / 310 Masjid Nabawi",
              "Pengiriman via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "BERDUA",
            label: "Berdua (Pasangan)",
            price: 2920500,
            durationMinutes: 90,
            editedPhotosCount: 30,
            reelsDurationSec: 60,
            isBestSeller: true,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah",
              "30 Foto Pilihan Diedit Berwarna Sejuk",
              "1 Video Reels Instagram (40-60 Detik)",
              "Durasi Sesi 1,5 Jam Hunting",
              "Titik Temu: Pintu 333 / 310 Masjid Nabawi",
              "Pengiriman via Google Drive (3 Hari)",
            ]),
          },
          {
            participantType: "KELUARGA",
            label: "Keluarga (Hingga 7 orang)",
            price: 5170500,
            durationMinutes: 90,
            editedPhotosCount: 30,
            reelsDurationSec: 60,
            benefitsJson: JSON.stringify([
              "Unlimited Foto & Video Mentah (Maks 7 Orang)",
              "30 Foto Pilihan Diedit Lengkap",
              "1 Video Reels Instagram (60 Detik)",
              "Durasi Sesi 1,5 Jam Hunting Khusus Keluarga",
              "Titik Temu: Pintu 333 / 310 Masjid Nabawi",
              "Pengiriman via Google Drive (3 Hari)",
            ]),
          },
        ],
      },
    },
  });

  // 8. AddOns
  await prisma.addOn.createMany({
    data: [
      {
        slug: "spot-eskalator-jabal-omar",
        name: "Spot Eskalator Jabal Omar",
        description:
          "Spot foto modern berlatar menara jam dan pelataran Jabal Omar yang fotogenik.",
        price: 225000,
        unitLabel: "per sesi",
        applicableLocations: "MAKKAH_HARAM",
      },
      {
        slug: "spot-masjid-quba",
        name: "Spot Masjid Quba",
        description:
          "Dokumentasi di masjid pertama yang dibangun Rasulullah SAW (kondisional jadwal).",
        price: 900000,
        unitLabel: "per sesi (kondisional)",
        applicableLocations: "MADINAH_NABAWI",
      },
      {
        slug: "spot-karpet-snack",
        name: "Spot Karpet & Snack Piknik",
        description:
          "Properti karpet estetik, teh hangat, dan kurma untuk sesi santai di bukit Makkah.",
        price: 315000,
        unitLabel: "per paket",
        applicableLocations: "MAKKAH_JABAL",
      },
      {
        slug: "tambahan-peserta",
        name: "Tambahan Peserta",
        description: "Penambahan anggota keluarga di luar kuota paket resmi.",
        price: 450000,
        unitLabel: "per orang",
        applicableLocations: "MAKKAH_HARAM,MAKKAH_JABAL,MADINAH_NABAWI",
      },
      {
        slug: "tambahan-foto-edit",
        name: "Tambahan Foto Edit",
        description:
          "Penambahan foto yang diedit dengan color grading profesional.",
        price: 450000,
        unitLabel: "per 10 foto",
        applicableLocations: "MAKKAH_HARAM,MAKKAH_JABAL,MADINAH_NABAWI",
      },
      {
        slug: "tambahan-video-edit",
        name: "Tambahan Video Edit",
        description:
          "Pembuatan video Reels atau sinematik tambahan dengan durasi 60 detik.",
        price: 900000,
        unitLabel: "per video",
        applicableLocations: "MAKKAH_HARAM,MAKKAH_JABAL,MADINAH_NABAWI",
      },
      {
        slug: "overtime",
        name: "Overtime Sesi Hunting",
        description:
          "Perpanjangan waktu sesi pemotretan fotografer di lapangan.",
        price: 225000,
        unitLabel: "per 30 menit",
        applicableLocations: "MAKKAH_HARAM,MAKKAH_JABAL,MADINAH_NABAWI",
      },
    ],
  });

  // 9. Authentic Testimonials (Explicit Consent)
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Hj. Siti Rahmawati & Suami",
        originCity: "Jakarta Selatan",
        packageTaken: "Ka'bah & Pelataran (Berdua)",
        rating: 5,
        comment:
          "Alhamdulillah, hasil foto dan video dari tim Mas Rifal luar biasa bagus. Kami tidak merasa terganggu saat tawaf, fotografernya sangat santun dan paham momen-momen sakral yang haru.",
        consentGiven: true,
        isApproved: true,
      },
      {
        clientName: "Bpk. Hendra Wijaya & Keluarga",
        originCity: "Surabaya",
        packageTaken: "Dokumentasi Masjid Nabawi (Keluarga)",
        rating: 5,
        comment:
          "Bawa orang tua dan anak-anak biasanya repot untuk foto sendiri. Dengan Rifalvisuals semuanya rapi, tepat waktu di pintu 333, dan file drive sudah kami terima lengkap dalam 2 hari.",
        consentGiven: true,
        isApproved: true,
      },
      {
        clientName: "Ustadz Ahmad Fauzan",
        originCity: "Bandung",
        packageTaken: "Jabal Khandamah Series",
        rating: 5,
        comment:
          "Angle pengambilan gambar di Khandamah sangat estetik. Sangat amanah dan komunikatif sejak konsultasi WhatsApp sampai penyerahan video Reels. Berkah selalu untuk Rifalvisuals.",
        consentGiven: true,
        isApproved: true,
      },
    ],
  });

  // 10. Portfolio Media Seed
  const samplePortfolio = [
    {
      title: "Khidmat di Depan Ka'bah Suci",
      location: "MAKKAH",
      mediaUrl: "/images/portfolio/IMG_0086.jpeg",
      caption: "Momen doa penuh haru jamaah di pelataran Ka'bah",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "Payung Megah Masjid Nabawi",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_1951.jpeg",
      caption: "Kesejukan pagi di bawah payung Masjid Nabawi Madinah",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: "Senja di Jabal Khandamah",
      location: "JABAL",
      mediaUrl: "/images/portfolio/IMG_3562.jpeg",
      caption: "Lanskap kota Mekkah dan Menara Jam dari puncak Jabal",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      title: "Kombinasi Sakral di Hadapan Ka'bah",
      location: "MAKKAH",
      mediaUrl: "/images/portfolio/IMG_0116.jpeg",
      caption: "Kenangan ibadah bersama jamaah tercinta di Tanah Suci",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      title: "Pelataran Luar Masjidil Haram",
      location: "MAKKAH",
      mediaUrl: "/images/portfolio/IMG_6567.jpeg",
      caption: "Kemegahan arsitektur modern berpadu kesucian tempat ibadah",
      isFeatured: true,
      sortOrder: 5,
    },
    {
      title: "Ketenangan Gerbang Nabawi",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_4841.jpeg",
      caption: "Keagungan pintu Masjid Nabawi dan langkah lembut para peziarah makam Rasulullah SAW",
      isFeatured: true,
      sortOrder: 6,
    },
    {
      title: "Ihram Tawaf di Sisi Ka'bah",
      location: "MAKKAH",
      mediaUrl: "/images/portfolio/IMG_0099.jpeg",
      caption: "Sudut pengambilan candid jamaah saat bertawaf mengelilingi Ka'bah yang mulia",
      isFeatured: true,
      sortOrder: 7,
    },
    {
      title: "Panorama Perbukitan Kudai",
      location: "JABAL",
      mediaUrl: "/images/portfolio/IMG_9650.jpeg",
      caption: "Sesi dokumentasi santai dengan latar belakang lanskap perbukitan kota suci",
      isFeatured: true,
      sortOrder: 8,
    },
    {
      title: "Arsitektur Megah Madinah",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_2103.jpeg",
      caption: "Detail pilar-pilar agung dan kemilau arsitektur kota suci",
      isFeatured: true,
      sortOrder: 9,
    },
    {
      title: "Pelataran Payung Madinah",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_0290.jpeg",
      caption: "Kesejukan semilir angin di bawah naungan payung raksasa Masjid Nabawi",
      isFeatured: true,
      sortOrder: 10,
    },
    {
      title: "Puncak Menawan Khandamah",
      location: "JABAL",
      mediaUrl: "/images/portfolio/IMG_3562.jpeg",
      caption: "Sudut pandang tertinggi memandang Masjidil Haram saat matahari terbenam",
      isFeatured: true,
      sortOrder: 11,
    },
    {
      title: "Doa Syahdu Bersama Pasangan",
      location: "MAKKAH",
      mediaUrl: "/images/portfolio/IMG_6567.jpeg",
      caption: "Kebersamaan suami istri memanjatkan harapan terbaik di Tanah Suci",
      isFeatured: true,
      sortOrder: 12,
    },
  ];

  for (const item of samplePortfolio) {
    await prisma.portfolio.create({
      data: {
        title: item.title,
        location: item.location,
        mediaType: "IMAGE",
        mediaUrl: item.mediaUrl,
        caption: item.caption,
        clientConsent: true,
        isFeatured: item.isFeatured,
        isActive: true,
        sortOrder: item.sortOrder,
      },
    });
  }

  // 11. Instagram Posts
  await prisma.instagramPost.createMany({
    data: [
      {
        postUrl: "https://www.instagram.com/rifalvisuals",
        imageUrl: "/images/portfolio/IMG_0086.jpeg",
        caption:
          "Setiap tetes air mata dan doa di hadapan Baitullah layak diabadikan dengan penuh kehormatan.",
        likeCount: 428,
      },
      {
        postUrl: "https://www.instagram.com/rifalvisuals",
        imageUrl: "/images/portfolio/IMG_1951.jpeg",
        caption:
          "Ketenangan Masjid Nabawi yang selalu dirindukan setiap jiwa yang pernah berkunjung.",
        likeCount: 615,
      },
      {
        postUrl: "https://www.instagram.com/rifalvisuals",
        imageUrl: "/images/portfolio/IMG_9650.jpeg",
        caption:
          "Pemandangan kota Mekkah dari bukit Khandamah saat matahari terbenam.",
        likeCount: 890,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

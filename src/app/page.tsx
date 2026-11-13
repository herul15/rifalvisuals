import { getSiteSettings } from "@/lib/site-settings";
import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PricingSection, { CategoryData } from "@/components/sections/PricingSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import BookingFlowSection from "@/components/sections/BookingFlowSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import InstagramSection from "@/components/sections/InstagramSection";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const siteSetting = await getSiteSettings();

  const whatsappNumber = siteSetting.whatsappNumber || "62881080522136";

  // 2. Fetch package categories with active packages and variants
  const categoriesRaw = await prisma.packageCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      packages: {
        where: { isActive: true, deletedAt: null },
        orderBy: { sortOrder: "asc" },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
          },
        },
      },
    },
  });

  const categories: CategoryData[] = categoriesRaw.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    location: cat.location,
    description: cat.description,
    packages: cat.packages.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      imageUrl: p.imageUrl,
      isBestSeller: p.isBestSeller,
      variants: p.variants.map((v) => ({
        id: v.id,
        participantType: v.participantType,
        label: v.label,
        price: v.price,
        durationMinutes: v.durationMinutes,
        editedPhotosCount: v.editedPhotosCount,
        reelsDurationSec: v.reelsDurationSec,
        benefitsJson: v.benefitsJson,
        isBestSeller: v.isBestSeller,
      })),
    })),
  }));

  // 3. Fetch add-ons
  const addOnsRaw = await prisma.addOn.findMany({
    where: { isActive: true },
  });

  const addOns = addOnsRaw.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    price: a.price,
    unitLabel: a.unitLabel,
    applicableLocations: a.applicableLocations,
  }));

  // 4. Fetch portfolio media (approved & consent granted only)
  const portfolioRaw = await prisma.portfolio.findMany({
    where: { isActive: true, clientConsent: true },
    orderBy: { sortOrder: "asc" },
    take: 12,
  });

  const portfolioItems = portfolioRaw.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    mediaUrl: p.mediaUrl,
    caption: p.caption,
  }));

  // 5. Fetch approved testimonials
  const testimonialsRaw = await prisma.testimonial.findMany({
    where: { isApproved: true, consentGiven: true },
    take: 6,
  });

  const testimonials = testimonialsRaw.map((t) => ({
    id: t.id,
    clientName: t.clientName,
    originCity: t.originCity,
    packageTaken: t.packageTaken,
    rating: t.rating,
    comment: t.comment,
  }));

  // 6. Fetch instagram posts
  const instagramPostsRaw = await prisma.instagramPost.findMany({
    where: { isActive: true },
    take: 3,
  });

  const instagramPosts = instagramPostsRaw.map((ig) => ({
    id: ig.id,
    postUrl: ig.postUrl,
    imageUrl: ig.imageUrl,
    caption: ig.caption,
    likeCount: ig.likeCount,
  }));

  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbf9]">
      {/* Navigation */}
      <Navbar whatsappNumber={whatsappNumber} companyName={siteSetting.companyName} />

      {/* Hero Section */}
      <HeroSection
        whatsappNumber={whatsappNumber}
        heroImageUrl={siteSetting.heroImageUrl}
        tagline={siteSetting.tagline}
        announcementText={siteSetting.announcementText}
      />

      {/* About Company & Core Values */}
      <AboutSection aboutImageUrl={siteSetting.aboutImageUrl} />

      {/* Services Spectrum */}
      <ServicesSection />

      {/* Interactive Official Pricelist */}
      <PricingSection
        categories={categories}
        addOns={addOns}
        whatsappNumber={whatsappNumber}
        dpPercentage={siteSetting.dpPercentage}
      />

      {/* Real Portfolio Gallery */}
      <PortfolioSection initialItems={portfolioItems} />

      {/* Transparent Booking Journey */}
      <BookingFlowSection whatsappNumber={whatsappNumber} dpPercentage={siteSetting.dpPercentage}
        meetingPointNabawi={siteSetting.meetingPointNabawi} meetingPointHaram={siteSetting.meetingPointHaram}
        meetingPointJabal={siteSetting.meetingPointJabal} />

      {/* Verified Pilgrim Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Instagram Feed / Fallback */}
      <InstagramSection posts={instagramPosts} instagramHandle={siteSetting.instagramHandle} />

      {/* Specific Umroh FAQ */}
      <FaqSection whatsappNumber={whatsappNumber} />

      {/* Footer */}
      <Footer
        whatsappNumber={whatsappNumber}
        emailAddress={siteSetting.emailAddress}
        companyName={siteSetting.companyName}
        tagline={siteSetting.tagline}
        address={siteSetting.address}
        instagramHandle={siteSetting.instagramHandle}
        tiktokHandle={siteSetting.tiktokHandle}
      />

      {/* Floating WhatsApp CTA */}
      <WhatsAppFloating whatsappNumber={whatsappNumber} />
    </main>
  );
}

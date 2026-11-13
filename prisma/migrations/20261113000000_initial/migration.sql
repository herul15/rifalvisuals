-- CreateTable
CREATE TABLE "PackageCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageVariant" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "participantType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "editedPhotosCount" INTEGER NOT NULL,
    "reelsDurationSec" INTEGER NOT NULL,
    "benefitsJson" TEXT NOT NULL,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddOn" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "unitLabel" TEXT NOT NULL,
    "applicableLocations" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageAddOn" (
    "packageId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,

    CONSTRAINT "PackageAddOn_pkey" PRIMARY KEY ("packageId","addOnId")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "clientConsent" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "originCity" TEXT,
    "packageTaken" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL,
    "postUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "likeCount" INTEGER DEFAULT 0,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstagramPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "companyName" TEXT NOT NULL DEFAULT 'Rifalvisuals Indonesia',
    "tagline" TEXT NOT NULL DEFAULT 'Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.',
    "whatsappNumber" TEXT NOT NULL DEFAULT '62881080522136',
    "emailAddress" TEXT NOT NULL DEFAULT 'Rifalvisuals2024@gmail.com',
    "instagramHandle" TEXT NOT NULL DEFAULT 'rifalvisuals',
    "tiktokHandle" TEXT NOT NULL DEFAULT 'rifaal_dii',
    "address" TEXT NOT NULL DEFAULT 'Mekkah - Madinah - Indonesia',
    "meetingPointNabawi" TEXT NOT NULL DEFAULT 'Pintu 333 / 310 Masjid Nabawi',
    "meetingPointHaram" TEXT NOT NULL DEFAULT 'WC 3 Pelataran Masjidil Haram',
    "meetingPointJabal" TEXT NOT NULL DEFAULT 'Lobby Hotel Al Shohada',
    "dpPercentage" INTEGER NOT NULL DEFAULT 50,
    "announcementText" TEXT,
    "heroImageUrl" TEXT DEFAULT '/images/hero/hero-makkah.jpeg',
    "aboutImageUrl" TEXT DEFAULT '/images/hero/about-rifal.jpeg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "packageId" TEXT,
    "metadata" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "packageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategory_slug_key" ON "PackageCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");

-- CreateIndex
CREATE INDEX "Package_categoryId_isActive_idx" ON "Package"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "PackageVariant_packageId_isActive_idx" ON "PackageVariant"("packageId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PackageVariant_packageId_participantType_key" ON "PackageVariant"("packageId", "participantType");

-- CreateIndex
CREATE UNIQUE INDEX "AddOn_slug_key" ON "AddOn"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_location_isActive_isFeatured_idx" ON "Portfolio"("location", "isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "Testimonial_isApproved_consentGiven_idx" ON "Testimonial"("isApproved", "consentGiven");

-- CreateIndex
CREATE INDEX "TrackingEvent_eventType_createdAt_idx" ON "TrackingEvent"("eventType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_createdAt_idx" ON "AuditLog"("adminId", "createdAt");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageVariant" ADD CONSTRAINT "PackageVariant_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAddOn" ADD CONSTRAINT "PackageAddOn_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAddOn" ADD CONSTRAINT "PackageAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

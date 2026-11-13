-- Preserve existing publication decisions; only defaults for new records change.
ALTER TABLE "Portfolio" ALTER COLUMN "clientConsent" SET DEFAULT false;
ALTER TABLE "Testimonial" ALTER COLUMN "consentGiven" SET DEFAULT false;
UPDATE "Portfolio" SET "location" = 'MAKKAH' WHERE "location" = 'MEKKAH';

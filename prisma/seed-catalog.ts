import type { PrismaClient } from "@prisma/client";
import catalog from "./catalog.json";

export async function seedCatalog(prisma: PrismaClient) {
  await prisma.$transaction(async tx => {
    await tx.siteSetting.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });
    for (const category of catalog.categories) {
      await tx.packageCategory.upsert({ where: { slug: category.slug }, update: {}, create: category });
    }
    for (const { categorySlug, variants, ...data } of catalog.packages) {
      const category = await tx.packageCategory.findUniqueOrThrow({ where: { slug: categorySlug } });
      const pkg = await tx.package.upsert({ where: { slug: data.slug }, update: {}, create: { ...data, categoryId: category.id } });
      for (const variant of variants.create) {
        await tx.packageVariant.upsert({ where: { packageId_participantType: { packageId: pkg.id, participantType: variant.participantType } }, update: {}, create: { ...variant, packageId: pkg.id } });
      }
    }
    for (const addon of catalog.addOns) await tx.addOn.upsert({ where: { slug: addon.slug }, update: {}, create: addon });
  });
}

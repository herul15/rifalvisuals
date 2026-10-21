import React from "react";
import prisma from "@/lib/prisma";
import PackagesManager from "@/components/admin/PackagesManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: {
        select: {
          name: true,
          location: true,
        },
      },
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  return <PackagesManager initialPackages={packages} />;
}

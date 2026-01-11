import prisma from "@/lib/prisma";
import { HomeClient } from "./home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE'
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      images: {
        orderBy: {
          orderIndex: 'asc'
        },
        take: 1
      }
    }
  });

  // Serialize Decimal fields
  const serializedProperties = properties.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : 0,
    landSqWah: p.landSqWah ? Number(p.landSqWah) : 0,
    usableArea: p.usableArea ? Number(p.usableArea) : 0,
    commissionRate: p.commissionRate ? Number(p.commissionRate) : 0,
    latitude: p.latitude || null,
    longitude: p.longitude || null,
  }));

  return <HomeClient properties={serializedProperties} />;
}

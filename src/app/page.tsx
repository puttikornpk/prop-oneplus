import prisma from "@/lib/prisma";
import { HomeClient } from "./home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let properties: any[] = [];
  try {
    properties = await prisma.property.findMany({
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
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    // Return empty array or handle error UI if needed
  }

  // Serialize Decimal fields
  const serializedProperties = properties.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : 0,
    landSqWah: p.landSqWah ? Number(p.landSqWah) : 0,
    usableArea: p.usableArea ? Number(p.usableArea) : 0,
    commissionRate: p.commissionRate ? Number(p.commissionRate) : 0,
    latitude: p.latitude || null,
    longitude: p.longitude || null,
    viewCount: p.viewCount || 0,
  }));

  return <HomeClient properties={serializedProperties} />;
}

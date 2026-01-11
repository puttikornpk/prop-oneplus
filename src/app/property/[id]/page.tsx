import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PropertyDetailClient } from "./client";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            images: true,
            facilities: {
                include: {
                    facility: true
                }
            },
            owner: {
                include: {
                    profile: true
                }
            }
        }
    });

    if (!property) {
        notFound();
    }

    // Serialize Decimal fields to be safe for Client Component
    const serializedProperty = {
        ...property,
        price: property.price ? Number(property.price) : null,
        landSqWah: property.landSqWah ? Number(property.landSqWah) : null,
        usableArea: property.usableArea ? Number(property.usableArea) : null,
        commissionRate: property.commissionRate ? Number(property.commissionRate) : null,
        latitude: property.latitude ? Number(property.latitude) : null,
        longitude: property.longitude ? Number(property.longitude) : null,
        // Also handle potential Date objects if needed, but Date is usually fine or converted to string by Next.js if simple.
        // Actually, Date objects can be passed to Client Components in recent Next.js, but let's be safe if issues arise.
        // For now, only Decimals are throwing the unique error.
    };

    return <PropertyDetailClient property={serializedProperty} currentUser={session?.user} />;
}

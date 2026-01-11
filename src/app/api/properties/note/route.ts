import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { propertyId, topic, detail, images } = data;

        if (!propertyId || !topic || !detail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify ownership and exists
        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                ownerId: session.user.id
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
        }

        // Update Property Note
        // Update Property Note with RLS Context
        const updated = await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT set_config('app.current_user_id', ${session.user.id}, true)`;

            // Use executeRaw to bypass potential stale Prisma Client cache issues
            // Note: We need to serialize noteImages as JSON string
            const imagesJson = JSON.stringify(images || []);

            await tx.$executeRaw`
                UPDATE "Property" 
                SET "noteTopic" = ${topic}, 
                    "note" = ${detail}, 
                    "noteImages" = ${imagesJson}::jsonb,
                    "updatedAt" = NOW()
                WHERE "id" = ${propertyId}
            `;

            // Return the updated record (fetch it back or just return success)
            return { id: propertyId, noteTopic: topic, note: detail, noteImages: images };
        });

        return NextResponse.json({ success: true, data: updated });

    } catch (error: any) {
        console.error("Error saving note:", error);
        return NextResponse.json({ error: "Failed to save note", details: error.message }, { status: 500 });
    }
}

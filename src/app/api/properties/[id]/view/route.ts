import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                { error: "Property ID is required" },
                { status: 400 }
            );
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
            select: {
                viewCount: true,
            },
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error("Error incrementing view count:", error);
        return NextResponse.json(
            { error: "Failed to increment view count" },
            { status: 500 }
        );
    }
}

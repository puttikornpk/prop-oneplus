
import { PrismaClient, PropertyStatus, FacilityType } from '@prisma/client';
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

        // Prepare data for Prisma
        const propertyData = {
            listingStatus: data.listingStatus,
            topic: data.topic,
            description: data.description,
            listingType: data.listingType,
            category: data.category,
            price: data.price ? parseFloat(data.price) : 0,
            status: data.isPublish ? PropertyStatus.ACTIVE : PropertyStatus.DRAFT, // Use DRAFT for drafts

            // Commission
            commissionType: data.acceptAgent ? data.commissionType : null,
            commissionRate: (data.acceptAgent && data.commissionType !== 'AGREED' && data.commissionRate)
                ? parseFloat(data.commissionRate)
                : null,
            note: data.note,

            // Location
            address: data.address,

            // Size
            landRai: data.landSize?.rai ? parseInt(data.landSize.rai) : 0,
            landNgan: data.landSize?.ngan ? parseInt(data.landSize.ngan) : 0,
            landSqWah: data.landSize?.sqWah ? parseFloat(data.landSize.sqWah) : 0,
            usableArea: data.usableArea ? parseFloat(data.usableArea) : null,
            bedroom: data.bedroom ? parseInt(data.bedroom) : 0,
            bathroom: data.bathroom ? parseInt(data.bathroom) : 0,
            floors: data.floors ? parseInt(data.floors) : 0,

            // Owner is implicitly handled by RLS on update, but needed for create
            ownerId: session.user.id,
        };

        // Use transaction to ensure consistency and set RLS context
        const result = await prisma.$transaction(async (tx) => {
            // 1. Set RLS Context
            await tx.$executeRaw`SELECT set_config('app.current_user_id', ${session.user.id}, true)`;

            let property;

            if (data.id) {
                // UPDATE Draft
                property = await tx.property.update({
                    where: { id: data.id },
                    data: {
                        ...propertyData,
                        ownerId: undefined, // Don't allow changing owner
                        version: { increment: 1 } // Optimistic Locking
                    }
                });

                // Clear existing relations to re-add (Simple strategy for now)
                await tx.propertyImage.deleteMany({ where: { propertyId: data.id } });
                await tx.propertyFacility.deleteMany({ where: { propertyId: data.id } });

            } else {
                // CREATE New Draft
                property = await tx.property.create({
                    data: propertyData
                });
            }

            // 2. Insert Images
            if (data.images && data.images.length > 0) {
                await tx.propertyImage.createMany({
                    data: data.images.map((url: string, index: number) => ({
                        propertyId: property.id,
                        url: url,
                        orderIndex: index
                    }))
                });
            }

            // 3. Insert Facilities/Highlights
            const processItems = async (items: string[], type: FacilityType) => {
                if (!items || items.length === 0) return;

                for (const name of items) {
                    const facility = await tx.facility.findFirst({
                        where: { name, type }
                    });

                    if (facility) {
                        await tx.propertyFacility.create({
                            data: {
                                propertyId: property.id,
                                facilityId: facility.id
                            }
                        });
                    }
                }
            };

            await processItems(data.highlights, FacilityType.HIGHLIGHT);
            await processItems(data.facilities, FacilityType.FACILITY);
            await processItems(data.nearbyPlaces, FacilityType.NEARBY);

            return property;
        });

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Error saving property:", error);
        return NextResponse.json({ error: "Failed to save property", details: String(error) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch Single Property for Editing
            const property = await prisma.property.findFirst({
                where: {
                    id: id,
                    ownerId: session.user.id
                },
                include: {
                    images: {
                        orderBy: {
                            orderIndex: 'asc'
                        }
                    },
                    facilities: {
                        include: {
                            facility: true
                        }
                    }
                }
            });

            if (!property) {
                return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
            }

            return NextResponse.json(property);
        }

        // Fetch List of Properties (Dashboard)
        const properties = await prisma.property.findMany({
            where: {
                ownerId: session.user.id,
                status: {
                    not: PropertyStatus.ARCHIVED
                }
            },
            include: {
                images: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    take: 1
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Property ID required" }, { status: 400 });
        }

        // Verify ownership and exists
        const property = await prisma.property.findFirst({
            where: {
                id,
                ownerId: session.user.id
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
        }

        // Soft Delete (Archive) with RLS Context
        await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT set_config('app.current_user_id', ${session.user.id}, true)`;

            await tx.property.update({
                where: { id },
                data: {
                    status: PropertyStatus.ARCHIVED
                }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting property:", error);
        return NextResponse.json({ error: "Failed to delete property", details: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Property ID required" }, { status: 400 });
        }

        const data = await req.json();

        // Verify ownership
        const property = await prisma.property.findFirst({
            where: {
                id,
                ownerId: session.user.id
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
        }

        // Update Status
        if (data.status) {
            await prisma.$transaction(async (tx) => {
                await tx.$executeRaw`SELECT set_config('app.current_user_id', ${session.user.id}, true)`;

                // Validate status enum if possible, or Prisma will throw
                await tx.property.update({
                    where: { id },
                    data: {
                        status: data.status
                    }
                });
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "No update data provided" }, { status: 400 });

    } catch (error: any) {
        console.error("Error updating property:", error);
        return NextResponse.json({ error: "Failed to update property", details: error.message }, { status: 500 });
    }
}

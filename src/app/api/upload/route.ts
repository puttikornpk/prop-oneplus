import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Check for valid Cloudinary credentials
        const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET &&
            !process.env.CLOUDINARY_CLOUD_NAME.includes('your_');

        console.log("Upload Debug:", {
            hasCloudinary,
            NODE_ENV: process.env.NODE_ENV,
            CloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
            ApiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing'
        });

        if (hasCloudinary) {
            // Upload to Cloudinary
            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'property-plus',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            return NextResponse.json({ success: true, url: result.secure_url });
        } else {
            // Fallback to Local Storage (Development Only)
            if (process.env.NODE_ENV === 'production') {
                throw new Error("Cloudinary credentials missing in production");
            }

            const ext = path.extname(file.name) || '.jpg';
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `img-${uniqueSuffix}${ext}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            return NextResponse.json({ success: true, url: `/uploads/${filename}` });
        }
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Upload failed"
        }, { status: 500 });
    }
}

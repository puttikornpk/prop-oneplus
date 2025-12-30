
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from "@/lib/prisma";

// Helper to decode Base64URL
function base64UrlDecode(str: string) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf-8');
}

export async function POST(req: Request) {
    try {
        // Facebook sends signed_request as form parameter
        const formData = await req.formData();
        const signedRequest = formData.get('signed_request') as string;

        if (!signedRequest) {
            return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 });
        }

        const [encodedSig, payload] = signedRequest.split('.');
        const secret = process.env.FACEBOOK_CLIENT_SECRET;

        if (!secret) {
            console.error('FACEBOOK_CLIENT_SECRET not configured');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Decode signature
        const sig = base64UrlDecode(encodedSig);

        // Verify Signature (HMAC SHA-256)
        const expectedSig = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        // Note: Facebook signature in signed_request is raw bytes base64url encoded?
        // Actually, the logic above for `base64UrlDecode` returns string utf-8.
        // But the signature is binary.
        // Let's use a simpler verification if we can, or strict logic.
        // Correct logic:
        // 1. Calculate HMAC-SHA256 of payload using secret.
        // 2. Base64URL encode the result.
        // 3. Compare with encodedSig.

        // Re-implement verification cleanly
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payload);
        const calculatedSig = hmac.digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        if (calculatedSig !== encodedSig) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Decode Payload
        const data = JSON.parse(base64UrlDecode(payload));
        const userId = data.user_id;

        // Generate Confirmation Code
        const confirmationCode = crypto.randomUUID().slice(0, 8).toUpperCase();

        // Find and Archive User
        // We added facebookId to User model
        if (userId) {
            try {
                // @ts-ignore
                const user = await prisma.user.findFirst({
                    where: { facebookId: userId }
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            status: 'ARCHIVED',
                            // We could store the deletion request ID if we had a table
                        }
                    });
                    console.log(`User ${user.id} (FB: ${userId}) archived via deletion callback.`);
                } else {
                    console.log(`Deletion callback for unknown FB user: ${userId}`);
                }
            } catch (err) {
                console.error("Error processing deletion:", err);
            }
        }

        // Return JSON response as required by Facebook
        const url = `${process.env.NEXTAUTH_URL}/privacy/deletion-status?code=${confirmationCode}`;

        return NextResponse.json({
            url: url,
            confirmation_code: confirmationCode
        });

    } catch (error) {
        console.error('Deletion Callback Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

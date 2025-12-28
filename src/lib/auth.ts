import bcrypt from 'bcryptjs';
import prisma from './prisma';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return prisma.session.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });
}

export async function getSession(token: string) {
    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: { include: { profile: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    return session;
}

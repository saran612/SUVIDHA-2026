import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// In production, this must be an environment variable. Using a deterministic key for the prototype.
const SECRET_KEY = crypto.scryptSync(process.env.ADMIN_LOG_SECRET || 'suvidha-admin-secret-key-2026', 'salt', 32);

function encrypt(text: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

    // Encrypt the text
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    // Get Auth tag for tamper-proofing
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const logLine = JSON.stringify(data);

        // Encrypt the log to ensure it is tamper-proof
        const encryptedLine = encrypt(logLine);

        // Write securely to server file system
        const logDir = path.join(process.cwd(), 'secure_logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const filePath = path.join(logDir, 'system.log');
        fs.appendFileSync(filePath, encryptedLine + '\n', 'utf8');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Fast-Path Logger Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

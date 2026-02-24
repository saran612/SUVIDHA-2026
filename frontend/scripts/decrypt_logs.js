const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
// Must match the key used in the backend logging API `/api/logs/route.ts`
const SECRET_KEY = crypto.scryptSync(process.env.ADMIN_LOG_SECRET || 'suvidha-admin-secret-key-2026', 'salt', 32);

function decrypt(encryptedText) {
    try {
        const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');

        if (!ivHex || !authTagHex || !encryptedHex) {
            return '[ERROR: Log line malformed, potential tampering.]';
        }

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        return `[ERROR: DECRYPTION FAILED, TAMPERING THREAT DETECTED. Reason: ${error.message}]`;
    }
}

function processLogs() {
    const logDir = path.join(__dirname, '..', 'secure_logs');
    const logFile = path.join(logDir, 'system.log');

    if (!fs.existsSync(logFile)) {
        console.log(`[!] No secure system logs found at: ${logFile}`);
        process.exit(0);
    }

    const fileData = fs.readFileSync(logFile, 'utf8');
    const lines = fileData.split('\n').filter(line => line.trim().length > 0);

    console.log('======================================================');
    console.log(`       SUVIDHA KIOSK DECRYPTED ADMIN LOGS`);
    console.log(`            Total Entries: ${lines.length}`);
    console.log('======================================================\n');

    lines.forEach((encryptedLine, index) => {
        const plainText = decrypt(encryptedLine.trim());
        try {
            // Prettify JSON if it is parsable
            const parsed = JSON.parse(plainText);
            console.log(`[Entry #${index + 1}] [${parsed.timestamp}] [${parsed.level}] - ${parsed.message}`);
            if (parsed.data) {
                console.log(`    Data:`, parsed.data);
            }
        } catch {
            console.log(`[Entry #${index + 1}] -> ${plainText}`);
        }
    });

    console.log('\n======================================================');
    console.log('                 END OF LOG FILE');
    console.log('======================================================');
}

processLogs();

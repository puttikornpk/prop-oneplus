
import 'dotenv/config';
import { sendVerificationEmail } from './src/lib/email';

async function main() {
    console.log("Testing email sending...");
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);

    const email = "puttikorn.la@gmail.com";
    const username = "DebugUser";
    const code = "999999";

    try {
        console.log(`Sending email to ${email}...`);
        const success = await sendVerificationEmail(email, username, code);
        console.log("Email send result: " + success);
    } catch (error) {
        console.error("DEBUG EMAIL ERROR:");
        console.error(error);
    }
}

main();

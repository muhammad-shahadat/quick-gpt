import { BrevoClient } from '@getbrevo/brevo';
import createHttpError from 'http-errors';


const brevo = new BrevoClient({ 
    apiKey: process.env.BREVO_SMTP_API_KEY,
    timeoutInSeconds: 30,
    maxRetries: 3,
 });

const sendMailWithBrevo = async (mailData) => {

    try {

        console.log("BEFORE SENDMAIL inside 'sendMailWithBrevo' function");
        
        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: mailData.subject,
            htmlContent: mailData.html,
            sender: { name: 'QUICKGPT APP', email: 'ae1b9b001@smtp-brevo.com' },
            to: [{ email: mailData.email, name: mailData.name || 'Dear User' }],
        });

        console.log("AFTER SENDMAIL inside 'sendMailWithBrevo' function");
        console.log('Email sent. Message ID:', result.messageId);
        

    } catch (error) {
        if (error.statusCode) {
            console.error(`Brevo API Error | Status Code: ${error.statusCode} | Message: ${error.message}`);

            if (error.statusCode === 401) {
                console.error('Invalid API key');
                throw createHttpError(401, 'Invalid API key');
            } 
            else if (error.statusCode === 429) {
                const retryAfter = error.rawResponse?.headers?.['retry-after'] || 60;
                console.error(`Rate limited. Retry after ${retryAfter}s`);
                throw createHttpError(429, `Rate limited. Retry after ${retryAfter}s`);
            } 
            else {
                // অন্য কোনো ব্রেভো এপিআই এরর (যেমন: ৪০০ বা ৫০০)
                throw createHttpError(error.statusCode, `API error ${error.statusCode}: ${error.message}`);
            }
        } else {
            // ব্রেভোর বাইরের কোনো নেটওয়ার্ক বা সিস্টেম এরর
            console.error("GENERAL SYSTEM MAIL ERROR:");
            console.error(error);
            throw error;
        }
    }
    
}

export default sendMailWithBrevo;
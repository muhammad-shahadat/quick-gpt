import { 
    BrevoClient, 
    BrevoError,
    UnauthorizedError,
    TooManyRequestsError, 
} from '@getbrevo/brevo';
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
        if (error instanceof UnauthorizedError) {
            console.error('Invalid API key');
            throw createHttpError(401, 'Invalid API key');
        } else if (error instanceof TooManyRequestsError) {
            const retryAfter = error.rawResponse.headers['retry-after'];
            console.error(`Rate limited. Retry after ${retryAfter}s`);
            throw createHttpError(429, `Rate limited. Retry after ${retryAfter}s`);
        } else if (error instanceof BrevoError) {
            console.error(`API error ${error.statusCode}:`, error.message);
            throw createHttpError(error.statusCode, `API error ${error.statusCode}:`, error.message);
            
        }

        console.error("MAIL ERROR:");
        console.error("Error while sending mail", error);
        throw error;
    }
}

export default sendMailWithBrevo;
import nodemailer from "nodemailer";

// ব্রেভোর পার্মানেন্ট SMTP সার্ভার কনফিগারেশন
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // ৫৮৭ পোর্টের জন্য এটি অবশ্যই false হবে
  connectionTimeout: 15000, // ১৫ সেকেন্ড সেফটি টাইমআউট
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.SMTP_USERNAME, // আপনার সেট করা ব্রেভো লগইন আইডি
    pass: process.env.SMTP_PASSWORD, // আপনার সেট করা ব্রেভো মাস্টার পাসওয়ার্ড
  },
});

const emailWithNodemailer = async (mailData) => {
    try {
        const mailOptions = {
            // ব্রেভোর নিয়ম অনুযায়ী "from" ফিল্ডে আপনার ব্রেভোর ইউজার ইমেইলটি থাকা বেস্ট
            from: `"QuickGPT Support" <${process.env.SMTP_USERNAME}>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
        };

        // জ্যাম এড়াতে প্রফেশনাল গাইডলাইন অনুযায়ী verify() সম্পূর্ণ রিমুভ করা হলো
        console.log("BEFORE SENDMAIL inside 'emailWithNodemailer' function");

        const info = await transporter.sendMail(mailOptions);

        console.log("AFTER SENDMAIL inside 'emailWithNodemailer' function");
        console.log("Message sent: %s", info.messageId);
        console.log("Message sent: %s", info.response);

    } catch (error) {
        console.error("MAIL ERROR:");
        console.error("Error while sending mail", error);
        throw error;
    }
}

export default emailWithNodemailer;
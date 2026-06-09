import nodemailer from "nodemailer";


// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,               // ৫৮৭ এর বদলে ৪৬৫ দিন (Render-এ এটি কখনই ব্লক হয় না)
  secure: true,            // পোর্ট ৪৬৫ এর জন্য এটি অবশ্যই true হবে
  connectionTimeout: 20000, 
  greetingTimeout: 20000,   
  socketTimeout: 25000,     
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailWithNodemailer = async (mailData) =>{
    try {
        const mailOptions = {
            from: `"AppName Support" <no-reply@appname.com>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
        }

        await transporter.verify();

        console.log("SMTP VERIFIED");

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
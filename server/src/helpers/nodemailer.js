import nodemailer from "nodemailer";


// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
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

        console.log("BEFORE SENDMAIL");

        const info = await transporter.sendMail(mailOptions);
        console.log("AFTER SENDMAIL");
        console.log("Message sent: %s", info.messageId);
        console.log("Message sent: %s", info.response);

        
    } catch (error) {
        console.error("MAIL ERROR:");
        console.error("Error while sending mail", error);
        throw error;
        
    }
}



export default emailWithNodemailer;

const registrationMail = (email, name, token) => {
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const mailData = {
        email,
        subject: "Activate Your Account — QUICK Gpt", 
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;"> 
            
            <h2 style="color: #4f46e5; text-align: center; font-size: 24px;">Welcome to QUICK Gpt!</h2>     
            
            <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p> 
            
            <p style="font-size: 16px; line-height: 1.6;">
                Thanks for signing up! We are excited to have you. To start using QUICK Gpt, please verify your email address by clicking the button below:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/users/activate?token=${token}" 
                   target="_blank" 
                   style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;"> 
                   Verify My Account 
                </a> 
            </div>

            <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
                <p style="font-size: 14px; color: #9a3412; margin: 0;">
                    <strong>Note for Recruiters:</strong> This application requires a valid email to complete registration. Disposable or dummy emails will not receive this activation link as part of our security and quality measures.
                </p>
            </div>

            <p style="font-size: 13px; color: #666; margin-top: 25px;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${baseUrl}/users/activate?token=${token}" style="color: #4f46e5;">${baseUrl}/users/activate?token=${token}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} AI Gpt Inc. Developed as a professional portfolio project.
            </p> 
        </div>`
    }
    return mailData;
}

export default registrationMail;
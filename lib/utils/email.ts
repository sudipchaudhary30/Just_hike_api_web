import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output
  logger: true // Log information to console
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using nodemailer
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    console.log('Attempting to send email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', to);
    console.log('Subject:', subject);
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP connection verified');
    
    const mailOptions = {
      from: `"Just Hike" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw new Error(error.message || 'Failed to send email');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const subject = 'Reset Your Password - Just Hike';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #059669; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Just Hike</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello!</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;"><a href="${resetLink}">${resetLink}</a></p>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <p>Best regards,<br><strong>The Just Hike Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Just Hike. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, verificationLink: string) {
  const subject = 'Verify Your Email - Just Hike';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #059669; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Just Hike</h1>
            <p>Welcome to Just Hike!</p>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello!</p>
            <p>Thank you for registering with Just Hike. Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;"><a href="${verificationLink}">${verificationLink}</a></p>
            
            <p style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <strong>Important:</strong> This link will expire in 1 hour.
            </p>
            
            <p>If you didn't create an account, please ignore this email.</p>
            
            <p>Best regards,<br><strong>The Just Hike Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Just Hike. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

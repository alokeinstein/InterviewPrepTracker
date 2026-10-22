import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporterInstance: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporterInstance) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }
  return transporterInstance;
}

export interface SendOtpEmailParams {
  toEmail: string;
  otp: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET' | 'EMAIL_VERIFY';
  expiryMinutes?: number;
}

export async function sendOtpEmail({
  toEmail,
  otp,
  purpose,
  expiryMinutes = 10,
}: SendOtpEmailParams): Promise<void> {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@interviewprepos.com';
  const transporter = getTransporter();

  const isReset = purpose === 'PASSWORD_RESET';
  const title = isReset ? 'Reset Your Password' : 'Verify Your Email';
  const actionText = isReset
    ? 'Use the verification code below to reset your Interview Prep OS password.'
    : 'Welcome to Interview Prep OS! Enter the one-time verification code below to complete your account setup.';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
    .container { max-width: 500px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 4px 10px; background: #064e3b; color: #34d399; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; border-radius: 6px; text-transform: uppercase; margin-bottom: 16px; }
    h1 { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #ffffff; }
    p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin: 0 0 24px; }
    .otp-box { background: #1f2937; border: 1px solid #374151; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #10b981; }
    .footer { font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937; padding-top: 16px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Security Verification</span>
    <h1>${title}</h1>
    <p>${actionText}</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="font-size: 12px; color: #9ca3af;">
      This code is valid for <strong>${expiryMinutes} minutes</strong>. If you did not request this code, you can safely ignore this email.
    </p>
    <div class="footer">
      Interview Prep OS &bull; Production Practice &amp; Analytics Platform
    </div>
  </div>
</body>
</html>
`;

  const text = `${title}\n\n${actionText}\n\nVerification Code: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`;

  await transporter.sendMail({
    from: `"Interview Prep OS" <${fromEmail}>`,
    to: toEmail,
    subject: `${otp} is your Interview Prep OS verification code`,
    text,
    html,
  });
}

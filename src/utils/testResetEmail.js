import 'dotenv/config';
import sendEmail from './sendEmail.js';

async function main() {
  const recipientEmail = process.argv[2] || process.env.TEST_EMAIL || 'faheemafasil12@gmail.com';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/admin/reset-password?token=8923bcdef872364&email=${encodeURIComponent(recipientEmail)}`;
  const otpCode = '583920';

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px; margin: 0; color: #142332;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dce6ec; border-radius: 4px; padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <div style="text-align: center; border-bottom: 2px solid #eef3f5; padding-bottom: 18px; margin-bottom: 22px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #071d33; margin: 0;">PAREED FISH TRADING</h1>
      <div style="font-size: 11px; font-weight: 800; color: #b68d40; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 5px;">Security & Account Access</div>
    </div>
    <h2 style="font-size: 19px; color: #071d33; margin-top: 0;">Password Reset Request</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hello <strong>Faheem</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">Click the button below to reset your password:</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" style="background-color: #b68d40; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: bold; text-transform: uppercase; border-radius: 3px; display: inline-block;" target="_blank">Reset Your Password →</a>
    </div>
    <p style="font-size: 13px; color: #475569; margin-top: 20px;">Or copy and paste this link:</p>
    <div style="background-color: #f1f5f9; padding: 12px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; margin-bottom: 20px;">
      <a href="${resetUrl}" style="color: #1976a8; text-decoration: underline;" target="_blank">${resetUrl}</a>
    </div>
    <p style="font-size: 13px; color: #475569;">Verification OTP Code:</p>
    <div style="background-color: #e2e8f0; border-radius: 4px; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 0.25em; color: #071d33; font-family: monospace; margin: 10px 0 20px 0;">
      ${otpCode}
    </div>
  </div>
</div>
  `;

  const res = await sendEmail({
    email: recipientEmail,
    subject: 'Password Reset Request - Pareed Fish Trading',
    message: `Reset your password at: ${resetUrl}\nOTP: ${otpCode}`,
    html,
  });

  console.log(`Dispatched successfully to ${recipientEmail}:`, res);
}

main().catch(console.error);

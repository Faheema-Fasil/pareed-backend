import nodemailer from 'nodemailer';

/**
 * Send an email directly using Nodemailer Gmail service
 *
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Subject line
 * @param {string} options.message - Plain text message
 * @param {string} [options.html] - HTML formatted email body
 */
export const sendEmail = async (options) => {
  const user = (
    process.env.GMAIL_USER ||
    process.env.EMAIL_USER ||
    process.env.FROM_EMAIL ||
    'nfaheema12@gmail.com'
  ).trim();

  const rawPass =
    process.env.GMAIL_APP_PASSWORD ||
    process.env.EMAIL_PASS ||
    process.env.SMTP_PASSWORD ||
    '';

  // Automatically remove spaces from 16-character Google App Passwords
  const pass = rawPass.replace(/\s+/g, '');
  const fromName = process.env.FROM_NAME || 'Pareed Fish Trading';

  if (!user || !pass) {
    console.warn('\n⚠️ [Gmail Service] Gmail credentials not set in .env!');
    console.warn(`[Gmail Service] Recipient: ${options.email}`);
    console.warn(`[Gmail Service] Subject: ${options.subject}`);
    console.warn(`[Gmail Service] Message Body:\n${options.message}\n`);
    return {
      success: false,
      message: 'Gmail credentials not configured in .env',
    };
  }

  // Use direct Gmail service transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${fromName}" <${user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message.replace(/\n/g, '<br/>'),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Gmail Service] Email dispatched successfully to ${options.email}. Message ID: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};

export default sendEmail;

import Inquiry from '../models/inquiry.model.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Submit a new contact inquiry (Public contact form)
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res, next) => {
  try {
    const { name, company, phone, email, business, requirement, message } = req.body;

    if (!name || !company || !phone || !email || !business || !requirement) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      business: business.trim(),
      requirement: requirement.trim(),
      message: message ? message.trim() : '',
    });

    const clientUrl =

      process.env.CLIENT_URL ||
      req.headers.origin ||
      'http://localhost:5173';
    const adminEmail = process.env.GMAIL_USER || process.env.EMAIL_USER || 'nfaheema12@gmail.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' });

    // 1. Send Notification Email to Admin
    const adminHtml = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px; margin: 0; color: #142332;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #dce6ec; border-radius: 4px; padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <div style="text-align: center; border-bottom: 2px solid #eef3f5; padding-bottom: 18px; margin-bottom: 22px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #071d33; margin: 0;">PAREED FISH TRADING</h1>
      <div style="font-size: 11px; font-weight: 800; color: #b68d40; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 5px;">New Commercial Lead Alert</div>
    </div>

    <div style="background-color: #eef3f5; border-left: 4px solid #b68d40; padding: 14px 18px; border-radius: 2px; margin-bottom: 22px;">
      <span style="font-size: 14px; font-weight: bold; color: #071d33;"> You received a new inquiry from ${company}!</span>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 35%;">Contact Name:</td>
        <td style="padding: 10px 0; color: #071d33; font-weight: bold;">${name}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Company Name:</td>
        <td style="padding: 10px 0; color: #071d33; font-weight: bold;">${company}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone Number:</td>
        <td style="padding: 10px 0; color: #071d33;"><a href="tel:${phone}" style="color: #1976a8; font-weight: bold; text-decoration: none;">${phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email Address:</td>
        <td style="padding: 10px 0; color: #071d33;"><a href="mailto:${email}" style="color: #1976a8; font-weight: bold; text-decoration: none;">${email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Business Type:</td>
        <td style="padding: 10px 0; color: #071d33;"><span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 2px; font-weight: bold; font-size: 12px;">${business}</span></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Requirement:</td>
        <td style="padding: 10px 0; color: #071d33;"><span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 2px; font-weight: bold; font-size: 12px;">${requirement}</span></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #64748b; font-weight: bold; vertical-align: top;">Message:</td>
        <td style="padding: 10px 0; color: #1e293b; line-height: 1.5; background: #f8fafc; padding: 12px; border-radius: 4px; font-style: italic;">"${message || 'No additional message provided.'}"</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 25px 0 10px 0;">
      <a href="${clientUrl}/admin/dashboard/inquiries" style="background-color: #071d33; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 3px; display: inline-block;" target="_blank">View Lead in Admin Dashboard →</a>
    </div>

    <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #eef3f5; padding-top: 14px;">
      Received on ${submittedAt} (UAE Time) via Pareed Website Contact Form
    </div>
  </div>
</div>
    `;

    // 2. Send Professional Confirmation Email to the Customer
    const customerHtml = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px; margin: 0; color: #142332;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dce6ec; border-radius: 4px; padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <div style="text-align: center; border-bottom: 2px solid #eef3f5; padding-bottom: 18px; margin-bottom: 22px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #071d33; margin: 0;">PAREED FISH TRADING</h1>
      <div style="font-size: 11px; font-weight: 800; color: #b68d40; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 5px;">Commercial Seafood Supply &bull; Established 1990</div>
    </div>

    <h2 style="font-size: 18px; color: #071d33; margin-top: 0;">Thank you for your enquiry, ${name}!</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">We have successfully received your commercial supply inquiry for <strong>${company}</strong> regarding <strong>${requirement}</strong>.</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">Our commercial sales team is reviewing your requirements and will contact you directly via phone (<span style="font-weight: bold; color: #071d33;">${phone}</span>) or email shortly.</p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 16px; margin: 22px 0;">
      <div style="font-size: 12px; font-weight: bold; color: #b68d40; text-transform: uppercase; margin-bottom: 8px;">Direct Assistance:</div>
      <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6;">
         <strong>Phone / WhatsApp:</strong> +971 50 181 1875 / +971 50 602 7334<br/>
         <strong>Email:</strong> info@pareedfishtrading.com<br/>
         <strong>Location:</strong> Waterfront Market, Dubai, UAE
      </p>
    </div>

    <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #eef3f5; padding-top: 14px;">
      &copy; ${new Date().getFullYear()} Pareed Fish Trading L.L.C. All rights reserved.
    </div>
  </div>
</div>
    `;

    // Dispatch both emails in background (so request returns immediately without delay)
    Promise.allSettled([
      sendEmail({
        email: adminEmail,
        subject: ` New Commercial Seafood Inquiry: ${company} (${name})`,
        message: `New inquiry received from ${name} (${company}) for ${requirement}. Phone: ${phone}, Email: ${email}`,
        html: adminHtml,
      }),
      sendEmail({
        email: inquiry.email,
        subject: `Thank you for contacting Pareed Fish Trading LLC`,
        message: `Dear ${name}, thank you for your enquiry regarding ${requirement}. Our commercial team will contact you shortly.`,
        html: customerHtml,
      }),
    ]).catch((err) => console.error('[Inquiry Email Notification Error]:', err));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries / leads
 * @route   GET /api/inquiries
 * @access  Private/Admin
 */
export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single inquiry details
 * @route   GET /api/inquiries/:id
 * @access  Private/Admin
 */
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }
    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update inquiry status or notes
 * @route   PUT /api/inquiries/:id
 * @access  Private/Admin
 */
export const updateInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { returnDocument: 'after', runValidators: true }
    );

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private/Admin
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

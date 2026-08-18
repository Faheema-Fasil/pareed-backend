import User from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || '',
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Forgot Password Request - Generate Token & Send Email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide your registered email address');
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      // Return 200 to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: `If an account exists with ${email}, a password reset link has been dispatched.`,
      });
    }

    // Generate random 20-byte token and 6-digit OTP
    const rawToken = crypto.randomBytes(20).toString('hex');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token to store in database
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Set token & 15-minute expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Client URL (Frontend URL from env or request origin)
    const clientUrl =
  
      process.env.CLIENT_URL ||
      req.headers.origin ||
      req.headers.referer?.replace(/\/$/, '') ||
      'http://localhost:5173';

    const resetUrl = `${clientUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    const message = `
You requested a password reset for your Pareed Fish Trading administrator account.

Please use the following link to reset your password (valid for 15 minutes):
${resetUrl}

Your 6-Digit Verification Code: ${otpCode}

If you did not request this email, please safely ignore it.
    `.trim();

    const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px; margin: 0; color: #142332;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dce6ec; border-radius: 4px; padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    
    <div style="text-align: center; border-bottom: 2px solid #eef3f5; padding-bottom: 18px; margin-bottom: 22px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #071d33; margin: 0; letter-spacing: 0.05em;">PAREED FISH TRADING</h1>
      <div style="font-size: 11px; font-weight: 800; color: #b68d40; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 5px;">Security &amp; Account Access</div>
    </div>

    <h2 style="font-size: 19px; color: #071d33; margin-top: 0;">Password Reset Request</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hello <strong>${user.name || 'Administrator'}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">We received a request to reset the password for your account associated with <strong>${user.email}</strong>.</p>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" style="background-color: #b68d40; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 3px; display: inline-block;" target="_blank">Reset Your Password →</a>
    </div>

    <p style="font-size: 13px; color: #475569; margin-top: 20px;">If the button above does not work, copy and paste this link into your browser:</p>
    <div style="background-color: #f1f5f9; padding: 12px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; color: #0f172a; margin-bottom: 20px;">
      <a href="${resetUrl}" style="color: #1976a8; text-decoration: underline;" target="_blank">${resetUrl}</a>
    </div>

    <p style="font-size: 13px; color: #475569; margin-top: 20px;">Or use your 6-digit OTP code:</p>
    <div style="background-color: #e2e8f0; border-radius: 4px; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 0.25em; color: #071d33; font-family: monospace; margin: 10px 0 20px 0;">
      ${otpCode}
    </div>

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">This link and code are valid for <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>

    <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 26px; border-top: 1px solid #eef3f5; padding-top: 16px;">
      &copy; ${new Date().getFullYear()} Pareed Fish Trading L.L.C. All rights reserved.<br/>
      Waterfront Market, Dubai, United Arab Emirates
    </div>
  </div>
</div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - Pareed Fish Trading',
        message,
        html,
      });

      res.status(200).json({
        success: true,
        message: `If an account exists with ${email}, a password reset link has been dispatched.`,
      });
    } catch (err) {
      console.error('[Forgot Password Email Error]:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error('Email delivery failed. Please check SMTP configuration.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with Token or Email
 * @route   POST /api/auth/reset-password, POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword, password } = req.body;
    const rawToken = token || req.params.token;
    const targetPassword = newPassword || password;

    if (!targetPassword) {
      res.status(400);
      throw new Error('Please provide a new password');
    }

    if (targetPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    let user = null;

    if (rawToken) {
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      }).select('+password');
    }

    // Fallback: If no token or matching token, check if valid email was provided
    if (!user && email) {
      user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    }

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    // Set new password
    user.password = targetPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send security notification email to user
    const changedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' });
    const notificationHtml = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px; margin: 0; color: #142332;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dce6ec; border-radius: 4px; padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <div style="text-align: center; border-bottom: 2px solid #eef3f5; padding-bottom: 18px; margin-bottom: 22px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #071d33; margin: 0;">PAREED FISH TRADING</h1>
      <div style="font-size: 11px; font-weight: 800; color: #b68d40; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 5px;">Security Notification</div>
    </div>

    <h2 style="font-size: 18px; color: #071d33; margin-top: 0;">Password Successfully Changed ✓</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hello <strong>${user.name || 'Administrator'}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">This email confirms that the password for your account (<strong>${user.email}</strong>) was successfully reset and updated on <strong>${changedAt} (UAE Time)</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 14px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #334155;">You can now log in to the administrative portal using your new credentials.</p>
    </div>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; border-radius: 2px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: bold;">⚠️ Did not perform this action?</p>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #b91c1c;">If you did not reset your password, please contact the system administrator immediately to secure your account.</p>
    </div>

    <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #eef3f5; padding-top: 14px;">
      &copy; ${new Date().getFullYear()} Pareed Fish Trading L.L.C. All rights reserved.
    </div>
  </div>
</div>
    `;

    sendEmail({
      email: user.email,
      subject: 'Security Alert: Password Changed - Pareed Fish Trading',
      message: `Your Pareed Fish Trading account password was successfully changed on ${changedAt}. If you did not make this change, please contact support immediately.`,
      html: notificationHtml,
    }).catch((err) => console.error('[Password Reset Email Notification Error]:', err));

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

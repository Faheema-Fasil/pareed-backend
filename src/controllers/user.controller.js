import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

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

/**
 * @desc    Update user profile (Name, Email, Avatar, Password)
 * @route   PUT /api/users/profile, PUT /api/auth/profile, PUT /api/auth/me, PUT /api/auth/updatedetails
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.profileImage !== undefined) user.avatar = req.body.profileImage;

    // Handle password change if provided in profile payload
    if (req.body.newPassword || req.body.password) {
      const newPassword = req.body.newPassword || req.body.password;
      if (req.body.currentPassword) {
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
          res.status(400);
          throw new Error('Current password is incorrect');
        }
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/users/password, PUT /api/auth/updatepassword
 * @access  Private
 */
export const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, password } = req.body;
    const targetPassword = newPassword || password;

    if (!targetPassword) {
      res.status(400);
      throw new Error('Please provide a new password');
    }

    if (targetPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400);
        throw new Error('Current password does not match');
      }
    }

    user.password = targetPassword;
    await user.save();

    // Send security confirmation email
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
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">The password for your administrator account (<strong>${user.email}</strong>) was successfully updated on <strong>${changedAt} (UAE Time)</strong>.</p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; border-radius: 2px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: bold;">⚠️ Did not perform this action?</p>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #b91c1c;">If you did not make this change, please reset your password immediately or contact support.</p>
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
      message: `Your Pareed Fish Trading account password was updated on ${changedAt}. If you did not make this change, please reset your password immediately.`,
      html: notificationHtml,
    }).catch((err) => console.error('[User Password Change Notification Error]:', err));

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

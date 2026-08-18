import User from '../models/user.model.js';

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

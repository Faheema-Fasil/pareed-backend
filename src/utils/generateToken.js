import jwt from 'jsonwebtoken';

/**
 * Generate JSON Web Token (JWT)
 * @param {string} userId - User identifier
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Validation helpers
 */
const validators = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  /**
   * Validate if ID is valid MongoDB ObjectId
   */
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  /**
   * Sanitize user data (remove sensitive fields)
   */
  sanitizeUser: (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
  },
};

module.exports = validators;

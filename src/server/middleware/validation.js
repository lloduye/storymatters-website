const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email format'
    });
  }

  // Validate password
  if (password.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 8 characters long'
    });
  }

  // Validate name
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      status: 'error',
      message: 'Name must be at least 2 characters long'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin
}; 
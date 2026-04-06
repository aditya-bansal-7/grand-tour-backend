const authService = require('../services/auth.service');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const user = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
};

module.exports = {
  register,
  login,
  getMe
};

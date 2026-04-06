import { Request, Response } from 'express';
import authService from '../services/auth.service';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  const user = await authService.getUserProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
};

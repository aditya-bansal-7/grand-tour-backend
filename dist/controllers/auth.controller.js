"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.getMe = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const user = await auth_service_1.default.registerUser(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
};
exports.register = register;
// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const user = await auth_service_1.default.loginUser(req.body);
    res.status(200).json({
        success: true,
        data: user
    });
};
exports.login = login;
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const user = await auth_service_1.default.getUserProfile(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};
exports.getMe = getMe;
// @desc    Authenticate via Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const user = await auth_service_1.default.googleLoginUser(req.body);
    res.status(200).json({
        success: true,
        data: user
    });
};
exports.googleLogin = googleLogin;

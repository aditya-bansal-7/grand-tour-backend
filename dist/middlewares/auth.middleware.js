"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const requireAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Get user from the token (exclude password)
            const user = await db_1.prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                }
            });
            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};
exports.requireAuth = requireAuth;
// Role-based access control
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }
        // Always allow SUPER_ADMIN to bypass specific role checks
        if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) {
            return next();
        }
        res.status(403);
        throw new Error(`Forbidden: User role ${req.user.role} is not authorized to access this route.`);
    };
};
exports.restrictTo = restrictTo;

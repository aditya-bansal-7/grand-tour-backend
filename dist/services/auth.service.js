"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate JWT Token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
class AuthService {
    async registerUser(userData) {
        const { email, password, firstName, lastName, profileImage, role } = userData;
        // Check if user already exists
        const userExists = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = await db_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                profileImage: profileImage || null,
                password: hashedPassword,
                role: role || 'STUDENT'
            }
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            role: user.role,
            token: generateToken(user.id)
        };
    }
    async loginUser(credentials) {
        const { email, password } = credentials;
        // Find the user
        const user = await db_1.prisma.user.findUnique({
            where: { email }
        });
        // Check password
        if (user?.password && await bcryptjs_1.default.compare(password, user.password)) {
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
                role: user.role,
                token: generateToken(user.id)
            };
        }
        else {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
    }
    async getUserProfile(userId) {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true,
                createdAt: true
            }
        });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
    async googleLoginUser(userData) {
        const { email, firstName, lastName, profileImage } = userData;
        // Check if user already exists
        let user = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            // Create user without password
            user = await db_1.prisma.user.create({
                data: {
                    firstName: firstName || 'User',
                    lastName: lastName || '',
                    profileImage: profileImage || null,
                    email,
                    role: 'STUDENT'
                }
            });
        }
        else if (profileImage && !user.profileImage) {
            // Opt: update the user with image if missing
            user = await db_1.prisma.user.update({
                where: { email },
                data: { profileImage }
            });
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            role: user.role,
            token: generateToken(user.id)
        };
    }
}
exports.default = new AuthService();

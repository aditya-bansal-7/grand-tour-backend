"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    async getAllUsers() {
        return await db_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateUserRole(id, role) {
        return await db_1.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
    async createUser(userData) {
        const { email, password, firstName, lastName, role, whatsapp, dateOfBirth, address, city, state, pincode } = userData;
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        return await db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role,
                whatsapp,
                dateOfBirth,
                address,
                city,
                state,
                pincode,
            },
        });
    }
    async updateUser(id, data) {
        return await db_1.prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                profileImage: data.profileImage,
                whatsapp: data.whatsapp,
                dateOfBirth: data.dateOfBirth,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
            },
        });
    }
    async deleteUser(id) {
        return await db_1.prisma.user.delete({
            where: { id },
        });
    }
}
exports.default = new UserService();

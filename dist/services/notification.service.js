"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class NotificationService {
    async notify(userId, title, message, type = 'INFO') {
        return await db_1.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type
            }
        });
    }
    async getNotifications(userId) {
        return await db_1.prisma.notification.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async markAsRead(id) {
        return await db_1.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }
    async markAllAsRead(userId) {
        return await db_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }
}
exports.default = new NotificationService();

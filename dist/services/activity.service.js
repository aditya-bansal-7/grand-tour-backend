"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class ActivityService {
    async log(description, type, applicationId, userId) {
        return await db_1.prisma.activityLog.create({
            data: {
                description,
                type,
                applicationId,
                userId
            }
        });
    }
    async getRecentActivity(limit = 20) {
        return await db_1.prisma.activityLog.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                application: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
    }
}
exports.default = new ActivityService();

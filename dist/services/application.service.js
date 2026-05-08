"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class ApplicationService {
    async createApplication(data) {
        return await db_1.prisma.application.upsert({
            where: { userId: data.userId },
            update: {
                status: data.status,
                currentStepId: data.currentStepId,
                notes: data.notes,
                data: data.data,
                payment1Id: data.payment1Id || (data.payment1?.id),
                payment2Id: data.payment2Id || (data.payment2?.id),
            },
            create: {
                userId: data.userId,
                status: data.status || 'DRAFT',
                currentStepId: data.currentStepId || 'application',
                notes: data.notes,
                data: data.data || {},
                payment1Id: data.payment1Id || (data.payment1?.id),
                payment2Id: data.payment2Id || (data.payment2?.id),
            },
            include: {
                user: true,
                payment1: true,
                payment2: true,
            },
        });
    }
    async updateApplication(id, data) {
        return await db_1.prisma.application.update({
            where: { id },
            data: {
                status: data.status,
                currentStepId: data.currentStepId,
                notes: data.notes,
                data: data.data,
                payment1Id: data.payment1Id || (data.payment1?.id),
                payment2Id: data.payment2Id || (data.payment2?.id),
            },
            include: {
                user: true,
                payment1: true,
                payment2: true,
            }
        });
    }
    async getAllApplications() {
        return await db_1.prisma.application.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    }
                },
                interviews: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateApplicationStatus(id, status) {
        return await db_1.prisma.application.update({
            where: { id },
            data: { status },
        });
    }
    async updateApplicationCurrentStep(id, currentStepId) {
        return await db_1.prisma.application.update({
            where: { id },
            data: { currentStepId },
        });
    }
    async updateApplicationNotes(id, notes) {
        return await db_1.prisma.application.update({
            where: { id },
            data: { notes },
        });
    }
    async updateApplicationStep(id, currentStepId) {
        return await db_1.prisma.application.update({
            where: { id },
            data: { currentStepId },
        });
    }
    async getApplicationByUserId(userId) {
        return await db_1.prisma.application.findFirst({
            where: { userId },
            include: {
                user: true,
                interviews: {
                    orderBy: { scheduledAt: 'desc' },
                    take: 1
                },
                documents: true,
                activities: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
    }
    async deleteApplication(id) {
        return await db_1.prisma.application.delete({
            where: { id },
        });
    }
}
exports.default = new ApplicationService();

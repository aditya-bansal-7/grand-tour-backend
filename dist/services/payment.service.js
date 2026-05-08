"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const client_1 = require("@prisma/client");
class PaymentService {
    async createPayment(data) {
        return await db_1.prisma.payment.create({
            data: {
                userId: data.userId,
                applicationId: data.applicationId,
                amount: data.amount,
                description: data.description,
                utrNumber: data.utrNumber,
                screenshotUrl: data.screenshotUrl,
                status: client_1.PaymentStatus.PENDING,
            },
        });
    }
    async getAllPayments() {
        return await db_1.prisma.payment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updatePaymentStatus(id, status) {
        return await db_1.prisma.payment.update({
            where: { id },
            data: { status },
            include: {
                user: true,
            },
        });
    }
}
exports.default = new PaymentService();

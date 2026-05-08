"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class AnalyticsService {
    async getDashboardStats() {
        const [totalCandidates, pendingApplications, acceptedApplications, totalRevenue, recentApplications] = await Promise.all([
            db_1.prisma.application.count(),
            db_1.prisma.application.count({ where: { status: 'PENDING' } }),
            db_1.prisma.application.count({ where: { status: 'ACCEPTED' } }),
            db_1.prisma.payment.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true }
            }),
            db_1.prisma.application.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            })
        ]);
        // Conversion rate (Acceptance rate)
        const conversionRate = totalCandidates > 0
            ? Math.round((acceptedApplications / totalCandidates) * 100)
            : 0;
        return {
            stats: {
                totalCandidates,
                pendingApplications,
                acceptedApplications,
                totalRevenue: totalRevenue._sum.amount || 0,
                conversionRate
            },
            recentApplications
        };
    }
    async getWorkflowStats() {
        // Count applications per status
        const stats = await db_1.prisma.application.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });
        return stats.map(s => ({
            status: s.status,
            count: s._count.id
        }));
    }
}
exports.default = new AnalyticsService();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class InterviewService {
    async getAllInterviews() {
        return await db_1.prisma.interview.findMany({
            include: {
                application: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                    }
                },
                interviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        role: true,
                    }
                }
            },
            orderBy: {
                scheduledAt: 'asc',
            },
        });
    }
    async scheduleInterview(data) {
        const { applicationId, interviewerId, scheduledAt, locationUrl, notes } = data;
        return await db_1.prisma.interview.create({
            data: {
                applicationId,
                interviewerId,
                scheduledAt: new Date(scheduledAt),
                locationUrl,
                notes,
            }
        });
    }
    async getInterviewByUserId(userId) {
        return await db_1.prisma.interview.findFirst({
            where: {
                application: {
                    userId: userId
                }
            },
            include: {
                interviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        profileImage: true
                    }
                }
            },
            orderBy: {
                scheduledAt: 'desc'
            }
        });
    }
    async deleteInterview(id) {
        return await db_1.prisma.interview.delete({
            where: { id },
        });
    }
}
exports.default = new InterviewService();

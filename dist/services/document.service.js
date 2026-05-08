"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class DocumentService {
    async getAllDocuments() {
        return await db_1.prisma.document.findMany({
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getDocumentById(id) {
        return await db_1.prisma.document.findUnique({
            where: { id },
            include: {
                application: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
    async createDocument(data) {
        return await db_1.prisma.document.create({
            data
        });
    }
    async updateDocumentStatus(id, status, remarks, reviewedBy) {
        return await db_1.prisma.document.update({
            where: { id },
            data: {
                status,
                remarks,
                reviewedBy,
                reviewedAt: new Date()
            }
        });
    }
    async deleteDocument(id) {
        return await db_1.prisma.document.delete({
            where: { id }
        });
    }
}
exports.default = new DocumentService();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelService = void 0;
const db_1 = require("../config/db");
class HotelService {
    async getAllHotels() {
        return db_1.prisma.hotel.findMany({
            include: {
                _count: {
                    select: { assignments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createHotel(data) {
        return db_1.prisma.hotel.create({
            data
        });
    }
    async updateHotel(id, data) {
        return db_1.prisma.hotel.update({
            where: { id },
            data
        });
    }
    async deleteHotel(id) {
        return db_1.prisma.hotel.delete({
            where: { id }
        });
    }
    async getCandidatesAtHotelStep() {
        // Candidates who have payment1 approved and haven't been assigned a hotel yet
        // Or we can just look for candidates whose currentStepId is 'hotel'
        return db_1.prisma.application.findMany({
            where: {
                currentStepId: 'hotel',
                hotelAssignment: null
            },
            include: {
                user: true
            }
        });
    }
    async assignHotel(data) {
        console.log('Assigning hotel with data:', data);
        const assignment = await db_1.prisma.hotelAssignment.create({
            data: {
                hotelId: data.hotelId,
                applicationId: data.applicationId,
                checkIn: data.checkIn,
                checkOut: data.checkOut
            },
            include: {
                hotel: true,
                application: {
                    include: {
                        user: true
                    }
                }
            }
        });
        console.log('Assignment created successfully:', assignment.id);
        // Automatically move to next step after hotel assignment
        await db_1.prisma.application.update({
            where: { id: data.applicationId },
            data: { currentStepId: 'contract' }
        });
        return assignment;
    }
    async getAssignmentByApplicationId(applicationId) {
        return db_1.prisma.hotelAssignment.findUnique({
            where: { applicationId },
            include: { hotel: true }
        });
    }
}
exports.HotelService = HotelService;
exports.default = new HotelService();

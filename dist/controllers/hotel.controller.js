"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAssignment = exports.assignHotel = exports.getCandidatesAtHotelStep = exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotels = void 0;
const hotel_service_1 = __importDefault(require("../services/hotel.service"));
const activity_service_1 = __importDefault(require("../services/activity.service"));
const notification_service_1 = __importDefault(require("../services/notification.service"));
const application_service_1 = __importDefault(require("../services/application.service"));
const getHotels = async (req, res) => {
    const hotels = await hotel_service_1.default.getAllHotels();
    res.status(200).json({ success: true, data: hotels });
};
exports.getHotels = getHotels;
const createHotel = async (req, res) => {
    const { name, location, proposalPdf } = req.body;
    const hotel = await hotel_service_1.default.createHotel({ name, location, proposalPdf });
    res.status(201).json({ success: true, data: hotel });
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    const { id } = req.params;
    const hotel = await hotel_service_1.default.updateHotel(id, req.body);
    res.status(200).json({ success: true, data: hotel });
};
exports.updateHotel = updateHotel;
const deleteHotel = async (req, res) => {
    const { id } = req.params;
    await hotel_service_1.default.deleteHotel(id);
    res.status(200).json({ success: true, message: 'Hotel deleted' });
};
exports.deleteHotel = deleteHotel;
const getCandidatesAtHotelStep = async (req, res) => {
    const candidates = await hotel_service_1.default.getCandidatesAtHotelStep();
    res.status(200).json({ success: true, data: candidates });
};
exports.getCandidatesAtHotelStep = getCandidatesAtHotelStep;
const assignHotel = async (req, res) => {
    const { hotelId, applicationId, checkIn, checkOut } = req.body;
    const assignment = await hotel_service_1.default.assignHotel({
        hotelId,
        applicationId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
    });
    // Log activity
    await activity_service_1.default.log(`Hotel assigned: ${assignment.hotel.name} to ${assignment.application.user.firstName}`, 'HOTEL_ASSIGNED', applicationId, req.user?.id);
    // Notify candidate
    await notification_service_1.default.notify(assignment.application.userId, 'Hotel Assigned', `You have been assigned to ${assignment.hotel.name}. Please check your dashboard for details.`, 'SUCCESS');
    // Automatically move to next step?
    // Let's check the workflow to see what the next step is.
    // For now, let's just return the assignment.
    res.status(201).json({ success: true, data: assignment });
};
exports.assignHotel = assignHotel;
const getMyAssignment = async (req, res) => {
    const userId = req.user?.id;
    const application = await application_service_1.default.getApplicationByUserId(userId);
    if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
    }
    const assignment = await hotel_service_1.default.getAssignmentByApplicationId(application.id);
    res.status(200).json({ success: true, data: assignment });
};
exports.getMyAssignment = getMyAssignment;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvePayment = exports.getPayments = exports.submitPayment = void 0;
const payment_service_1 = __importDefault(require("../services/payment.service"));
const activity_service_1 = __importDefault(require("../services/activity.service"));
const notification_service_1 = __importDefault(require("../services/notification.service"));
const db_1 = require("../config/db");
const submitPayment = async (req, res) => {
    const userId = req.user?.id;
    const { amount, description, utrNumber, screenshotUrl } = req.body;
    const application = await db_1.prisma.application.findUnique({
        where: { userId }
    });
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }
    const payment = await payment_service_1.default.createPayment({
        userId,
        applicationId: application.id,
        amount: parseFloat(amount),
        description,
        utrNumber,
        screenshotUrl,
    });
    // Log activity
    await activity_service_1.default.log(`Payment submitted: ₹${amount} (UTR: ${utrNumber})`, 'PAYMENT_SUBMITTED', undefined, userId);
    res.status(201).json({
        success: true,
        data: payment,
    });
};
exports.submitPayment = submitPayment;
const getPayments = async (req, res) => {
    const payments = await payment_service_1.default.getAllPayments();
    res.status(200).json({
        success: true,
        data: payments,
    });
};
exports.getPayments = getPayments;
const approvePayment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // COMPLETED or FAILED
    const payment = await payment_service_1.default.updatePaymentStatus(id, status);
    // Log activity
    await activity_service_1.default.log(`Payment ${status.toLowerCase()}: ₹${payment.amount}`, 'PAYMENT_UPDATE', undefined, req.user?.id);
    // Notify user
    await notification_service_1.default.notify(payment.userId, 'Payment Update', `Your payment of ₹${payment.amount} has been ${status === 'COMPLETED' ? 'approved' : 'rejected'}.`, status === 'COMPLETED' ? 'SUCCESS' : 'ERROR');
    // If payment is completed, move application to hotel step
    if (status === 'COMPLETED') {
        const application = await db_1.prisma.application.findFirst({
            where: { userId: payment.userId }
        });
        if (application) {
            await db_1.prisma.application.update({
                where: { id: application.id },
                data: { currentStepId: 'hotel' }
            });
            await activity_service_1.default.log('Application moved to Hotel Allocation step', 'APPLICATION_MOVE', application.id, req.user?.id);
        }
    }
    res.status(200).json({
        success: true,
        data: payment,
    });
};
exports.approvePayment = approvePayment;

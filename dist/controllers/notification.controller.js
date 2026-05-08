"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.markRead = exports.getNotifications = void 0;
const notification_service_1 = __importDefault(require("../services/notification.service"));
const getNotifications = async (req, res) => {
    const userId = req.user.id;
    const notifications = await notification_service_1.default.getNotifications(userId);
    res.status(200).json({
        success: true,
        data: notifications
    });
};
exports.getNotifications = getNotifications;
const markRead = async (req, res) => {
    const { id } = req.params;
    await notification_service_1.default.markAsRead(id);
    res.status(200).json({
        success: true,
        message: 'Notification marked as read'
    });
};
exports.markRead = markRead;
const markAllRead = async (req, res) => {
    const userId = req.user.id;
    await notification_service_1.default.markAllAsRead(userId);
    res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
    });
};
exports.markAllRead = markAllRead;

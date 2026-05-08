"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = void 0;
const activity_service_1 = __importDefault(require("../services/activity.service"));
const getActivities = async (req, res) => {
    const activities = await activity_service_1.default.getRecentActivity();
    res.status(200).json({
        success: true,
        data: activities
    });
};
exports.getActivities = getActivities;

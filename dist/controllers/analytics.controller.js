"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowStats = exports.getDashboardStats = void 0;
const analytics_service_1 = __importDefault(require("../services/analytics.service"));
const getDashboardStats = async (req, res) => {
    const stats = await analytics_service_1.default.getDashboardStats();
    res.status(200).json({
        success: true,
        data: stats
    });
};
exports.getDashboardStats = getDashboardStats;
const getWorkflowStats = async (req, res) => {
    const stats = await analytics_service_1.default.getWorkflowStats();
    res.status(200).json({
        success: true,
        data: stats
    });
};
exports.getWorkflowStats = getWorkflowStats;

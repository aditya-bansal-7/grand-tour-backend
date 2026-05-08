"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkflow = exports.getWorkflow = void 0;
const workflow_service_1 = __importDefault(require("../services/workflow.service"));
const getWorkflow = async (req, res) => {
    const workflow = await workflow_service_1.default.getWorkflow();
    res.status(200).json({
        success: true,
        data: workflow
    });
};
exports.getWorkflow = getWorkflow;
const updateWorkflow = async (req, res) => {
    const workflow = await workflow_service_1.default.updateWorkflow(req.body);
    res.status(200).json({
        success: true,
        data: workflow
    });
};
exports.updateWorkflow = updateWorkflow;

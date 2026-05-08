"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateStep = exports.updateNotes = exports.updateStatus = exports.getMyApplication = exports.getApplications = exports.updateApplication = exports.createApplication = void 0;
const application_service_1 = __importDefault(require("../services/application.service"));
const activity_service_1 = __importDefault(require("../services/activity.service"));
const notification_service_1 = __importDefault(require("../services/notification.service"));
const workflow_service_1 = __importDefault(require("../services/workflow.service"));
const createApplication = async (req, res) => {
    const userId = req.user?.id;
    const application = await application_service_1.default.createApplication({ ...req.body, userId });
    res.status(201).json({
        success: true,
        data: application
    });
};
exports.createApplication = createApplication;
const updateApplication = async (req, res) => {
    const { id } = req.params;
    const application = await application_service_1.default.updateApplication(id, req.body);
    res.status(200).json({
        success: true,
        data: application
    });
};
exports.updateApplication = updateApplication;
const getApplications = async (req, res) => {
    const applications = await application_service_1.default.getAllApplications();
    res.status(200).json({
        success: true,
        data: applications
    });
};
exports.getApplications = getApplications;
const getMyApplication = async (req, res) => {
    const userId = req.user?.id;
    const application = await application_service_1.default.getApplicationByUserId(userId);
    res.status(200).json({
        success: true,
        data: application
    });
};
exports.getMyApplication = getMyApplication;
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const application = await application_service_1.default.updateApplicationStatus(id, status);
    // Log activity
    await activity_service_1.default.log(`Application status updated to ${status}`, 'STATUS_UPDATE', id, req.user?.id);
    if (status === "ACCEPTED") {
        // update to next step 
        const workflow = await workflow_service_1.default.getWorkflow();
        const steps = workflow?.steps || [];
        const currentStepIdx = steps.findIndex((step) => step.id === application.currentStepId);
        if (currentStepIdx !== -1 && currentStepIdx < steps.length - 1) {
            const nextStepId = steps[currentStepIdx + 1].id;
            await application_service_1.default.updateApplicationCurrentStep(id, nextStepId);
        }
    }
    // Notify user
    await notification_service_1.default.notify(application.userId, 'Application Update', `Your application status has been updated to ${status}.`, 'INFO');
    res.status(200).json({
        success: true,
        data: application
    });
};
exports.updateStatus = updateStatus;
const updateNotes = async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    const application = await application_service_1.default.updateApplicationNotes(id, notes);
    res.status(200).json({
        success: true,
        data: application
    });
};
exports.updateNotes = updateNotes;
const updateStep = async (req, res) => {
    const { id } = req.params;
    const { currentStepId } = req.body;
    const application = await application_service_1.default.updateApplicationStep(id, currentStepId);
    // Log activity
    await activity_service_1.default.log(`Moved to workflow step: ${currentStepId}`, 'STEP_UPDATE', id, req.user?.id);
    res.status(200).json({
        success: true,
        data: application
    });
};
exports.updateStep = updateStep;
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    await application_service_1.default.deleteApplication(id);
    res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
    });
};
exports.deleteApplication = deleteApplication;

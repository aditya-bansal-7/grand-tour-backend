"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Application Routes
router.use(auth_middleware_1.requireAuth);
router.get('/my', application_controller_1.getMyApplication);
router.get('/', application_controller_1.getApplications);
router.post('/', application_controller_1.createApplication);
router.patch('/:id', application_controller_1.updateApplication);
router.patch('/:id/status', application_controller_1.updateStatus);
router.patch('/:id/notes', application_controller_1.updateNotes);
router.patch('/:id/step', application_controller_1.updateStep);
router.delete('/:id', application_controller_1.deleteApplication);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workflow_controller_1 = require("../controllers/workflow.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Publicly readable by authenticated users, but only editable by ADMIN
router.use(auth_middleware_1.requireAuth);
router.get('/', workflow_controller_1.getWorkflow);
router.put('/', (0, auth_middleware_1.restrictTo)('ADMIN'), workflow_controller_1.updateWorkflow);
exports.default = router;

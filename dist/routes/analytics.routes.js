"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_middleware_1.requireAuth, analytics_controller_1.getDashboardStats);
router.get('/workflow', auth_middleware_1.requireAuth, analytics_controller_1.getWorkflowStats);
exports.default = router;

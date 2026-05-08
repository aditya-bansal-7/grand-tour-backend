"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// Auth Routes
router.post('/register', (0, auth_validator_1.validate)(auth_validator_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, auth_validator_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
router.post('/google', auth_controller_1.googleLogin);
router.get('/me', auth_middleware_1.requireAuth, auth_controller_1.getMe);
exports.default = router;

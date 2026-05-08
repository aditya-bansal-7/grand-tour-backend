"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("../controllers/permission.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.requireAuth, permission_controller_1.getPermissions);
router.put('/:role', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('SUPER_ADMIN'), permission_controller_1.updatePermission);
exports.default = router;

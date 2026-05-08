"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// User Routes - Only accessible by ADMIN
router.use(auth_middleware_1.requireAuth);
router.use((0, auth_middleware_1.restrictTo)('ADMIN'));
router.get('/', user_controller_1.getUsers);
router.post('/', user_controller_1.createUser);
router.patch('/:id/role', user_controller_1.updateUserRole);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;

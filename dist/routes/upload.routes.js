"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const cloudinary_config_1 = require("../config/cloudinary.config");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// @route   POST /api/upload
// @desc    Upload a single file (Image, Video, or PDF)
// @access  Private (Requires authentication)
router.post('/', auth_middleware_1.requireAuth, cloudinary_config_1.upload.single('file'), upload_controller_1.uploadFile);
// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post('/multiple', auth_middleware_1.requireAuth, cloudinary_config_1.upload.array('files', 10), upload_controller_1.uploadMultipleFiles);
exports.default = router;

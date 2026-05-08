"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleFiles = exports.uploadFile = void 0;
// @desc    Upload a single file (Image, Video, or PDF)
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }
    // req.file is populated by multer-storage-cloudinary
    const file = req.file;
    res.status(200).json({
        success: true,
        data: {
            url: file.path || file.secure_url,
            public_id: file.filename || file.public_id,
            format: file.format,
            resource_type: file.resource_type,
            original_name: file.originalname,
            size: file.size,
        }
    });
};
exports.uploadFile = uploadFile;
// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
const uploadMultipleFiles = async (req, res) => {
    if (!req.files || !req.files.length) {
        res.status(400);
        throw new Error('No files uploaded');
    }
    const files = req.files.map(file => ({
        url: file.path || file.secure_url,
        public_id: file.filename || file.public_id,
        format: file.format,
        resource_type: file.resource_type,
        original_name: file.originalname,
        size: file.size,
    }));
    res.status(200).json({
        success: true,
        data: files
    });
};
exports.uploadMultipleFiles = uploadMultipleFiles;

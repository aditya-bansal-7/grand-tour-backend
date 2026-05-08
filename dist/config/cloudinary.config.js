"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Storage Engine
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const fileType = file.mimetype.split('/')[0];
        const resourceType = file.mimetype === 'application/pdf' ? 'raw' :
            fileType === 'video' ? 'video' : 'image';
        return {
            folder: 'grand-tour/uploads',
            resource_type: resourceType,
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4', 'mov', 'avi'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    }
});
exports.default = cloudinary_1.v2;

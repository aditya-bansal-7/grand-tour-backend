"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().min(2).max(50),
    lastName: joi_1.default.string().required().min(2).max(50),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('STUDENT', 'TEAM', 'ADMIN', 'SUPER_ADMIN', 'TEAM_MEMBER', 'MARKETING', 'HR').optional()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
// Middleware to validate requests against a schema
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            res.status(400);
            throw new Error(`Validation Error: ${errorMessage}`);
        }
        next();
    };
};
exports.validate = validate;

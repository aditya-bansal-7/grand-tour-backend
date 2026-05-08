"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../utils/logger"));
exports.prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        logger_1.default.info('Database connection successfully established via Prisma');
    }
    catch (error) {
        logger_1.default.error('Failed to connect to the database', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
